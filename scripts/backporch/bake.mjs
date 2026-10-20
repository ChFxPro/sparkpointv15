#!/usr/bin/env node
// Bakes published BackPorch posts into the build (runs in predev and prebuild).
//
//   src/data/backporch.generated.json        every listed post, full text (post pages)
//   src/data/backporch.index.generated.json  the same posts without their blocks (lists, homepage)
//
// Listed = published, past its publish time, and not expired. Scheduled and expired
// posts are left out entirely, so the build makes no page, /p/ stub, or sitemap
// entry for them; a taken-down or expired post's page disappears at the next build.
//   public/backporch/feed.xml                RSS 2.0, newest 50 listed posts
//   public/backporch/feed.json               JSON Feed 1.1, same posts
//
// All four are generated and git-ignored. Reads with the public anon key, so it
// sees exactly what the public sees (RLS: published and past its publish time).
//
// If Supabase can't be reached: in CI the build fails, so a deploy never ships
// with the porch silently emptied (and every /p/ short address 404ing). Locally
// it warns and writes empty files so `npm run dev` still starts offline.
// A missing table (migration not applied yet) is treated as "no posts".
//
// BACKPORCH_FIXTURE=<file.json> bakes posts from a local file instead of Supabase
// (an array of rows), for previewing layouts. Refused in CI.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ORIGIN = (process.env.SITE_ORIGIN || 'https://yoursparkpoint.org').replace(/\/$/, '');
const CI = Boolean(process.env.CI);
const OUT_FULL = 'src/data/backporch.generated.json';
const OUT_INDEX = 'src/data/backporch.index.generated.json';
const OUT_FEEDS = 'public/backporch';
const FEED_SIZE = 50;
const COLUMNS =
  'id,slug,title,summary,blocks,presentation,kind,org,image_path,image_alt,link_url,link_label,event_start,event_end,event_place,pinned,pinned_at,status,published_at,expires_at,updated_at';

const info = await readFile('src/utils/supabase/info.tsx', 'utf8');
const projectId = /projectId\s*=\s*"([^"]+)"/.exec(info)?.[1];
const anonKey = /publicAnonKey\s*=\s*"([^"]+)"/.exec(info)?.[1];
if (!projectId || !anonKey) throw new Error('Could not read the Supabase project id / anon key from src/utils/supabase/info.tsx');

async function fetchPosts() {
  const url =
    `https://${projectId}.supabase.co/rest/v1/porch_posts?select=${COLUMNS}` +
    `&status=eq.published&order=published_at.desc&limit=500`;
  const res = await fetch(url, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } });
  if (res.ok) return res.json();
  const text = await res.text();
  if (/PGRST205|42P01|porch_posts/.test(text) && res.status === 404) {
    console.warn('backporch: table porch_posts not found (migration not applied yet); baking no posts.');
    return [];
  }
  throw new Error(`Supabase returned ${res.status}: ${text.slice(0, 300)}`);
}

let posts;
const fixture = process.env.BACKPORCH_FIXTURE;
if (fixture && CI) {
  console.error('backporch: BACKPORCH_FIXTURE is for local previews only.');
  process.exit(1);
}
try {
  posts = fixture ? JSON.parse(await readFile(fixture, 'utf8')) : await fetchPosts();
} catch (err) {
  if (CI) {
    console.error(`backporch: could not fetch posts (${err.message}). Failing the build rather than shipping an empty porch.`);
    process.exit(1);
  }
  console.warn(`backporch: could not fetch posts (${err.message}); writing empty files for local dev.`);
  posts = [];
}

const now = Date.now();
const listed = posts.filter(
  (p) => p.published_at && Date.parse(p.published_at) <= now && !(p.expires_at && Date.parse(p.expires_at) <= now),
);
const generatedAt = new Date().toISOString();

await mkdir(path.dirname(OUT_FULL), { recursive: true });
// `samples` marks a local preview bake: the pages then skip their live refresh, which
// would otherwise replace the sample posts with whatever the real database holds.
const samples = Boolean(fixture);
await writeFile(OUT_FULL, JSON.stringify({ generatedAt, samples, posts: listed }, null, 1) + '\n');
await writeFile(
  OUT_INDEX,
  JSON.stringify({ generatedAt, samples, posts: listed.map(({ blocks, ...rest }) => rest) }, null, 1) + '\n',
);

