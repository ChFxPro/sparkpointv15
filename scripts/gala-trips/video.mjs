// The promo video (picture only; audio.mjs adds the sound): a 16:9 master for the Gala screen (60–90 s) and 30 s cuts at
// 9:16 and 1:1 for social. Shots come from packs.json `reel`: the trip's own
// stills, extra Commons stills, and Commons video clips (fetched as a small
// byte range of the 4K original, then cropped). Every source is logged to
// video/sources.json, which feeds LICENSES.md.
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { CACHE, SCRATCH, UA, exists, fetchWithRetry, packDir, require, sleep, writeJson } from './lib.mjs';
import { factsLine, mapFramesTimed, SIZES } from './map.mjs';
import { isAerial, mapTiming, plan, sourceKey } from './plan.mjs';
import { ffmpeg, open, renderVideo, video } from './render.mjs';

const sharp = require('sharp');
const FPS = 30;
const XFADE = 0.6;
const strip = (html = '') => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const hash = (s) => createHash('sha1').update(s).digest('hex').slice(0, 12);

async function commons(title, video = false) {
  const u = new URL('https://commons.wikimedia.org/w/api.php');
  const prop = video ? { prop: 'videoinfo', viprop: 'url|size|extmetadata' } : { prop: 'imageinfo', iiprop: 'url|size|extmetadata' };
  for (const [k, v] of Object.entries({ action: 'query', format: 'json', titles: title, ...prop })) u.searchParams.set(k, v);
  const page = Object.values((await fetchWithRetry(u, { json: true })).query.pages)[0];
  const info = (page.videoinfo ?? page.imageinfo)?.[0];
  if (!info) throw new Error(`Not on Commons: ${title}`);
  const m = info.extmetadata;
  return { title: page.title, page: info.descriptionurl, url: info.url.split('?')[0], width: info.width, height: info.height,
    author: strip(m.Artist?.value) || 'Unknown', license: m.LicenseShortName?.value ?? '', licenseUrl: m.LicenseUrl?.value ?? '' };
}

// A Commons still, cached as a 3200 px JPEG for the compositor.
async function extraStill(title) {
  const info = await commons(title);
  const file = join(CACHE, 'reel', `still-${hash(title)}.jpg`);
  if (!(await exists(file))) {
    await mkdir(join(CACHE, 'reel'), { recursive: true });
    const buf = await fetchWithRetry(info.url);
    await sharp(buf, { limitInputPixels: false }).rotate().resize({ width: 3200, withoutEnlargement: true }).jpeg({ quality: 90 }).toFile(file);
    await sleep(1500);
  }
  return { file, info };
}

// A Commons clip window: fetch only the bytes around it from the original,
// then cut frames exactly, cropping off the bottom band (a channel's watermark
// and burnt-in subtitles sit there on some uploads).
async function clipFrames(spec) {
  const info = await commons(spec.commons, true);
  const key = hash(`${spec.commons}|${spec.at}|${spec.dur}|${spec.keepTop ?? 1}|long`);
  const dir = join(CACHE, 'reel', `clip-${key}`);
  const done = join(dir, 'done');
  if (!(await exists(done))) {
    await mkdir(dir, { recursive: true });
    const part = join(dir, 'part.webm');
    const pre = Math.min(3, spec.at);
    await ffmpeg(['-user_agent', UA, '-ss', String(spec.at - pre), '-i', info.url, '-t', String(spec.dur + pre + 5), '-an', '-c:v', 'copy', part]);
    // Keep the top `keepTop` of the frame at 16:9, centred on `cropX`.
    const keep = spec.keepTop ?? 1;
    const crop = `crop='min(iw,ih*${keep}*16/9)':'ih*${keep}':'(iw-min(iw,ih*${keep}*16/9))*${spec.cropX ?? 0.5}':0`;
    // `-ss` after -i seeks exactly (by decoding) within the fetched part.
    await ffmpeg(['-i', part, '-ss', String(pre), '-t', String(spec.dur + 2.5), '-vf', `${crop},scale=2560:-2:flags=lanczos,fps=${FPS}`, '-q:v', '3', join(dir, '%05d.jpg')]);
    await writeFile(done, '');
  }
  const count = (await readdir(dir)).filter((f) => f.endsWith('.jpg')).length;
  return { frames: { pattern: `${pathToFileURL(dir).href}/%05d.jpg`, count, fps: FPS }, info };
}

// Jeff's supplemental footage on the NorthBend drive (read only: frames go to
// the repo's git-ignored cache). Its licence comes from that folder's SOURCES.md.
// Jeff confirmed 2026-11-10 that every clip in the Supp video folders is licensed to him through Envato Elements.
const ENVATO = 'Envato Elements, licensed to Jeff Bannister (confirmed 2026-11-10)';
export const SUPP = process.env.GALA_SUPP_DIR || '/Volumes/NORTHBEND/Sparkpoint/2026/Gala 26/Supp video';

