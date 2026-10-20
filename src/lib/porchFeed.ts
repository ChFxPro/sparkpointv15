// The /backporch feed as a porch bulletin board: each kind of post gets its own
// shape (docs/backporch/SPEC.md, "The feed"). This module is the pure part: what
// goes where, in what order, and the small date and calendar helpers. The
// components in src/pages/backporch/feed/ draw it. No React and no Supabase here.
import type { PorchKind, PorchPost } from './backporch';
import type { PorchBlock } from './porchBlocks';

// ── Feed hints ─────────────────────────────────────────────────
// Lists load posts without their blocks, but a few shapes need a little of them:
// a gallery's first photos, a video to play, a quote for a series card. The build
// bakes these hints into the index (scripts/backporch/bake.mjs has a copy of
// feedHints; keep the two in step), and the live refresh keeps a post's baked hints.

export interface FeedHints {
  gallery?: { images: { path: string; alt: string }[]; total: number };
  embed?: { provider: 'youtube' | 'vimeo'; videoId: string; title?: string };
  quote?: { text: string; cite?: string };
}

export function feedHints(blocks: PorchBlock[]): FeedHints {
  const hints: FeedHints = {};
  const gallery = blocks.find((b) => b.type === 'gallery');
  if (gallery?.type === 'gallery' && gallery.images.length) {
    hints.gallery = { images: gallery.images.slice(0, 3).map(({ path, alt }) => ({ path, alt })), total: gallery.images.length };
  }
  const embed = blocks.find((b) => b.type === 'embed');
  if (embed?.type === 'embed') hints.embed = { provider: embed.provider, videoId: embed.videoId, title: embed.title };
  const quote = blocks.find((b) => b.type === 'quote');
  if (quote?.type === 'quote') hints.quote = { text: quote.text, cite: quote.cite };
  return hints;
}

// ── Eastern time ───────────────────────────────────────────────

