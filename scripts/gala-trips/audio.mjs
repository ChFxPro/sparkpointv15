// The sound for each cut, mixed onto the silent masters without re-rendering
// the picture:
//
//   npm run trips:audio -- greece          # re-mix one trip's three cuts
//
// Music: Jeff's track in Supp video/_music/<trip>/ when there is one (his
// favourite's filename starts with "1"), otherwise the trip's Commons track in
// packs.json. The track plays from its start and crossfades into its own last
// bars, so every cut ends on the music's real ending rather than a fade.
// Sound effects (any other audio files in that folder) sit low under the shots
// whose descriptions share a word with the file name, or under the whole cut.
// Loudness: -14 LUFS for the 16:9 Gala-screen master, -16 for social.
// Stems (music, effects) are kept per cut so a voiceover can go on top later.
import { readdir, readFile } from 'node:fs/promises';
import { basename, extname, join } from 'node:path';
import { exists, packDir, SCRATCH, writeJson } from './lib.mjs';
import { ffmpeg } from './render.mjs';
import { SUPP } from './video.mjs';

const AUDIO = /\.(wav|mp3|m4a|aac|aif|aiff|flac|ogg)$/i;
const ENVATO = 'Envato Elements, licensed to Jeff Bannister';
const ENDING = 5; // seconds of the track's real ending kept at the end
const XF = 2.5;   // crossfade into that ending

export const CUTS = [
  { layout: '16x9', name: (id) => `${id}-promo-16x9`, lufs: -14 },
  { layout: '9x16', name: (id) => `${id}-promo-30s-9x16`, lufs: -16 },
  { layout: '1x1', name: (id) => `${id}-promo-30s-1x1`, lufs: -16 },
];

async function probe(file) {
  const { execFileSync } = await import('node:child_process');
  return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());
}

// Jeff's music and effects for a trip, if any. A track is a file, or an
// Envato download folder holding versions (full, instrumental, 60/30 s edits,
// shorts); loops and stems are ignored. A zip is unpacked into scratch.
async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) { if (!/^(loops?|stems?)$/i.test(e.name)) out.push(...(await walk(p))); }
    else if (AUDIO.test(e.name) && !/loop|stem/i.test(e.name)) out.push(p);
  }
  return out;
}

const cleanTitle = (n) => n.replace(/^./, (c) => c).replace(/\.(zip|wav|mp3|m4a|aiff?|flac|ogg)$/i, '').replace(/-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-utc$/, '').replace(/^1[\s_-]*/, '').replace(/[-_]+/g, ' ').trim().replace(/\b\w/g, (c) => c.toUpperCase());

export async function suppliedAudio(tripId) {
  const dir = join(SUPP, '_music', tripId);
  if (!(await exists(dir))) return { music: null, sfx: [] };
  const entries = (await readdir(dir, { withFileTypes: true })).filter((e) => !e.name.startsWith('.') && !/\.download$|\.md$/i.test(e.name));
  const isSfx = (n) => /sfx|ambien|fx[-_ ]|sound[-_ ]?effect/i.test(n);
  const sfx = entries.filter((e) => e.isFile() && AUDIO.test(e.name) && isSfx(e.name)).map((e) => join(dir, e.name));
  const tracks = entries.filter((e) => !isSfx(e.name) && (e.isDirectory() || AUDIO.test(e.name) || /\.zip$/i.test(e.name))).sort((x, y) => x.name.localeCompare(y.name));
  const pick = tracks.find((e) => e.name.startsWith('1')) ?? tracks[0];
  if (!pick) return { music: null, sfx };
  let root = join(dir, pick.name);
  if (/\.zip$/i.test(pick.name)) {
    const to = join(SCRATCH, 'music-unzipped', tripId, pick.name);
    if (!(await exists(to))) { await (await import('node:fs/promises')).mkdir(to, { recursive: true }); (await import('node:child_process')).execFileSync('unzip', ['-q', '-o', root, '-d', to]); }
    root = to;
  }
  const files = pick.isDirectory() || /\.zip$/i.test(pick.name) ? await walk(root) : [root];
  const versions = [];
  // One entry per version, WAV over MP3 when both are there.
  const byStem = new Map();
  for (const f of files) { const k = f.replace(/\.[^.]+$/, ''); if (!byStem.has(k) || /\.wav$/i.test(f)) byStem.set(k, f); }
  for (const f of byStem.values()) versions.push({ file: f, len: await probe(f), name: basename(f).toLowerCase() });
  return { music: { versions, credit: { title: cleanTitle(pick.name), author: 'Envato Elements', license: ENVATO, page: '' } }, sfx };
}

// The version of a supplied track that best fits a cut of `d` seconds: a
// ready-made edit a little longer than the cut, else the full track
// (instrumental first, so a voiceover can sit on top later).
function versionFor(music, d) {
  if (!music.versions) return music;
  const v = music.versions;
  const edit = v.filter((x) => x.len >= d - 1 && x.len <= d + 8).sort((a, b) => a.len - b.len)[0];
  if (edit && d < 50) return { file: edit.file, start: 0 };
  const full = v.filter((x) => x.len >= d).sort((a, b) => (/instrumental/.test(b.name) - /instrumental/.test(a.name)) || (/full|main/.test(b.name) - /full|main/.test(a.name)) || b.len - a.len)[0] ?? v.sort((a, b) => b.len - a.len)[0];
  return { file: full.file, start: 0 };
}

