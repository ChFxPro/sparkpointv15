#!/usr/bin/env node
// Recolour the white parts of a partner logo so it reads on a white page,
// without touching its colours. Use it for logos whose text (or other
// elements) is white; an all-white logo can instead be saved with an `-ink`
// suffix and the site draws it in near-black.
//
//   node scripts/partner-logos/ink-white.mjs <input> [output] [--color #2a2a2a | --primary]
//
//   --color <hex>  paint the white parts this colour (default #2a2a2a, a near-black grey)
//   --primary      paint them the logo's own main colour (its most common saturated colour)
//
// Output defaults to src/assets/partner-logos/<input name>.png. Only near-white,
// unsaturated pixels change; anti-aliased edges blend so text stays smooth.
// Always look at the result before using it: a logo whose white is meant to be
// white (a knocked-out shape inside a coloured badge) should not be run through this.
import path from 'node:path';
import sharp from 'sharp';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  if (i === -1) return undefined;
  const value = args[i + 1];
  args.splice(i, value && !value.startsWith('--') ? 2 : 1);
  return value && !value.startsWith('--') ? value : true;
};
const colorArg = flag('--color');
const usePrimary = Boolean(flag('--primary'));
const [input, outputArg] = args;
if (!input) {
  console.error('Usage: node scripts/partner-logos/ink-white.mjs <input> [output] [--color #2a2a2a | --primary]');
  process.exit(1);
}
const output =
  outputArg ?? path.join('src/assets/partner-logos', `${path.basename(input).replace(/\.[^.]+$/, '')}.png`);

const hex = (h) => {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(h));
  if (!m) throw new Error(`Not a hex colour: ${h}`);
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const { data, info } = await sharp(input, { density: 300 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

function primaryColour() {
  const counts = new Map();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max - min < 45 || max < 40) continue; // skip greys, whites, near-blacks
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  let best = null, n = 0;
  for (const [k, c] of counts) if (c > n) { best = k; n = c; }
  if (best === null) return null;
  return [((best >> 8) & 15) * 16 + 8, ((best >> 4) & 15) * 16 + 8, (best & 15) * 16 + 8];
}

const target = usePrimary ? primaryColour() ?? hex('#2a2a2a') : hex(colorArg ?? '#2a2a2a');
let changed = 0;
for (let i = 0; i < data.length; i += 4) {
  if (data[i + 3] < 8) continue;
  const r = data[i], g = data[i + 1], b = data[i + 2];
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max - min > 40) continue; // coloured pixel: leave it
  const w = Math.min(1, Math.max(0, (min - 170) / 70)); // 0 below #aaa, 1 at #f0 and up
  if (w === 0) continue;
  data[i] = Math.round(r + (target[0] - r) * w);
  data[i + 1] = Math.round(g + (target[1] - g) * w);
  data[i + 2] = Math.round(b + (target[2] - b) * w);
  changed++;
}

await sharp(data, { raw: info }).png().toFile(output);
console.log(`Wrote ${output} (${changed} pixels recoloured to rgb(${target.join(', ')}))`);
