// Renders the SparkPoint Gala email invitation from template.html +
// invitation.config.json into output/gala-invitation/ (git-ignored).
//
//   npm run invite:gala
//
// The invitation is laid out at 600 CSS px (what email clients show) and
// captured at 2x, so it stays sharp on phones and retina screens. It's saved
// as a progressive JPEG to keep the email light.
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');

// `--config other.json` renders from another settings file (e.g. to preview an
// update) and `--out dir` writes somewhere other than output/gala-invitation/.
const arg = (name) => { const i = process.argv.indexOf(name); return i > -1 ? process.argv[i + 1] : undefined; };
const configPath = arg('--config') ? path.resolve(arg('--config')) : path.join(here, 'invitation.config.json');
const config = JSON.parse(await readFile(configPath, 'utf8'));
const trips = (config.trips || []).length;
if (trips > 8) console.warn(`⚠ ${trips} trips listed; only the first 8 fit on the board.`);
if (config.tickets?.live && !config.tickets?.url) console.warn('⚠ tickets.live is true but tickets.url is empty.');

const outDir = arg('--out') ? path.resolve(arg('--out')) : path.join(root, 'output/gala-invitation');
await mkdir(outDir, { recursive: true });
const browser = await puppeteer.launch({ args: ['--no-sandbox', '--allow-file-access-from-files'] });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 600, height: 1000, deviceScaleFactor: 2 });
  await page.evaluateOnNewDocument((cfg) => { window.__INVITE__ = cfg; }, config);
  await page.goto('file://' + path.join(here, 'template.html'), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const fontsOk = await page.evaluate(() => document.fonts.check('400 40px Fraunces') && document.fonts.check('800 16px Manrope'));
  if (!fontsOk) throw new Error('Fonts failed to load; run `npm install` first.');

  const png = await page.screenshot({ fullPage: true, type: 'png' });
  const stamp = config.tickets?.live ? 'tickets' : 'save-the-date';
  const file = path.join(outDir, `sparkpoint-gala-invitation-${stamp}.jpg`);
  const info = await sharp(png).jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(file);
  console.log(`✓ ${path.relative(root, file)}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);
} finally {
  await browser.close();
}
