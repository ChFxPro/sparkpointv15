// Sets a BackPorch post's cover photo from the command line, with no key to paste.
//
//   npm run porch:cover -- <slug> <photo> --alt "What the photo shows"
//   npm run porch:cover -- <slug> <photo> --alt "…" --dry-run   resize only; signs in to nothing
//
// <photo> is a file on this Mac (an email attachment saved to disk, a flyer), or a photo
// already in one of this project's public buckets (event-media, convening-photos), e.g.
// a Collaboration Lab gallery photo. It's resized to the widths the site serves
// (480/960/1600, never upscaled), uploaded to porch-media as posts/<slug>-<stamp>-<w>.webp
// (the same naming the editor uses), and set as the post's cover with its alt text.
// The post can be a draft or published; nothing else about it changes.
//
// It signs in as the BackPorch bot: an ordinary Supabase Auth user whose email is in
// porch_editors, so Row Level Security limits it to BackPorch posts and photos. Its
// email and password live in the macOS Keychain under the service name below; set
// them up once (docs/backporch/SPEC.md, "Cover photos from the command line"):
//
//   security add-generic-password -s sparkpoint-backporch-bot -a <bot email> -w
//
// The password is read from the Keychain at run time, sent only to Supabase Auth,
// and never printed.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const PROJECT_ID = 'suqtfbculwuetfdhdgdh';
const BASE = `https://${PROJECT_ID}.supabase.co`;
const BUCKET = 'porch-media';
const WIDTHS = [480, 960, 1600];
const KEYCHAIN_SERVICE = 'sparkpoint-backporch-bot';
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;
// Photos already in this project's public buckets can be used directly.
const OWN_BUCKET_PHOTO = new RegExp(
  `^https://${PROJECT_ID}\\.supabase\\.co/storage/v1/object/public/(event-media|convening-photos)/[\\w./-]+\\.(webp|jpe?g|png)$`,
);

function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

// ── Arguments ──

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  const value = args[i + 1];
  args.splice(i, 2);
  return value;
};
const dryRun = args.includes('--dry-run');
if (dryRun) args.splice(args.indexOf('--dry-run'), 1);
const alt = flag('--alt')?.trim();
const [slug, src] = args;

if (!slug || !src) fail('Usage: npm run porch:cover -- <slug> <photo file or bucket URL> --alt "What the photo shows" [--dry-run]');
if (!SLUG.test(slug)) fail(`"${slug}" isn't a post slug (lowercase words joined by hyphens).`);
if (!alt) fail('Add --alt "…": every cover needs alt text describing the photo.');
if (alt.length > 300) fail(`Alt text is ${alt.length} characters; keep it to 300.`);

// ── Read and resize the photo ──

let input;
if (/^https:\/\//.test(src)) {
  if (!OWN_BUCKET_PHOTO.test(src)) fail('A URL must be a photo in this project\'s public event-media or convening-photos bucket. Save other images to disk first.');
  const res = await fetch(src);
  if (!res.ok) fail(`Couldn't download ${src} (${res.status}).`);
  input = Buffer.from(await res.arrayBuffer());
} else {
  const file = path.resolve(src.replace(/^~(?=\/)/, process.env.HOME ?? '~'));
  if (!fs.existsSync(file)) fail(`No file at ${file}`);
  if (fs.statSync(file).size > MAX_SOURCE_BYTES) fail('That photo is over 25 MB. Use a smaller copy.');
  input = fs.readFileSync(file);
}

let natural;
try {
  ({ width: natural } = await sharp(input).metadata());
} catch {
  fail('That file could not be read as a photo (JPEG, PNG, or WebP).');
}
if (!natural) fail('That file could not be read as a photo.');

const stamp = Date.now().toString(36);
const base = `posts/${slug}-${stamp}`;
const files = [];
for (const width of WIDTHS) {
  const body = await sharp(input).rotate().resize({ width: Math.min(width, natural), withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  files.push({ path: `${base}-${width}.webp`, body });
}
const mainPath = `${base}-960.webp`;

console.log(`\nCover for "${slug}"`);
for (const f of files) console.log(`  ${f.path}  ${(f.body.length / 1024).toFixed(0)} KB`);
console.log(`  alt: ${alt}`);

if (dryRun) {
  console.log('\nDry run: nothing was signed in to, uploaded, or changed.');
  process.exit(0);
}

// ── Sign in as the BackPorch bot ──

function keychain(...extra) {
  try {
    return execFileSync('security', ['find-generic-password', '-s', KEYCHAIN_SERVICE, ...extra], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch {
    fail(`No BackPorch bot login in the Keychain (service "${KEYCHAIN_SERVICE}"). See "Cover photos from the command line" in docs/backporch/SPEC.md.`);
  }
}
const email = /"acct"<blob>="([^"]+)"/.exec(keychain())?.[1];
if (!email) fail(`The Keychain item "${KEYCHAIN_SERVICE}" has no account (email) set.`);
const password = keychain('-a', email, '-w').replace(/\n$/, '');

// The public anon key (safe to ship; it's in the site's own bundle).
const infoFile = new URL('../../src/utils/supabase/info.tsx', import.meta.url);
const anon = /publicAnonKey = "([^"]+)"/.exec(fs.readFileSync(infoFile, 'utf8'))?.[1];
if (!anon) fail('Could not read the project\'s public anon key from src/utils/supabase/info.tsx.');

const signIn = await fetch(`${BASE}/auth/v1/token?grant_type=password`, {
  method: 'POST',
  headers: { apikey: anon, 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password }),
});
if (!signIn.ok) fail(`Sign-in as ${email} failed (${signIn.status}). Check the password saved in the Keychain.`);
const { access_token: token } = await signIn.json();
const auth = { apikey: anon, Authorization: `Bearer ${token}` };

// ── Make sure the post exists and this login can edit it ──

const lookup = await fetch(`${BASE}/rest/v1/porch_posts?slug=eq.${slug}&select=slug,status,image_path`, { headers: auth });
const [post] = lookup.ok ? await lookup.json() : [];
if (!post) fail(`No post "${slug}" that ${email} can edit. Is the slug right, and is ${email} in porch_editors?`);

// ── Upload, then point the post at it ──

for (const f of files) {
  const res = await fetch(`${BASE}/storage/v1/object/${BUCKET}/${f.path}`, {
    method: 'POST',
    headers: { ...auth, 'Content-Type': 'image/webp', 'Cache-Control': 'max-age=31536000', 'x-upsert': 'false' },
    body: f.body,
  });
  if (!res.ok) fail(`Upload failed for ${f.path} (${res.status}): ${(await res.text()).slice(0, 300)}`);
}

const update = await fetch(`${BASE}/rest/v1/porch_posts?slug=eq.${slug}`, {
  method: 'PATCH',
  headers: { ...auth, 'Content-Type': 'application/json', Prefer: 'return=representation' },
  body: JSON.stringify({ image_path: mainPath, image_alt: alt, updated_at: new Date().toISOString() }),
});
const updated = update.ok ? await update.json() : [];
if (updated.length !== 1) fail(`Uploaded, but setting the cover failed (${update.status}): ${JSON.stringify(updated).slice(0, 300)}`);

console.log(`\nDone. "${slug}" (${post.status}) now uses ${mainPath}.`);
if (post.image_path) console.log(`Its old cover, ${post.image_path}, is still in storage.`);
if (post.status === 'published') console.log('It shows on the site now; baked pages catch up at the next rebuild.');