const TZ = 'America/New_York';
const PARTS = new Intl.DateTimeFormat('en-US', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric' });

/** The Eastern calendar day of an instant, as a day count (so days can be subtracted). */
function easternDay(ms: number): number {
  const p = Object.fromEntries(PARTS.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return Date.UTC(+p.year, +p.month - 1, +p.day) / 86_400_000;
}

/** "Today", "Tomorrow", "In 16 days"; null once the day has passed. */
export function timeUntil(iso: string, now = Date.now()): string | null {
  const days = easternDay(Date.parse(iso)) - easternDay(now);
  if (days < 0) return null;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  return `In ${days} days`;
}

const fmt = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', { timeZone: TZ, ...o });
const WEEKDAY = fmt({ weekday: 'long' });
const MONTH_YEAR = fmt({ month: 'long', year: 'numeric' });
const MONTH_KEY = fmt({ year: 'numeric', month: '2-digit' });
const SHORT_MONTH_YEAR = fmt({ month: 'short', year: 'numeric' });
const MONTH_DAY = fmt({ month: 'short', day: 'numeric' });

/** "10 a.m.", "6:30 p.m." in Eastern time, SparkPoint style. */
export function easternClock(iso: string): string {
  const s = fmt({ hour: 'numeric', minute: '2-digit' }).format(new Date(iso));
  return s.replace(':00', '').replace(' AM', ' a.m.').replace(' PM', ' p.m.');
}

/** "Thursday · 10 a.m." for a ticket. */
export function weekdayAndTime(iso: string): string {
  return `${WEEKDAY.format(new Date(iso))} · ${easternClock(iso)}`;
}

export const monthLabel = (iso: string) => MONTH_YEAR.format(new Date(iso)); // "October 2026"
export const shortMonthYear = (iso: string) => SHORT_MONTH_YEAR.format(new Date(iso)); // "Mar 2025"
export const monthDay = (iso: string) => MONTH_DAY.format(new Date(iso)); // "Oct 1"
const monthKey = (iso: string) => MONTH_KEY.format(new Date(iso)); // "10/2026"

/** A gathering whose day has passed (by its end, or its start if it has none). */
export function isPast(post: PorchPost, now = Date.now()): boolean {
  if (post.kind !== 'gathering' || !post.event_start) return false;
  return Date.parse(post.event_end ?? post.event_start) < now && easternDay(Date.parse(post.event_start)) < easternDay(now);
}

const isUpcoming = (post: PorchPost, now: number) => post.kind === 'gathering' && Boolean(post.event_start) && !isPast(post, now);

// ── The board ──────────────────────────────────────────────────

export type FeedFilter = PorchKind | 'all';

export type FeedItem =
  | { type: 'post'; key: string; post: PorchPost }
  | { type: 'series'; key: string; name: string; about?: string; posts: PorchPost[] };

export interface FeedMonth {
  key: string;
  label: string;
  items: FeedItem[];
}

export interface Feed {
  /** Pinned posts, then upcoming gatherings, at most three: the ticket spread. */
  comingUp: PorchPost[];
  /** The rest, newest month first. */
  months: FeedMonth[];
  /** Gatherings filter only: past gatherings as compact rows. */
  held: PorchPost[];
  /** Older than about a year: plain text rows. */
  earlier: PorchPost[];
}

const YEAR_MS = 365 * 86_400_000;
const published = (p: PorchPost) => Date.parse(p.published_at ?? '') || 0;

/** `posts` are listed posts in sortPosts order (pinned first, newest next). */
export function buildFeed(posts: PorchPost[], filter: FeedFilter, now = Date.now()): Feed {
  const visible = filter === 'all' ? posts : posts.filter((p) => p.kind === filter);

  const pinned = visible.filter((p) => p.pinned);
  const upcoming = visible
    .filter((p) => !p.pinned && isUpcoming(p, now))
    .sort((a, b) => Date.parse(a.event_start!) - Date.parse(b.event_start!));
  const comingUp = [...pinned, ...upcoming].slice(0, 3);
  const taken = new Set(comingUp.map((p) => p.id));
  let rest = visible.filter((p) => !taken.has(p.id));

  let held: PorchPost[] = [];
  if (filter === 'gathering') {
    held = rest.filter((p) => isPast(p, now)).sort((a, b) => Date.parse(b.event_start!) - Date.parse(a.event_start!));
    rest = rest.filter((p) => !isPast(p, now));
  }

  // A series collapses into one card wherever its newest post falls.
  const series = new Map<string, PorchPost[]>();
  for (const p of rest) {
    const s = p.presentation.series;
    if (s) series.set(s.id, [...(series.get(s.id) ?? []), p]);
  }
  const items: { at: number; item: FeedItem }[] = [];
  const earlier: PorchPost[] = [];
  for (const p of rest) {
    const s = p.presentation.series;
    if (s && (series.get(s.id)?.length ?? 0) > 1) continue;
    if (published(p) < now - YEAR_MS) earlier.push(p);
    else items.push({ at: published(p), item: { type: 'post', key: p.id, post: p } });
  }
  for (const [id, members] of series) {
    if (members.length < 2) continue;
    const ordered = [...members].sort((a, b) => published(a) - published(b));
    const first = ordered.find((p) => p.presentation.series?.about) ?? ordered[0];
    items.push({
      at: published(ordered[ordered.length - 1]),
      item: { type: 'series', key: `series-${id}`, name: first.presentation.series!.name, about: first.presentation.series?.about, posts: ordered },
    });
  }
  items.sort((a, b) => b.at - a.at);

  const months: FeedMonth[] = [];
  for (const { at, item } of items) {
    const iso = new Date(at).toISOString();
    const key = monthKey(iso);
    let month = months[months.length - 1];
    if (!month || month.key !== key) months.push((month = { key, label: monthLabel(iso), items: [] }));
    month.items.push(item);
  }
  earlier.sort((a, b) => published(b) - published(a));
  return { comingUp, months, held, earlier };
}

/** The shape a post takes on the board. */
export type PostShape = 'takeover' | 'held' | 'ticket' | 'ask' | 'film' | 'photo' | 'spread';

export function shapeOf(post: PorchPost, now = Date.now()): PostShape {
  if (post.presentation.layout === 'takeover') return 'takeover';
  if (post.kind === 'gathering') return isPast(post, now) ? 'held' : 'ticket';
  if (post.kind === 'ask') return 'ask';
  if (post.hints?.embed) return 'film';
  if (post.kind === 'story' && post.hints?.gallery && post.image_path) return 'photo';
  return 'spread';
}

// ── Add to calendar ────────────────────────────────────────────

const icsTime = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsText = (s: string) => s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');
/** RFC 5545 lines fold at 75 octets; close enough for our ASCII-heavy text. */
const fold = (line: string) => line.match(/.{1,73}/g)!.join('\r\n ');

const ONLINE = /\b(zoom|online|virtual|webinar)\b/i;
function eventSpan(post: PorchPost) {
  const start = Date.parse(post.event_start!);
  const end = post.event_end ? Date.parse(post.event_end) : start + 60 * 60_000; // an hour when no end is given
  return { start, end };
}
function eventPlace(post: PorchPost) {
  return ONLINE.test(post.event_place ?? '') && post.link_url ? `${post.event_place} (${post.link_url})` : post.event_place ?? '';
}

/** A one-event calendar file, as a data: URL a plain link can download (works without JavaScript). */
export function icsDataUrl(post: PorchPost, pageUrl: string): string {
  const { start, end } = eventSpan(post);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SparkPoint//The BackPorch//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${post.slug}@yoursparkpoint.org`,
    `DTSTAMP:${icsTime(Date.parse(post.updated_at))}`,
    `DTSTART:${icsTime(start)}`,
    `DTEND:${icsTime(end)}`,
    `SUMMARY:${icsText(post.title)}`,
    `DESCRIPTION:${icsText(`${post.summary}\n\n${pageUrl}`)}`,
    ...(eventPlace(post) ? [`LOCATION:${icsText(eventPlace(post))}`] : []),
    `URL:${pageUrl}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].map(fold);
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(lines.join('\r\n') + '\r\n')}`;
}

export function googleCalendarUrl(post: PorchPost, pageUrl: string): string {
  const { start, end } = eventSpan(post);
  const q = new URLSearchParams({
    action: 'TEMPLATE',
    text: post.title,
    dates: `${icsTime(start)}/${icsTime(end)}`,
    details: `${post.summary}\n\n${pageUrl}`,
    location: eventPlace(post),
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}
