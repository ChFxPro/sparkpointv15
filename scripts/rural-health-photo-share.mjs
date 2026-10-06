// Photos for the unlisted convening photo-share page (/rural-health-convening/photos).
//
// The image files are NOT in this repo. They live in the public-read Supabase Storage
// bucket `convening-photos` (under rural-health-2026/), so the gallery can grow to
// hundreds of photos without bloating git or the GitHub Pages deploy. The bucket can't
// be listed and only a secret key can write (see the create_convening_photos_bucket
// migration). What IS in the repo is src/data/ruralHealthPhotoShare.json — ids, groups
// ("sets"), optional titles, alt text, sizes, credits — which the page renders from;
// display order is the order of its `photos` array.
//
// ADDING PHOTOS (the whole workflow):
//
//   npm run photos:add
//
//   It asks for the folder (drag it into the Terminal window), which group the photos
//   belong in (or a new group), and your Supabase secret key (hidden as you paste).
//   For a mixed batch, sort the photos into subfolders named after groups — `room`,
//   `system`, `grounds`, or a group's title — and give it the parent folder; each
//   subfolder goes to its group. JPEG, PNG, WebP, and TIFF are accepted; blank images
//   (e.g. an exported empty "Background" layer) are skipped.
//
//   For each photo it makes rhp-<id>-960.webp (grid), rhp-<id>-1920.webp (lightbox), and
//   a JPEG download up to 3000 px (never enlarged; EXIF/IPTC/XMP kept so a photographer's
//   copyright travels with it — check a batch carries no GPS first), uploads all three,
//   and records the photos in the JSON. The page shows them once that JSON change is
//   merged. There are deliberately no download-all ZIPs: the page is for sharing a few
//   favorites, not for passing the whole set around.
//
//   Duplicates are never added twice: a photo already recorded with the same file name
//   and size is recognised, and so is the same image under another name or export —
//   each photo's visual fingerprint (a 256-bit dHash, stored as `hash`) is compared with
//   every photo already in the gallery and earlier in the batch. Near-identical images
//   are skipped; merely similar ones (e.g. burst frames) are added but listed so you can
//   check them. Re-running is safe and resumes: only files missing from the bucket are
//   uploaded (--force remakes and re-uploads everything in the folder).
//
//   npm run photos:check -- "<folder>"
//     A dry run: no key, no uploads, nothing changed except backfilling fingerprints.
//     Lists which photos are new, which are duplicates (of which No.), and which only
//     look similar.
//
//   Flags, all optional: npm run photos:add -- "<folder>" --set <group-id> [--force]
//
//   npm run photos:remove-zips
//     One-time cleanup: deletes the download-all ZIPs that earlier versions uploaded.
//
// The key: a secret key (sb_secret_…) from Supabase Dashboard > Project Settings >
// API Keys, or the legacy service_role JWT. It's read from SUPABASE_SECRET_KEY (or
// SUPABASE_SERVICE_ROLE_KEY) if set, otherwise asked for. Never commit it.
//
// Processed files are cached in .photo-share-cache/ (gitignored); on another machine
// fingerprints of photos it hasn't cached are taken from the bucket.
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { execFileSync } from 'node:child_process';

const PROJECT_ID = 'suqtfbculwuetfdhdgdh';
const BUCKET = 'convening-photos';
const PREFIX = 'rural-health-2026';
const STORAGE = `https://${PROJECT_ID}.supabase.co/storage/v1/object`;

const root = process.cwd();
const dataPath = path.join(root, 'src/data/ruralHealthPhotoShare.json');
const cacheDir = path.join(root, '.photo-share-cache');

const readData = () => JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const writeData = (data) => fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
const downloadName = (data, photo) => `${data.downloadPrefix}-${photo.id}.jpg`;
const DEFAULT_ALT = 'A moment from the 2026 WNC Regional Rural Health Convening at Deerwoode Reserve in Brevard, NC.';
const IMAGE_EXT = /\.(jpe?g|png|webp|tiff?)$/i;
const MIME = { '.webp': 'image/webp', '.jpg': 'image/jpeg' };
const mb = (bytes) => `${(bytes / 1e6).toFixed(1)} MB`;

