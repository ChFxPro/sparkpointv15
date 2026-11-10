// Puts each featured trip's hero still on its trip page, with its credit.
//
//   npm run stills
//
// For every trip page linked to the Gala trip kit (its `tripId`), this reads
// trips/<id>/pack/stills/stills.json, copies the hero still (the -1600 size)
// into show/media/trips/<id>/, and sets the page's photo and photo credit.
// The credit is the pack's own `credit` text: most stills are Creative Commons
// (CC BY / CC BY-SA), which require it wherever the photo is shown.
// Re-run it when a pack changes. Trips without a pack are left as they are.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const SHOW_DIR = resolve(here, '../show');
const CONTENT = resolve(SHOW_DIR, 'content.js');
const TRIPS = process.env.GALA_TRIPS || '/Users/jeffbannister/Code/sparkpoint/Branding/Gala/WorldOfConnections/trips';

const ctx = { window: {} };
vm.runInNewContext(readFileSync(CONTENT, 'utf8'), ctx);
const show = ctx.window.SHOW;

let changed = 0;
for (const s of show.slides) {
  if (s.type !== 'trip' || !s.tripId) continue;
  const packDir = resolve(TRIPS, s.tripId, 'pack/stills');
  const listFile = resolve(packDir, 'stills.json');
  if (!existsSync(listFile)) {
    console.log(`${s.tripId}: no stills yet`);
    continue;
  }
  const { stills = [] } = JSON.parse(readFileSync(listFile, 'utf8'));
  const still = stills.find((x) => x.hero) || stills[0];
  const file = still && (still.files?.['1600'] || Object.values(still.files || {})[0]);
  if (!file) {
    console.log(`${s.tripId}: stills.json lists no files`);
    continue;
  }
  const outDir = resolve(SHOW_DIR, 'media/trips', s.tripId);
  mkdirSync(outDir, { recursive: true });
  copyFileSync(resolve(packDir, file), resolve(outDir, file));
  s.photo = `trips/${s.tripId}/${file}`;
  s.photoCredit = still.credit ? `Photo: ${still.credit}` : '';
  if (!still.credit) console.log(`${s.tripId}: ${file} has no credit in stills.json — check its licence before showing it`);
  console.log(`${s.tripId}: ${file}  ·  ${s.photoCredit || '(no credit)'}`);
  changed++;
}

// Same header and layout the deck's editor writes (src/editor.js serialize).
writeFileSync(
  CONTENT,
  `// The show's content. Edit it in the deck (open index.html, press E), which saves this file.\n` +
    `// Hand edits are fine too: keep it valid JavaScript.\n` +
    `window.SHOW = ${JSON.stringify(show, null, 2)};\n`
);
console.log(`\n${changed} trip page(s) updated in show/content.js.`);
