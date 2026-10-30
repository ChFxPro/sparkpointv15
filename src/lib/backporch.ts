// The BackPorch: SparkPoint's own feed (docs/backporch/SPEC.md).
//
// Posts live in the Supabase table `porch_posts`. Every build bakes the
// published ones into src/data/backporch.generated.json (scripts/backporch/bake.mjs)
// so pages prerender with real content; in the browser the same pages then
// refresh from Supabase, so a post published a minute ago shows up before the
// next deploy.
import type { FeedHints } from './porchFeed';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { normalizeBlocks, type PorchBlock } from './porchBlocks';

export type PorchKind = 'news' | 'gathering' | 'ask' | 'story';
export type PorchStatus = 'draft' | 'published' | 'archived';

/** Porch Lab: how a post presents itself. */
export type Mood = 'dusk' | 'sunrise' | 'forest' | 'plum';
export interface Presentation {
  layout?: 'standard' | 'takeover';
  mood?: Mood;
  reactions?: boolean;
  /** Set on save from a takeover's opening backdrop, so feed lists (which don't load blocks) can draw it. */
  scene?: 'sunrise' | 'fireflies' | 'ridges';
  /** Posts sharing a series id collapse into one card in the feed (e.g. Echoes from the Community). */
  series?: { id: string; name: string; about?: string };
  /** An ask's "time to do it" line, e.g. "About five minutes · anonymous". */
  doIt?: string;
  /** How the cover sits in its frames; absent means fill, centred. */
  cover?: CoverFrame;
}

/**
 * How a cover photo sits in the fixed-shape frames lists and the post page use.
 * `fill` crops to the frame around a focal point (x, y in percent of the photo);
 * `whole` fits the entire photo inside the frame over a blurred copy of itself,
 * for flyers and other portrait images that mustn't be cropped.
 */
export interface CoverFrame {
  fit: 'fill' | 'whole';
  x: number;
  y: number;
}

export const CENTRED: CoverFrame = { fit: 'fill', x: 50, y: 50 };

const pct = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? Math.round(Math.min(100, Math.max(0, v))) : 50);

export function normalizeCoverFrame(v: unknown): CoverFrame | undefined {
  if (!v || typeof v !== 'object') return undefined;
  const c = v as Record<string, unknown>;
  const frame: CoverFrame = { fit: c.fit === 'whole' ? 'whole' : 'fill', x: pct(c.x), y: pct(c.y) };
  // The default is stored as nothing, so untouched posts stay as they were.
  return frame.fit === 'fill' && frame.x === 50 && frame.y === 50 ? undefined : frame;
}

/** Inline style for a cover <img>: its focal point, or nothing for the default. */
export function coverImgStyle(frame: CoverFrame | undefined): { objectPosition?: string } | undefined {
  if (!frame || frame.fit === 'whole') return undefined;
  return { objectPosition: `${frame.x}% ${frame.y}%` };
}

const SERIES_ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const text = (v: unknown, max: number) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined);

export function normalizePresentation(v: unknown): Presentation {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  return {
    layout: o.layout === 'takeover' ? 'takeover' : 'standard',
    mood: o.mood === 'sunrise' || o.mood === 'forest' || o.mood === 'plum' ? o.mood : 'dusk',
    reactions: o.reactions === true,
    scene: o.scene === 'sunrise' || o.scene === 'fireflies' || o.scene === 'ridges' ? o.scene : undefined,
    series: (() => {
      const s = (o.series && typeof o.series === 'object' ? o.series : null) as Record<string, unknown> | null;
      const id = typeof s?.id === 'string' && SERIES_ID.test(s.id) ? s.id.slice(0, 40) : undefined;
      const name = text(s?.name, 80);
      return id && name ? { id, name, about: text(s?.about, 200) } : undefined;
    })(),
    doIt: text(o.doIt, 80),
    cover: normalizeCoverFrame(o.cover),
  };
}