async function measure(file, target) {
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync('ffmpeg', ['-hide_banner', '-i', file, '-af', `loudnorm=${target}:print_format=json`, '-f', 'null', '-'], { encoding: 'utf8' });
  const blocks = r.stderr.match(/\{[^{}]*"input_i"[^{}]*\}/g);
  if (!blocks) throw new Error(`loudness measure failed for ${file}`);
  return JSON.parse(blocks.at(-1));
}

// A bed of exactly `d` seconds that ends on the track's own ending.
async function bed(music, d, out) {
  const len = await probe(music.file);
  const start = music.start ?? 0;
  if (len - start <= d + 0.5) {
    // Shorter than the cut: play it through and fade the tail.
    await ffmpeg(['-ss', String(start), '-i', music.file, '-af', `apad,atrim=0:${d},afade=t=in:d=1,afade=t=out:st=${Math.max(0, d - 3)}:d=3`, '-ar', '48000', '-ac', '2', out]);
    return;
  }
  const head = d - ENDING + XF;
  await ffmpeg(['-ss', String(start), '-t', String(head), '-i', music.file, '-ss', String(len - ENDING), '-i', music.file, '-filter_complex',
    `[0:a]afade=t=in:d=1[h];[h][1:a]acrossfade=d=${XF}:c1=tri:c2=tri,atrim=0:${d},afade=t=out:st=${d - 1.2}:d=1.2[a]`, '-map', '[a]', '-ar', '48000', '-ac', '2', out]);
}

// Effects under matching shots (word overlap with the shot), else the whole cut, low.
async function sfxBed(sfx, timeline, d, out) {
  if (!sfx.length) return false;
  const words = (s) => new Set(String(s).toLowerCase().split(/[^a-z]+/).filter((w) => w.length > 3));
  const inputs = [], parts = [];
  sfx.forEach((file, i) => {
    const w = words(basename(file));
    const shots = timeline.filter((s) => [...words(s.what)].some((x) => w.has(x)));
    const spans = shots.length ? shots.map((s) => [s.start, s.end]) : [[0, d]];
    spans.forEach(([a, b], k) => {
      inputs.push('-stream_loop', '-1', '-i', file);
      const n = inputs.filter((x) => x === '-i').length - 1;
      parts.push(`[${n}:a]atrim=0:${(b - a).toFixed(2)},afade=t=in:d=0.6,afade=t=out:st=${Math.max(0, b - a - 0.8).toFixed(2)}:d=0.8,adelay=${Math.round(a * 1000)}|${Math.round(a * 1000)},volume=0.22[s${i}_${k}]`);
    });
  });
  const labels = parts.map((p) => p.slice(p.lastIndexOf('['))).join('');
  await ffmpeg([...inputs, '-filter_complex', `${parts.join(';')};${labels}amix=inputs=${parts.length}:normalize=0,apad,atrim=0:${d}[a]`, '-map', '[a]', '-ar', '48000', '-ac', '2', out]);
  return true;
}

export async function mixTrip(trip, commonsMusic) {
  const supplied = await suppliedAudio(trip.id);
  const music = supplied.music ?? commonsMusic;
  if (!music) { console.warn(`${trip.id}: no music; silent masters only`); return null; }
  const stems = join(SCRATCH, 'stems', trip.id);
  for (const cut of CUTS) {
    const silent = packDir(trip.id, 'video', `${cut.name(trip.id)}-silent.mp4`);
    if (!(await exists(silent))) continue;
    const d = await probe(silent);
    const tlFile = join(SCRATCH, 'timelines', `${trip.id}-${cut.layout}.json`);
    const timeline = (await exists(tlFile)) ? JSON.parse(await readFile(tlFile, 'utf8')) : [];
    const mBed = join(stems, `${cut.layout}-music.wav`), fBed = join(stems, `${cut.layout}-sfx.wav`);
    await (await import('node:fs/promises')).mkdir(stems, { recursive: true });
    const chosen = versionFor(music, d);
    await bed(chosen, d, mBed);
    const hasSfx = await sfxBed(supplied.sfx, timeline, d, fBed);
    // Mix down, then two-pass loudness normalisation (measure, then apply linearly).
    const mixWav = join(stems, `${cut.layout}-mix.wav`);
    await ffmpeg(['-i', mBed, ...(hasSfx ? ['-i', fBed] : []), '-filter_complex', hasSfx ? '[0:a][1:a]amix=inputs=2:normalize=0[a]' : '[0:a]anull[a]', '-map', '[a]', mixWav]);
    const target = `I=${cut.lufs}:TP=-1.5:LRA=11`;
    const m = await measure(mixWav, target);
    await ffmpeg(['-i', silent, '-i', mixWav, '-filter_complex',
      `[1:a]loudnorm=${target}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000[a]`,
      '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', packDir(trip.id, 'video', `${cut.name(trip.id)}.mp4`)]);
    console.log(`${trip.id}: audio ${cut.layout} (${cut.lufs} LUFS, ${basename(chosen.file)}${hasSfx ? ', with effects' : ''})`);
  }
  // Record the music (and effects) used, for LICENSES.md and captions.md.
  const srcFile = packDir(trip.id, 'video', 'sources.json');
  if (await exists(srcFile)) {
    const src = JSON.parse(await readFile(srcFile, 'utf8'));
    src.music = music.credit;
    src.sfx = supplied.sfx.map((f) => ({ title: basename(f), license: ENVATO }));
    await writeJson(srcFile, src);
  }
  return music.credit;
}
