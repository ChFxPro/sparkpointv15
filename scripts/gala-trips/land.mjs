// Natural Earth land outlines (public domain), from the world-atlas TopoJSON
// files on jsDelivr, decoded to plain [lon, lat] rings for the map template.
// Coarse (1:110m) draws the world view; fine (1:10m), clipped to the trip's
// region, draws the close-up.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { CACHE, exists } from './lib.mjs';

const SRC = (scale) => `https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-${scale}.json`;

async function topo(scale) {
  const file = join(CACHE, `land-${scale}.json`);
  if (!(await exists(file))) {
    await mkdir(CACHE, { recursive: true });
    const res = await fetch(SRC(scale));
    if (!res.ok) throw new Error(`land-${scale}: ${res.status}`);
    await writeFile(file, Buffer.from(await res.arrayBuffer()));
  }
  return JSON.parse(await readFile(file, 'utf8'));
}

function rings(t) {
  const [sx, sy] = t.transform.scale, [tx, ty] = t.transform.translate;
  const arcs = t.arcs.map((arc) => {
    let x = 0, y = 0;
    return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; });
  });
  const ring = (idx) => idx.flatMap((i, n) => {
    const a = i >= 0 ? arcs[i] : arcs[~i].slice().reverse();
    return n ? a.slice(1) : a;
  });
  const out = [];
  const walk = (g) => {
    if (g.type === 'GeometryCollection') g.geometries.forEach(walk);
    else if (g.type === 'Polygon') g.arcs.forEach((r) => out.push(ring(r)));
    else if (g.type === 'MultiPolygon') g.arcs.forEach((p) => p.forEach((r) => out.push(ring(r))));
  };
  walk(t.objects.land);
  return out;
}

// Drops points closer than `tol` degrees to the last kept one: 10m detail is
// finer than a dot, and fewer points keeps each frame fast.
const thin = (r, tol) => r.filter((p, i) => { if (!i || i === r.length - 1) return true; const q = thin.last; const keep = !q || Math.abs(p[0] - q[0]) + Math.abs(p[1] - q[1]) > tol; if (keep) thin.last = p; return keep; });
const round = (r) => r.map(([x, y]) => [Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000]);

// Writes land.js (window.LAND_COARSE, window.LAND_FINE). Fine outlines are kept
// only for rings that touch one of `boxes` ([lon0, lat0, lon1, lat1]).
export async function writeLand(file, boxes) {
  const coarse = rings(await topo('110m')).map(round);
  const fine = rings(await topo('10m'))
    .filter((r) => r.some(([x, y]) => boxes.some(([lon0, lat0, lon1, lat1]) => x >= lon0 && x <= lon1 && y >= lat0 && y <= lat1)))
    .map((r) => { thin.last = null; return round(thin(r, 0.02)); })
    .filter((r) => r.length > 3);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, `window.LAND_COARSE=${JSON.stringify(coarse)};\nwindow.LAND_FINE=${JSON.stringify(fine)};\n`);
}
