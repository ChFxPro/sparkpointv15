#!/usr/bin/env node
// Imports the Gala's all-trips trailer from the trip kit and writes
// src/data/galaTrailer.json, which the trailer slot on /events/sparkpoint-gala
// (#trailer) reads. The slot stays hidden while that file is `null`.
//
//   npm run gala:trailer                     # from the kit's _trailer folder
//   npm run gala:trailer -- --check          # show what it would import, change nothing
//   npm run gala:trailer -- --approved       # import even if WEB-READY.md has no ready trailer row
//   npm run gala:trailer -- <trailerDir>     # from another folder
//
// Separate from `npm run gala:trip-media` on purpose: it touches only the
// trailer's files, so it can ship while the trips' own re-renders are on hold.
//
// It looks in <trailerDir>/web/, <trailerDir>/pack/web/ or <trailerDir>/ for:
//   *trailer*16x9*.mp4 (or any *trailer*.mp4 that isn't 9x16)  the trailer, with sound
//   <same name>.vtt / .<lang>.vtt                              its captions (voiceover: on by default)
//   *poster*.webp|.jpg|.png, beside it or in <trailerDir>/ or <trailerDir>/email/;
//                                                              the widest one is the still the slot shows
//
// Credits: only what a licence requires (CC BY and CC BY-SA). Each shot in
// <trailerDir>/edit.json is looked up in its trip's pack/LICENSES.md; Envato
// Elements and CC0 shots get no credit, a CC BY shot is credited in the player,
// and a shot that can't be found is reported so someone can check it.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const check = args.includes('--check');
const tripsDir = '/Users/jeffbannister/Code/sparkpoint/Branding/Gala/WorldOfConnections/trips';
const trailerDir = args.find((a) => !a.startsWith('--')) || path.join(tripsDir, '_trailer');
const outDir = path.join(repo, 'public/assets/events/gala/trips/video');
const dataPath = path.join(repo, 'src/data/galaTrailer.json');

// Loaded only on request, but a runaway export would bloat the repo.
const MAX_FILM_BYTES = 40 * 1024 * 1024;
const MAX_POSTER_BYTES = 600 * 1024;

const problems = [];
const fail = (msg) => {
  console.error(`! ${msg}`);
  process.exit(1);
};

// Ready when WEB-READY.md has a row naming the trailer marked "ready", or with --approved.
function trailerReady() {
  if (args.includes('--approved')) return true;
  const file = path.join(tripsDir, 'WEB-READY.md');
  if (!fs.existsSync(file)) return false;
  return fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .map((line) => line.split('|').slice(1, -1).map((c) => c.trim()))
    .some((cells) => cells.length >= 2 && /trailer/i.test(cells[0]) && /^ready\b/i.test(cells[1]));
}

