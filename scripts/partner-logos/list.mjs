#!/usr/bin/env node
// Lists every partner in src/data/partners.ts with the file name its logo
// should have in src/assets/partner-logos/, and whether one is there yet.
//   npm run logos:list
import fs from 'node:fs';

const DIR = 'src/assets/partner-logos';
const source = fs.readFileSync('src/data/partners.ts', 'utf8');
const names = [
  ...new Set(
    [...source.matchAll(/\{ name: (?:'((?:[^'\\]|\\.)+)'|"([^"]+)")/g)].map((m) => (m[1] ?? m[2]).replace(/\\'/g, "'"))
  ),
];
// Must match partnerLogoSlug() in src/components/partnerLogos.ts.
const slug = (n) => n.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
const files = fs.readdirSync(DIR).filter((f) => /\.(svg|png|webp|jpe?g)$/i.test(f));
const have = new Map(files.map((f) => [f.replace(/\.[^.]+$/, '').replace(/-ink$/, ''), f]));

let missing = 0;
for (const name of names.sort((a, b) => a.localeCompare(b))) {
  const s = slug(name);
  const file = have.get(s);
  if (!file) missing++;
  console.log(`${file ? '✓' : '·'}  ${name.padEnd(52)} ${file ?? `${s}.svg|png|webp`}`);
}
console.log(`\n${names.length - missing} of ${names.length} partners have a logo in ${DIR}/`);
const orphans = [...have.keys()].filter((s) => !names.some((n) => slug(n) === s));
if (orphans.length) console.log(`Files that match no partner (check the name): ${orphans.map((s) => have.get(s)).join(', ')}`);
