// Video for the unlisted Collaboration Lab media page (/collaboration-lab/media).
//
//   npm run collab:video -- "<event folder>"
//
// The event folder is the one holding `treated/` (the camera files) and `share-copies/`
// (the 1080p program copies, b-roll previews, and posters made with ffmpeg). Each entry
// in the `videos` array of src/data/collabLabMedia.json names its `source` (relative to
// that folder), the `file` name it downloads as, and its `poster` / `preview` (in
// share-copies/). This uploads all of them to the public-read `event-media` bucket
// under collaboration-lab-2026/ and records each download's size in the JSON.
//
// Files over 6 MB go up through Supabase's resumable (TUS) endpoint in 6 MB chunks, so
// a dropped connection resumes where it stopped: run it again. A file already in the
// bucket at the same size is skipped. Needs a Supabase secret key (sb_secret_…), read
// from SUPABASE_SECRET_KEY or asked for, the same as `npm run photos:add`.
//
// The 4K camera originals of the program (51 GB and 19 GB) are not uploaded: they're
// kept on the NAS and shared from there on request. Paste a NAS share link into an
// entry's `original.url` to show it on the page.
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';

const PROJECT_ID = 'suqtfbculwuetfdhdgdh';
const BUCKET = 'event-media';
const PREFIX = 'collaboration-lab-2026';
const STORAGE = `https://${PROJECT_ID}.supabase.co/storage/v1`;
const CHUNK = 6 * 1024 * 1024; // Supabase's TUS endpoint requires exactly 6 MB chunks
const dataPath = path.join(process.cwd(), 'src/data/collabLabMedia.json');
const MIME = { '.mp4': 'video/mp4', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const gb = (bytes) => (bytes >= 1e9 ? `${(bytes / 1e9).toFixed(2)} GB` : `${(bytes / 1e6).toFixed(1)} MB`);

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
          // Terminals wrap a paste in bracketed-paste markers (ESC[200~ … ESC[201~) while in
          // raw mode; drop them and any other control characters so only the key remains.
          resolve(value.replace(/\u001b\[20[01]~/g, '').replace(/[\u0000-\u001f\u007f]/g, '').trim());
          return;
        }
        if (ch === '\u0003') process.exit(130);
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

// sb_secret_ keys aren't JWTs: they go on `apikey` only. Legacy JWTs go on both.
const authHeaders = (key) => (key.startsWith('sb_') ? { apikey: key } : { apikey: key, Authorization: `Bearer ${key}` });

const cleanPath = (input) =>
  path.resolve(input.trim().replace(/^['"]|['"]$/g, '').replace(/\\(.)/g, '$1').replace(/^~(?=\/)/, process.env.HOME ?? '~'));

const objectName = (name) => `${PREFIX}/${name}`;
const publicUrl = (name) => `${STORAGE}/object/public/${BUCKET}/${objectName(name)}`;

async function sizeInBucket(name) {
  const res = await fetch(publicUrl(name), { method: 'HEAD' });
  return res.ok ? Number(res.headers.get('content-length')) : null;
}

function refused(res, detail, name) {
  if (res.status === 401 || res.status === 403 || /invalid|jwt|signature|unauthorized/i.test(detail)) {
    fail(`Supabase refused the key (${res.status}). Check that you pasted a secret key for the SparkPoint V15 project.`);
  }
  if (res.status === 413 || /maximum allowed size|too large/i.test(detail)) {
    fail(
      `${name} is larger than Supabase will accept (${res.status}). Raise the global upload limit under\n` +
        `Supabase Dashboard > Storage > Settings ("Upload file size limit") to at least 8 GB, then run this again.`,
    );
  }
  if (/bucket not found/i.test(detail)) {
    fail('The event-media bucket does not exist yet. Apply supabase/migrations/20261029_event_media_bucket.sql first.');
  }
  throw new Error(`Upload of ${name} failed (${res.status}): ${detail}`);
}

async function uploadSmall(key, file, name) {
  const res = await fetch(`${STORAGE}/object/${BUCKET}/${objectName(name)}`, {
    method: 'POST',
    headers: {
      ...authHeaders(key),
      'Content-Type': MIME[path.extname(name).toLowerCase()] ?? 'application/octet-stream',
      'Cache-Control': 'max-age=86400',
      'x-upsert': 'true',
    },
    body: fs.readFileSync(file),
  });
  if (!res.ok) refused(res, await res.text(), name);
}

const b64 = (text) => Buffer.from(text).toString('base64');

// Resumable upload (TUS 1.0). The upload URL is kept next to the source file's name in
// a small state file so a second run picks up the same upload instead of starting over.
const statePath = path.join(process.cwd(), '.photo-share-cache', 'collab-lab-tus.json');
const readState = () => (fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : {});
const writeState = (state) => {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));
};

async function uploadLarge(key, file, name, size) {
  const tus = { ...authHeaders(key), 'Tus-Resumable': '1.0.0' };
  const state = readState();
  const stateKey = `${name}:${size}`;
  let location = state[stateKey];
  let offset = 0;

  if (location) {
    const head = await fetch(location, { method: 'HEAD', headers: tus });
    if (head.ok) offset = Number(head.headers.get('upload-offset') ?? 0);
    else location = undefined;
  }
  if (!location) {
    const res = await fetch(`${STORAGE}/upload/resumable`, {
      method: 'POST',
      headers: {
        ...tus,
        'Upload-Length': String(size),
        'x-upsert': 'true',
        'Upload-Metadata': [
          `bucketName ${b64(BUCKET)}`,
          `objectName ${b64(objectName(name))}`,
          `contentType ${b64(MIME[path.extname(name).toLowerCase()] ?? 'application/octet-stream')}`,
          `cacheControl ${b64('86400')}`,
        ].join(','),
      },
    });
    if (res.status !== 201) refused(res, await res.text(), name);
    location = new URL(res.headers.get('location'), `${STORAGE}/upload/resumable/`).toString();
    writeState({ ...state, [stateKey]: location });
  }

  const handle = await fs.promises.open(file, 'r');
  const buffer = Buffer.alloc(CHUNK);
  const started = Date.now();
  const startOffset = offset;
  try {
    while (offset < size) {
      const { bytesRead } = await handle.read(buffer, 0, Math.min(CHUNK, size - offset), offset);
      let res;
      for (let attempt = 1; ; attempt += 1) {
        try {
          res = await fetch(location, {
            method: 'PATCH',
            headers: { ...tus, 'Upload-Offset': String(offset), 'Content-Type': 'application/offset+octet-stream' },
            body: buffer.subarray(0, bytesRead),
          });
          if (res.ok || attempt >= 5 || (res.status >= 400 && res.status < 500 && res.status !== 409)) break;
        } catch (error) {
          if (attempt >= 5) throw error;
        }
        await new Promise((r) => setTimeout(r, 2000 * attempt));
        // Ask the server where it got to before retrying.
        const head = await fetch(location, { method: 'HEAD', headers: tus });
        if (head.ok) offset = Number(head.headers.get('upload-offset') ?? offset);
      }
      if (!res.ok) refused(res, await res.text(), name);
      offset = Number(res.headers.get('upload-offset') ?? offset + bytesRead);
      const rate = (offset - startOffset) / Math.max(1, (Date.now() - started) / 1000);
      process.stdout.write(`\r    ${gb(offset)} of ${gb(size)}  (${(rate / 1e6).toFixed(1)} MB/s)      `);
    }
  } finally {
    await handle.close();
  }
  process.stdout.write('\n');
  const next = readState();
  delete next[stateKey];
  writeState(next);
}

async function put(key, file, name) {
  const size = fs.statSync(file).size;
  if ((await sizeInBucket(name)) === size) {
    console.log(`  = ${name} (${gb(size)}) already uploaded`);
    return size;
  }
  console.log(`  ↑ ${name} (${gb(size)})`);
  if (size > CHUNK) await uploadLarge(key, file, name, size);
  else await uploadSmall(key, file, name);
  return size;
}

async function main() {
  const args = process.argv.slice(2);
  let folderArg = args.find((a) => !a.startsWith('--'));
  if (!folderArg) folderArg = await ask('Drag the Collaboration Lab folder (the one holding treated/ and share-copies/) into this window, then press Return: ');
  const folder = cleanPath(folderArg);
  const copies = path.join(folder, 'share-copies');
  if (!fs.existsSync(copies)) fail(`No share-copies/ folder in ${folder}.`);

  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const missing = data.videos.flatMap((v) =>
    [path.join(folder, v.source), path.join(copies, v.poster), ...(v.preview ? [path.join(copies, v.preview)] : [])].filter((f) => !fs.existsSync(f)),
  );
  if (missing.length) fail(`Missing files (still encoding?):\n  ${missing.join('\n  ')}`);

  const key = await secretKey();
  console.log(`\nUploading ${data.videos.length} videos to ${BUCKET}/${PREFIX}…`);
  for (const video of data.videos) {
    console.log(`\n${video.title}`);
    await put(key, path.join(copies, video.poster), video.poster);
    if (video.preview) await put(key, path.join(copies, video.preview), video.preview);
    video.bytes = await put(key, path.join(folder, video.source), video.file);
    fs.writeFileSync(dataPath, `${JSON.stringify(data, null, 2)}\n`);
  }
  console.log(`\nDone. Sizes are recorded in src/data/collabLabMedia.json — commit it through a pull request.`);
}

await main();
