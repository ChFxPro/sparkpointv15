// Backfills the BackPorch with SparkPoint's existing events, stories, and news.
//
//   npm run porch:backfill              preview: checks every post and image, writes nothing
//   npm run porch:backfill -- --apply   uploads the images and writes the posts
//   npm run porch:backfill:preview      shows them on the local dev site, nothing written
//
// The posts are in scripts/backporch/backfill-posts.json; read and edit them first.
// Each image is resized to the widths the site serves (480/960/1600, never upscaled)
// and uploaded to porch-media under backfill/<slug>/. Posts are written by slug, so
// running it again updates them rather than adding copies. Pinned posts go last, in
// list order; the database keeps at most three pins and the most recent leads.
//
// Writing needs a Supabase secret key (sb_secret_…, Dashboard > Project Settings >
// API Keys). It's read from SUPABASE_SECRET_KEY or asked for, hidden, in Terminal,
// and only ever sent to Supabase.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PROJECT_ID = 'suqtfbculwuetfdhdgdh';
const BASE = `https://${PROJECT_ID}.supabase.co`;
const BUCKET = 'porch-media';
const WIDTHS = [480, 960, 1600];
const KINDS = ['news', 'gathering', 'ask', 'story'];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const apply = process.argv.includes('--apply');
const root = process.cwd();
const source = path.join(root, 'scripts/backporch/backfill-posts.json');

function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

// ── Check the posts before anything is uploaded ──

const { posts } = JSON.parse(fs.readFileSync(source, 'utf8'));
const problems = [];
const seen = new Set();
const imagesOf = (post) => [
  ...(post.image ? [post.image] : []),
  ...post.blocks.flatMap((b) => (b.type === 'image' ? [b] : b.type === 'gallery' ? b.images : [])),
];

for (const post of posts) {
  const where = post.slug ?? '(no slug)';
  if (!SLUG.test(post.slug ?? '') || post.slug.length > 60) problems.push(`${where}: slug must be lowercase words joined by hyphens`);
  if (seen.has(post.slug)) problems.push(`${where}: slug used twice`);
  seen.add(post.slug);
  if (!post.title?.trim() || post.title.length > 90) problems.push(`${where}: title must be 1–90 characters (is ${post.title?.length ?? 0})`);
  if (!post.summary?.trim() || post.summary.length > 280) problems.push(`${where}: summary must be 1–280 characters (is ${post.summary?.length ?? 0})`);
  if (!KINDS.includes(post.kind)) problems.push(`${where}: kind must be one of ${KINDS.join(', ')}`);
  if (Number.isNaN(Date.parse(post.published_at))) problems.push(`${where}: published_at is not a date`);
  if (post.kind === 'gathering' && !post.event_start) problems.push(`${where}: a gathering needs event_start`);
  if (post.link_label && !post.link_url) problems.push(`${where}: link_label needs link_url`);
  for (const url of [post.link_url, ...post.blocks.filter((b) => b.type === 'link').map((b) => b.url)]) {
    if (url && !url.startsWith('https://')) problems.push(`${where}: links must start with https:// (${url})`);
  }
  for (const img of imagesOf(post)) {
    if (!img.alt?.trim()) problems.push(`${where}: every image needs alt text (${img.src})`);
    if (!fs.existsSync(path.join(root, img.src ?? ''))) problems.push(`${where}: image not found: ${img.src}`);
  }
}
if (problems.length) fail(`Fix these in ${path.relative(root, source)} first:\n  ${problems.join('\n  ')}`);

const ordered = [...posts.filter((p) => !p.pinned), ...posts.filter((p) => p.pinned)];
const imageCount = new Set(posts.flatMap((p) => imagesOf(p).map((i) => i.src))).size;
console.log(`${posts.length} posts, ${imageCount} images, ${posts.filter((p) => p.pinned).length} pinned:\n`);
for (const p of ordered) {
  const date = new Date(p.published_at).toISOString().slice(0, 10);
  console.log(`  ${date}  ${p.kind.padEnd(9)} ${p.pinned ? '📌 ' : '   '}${p.title}  (/p/${p.slug})`);
}

// Local look: write the posts as a bake fixture, with images served straight from the
// repo by the dev server (public/ at its own path, src/ through Vite), then stop.
const fixtureArg = process.argv.find((a) => a.startsWith('--fixture='));
if (fixtureArg) {
  // Unencoded: block media paths may contain spaces but not %, and browsers handle both.
  const url = (src) => (src.startsWith('public/') ? src.slice('public'.length) : `/${src}`);
  const media = ({ src, alt, caption }) => ({ path: url(src), alt, ...(caption ? { caption } : {}) });
  const now = Date.now();
  const rows = ordered.map((post, i) => ({
    id: `backfill-${post.slug}`,
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    kind: post.kind,
    org: 'sparkpoint',
    blocks: post.blocks.map((b, j) => {
      const id = `${post.slug.slice(0, 30)}-${j + 1}`;
      if (b.type === 'image') return { id, type: 'image', ...media(b) };
      if (b.type === 'gallery') return { id, type: 'gallery', images: b.images.map(media) };
      return { id, ...b };
    }),
    presentation: post.presentation ?? {},
    image_path: post.image ? url(post.image.src) : null,
    image_alt: post.image?.alt ?? null,
    link_url: post.link_url ?? null,
    link_label: post.link_label ?? null,
    event_start: post.event_start ?? null,
    event_end: post.event_end ?? null,
    event_place: post.event_place ?? null,
    pinned: Boolean(post.pinned),
    pinned_at: post.pinned ? new Date(now + i).toISOString() : null,
    status: 'published',
    published_at: post.published_at,
    expires_at: post.expires_at ?? null,
    updated_at: new Date(now).toISOString(),
  }));
  fs.writeFileSync(fixtureArg.slice('--fixture='.length), `${JSON.stringify(rows, null, 1)}\n`);
  console.log(`\nWrote a local preview fixture (${rows.length} posts). Nothing was uploaded or written.`);
  process.exit(0);
}

