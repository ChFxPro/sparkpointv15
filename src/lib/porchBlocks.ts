// BackPorch post bodies are an ordered list of blocks (porch_posts.blocks, jsonb).
//
// Everything that renders blocks first runs them through normalizeBlocks(), which
// keeps only known block types with well-formed fields. Blocks are written by
// signed-in editors, but the page treats them as untrusted anyway: no HTML is ever
// taken from a block, links must be https, media paths must be paths in our own
// bucket, and embeds are only YouTube or Vimeo ids. A malformed block is dropped,
// never half-rendered.

export interface MediaRef {
  path: string;
  alt: string;
  caption?: string;
}

/** How far a block reaches: the text column, wider than it, or edge to edge. */
export type Frame = 'column' | 'wide' | 'bleed';

/** A link's own preview, fetched when the link was added; `image` is our stored copy. */
export interface LinkSnippet {
  title?: string;
  description?: string;
  site?: string;
  image?: string;
}

export interface CounterItem {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

export interface ScrollyStep {
  text: string;
  image: MediaRef;
}

export interface TimelineItem {
  date: string;
  title: string;
  text?: string;
}

export type PorchBlock = (
  | { id: string; type: 'text'; text: string }
  | ({ id: string; type: 'image' } & MediaRef)
  | { id: string; type: 'gallery'; images: MediaRef[] }
  | { id: string; type: 'video'; path: string; poster?: string; caption?: string; duration?: number }
  | { id: string; type: 'embed'; provider: 'youtube' | 'vimeo'; videoId: string; title?: string; caption?: string }
  | { id: string; type: 'audio'; path: string; title?: string; caption?: string; duration?: number }
  | { id: string; type: 'quote'; text: string; cite?: string }
  | { id: string; type: 'link'; url: string; label: string; note?: string; preview?: LinkSnippet }
  | { id: string; type: 'place'; name: string; address?: string }
  | { id: string; type: 'file'; path: string; label: string; size?: number }
  | { id: string; type: 'experiment'; experiment: string }
  // ── Porch Lab tools (src/lib/porchLab.ts sets each one's stage) ──
  | { id: string; type: 'motionText'; text: string; effect: 'type' | 'light'; size: 'large' | 'huge' }
  | { id: string; type: 'backdrop'; scene: 'sunrise' | 'fireflies' | 'ridges'; heading?: string; sub?: string }
  | { id: string; type: 'counter'; items: CounterItem[] }
  | { id: string; type: 'beforeAfter'; before: MediaRef; after: MediaRef; beforeLabel?: string; afterLabel?: string }
  | { id: string; type: 'scrolly'; steps: ScrollyStep[] }
  | { id: string; type: 'timeline'; items: TimelineItem[] }
  | { id: string; type: 'poll'; question: string; options: string[] }
) & { frame?: Frame };

export type BlockType = PorchBlock['type'];

export const BLOCK_LABELS: Record<BlockType, string> = {
  text: 'Text',
  image: 'Photo',
  gallery: 'Gallery',
  video: 'Video clip',
  embed: 'YouTube or Vimeo',
  audio: 'Audio',
  quote: 'Quote',
  link: 'Link',
  place: 'Place',
  file: 'File',
  experiment: 'Experiment',
  motionText: 'Animated text',
  backdrop: 'Living backdrop',
  counter: 'Count-up numbers',
  beforeAfter: 'Before & after',
  scrolly: 'Scrolly story',
  timeline: 'Timeline',
  poll: 'Quick poll',
};

export const BLOCK_LIMITS = {
  blocks: 40,
  text: 4000,
  caption: 300,
  alt: 300,
  galleryImages: 24,
  short: 120,
  videoSeconds: 60,
};

// Media lives in the porch-media bucket under these prefixes.
const MEDIA_PATH = /^[a-z0-9][a-z0-9/_.-]{0,200}$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const str = (v: unknown, max: number): string | undefined =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined;
// Our own static files under /assets/ are allowed too (used by local preview posts).
const SITE_ASSET = /^\/assets\/[A-Za-z0-9/_. -]{1,200}$/;
const path = (v: unknown): string | undefined =>
  typeof v === 'string' && (MEDIA_PATH.test(v) || SITE_ASSET.test(v)) && !v.includes('..') ? v : undefined;
const https = (v: unknown): string | undefined => {
  if (typeof v !== 'string') return undefined;
  try {
    const u = new URL(v.trim());
    return u.protocol === 'https:' ? u.toString() : undefined;
  } catch {
    return undefined;
  }
};
const num = (v: unknown): number | undefined => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : undefined);

function media(v: unknown): MediaRef | null {
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  const p = path(o.path);
  if (!p) return null;
  // Alt text is required on save; an image without one renders as decorative.
  return { path: p, alt: str(o.alt, BLOCK_LIMITS.alt) ?? '', caption: str(o.caption, BLOCK_LIMITS.caption) };
}

