// Music first: picks the audio for each cut and beat-maps it, so the picture
// can be cut to it. For each cut the track's own edit is used when one fits
// (Envato's 30/60 s edits or shorts in the same folder); otherwise the full
// track is cut at phrase lines into its real ending (beatmap.py splice).
// The beat map is saved in the pack (video/beatmap-<layout>.json) so the edit
// is reproducible; the audio itself stays in render scratch.
import { execFileSync } from 'node:child_process';
import { copyFile, mkdir, readdir, readFile } from 'node:fs/promises';
import { basename, dirname, join } from 'node:path';
import { exists, here, packDir, SCRATCH } from './lib.mjs';

export const SUPP = process.env.GALA_SUPP_DIR || '/Volumes/NORTHBEND/Sparkpoint/2026/Gala 26/Supp video';
const PY = process.env.GALA_PY || join(SCRATCH, 'pyenv', 'bin', 'python');
const AUDIO = /\.(wav|aiff?|flac|mp3)$/i;
// Other mixes of the same track that are not edits of it.
const OTHER_MIX = /no[-_ ]?(bagpipe|orchestra|drums|melody)|solo|main[-_ ]version|vocal|stem|loop/i;

function seconds(file) {
  return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());
}

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (AUDIO.test(e.name)) out.push(p);
  }
  return out;
}

// The chosen track and its edits (same Envato folder), WAV over MP3.
async function resolve(tripId, score) {
  const rel = score.use === 'alternate' && score.alternate ? score.alternate : score.track;
  const track = join(SUPP, '_music', tripId, rel);
  if (!(await exists(track))) throw new Error(`${tripId}: music not found: ${track}`);
  const top = join(SUPP, '_music', tripId, rel.split('/')[0]);
  const files = (await walk(top)).filter((f) => f !== track && !OTHER_MIX.test(basename(f)) && /(\d+)\s*[-_ ]?sec|short|edit/i.test(basename(f)));
  const byStem = new Map();
  for (const f of files) { const k = f.replace(/\.[^.]+$/, ''); if (!byStem.has(k) || /\.wav$/i.test(f)) byStem.set(k, f); }
  const edits = [...byStem.values()].map((f) => ({ file: f, len: seconds(f) }));
  return { track, len: seconds(track), edits, title: cleanTitle(rel) };
}

const cleanTitle = (rel) => basename(dirname(rel) === '.' ? rel : rel.split('/')[0])
  .replace(/-\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}-utc$/, '').replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim()
  .replace(/\b\w/g, (c) => c.toUpperCase());

function py(args) {
  execFileSync(PY, [join(here, 'beatmap.py'), ...args], { stdio: ['ignore', 'ignore', 'inherit'] });
}

// Returns { file, beatmap } for a cut whose length must fall in [lo, hi].
async function forCut(tripId, music, layout, [lo, hi], target) {
  const dir = join(SCRATCH, 'score', tripId);
  await mkdir(dir, { recursive: true });
  const json = join(dir, `${layout}.json`);
  const edit = music.edits.filter((e) => e.len >= lo - 0.5 && e.len <= hi + 0.5).sort((a, b) => Math.abs(a.len - target) - Math.abs(b.len - target))[0];
  let file;
  if (edit) { file = edit.file; py(['analyze', file, json]); }
  else if (music.len >= lo - 0.5 && music.len <= hi + 0.5) { file = music.track; py(['analyze', file, json]); }
  else { file = join(dir, `${layout}.wav`); py(['splice', music.track, String(target), file, json]); }
  const beatmap = JSON.parse(await readFile(json, 'utf8'));
  beatmap.file = file;
  beatmap.version = edit ? `edit: ${basename(edit.file)}` : file === music.track ? `full track: ${basename(file)}` : `cut from ${basename(music.track)} at phrase lines`;
  await mkdir(packDir(tripId, 'video'), { recursive: true });
  const { writeFile } = await import('node:fs/promises');
  await writeFile(packDir(tripId, 'video', `beatmap-${layout}.json`), JSON.stringify({ ...beatmap, file: basename(file) }, null, 1));
  return { file, beatmap };
}

export async function scoreTrip(trip, pack, config) {
  if (!pack.score) return null;
  const music = await resolve(trip.id, pack.score);
  const s = config.score;
  const cuts = {
    '16x9': await forCut(trip.id, music, '16x9', s.master, s.masterTarget),
    '9x16': await forCut(trip.id, music, '9x16', s.social, s.socialTarget),
  };
  cuts['1x1'] = cuts['9x16'];
  await copyFile(packDir(trip.id, 'video', 'beatmap-9x16.json'), packDir(trip.id, 'video', 'beatmap-1x1.json'));
  console.log(`${trip.id}: score ${music.title}: 16:9 ${cuts['16x9'].beatmap.duration}s (${cuts['16x9'].beatmap.version}), social ${cuts['9x16'].beatmap.duration}s (${cuts['9x16'].beatmap.version})`);
  return { title: music.title, cuts };
}
