// Builds src/data/galaDirections.json for the Gala page's "Getting there" map:
// the drive from the Dollar General on US 276 to the Clubhouse parking, by the
// East Fork Gate (the venue's request, Oct 26 planning meeting), drawn over the
// real terrain. Run once, or again if the route changes:
//
//   node scripts/gala-directions/build.mjs
//
// Road geometry comes from the public OSRM demo router (OpenStreetMap data) and
// elevation from the public AWS Terrain Tiles (Terrarium). Both are fetched
// here, at build time, and committed as JSON, so the page itself never calls a
// map service from a visitor's browser. Map data © OpenStreetMap contributors.

import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const OUT = join(here, '..', '..', 'src', 'data', 'galaDirections.json');

// Places, checked 2026-11-20 against Google Maps and OSRM. [lat, lon]
const PLACES = {
  mainEntrance: [35.1633, -82.7268], // Connestee Trail off US 276: keep going
  dollarGeneral: [35.15633, -82.70906], // 6751 Greenville Hwy, just before the turn
  eastForkTurn: [35.1549, -82.7068], // right onto East Fork Road
  gate: [35.1501, -82.7083], // East Fork Gate: right onto Connestee Trail
  clubhouse: [35.143311, -82.72706], // 98 Overlook Clubhouse Dr
};

const UA = { 'User-Agent': 'Mozilla/5.0 (compatible; gala-directions-build/1.0)' };

async function route(points) {
  const coords = points.map(([lat, lon]) => `${lon},${lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`;
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`OSRM ${res.status}`);
  const data = await res.json();
  if (data.code !== 'Ok') throw new Error(`OSRM ${data.code}`);
  return { line: data.routes[0].geometry.coordinates, miles: data.routes[0].distance / 1609.344, legs: data.routes[0].legs.map((leg) => leg.distance / 1609.344) };
}

const round = (n, d = 5) => Math.round(n * 10 ** d) / 10 ** d;

// The drive itself, and US 276 from the main entrance down to the Dollar General
// for context (the turn guests should not take).
const drive = await route([PLACES.dollarGeneral, PLACES.gate, PLACES.clubhouse]);
const approach = await route([PLACES.mainEntrance, PLACES.dollarGeneral]);
console.log(`drive ${drive.miles.toFixed(2)} mi (to gate ${drive.legs[0].toFixed(2)}, gate to clubhouse ${drive.legs[1].toFixed(2)}); approach ${approach.miles.toFixed(2)} mi`);

// Terrain: a grid over everything drawn, with a margin.
const lats = [...drive.line, ...approach.line].map((c) => c[1]);
const lons = [...drive.line, ...approach.line].map((c) => c[0]);
const pad = 0.022;
const bbox = { south: Math.min(...lats) - pad, north: Math.max(...lats) + pad, west: Math.min(...lons) - pad, east: Math.max(...lons) + pad };
const ROWS = 80;
const COLS = 80;
const cells = [];
for (let r = 0; r < ROWS; r += 1) {
  for (let c = 0; c < COLS; c += 1) {
    cells.push([bbox.north - ((bbox.north - bbox.south) * r) / (ROWS - 1), bbox.west + ((bbox.east - bbox.west) * c) / (COLS - 1)]);
  }
}
// Elevation from the public AWS Terrain Tiles (Terrarium PNGs, zoom 14), decoded
// with ImageMagick: metres = R*256 + G + B/256 - 32768.
const Z = 14;
const tileXY = (lat, lon) => {
  const n = 2 ** Z;
  const x = ((lon + 180) / 360) * n;
  const rad = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(rad) + 1 / Math.cos(rad)) / Math.PI) / 2) * n;
  return [x, y];
};
const tiles = new Map();
async function tilePixels(tx, ty) {
  const key = `${tx}/${ty}`;
  if (!tiles.has(key)) {
    const res = await fetch(`https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${tx}/${ty}.png`, { headers: UA });
    if (!res.ok) throw new Error(`terrain tile ${key}: ${res.status}`);
    const png = Buffer.from(await res.arrayBuffer());
    const { execFileSync } = await import('node:child_process');
    const rgb = execFileSync('magick', ['png:-', '-depth', '8', 'rgb:-'], { input: png, maxBuffer: 1 << 24 });
    tiles.set(key, rgb);
  }
  return tiles.get(key);
}
const elevation = [];
for (const [lat, lon] of cells) {
  const [x, y] = tileXY(lat, lon);
  const tx = Math.floor(x);
  const ty = Math.floor(y);
  const px = Math.min(255, Math.floor((x - tx) * 256));
  const py = Math.min(255, Math.floor((y - ty) * 256));
  const rgb = await tilePixels(tx, ty);
  const i = (py * 256 + px) * 3;
  elevation.push(Math.round(rgb[i] * 256 + rgb[i + 1] + rgb[i + 2] / 256 - 32768));
}
console.log(`elevation ${Math.min(...elevation)}–${Math.max(...elevation)} m over ${ROWS}×${COLS}`);

const out = {
  _about: 'Built by scripts/gala-directions/build.mjs. Map data © OpenStreetMap contributors (via OSRM); elevation from AWS Terrain Tiles (Terrarium; USGS and other public DEMs).',
  bbox: Object.fromEntries(Object.entries(bbox).map(([k, v]) => [k, round(v)])),
  grid: { rows: ROWS, cols: COLS, elevation },
  drive: drive.line.map(([lon, lat]) => [round(lon), round(lat)]),
  approach: approach.line.map(([lon, lat]) => [round(lon), round(lat)]),
  miles: { toGate: round(drive.legs[0], 2), gateToClubhouse: round(drive.legs[1], 2) },
  places: Object.fromEntries(Object.entries(PLACES).map(([k, [lat, lon]]) => [k, [lon, lat]])),
};
await writeFile(OUT, JSON.stringify(out));
console.log(`wrote ${OUT}`);
