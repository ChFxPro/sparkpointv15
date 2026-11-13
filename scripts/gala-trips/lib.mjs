// Shared paths and helpers for the Gala trip promo packs. See README.md.
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { readFile, mkdir, writeFile, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const here = dirname(fileURLToPath(import.meta.url));
export const root = join(here, '..', '..');
export const require = createRequire(join(root, 'package.json'));

// The trip kit lives outside the repo (packs are large binaries, kept out of git).
export const TRIPS_DIR = process.env.GALA_TRIPS_DIR
  || '/Users/jeffbannister/Code/sparkpoint/Branding/Gala/WorldOfConnections/trips';
// Render scratch (downloads, frames, intermediates). Large, so it goes on the
// NorthBend drive when that's mounted; GALA_SCRATCH overrides.
const NORTHBEND_SCRATCH = '/Volumes/NORTHBEND/Sparkpoint/2026/Gala 26/_render-scratch';
export const SCRATCH = process.env.GALA_SCRATCH
  || (existsSync('/Volumes/NORTHBEND/Sparkpoint/2026/Gala 26') ? NORTHBEND_SCRATCH : join(root, 'output', 'gala-trips'));
export const CACHE = join(SCRATCH, 'cache');

export async function loadTrips() {
  return JSON.parse(await readFile(join(TRIPS_DIR, 'trips.json'), 'utf8'));
}

export const packDir = (id, ...parts) => join(TRIPS_DIR, id, 'pack', ...parts);

export async function exists(path) {
  try { await stat(path); return true; } catch { return false; }
}

export async function writeJson(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(data, null, 2)}\n`);
}

// Wikimedia asks automated clients for a descriptive User-Agent and a gentle pace.
export const UA = 'SparkPointGalaTripPacks/1.0 (nonprofit event promo; https://yoursparkpoint.org)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchWithRetry(url, { json = false } = {}) {
  for (let attempt = 1; attempt <= 8; attempt++) {
    let res, body;
    try {
      res = await fetch(url, { headers: { 'User-Agent': UA } });
      body = Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (attempt === 8) throw err;
      await sleep(5000 * attempt);
      continue;
    }
    const limited = res.status === 429 || res.status >= 500 || body.subarray(0, 30).toString().startsWith('You are making');
    if (!limited) {
      if (!res.ok) throw new Error(`${res.status} for ${url}`);
      return json ? JSON.parse(body.toString()) : body;
    }
    await sleep(5000 * attempt);
  }
  throw new Error(`Still rate-limited after retries: ${url}`);
}

export { sleep };