// ── Feeds ──
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const postUrl = (p) => `${ORIGIN}/backporch/${p.slug}`;
const imageUrl = (p) => {
  // Only paths in our bucket; anything else (e.g. a local preview fixture) is left out.
  if (!p.image_path || !/^[a-z0-9][a-z0-9/_.-]*$/.test(p.image_path)) return null;
  const base = `https://${projectId}.supabase.co/storage/v1/object/public/porch-media/`;
  return base + p.image_path.replace(/-\d+\.(webp|jpg)$/, '-960.$1');
};
const paragraphs = (text) => String(text || '').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
const media = (path) =>
  typeof path === 'string' && /^[a-z0-9][a-z0-9/_.-]*$/.test(path) && !path.includes('..')
    ? `https://${projectId}.supabase.co/storage/v1/object/public/porch-media/${path}`
    : null;
const httpsUrl = (v) => {
  try {
    const u = new URL(String(v));
    return u.protocol === 'https:' ? u.toString() : null;
  } catch {
    return null;
  }
};
// Feed readers get every block as plain, escaped HTML. Coded experiments can't run
// in a feed reader, so they become a link to the post. Mirrors normalizeBlocks()
// in src/lib/porchBlocks.ts: unknown or malformed blocks are skipped.
function blockHtml(b, p) {
  if (!b || typeof b !== 'object') return '';
  const fig = (src, alt, caption) =>
    src ? `<figure><img src="${esc(src)}" alt="${esc(alt || '')}">${caption ? `<figcaption>${esc(caption)}</figcaption>` : ''}</figure>` : '';
  switch (b.type) {
    case 'text':
      return paragraphs(b.text).map((x) => `<p>${esc(x).replace(/\n/g, '<br>')}</p>`).join('');
    case 'image':
      return fig(media(b.path), b.alt, b.caption);
    case 'gallery':
      return Array.isArray(b.images) ? b.images.map((i) => fig(media(i?.path), i?.alt, i?.caption)).join('') : '';
    case 'video': {
      const src = media(b.path);
      return src ? `<p><video src="${esc(src)}" controls${media(b.poster) ? ` poster="${esc(media(b.poster))}"` : ''}></video></p>${b.caption ? `<p>${esc(b.caption)}</p>` : ''}` : '';
    }
    case 'embed': {
      const url = b.provider === 'youtube' && /^[A-Za-z0-9_-]{11}$/.test(b.videoId || '')
        ? `https://www.youtube.com/watch?v=${b.videoId}`
        : b.provider === 'vimeo' && /^\d{6,12}$/.test(b.videoId || '') ? `https://vimeo.com/${b.videoId}` : null;
      return url ? `<p><a href="${esc(url)}">Watch: ${esc(b.title || 'video')}</a></p>` : '';
    }
    case 'audio': {
      const src = media(b.path);
      return src ? `<p><audio src="${esc(src)}" controls></audio> ${esc(b.title || '')}</p>` : '';
    }
    case 'quote':
      return b.text ? `<blockquote><p>${esc(b.text)}</p>${b.cite ? `<footer>${esc(b.cite)}</footer>` : ''}</blockquote>` : '';
    case 'link': {
      const url = httpsUrl(b.url);
      if (!url) return '';
      const pv = b.preview && typeof b.preview === 'object' ? b.preview : null;
      const img = pv ? media(pv.image) : null;
      const about = b.note || pv?.description;
      return `${img ? `<p><a href="${esc(url)}"><img src="${esc(img)}" alt=""></a></p>` : ''}<p><a href="${esc(url)}">${esc(pv?.title || b.label || url)}</a>${about ? ` ${esc(about)}` : ''}</p>`;
    }
    case 'place':
      return b.name ? `<p>${esc(b.name)}${b.address ? `, ${esc(b.address)}` : ''}</p>` : '';
    case 'file': {
      const src = media(b.path);
      return src ? `<p><a href="${esc(src)}">${esc(b.label || 'Download')}</a></p>` : '';
    }
    case 'experiment':
      return `<p><a href="${esc(postUrl(p))}">Open the interactive piece on yoursparkpoint.org</a></p>`;
    // Porch Lab tools: plain fallbacks. Polls are interactive and may still be
    // lab-only, so feeds leave them out.
    case 'motionText':
      return b.text ? `<p><strong>${esc(b.text)}</strong></p>` : '';
    case 'backdrop':
      return b.heading ? `<h3>${esc(b.heading)}</h3>${b.sub ? `<p>${esc(b.sub)}</p>` : ''}` : '';
    case 'counter':
      return Array.isArray(b.items)
        ? `<ul>${b.items.map((i) => `<li><strong>${esc(i?.prefix || '')}${esc(Number(i?.value).toLocaleString('en-US'))}${esc(i?.suffix || '')}</strong> ${esc(i?.label || '')}</li>`).join('')}</ul>`
        : '';
    case 'beforeAfter':
      return fig(media(b.before?.path), b.before?.alt, b.beforeLabel || 'Before') + fig(media(b.after?.path), b.after?.alt, b.afterLabel || 'After');
    case 'scrolly':
      return Array.isArray(b.steps) ? b.steps.map((st) => fig(media(st?.image?.path), st?.image?.alt, st?.text)).join('') : '';
    case 'timeline':
      return Array.isArray(b.items)
        ? `<ul>${b.items.map((i) => `<li><strong>${esc(i?.date || '')}</strong>: ${esc(i?.title || '')}${i?.text ? `. ${esc(i.text)}` : ''}</li>`).join('')}</ul>`
        : '';
    case 'poll':
      return '';
    default:
      return '';
  }
}
const htmlContent = (p) => {
  const img = imageUrl(p);
  return [
    img ? `<p><img src="${esc(img)}" alt="${esc(p.image_alt || '')}"></p>` : '',
    `<p>${esc(p.summary)}</p>`,
    ...(Array.isArray(p.blocks) ? p.blocks.slice(0, 40).map((b) => blockHtml(b, p)) : []),
    p.link_url ? `<p><a href="${esc(p.link_url)}">${esc(p.link_label || 'Learn more')}</a></p>` : '',
  ].join('');
};
const feedPosts = listed.slice(0, FEED_SIZE);
const TITLE = 'The BackPorch | SparkPoint';
const DESCRIPTION = 'News, gatherings, and asks from SparkPoint in Transylvania County, North Carolina.';

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
<channel>
<title>${esc(TITLE)}</title>
<link>${ORIGIN}/backporch</link>
<atom:link href="${ORIGIN}/backporch/feed.xml" rel="self" type="application/rss+xml"/>
<description>${esc(DESCRIPTION)}</description>
<language>en-us</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${feedPosts
  .map(
    (p) => `<item>
<title>${esc(p.title)}</title>
<link>${postUrl(p)}</link>
<guid isPermaLink="false">${esc(p.id)}</guid>
<pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
<category>${esc(p.kind)}</category>
<description>${esc(p.summary)}</description>
<content:encoded><![CDATA[${htmlContent(p).replace(/]]>/g, ']]]]><![CDATA[>')}]]></content:encoded>
</item>`,
  )
  .join('\n')}
</channel>
</rss>
`;

const jsonFeed = {
  version: 'https://jsonfeed.org/version/1.1',
  title: TITLE,
  home_page_url: `${ORIGIN}/backporch`,
  feed_url: `${ORIGIN}/backporch/feed.json`,
  description: DESCRIPTION,
  language: 'en-US',
  authors: [{ name: 'SparkPoint', url: ORIGIN }],
  items: feedPosts.map((p) => ({
    id: p.id,
    url: postUrl(p),
    title: p.title,
    summary: p.summary,
    content_html: htmlContent(p),
    ...(imageUrl(p) ? { image: imageUrl(p) } : {}),
    ...(p.link_url ? { external_url: p.link_url } : {}),
    date_published: p.published_at,
    date_modified: p.updated_at,
    tags: [p.kind],
  })),
};

await mkdir(OUT_FEEDS, { recursive: true });
await writeFile(path.join(OUT_FEEDS, 'feed.xml'), rss);
await writeFile(path.join(OUT_FEEDS, 'feed.json'), JSON.stringify(jsonFeed, null, 1) + '\n');

console.log(`backporch: baked ${posts.length} published post(s), ${listed.length} listed, ${feedPosts.length} in feeds.`);
