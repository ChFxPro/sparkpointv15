// The BackPorch: SparkPoint's own feed (docs/backporch/SPEC.md).
//
// Posts live in the Supabase table `porch_posts`. Every build bakes the
// published ones into src/data/backporch.generated.json (scripts/backporch/bake.mjs)
// so pages prerender with real content; in the browser the same pages then
// refresh from Supabase, so a post published a minute ago shows up before the
// next deploy.
import { supabase } from './supabaseClient';
import { projectId } from '../utils/supabase/info';
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
}

export function normalizePresentation(v: unknown): Presentation {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  return {
    layout: o.layout === 'takeover' ? 'takeover' : 'standard',
    mood: o.mood === 'sunrise' || o.mood === 'forest' || o.mood === 'plum' ? o.mood : 'dusk',
    reactions: o.reactions === true,
    scene: o.scene === 'sunrise' || o.scene === 'fireflies' || o.scene === 'ridges' ? o.scene : undefined,
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
  if (!path || !SIZED.test(path)) return undefined;
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

export async function fetchPublishedPosts(): Promise<PorchPost[]> {
  const query = (columns: string) =>
    supabase
      .from('porch_posts')
      .select(columns)
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(100);
  const { data, error } = await query(PORCH_LIST_COLUMNS);
  if (error) throw error;
  return ((data ?? []) as unknown as PorchPost[]).map(withBlocks);
}

/** Rows straight from the database or the bake: make sure blocks are safe to render. */
export function withBlocks(post: PorchPost): PorchPost {
  return { ...post, blocks: normalizeBlocks(post.blocks), presentation: normalizePresentation(post.presentation) };
}

export async function fetchPublishedPost(slug: string): Promise<PorchPost | null> {
  const query = (columns: string) =>
    supabase.from('porch_posts').select(columns).eq('slug', slug).eq('status', 'published').maybeSingle();
  const { data, error } = await query(PORCH_PUBLIC_COLUMNS);
  if (error) throw error;
  return data ? withBlocks(data as unknown as PorchPost) : null;
}
