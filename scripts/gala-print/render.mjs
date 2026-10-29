// Renders the A World of Connections print and social files (the Gala's print
// invitation, "Tickets on sale now" and "Save the date" social sets, Squarespace
// ticket images, the transparent lockup PNGs, and the website's link-preview
// image) from the HTML
// templates in ./templates. See README.md.
//
//   npm run print:gala                 # everything
//   npm run print:gala -- invite social  # just some groups
//
// Groups: logo, invite, social, tickets, share. Output goes to
// output/gala-print/ (git-ignored).

import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const require = createRequire(join(root, 'package.json'));
const puppeteer = require('puppeteer');

const OUT = join(root, 'output', 'gala-print');
const BUILD = join(OUT, '.build');

// Templates use {{…}} placeholders instead of fixed paths, so they render from
// any checkout. Josefin Sans (the Gala's only typeface) comes from the site's
// own @fontsource package. {{INCLUDE:shared/…}} inlines a shared file (the
// lockup's CSS and script), whose own placeholders are then filled too.
const placeholders = {
  JOSEFIN: pathToFileURL(join(dirname(require.resolve('@fontsource-variable/josefin-sans/package.json')), 'files')).href,
  PUBLIC: pathToFileURL(join(root, 'public')).href,
  ASSETS: pathToFileURL(join(here, 'assets')).href,
  OUTPUT: pathToFileURL(OUT).href,
};

async function prepare(template) {
  let html = await readFile(join(here, 'templates', template), 'utf8');
  const includes = [...html.matchAll(/\{\{INCLUDE:([\w./-]+)\}\}/g)].map((m) => m[1]);
  for (const name of new Set(includes)) {
    const text = await readFile(join(here, 'templates', name), 'utf8');
    html = html.split(`{{INCLUDE:${name}}}`).join(text);
  }
  html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    if (!(key in placeholders)) throw new Error(`Unknown placeholder ${match} in ${template}`);
    return placeholders[key];
  });
  const file = join(BUILD, template);
  await writeFile(file, html);
  return pathToFileURL(file).href;
}

