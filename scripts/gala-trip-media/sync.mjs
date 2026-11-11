#!/usr/bin/env node
// Copies each Gala trip's finished web video from the trip kit into the site
// and rewrites src/data/galaTripMedia.json, which the trips section reads.
//
//   npm run gala:trip-media              # from the kit's default location
//   npm run gala:trip-media -- <tripsDir> # from another folder (same layout)
//   npm run gala:trip-media -- --check   # list what it would copy, change nothing
//   npm run gala:trip-media -- --all     # ignore WEB-READY.md (import every pack/web folder)
//
// It looks in <tripsDir>/<id>/pack/web/ for the promo-pack session's files:
//   <id>-loop-card…16x9….mp4 / .webm   silent card loop, 960×540, 6–8 s
//   <id>-loop-card…4x5….mp4 / .webm    silent card loop, 720×900
//   <id>-loop-poster….webp             a still from the loop (optional)
//   <id>-film-16x9-web.mp4             the full promo with music (optional)
//   <id>-film-16x9-web.vtt / .<lang>.vtt  captions for the film (optional)
//   <id>-film-9x16-web.mp4 (+ .vtt)    the vertical cut, played on portrait phones (optional)
//   web.json                           optional: per-file `creditLine` and `sources`, "captions": [...];
//                                      a film entry with "voiceover": true turns its captions on by default
//
// Credits: the site publishes only the attributions a licence requires, which
// means Creative Commons BY and BY-SA work (author, licence and source, linked).
// Stock footage and music (Envato Elements) and CC0 work need no credit, so they
// are left out, and so is web.json's team-facing `credit` line. The kit's
// LICENSES.md and web.json keep the full record.
// File names are matched loosely (any name starting with the right prefix and
// containing the aspect), so small naming changes don't break the sync.
//
// A trip with no pack/web folder is left out of the manifest, and its card keeps
// showing its poster still. Run it again whenever WEB-READY.md changes.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const check = args.includes('--check');
const tripsDir =
  args.find((a) => !a.startsWith('--')) ||
  '/Users/jeffbannister/Code/sparkpoint/Branding/Gala/WorldOfConnections/trips';
const outDir = path.join(repo, 'public/assets/events/gala/trips/video');
const manifestPath = path.join(repo, 'src/data/galaTripMedia.json');

// Loops over this size are refused: the cards promise lightweight video.
const MAX_LOOP_BYTES = 900 * 1024;
// The film loads only on request, but a runaway export would bloat the repo.
const MAX_FILM_BYTES = 40 * 1024 * 1024;
// The vertical (9:16) cut for phones: about 30 s at 720×1280.
const MAX_VERTICAL_FILM_BYTES = 8 * 1024 * 1024;

const TRIP_IDS = ['greece', 'iceland', 'cortona', 'scotland', 'south-africa', 'portugal', 'costa-rica', 'alaska'];

// Only trips the kit's WEB-READY.md marks "ready" are imported, so a trip whose
// files are still being built is never picked up half-done. Without a
// WEB-READY.md (a test folder), or with --all, every trip with a pack/web folder is.
function readyTrips() {
  const file = path.join(tripsDir, 'WEB-READY.md');
  if (args.includes('--all') || !fs.existsSync(file)) return null;
  const ready = new Set();
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 2 || !/^ready\b/i.test(cells[1])) continue;
    ready.add(cells[0].toLowerCase().replace(/\s+/g, '-'));
  }
  return ready;
}
const READY = readyTrips();

// Licences that require a visible credit: CC BY and its variants (BY-SA, BY-ND, BY-NC…).
// CC0 and stock licences don't.
const needsCredit = (licence) => /^CC BY\b/i.test(licence ?? '');

// "CC BY-SA 4.0" -> its deed URL; null for anything that isn't a CC licence.
function licenseUrl(licence) {
  const m = licence.match(/^CC (BY(?:-SA|-ND|-NC|-NC-SA|-NC-ND)?) (\d\.\d)$/i);
  if (m) return `https://creativecommons.org/licenses/${m[1].toLowerCase()}/${m[2]}/`;
  if (/^CC0/i.test(licence)) return 'https://creativecommons.org/publicdomain/zero/1.0/';
  return null;
}