/** Keep only well-formed blocks. Safe to call on anything. */
export function normalizeBlocks(input: unknown): PorchBlock[] {
  if (!Array.isArray(input)) return [];
  const out: PorchBlock[] = [];
  for (const raw of input.slice(0, BLOCK_LIMITS.blocks)) {
    if (!raw || typeof raw !== 'object') continue;
    const b = raw as Record<string, unknown>;
    const id = typeof b.id === 'string' && b.id ? b.id.slice(0, 40) : `b${out.length}`;
    const frame: Frame | undefined = b.frame === 'wide' || b.frame === 'bleed' ? b.frame : undefined;
    const before = out.length;
    switch (b.type) {
      case 'text': {
        const text = str(b.text, BLOCK_LIMITS.text);
        if (text) out.push({ id, type: 'text', text });
        break;
      }
      case 'image': {
        const m = media(b);
        if (m) out.push({ id, type: 'image', ...m });
        break;
      }
      case 'gallery': {
        const images = Array.isArray(b.images)
          ? b.images.map(media).filter((m): m is MediaRef => m !== null).slice(0, BLOCK_LIMITS.galleryImages)
          : [];
        if (images.length) out.push({ id, type: 'gallery', images });
        break;
      }
      case 'video': {
        const p = path(b.path);
        if (p) out.push({ id, type: 'video', path: p, poster: path(b.poster), caption: str(b.caption, BLOCK_LIMITS.caption), duration: num(b.duration) });
        break;
      }
      case 'embed': {
        const provider = b.provider === 'youtube' || b.provider === 'vimeo' ? b.provider : null;
        const videoId = typeof b.videoId === 'string' ? b.videoId : '';
        const ok = provider === 'youtube' ? /^[A-Za-z0-9_-]{11}$/.test(videoId) : /^\d{6,12}$/.test(videoId);
        if (provider && ok) {
          out.push({ id, type: 'embed', provider, videoId, title: str(b.title, BLOCK_LIMITS.short), caption: str(b.caption, BLOCK_LIMITS.caption) });
        }
        break;
      }
      case 'audio': {
        const p = path(b.path);
        if (p) out.push({ id, type: 'audio', path: p, title: str(b.title, BLOCK_LIMITS.short), caption: str(b.caption, BLOCK_LIMITS.caption), duration: num(b.duration) });
        break;
      }
      case 'quote': {
        const text = str(b.text, 600);
        if (text) out.push({ id, type: 'quote', text, cite: str(b.cite, BLOCK_LIMITS.short) });
        break;
      }
      case 'link': {
        const url = https(b.url);
        if (url) {
          const pv = (b.preview && typeof b.preview === 'object' ? b.preview : null) as Record<string, unknown> | null;
          const preview: LinkSnippet | undefined = pv
            ? { title: str(pv.title, BLOCK_LIMITS.short), description: str(pv.description, 300), site: str(pv.site, 80), image: path(pv.image) }
            : undefined;
          out.push({
            id,
            type: 'link',
            url,
            label: str(b.label, BLOCK_LIMITS.short) ?? new URL(url).hostname,
            note: str(b.note, BLOCK_LIMITS.caption),
            ...(preview && (preview.title || preview.image) ? { preview } : {}),
          });
        }
        break;
      }
      case 'place': {
        const name = str(b.name, BLOCK_LIMITS.short);
        if (name) out.push({ id, type: 'place', name, address: str(b.address, 200) });
        break;
      }
      case 'file': {
        const p = path(b.path);
        if (p) out.push({ id, type: 'file', path: p, label: str(b.label, BLOCK_LIMITS.short) ?? 'Download', size: num(b.size) });
        break;
      }
      case 'experiment': {
        const experiment = typeof b.experiment === 'string' && SLUG.test(b.experiment) ? b.experiment : null;
        if (experiment) out.push({ id, type: 'experiment', experiment });
        break;
      }
      case 'motionText': {
        const text = str(b.text, 280);
        if (text) {
          out.push({
            id,
            type: 'motionText',
            text,
            effect: b.effect === 'light' ? 'light' : 'type',
            size: b.size === 'huge' ? 'huge' : 'large',
          });
        }
        break;
      }
      case 'backdrop': {
        const scene = b.scene === 'fireflies' || b.scene === 'ridges' ? b.scene : 'sunrise';
        out.push({ id, type: 'backdrop', scene, heading: str(b.heading, BLOCK_LIMITS.short), sub: str(b.sub, 200) });
        break;
      }
      case 'counter': {
        const items = Array.isArray(b.items)
          ? b.items
              .map((x): CounterItem | null => {
                const o = (x ?? {}) as Record<string, unknown>;
                const value = typeof o.value === 'number' && Number.isFinite(o.value) ? o.value : NaN;
                const label = str(o.label, BLOCK_LIMITS.short);
                return Number.isFinite(value) && label
                  ? { value, label, prefix: str(o.prefix, 4), suffix: str(o.suffix, 8) }
                  : null;
              })
              .filter((x): x is CounterItem => x !== null)
              .slice(0, 4)
          : [];
        if (items.length) out.push({ id, type: 'counter', items });
        break;
      }
      case 'beforeAfter': {
        const b1 = media(b.before);
        const a1 = media(b.after);
        if (b1 && a1) {
          out.push({ id, type: 'beforeAfter', before: b1, after: a1, beforeLabel: str(b.beforeLabel, 40), afterLabel: str(b.afterLabel, 40) });
        }
        break;
      }
      case 'scrolly': {
        const steps = Array.isArray(b.steps)
          ? b.steps
              .map((x): ScrollyStep | null => {
                const o = (x ?? {}) as Record<string, unknown>;
                const image = media(o.image);
                const text = str(o.text, 600);
                return image && text ? { text, image } : null;
              })
              .filter((x): x is ScrollyStep => x !== null)
              .slice(0, 8)
          : [];
        if (steps.length) out.push({ id, type: 'scrolly', steps });
        break;
      }
      case 'timeline': {
        const items = Array.isArray(b.items)
          ? b.items
              .map((x): TimelineItem | null => {
                const o = (x ?? {}) as Record<string, unknown>;
                const date = str(o.date, 40);
                const title = str(o.title, BLOCK_LIMITS.short);
                return date && title ? { date, title, text: str(o.text, 400) } : null;
              })
              .filter((x): x is TimelineItem => x !== null)
              .slice(0, 20)
          : [];
        if (items.length) out.push({ id, type: 'timeline', items });
        break;
      }
      case 'poll': {
        const question = str(b.question, 200);
        const options = Array.isArray(b.options)
          ? b.options.map((o) => str(o, 80)).filter((o): o is string => !!o).slice(0, 5)
          : [];
        if (question && options.length >= 2) out.push({ id, type: 'poll', question, options });
        break;
      }
      default:
        break;
    }
    if (frame && out.length > before) out[out.length - 1].frame = frame;
  }
  return out;
}

