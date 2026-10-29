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
  const fontsOk = await page.evaluate(() => document.fonts.check('700 40px "Josefin Sans"') && document.fonts.check('300 16px "Josefin Sans"'));
  if (!fontsOk) throw new Error('Fonts failed to load; run `npm install` first.');

  const png = await page.screenshot({ fullPage: true, type: 'png' });
  const stamp = config.tickets?.live ? 'tickets' : 'save-the-date';
  const file = path.join(outDir, `sparkpoint-gala-invitation-${stamp}.jpg`);
  const info = await sharp(png).jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(file);
  console.log(`✓ ${path.relative(root, file)}  ${info.width}×${info.height}  ${Math.round(info.size / 1024)} KB`);

  // The newsletter: newsletter.html cut into one image per <section data-slice>,
  // so the email can put real text and buttons between them. Sections marked
  // data-anim become looping GIFs whose first frame is the finished picture
  // (desktop Outlook shows only that frame).
  const sliceDir = path.join(outDir, 'newsletter');
  await mkdir(sliceDir, { recursive: true });
  await page.goto('file://' + path.join(here, 'newsletter.html'), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const frameCounts = await page.evaluate(() => window.__frames);
  let total = 0;
  for (const el of await page.$$('[data-slice]')) {
    const { name, anim } = await el.evaluate((node) => ({ name: node.dataset.slice, anim: node.dataset.anim }));
    let out;
    if (!anim) {
      out = path.join(sliceDir, `${name}.jpg`);
      await sharp(await el.screenshot({ type: 'png' })).jpeg({ quality: 80, progressive: true, mozjpeg: true }).toFile(out);
    } else {
      const n = frameCounts[anim];
      const frames = [];
      for (let k = 0; k < n; k += 1) {
        await page.evaluate((a, i) => window.__setFrame(a, i), anim, k);
        frames.push(await el.screenshot({ type: 'png' }));
      }
      await page.evaluate((a) => window.__setFrame(a, 0), anim);
      // Hold the finished frame, run the animation, hold its last frame.
      const delay = frames.map((_, i) => (i === 0 ? 2600 : i === n - 1 ? 2200 : anim === 'flap' ? 90 : 70));
      out = path.join(sliceDir, `${name}.gif`);
      await sharp(frames, { join: { animated: true } }).gif({ delay, loop: 0, colours: 128, effort: 10, dither: 0.6 }).toFile(out);
    }
    const meta = await sharp(out, { animated: true }).metadata();
    const kb = Math.round((await readFile(out)).length / 1024);
    total += kb;
    const flag = anim && kb > 1024 ? '  ⚠ over 1 MB' : '';
    console.log(`✓ ${path.relative(root, out)}  ${meta.width}×${meta.pageHeight || meta.height}${anim ? `  ${meta.pages} frames` : ''}  ${kb} KB${flag}`);
  }
  console.log(`  newsletter total ${Math.round(total / 102.4) / 10} MB${total > 2560 ? '  ⚠ over 2.5 MB' : ''}`);
} finally {
  await browser.close();
}