// ── Prompts ──

function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

async function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim();
}

// Reads a line without echoing it, for the secret key.
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
          resolve(value.trim());
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

async function secretKey() {
  let key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) key = await askHidden('Paste your Supabase secret key (it stays hidden), then press Return: ');
  if (!key) fail('No key entered. Create one under Supabase Dashboard > Project Settings > API Keys (Secret keys).');
  if (key.startsWith('sb_publishable_')) fail('That is a publishable key, which cannot upload. Use a secret key (sb_secret_…).');
  return key;
}

// A folder dragged into Terminal arrives quoted or with backslash-escaped spaces.
const cleanPath = (input) =>
  path.resolve(input.trim().replace(/^['"]|['"]$/g, '').replace(/\\(.)/g, '$1').replace(/^~(?=\/)/, process.env.HOME ?? '~'));

// ── Duplicate detection ──

// Difference hash, 256 bits: shrink to a common 256 px greyscale (so an original and
// its web copy start from the same pixels), blur off noise, then one bit per
// left/right brightness step on a 17×16 grid. Survives resizing, re-encoding, renaming,
// and exposure tweaks; different moments land far apart. Measured on the first 73
// photos: the same image scored 4–9 apart (original vs. web copy, re-export, re-save),
// a slightly cropped re-export 19, and the closest two different photos 24.
async function fingerprint(sharp, input) {
  const small = await sharp(input).autoOrient().resize(256, 256, { fit: 'inside' }).greyscale().blur(1).toBuffer();
  const { data } = await sharp(small).resize(17, 16, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
  let bits = 0n;
  for (let y = 0; y < 16; y += 1) {
    for (let x = 0; x < 16; x += 1) bits = (bits << 1n) | (data[y * 17 + x] > data[y * 17 + x + 1] ? 1n : 0n);
  }
  return bits.toString(16).padStart(64, '0');
}

function distance(a, b) {
  let x = BigInt(`0x${a}`) ^ BigInt(`0x${b}`);
  let n = 0;
  for (; x; x &= x - 1n) n += 1;
  return n;
}

const DUPLICATE = 14; // ≤ this many of 256 bits differ: the same image — skipped
const SIMILAR = 22; // ≤ this: added, but listed for a look (crops, burst frames)

// Gives every recorded photo a fingerprint, from its cached (or downloaded) grid image.
async function backfillFingerprints(sharp, data) {
  let changed = false;
  for (const photo of data.photos) {
    if (photo.hash?.length === 64) continue; // also replaces any older, shorter hash
    photo.hash = await fingerprint(sharp, await cached(`rhp-${photo.id}-960.webp`));
    changed = true;
  }
  if (changed) writeData(data);
}

function closest(hash, pool) {
  let best = null;
  for (const other of pool) {
    const d = distance(hash, other.hash);
    if (!best || d < best.d) best = { d, other };
  }
  return best;
}

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function chooseSet(data, count) {
  console.log(`\nWhich group should ${count === 1 ? 'this photo' : `these ${count} photos`} go in?`);
  data.sets.forEach((set, i) => {
    const n = data.photos.filter((p) => p.set === set.id).length;
    console.log(`  ${i + 1}) ${set.title} (${n} now)`);
  });
  console.log(`  ${data.sets.length + 1}) + New group`);
  for (;;) {
    const choice = Number(await ask('Number: '));
    if (choice >= 1 && choice <= data.sets.length) return data.sets[choice - 1].id;
    if (choice === data.sets.length + 1) {
      const title = await ask('New group name (shown on the page): ');
      if (!title) continue;
      const note = await ask('One-line description (optional): ');
      let id = slug(title) || 'group';
      while (data.sets.some((s) => s.id === id)) id += '-2';
      data.sets.push({ id, title, note: note || '' });
      return id;
    }
    console.log('Please type one of the numbers above.');
  }
}

// ── Storage ──

const authHeaders = (key) =>
  // sb_secret_ keys aren't JWTs: they go on `apikey` only (as a Bearer token the platform
  // tries to parse them as a JWT and rejects the request). Legacy JWTs go on both.
  key.startsWith('sb_') ? { apikey: key } : { apikey: key, Authorization: `Bearer ${key}` };

async function upload(key, name, body) {
  const res = await fetch(`${STORAGE}/${BUCKET}/${PREFIX}/${encodeURIComponent(name)}`, {
    method: 'POST',
    headers: {
      ...authHeaders(key),
      'Content-Type': MIME[path.extname(name)] ?? 'application/octet-stream',
      'Cache-Control': 'max-age=86400',
      'x-upsert': 'true',
    },
    body,
  });
  if (!res.ok) {
    const detail = await res.text();
    if (res.status === 401 || res.status === 403 || /invalid|jwt|signature|unauthorized/i.test(detail)) {
      fail(`Supabase refused the key (${res.status}). Check that you pasted a secret key for the SparkPoint V15 project.`);
    }
    throw new Error(`Upload of ${name} failed (${res.status}): ${detail}`);
  }
}

const inBucket = async (name) =>
  (await fetch(`${STORAGE}/public/${BUCKET}/${PREFIX}/${encodeURIComponent(name)}`, { method: 'HEAD' })).ok;

// Local copy of an uploaded file, fetched from the public bucket if this machine
// doesn't have it cached.
async function cached(name) {
  const file = path.join(cacheDir, name);
  if (!fs.existsSync(file)) {
    const res = await fetch(`${STORAGE}/public/${BUCKET}/${PREFIX}/${encodeURIComponent(name)}`);
    if (!res.ok) throw new Error(`${name} is neither cached nor in the bucket (${res.status}) — re-run photos:add with its folder.`);
    fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  }
  return fs.readFileSync(file);
}

// ── Adding photos ──

const listImages = (dir) =>
  fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXT.test(f) && !f.startsWith('.') && fs.statSync(path.join(dir, f)).isFile())
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

// Subfolders named after a group (its id or title, any case) go to that group.
function findSetFolders(data, dir) {
  const byName = new Map(data.sets.flatMap((s) => [[s.id.toLowerCase(), s.id], [s.title.toLowerCase(), s.id]]));
  return fs
    .readdirSync(dir)
    .filter((f) => !f.startsWith('.') && fs.statSync(path.join(dir, f)).isDirectory() && byName.has(f.toLowerCase()))
    .map((f) => ({ dir: path.join(dir, f), set: byName.get(f.toLowerCase()) }))
    .sort((a, b) => data.sets.findIndex((s) => s.id === a.set) - data.sets.findIndex((s) => s.id === b.set));
}

async function folderFrom(args) {
  let folderArg = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--set');
  if (!folderArg) folderArg = await ask('Drag the photo folder into this window, then press Return: ');
  const folder = cleanPath(folderArg);
  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) fail(`Not a folder: ${folder}`);
  return folder;
}

// Dry run: what would `add` do with this folder? No key, no uploads.
async function check(args) {
  const { default: sharp } = await import('sharp');
  const data = readData();
  const folder = await folderFrom(args);
  const files = [
    ...findSetFolders(data, folder).flatMap(({ dir }) => listImages(dir).map((name) => ({ file: path.join(dir, name), name }))),
    ...listImages(folder).map((name) => ({ file: path.join(folder, name), name })),
  ];
  if (!files.length) fail(`No photos found in ${folder}.`);
  console.log(`Checking ${files.length} photos against the ${data.photos.length} in the gallery…\n`);
  await backfillFingerprints(sharp, data);
  const pool = [...data.photos];
  const counts = { new: 0, duplicate: 0, similar: 0, blank: 0 };
  for (const { file, name } of files) {
    const sourceBytes = fs.statSync(file).size;
    const known = data.photos.find((p) => p.source === name && (p.sourceBytes === undefined || p.sourceBytes === sourceBytes));
    if (known) {
      counts.duplicate += 1;
      console.log(`  = ${name}  already uploaded as No. ${known.id}`);
      continue;
    }
    if ((await sharp(file).stats()).entropy < 0.5) {
      counts.blank += 1;
      console.log(`  – ${name}  blank image`);
      continue;
    }
    const hash = await fingerprint(sharp, file);
    const match = closest(hash, pool);
    const label = (other) => (other.id ? `No. ${other.id}` : other.source);
    if (match && match.d <= DUPLICATE) {
      counts.duplicate += 1;
      console.log(`  = ${name}  same image as ${label(match.other)}`);
      continue;
    }
    if (match && match.d <= SIMILAR) {
      counts.similar += 1;
      console.log(`  ~ ${name}  new, but looks a lot like ${label(match.other)}`);
    } else {
      counts.new += 1;
      console.log(`  + ${name}  new`);
    }
    pool.push({ source: name, hash });
  }
  console.log(
    `\n${counts.new + counts.similar} would be added${counts.similar ? ` (${counts.similar} look similar to another photo)` : ''}, ` +
      `${counts.duplicate} duplicate${counts.duplicate === 1 ? '' : 's'} skipped${counts.blank ? `, ${counts.blank} blank skipped` : ''}.`,
  );
}

async function add(args) {
  const { default: sharp } = await import('sharp');
  const data = readData();
  const force = args.includes('--force');
  const setFlag = args.indexOf('--set');
  const flagSet = setFlag >= 0 ? args[setFlag + 1] : undefined;
  if (flagSet && !data.sets.some((s) => s.id === flagSet)) {
    fail(`Unknown group "${flagSet}". Groups: ${data.sets.map((s) => s.id).join(', ')} — or leave out --set to pick or create one.`);
  }

  const folder = await folderFrom(args);

  // Work out which files go to which group before asking for the key.
  const batch = [];
  for (const { dir, set } of findSetFolders(data, folder)) {
    for (const name of listImages(dir)) batch.push({ file: path.join(dir, name), name, set });
  }
  const loose = listImages(folder);
  if (loose.length) {
    const set = flagSet ?? (await chooseSet(data, loose.length));
    for (const name of loose) batch.push({ file: path.join(folder, name), name, set });
  }
  if (!batch.length) {
    fail(`No photos found in ${folder} (JPEG, PNG, WebP, or TIFF — directly inside it, or in subfolders named ${data.sets.map((s) => s.id).join(' / ')}).`);
  }

  const key = await secretKey();
  fs.mkdirSync(cacheDir, { recursive: true });
  await backfillFingerprints(sharp, data);
  console.log(`\nAdding ${batch.length} photos…`);
  const added = [];
  const similar = [];
  let skippedBlank = 0;
  let skippedDuplicate = 0;
  let unchanged = 0;

  for (const { file, name, set } of batch) {
    const sourceBytes = fs.statSync(file).size;
    let photo = data.photos.find((p) => p.source === name && (p.sourceBytes === undefined || p.sourceBytes === sourceBytes));
    const isNew = !photo;
    if (isNew) {
      const { entropy } = await sharp(file).stats();
      if (entropy < 0.5) {
        skippedBlank += 1;
        console.log(`  – ${name}: blank image, skipped`);
        continue;
      }
      const hash = await fingerprint(sharp, file);
      const match = closest(hash, data.photos);
      if (match && match.d <= DUPLICATE) {
        skippedDuplicate += 1;
        console.log(`  = ${name}: same image as No. ${match.other.id}, skipped`);
        continue;
      }
      if (match && match.d <= SIMILAR) similar.push([name, match.other.id]);
      const next = Math.max(0, ...data.photos.map((p) => Number(p.id))) + 1;
      photo = { id: String(next).padStart(2, '0'), source: name, sourceBytes, set, title: '', alt: DEFAULT_ALT, hash };
    }

    const outputs = [
      [`rhp-${photo.id}-960.webp`, (img) => img.resize(960, 960, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 78 })],
      [`rhp-${photo.id}-1920.webp`, (img) => img.resize(1920, 1920, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 })],
      [
        downloadName(data, photo),
        (img) =>
          img
            .resize(3000, 3000, { fit: 'inside', withoutEnlargement: true })
            .keepMetadata()
            .flatten({ background: '#ffffff' })
            .jpeg({ quality: 86, mozjpeg: true }),
      ],
    ];
    let touched = false;
    for (const [outName, pipeline] of outputs) {
      if (!force && !isNew && (await inBucket(outName))) continue;
      const out = path.join(cacheDir, outName);
      if (force || isNew || !fs.existsSync(out)) await pipeline(sharp(file).autoOrient()).toFile(out);
      await upload(key, outName, fs.readFileSync(out));
      touched = true;
    }
    if (!touched) {
      unchanged += 1;
      continue;
    }
    const full = path.join(cacheDir, downloadName(data, photo));
    const meta = await sharp(full).metadata();
    Object.assign(photo, { width: meta.width, height: meta.height, bytes: fs.statSync(full).size });
    if (isNew) {
      data.photos.push(photo);
      added.push(photo);
    }
    writeData(data); // after every photo, so an interrupted batch keeps what's uploaded
    const title = data.sets.find((s) => s.id === photo.set)?.title;
    console.log(`  ${isNew ? '+' : '↻'} No. ${photo.id}  ${name} → ${title} (${mb(photo.bytes)})`);
  }

  const counts = data.sets
    .map((s) => [s.title, added.filter((p) => p.set === s.id).length])
    .filter(([, n]) => n)
    .map(([t, n]) => `${n} in ${t}`)
    .join(', ');
  console.log(`\nDone. ${added.length} new photo${added.length === 1 ? '' : 's'}${counts ? ` (${counts})` : ''}.`);
  if (unchanged) console.log(`${unchanged} already uploaded, left as is.`);
  if (skippedDuplicate) console.log(`${skippedDuplicate} duplicate${skippedDuplicate === 1 ? '' : 's'} of photos already in the gallery skipped.`);
  if (skippedBlank) console.log(`${skippedBlank} blank image${skippedBlank === 1 ? '' : 's'} skipped.`);
  if (similar.length) {
    console.log('\nAdded, but they look a lot like an existing photo — worth a glance:');
    for (const [name, id] of similar) console.log(`  ${name} ~ No. ${id}`);
  }
  if (added.length) {
    let branch = '';
    try {
      branch = execFileSync('git', ['branch', '--show-current'], { encoding: 'utf8' }).trim();
    } catch {
      // not a git checkout; the reminder below still applies
    }
    console.log(
      `\nNext: the photos are uploaded, and the page will show them once the updated\n` +
        `src/data/ruralHealthPhotoShare.json is merged — commit it through a pull request\n` +
        `(or ask Claude to). Optional: give any photo a "title" or a better "alt" there.` +
        (branch === 'main' ? `\nYou're on main: create a branch before committing.` : ''),
    );
  }
}

