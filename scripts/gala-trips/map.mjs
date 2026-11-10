// The journey map: a still PNG and an animated MP4 per layout.
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { packDir, root } from './lib.mjs';
import { writeLand } from './land.mjs';
import { BUILD, open, still, video } from './render.mjs';

export const SIZES = { '16x9': [1920, 1080], '9x16': [1080, 1920], '1x1': [1080, 1080] };

export function factsLine(trip) {
  return [`${trip.nights} nights`, `${trip.travelers} travelers`];
}

export function mapData(trip, pack, home, layout) {
  const [W, H] = SIZES[layout];
  const stops = pack.stops.filter((s) => s.at);
  const lats = stops.map((s) => s.at[1]);
  return {
    W, H, layout,
    trip: { connection: trip.connection, name: trip.name, line: pack.line, facts: factsLine(trip) },
    home, stops, legs: pack.legs.filter(([a, b]) => stops.some((s) => s.id === a) && stops.some((s) => s.id === b)),
    context: pack.context ?? [],
    refLat: (Math.min(...lats) + Math.max(...lats)) / 2,
    minSpan: pack.minSpan ?? (stops.length === 1 ? 4.5 : 2.4),
    sparkmark: pathToFileURL(join(root, 'public', 'assets', 'brand', 'sparkmark-256.webp')).href,
  };
}

export async function buildMap(browser, trip, pack, home, { layouts = Object.keys(SIZES), animate = true } = {}) {
  const stops = pack.stops.filter((s) => s.at);
  if (stops.length < pack.stops.length) console.warn(`${trip.id}: map leaves out stops with no coordinates yet: ${pack.stops.filter((s) => !s.at).map((s) => s.name).join(', ')}`);
  const pad = 20;
  const lons = stops.map((s) => s.at[0]), lats = stops.map((s) => s.at[1]);
  await writeLand(join(BUILD, 'land.js'), [
    [Math.min(...lons) - pad, Math.min(...lats) - pad, Math.max(...lons) + pad, Math.max(...lats) + pad],
    [home.at[0] - 25, home.at[1] - 15, home.at[0] + 25, home.at[1] + 15],
  ]);
  const page = await browser.newPage();
  const out = {};
  for (const layout of layouts) {
    const [width, height] = SIZES[layout];
    await open(page, 'map.html', { width, height, global: 'MAP', data: mapData(trip, pack, home, layout) });
    const duration = await page.evaluate(() => window.DURATION);
    const png = packDir(trip.id, 'map', `${trip.id}-journey-map-${layout}.png`);
    await still(page, png, duration);
    out[layout] = { png, duration };
    if (animate) {
      const mp4 = packDir(trip.id, 'map', `${trip.id}-journey-map-${layout}.mp4`);
      await video(page, mp4, { duration });
      out[layout].mp4 = mp4;
    }
    console.log(`${trip.id}: map ${layout}`);
  }
  // A title-free 4:3 still for the fact sheet.
  await open(page, 'map.html', { width: 1600, height: 1200, global: 'MAP', data: { ...mapData(trip, pack, home, '1x1'), W: 1600, H: 1200, bare: true } });
  await still(page, packDir(trip.id, 'map', `${trip.id}-journey-map-plain-4x3.png`), await page.evaluate(() => window.DURATION));
  await page.close();
  return out;
}

// The map as frames for one cut of the promo, timed to the music (see
// video.mjs mapTiming). Written to render scratch, not the pack.
export async function mapFramesTimed(browser, trip, pack, home, layout, timing, dir) {
  const stops = pack.stops.filter((s) => s.at);
  const pad = 20;
  const lons = stops.map((s) => s.at[0]), lats = stops.map((s) => s.at[1]);
  await writeLand(join(BUILD, 'land.js'), [
    [Math.min(...lons) - pad, Math.min(...lats) - pad, Math.max(...lons) + pad, Math.max(...lats) + pad],
    [home.at[0] - 25, home.at[1] - 15, home.at[0] + 25, home.at[1] + 15],
  ]);
  const page = await browser.newPage();
  const [width, height] = SIZES[layout];
  await open(page, 'map.html', { width, height, global: 'MAP', data: { ...mapData(trip, pack, home, layout), timing } });
  const mp4 = join(dir, `map-${layout}.mp4`);
  await video(page, mp4, { duration: timing.end, crf: 14 });
  await page.close();
  return mp4;
}