async function suppSources(tripId) {
  const file = join(SUPP, tripId, 'SOURCES.md');
  return (await exists(file)) ? await readFile(file, 'utf8') : '';
}

async function localFrames(tripId, spec) {
  const src = join(SUPP, tripId, spec.local);
  if (!(await exists(src))) throw new Error(`${tripId}: footage not found (is NorthBend mounted?): ${src}`);
  const key = hash(`${tripId}|${spec.local}|${spec.at}|${spec.dur}|long`);
  const dir = join(CACHE, 'reel', `local-${key}`);
  if (!(await exists(join(dir, 'done')))) {
    await mkdir(dir, { recursive: true });
    await ffmpeg(['-ss', String(spec.at), '-i', src, '-t', String(spec.dur + 2.5), '-an', '-vf', `fps=${FPS},scale=1920:-2:flags=lanczos`, '-q:v', '2', join(dir, '%05d.jpg')]);
    await writeFile(join(dir, 'done'), '');
  }
  const count = (await readdir(dir)).filter((f) => f.endsWith('.jpg')).length;
  // SOURCES.md: one line per clip, "filename · source URL · licence".
  const line = (await suppSources(tripId)).split('\n').find((l) => l.includes(spec.local));
  const [, url = '', license = ''] = line ? line.split('·').map((x) => x.trim()) : [];
  return {
    frames: { pattern: `${pathToFileURL(dir).href}/%05d.jpg`, count, fps: FPS },
    info: { title: spec.local, page: url || '', author: 'Supplied by SparkPoint', license: license || ENVATO, licenseUrl: url },
  };
}

// The map's own MP4 for this layout, as frames.
async function mapFrames(trip, layout) {
  const mp4 = packDir(trip.id, 'map', `${trip.id}-journey-map-${layout}.mp4`);
  const dir = join(CACHE, 'reel', `map-${trip.id}-${layout}`);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  await ffmpeg(['-i', mp4, '-q:v', '2', join(dir, '%05d.jpg')]);
  const count = (await readdir(dir)).filter((f) => f.endsWith('.jpg')).length;
  return { pattern: `${pathToFileURL(dir).href}/%05d.jpg`, count, fps: FPS };
}

const MOVES = {
  in: { z0: 1.03, z1: 1.15 }, out: { z0: 1.16, z1: 1.03 },
  left: { z0: 1.12, z1: 1.12, fx0: .68, fx1: .32 }, right: { z0: 1.12, z1: 1.12, fx0: .32, fx1: .68 },
  still: { z0: 1, z1: 1 },
};
function move(kind = 'in', fx = .5, fy = .5) {
  const m = MOVES[kind];
  return { z0: m.z0, z1: m.z1, fx0: m.fx0 ?? fx, fx1: m.fx1 ?? fx, fy0: fy, fy1: fy };
}

// Resolves the trip's reel into media, once for all cuts.
async function prepareShots(trip, pack) {
  const sources = [];
  const shots = [];
  const stills = JSON.parse(await readFile(packDir(trip.id, 'stills', 'stills.json'), 'utf8')).stills;
  for (const r of pack.reel) {
    const shot = { ...r };
    if (r.still) {
      const s = stills.find((x) => x.file.startsWith(r.still));
      if (!s) throw new Error(`${trip.id}: no still ${r.still}`);
      shot.image = pathToFileURL(packDir(trip.id, 'stills', s.files[2400])).href;
      sources.push({ id: s.file, kind: 'still', shows: s.place, ...s.source, used: 'gap fill: pack still' });
    } else if (r.commonsStill) {
      const { file, info } = await extraStill(r.commonsStill);
      shot.image = pathToFileURL(file).href;
      sources.push({ id: `still-${hash(r.commonsStill)}`, kind: 'still', shows: r.shows ?? '', ...info, used: 'gap fill: video only' });
    } else if (r.local) {
      const { frames, info } = await localFrames(trip.id, r.local);
      shot.frames = frames;
      sources.push({ id: r.local.local, kind: 'clip', shows: r.shows ?? '', ...info, used: `${r.local.at}s–${r.local.at + r.local.dur}s` });
    } else if (r.clip) {
      const { frames, info } = await clipFrames(r.clip);
      shot.frames = frames;
      sources.push({ id: `clip-${hash(r.clip.commons)}`, kind: 'clip', shows: r.shows ?? '', ...info, used: `gap fill: ${r.clip.at}s–${r.clip.at + r.clip.dur}s${r.clip.keepTop ? ', cropped to remove a watermark' : ''}` });
    }
    shots.push(shot);
  }
  const cards = stills.map((s) => pathToFileURL(packDir(trip.id, 'stills', s.files[2400])).href);
  // Stills the reel doesn't use, to fill with a slow push if footage runs short.
  const usedStills = new Set(pack.reel.filter((r) => r.still).map((r) => r.still));
  const moves = ['in', 'right', 'out', 'left'];
  const fills = stills.filter((st) => ![...usedStills].some((u) => st.file.startsWith(u))).map((st, i) => ({
    still: st.file, shows: st.place, image: pathToFileURL(packDir(trip.id, 'stills', st.files[2400])).href, move: moves[i % 4], fx: 0.5, social: true,
    source: st.source,
  }));
  return { shots, sources, cards, fills };
}

