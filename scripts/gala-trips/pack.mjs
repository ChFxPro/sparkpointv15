// Builds a trip's promo pack in <trip>/pack/: journey map (PNG + MP4), promo
// video (16:9 master, 30 s 9:16 and 1:1 cuts), social stills, fact-sheet PDF,
// captions and LICENSES.md. Stills come first (npm run trips:stills).
//
//   npm run trips:pack -- greece                 # everything for one trip
//   npm run trips:pack -- greece --only=social,factsheet
//   npm run trips:audio -- greece             # re-mix the sound only (see audio.mjs)
//   npm run trips:pack -- greece --no-music
//   npm run trips:pack -- greece --only=video --cuts=9x16,1x1
//
// Prices: shown only when trips.json `showPrices` is true, and then only the
// trip's `publicPrice`. `listPrice` is internal and never used here.
// A timed-out call from a page that has already been closed shouldn't end the run.
process.on('unhandledRejection', (e) => console.warn(`ignored stray error: ${e?.message ?? e}`));
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { CACHE, UA, exists, here, loadTrips, packDir, writeJson } from './lib.mjs';
import { writeLicenses } from './licenses.mjs';
import { buildMap, factsLine } from './map.mjs';
import { ffmpeg, launch, open } from './render.mjs';
import { buildVideo } from './video.mjs';
import { mixTrip } from './audio.mjs';
import { scoreTrip } from './score.mjs';

const WHEN = 'Friday, December 11, 2026 · Connestee Falls';
const GALA = 'A World of Connections, the SparkPoint Gala';

const args = process.argv.slice(2);
const ids = args.filter((a) => !a.startsWith('--'));
const only = args.find((a) => a.startsWith('--only='))?.slice(7).split(',');
const want = (step) => !only || only.includes(step);
const noMusic = args.includes('--no-music');
const cuts = args.find((a) => a.startsWith('--cuts='))?.slice(7).split(',');

const config = JSON.parse(await readFile(join(here, 'packs.json'), 'utf8'));
const data = await loadTrips();

function priceFor(trip) {
  if (!data.showPrices) return null;
  if (!trip.publicPrice) throw new Error(`${trip.id}: showPrices is on but trip has no publicPrice (listPrice is internal and is never shown)`);
  return typeof trip.publicPrice === 'number' ? `$${trip.publicPrice.toLocaleString('en-US')}` : String(trip.publicPrice);
}

// Research-session coordinates in trips.json win over packs.json.
function withResearch(trip, pack) {
  const research = Array.isArray(trip.stops)
    ? trip.stops.filter((s) => typeof s === 'object' && s.lat != null && !/\(arrival\)/i.test(s.name ?? ''))
    : [];
  const key = (n) => n.toLowerCase().split(/[,(/]/)[0].trim();
  const stops = pack.stops.map((s) => {
    const r = research.find((x) => key(x.name) === key(s.name)) ?? research.find((x) => key(x.name).startsWith(key(s.name)));
    if (!r) return s;
    const note = r.nights > 0 ? `${r.nights} night${r.nights > 1 ? 's' : ''}` : s.note;
    return { ...s, at: [Number(r.lon ?? r.lng), Number(r.lat)], note };
  });
  return { ...pack, stops };
}

function terms(trip) {
  const t = [
    trip.id === 'alaska' ? 'Airfare is not included.' : 'Land only: hotels, tours and transfers on the ground. Airfare is not included.',
    `For ${trip.travelers === 4 ? 'four' : 'two'} travelers. Travelers or extra nights can be added on request.`,
    'Booked with a travel specialist. Travel any time within three years.',
  ];
  if (trip.id === 'alaska') t.push('Alaska cruises sail in summer.');
  return t;
}

async function music(spec) {
  if (noMusic || !spec?.commons) return null;
  const key = createHash('sha1').update(spec.commons).digest('hex').slice(0, 10);
  const file = join(CACHE, 'music', `${key}.m4a`);
  const meta = join(CACHE, 'music', `${key}.json`);
  if (!(await exists(file))) {
    const u = new URL('https://commons.wikimedia.org/w/api.php');
    for (const [k, v] of Object.entries({ action: 'query', format: 'json', titles: spec.commons, prop: 'videoinfo', viprop: 'url|extmetadata|derivatives' })) u.searchParams.set(k, v);
    const res = await (await fetch(u, { headers: { 'User-Agent': UA } })).json();
    const page = Object.values(res.query.pages)[0];
    const v = page.videoinfo[0];
    // Video files: take the small transcode's audio. Audio files: the original.
    const src = /\.webm$/i.test(page.title) ? (v.derivatives.find((d) => /480p\.vp9\.webm$/.test(d.src))?.src ?? v.url) : v.url;
    await mkdir(join(CACHE, 'music'), { recursive: true });
    await ffmpeg(['-user_agent', UA, '-i', src, '-vn', '-c:a', 'aac', '-b:a', '256k', file]);
    const strip = (h = '') => h.replace(/<[^>]+>/g, '').trim();
    const title = page.title.replace(/^File:/, '').replace(/\.(webm|mp3|oga|ogg)$/i, '').replace(/ \((MacLeod, Kevin)\)/, '').replace(/ \(ISRC [^)]+\)/, '').replace(/ \(HD 1080\)/, '');
    await writeJson(meta, { title, author: strip(v.extmetadata.Artist?.value).split('\n')[0], license: v.extmetadata.LicenseShortName?.value, page: v.descriptionurl });
  }
  return { file, start: spec.start ?? 0, credit: JSON.parse(await readFile(meta, 'utf8')) };
}