export interface PorchPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  blocks: PorchBlock[];
  presentation: Presentation;
  kind: PorchKind;
  org: string;
  image_path: string | null;
  image_alt: string | null;
  link_url: string | null;
  link_label: string | null;
  event_start: string | null;
  event_end: string | null;
  event_place: string | null;
  /** Feed summary of the blocks (gallery, video, quote), baked at build time; see porchFeed.ts. */
  hints?: FeedHints;
  pinned: boolean;
  /** When it was pinned (set by the database). The most recent pin leads. */
  pinned_at?: string | null;
  status: PorchStatus;
  published_at: string | null;
  expires_at: string | null;
  updated_at: string;
}

// Columns the public pages need. created_by stays out of public reads.
// Lists skip `blocks`, which can be large and lists never show.
export const PORCH_LIST_COLUMNS =
  'id, slug, title, summary, presentation, kind, org, image_path, image_alt, link_url, link_label, event_start, event_end, event_place, pinned, pinned_at, status, published_at, expires_at, updated_at';
export const PORCH_PUBLIC_COLUMNS =
  'id, slug, title, summary, blocks, presentation, kind, org, image_path, image_alt, link_url, link_label, event_start, event_end, event_place, pinned, pinned_at, status, published_at, expires_at, updated_at';

export const PORCH_BUCKET = 'porch-media';
export const IMAGE_WIDTHS = [480, 960, 1600] as const;
const SIZED = /-\d+\.(webp|jpg)$/;
export const PORCH_PATH = '/backporch';
export const SHORT_PATH = '/p';
export const SITE_HOST = 'yoursparkpoint.org';

export const KIND_LABELS: Record<PorchKind, string> = {
  news: 'News',
  gathering: 'Gathering',
  ask: 'Ask',
  story: 'Story',
};

export const KIND_FILTERS: { id: PorchKind | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'news', label: 'News' },
  { id: 'gathering', label: 'Gatherings' },
  { id: 'ask', label: 'Asks' },
  { id: 'story', label: 'Stories' },
];

export const LIMITS = { title: 90, summary: 280, imageAlt: 300, linkLabel: 40, place: 120 };

export function porchImageUrl(path: string | null, width?: number): string | null {
  if (!path) return null;
  // Full URLs and site paths pass through (local preview fixtures only; the database
  // only accepts bucket paths).
  if (/^(https:\/\/|\/)/.test(path)) return path;
  const base = `https://${projectId}.supabase.co/storage/v1/object/public/${PORCH_BUCKET}/`;
  // Images are resized to fixed widths at upload time (src/pages/backporch/porchImages.ts)
  // and stored side by side as <name>-<width>.<webp|jpg>. Other paths are used as is.
  if (width && SIZED.test(path)) return base + path.replace(SIZED, `-${width}.$1`);
  return base + path;
}

/** Public URL for any file in the bucket (video, audio, PDF, posters). */
export function porchMediaUrl(path: string): string {
  if (/^(https:\/\/|\/)/.test(path)) return path;
  return `https://${projectId}.supabase.co/storage/v1/object/public/${PORCH_BUCKET}/${path}`;
}

export function porchImageSrcSet(path: string | null): string | undefined {
  // Site files (local preview posts) aren't stored as 480/960/1600 sets, so no srcset.
  if (!path || path.startsWith('/') || !SIZED.test(path)) return undefined;
  return IMAGE_WIDTHS.map((w) => `${porchImageUrl(path, w)} ${w}w`).join(', ');
}

export const postPath = (slug: string) => `${PORCH_PATH}/${slug}`;
export const shortPath = (slug: string) => `${SHORT_PATH}/${slug}`;
export const shortAddress = (slug: string) => `${SITE_HOST}${shortPath(slug)}`;

/** Published, past its publish time, and not expired: the posts lists show. */
export function isListed(post: PorchPost, now = Date.now()): boolean {
  if (post.status !== 'published' || !post.published_at) return false;
  if (Date.parse(post.published_at) > now) return false;
  if (post.expires_at && Date.parse(post.expires_at) <= now) return false;
  return true;
}

/** At most this many posts are pinned at once (enforced in the database). */
export const MAX_PINS = 3;