/** A YouTube or Vimeo link to an embed block's provider and id, or null. */
export function parseVideoLink(url: string): { provider: 'youtube' | 'vimeo'; videoId: string } | null {
  let u: URL;
  try {
    u = new URL(url.trim());
  } catch {
    return null;
  }
  const host = u.hostname.replace(/^www\.|^m\./, '');
  if (host === 'youtu.be') {
    const id = u.pathname.slice(1, 12);
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? { provider: 'youtube', videoId: id } : null;
  }
  if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const id = u.searchParams.get('v') ?? u.pathname.match(/^\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})/)?.[1] ?? '';
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? { provider: 'youtube', videoId: id } : null;
  }
  if (host === 'vimeo.com' || host === 'player.vimeo.com') {
    const id = u.pathname.match(/(\d{6,12})/)?.[1] ?? '';
    return id ? { provider: 'vimeo', videoId: id } : null;
  }
  return null;
}

/** All images in a post's blocks, in order (for the Facebook kit and cover fallback). */
export function blockImages(blocks: PorchBlock[]): MediaRef[] {
  return blocks.flatMap((b) =>
    b.type === 'image'
      ? [b]
      : b.type === 'gallery'
        ? b.images
        : b.type === 'beforeAfter'
          ? [b.after, b.before]
          : b.type === 'scrolly'
            ? b.steps.map((s) => s.image)
            : [],
  );
}

export function newBlockId(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** "1:05" */
export function clockDuration(seconds?: number): string | null {
  if (seconds === undefined) return null;
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * The image that stands for a post when no cover was chosen: the first photo in
 * the post, or, if it has no photos, the first link's preview image (owner,
 * 2026-10-16). Returns the link too, so the post page can make that image open it.
 */
export function coverFallback(blocks: PorchBlock[]): { img: MediaRef; link?: { url: string; site?: string } } | null {
  const photo = blockImages(blocks)[0];
  if (photo) return { img: photo };
  for (const b of blocks) {
    if (b.type === 'link' && b.preview?.image) {
      const site = b.preview.site ?? new URL(b.url).hostname.replace(/^www\./, '');
      const title = b.preview.title ?? b.label;
      return { img: { path: b.preview.image, alt: `Preview image from ${site}: ${title}` }, link: { url: b.url, site } };
    }
  }
  return null;
}

/** The Link block whose preview image is this path, if any (so a cover can open it). */
export function linkForImage(blocks: PorchBlock[], path: string | null): Extract<PorchBlock, { type: 'link' }> | null {
  if (!path) return null;
  for (const b of blocks) if (b.type === 'link' && b.preview?.image === path) return b;
  return null;
}
