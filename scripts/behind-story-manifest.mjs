// Generates public/assets/behind_story/manifest.json from whatever images are
// in the folder. Runs in predev + prebuild so dropping/removing an image just
// works on the next dev start or build — no code changes.
import { readdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DIR = path.resolve('public/assets/behind_story');
const OUT = path.join(DIR, 'manifest.json');
const EXT = new Set(['.webp', '.jpg', '.jpeg', '.png', '.avif']);

let files = [];
if (existsSync(DIR)) {
  files = (await readdir(DIR))
    .filter((f) => EXT.has(path.extname(f).toLowerCase()))
    // natural, numeric-aware sort: IMG_0199 < IMG_0283 < ... ; prefix 01-, 02- to override
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
  await writeFile(OUT, JSON.stringify(files, null, 2) + '\n');
}
console.log(`[behind_story] manifest: ${files.length} image(s)`);
