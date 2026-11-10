// Puppeteer + ffmpeg plumbing shared by the pack steps. Templates are plain
// HTML with {{PLACEHOLDERS}}; each exposes window.ready and window.frame(t),
// so a video is just frame(t) + a screenshot, piped into ffmpeg.
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
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
export async function video(page, out, { duration, fps = 30, alpha = false, crf = 16 }) {
  await mkdir(dirname(out), { recursive: true });
  const args = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-'];
  if (alpha) args.push('-c:v', 'prores_ks', '-profile:v', '4444', '-pix_fmt', 'yuva444p10le', out);
  else args.push('-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out);
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
