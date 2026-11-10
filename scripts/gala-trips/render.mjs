// Puppeteer + ffmpeg plumbing shared by the pack steps. Templates are plain
// HTML with {{PLACEHOLDERS}}; each exposes window.ready and window.frame(t),
// so a video is just frame(t) + a screenshot, piped into ffmpeg.
import { spawn } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { SCRATCH, here, root, require } from './lib.mjs';

const puppeteer = require('puppeteer');
export const BUILD = join(SCRATCH, '.build');
export const KIT = '/Users/jeffbannister/Code/sparkpoint/Branding/Gala/WorldOfConnections';

export const placeholders = {
  FONTS: pathToFileURL(join(KIT, 'fonts')).href,
  JOSEFIN: pathToFileURL(join(KIT, 'fonts')).href,
  PUBLIC: pathToFileURL(join(root, 'public')).href,
  BUILD: pathToFileURL(BUILD).href,
};

export async function launch() {
  // Parallel pages are background tabs to Chrome, which otherwise throttles
// their timers and can defer image decoding there indefinitely.
  return puppeteer.launch({ headless: true, protocolTimeout: 600000, args: ['--allow-file-access-from-files', '--force-color-profile=srgb',
    '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding'] });
}

async function prepare(template, extra = {}) {
  let html = await readFile(join(here, 'templates', template), 'utf8');
  for (const name of new Set([...html.matchAll(/\{\{INCLUDE:([\w./-]+)\}\}/g)].map((m) => m[1]))) {
    html = html.split(`{{INCLUDE:${name}}}`).join(await readFile(join(root, name), 'utf8'));
  }
  const vars = { ...placeholders, ...extra };
  html = html.replace(/\{\{(\w+)\}\}/g, (m, k) => {
    if (!(k in vars)) throw new Error(`Unknown placeholder ${m} in ${template}`);
    return vars[k];
  });
  await mkdir(BUILD, { recursive: true });
  const file = join(BUILD, template);
  await writeFile(file, html);
  return pathToFileURL(file).href;
}

// Opens a template with `data` set as window[global] before any script runs.
// `url` reuses a template already prepared (parallel pages must not rewrite the file another page is loading).
export async function open(page, template, { width, height, global, data, extra, scale = 1, url }) {
  await page.setViewport({ width, height, deviceScaleFactor: scale });
  if (global) await page.evaluateOnNewDocument((g, d) => { window[g] = d; }, global, data);
  url ??= await prepare(template, extra);
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 300000 });
  await page.evaluate(() => window.ready);
  const ok = await page.evaluate(() => document.fonts.check('600 20px "Josefin Sans"'));
  if (!ok) throw new Error(`Josefin Sans did not load in ${template}`);
  return url;
}

export async function still(page, out, t, { type = 'png', quality } = {}) {
  await mkdir(dirname(out), { recursive: true });
  await page.evaluate((tt) => window.frame(tt), t);
  await page.screenshot({ path: out, type, quality });
}

// Renders frame(t) for t in [0, duration) to an H.264 MP4 (or ProRes 4444 with
// alpha when `alpha` is set, for overlays).
// Encoder: 'hw' (default) uses the Mac's VideoToolbox H.264 encoder; 'x264'
// is the slower full-quality software encode (for a final re-encode of the
// Gala-screen masters). Set GALA_ENCODER=x264 to use it.
export const ENCODER = process.env.GALA_ENCODER || 'hw';

