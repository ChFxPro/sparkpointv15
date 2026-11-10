// Lightweight web files for the Gala page's trips section, built from the
// finished, music-led masters:
//
//   npm run trips:web -- greece
//
// <trip>/pack/web/:
//   <trip>-loop-card-16x9.{mp4,webm}  960x540, 6-8 s seamless loop, no audio
//   <trip>-loop-card-4x5.{mp4,webm}   720x900 (cropped from the 9:16 cut)
//   <trip>-loop-poster-{16x9,4x5}.webp  the loop's first frame
//   <trip>-film-16x9-web.mp4          the 16:9 promo with its music, 1280x720
//   web.json                          names, sizes, durations, dimensions
// Each loop is under 900 KB (never over 1.5 MB). The loop takes 3-4 footage
// moments cut on the beats and crossfades its end into its start, so the
// loop point is invisible.
// A timed-out call from a page that has already been closed shouldn't end the run.
process.on('unhandledRejection', (e) => console.warn(`ignored stray error: ${e?.message ?? e}`));
import { execFileSync } from 'node:child_process';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { exists, here, loadTrips, packDir, SCRATCH, TRIPS_DIR, writeJson } from './lib.mjs';
import { ffmpeg, renderVideo, launch } from './render.mjs';
import { closeShot } from './plan.mjs';
import { factsLine } from './map.mjs';

// The site importer (PR #235) refuses loops over 900 KB and films over 40 MB.
const TARGET = 880 * 1024, CEILING = 900 * 1024, FILM_MAX = 40 * 1024 * 1024;
const XF = 0.5; // loop-point crossfade

const size = async (f) => (await stat(f)).size;
const dur = (f) => Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim());

// 3-4 moments: footage shots, uncaptioned first (no text in the loop), spread
// through the film, each a whole number of beats starting on a downbeat.
function moments(edit, bm, want = 4, total = 7.2) {
  const foot = edit.shots.filter((s) => !['open', 'facts', 'close', 'map'].includes(s.what) && s.end - s.start >= 2);
  const clean = foot.filter((s) => !s.caption);
  const pool = (clean.length >= want ? clean : foot);
  const step = pool.length / want;
  const picked = Array.from({ length: Math.min(want, pool.length) }, (_, i) => pool[Math.floor(i * step + step / 2)]);
  const beats = Math.max(2, Math.round((total + XF) / picked.length / bm.beat));
  return picked.map((s) => {
    const len = beats * bm.beat;
    const startAt = bm.downbeats.find((d) => d >= s.start + 0.3 && d + len <= s.end - 0.1) ?? s.start + 0.3;
    return { from: +startAt.toFixed(3), len: +Math.min(len, s.end - startAt - 0.05).toFixed(3), shot: s.what };
  });
}

// Renders each loop moment from the cut's saved reel data with text off
// (no corner title, no captions), so the loop carries no words.
async function cleanSegments(trip, layout, segs, dir) {
  const reelFile = join(SCRATCH, 'reels', `${trip.id}-${layout}.json`);
  if (!(await exists(reelFile))) {
    // Re-plan the cut (deterministic, no render) to recover its reel data.
    execFileSync('node', [join(here, 'pack.mjs'), trip.id, '--only=plan', `--cuts=${layout}`], { stdio: 'inherit' });
  }
  const data = { ...JSON.parse(await readFile(reelFile, 'utf8')), clean: true };
  const browser = await launch();
  const files = [];
  try {
    for (const [i, sg] of segs.entries()) {
      const f = join(dir, `clean-${i}.mp4`);
      await renderVideo(browser, 'reel.html', { width: data.W, height: data.H, global: 'REEL', data }, f,
        { from: sg.from, duration: sg.len, bitrate: '24M', maxrate: '30M', scratch: join(dir, 'render') });
      files.push(f);
    }
  } finally { await browser.close(); }
  return files;
}