// A loop's public credit, from web.json's per-file `creditLine` and `sources`:
// "Video: Envato Elements · Gullfoss with a rainbow: Diego Delso, CC BY-SA 4.0".
// Each " · " part naming a linked CC BY source becomes { label, author, sourceUrl,
// license, licenseUrl } so the card can link it. Every other part (the stock
// footage, CC0 work) is dropped; null when nothing is left to credit.
function loopCredit(meta, file) {
  const entry = meta?.files?.find((f) => f.file === file);
  if (!entry?.creditLine) return null;
  const sources = (entry.sources ?? []).filter((src) => src.url && needsCredit(src.licence));
  // Each part takes the next unused matching source, in order: two works can
  // share an author and licence (Iceland's two Diego Delso photos).
  const used = new Set();
  const parts = entry.creditLine
    .replace(/^Video:\s*/i, '')
    .split(' · ')
    .map((part) => {
      const src = sources.find((x) => !used.has(x) && part.includes(x.credit) && part.includes(x.licence));
      if (src) used.add(src);
      if (!src) return null;
      const label = part.slice(0, part.indexOf(src.credit)).replace(/:\s*$/, '').trim();
      return { label, author: src.credit, sourceUrl: src.url, license: src.licence, licenseUrl: licenseUrl(src.licence) };
    })
    .filter(Boolean);
  return parts.length ? parts : null;
}

// Rows of the "Video footage" table in <id>/pack/LICENSES.md under a CC BY licence:
// those need a visible credit (author, licence, link). CC0 rows don't.
// One entry per source, in the order they appear.
function ccCredits(file) {
  if (!fs.existsSync(file)) return [];
  const text = fs.readFileSync(file, 'utf8');
  const section = text.split(/^## /m).find((part) => part.startsWith('Video footage'));
  if (!section) return [];
  // Greedy URL match: Commons file names can contain parentheses.
  const link = (cell) => cell.match(/^\[(.+?)\]\((https?:.+)\)$/);
  const seen = new Set();
  const out = [];
  for (const line of section.split('\n')) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 5) continue;
    const [, shows, author, licence, source] = cells;
    const lic = link(licence);
    const src = link(source);
    if (!lic || !src || !needsCredit(lic[1]) || !/creativecommons\.org/.test(lic[2]) || seen.has(src[2])) continue;
    seen.add(src[2]);
    out.push({ shows, author, license: lic[1], licenseUrl: lic[2], sourceUrl: src[2] });
  }
  return out;
}

// A WebVTT file's cue text, joined into one plain paragraph (no timings, ids or tags).
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

function pick(files, id, test) {
  return files.filter((f) => f.startsWith(`${id}-`) && test(f)).sort()[0] ?? null;
}

const manifest = {};
const copies = [];
const problems = [];