// ── Cleanup ──

async function removeZips() {
  const key = await secretKey();
  const data = readData();
  const names = ['SparkPoint-Rural-Health-Convening-2026-Photos.zip', ...data.sets.map((set) => `${data.downloadPrefix}-${set.id}.zip`)];
  const res = await fetch(`${STORAGE}/${BUCKET}`, {
    method: 'DELETE',
    headers: { ...authHeaders(key), 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefixes: names.map((name) => `${PREFIX}/${name}`) }),
  });
  if (!res.ok) fail(`Supabase refused the delete (${res.status}): ${await res.text()}`);
  const removed = await res.json();
  console.log(`Removed ${removed.length} ZIP${removed.length === 1 ? '' : 's'} from the bucket.`);
  for (const name of names) {
    if (await inBucket(name)) console.log(`  still there: ${name}`);
  }
}

// ── Entry ──

const [command, ...rest] = process.argv.slice(2);
if (command === 'add' || command === 'ingest') {
  await add(rest);
} else if (command === 'check') {
  await check(rest);
} else if (command === 'remove-zips') {
  await removeZips();
} else {
  fail('Usage: npm run photos:add [-- "<folder>" --set <group-id> --force]   |   npm run photos:check -- "<folder>"   |   npm run photos:remove-zips');
}