async function stillsOf(trip) {
  return JSON.parse(await readFile(packDir(trip.id, 'stills', 'stills.json'), 'utf8')).stills;
}
const url = (trip, s, w = 2400) => pathToFileURL(packDir(trip.id, 'stills', s.files[w])).href;

async function buildSocial(browser, trip, pack, price) {
  const stills = await stillsOf(trip);
  const hero = stills[0];
  const page = await browser.newPage();
  for (const [variant, W, H, name] of [['portrait', 1080, 1350, '1080x1350'], ['sq', 1080, 1080, '1080x1080'], ['story', 1080, 1920, '1080x1920']]) {
    await open(page, 'social.html', { width: W, height: H, global: 'SOCIAL', data: {
      W, H, variant, price, when: WHEN, photo: url(trip, hero), focus: pack.socialFocus ?? '50% 50%', credit: hero.credit,
      trip: { connection: trip.connection, name: trip.name, line: pack.line, facts: factsLine(trip), highlights: pack.highlights },
    } });
    const out = packDir(trip.id, 'social', `${trip.id}-social-${name}.png`);
    await mkdir(packDir(trip.id, 'social'), { recursive: true });
    await page.screenshot({ path: out });
    console.log(`${trip.id}: social ${name}`);
  }
  await page.close();
}

async function buildFactsheet(browser, trip, pack, price) {
  const stills = await stillsOf(trip);
  const page = await browser.newPage();
  await open(page, 'factsheet.html', { width: 816, height: 1056, global: 'SHEET', data: {
    trip: { connection: trip.connection, name: trip.name, line: pack.line }, price,
    hero: url(trip, stills[0]), heroFocus: pack.sheetFocus ?? '50% 55%',
    facts: [...factsLine(trip), trip.country === 'USA' ? 'Summer sailing' : trip.country],
    hook: pack.hook, summary: trip.summary, included: trip.included, terms: terms(trip),
    map: pathToFileURL(packDir(trip.id, 'map', `${trip.id}-journey-map-plain-4x3.png`)).href,
    stops: pack.stops, thumbs: stills.slice(1, 4).map((s) => url(trip, s, 800)),
    credits: stills.slice(0, 4).map((s) => `${s.place}: ${s.credit.replace(', via Wikimedia Commons', '')}`),
  } });
  const out = packDir(trip.id, 'factsheet', `${trip.id}-fact-sheet.pdf`);
  await mkdir(packDir(trip.id, 'factsheet'), { recursive: true });
  await page.pdf({ path: out, width: '8.5in', height: '11in', printBackground: true, pageRanges: '1' });
  await page.screenshot({ path: out.replace(/\.pdf$/, '-preview.png') });
  await page.close();
  console.log(`${trip.id}: fact sheet`);
}