// Look-alike check between neighbours (Jeff's rule 1): the last frame of one
// shot against the first of the next, by perceptual hash and colour histogram.
async function shotFrame(s, which) {
  if (s.image) return fileURLToPath(s.image);
  if (!s.frames) return null;
  const len = s.end - s.start;
  const idx = which === 'first' ? 1 : Math.max(1, Math.min(s.frames.count, Math.floor(len * s.frames.fps)));
  return fileURLToPath(s.frames.pattern.replace('%05d', String(idx).padStart(5, '0')));
}
async function looks(file) {
  const g = await sharp(file).resize(9, 8, { fit: 'fill' }).grayscale().raw().toBuffer();
  const hash = [];
  for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) hash.push(g[y * 9 + x + 1] > g[y * 9 + x]);
  const c = await sharp(file).resize(32, 18, { fit: 'fill' }).removeAlpha().raw().toBuffer();
  const h = new Array(48).fill(0);
  for (let i = 0; i < c.length; i += 3) for (let k = 0; k < 3; k++) h[k * 16 + (c[i + k] >> 4)]++;
  return { hash, h };
}
function corr(a, b) {
  const ma = a.reduce((x, y) => x + y, 0) / a.length, mb = b.reduce((x, y) => x + y, 0) / b.length;
  let n = 0, da = 0, db = 0;
  for (let i = 0; i < a.length; i++) { n += (a[i] - ma) * (b[i] - mb); da += (a[i] - ma) ** 2; db += (b[i] - mb) ** 2; }
  return n / Math.sqrt(da * db + 1e-9);
}
async function lookAlikes(shots) {
  const out = [];
  const foot = shots.filter((s) => !s.card && !s.map);
  for (let i = 1; i < foot.length; i++) {
    const a = await shotFrame(foot[i - 1], 'last'), b = await shotFrame(foot[i], 'first');
    if (!a || !b) continue;
    const [x, y] = await Promise.all([looks(a), looks(b)]);
    const ham = x.hash.filter((v, k) => v !== y.hash[k]).length, hc = corr(x.h, y.h);
    if (ham <= 8 && hc >= 0.94) out.push({ from: foot[i - 1].shows, to: foot[i].shows, hash: ham, hist: +hc.toFixed(3) });
  }
  return out;
}

// Frames of an MP4, for the compositor.
async function framesOf(mp4, dir) {
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  await ffmpeg(['-i', mp4, '-q:v', '2', join(dir, '%05d.jpg')]);
  const count = (await readdir(dir)).filter((f) => f.endsWith('.jpg')).length;
  return { pattern: `${pathToFileURL(dir).href}/%05d.jpg`, count, fps: FPS };
}