if (!apply) {
  console.log('\nPreview only: nothing was uploaded or written. Run `npm run porch:backfill -- --apply` to publish.');
  process.exit(0);
}

// ── Write ──

function askHidden(question) {
  if (!process.stdin.isTTY) fail('No secret key: set SUPABASE_SECRET_KEY, or run this in a Terminal window so it can ask.');
  process.stdout.write(question);
  const { stdin } = process;
  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding('utf8');
  let value = '';
  return new Promise((resolve) => {
    const onData = (chunk) => {
      for (const ch of chunk) {
        if (ch === '\r' || ch === '\n') {
          stdin.setRawMode(false);
          stdin.pause();
          stdin.off('data', onData);
          process.stdout.write('\n');
          // Terminals wrap pasted text in bracketed-paste markers (ESC[200~ … ESC[201~)
          // when raw mode is on; drop them and any other control characters.
          resolve(value.replace(/\x1b\[20[01]~/g, '').replace(/[\x00-\x1f\x7f]/g, '').trim());
          return;
        }
        if (ch === '\u0003') process.exit(130); // Ctrl-C
        if (ch === '\u007f' || ch === '\b') value = value.slice(0, -1);
        else value += ch;
      }
    };
    stdin.on('data', onData);
  });
}

let key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!key) key = await askHidden('\nPaste your Supabase secret key (it stays hidden), then press Return: ');
if (!key) fail('No key entered. Create one under Supabase Dashboard > Project Settings > API Keys (Secret keys).');
if (key.startsWith('sb_publishable_')) fail('That is a publishable key, which cannot write. Use a secret key (sb_secret_…).');
if (!/^(sb_secret_|eyJ)/.test(key)) {
  // Say what arrived without echoing the key: its length and its first three characters.
  fail(`That does not look like a Supabase secret key (got ${key.length} characters starting "${key.slice(0, 3)}…"). It should start with sb_secret_ (Dashboard > Project Settings > API Keys > Secret keys). If pasting into the prompt misbehaves, run: read -rs SUPABASE_SECRET_KEY && export SUPABASE_SECRET_KEY && npm run porch:backfill -- --apply; unset SUPABASE_SECRET_KEY`);
}
// sb_secret_ keys aren't JWTs: they go on `apikey` only. Legacy service-role JWTs need both.
const auth = key.startsWith('sb_') ? { apikey: key } : { apikey: key, Authorization: `Bearer ${key}` };

const uploaded = new Map(); // src -> 960 path, so a shared image uploads once
async function upload(slug, src) {
  if (uploaded.has(src)) return uploaded.get(src);
  const name = path.basename(src).replace(/\.[a-z]+$/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').replace(/-\d+$/, '');
  const input = fs.readFileSync(path.join(root, src));
  const { width: natural = 1600 } = await sharp(input).metadata();
  for (const width of WIDTHS) {
    const body = await sharp(input).rotate().resize({ width: Math.min(width, natural), withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    const objectPath = `backfill/${slug}/${name}-${width}.webp`;
    const res = await fetch(`${BASE}/storage/v1/object/${BUCKET}/${objectPath}`, {
      method: 'POST',
      headers: { ...auth, 'Content-Type': 'image/webp', 'x-upsert': 'true', 'Cache-Control': 'max-age=31536000' },
      body,
    });
    if (!res.ok) fail(`Upload failed for ${src} (${res.status}): ${(await res.text()).slice(0, 300)}`);
  }
  const main = `backfill/${slug}/${name}-960.webp`;
  uploaded.set(src, main);
  return main;
}

const withPath = async (slug, { src, alt, caption }) => ({ path: await upload(slug, src), alt, ...(caption ? { caption } : {}) });

let n = 0;
for (const post of ordered) {
  n += 1;
  process.stdout.write(`\n[${n}/${ordered.length}] ${post.title}… `);
  const blocks = [];
  for (const [i, b] of post.blocks.entries()) {
    const id = `${post.slug.slice(0, 30)}-${i + 1}`;
    if (b.type === 'image') blocks.push({ id, type: 'image', ...(await withPath(post.slug, b)) });
    else if (b.type === 'gallery') blocks.push({ id, type: 'gallery', images: await Promise.all(b.images.map((img) => withPath(post.slug, img))) });
    else blocks.push({ id, ...b });
  }
  const row = {
    slug: post.slug,
    title: post.title,
    summary: post.summary,
    kind: post.kind,
    org: 'sparkpoint',
    blocks,
    presentation: post.presentation ?? {},
    image_path: post.image ? await upload(post.slug, post.image.src) : null,
    image_alt: post.image?.alt ?? null,
    link_url: post.link_url ?? null,
    link_label: post.link_label ?? null,
    event_start: post.event_start ?? null,
    event_end: post.event_end ?? null,
    event_place: post.event_place ?? null,
    pinned: Boolean(post.pinned),
    status: 'published',
    published_at: post.published_at,
    expires_at: post.expires_at ?? null,
  };
  const res = await fetch(`${BASE}/rest/v1/porch_posts?on_conflict=slug`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(row),
  });
  if (!res.ok) fail(`Could not save "${post.title}" (${res.status}): ${(await res.text()).slice(0, 300)}`);
  process.stdout.write('saved');
}

console.log(`\n\nDone: ${ordered.length} posts are on the BackPorch. They show on the site after its next build.`);