async function loop(clips, segs, vf, outBase, dir) {
  // Cut the moments (hard cuts on the beats), then crossfade the tail into the head.
  const parts = [];
  for (const [i, s] of segs.entries()) {
    const p = join(dir, `seg-${i}.mp4`);
    await ffmpeg(['-i', clips[i], '-an', '-vf', `${vf},fps=30,setsar=1`, '-c:v', 'libx264', '-crf', '14', '-preset', 'fast', '-pix_fmt', 'yuv420p', p]);
    parts.push(p);
  }
  const list = join(dir, 'list.txt');
  await writeFile(list, parts.map((p) => `file '${p}'`).join('\n'));
  const joined = join(dir, 'joined.mp4');
  await ffmpeg(['-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', joined]);
  const T = dur(joined);
  const seamless = join(dir, 'seamless.mp4');
  await ffmpeg(['-i', joined, '-filter_complex',
    `[0:v]split[a][b];[a]trim=${XF}:${T},setpts=PTS-STARTPTS[body];[b]trim=0:${XF},setpts=PTS-STARTPTS[head];[body][head]xfade=transition=fade:duration=${XF}:offset=${(T - 2 * XF).toFixed(3)}[v]`,
    '-map', '[v]', '-c:v', 'libx264', '-crf', '12', '-preset', 'fast', '-pix_fmt', 'yuv420p', seamless]);
  // Encode under the size target, stepping quality down until it fits.
  const mp4 = `${outBase}.mp4`, webm = `${outBase}.webm`;
  for (const crf of [28, 30, 32, 34, 36, 38]) {
    await ffmpeg(['-i', seamless, '-an', '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'veryslow', '-crf', String(crf), '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4]);
    if ((await size(mp4)) <= TARGET) break;
  }
  for (const crf of [38, 41, 44, 47, 50]) {
    await ffmpeg(['-i', seamless, '-an', '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(crf), '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', webm]);
    if ((await size(webm)) <= TARGET) break;
  }
  for (const f of [mp4, webm]) if ((await size(f)) > CEILING) throw new Error(`${f} is over 900 KB`);
  // Poster: the loop's first frame, about 40 KB.
  const poster = outBase.replace('-loop-card-', '-loop-poster-') + '.webp';
  const png = join(dir, 'poster.png');
  await ffmpeg(['-i', mp4, '-frames:v', '1', png]);
  for (const q of [72, 62, 52, 42]) {
    execFileSync('cwebp', ['-quiet', '-q', String(q), png, '-o', poster]);
    if ((await size(poster)) <= 45 * 1024) break;
  }
  return { mp4, webm, poster, duration: +dur(mp4).toFixed(2) };
}

const CREDIT = 'Footage and music: Envato Elements. Some photos and clips: Wikimedia Commons contributors (per-loop credits below).';

const ts = (t) => { const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = (t % 60).toFixed(3).padStart(6, '0'); return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${s}`; };

// WebVTT of the on-screen text, from the saved edit plan.
async function describe(trip, pack, v) {
  const e = JSON.parse(await readFile(v('edit-16x9.json'), 'utf8'));
  const cue = [];
  for (const s of e.shots) {
    const a = Math.max(0, s.start + (s.fadeIn ?? 0)), b = s.end;
    if (s.what === 'open') cue.push([a + 0.4, b, `A World of Connections, the SparkPoint Gala. Connection ${trip.connection}: ${trip.name}, ${pack.line}.`]);
    else if (s.what === 'map') cue.push([a, b, `Map: from Transylvania County, North Carolina, to ${pack.stops.map((x) => x.name).join(', ')}.`]);
    else if (s.what === 'facts') cue.push([a + 0.3, b, `${factsLine(trip).join(', ')}. ${pack.highlights.join('. ')}.`]);
    else if (s.what === 'close') cue.push([a, b, 'Choose your trip at the Gala. Every journey connects back home. Friday, December 11, 2026, Connestee Falls.']);
    else if (s.caption) cue.push([a + 0.5, b - 0.3, `${s.caption}.`]);
  }
  return 'WEBVTT\n\n' + cue.map(([a, b, t], i) => `${i + 1}\n${ts(a)} --> ${ts(b)}\n${t}\n`).join('\n');
}

// Which source each loop moment came from, for the site's credits.
async function sourcesFor(trip, pack, v, shotNames) {
  const src = JSON.parse(await readFile(v('sources.json'), 'utf8'));
  const stills = JSON.parse(await readFile(packDir(trip.id, 'stills', 'stills.json'), 'utf8')).stills;
  const out = new Map();
  for (const name of shotNames) {
    const r = pack.reel.find((x) => x.shows === name);
    if (!r) continue;
    let e = null;
    if (r.local) e = { file: 'Envato Elements footage', credit: 'Envato Elements', licence: 'Envato Elements licence', url: '' };
    else if (r.clip || r.commonsStill) {
      const c = src.clips.find((x) => x.title === (r.clip?.commons ?? r.commonsStill));
      if (c) e = { file: c.title.replace(/^File:/, ''), shows: name, credit: c.author, licence: c.license, url: c.page };
    } else if (r.still) {
      const st = stills.find((x) => x.file.startsWith(r.still));
      if (st) e = { file: st.source.title.replace(/^File:/, ''), shows: name, credit: st.source.author, licence: st.source.license, url: st.source.page };
    }
    if (e) out.set(e.file, e);
  }
  const sources = [...out.values()];
  const cc = sources.filter((x) => x.credit !== 'Envato Elements');
  const parts = [];
  if (sources.some((x) => x.credit === 'Envato Elements')) parts.push('Video: Envato Elements');
  for (const x of cc) parts.push(`${x.shows.split(',')[0]}: ${x.credit}, ${x.licence}`);
  return { sources: sources.map(({ shows, ...x }) => x), creditLine: parts.join(' · ') };
}

export async function buildWeb(trip, { metaOnly = false } = {}) {
  const v = (n) => packDir(trip.id, 'video', n);
  const need = [v(`${trip.id}-promo-16x9-silent.mp4`), v(`${trip.id}-promo-30s-9x16-silent.mp4`), v(`${trip.id}-promo-16x9.mp4`), v('edit-16x9.json'), v('edit-9x16.json')];
  for (const f of need) if (!(await exists(f))) throw new Error(`${trip.id}: ${f} missing; build the music-led video first`);
  const out = packDir(trip.id, 'web');
  await mkdir(out, { recursive: true });
  const work = join(SCRATCH, 'web', trip.id);
  await rm(work, { recursive: true, force: true });
  const pack = JSON.parse(await readFile(join(here, 'packs.json'), 'utf8')).trips[trip.id];
  const loopMeta = {};
  const files = [];
  const add = async (file, extra) => files.push({ file: file.split('/').pop(), bytes: await size(file), ...extra });

  for (const [fmt, src, edit, bmf, vf, w, h] of [
    ['16x9', `${trip.id}-promo-16x9-silent.mp4`, 'edit-16x9.json', 'beatmap-16x9.json', 'scale=960:540:flags=lanczos', 960, 540],
    ['4x5', `${trip.id}-promo-30s-9x16-silent.mp4`, 'edit-9x16.json', 'beatmap-9x16.json', 'crop=1080:1350:0:285,scale=720:900:flags=lanczos', 720, 900],
  ]) {
    const e = JSON.parse(await readFile(v(edit), 'utf8')), bm = JSON.parse(await readFile(v(bmf), 'utf8'));
    const dir = join(work, fmt);
    await mkdir(dir, { recursive: true });
    const segs = moments(e, bm);
    const credit = await sourcesFor(trip, pack, v, [...new Set(segs.map((x) => x.shot))]);
    if (metaOnly) { loopMeta[fmt] = credit; continue; }
    const clips = await cleanSegments(trip, fmt === '16x9' ? '16x9' : '9x16', segs, dir);
    const r = await loop(clips, segs, vf, join(out, `${trip.id}-loop-card-${fmt}`), dir);
    await add(r.mp4, { kind: 'loop', format: fmt, width: w, height: h, duration: r.duration, codec: 'h264', ...credit });
    await add(r.webm, { kind: 'loop', format: fmt, width: w, height: h, duration: r.duration, codec: 'vp9', ...credit });
    await add(r.poster, { kind: 'poster', format: fmt, width: w, height: h });
  }
  // The film: the 16:9 promo with its music, but with the website's end line
  // ("Choose your trip at the Gala") in place of the Gala screen's "tonight".
  const bm16 = JSON.parse(await readFile(v('beatmap-16x9.json'), 'utf8'));
  const close = closeShot(bm16);
  const len = +(close.end - close.start).toFixed(3);
  if (metaOnly) {
    const w = JSON.parse(await readFile(join(out, 'web.json'), 'utf8'));
    for (const f of w.files) if (f.kind === 'loop' && loopMeta[f.format]) Object.assign(f, loopMeta[f.format]);
    await writeJson(join(out, 'web.json'), { ...w, credit: CREDIT });
    console.log(`${trip.id}: web.json credits updated`);
    return w.files;
  }
  const browser = await launch();
  const webClose = join(work, 'close.mp4');
  try {
    await renderVideo(browser, 'reel.html', { width: 1920, height: 1080, global: 'REEL', data: {
      W: 1920, H: 1080, layout: '16x9', xfade: 0, duration: len, price: null, when: 'Friday, December 11, 2026 · Connestee Falls',
      closeLine: 'Choose your trip at the Gala',
      trip: { connection: trip.connection, name: trip.name, line: pack.line, facts: factsLine(trip), highlights: pack.highlights },
      shots: [{ card: 'close', shade: 'night', ...close, start: 0, end: len }],
    } }, webClose, { duration: len, scratch: join(work, 'render') });
  } finally { await browser.close(); }
  const film = join(out, `${trip.id}-film-16x9-web.mp4`);
  await ffmpeg(['-i', v(`${trip.id}-promo-16x9.mp4`), '-i', webClose, '-filter_complex',
    `[0:v]trim=0:${close.start},setpts=PTS-STARTPTS[a];[1:v]setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0,scale=1280:720:flags=lanczos,format=yuv420p[v]`,
    '-map', '[v]', '-map', '0:a', '-c:v', 'libx264', '-preset', 'slow', '-b:v', '2500k', '-maxrate', '3000k', '-bufsize', '5000k',
    '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', film]);
  if ((await size(film)) > FILM_MAX) throw new Error(`${film} is over 40 MB`);
  await add(film, { kind: 'film', format: '16x9', width: 1280, height: 720, duration: +dur(film).toFixed(2), codec: 'h264+aac', audio: true });
  // A short descriptive caption track of the on-screen text (the film has music, no speech).
  const vtt = film.replace(/\.mp4$/, '.vtt');
  await writeFile(vtt, await describe(trip, pack, v));
  await add(vtt, { kind: 'captions', format: 'vtt', lang: 'en' });
  await writeJson(join(out, 'web.json'), { trip: trip.id, name: trip.name, generated: new Date().toLocaleString("sv-SE", { timeZone: "America/New_York" }).slice(0, 16) + " ET", credit: CREDIT, files });
  await rm(work, { recursive: true, force: true });
  console.log(`${trip.id}: web ${files.map((f) => `${f.file} ${(f.bytes / 1024).toFixed(0)} KB`).join(', ')}`);
  return files;
}

export async function writeWebReady() {
  const { trips } = await loadTrips();
  const rows = [];
  for (const t of trips) {
    const f = packDir(t.id, 'web', 'web.json');
    if (!(await exists(f))) { rows.push(`| ${t.name} | not yet | |`); continue; }
    const w = JSON.parse(await readFile(f, 'utf8'));
    const loops = w.files.filter((x) => x.kind === 'loop').map((x) => `${x.format} ${x.codec} ${(x.bytes / 1024).toFixed(0)} KB`).join(', ');
    rows.push(`| ${t.name} | ready (${w.generated}) | ${loops} |`);
  }
  await writeFile(join(TRIPS_DIR, 'WEB-READY.md'), `# Web files for the Gala page's trips section

Built by \`npm run trips:web -- <trip>\` (\`scripts/gala-trips/web.mjs\`) from the music-led masters. Each trip's files
are in \`<trip>/pack/web/\`, listed with sizes, durations and dimensions in its \`web.json\`:

- \`<trip>-loop-card-16x9.{mp4,webm}\` (960×540) and \`<trip>-loop-card-4x5.{mp4,webm}\` (720×900): 6–8 s seamless loops, no audio, under 900 KB each. Use \`muted autoplay loop playsinline\`, WebM first, MP4 fallback, and pause them under reduced motion.
- \`<trip>-loop-poster-{16x9,4x5}.webp\`: each loop's first frame (about 40 KB), as the \`poster\`.
- \`<trip>-film-16x9-web.mp4\`: the full promo with its music, 1280×720, for an on-demand "Watch the film" player (don't autoplay it).

Credits: the footage and music are Envato Elements (no public credit needed). Each loop in web.json has its own \`sources\` and a public \`creditLine\`. Some trips also use CC-licensed
Wikimedia Commons stills or clips; see that trip's \`pack/LICENSES.md\`. If the page credits photos, use the lines there.

| Trip | Web files | Loops |
| --- | --- | --- |
${rows.join('\n')}
`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const ids = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  const { trips } = await loadTrips();
  const metaOnly = process.argv.includes('--meta-only');
  for (const t of trips) if (!ids.length || ids.includes(t.id)) await buildWeb(t, { metaOnly });
  await writeWebReady();
}