async function writeCaptions(trip, pack, price) {
  const stills = await stillsOf(trip);
  const video = (await exists(packDir(trip.id, 'video', 'sources.json'))) ? JSON.parse(await readFile(packDir(trip.id, 'video', 'sources.json'), 'utf8')) : null;
  const who = trip.travelers === 4 ? 'four' : 'two';
  const footage = video ? [...new Map(video.clips.filter((c) => c.kind === 'clip' && c.author !== 'Supplied by SparkPoint').map((c) => [c.author, `${c.author} (${c.license})`])).values()] : [];
  const photos = [...new Map(stills.map((s) => [s.source.author, `${s.source.author} (${s.source.license})`])).values()];
  const music = video?.music && video.music.author !== 'Envato Elements' ? `Music: "${video.music.title}" by ${video.music.author} (${video.music.license}).` : '';
  const priceLine = price ? `\n${price} for ${who}.` : '';
  const md = `# ${trip.title}: ready-to-post captions

Copy rules for every post: no auction words; no price unless the price switch is on; never name the trip provider;
don't say the trips can be bought after the Gala. Credits are required by the photo and footage licences, so keep the
credit line (a first comment is fine on Instagram).

## Feed post (Instagram, Facebook, LinkedIn): with the 1080×1350 or 1080×1080 still, or the 30 s video

Connection ${trip.connection}: ${trip.title}.

${pack.hook}

${trip.nights} nights for ${who}. ${pack.highlights.join('. ')}.${priceLine}

Every trip is available to every guest at a set price. Choose yours at ${GALA}, Friday, December 11, at Connestee Falls Country Club. Tickets: yoursparkpoint.org/events/sparkpoint-gala

Every journey connects back home.

#SparkPointGala #AWorldOfConnections #TransylvaniaCounty #BrevardNC

Credits: photos ${photos.join(', ')}${footage.length ? `; footage ${footage.join(', ')}` : ''}, via Wikimedia Commons.${music ? ` ${music}` : ''}

## Short (stories, X, event updates)

Connection ${trip.connection}: ${trip.name}. ${trip.nights} nights for ${who}. Choose your trip at the SparkPoint Gala, Dec 11. yoursparkpoint.org/events/sparkpoint-gala

## Story text (1080×1920 still or 9:16 video)

Sticker or link: yoursparkpoint.org/events/sparkpoint-gala. On-screen text is already in the image.

## Alt text

- Social stills: ${trip.title}. ${stills[0].alt}. Text: Connection ${trip.connection}, ${trip.name}, ${pack.line}, ${trip.nights} nights, ${trip.travelers} travelers. Choose your trip at the Gala, Friday, December 11, 2026.
- Journey map: A map of the route from ${config.home.name} to ${pack.stops.map((s) => s.name).join(', ')}.
${stills.map((s) => `- ${s.file}: ${s.alt}.`).join('\n')}
`;
  await writeFile(packDir(trip.id, 'captions.md'), md);
  console.log(`${trip.id}: captions`);
}

async function writeIndex(trip, price) {
  const md = `# ${trip.title}: promo pack

Built by \`scripts/gala-trips/\` in the website repo (\`npm run trips:pack -- ${trip.id}\`). Rebuild rather than edit.
Price switch (trips.json \`showPrices\`): **${price ? 'on' : 'off'}**${price ? '' : '. Nothing in this pack shows a price'}.

| Folder | What's in it |
| --- | --- |
| \`stills/\` | 3–5 photos at 800/1600/2400 px (WebP), \`01\` is the hero; \`stills.json\` has alt text and credit lines |
| \`map/\` | Journey map from ${config.home.name}: PNG and animated MP4 at 16:9, 9:16 and 1:1 |
| \`video/\` | \`${trip.id}-promo-16x9.mp4\` (the Gala screen), \`${trip.id}-promo-30s-9x16.mp4\` and \`-1x1.mp4\` (social); each also as \`-silent.mp4\` |
| \`social/\` | Stills at 1080×1350, 1080×1080 and 1080×1920 |
| \`factsheet/\` | One-page fact sheet (US Letter PDF) and a PNG preview |
| \`captions.md\` | Ready-to-post captions, alt text, and the required credit line |
| \`LICENSES.md\` | Every outside photo, clip and track, with author, licence and source |
`;
  await writeFile(packDir(trip.id, 'README.md'), md);
}

const browser = await launch();
try {
  for (const trip of data.trips) {
    if (ids.length && !ids.includes(trip.id)) continue;
    const pack = withResearch(trip, config.trips[trip.id]);
    const price = priceFor(trip);
    if (want('map')) await buildMap(browser, trip, pack, config.home);
    if (only?.includes('plan')) {
      await buildVideo(browser, trip, pack, { price, when: WHEN, cuts, score: await scoreTrip(trip, pack, config), home: config.home, planOnly: args.includes('--dry') ? 'dry' : true });
      continue;
    }
    const score = want('video') || want('audio') ? await scoreTrip(trip, pack, config) : null;
    if (want('video')) await buildVideo(browser, trip, pack, { price, when: WHEN, cuts, score, home: config.home });
    if (want('video') || want('audio')) await mixTrip(trip, await music(pack.music), score, cuts);
    if (want('social')) await buildSocial(browser, trip, pack, price);
    if (want('factsheet')) await buildFactsheet(browser, trip, pack, price);
    await writeCaptions(trip, pack, price);
    await writeLicenses(trip);
    await writeIndex(trip, price);
  }
} finally {
  await browser.close();
}