// Cuts each format to its music (see plan.mjs and score.mjs).
export async function buildVideo(browser, trip, pack, { price = null, when, cuts, score, home, planOnly = false } = {}) {
  if (!pack.reel?.length) throw new Error(`${trip.id}: no reel in packs.json`);
  if (!score) throw new Error(`${trip.id}: no score; the video is cut to its music`);
  console.log(`${trip.id}: preparing shots`);
  const prepared = await prepareShots(trip, pack);
  console.log(`${trip.id}: shots ready`);
  const outputs = [];
  const foot = (s) => ({ ...s, move: s.frames ? move('still', s.fx ?? .5) : move(s.move, s.fx ?? .5, s.fy ?? .5) });
  for (const [kind, layout] of [['full', '16x9'], ['social', '9x16'], ['social', '1x1']].filter(([, l]) => !cuts || cuts.includes(l))) {
    const [W, H] = SIZES[layout];
    const bm = score.cuts[layout].beatmap;
    const cards = {
      open: { card: 'open', shade: 'card', image: prepared.cards[0], move: move('in') },
      map: { map: true, shade: 'none', move: move('still') },
      facts: { card: 'facts', shade: 'card', image: prepared.cards[pack.factsBg ?? 1], move: move('out'), highlights: pack.highlights.length },
      close: { card: 'close', shade: 'night' },
    };
    let footage = prepared.shots.map(foot).filter((s) => kind === 'full' || s.social);
    const fills = prepared.fills.map(foot);
    let p = plan(kind, bm, footage, cards, fills);
    // Rule 1: if neighbours look alike, move the second one later and re-plan.
    let alike = await lookAlikes(p.shots);
    for (let tries = 0; alike.length && tries < 4; tries++) {
      const i = footage.findIndex((s) => s.shows === alike[0].to);
      if (i < 0 || i >= footage.length - 1) break;
      [footage[i], footage[i + 1]] = [footage[i + 1], footage[i]];
      p = plan(kind, bm, footage, cards, fills);
      alike = await lookAlikes(p.shots);
    }
    p.report.lookAlikes = alike;
    if (p.map && !planOnly) {
      const m = p.shots.find((s) => s.map);
      const timing = mapTiming(bm, m.end - m.start, pack.stops.filter((s) => s.at).length);
      const dir = join(SCRATCH, 'reel', `map-${trip.id}-${layout}-timed`);
      await mkdir(dir, { recursive: true });
      const mp4 = await mapFramesTimed(browser, trip, pack, home, layout, timing, dir);
      m.frames = await framesOf(mp4, join(dir, 'frames'));
      m.timing = timing;
    }
    const { shots, duration } = p;
    const data = {
      W, H, layout, xfade: 0, duration, shots, price,
      trip: { connection: trip.connection, name: trip.name, line: pack.line, facts: factsLine(trip), highlights: pack.highlights },
      closeLine: kind === 'full' ? 'Choose your trip tonight' : 'Choose your trip at the Gala',
      when,
    };
    const edit = { duration, hit: p.hit, factsAt: p.factsAt, closeAt: p.closeAt, finalHit: p.finalHit, changes: p.changes, map: p.map,
      report: p.report,
      shots: shots.map((s) => ({ start: +s.start.toFixed(3), end: +s.end.toFixed(3), fadeIn: s.fadeIn, what: s.card ?? (s.map ? 'map' : s.shows),
        caption: s.caption ? s.caption.join(' — ') : null, source: s.card || s.map ? null : sourceKey(s), aerial: isAerial(s), fill: Boolean(s.fill),
        window: s.local ? [s.local.at, s.local.dur] : s.clip ? [s.clip.at, s.clip.dur] : null })) };
    // The reel data, so web.mjs can re-render loop moments without text.
    await writeJson(join(SCRATCH, 'reels', `${trip.id}-${layout}.json`), data);
    if (planOnly === 'dry') {
      await writeJson(join(SCRATCH, 'plans', `${trip.id}-${layout}.json`), edit);
      console.log(`${trip.id}: planned ${layout}`);
      continue;
    }
    if (planOnly) {
      const saved = JSON.parse(await readFile(packDir(trip.id, 'video', `edit-${layout}.json`), 'utf8'));
      const same = JSON.stringify(saved.changes) === JSON.stringify(edit.changes);
      console.log(`${trip.id}: plan for ${layout} ${same ? 'matches the rendered edit' : 'DIFFERS from the rendered edit'}`);
      if (!same) throw new Error(`${trip.id} ${layout}: re-planned edit does not match the render`);
      continue;
    }
    await writeJson(join(SCRATCH, 'timelines', `${trip.id}-${layout}.json`), edit.shots);
    await writeJson(packDir(trip.id, 'video', `edit-${layout}.json`), edit);
    const name = kind === 'full' ? `${trip.id}-promo-16x9` : `${trip.id}-promo-30s-${layout}`;
    const silent = packDir(trip.id, 'video', `${name}-silent.mp4`);
    const r = await renderVideo(browser, 'reel.html', { width: W, height: H, global: 'REEL', data }, silent,
      { duration, fps: FPS, crf: 17, scratch: join(SCRATCH, 'render'), ...(kind === 'full' ? { bitrate: '14M', maxrate: '20M' } : { bitrate: '8M', maxrate: '12M' }) });
    outputs.push(silent);
    console.log(`${trip.id}: video ${name} (${duration.toFixed(1)} s, ${shots.length} shots, cut to the music; ${r.frames} frames at ${r.fps} fps on ${r.mode}, ${r.check})`);
  }
  if (planOnly) return outputs;
  const srcFile = packDir(trip.id, 'video', 'sources.json');
  const old = (await exists(srcFile)) ? JSON.parse(await readFile(srcFile, 'utf8')) : {};
  await writeJson(srcFile, { trip: trip.id, clips: prepared.sources, music: old.music ?? null, sfx: old.sfx ?? [] });
  return outputs;
}