export async function video(page, out, { duration, fps = 30, alpha = false, crf = 16, bitrate = '14M', maxrate = '20M' }) {
  await mkdir(dirname(out), { recursive: true });
  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-'];
  if (alpha) args.push('-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', out);
  else if (ENCODER === 'x264') args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
  else args.push('-c:v', 'h264_videotoolbox', '-b:v', bitrate, '-maxrate', maxrate, '-bufsize', maxrate, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
  const ff = spawn('ffmpeg', args, { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((res, rej) => ff.on('close', (c) => (c ? rej(new Error(`ffmpeg exited ${c} for ${out}`)) : res())));
  const frames = Math.round(duration * fps);
  for (let i = 0; i < frames; i++) {
    await page.evaluate((tt) => window.frame(tt), from + i / fps);
    const buf = await page.screenshot({ type: 'png', omitBackground: alpha });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await done;
}

export function ffmpeg(args) {
  return new Promise((res, rej) => {
    const p = spawn('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: ['ignore', 'inherit', 'inherit'] });
    p.on('close', (c) => (c ? rej(new Error(`ffmpeg exited ${c}: ${args.join(' ')}`)) : res()));
  });
}

// Renders a template's frames in several Chrome pages at once (GALA_RENDER_PAGES,
// default 3), each taking a contiguous range of frames, saved as numbered PNGs
// in render scratch; then one encode reads them all in order, so there is no
// join: the frame count is exact and the audio stays in sync. Frames either
// side of each range boundary are re-rendered in one page and compared
// pixel-for-pixel with the parallel output.
// Pages to start with; a cut that hangs is retried on fewer (renderVideo).
export const RENDER_PAGES = Math.max(1, Number(process.env.GALA_RENDER_PAGES || 3));
const HANG_SECS = Number(process.env.GALA_HANG_SECS || 90);
// GALA_SMOKE=<frames>: render only that many frames, to scratch, as a smoke test.
const SMOKE = Number(process.env.GALA_SMOKE || 0);

// Renders a cut on RENDER_PAGES pages; if it hangs (no new frame for
// HANG_SECS), kills those pages and retries once on 2, then on 1.
export async function renderVideo(browser, template, openOpts, out, opts) {
  if (SMOKE && !opts.real) out = join(opts.scratch, `smoke-${basename(out)}`);
  const tries = [...new Set([RENDER_PAGES, Math.min(2, RENDER_PAGES), 1])];
  let lastErr;
  for (const pages of tries) {
    try {
      const r = await renderOnce(browser, template, openOpts, out, { ...opts, pages });
      return { ...r, mode: `${pages} page${pages > 1 ? 's' : ''}${pages < tries[0] ? ` (retry after a hang)` : ''}` };
    } catch (err) {
      lastErr = err;
      if (!err.hang && !/timed out|Target closed|Session closed/.test(err.message)) throw err;
      console.warn(`render hung on ${pages} page(s) (${err.message}); retrying on fewer`);
    }
  }
  throw lastErr;
}

async function renderOnce(browser, template, openOpts, out, { duration, fps = 30, crf = 16, bitrate = '14M', maxrate = '20M', scratch, pages: want, real, from = 0 }) {
  const frames = SMOKE && !real ? Math.min(SMOKE, Math.round(duration * fps)) : Math.round(duration * fps);
  const n = Math.min(want, Math.max(1, Math.floor(frames / 20)));
  const dir = join(scratch, `frames-${Date.now()}`);
  await mkdir(dir, { recursive: true });
  const name = (i) => join(dir, `${String(i).padStart(6, '0')}.png`);
  const ranges = Array.from({ length: n }, (_, k) => [Math.floor((k * frames) / n), Math.floor(((k + 1) * frames) / n)]);
  const t0 = Date.now();
  console.log(`render ${basename(out)}: ${frames} frames on ${n} page(s)`);
  let done = 0;
  let extra = [];
  try {
  // One Chrome per range: pages in a single Chrome share its compositor and
  // screenshot path, so they barely run in parallel (2.4 fps on 3 pages vs 2.3 on 1).
  extra = await Promise.all(ranges.slice(1).map(() => launch()));
  const browsers = [browser, ...extra];
  const pages = await Promise.all(browsers.map((b) => b.newPage()));
  const url = await open(pages[0], template, openOpts);
  await Promise.all(pages.slice(1).map((p) => open(p, template, { ...openOpts, url })));
  // Watchdog: any new frame from any page resets it.
  let last = Date.now(), stop = false, timer;
  const hang = new Promise((_, reject) => {
    timer = setInterval(() => {
      if (Date.now() - last > HANG_SECS * 1000) {
        stop = true;
        const e = new Error(`no new frame for ${HANG_SECS} s`); e.hang = true; reject(e);
      }
    }, 5000);
  });
  try {
    await Promise.race([hang, Promise.all(pages.map(async (p, k) => {
      for (let i = ranges[k][0]; i < ranges[k][1] && !stop; i++) {
        await p.evaluate((tt) => window.frame(tt), from + i / fps);
        await p.screenshot({ path: name(i), type: 'png' });
        last = Date.now();
        if (++done % 300 === 0) console.log(`render ${basename(out)}: ${done}/${frames} frames, ${(done / ((last - t0) / 1000)).toFixed(2)} fps`);
      }
    }))]);
  } catch (err) {
    clearInterval(timer);
    await Promise.all(pages.map((p) => p.close().catch(() => {})));
    await Promise.all(extra.map((b) => b.close().catch(() => {})));
    throw err;
  }
  clearInterval(timer);
  const renderSecs = (Date.now() - t0) / 1000;
  // Boundary check: re-render the frames either side of each join in one page.
  // Each must match its own parallel frame (mean difference under 0.5/255; GPU
  // anti-aliasing can move a few pixels by a few levels) and match it better
  // than the frames next to it, so no frame is dropped, doubled or out of order.
  let check = 'single page';
  if (n > 1) {
    const sharp = require('sharp');
    const raw = (b) => sharp(b).raw().toBuffer();
    const mean = (x, y) => { let d = 0; for (let j = 0; j < x.length; j++) d += Math.abs(x[j] - y[j]); return d / x.length; };
    const p = pages[0];
    let worst = 0, ordered = true;
    for (const [b] of ranges.slice(1)) {
      for (const i of [b - 1, b]) {
        await p.evaluate((tt) => window.frame(tt), from + i / fps);
        const again = await raw(await p.screenshot({ type: 'png' }));
        const same = mean(again, await raw(name(i)));
        const nb = [i - 1, i + 1].filter((k) => k >= 0 && k < frames);
        const others = await Promise.all(nb.map(async (k) => mean(again, await raw(name(k)))));
        worst = Math.max(worst, same);
        if (others.some((o) => o > 0.5 && o <= same)) ordered = false;
      }
    }
    check = `${n} pages, joins match (mean diff ${worst.toFixed(3)}/255)`;
    if (worst > 0.5 || !ordered) throw new Error(`${out}: frames at a page join don't match a single-page render (mean ${worst.toFixed(3)}, ordered ${ordered})`);
  }
  await Promise.all(pages.map((p) => p.close()));
  await Promise.all(extra.map((b) => b.close().catch(() => {})));
  await mkdir(dirname(out), { recursive: true });
  const enc = ENCODER === 'x264'
    ? ['-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf)]
    : ['-c:v', 'h264_videotoolbox', '-b:v', bitrate, '-maxrate', maxrate, '-bufsize', maxrate];
  await ffmpeg(['-framerate', String(fps), '-i', join(dir, '%06d.png'), '-frames:v', String(frames), ...enc, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  await rm(dir, { recursive: true, force: true });
  return { frames, pages: n, renderSecs, fps: +(frames / renderSecs).toFixed(2), check };
  } catch (err) {
    await Promise.all(extra.map((b) => b.close().catch(() => {})));
    await rm(dir, { recursive: true, force: true });
    throw err;
  }
}