// A WebVTT file's cue text, joined into one plain paragraph.
function vttText(vtt) {
  return vtt
    .replace(/\r/g, '')
    .split(/\n{2,}/)
    .map((block) => block.split('\n').filter((l) => l && !/^WEBVTT|^NOTE|^STYLE|-->|^\d+$/.test(l.trim())))
    .filter((lines) => lines.length)
    .map((lines) => lines.join(' ').replace(/<[^>]+>/g, '').trim())
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// The trailer's shots, from edit.json, matched to their rows in each trip's licence log.
function shotCredits() {
  const editPath = [path.join(webDir, 'edit.json'), path.join(trailerDir, 'edit.json')].find((f) => fs.existsSync(f));
  if (!editPath) {
    problems.push('no edit.json beside the trailer: its shots could not be checked for required credits');
    return [];
  }
  const edit = JSON.parse(fs.readFileSync(editPath, 'utf8'));
  const link = (cell) => cell.match(/^\[(.+?)\]\((https?:.+)\)$/);
  const credits = [];
  for (const shot of edit.shots ?? []) {
    if (!shot.source) continue; // title and close cards
    const trip = String(shot.what ?? '').split(':')[0].trim();
    const licences = path.join(tripsDir, trip, 'pack', 'LICENSES.md');
    const row = fs.existsSync(licences)
      ? fs
          .readFileSync(licences, 'utf8')
          .split('\n')
          .filter((line) => line.startsWith('|'))
          .map((line) => line.split('|').slice(1, -1).map((c) => c.trim()))
          .find((cells) => cells[0] === shot.source || cells[4] === shot.source || cells[4]?.includes(shot.source))
      : null;
    if (!row) {
      problems.push(`shot "${shot.what}" (${shot.source}) isn't in ${trip}'s LICENSES.md: check whether it needs a credit`);
      continue;
    }
    const lic = link(row[3]);
    if (!lic || !/^CC BY\b/i.test(lic[1])) continue; // Envato Elements, CC0: no credit
    const src = link(row[4]);
    if (!src) {
      problems.push(`shot "${shot.what}" is ${lic[1]} but has no source link in ${trip}'s LICENSES.md`);
      continue;
    }
    if (credits.some((c) => c.sourceUrl === src[2])) continue;
    credits.push({ shows: row[1], author: row[2], license: lic[1], licenseUrl: lic[2], sourceUrl: src[2] });
  }
  return credits;
}

if (!trailerReady()) {
  console.log('The trailer is not marked ready in WEB-READY.md (pass --approved once Jeff has approved it). Nothing changed.');
  process.exit(0);
}

const webDir = [path.join(trailerDir, 'web'), path.join(trailerDir, 'pack', 'web'), trailerDir].find(
  (dir) => fs.existsSync(dir) && fs.readdirSync(dir).some((f) => /trailer/i.test(f) && f.endsWith('.mp4')),
);
if (!webDir) fail(`no trailer MP4 found in ${trailerDir} (looked in web/, pack/web/ and the folder itself)`);
const files = fs.readdirSync(webDir).sort();

const mp4s = files.filter((f) => /trailer/i.test(f) && f.endsWith('.mp4') && !/9x16|4x5|1x1/.test(f));
const film = mp4s.find((f) => /16x9/.test(f) && /web/.test(f)) ?? mp4s.find((f) => /16x9/.test(f)) ?? mp4s[0];
if (!film) fail(`no 16:9 trailer MP4 in ${webDir}`);
const filmBytes = fs.statSync(path.join(webDir, film)).size;
if (filmBytes > MAX_FILM_BYTES) fail(`${film} is ${(filmBytes / 1048576).toFixed(1)} MB (limit ${MAX_FILM_BYTES / 1048576} MB)`);

const base = film.replace(/\.mp4$/, '');
const captionFiles = files.filter((f) => f.startsWith(base) && f.endsWith('.vtt'));
if (!captionFiles.length) problems.push(`no captions (${base}.vtt): the trailer has a voiceover, so it should have them`);
const captions = captionFiles.map((file) => ({
  file,
  lang: file.match(/\.([a-z]{2})\.vtt$/)?.[1] ?? 'en',
  text: vttText(fs.readFileSync(path.join(webDir, file), 'utf8')),
  // The trailer carries a voiceover, so its captions are speech and start on.
  speech: true,
}));

// The poster can sit beside the video, in the trailer folder or in its email/ folder.
// The widest one wins (…poster-1200x676.jpg over …-600x338.jpg).
const posterPaths = [webDir, trailerDir, path.join(trailerDir, 'email')]
  .filter((dir, i, all) => fs.existsSync(dir) && all.indexOf(dir) === i)
  .flatMap((dir) => fs.readdirSync(dir).filter((f) => /poster/i.test(f) && /\.(webp|jpe?g|png)$/i.test(f)).map((f) => path.join(dir, f)));
const width = (f) => Number(path.basename(f).match(/(\d{3,4})x\d{3,4}/)?.[1] ?? 0);
const posterPath = posterPaths.sort((a, b) => width(b) - width(a) || a.localeCompare(b))[0] ?? null;
const poster = posterPath ? path.basename(posterPath) : null;
if (!poster) problems.push('no poster image: the slot will show a plain panel until one is added');
else if (fs.statSync(posterPath).size > MAX_POSTER_BYTES)
  problems.push(`${poster} is over ${MAX_POSTER_BYTES / 1024} KB: consider a WebP`);

const filmCredits = shotCredits();
// The email's poster has its own play button and "Watch the trailer" drawn in,
// so the page shows it without adding a second cue.
const posterHasCue = Boolean(poster && /email/i.test(poster));
const data = {
  film,
  ...(captions.length ? { captions } : {}),
  ...(poster ? { poster } : {}),
  ...(posterHasCue ? { posterHasCue } : {}),
  ...(filmCredits.length ? { filmCredits } : {}),
};
const copies = [film, ...captionFiles].map((name) => [path.join(webDir, name), name]);
if (posterPath) copies.push([posterPath, poster]);

for (const p of problems) console.warn('!', p);
console.log(`trailer: ${film} (${(filmBytes / 1048576).toFixed(1)} MB), ${captions.length} caption track(s), ${poster ? `poster ${poster}` : 'no poster'}, ${filmCredits.length} CC credit(s)`);
if (check) process.exit(0);

fs.mkdirSync(outDir, { recursive: true });
for (const [from, name] of copies) fs.copyFileSync(from, path.join(outDir, name));
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n');
console.log(`Wrote ${path.relative(repo, dataPath)} and copied ${copies.length} file(s) to ${path.relative(repo, outDir)}/`);
