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
//   rebuilds and uploads the ZIPs (every photo, plus one per group), and records the
//   photos in the JSON. The page shows them once that JSON change is merged.
//
//   Re-running is safe and resumes: a photo already recorded (same file name and size)
//   is not added twice, and only files missing from the bucket are uploaded (--force
//   remakes and re-uploads everything in the folder).
//
//   Flags, all optional: npm run photos:add -- "<folder>" --set <group-id> [--force]
//
//   npm run photos:zip
//     Rebuilds and uploads only the ZIPs — run after moving photos between groups or
//     editing captions in the JSON (each ZIP carries a credit/caption read-me).
//
// The key: a secret key (sb_secret_…) from Supabase Dashboard > Project Settings >
// API Keys, or the legacy service_role JWT. It's read from SUPABASE_SECRET_KEY (or
// SUPABASE_SERVICE_ROLE_KEY) if set, otherwise asked for. Never commit it.
//
// Processed files are cached in .photo-share-cache/ (gitignored); on another machine
// the ZIP step re-downloads whatever it's missing from the bucket. If a ZIP upload is
// refused as too large, raise the upload limit under Storage > Settings in Supabase.
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';
import { execFileSync } from 'node:child_process';
import * as zlib from 'node:zlib';

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
const setZipName = (data, set) => `${data.downloadPrefix}-${set.id}.zip`;
const DEFAULT_ALT = 'A moment from the 2026 WNC Regional Rural Health Convening at Deerwoode Reserve in Brevard, NC.';
const IMAGE_EXT = /\.(jpe?g|png|webp|tiff?)$/i;
const MIME = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.zip': 'application/zip' };
const mb = (bytes) => `${(bytes / 1e6).toFixed(1)} MB`;

// zlib.crc32 needs Node 20.15+; keep a table fallback for older 20.x.
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 =
  zlib.crc32 ??
  ((buf) => {
    let c = 0xffffffff;
    for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
    return (c ^ 0xffffffff) >>> 0;
  });

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
    const hint =
      res.status === 413 || /too large|exceeded/i.test(detail)
        ? ' — raise the upload limit under Storage > Settings in the Supabase dashboard.'
        : '';
    throw new Error(`Upload of ${name} failed (${res.status}): ${detail}${hint}`);
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

async function add(args) {
  const { default: sharp } = await import('sharp');
  const data = readData();
  const force = args.includes('--force');
  const setFlag = args.indexOf('--set');
  const flagSet = setFlag >= 0 ? args[setFlag + 1] : undefined;
  if (flagSet && !data.sets.some((s) => s.id === flagSet)) {
    fail(`Unknown group "${flagSet}". Groups: ${data.sets.map((s) => s.id).join(', ')} — or leave out --set to pick or create one.`);
  }

  let folderArg = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--set');
  if (!folderArg) folderArg = await ask('Drag the photo folder into this window, then press Return: ');
  const folder = cleanPath(folderArg);
  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) fail(`Not a folder: ${folder}`);

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
  console.log(`\nAdding ${batch.length} photos…`);
  const added = [];
  let skippedBlank = 0;
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
      const next = Math.max(0, ...data.photos.map((p) => Number(p.id))) + 1;
      photo = { id: String(next).padStart(2, '0'), source: name, sourceBytes, set, title: '', alt: DEFAULT_ALT };
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

  if (added.length || force || unchanged < batch.length) {
    console.log('\nRebuilding the download-all ZIPs…');
    await zipAll(key);
  }

  const counts = data.sets
    .map((s) => [s.title, added.filter((p) => p.set === s.id).length])
    .filter(([, n]) => n)
    .map(([t, n]) => `${n} in ${t}`)
    .join(', ');
  console.log(`\nDone. ${added.length} new photo${added.length === 1 ? '' : 's'}${counts ? ` (${counts})` : ''}.`);
  if (unchanged) console.log(`${unchanged} already uploaded, left as is.`);
  if (skippedBlank) console.log(`${skippedBlank} blank image${skippedBlank === 1 ? '' : 's'} skipped.`);
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