/** Pinned first, most recently pinned leading, then newest first. */
export function sortPosts(posts: PorchPost[]): PorchPost[] {
  return [...posts].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    if (a.pinned && b.pinned) {
      const byPin = Date.parse(b.pinned_at ?? '') - Date.parse(a.pinned_at ?? '');
      if (byPin) return byPin;
    }
    return Date.parse(b.published_at ?? '') - Date.parse(a.published_at ?? '');
  });
}

const TZ = 'America/New_York';

/** "Thursday, October 1" (adds the year when it isn't this year). */
export function longDate(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const sameYear = d.toLocaleString('en-US', { timeZone: TZ, year: 'numeric' }) ===
    now.toLocaleString('en-US', { timeZone: TZ, year: 'numeric' });
  return d.toLocaleDateString('en-US', {
    timeZone: TZ,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  });
}

/** "Oct 1" */
export function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { timeZone: TZ, month: 'short', day: 'numeric' });
}

/** "6 p.m." / "6:30 p.m." in Eastern time, AP style. */
export function clockTime(iso: string): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit', hour12: true })
    .formatToParts(new Date(iso));
  const hour = parts.find((p) => p.type === 'hour')?.value ?? '';
  const minute = parts.find((p) => p.type === 'minute')?.value ?? '00';
  const period = (parts.find((p) => p.type === 'dayPeriod')?.value ?? '').toLowerCase().startsWith('p') ? 'p.m.' : 'a.m.';
  return `${hour}${minute === '00' ? '' : `:${minute}`} ${period}`;
}

/** Month and day for a gathering's date chip. */
export function dateChip(iso: string): { month: string; day: string } {
  const d = new Date(iso);
  return {
    month: d.toLocaleDateString('en-US', { timeZone: TZ, month: 'short' }),
    day: d.toLocaleDateString('en-US', { timeZone: TZ, day: 'numeric' }),
  };
}

/** Body text to paragraphs. Plain text only: blank lines split paragraphs. */
export function bodyParagraphs(body: string): string[] {
  return body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
}

// Public reads go straight to the database's REST API with the public key, rather
// than through supabase-js, so the homepage and post pages don't ship that library.
// The key only sees what RLS shows the public: published posts past their time.
const REST = `https://${projectId}.supabase.co/rest/v1`;
const PUBLIC_HEADERS = { apikey: publicAnonKey, Authorization: `Bearer ${publicAnonKey}` };

async function rest<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${REST}/${path}`, { ...init, headers: { ...PUBLIC_HEADERS, ...init?.headers } });
  if (!res.ok) throw new Error(`BackPorch read failed (${res.status})`);
  return res.json() as Promise<T>;
}

/** A public database function (polls, reactions). Mirrors supabase.rpc's { data, error }. */
export async function porchRpc<T>(name: string, args: Record<string, unknown>): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await rest<T>(`rpc/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

/** Only what the lists show: published, past its time, not expired. */
const listedFilter = () => {
  const now = new Date().toISOString();
  return `status=eq.published&published_at=lte.${now}&or=(expires_at.is.null,expires_at.gt.${now})`;
};

export async function fetchPublishedPosts(): Promise<PorchPost[]> {
  const rows = await rest<PorchPost[]>(
    `porch_posts?select=${PORCH_LIST_COLUMNS.replace(/\s+/g, '')}&${listedFilter()}&order=published_at.desc&limit=100`,
  );
  return rows.map(withBlocks);
}

export async function fetchPublishedPost(slug: string): Promise<PorchPost | null> {
  const rows = await rest<PorchPost[]>(
    `porch_posts?select=${PORCH_PUBLIC_COLUMNS.replace(/\s+/g, '')}&slug=eq.${encodeURIComponent(slug)}&${listedFilter()}&limit=1`,
  );
  return rows[0] ? withBlocks(rows[0]) : null;
}

/** Rows straight from the database or the bake: make sure blocks are safe to render. */
export function withBlocks(post: PorchPost): PorchPost {
  return { ...post, blocks: normalizeBlocks(post.blocks), presentation: normalizePresentation(post.presentation) };
}