for (const id of TRIP_IDS) {
  const webDir = path.join(tripsDir, id, 'pack', 'web');
  if (!fs.existsSync(webDir)) continue;
  if (READY && !READY.has(id)) {
    console.log(`${id}: has a pack/web folder but isn't marked ready in WEB-READY.md; skipped`);
    continue;
  }
  const files = fs.readdirSync(webDir);
  const isLoop = (f) => f.includes('loop-card');
  const loop = (aspect, ext) => pick(files, id, (f) => isLoop(f) && f.includes(aspect) && f.endsWith(ext));
  const entry = {};
  for (const aspect of ['16x9', '4x5']) {
    const mp4 = loop(aspect, '.mp4');
    const webm = loop(aspect, '.webm');
    if (!mp4 && !webm) continue;
    const sources = {};
    for (const [kind, file] of [['webm', webm], ['mp4', mp4]]) {
      if (!file) continue;
      const size = fs.statSync(path.join(webDir, file)).size;
      if (size > MAX_LOOP_BYTES) {
        problems.push(`${file} is ${Math.round(size / 1024)} KB (limit ${MAX_LOOP_BYTES / 1024} KB); skipped`);
        continue;
      }
      sources[kind] = file;
      copies.push([path.join(webDir, file), file]);
    }
    if (Object.keys(sources).length) entry[aspect === '16x9' ? 'loopWide' : 'loopTall'] = sources;
  }
  const poster = pick(files, id, (f) => f.includes('loop-poster') && f.endsWith('.webp'));
  if (poster) {
    entry.poster = poster;
    copies.push([path.join(webDir, poster), poster]);
  }
  // web.json, read early: a film entry marked `"voiceover": true` has spoken
  // words, so its captions are real speech and start switched on.
  let meta = null;
  const metaPath = path.join(webDir, 'web.json');
  if (fs.existsSync(metaPath)) {
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    } catch {
      meta = null; // reported below
    }
  }
  const hasVoiceover = (film) =>
    meta?.voiceover === true || (meta?.files ?? []).some((f) => f.file === film && f.voiceover === true);
  // Caption tracks named after a film: <film>.vtt or <film>.<lang>.vtt. Each
  // carries its cues as plain text, which the player gives screen readers as the
  // dialog's description (the films are music only, so the captions repeat the
  // text burned into the picture and start off).
  const tracksFor = (film) =>
    files
      .filter((f) => f.startsWith(film.replace(/\.mp4$/, '')) && f.endsWith('.vtt'))
      .sort()
      .map((file) => {
        const lang = file.match(/\.([a-z]{2})\.vtt$/)?.[1] ?? 'en';
        copies.push([path.join(webDir, file), file]);
        const track = { file, lang, text: vttText(fs.readFileSync(path.join(webDir, file), 'utf8')) };
        if (hasVoiceover(film)) track.speech = true;
        return track;
      });
  const film = pick(files, id, (f) => f.includes('film') && !f.includes('9x16') && f.endsWith('-web.mp4'));
  if (film) {
    const size = fs.statSync(path.join(webDir, film)).size;
    if (size > MAX_FILM_BYTES) {
      problems.push(`${film} is ${Math.round(size / 1048576)} MB (limit ${MAX_FILM_BYTES / 1048576} MB); skipped`);
    } else {
      entry.film = film;
      copies.push([path.join(webDir, film), film]);
      const tracks = tracksFor(film);
      if (tracks.length) entry.captions = tracks;
    }
  }
  const vertical = pick(files, id, (f) => f.includes('film-9x16') && f.endsWith('-web.mp4'));
  if (vertical && entry.film) {
    const size = fs.statSync(path.join(webDir, vertical)).size;
    if (size > MAX_VERTICAL_FILM_BYTES) {
      problems.push(`${vertical} is ${(size / 1048576).toFixed(1)} MB (limit ${MAX_VERTICAL_FILM_BYTES / 1048576} MB); skipped`);
    } else {
      entry.filmVertical = vertical;
      copies.push([path.join(webDir, vertical), vertical]);
      const tracks = tracksFor(vertical);
      if (tracks.length) entry.captionsVertical = tracks;
    }
  }
  if (fs.existsSync(metaPath)) {
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      for (const key of ['loopWide', 'loopTall']) {
        const src = entry[key];
        if (!src) continue;
        const credit = loopCredit(meta, src.webm ?? src.mp4) ?? loopCredit(meta, src.mp4);
        if (credit) src.credit = credit;
      }
    } catch (err) {
      problems.push(`${id}/pack/web/web.json could not be read: ${err.message}`);
    }
  }
  // CC-licensed work in the film, from the pack's licence log, credited in the film player.
  if (entry.film) {
    const credits = ccCredits(path.join(tripsDir, id, 'pack', 'LICENSES.md'));
    if (credits.length) entry.filmCredits = credits;
  }
  if (entry.loopWide || entry.loopTall || entry.film) manifest[id] = entry;
}

for (const p of problems) console.warn('!', p);
console.log(
  Object.keys(manifest).length
    ? Object.entries(manifest)
        .map(([id, e]) => `${id}: ${[e.loopWide && 'wide loop', e.loopTall && 'tall loop', e.poster && 'poster', e.film && 'film', e.captions && 'captions', e.filmVertical && 'vertical film', e.filmCredits && `${e.filmCredits.length} CC credits`].filter(Boolean).join(', ')}`)
        .join('\n')
    : `No trip has web video yet in ${tripsDir}. Cards keep their poster stills.`
);

if (check) process.exit(0);

fs.mkdirSync(outDir, { recursive: true });
for (const [from, name] of copies) fs.copyFileSync(from, path.join(outDir, name));
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${path.relative(repo, manifestPath)} and copied ${copies.length} file(s) to ${path.relative(repo, outDir)}/`);
