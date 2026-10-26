// Builds the template kit: everything someone needs to make Gala slides in
// Keynote, PowerPoint or Canva that match the show deck.
//
//   output/gala-show-kit/
//     Atlas of Wonders - Show Template.pptx   layouts + the current run of show
//     Backgrounds/      every page's background, rendered from the live globe
//     Globe cut-outs/   the globe alone, transparent, three sides of the world
//     Logos/            the lockup for dark and light grounds, the sparkmark
//     Fonts/            Fraunces and Manrope, to install (OFL)
//     QR code/          the giving QR code
//     README.txt        how to use it in each app
//
// Usage (from gala-show/): npm run build && npm run kit
// Needs Google Chrome, and Python with fonttools + brotli for the fonts
// (set FONT_PYTHON to that python if it isn't the default python3).
import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import puppeteer from 'puppeteer-core';
import QRCode from 'qrcode';

const require = createRequire(import.meta.url);
const PptxGenJS = require('pptxgenjs');
const JSZip = require('jszip');

const here = dirname(fileURLToPath(import.meta.url));
const app = resolve(here, '..');
const repo = resolve(app, '..');
const OUT = process.env.KIT_OUT || resolve(repo, 'output/gala-show-kit');
const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

// The show's current content.
const sandbox = { window: {} };
vm.runInNewContext(readFileSync(process.env.SHOW_CONTENT || resolve(app, 'show/content.js'), 'utf8'), sandbox);
const SHOW = sandbox.window.SHOW;

rmSync(OUT, { recursive: true, force: true });
const dir = (name) => {
  const p = resolve(OUT, name);
  mkdirSync(p, { recursive: true });
  return p;
};
const BG = dir('Backgrounds');
const CUT = dir('Globe cut-outs');
const LOGOS = dir('Logos');
const FONTS = dir('Fonts');
const QR = dir('QR code');

const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const lines = (v) => (Array.isArray(v) ? v : String(v || '').split('\n')).map((l) => String(l).trim()).filter(Boolean);
const parts = (l) => String(l).split('|').map((p) => p.trim());
const hasPlace = (s) => s.lat !== '' && s.lon !== '' && Number.isFinite(Number(s.lat)) && Number.isFinite(Number(s.lon));

// --- 1. Backgrounds and cut-outs, rendered from the deck's own globe ----------
const PLATES = [
  ['01 Cover', 'cover'],
  ['02 Section', 'divider'],
  ['03 List', 'programme'],
  ['04 Numbers', 'numbers'],
  ['05 People', 'content'],
  ['06 Auction', 'auction'],
  ['07 Trip', 'trip'],
  ['08 Thank you', 'thanks'],
  ['09 Plain', 'plain'],
];
const trips = SHOW.slides.filter((s) => s.type === 'trip' && hasPlace(s));
const bgFile = {};

console.log('Rendering backgrounds…');
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--allow-file-access-from-files', '--ignore-gpu-blocklist'] });
const page = await browser.newPage();
const plateUrl = (qs) => `file://${resolve(app, 'kit/.build/plate.html')}?${qs}`;
async function shoot(qs, path, { clear = false, w = 2560, h = 1440 } = {}) {
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.goto(plateUrl(qs));
  await page.waitForFunction('window.__plateReady === true');
  await new Promise((r) => setTimeout(r, 250));
  await page.screenshot(clear ? { path, omitBackground: true, type: 'png' } : { path, type: 'jpeg', quality: 90 });
}
for (const [label, type] of PLATES) {
  const path = resolve(BG, `${label}.jpg`);
  await shoot(`type=${type}`, path);
  bgFile[type] = path;
}
for (const s of trips) {
  const path = resolve(BG, `Trip - Lot ${s.lot || '?'} - ${s.place || s.title || 'trip'}.jpg`.replace(/[/\\:]/g, '-'));
  await shoot(`type=trip&lat=${s.lat}&lon=${s.lon}`, path);
  bgFile[`trip:${s.id}`] = path;
}
for (const [name, lon] of [
  ['Globe - Americas', -70],
  ['Globe - Europe and Africa', 15],
  ['Globe - Asia and Pacific', 120],
]) {
  await shoot(`type=cover&clear=1&view=${lon}`, resolve(CUT, `${name}.png`), { clear: true, w: 2000, h: 2000 * (1080 / 1920) });
}
await browser.close();

