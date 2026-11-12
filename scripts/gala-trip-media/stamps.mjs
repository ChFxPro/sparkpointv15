// Export the passport maker's ink stamps as images for the Gala trip cards.
//
// The stamps are drawn on canvas by src/pages/galaJoinMe/stamps.ts (the same art the
// "Issue my passport" page stamps onto a guest's post). The trip cards' "Stamp this
// trip" links show them as plain images, so they don't have to load the canvas code or
// fonts. This renders each stamp in the running site and saves a transparent WebP per
// trip to public/assets/events/gala/stamps/<trip-id>.webp.
//
// Re-run after changing a stamp in stamps.ts:
//   npm run dev                       (in another terminal)
//   npm run gala:stamps               (or: node scripts/gala-trip-media/stamps.mjs http://localhost:3000)
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const out = join(root, 'public', 'assets', 'events', 'gala', 'stamps');
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const WIDTH = 280; // about 2× the size the cards show them

const browser = await puppeteer.launch({ headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 1 });
  await page.goto(`${base}/events/sparkpoint-gala/join-me`, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  // Walk to the stamp step: no photo, then Next past the name.
  const clickText = (text) =>
    page.evaluate((t) => {
      const b = [...document.querySelectorAll('.jm-panel button')].find((el) => el.textContent.trim().toLowerCase() === t);
      b?.click();
      return Boolean(b);
    }, text);
  if (!(await clickText('no photo, use the gala seal'))) throw new Error('Could not find the photo step');
  await new Promise((r) => setTimeout(r, 600));
  if (!(await clickText('next'))) throw new Error('Could not find the name step');
  await page.waitForSelector('.jm-trip img', { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 800));

  const stamps = await page.evaluate(() =>
    [...document.querySelectorAll('.jm-trip')].map((b) => ({
      label: (b.getAttribute('aria-label') || '').trim(),
      src: b.querySelector('img')?.getAttribute('src') || '',
    })),
  );
  const ids = await page.evaluate(async () => {
    const m = await import('/src/data/galaTrips.ts');
    return m.GALA_TRIPS_IN_ORDER.map((t) => ({ id: t.id, name: t.name }));
  });

  await mkdir(out, { recursive: true });
  let n = 0;
  for (const { id, name } of ids) {
    const hit = stamps.find((s) => s.label.endsWith(`, ${name}`) || s.label.includes(`, ${name} (`));
    if (!hit?.src.startsWith('data:image/png;base64,')) throw new Error(`No stamp found for ${name}`);
    const png = Buffer.from(hit.src.split(',')[1], 'base64');
    const webp = await sharp(png).resize({ width: WIDTH, withoutEnlargement: true }).webp({ quality: 90, alphaQuality: 100 }).toBuffer();
    await writeFile(join(out, `${id}.webp`), webp);
    const meta = await sharp(webp).metadata();
    console.log(`${id}.webp  ${meta.width}×${meta.height}  ${(webp.length / 1024).toFixed(1)} KB`);
    n += 1;
  }
  console.log(`Wrote ${n} stamps to ${out}`);
} finally {
  await browser.close();
}
