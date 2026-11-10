// Puppeteer + ffmpeg plumbing shared by the pack steps. Templates are plain
// HTML with {{PLACEHOLDERS}}; each exposes window.ready and window.frame(t),
// so a video is just frame(t) + a screenshot, piped into ffmpeg.
import { spawn } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
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
  return puppeteer.launch({ headless: true, args: ['--allow-file-access-from-files', '--force-color-profile=srgb'] });
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
export async function open(page, template, { width, height, global, data, extra, scale = 1 }) {
  await page.setViewport({ width, height, deviceScaleFactor: scale });
  if (global) await page.evaluateOnNewDocument((g, d) => { window[g] = d; }, global, data);
  await page.goto(await prepare(template, extra), { waitUntil: 'networkidle0', timeout: 120000 });
  await page.evaluate(() => window.ready);
  const ok = await page.evaluate(() => document.fonts.check('600 20px "Josefin Sans"'));
  if (!ok) throw new Error(`Josefin Sans did not load in ${template}`);
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
    await page.evaluate((tt) => window.frame(tt), i / fps);
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
export const RENDER_PAGES = Math.max(1, Number(process.env.GALA_RENDER_PAGES || 3));

export async function renderVideo(browser, template, openOpts, out, { duration, fps = 30, crf = 16, bitrate = '14M', maxrate = '20M', scratch }) {
  const frames = Math.round(duration * fps);
  const n = Math.min(RENDER_PAGES, Math.max(1, Math.floor(frames / 60)));
  const dir = join(scratch, `frames-${Date.now()}`);
  await mkdir(dir, { recursive: true });
  const name = (i) => join(dir, `${String(i).padStart(6, '0')}.png`);
  const ranges = Array.from({ length: n }, (_, k) => [Math.floor((k * frames) / n), Math.floor(((k + 1) * frames) / n)]);
  const t0 = Date.now();
  const pages = await Promise.all(ranges.map(() => browser.newPage()));
  await Promise.all(pages.map((p) => open(p, template, openOpts)));
  await Promise.all(pages.map(async (p, k) => {
    for (let i = ranges[k][0]; i < ranges[k][1]; i++) {
      await p.evaluate((tt) => window.frame(tt), i / fps);
      await p.screenshot({ path: name(i), type: 'png' });
    }
  }));
  const renderSecs = (Date.now() - t0) / 1000;
  // Boundary check: re-render the frames either side of each join in one page.
  let check = 'single page';
  if (n > 1) {
    const sharp = require('sharp');
    const p = pages[0];
    let worst = 0;
    for (const [b] of ranges.slice(1)) {
      for (const i of [b - 1, b]) {
        await p.evaluate((tt) => window.frame(tt), i / fps);
        const again = await p.screenshot({ type: 'png' });
        const [x, y] = await Promise.all([sharp(again).raw().toBuffer(), sharp(name(i)).raw().toBuffer()]);
        let diff = 0;
        for (let j = 0; j < x.length; j++) diff = Math.max(diff, Math.abs(x[j] - y[j]));
        worst = Math.max(worst, diff, x.length === y.length ? 0 : 255);
      }
    }
    check = worst === 0 ? `${n} pages, joins identical` : `${n} pages, joins differ by up to ${worst}/255`;
    if (worst > 2) throw new Error(`${out}: frames at a page join don't match a single-page render (${worst}/255)`);
  }
  await Promise.all(pages.map((p) => p.close()));
  await mkdir(dirname(out), { recursive: true });
  const enc = ENCODER === 'x264'
    ? ['-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf)]
    : ['-c:v', 'h264_videotoolbox', '-b:v', bitrate, '-maxrate', maxrate, '-bufsize', maxrate];
  await ffmpeg(['-framerate', String(fps), '-i', join(dir, '%06d.png'), '-frames:v', String(frames), ...enc, '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out]);
  await rm(dir, { recursive: true, force: true });
  return { frames, pages: n, renderSecs, fps: +(frames / renderSecs).toFixed(2), check };
}