// ── ZIPs ──

function createStoredZip(entries) {
  const local = [];
  const central = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, 'utf8');
    const crc = crc32(data);
    const head = Buffer.alloc(30);
    head.writeUInt32LE(0x04034b50, 0);
    head.writeUInt16LE(20, 4);
    head.writeUInt16LE(0x0800, 6); // UTF-8 names
    head.writeUInt16LE(0, 8); // stored: JPEGs don't deflate
    head.writeUInt16LE(0x0021, 12); // 1980-01-01, so rebuilds are byte-identical
    head.writeUInt32LE(crc, 14);
    head.writeUInt32LE(data.length, 18);
    head.writeUInt32LE(data.length, 22);
    head.writeUInt16LE(nameBuf.length, 26);
    local.push(head, nameBuf, data);

    const dir = Buffer.alloc(46);
    dir.writeUInt32LE(0x02014b50, 0);
    dir.writeUInt16LE(20, 4);
    dir.writeUInt16LE(20, 6);
    dir.writeUInt16LE(0x0800, 8);
    dir.writeUInt16LE(0, 10);
    dir.writeUInt16LE(0x0021, 14);
    dir.writeUInt32LE(crc, 16);
    dir.writeUInt32LE(data.length, 20);
    dir.writeUInt32LE(data.length, 24);
    dir.writeUInt16LE(nameBuf.length, 28);
    dir.writeUInt32LE(offset, 42);
    central.push(dir, nameBuf);
    offset += head.length + nameBuf.length + data.length;
  }
  // Plain (non-Zip64) ZIP: fine up to 4 GB and 65,535 entries.
  const centralBuf = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(centralBuf.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, centralBuf, end]);
}

async function buildZip(data, zipName, photos, heading) {
  const folder = zipName.replace(/\.zip$/i, '');
  const sets = Object.fromEntries(data.sets.map((s) => [s.id, s.title]));
  const note = [
    '2026 WNC Regional Rural Health Convening',
    'October 1, 2026 · Deerwoode Reserve · Brevard, NC',
    heading,
    '',
    `${data.creditLine}.`,
    '',
    'USING THESE PHOTOS',
    ...data.usage.map((line) => `- ${line}`),
    `- Credit line: ${data.creditLine}`,
    '',
    'PHOTOS',
    ...photos.flatMap((p) => ['', downloadName(data, p), [sets[p.set], p.title].filter(Boolean).join(' · '), p.alt]),
    '',
    `Need a full-resolution original for print? ${data.contactEmail}`,
    '',
  ].join('\n');

  const entries = [{ name: `${folder}/READ-ME — credit and captions.txt`, data: Buffer.from(note, 'utf8') }];
  for (const photo of photos) {
    entries.push({ name: `${folder}/${downloadName(data, photo)}`, data: await cached(downloadName(data, photo)) });
  }
  return createStoredZip(entries);
}

async function zipAll(key) {
  const data = readData();
  const zips = [[data.zipName, data.photos, 'All photos', null]];
  for (const set of data.sets) {
    const photos = data.photos.filter((p) => p.set === set.id);
    if (photos.length) zips.push([setZipName(data, set), photos, set.title, set.id]);
  }
  data.zipBytes = {};
  for (const [name, photos, heading, setId] of zips) {
    const zip = await buildZip(data, name, photos, heading);
    await upload(key, name, zip);
    data.zipBytes[setId ?? 'all'] = zip.length;
    console.log(`  zip ${heading}: ${photos.length} photos, ${mb(zip.length)}`);
  }
  writeData(data);
}

// ── Entry ──

const [command, ...rest] = process.argv.slice(2);
if (command === 'add' || command === 'ingest') {
  await add(rest);
} else if (command === 'zip') {
  await zipAll(await secretKey());
  console.log('\nDone. Commit the updated src/data/ruralHealthPhotoShare.json so the page shows the new ZIP sizes.');
} else {
  fail('Usage: npm run photos:add [-- "<folder>" --set <group-id> --force]   |   npm run photos:zip');
}
