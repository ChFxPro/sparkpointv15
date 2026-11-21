// Builds each trip's still photos from the picks in stills.picks.json:
// downloads the original from Wikimedia Commons, reads its licence and author
// from the Commons API (not typed by hand), and writes WebP at 800/1600/2400 px
// wide to <trip>/pack/stills/, plus stills.json (for the website and deck) and
// the pack's LICENSES.md.
//
//   npm run trips:stills                # every trip
//   npm run trips:stills -- greece      # some trips
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CACHE, TRIPS_DIR, exists, fetchWithRetry, here, loadTrips, packDir, require, sleep, writeJson } from './lib.mjs';
import { writeLicenses } from './licenses.mjs';

const sharp = require('sharp');
const WIDTHS = [800, 1600, 2400];
// Licences that allow commercial use with attribution. Anything else is refused.
const ALLOWED = /^(CC0|Public domain|PD|CC BY(-SA)? \d(\.\d)?)/i;

const strip = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function commonsInfo(title) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  for (const [k, v] of Object.entries({ action: 'query', format: 'json', titles: title, prop: 'imageinfo', iiprop: 'url|size|extmetadata' })) u.searchParams.set(k, v);
  const page = Object.values((await fetchWithRetry(u, { json: true })).query.pages)[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) throw new Error(`Not found on Commons: ${title}`);
  const m = ii.extmetadata;
  return {
    title: page.title, url: ii.url, page: ii.descriptionurl, width: ii.width, height: ii.height,
    license: m.LicenseShortName?.value ?? '', licenseUrl: m.LicenseUrl?.value ?? '',
    author: strip(m.Artist?.value) || 'Unknown', credit: strip(m.Credit?.value),
    attributionRequired: m.AttributionRequired?.value === 'true',
  };
}

async function original(info) {
  await mkdir(CACHE, { recursive: true });
  const file = join(CACHE, decodeURIComponent(info.url.split('/').pop()));
  if (!(await exists(file))) {
    await writeFile(file, await fetchWithRetry(info.url));
    await sleep(1500);
  }
  return file;
}

// Very wide panoramas and portrait frames are cropped to a usable landscape
// shape (2:1 at most, 3:2 at least) around `focus` ([x, y] from 0 to 1).
function cropBox(w, h, pick) {
  if (pick.crop) {
    const [l, t, cw, ch] = pick.crop;
    return { left: Math.round(l * w), top: Math.round(t * h), width: Math.round(cw * w), height: Math.round(ch * h) };
  }
  const [fx, fy] = pick.focus ?? [0.5, 0.5];
  const aspect = w / h;
  const target = aspect > 2 ? 2 : aspect < 1.5 ? 1.5 : aspect;
  let cw = w, ch = h;
  if (target < aspect) cw = Math.round(h * target); else ch = Math.round(w / target);
  const left = Math.round(Math.min(Math.max(fx * w - cw / 2, 0), w - cw));
  const top = Math.round(Math.min(Math.max(fy * h - ch / 2, 0), h - ch));
  return { left, top, width: cw, height: ch };
}

async function buildTrip(trip, picks) {
  const out = packDir(trip.id, 'stills');
  await mkdir(out, { recursive: true });
  const stills = [];
  for (const [i, pick] of picks.entries()) {
    const info = await commonsInfo(pick.commons);
    if (!ALLOWED.test(info.license)) throw new Error(`${trip.id}: ${info.title} has licence "${info.license}", not allowed`);
    const src = await original(info);
    const box = cropBox(info.width, info.height, pick);
    if (box.width < 2400) throw new Error(`${trip.id}: ${info.title} is only ${box.width}px wide after cropping`);
    const base = `${trip.id}-${String(i + 1).padStart(2, '0')}-${pick.slug}`;
    const files = {};
    for (const w of WIDTHS) {
      const name = `${base}-${w}.webp`;
      await sharp(src, { limitInputPixels: false }).rotate().extract(box).resize({ width: w }).webp({ quality: w > 1600 ? 80 : 82 }).toFile(join(out, name));
      files[w] = name;
    }
    stills.push({
      file: base, files, hero: Boolean(pick.hero), place: pick.place, alt: pick.alt,
      width: 2400, height: Math.round((2400 * box.height) / box.width),
      credit: `${info.author} / ${info.license}, via Wikimedia Commons`,
      source: { site: 'Wikimedia Commons', title: info.title, page: info.page, author: info.author, license: info.license, licenseUrl: info.licenseUrl, original: `${info.width}×${info.height}`, crop: box },
    });
    console.log(`${trip.id}: ${base} (${info.license}, ${info.author})`);
  }
  await writeJson(join(out, 'stills.json'), { trip: trip.id, generated: new Date().toISOString().slice(0, 10), stills });
  await writeLicenses(trip);
  return stills;
}

const allPicks = JSON.parse(await readFile(join(here, 'stills.picks.json'), 'utf8'));
const { trips } = await loadTrips();
const wanted = process.argv.slice(2);
for (const trip of trips) {
  if (wanted.length && !wanted.includes(trip.id)) continue;
  const picks = allPicks[trip.id];
  if (!picks?.length) { console.warn(`${trip.id}: no picks yet`); continue; }
  await buildTrip(trip, picks);
}
console.log(`Stills written under ${TRIPS_DIR}/<trip>/pack/stills/`);