async function open(page, template, width, height, scale) {
  await page.setViewport({ width, height, deviceScaleFactor: scale });
  await page.goto(await prepare(template), { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  const fontsOk = await page.evaluate(() => document.fonts.check('700 40px "Josefin Sans"') && document.fonts.check('italic 300 40px "Josefin Sans"'));
  if (!fontsOk) throw new Error(`Josefin Sans did not load for ${template}; run npm install`);
  await new Promise((resolve) => setTimeout(resolve, 300));
}

const TICKET_URL = 'https://secure.yoursparkpoint.org/store/p/2026-sparkpoint-gala';

const groups = {
  async logo(page) {
    await mkdir(join(OUT, 'logo'), { recursive: true });
    await open(page, 'lockup.html', 1200, 1600, 2);
    for (const [id, name] of [
      ['dark', 'world-of-connections-lockup-for-dark-backgrounds.png'],
      ['light', 'world-of-connections-lockup-for-light-backgrounds.png'],
    ]) {
      // Clip to the lockup plus its globe and routes, which spill past its box.
      const clip = await page.evaluate((sel) => {
        const rects = [document.querySelector(sel), document.querySelector(`${sel} .art`)].map((el) => el.getBoundingClientRect());
        const pad = 24;
        const x = Math.min(...rects.map((r) => r.left)) - pad, y = Math.min(...rects.map((r) => r.top)) - pad;
        return { x, y, width: Math.max(...rects.map((r) => r.right)) + pad - x, height: Math.max(...rects.map((r) => r.bottom)) + pad - y };
      }, `#${id}`);
      await page.screenshot({ path: join(OUT, 'logo', name), omitBackground: true, clip, captureBeyondViewport: true });
      console.log(`logo/${name}`);
    }
  },

  async invite(page) {
    await mkdir(join(OUT, 'print'), { recursive: true });
    // Two identical 5.5 × 8.5 in invitations on an 11 × 8.5 in sheet.
    await open(page, 'invite.html', 1056, 816, 2);
    const fit = await page.evaluate(() => {
      const panel = document.querySelector('.invite').getBoundingClientRect();
      const footer = document.querySelector('.invite .footer').getBoundingClientRect();
      return { insetBottomIn: (panel.bottom - footer.bottom) / 96 };
    });
    if (fit.insetBottomIn < 0.29) console.warn(`  ! the footer sits ${fit.insetBottomIn.toFixed(2)} in from the trim; keep it at 0.3 in or more`);
    // Check the QR code still decodes to the ticket page.
    const decoded = await page.evaluate(async () => {
      if (!('BarcodeDetector' in window)) return null;
      const img = document.querySelector('.qr img');
      const canvas = Object.assign(document.createElement('canvas'), { width: 600, height: 600 });
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, 600, 600);
      ctx.drawImage(img, 40, 40, 520, 520);
      return (await new BarcodeDetector({ formats: ['qr_code'] }).detect(canvas)).map((code) => code.rawValue);
    });
    if (decoded && !decoded.includes(TICKET_URL)) throw new Error(`QR code decodes to ${JSON.stringify(decoded)}, not the ticket page`);
    console.log(decoded ? '  QR code decodes to the ticket page' : '  (QR decode check unavailable in this browser)');
    await page.pdf({ path: join(OUT, 'print', 'sparkpoint-gala-invitation-2up-11x8.5.pdf'), width: '11in', height: '8.5in', printBackground: true, preferCSSPageSize: true });
    console.log('print/sparkpoint-gala-invitation-2up-11x8.5.pdf');
    // One invitation on a 5.5 × 8.5 in page.
    await page.addStyleTag({ content: '@page { size: 5.5in 8.5in; margin: 0; } html, body { width: 5.5in !important; }' });
    await page.evaluate(() => document.body.classList.add('single'));
    await page.setViewport({ width: 528, height: 816, deviceScaleFactor: 2 });
    await page.pdf({ path: join(OUT, 'print', 'sparkpoint-gala-invitation-5.5x8.5.pdf'), width: '5.5in', height: '8.5in', printBackground: true, preferCSSPageSize: true });
    console.log('print/sparkpoint-gala-invitation-5.5x8.5.pdf');
  },

  async social(page) {
    await mkdir(join(OUT, 'social'), { recursive: true });
    // One template, two versions: "Tickets on sale now" and "Save the date".
    for (const [variant, prefix] of [
      ['', 'sparkpoint-gala-tickets-on-sale'],
      ['std', 'sparkpoint-gala-save-the-date'],
    ]) {
      for (const [format, width, height, suffix] of [
        ['portrait', 1080, 1350, '1080x1350'],
        ['square', 1080, 1080, '1080x1080'],
        ['story', 1080, 1920, 'story-1080x1920'],
        ['wide', 1920, 1005, 'facebook-event-1920x1005'],
      ]) {
        const name = `${prefix}-${suffix}.png`;
        await open(page, 'social-on-sale.html', width, height, 1);
        await page.evaluate((cls) => {
          document.body.className = cls;
        }, `${format} ${variant}`.trim());
        await new Promise((resolve) => setTimeout(resolve, 200));
        await page.screenshot({ path: join(OUT, 'social', name), type: 'png' });
        console.log(`social/${name}`);
      }
    }
  },

  async tickets(page) {
    await mkdir(join(OUT, 'tickets'), { recursive: true });
    for (const [template, width, height, name] of [
      ['ticket-square.html', 1080, 1080, 'sparkpoint-gala-ticket-2160x2160.png'],
      ['ticket-wide.html', 1920, 1080, 'sparkpoint-gala-ticket-16x9-3840x2160.png'],
      ['ticket-banner.html', 1800, 600, 'sparkpoint-gala-ticket-banner-3x1-3600x1200.png'],
      ['ticket-story.html', 1080, 1920, 'sparkpoint-gala-ticket-9x16-2160x3840.png'],
    ]) {
      await open(page, template, width, height, 2);
      await page.screenshot({ path: join(OUT, 'tickets', name), type: 'png' });
      console.log(`tickets/${name}`);
    }
  },

  // Uses the dark lockup from the logo group, so it renders after it.
  async share(page) {
    await mkdir(join(OUT, 'share'), { recursive: true });
    await open(page, 'share.html', 1200, 630, 1);
    await page.screenshot({ path: join(OUT, 'share', 'gala-share-world-of-connections.jpg'), type: 'jpeg', quality: 86 });
    console.log('share/gala-share-world-of-connections.jpg  (copy to public/assets/events/gala/ to update the site)');
  },
};

const order = ['logo', 'invite', 'social', 'tickets', 'share'];
const asked = process.argv.slice(2);
for (const name of asked) {
  if (!order.includes(name)) throw new Error(`Unknown group "${name}". Use: ${order.join(', ')}`);
}
// The link preview needs the lockup PNG, so render the logo first when asked.
const run = asked.length ? order.filter((name) => asked.includes(name) || (name === 'logo' && asked.includes('share'))) : order;

await mkdir(BUILD, { recursive: true });
// Chromium refuses to start as root without --no-sandbox (root-based dev or CI
// containers); the templates are local files, so dropping the sandbox there is fine.
const args = ['--allow-file-access-from-files'];
if (process.getuid?.() === 0) args.push('--no-sandbox');
const browser = await puppeteer.launch({ args });
try {
  const page = await browser.newPage();
  for (const name of run) await groups[name](page);
} finally {
  await browser.close();
}
console.log(`Done. Files are in ${OUT}`);