// --- 2. Logos, QR code, fonts ---------------------------------------------------
copyFileSync(resolve(repo, 'scripts/gala-invitation/assets/atlas-of-wonders-lockup-for-dark-backgrounds.png'), resolve(LOGOS, 'Atlas of Wonders lockup - for dark backgrounds.png'));
copyFileSync(resolve(repo, 'scripts/gala-invitation/assets/atlas-of-wonders-lockup-for-light-backgrounds.png'), resolve(LOGOS, 'Atlas of Wonders lockup - for light backgrounds.png'));
const sharp = require(resolve(repo, 'node_modules/sharp'));
const SPARK = resolve(LOGOS, 'SparkPoint sparkmark.png');
await sharp(resolve(repo, 'public/assets/brand/sparkmark-256.webp')).png().toFile(SPARK);
const LOCKUP = resolve(LOGOS, 'Atlas of Wonders lockup - for dark backgrounds.png');

const thanks = SHOW.slides.find((s) => s.type === 'thanks');
const qrUrl = (thanks && thanks.qrUrl) || 'https://yoursparkpoint.org/donations';
const QR_PNG = resolve(QR, 'Giving QR code.png');
await QRCode.toFile(QR_PNG, qrUrl, { width: 1200, margin: 0, errorCorrectionLevel: 'M', color: { dark: '#0b1322ff', light: '#00000000' } });
writeFileSync(resolve(QR, 'Giving QR code.svg'), await QRCode.toString(qrUrl, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#0b1322ff', light: '#00000000' } }));
writeFileSync(resolve(QR, 'Where it goes.txt'), `${qrUrl}\n`);

try {
  execFileSync(process.env.FONT_PYTHON || 'python3', [resolve(here, 'fonts.py'), repo, FONTS], { stdio: 'inherit' });
} catch {
  console.warn('\n! Fonts skipped: needs Python with fonttools and brotli (pip install fonttools brotli), or set FONT_PYTHON.\n');
}

// --- 3. The PowerPoint template --------------------------------------------------
// The deck is a 1920×1080 stage; the template is 13.333 × 7.5 in. A deck pixel
// is 1/144 in, and half a point of type.
const px = (n) => n / 144;
const pt = (n) => Math.round(n / 2);
const W = 13.333;

const COL = {
  night: '0B1322',
  night2: '13203A',
  brass: 'D9B56A',
  brassLight: 'F1D9A0',
  ivory: 'F7F1E5',
  pink: 'E03694',
  coral: 'F15F48',
  plum: '8E2A5C',
  rule: '8A8067', // brass-light at 55% over night
};
const HEAD = 'Fraunces';
const BODY = 'Manrope';

const pres = new PptxGenJS();
pres.layout = 'LAYOUT_WIDE';
pres.title = 'An Atlas of Wonders — Show Template';
pres.author = 'SparkPoint';
pres.company = 'SparkPoint';
pres.theme = { headFontFace: HEAD, bodyFontFace: BODY };

// The sparkmark rule under titles: line, star, line.
function rule(cx, y, { align = 'center' } = {}) {
  const star = 0.24;
  const len = px(120);
  const gap = px(22);
  let x0;
  if (align === 'left') x0 = cx;
  else x0 = cx - (len * 2 + gap * 2 + star) / 2;
  return [
    { line: { x: x0, y: y + star / 2, w: len, h: 0, line: { color: COL.rule, width: 0.75 } } },
    { image: { x: x0 + len + gap, y, w: star, h: star, path: SPARK } },
    { line: { x: x0 + len + gap * 2 + star, y: y + star / 2, w: len, h: 0, line: { color: COL.rule, width: 0.75 } } },
  ];
}

const ph = (name, type, x, y, w, h, opts, prompt) => ({
  placeholder: { options: { name, type, x, y, w, h, margin: 0, color: COL.ivory, fontFace: BODY, ...opts }, text: prompt },
});
const label = { fontFace: BODY, bold: true, color: COL.brass, charSpacing: 3 };
const title = (size) => ({ fontFace: HEAD, fontSize: size, color: COL.ivory, align: 'left', valign: 'bottom', lineSpacingMultiple: 0.95 });
const bg = (key) => ({ path: bgFile[key] });

pres.defineSlideMaster({
  title: 'Cover',
  background: bg('cover'),
  objects: [
    { image: { x: (W - 6.2) / 2, y: 0.95, w: 6.2, h: 6.2 * (1202 / 1730), path: LOCKUP } },
    ph('kicker', 'body', 1, 0.62, W - 2, 0.4, { ...label, fontSize: 15, color: COL.brassLight, align: 'center', charSpacing: 4 }, 'LINE ABOVE (OPTIONAL)'),
    ph('tagline', 'body', 1, 5.35, W - 2, 0.6, { fontFace: HEAD, italic: true, fontSize: 27, align: 'center' }, 'Tagline'),
    ph('footer', 'body', 1, 6.65, W - 2, 0.4, { ...label, fontSize: 13, color: COL.brassLight, align: 'center' }, 'LINE ALONG THE BOTTOM (OPTIONAL)'),
  ],
});

pres.defineSlideMaster({
  title: 'Section',
  background: bg('divider'),
  objects: [
    ph('number', 'body', px(140), 1.0, 6, 0.45, { fontFace: HEAD, italic: true, fontSize: 22, color: COL.brass }, 'One'),
    ph('title', 'title', px(140), 1.55, 5.6, 2.7, { ...title(54), valign: 'top' }, 'Section title'),
    ...rule(px(140), 4.4, { align: 'left' }),
    ph('subtitle', 'body', px(140), 4.9, 5.5, 1.6, { fontSize: 18, color: COL.brassLight, valign: 'top' }, 'Subtitle (optional)'),
  ],
});

pres.defineSlideMaster({
  title: 'List',
  background: bg('programme'),
  objects: [
    ph('title', 'title', px(140), 0.55, 8, 0.95, title(46), 'Title'),
    ...rule(px(140), 1.68, { align: 'left' }),
    ph('body', 'body', px(140), 2.15, 8.2, 4.7, { fontSize: 22, valign: 'top', paraSpaceAfter: 10 }, 'Items'),
  ],
});

pres.defineSlideMaster({
  title: 'Numbers',
  background: bg('numbers'),
  objects: [
    ph('title', 'title', 1, 0.55, W - 2, 0.95, { ...title(46), align: 'center' }, 'Title'),
    ...rule(W / 2, 1.68),
    ph('footer', 'body', 1, 6.75, W - 2, 0.35, { ...label, fontSize: 12, color: COL.brassLight, align: 'center' }, 'FOOTNOTE (OPTIONAL)'),
  ],
});

pres.defineSlideMaster({
  title: 'People',
  background: bg('content'),
  objects: [
    ph('title', 'title', 1, 0.55, W - 2, 0.95, { ...title(46), align: 'center' }, 'Title'),
    ph('subtitle', 'body', 1, 1.5, W - 2, 0.4, { fontSize: 16, bold: true, color: COL.brassLight, align: 'center' }, 'Line under the title (optional)'),
    ...rule(W / 2, 2.0),
  ],
});

pres.defineSlideMaster({
  title: 'Auction',
  background: bg('auction'),
  objects: [
    ph('title', 'title', 1, 1.6, W - 2, 2.1, { ...title(70), align: 'center' }, 'Title'),
    ...rule(W / 2, 3.95),
    ph('body', 'body', 2, 4.45, W - 4, 1.6, { fontSize: 20, align: 'center', valign: 'top' }, 'Text'),
    ph('footer', 'body', 1, 6.65, W - 2, 0.4, { ...label, fontSize: 13, color: COL.brassLight, align: 'center' }, 'LINE ALONG THE BOTTOM (OPTIONAL)'),
  ],
});

pres.defineSlideMaster({
  title: 'Trip',
  background: bg('trip'),
  objects: [
    ph('lot', 'body', px(120), 0.62, 6.3, 0.35, { ...label, fontSize: 14 }, 'LOT 1  —  DESTINATION'),
    ph('title', 'title', px(120), 1.0, 6.3, 1.75, title(52), 'Trip name'),
    ...rule(px(120), 2.95, { align: 'left' }),
    ph('body', 'body', px(120), 3.4, 6.3, 2.55, { fontSize: 16, valign: 'top', paraSpaceAfter: 6 }, 'Short description, then what’s included'),
    ph('value', 'body', px(120), 6.1, 3, 0.75, { fontFace: HEAD, bold: true, fontSize: 24, valign: 'bottom' }, 'Value'),
    ph('opening', 'body', px(120) + 3.1, 6.1, 3, 0.75, { fontFace: HEAD, bold: true, fontSize: 24, valign: 'bottom' }, 'Opening bid'),
  ],
});

pres.defineSlideMaster({
  title: 'Words',
  background: bg('content'),
  objects: [
    ph('title', 'title', 1, 0.9, W - 2, 2.4, { ...title(60), align: 'center' }, 'Heading'),
    ...rule(W / 2, 3.55),
    ph('body', 'body', 2, 4.05, W - 4, 1.7, { fontSize: 20, align: 'center', valign: 'top' }, 'Text (optional)'),
    ph('attribution', 'body', 1, 5.85, W - 2, 0.4, { ...label, fontSize: 14, color: COL.brassLight, align: 'center' }, 'ATTRIBUTION (OPTIONAL)'),
  ],
});

pres.defineSlideMaster({
  title: 'Thank you',
  background: bg('thanks'),
  objects: [
    ph('title', 'title', 6.55, 0.85, 6.1, 1.5, title(64), 'Thank you'),
    ...rule(6.55, 2.6, { align: 'left' }),
    ph('body', 'body', 6.55, 3.05, 6.1, 1.4, { fontSize: 19, valign: 'top' }, 'Text'),
  ],
});

pres.defineSlideMaster({
  title: 'Video',
  background: { color: '000000' },
  objects: [ph('title', 'title', 1, 3.2, W - 2, 1, { ...title(40), align: 'center', valign: 'middle', color: COL.brassLight }, 'Video title (cover it with the video)')],
});

pres.defineSlideMaster({
  title: 'Plain',
  background: bg('plain'),
  objects: [
    ph('title', 'title', px(140), 0.55, W - 2 * px(140), 0.95, title(46), 'Title'),
    ...rule(px(140), 1.68, { align: 'left' }),
    ph('body', 'body', px(140), 2.15, W - 2 * px(140), 4.7, { fontSize: 20, valign: 'top' }, 'Text'),
  ],
});

// Fill a placeholder only when there's something to say, so empty ones keep
// their prompt (which never shows in the show itself).
const put = (slide, name, text, opts = {}) => {
  if (text && (Array.isArray(text) ? text.length : String(text).trim())) slide.addText(text, { placeholder: name, ...opts });
};
// Labels are spaced capitals, as in the deck (which sets them with CSS).
const caps = (t) => (t ? String(t).toUpperCase() : t);
const paras = (t) => String(t || '').split(/\n+/).map((p) => p.trim()).filter(Boolean);

const LOOP_NOTE = (s) =>
  `HOLDING LOOP. Insert the loop video over this slide: Insert > Video, choose ${s.video || 'the loop .mp4'} (from the SP Gala 26 drive, "Logo loop Render /delivery"), make it fill the slide, and set it to play automatically and loop until stopped.` +
  (s.intro ? ` To play the build-in first, put ${s.intro} on the slide before, set to play automatically and advance when it ends.` : '') +
  (s.outro ? ` For the build-out, put ${s.outro} on the slide after.` : '');

let section = null;
const sectionFor = (s) => {
  if (s.type === 'trip' || s.type === 'auction') return 'The live travel auction';
  if (s.type === 'thanks' || (section === 'The live travel auction' && s.type === 'loop')) return 'Close';
  if (s.type === 'divider') return s.title || 'Section';
  return section || 'Welcome';
};

for (const s of SHOW.slides) {
  const next = sectionFor(s);
  if (next !== section) {
    pres.addSection({ title: next });
    section = next;
  }
  const add = (masterName) => {
    const slide = pres.addSlide({ masterName, sectionTitle: section });
    if (s.hidden) slide.hidden = true;
    return slide;
  };

  if (s.type === 'loop') {
    const slide = add('Cover');
    slide.addNotes(LOOP_NOTE(s));
    put(slide, 'footer', caps(s.caption));
  } else if (s.type === 'title') {
    const slide = add('Cover');
    put(slide, 'kicker', caps(s.kicker));
    put(slide, 'tagline', s.tagline);
    put(slide, 'footer', caps(s.footer));
  } else if (s.type === 'divider') {
    const slide = add('Section');
    put(slide, 'number', s.number);
    put(slide, 'title', s.title);
    put(slide, 'subtitle', s.subtitle);
  } else if (s.type === 'programme') {
    const slide = add('List');
    put(slide, 'title', s.title);
    const rows = lines(s.items).map((l) => {
      const [time, what] = parts(l);
      const t = what === undefined ? '' : time;
      const w = what === undefined ? time : what;
      return [
        { text: t, options: { fontFace: HEAD, italic: true, color: COL.brass, fontSize: 22 } },
        { text: w, options: { fontFace: BODY, bold: true, color: COL.ivory, fontSize: 22 } },
      ];
    });
    if (rows.length)
      slide.addTable(rows, {
        x: px(140),
        y: 2.15,
        w: 8.2,
        colW: [1.6, 6.6],
        rowH: 0.62,
        valign: 'middle',
        margin: [0, 0, 0, 0],
        border: [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: 0.75, color: '3A3B3E' }, { type: 'none' }],
        objectName: 'Programme',
      });
  } else if (s.type === 'numbers') {
    const slide = add('Numbers');
    put(slide, 'title', s.title);
    put(slide, 'footer', caps(s.note));
    const stats = lines(s.stats).slice(0, 6);
    const cols = stats.length === 4 || stats.length === 2 ? 2 : Math.min(3, stats.length);
    const rowsN = Math.ceil(stats.length / cols);
    const gridW = cols === 2 ? 8.4 : W - 2;
    const cellW = gridW / cols;
    const top = rowsN > 1 ? 2.35 : 3.1;
    stats.forEach((l, i) => {
      const [num, lab] = parts(l);
      const x = (W - gridW) / 2 + (i % cols) * cellW;
      const y = top + Math.floor(i / cols) * 2.05;
      slide.addText(num, { x, y, w: cellW, h: 1.05, margin: 0, align: 'center', valign: 'bottom', fontFace: HEAD, bold: true, fontSize: stats.length > 4 ? 52 : 60, color: COL.brassLight, isTextBox: true, objectName: `Figure ${i + 1}` });
      slide.addText(lab || '', { x, y: y + 1.1, w: cellW, h: 0.6, margin: 0, align: 'center', valign: 'top', fontFace: BODY, bold: true, fontSize: 15, color: COL.ivory, isTextBox: true, objectName: `Figure ${i + 1} label` });
    });
  } else if (s.type === 'video') {
    const slide = add('Video');
    put(slide, 'title', s.title);
    slide.addNotes(`VIDEO. Insert > Video, choose ${s.video || 'the video file'}, make it fill the slide (it covers the title), and set it to play automatically.`);
  } else if (s.type === 'people' || s.type === 'sponsors') {
    const slide = add('People');
    put(slide, 'title', s.title);
    put(slide, 'subtitle', s.subtitle);
    const list = lines(s.type === 'people' ? s.people : s.sponsors);
    const cols = list.length > 12 ? 4 : list.length > 6 ? 3 : list.length > 3 ? 2 : 1;
    const cellW = (W - 1.6) / cols;
    const rowH = list.length > 12 ? 0.8 : 0.95;
    list.forEach((l, i) => {
      const [name, role] = parts(l);
      const row = Math.floor(i / cols);
      const inRow = Math.min(cols, list.length - row * cols);
      const x = (W - inRow * cellW) / 2 + (i % cols) * cellW;
      const y = 2.5 + row * rowH;
      const runs = [{ text: name, options: { fontFace: HEAD, fontSize: list.length > 12 ? 20 : 24, color: COL.ivory, breakLine: Boolean(role && s.type === 'people') } }];
      if (role && s.type === 'people') runs.push({ text: role, options: { fontFace: BODY, bold: true, fontSize: 13, color: COL.brassLight } });
      slide.addText(runs, { x, y, w: cellW, h: rowH - 0.1, margin: 0, align: 'center', valign: 'top', isTextBox: true, objectName: name });
    });
    if (s.type === 'sponsors')
      slide.addNotes('SPONSORS. Hidden until sponsors are confirmed: right-click the slide and choose Show Slide (Keynote: uncheck Skip Slide). Logos can go in place of names.');
  } else if (s.type === 'auction') {
    const slide = add('Auction');
    put(slide, 'title', s.title);
    put(slide, 'body', s.body);
    put(slide, 'footer', caps(s.footer));
  } else if (s.type === 'trip') {
    const slide = add('Trip');
    if (hasPlace(s)) slide.background = { path: bgFile[`trip:${s.id}`] };
    put(slide, 'lot', [s.lot ? `LOT ${s.lot}` : 'LOT', s.place ? `  —  ${s.place.toUpperCase()}` : ''].join(''));
    put(slide, 'title', s.title);
    const body = [
      ...paras(s.blurb).map((p, i, a) => ({ text: p, options: { breakLine: true, paraSpaceAfter: 8 } })),
      ...lines(s.details).map((d) => ({ text: d, options: { bullet: { indent: 16 }, bold: true, breakLine: true } })),
    ];
    if (body.length) {
      delete body[body.length - 1].options.breakLine;
      slide.addText(body, { placeholder: 'body' });
    }
    if (s.value) slide.addText([{ text: 'VALUE', options: { ...label, fontSize: 11, breakLine: true } }, { text: s.value }], { placeholder: 'value' });
    if (s.opening) slide.addText([{ text: 'OPENING BID', options: { ...label, fontSize: 11, breakLine: true } }, { text: s.opening }], { placeholder: 'opening' });
    const missing = [!s.title && 'trip name', !hasPlace(s) && 'latitude and longitude'].filter(Boolean);
    slide.addNotes(
      `TRIP${s.lot ? ` — LOT ${s.lot}` : ''}.` +
        (hasPlace(s) ? ' The background shows the route from Brevard.' : ' The background is the plain trip globe; once the destination is set, re-run the kit for a background with its route, or use the deck.') +
        (missing.length ? ` Still needed: ${missing.join(', ')}.` : '') +
        (s.donor ? ` Donated by ${s.donor}.` : '') +
        ' To mark it sold, add a SOLD stamp (a pink double-ring circle) or move on.'
    );
  } else if (s.type === 'text') {
    const slide = add('Words');
    put(slide, 'title', s.title, s.attribution ? { italic: true } : {});
    put(slide, 'body', s.body);
    put(slide, 'attribution', caps(s.attribution));
  } else if (s.type === 'thanks') {
    const slide = add('Thank you');
    put(slide, 'title', s.title);
    put(slide, 'body', s.body);
    if (s.qrUrl) {
      const y = 4.65;
      slide.addShape(pres.ShapeType.roundRect, { x: 6.55, y, w: 5.6, h: 1.95, rectRadius: 0.12, fill: { color: COL.ivory }, line: { type: 'none' }, objectName: 'QR card' });
      slide.addImage({ path: QR_PNG, x: 6.55 + 0.2, y: y + 0.2, w: 1.55, h: 1.55, altText: `QR code for ${s.qrUrl}`, objectName: 'QR code' });
      // A long address breaks after its last slash rather than mid-word.
      const addr = String(s.qrLabel || s.qrUrl);
      const cut = addr.length > 26 ? addr.lastIndexOf('/') + 1 : 0;
      slide.addText(cut ? [{ text: addr.slice(0, cut), options: { breakLine: true } }, { text: addr.slice(cut) }] : addr, { x: 6.55 + 1.95, y: y + 0.2, w: 3.45, h: 1.55, margin: 0, valign: 'middle', fontFace: BODY, bold: true, fontSize: 17, color: COL.night, isTextBox: true, objectName: 'QR address' });
    }
  }
}

const PPTX = resolve(OUT, 'Atlas of Wonders - Show Template.pptx');
await pres.writeFile({ fileName: PPTX });

// pptxgenjs can't write theme colours; set them, so the apps' colour pickers
// offer the Gala palette.
const zip = await JSZip.loadAsync(readFileSync(PPTX));
const themePath = Object.keys(zip.files).find((f) => /^ppt\/theme\/theme\d+\.xml$/.test(f));
let theme = await zip.file(themePath).async('string');
const clr = (n, hex) => `<a:${n}><a:srgbClr val="${hex}"/></a:${n}>`;
theme = theme.replace(
  /<a:clrScheme [^>]*>[\s\S]*?<\/a:clrScheme>/,
  `<a:clrScheme name="An Atlas of Wonders">${clr('dk1', COL.night)}${clr('lt1', COL.ivory)}${clr('dk2', COL.night2)}${clr('lt2', COL.brassLight)}${clr('accent1', COL.brass)}${clr('accent2', COL.pink)}${clr('accent3', COL.coral)}${clr('accent4', COL.plum)}${clr('accent5', '5F5A52')}${clr('accent6', 'EFE5CF')}${clr('hlink', COL.brass)}${clr('folHlink', COL.brassLight)}</a:clrScheme>`
);
theme = theme.replace(/<a:theme ([^>]*)name="[^"]*"/, '<a:theme $1name="An Atlas of Wonders"');
zip.file(themePath, theme);
writeFileSync(PPTX, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));

copyFileSync(resolve(here, 'README.txt'), resolve(OUT, 'README.txt'));
console.log(`\nKit written to ${OUT}`);
if (!existsSync(resolve(FONTS, 'Fraunces-Regular.ttf'))) console.log('(without fonts — see the warning above)');
