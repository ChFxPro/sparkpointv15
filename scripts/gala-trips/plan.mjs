// Cuts a promo to its music, without jump cuts. Given a beat map (beatmap.py) and the trip's
// shots, returns the timeline: every shot change on a bar line (or on a beat,
// when bars are long and the music is busy), the title on the first strong
// downbeat, the map's last stop on a downbeat, shorter shots where the music
// lifts and longer holds where it breathes, and the end card on the final hit.
// Pure functions, so a plan can be checked without rendering.

const CAP_MIN = 3.4;   // captions need this long to be read
const STILL_MAX = 7;   // longest hold on a still

const near = (grid, t) => grid.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a), grid[0]);
const after = (grid, t) => grid.find((g) => g >= t - 0.05) ?? grid.at(-1);
const before = (grid, t) => [...grid].reverse().find((g) => g <= t + 0.05) ?? grid[0];

function energyAt(bm, t) {
  const i = Math.max(0, bm.downbeats.findIndex((d, k) => t >= d && t < (bm.downbeats[k + 1] ?? Infinity)));
  return bm.barEnergy[i] ?? 0.5;
}

// Where shots may change: bar lines, plus beats when bars are long.
function cutGrid(bm) {
  if (bm.bar <= 2.8) return bm.downbeats;
  return [...new Set([...bm.downbeats, ...bm.beats.filter((_, i) => i % 2 === 0)])].sort((a, b) => a - b);
}

function hitTime(bm, kind) {
  const min = 1.2, max = kind === 'full' ? 8 : 4;
  const strong = bm.downbeats.find((d, i) => d >= min && d <= max && (bm.barEnergy[i] ?? 0) >= 0.45);
  return strong ?? after(bm.downbeats, min);
}

// The close card comes in on a downbeat 5-7 s before the end; its lockup
// lands on the track's final hit (or on that downbeat when there's no clear hit).
function endCard(bm, D) {
  const F = bm.finalHit && bm.finalHit > D - 9 && bm.finalHit < D - 0.8 ? bm.finalHit : null;
  const start = before(bm.downbeats, Math.min(D - 5, (F ?? D) - 2.2));
  return { start, hit: F };
}

// Map timing (local seconds) for a map shot of length L: camera phases scaled
// to the first stop, stops on beats, the last on the downbeat `hold` bars
// before the end.
export function mapTiming(bm, L, nStops) {
  const holdBars = Math.max(1, Math.ceil(1.5 / bm.bar));
  const last = L - holdBars * bm.bar;
  let k = Math.max(1, Math.round(0.9 / bm.beat));
  while (k > 1 && last - (nStops - 1) * k * bm.beat < 5) k--;
  const stopTimes = Array.from({ length: nStops }, (_, i) => +(last - (nStops - 1 - i) * k * bm.beat).toFixed(3));
  const g = Math.min(1.6, Math.max(0.6, (stopTimes[0] - 0.2) / 6.6));
  return { arcIn: 1.0 * g, arcOut: 4.6 * g, zoomOut: 1.2 * g, zoomWide: 4.4 * g, zoomRegion: 6.6 * g, stopTimes, end: L };
}

// Jeff's no-jump-cut rules (2026-11-10): every source at most once per cut,
// a camera move plays as one shot, slow aerials hold at least AERIAL_MIN (and
// cut on bar lines), stills with a slow push fill any gap, and a shortfall is
// reported rather than covered with repeats.
const AERIAL_MIN = 3.5;
const STILL_STRETCH = 11; // a still may hold this long when footage runs short

export const sourceKey = (s) => s.local?.local ?? s.clip?.commons ?? s.still ?? s.commonsStill ?? s.shows;
export const isAerial = (s) => s.aerial ?? (Boolean(s.local || s.clip) && /aerial|drone|top-down|from the air|from directly above|flying|birds?-eye/i
  .test(`${s.local?.local ?? s.clip?.commons ?? ''} ${s.shows ?? ''}`));

function maxDur(s, stretch = false) {
  return s.frames ? s.frames.count / s.frames.fps - 0.1 : stretch ? STILL_STRETCH : STILL_MAX;
}

// Lays footage into [t0, t1]. Shots keep reel order. Boundaries sit on the cut
// grid (bar lines only next to an aerial). Lengths follow the music within
// each shot's limits. `fills` are stills used only when the footage can't
// cover the span. Returns { shots, report }.
function layFootage(bm, shots, t0, t1, fills = []) {
  const span = t1 - t0;
  const aerialMin = Math.max(AERIAL_MIN, bm.bar < 2 ? 2 * bm.bar : bm.bar);
  const report = { span: +span.toFixed(2), dropped: [], fills: [], shortfall: 0 };
  const lo = (s) => (isAerial(s) ? aerialMin : s.caption ? CAP_MIN : s.frames ? 2.0 : 3.0);
  let stretch = false;
  const hi = (s) => Math.max(lo(s), maxDur(s, stretch));
  const target = (s, t) => (isAerial(s) ? 4.2 + 1.3 * (1 - energyAt(bm, t)) : 5.2 - 2.6 * energyAt(bm, t));
  // Rule 1/4: one window per source in this cut.
  const seen = new Set();
  const pool = [];
  for (const s of shots) {
    const k = sourceKey(s);
    if (seen.has(k)) { report.dropped.push(`${s.shows} (same source as an earlier shot)`); continue; }
    seen.add(k); pool.push(s);
  }
  for (const f of fills) seen.has(sourceKey(f)) || pool.push({ ...f, fill: true });
  // Pace: how many shots the music asks for; captioned and social shots first, fills last.
  const footage = pool.filter((s) => !s.fill);
  const pace = footage.length ? footage.reduce((a, s) => a + target(s, (t0 + t1) / 2), 0) / footage.length : 5;
  let n = Math.max(1, Math.min(footage.length, Math.round(span / pace)));
  const rank = (s) => (s.fill ? -2 : s.caption ? 2 : s.social ? 1 : 0);
  const order = (list) => list.sort((a, b) => pool.indexOf(a) - pool.indexOf(b));
  let chosen = order([...footage].sort((a, b) => rank(b) - rank(a) || pool.indexOf(a) - pool.indexOf(b)).slice(0, n));
  const sumHi = () => chosen.reduce((a, s) => a + hi(s), 0);
  const sumLo = () => chosen.reduce((a, s) => a + lo(s), 0);
  // Not enough footage time: add the remaining footage, then fill stills, then stretch stills.
  for (const s of footage) if (sumHi() < span && !chosen.includes(s)) chosen = order([...chosen, s]);
  for (const s of pool.filter((x) => x.fill)) if (sumHi() < span) { chosen = order([...chosen, s]); report.fills.push(s.shows); }
  if (sumHi() < span) stretch = true;
  if (sumHi() < span) report.shortfall = +(span - sumHi()).toFixed(2);
  // Too many to fit their minimum holds: drop the lowest-ranked, latest first.
  while (chosen.length > 1 && sumLo() > span) {
    const drop = [...chosen].reverse().sort((a, b) => rank(a) - rank(b))[0];
    chosen = chosen.filter((s) => s !== drop);
    report.dropped.push(`${drop.shows} (no room)`);
  }
  // Spread fills so no two stills sit together, when possible.
  chosen = spreadStills(chosen);
  // Ideal lengths from the music, scaled to the span, within limits.
  let d = chosen.map(() => span / chosen.length);
  for (let pass = 0; pass < 6; pass++) {
    let t = t0;
    const ideal = chosen.map((s, i) => { const v = target(s, t + d[i] / 2); t += d[i]; return v; });
    const k = span / ideal.reduce((a, b) => a + b, 0);
    d = ideal.map((v, i) => Math.min(hi(chosen[i]), Math.max(lo(chosen[i]), v * k)));
    for (let r = 0; r < 4; r++) {
      const diff = span - d.reduce((a, b) => a + b, 0);
      if (Math.abs(diff) < 0.05) break;
      const room = chosen.map((s, i) => (diff > 0 ? hi(s) - d[i] : d[i] - lo(s)));
      const total = room.reduce((a, b) => a + Math.max(0, b), 0);
      if (total <= 0) break;
      d = d.map((v, i) => v + Math.sign(diff) * Math.max(0, room[i]) * Math.min(1, Math.abs(diff) / total));
    }
  }
  // Boundaries: bar lines next to an aerial, the full cut grid otherwise.
  const full = cutGrid(bm).filter((g) => g >= t0 - 1e-3 && g <= t1 + 1e-3);
  const bars = bm.downbeats.filter((g) => g >= t0 - 1e-3 && g <= t1 + 1e-3);
  const bounds = [t0];
  let acc = t0;
  for (let i = 0; i < chosen.length - 1; i++) {
    acc += d[i];
    const prev = bounds.at(-1);
    const grid = isAerial(chosen[i]) || isAerial(chosen[i + 1]) ? bars : full;
    const rest = chosen.slice(i + 1).reduce((x, c) => x + lo(c), 0);
    const ok = grid.filter((g) => g >= prev + lo(chosen[i]) - 0.05 && g <= prev + hi(chosen[i]) + 0.05 && g <= t1 - rest + 0.05);
    const loose = grid.filter((g) => g >= prev + Math.min(lo(chosen[i]), 3) && g <= t1 - Math.min(rest, 3));
    bounds.push(ok.length ? near(ok, acc) : loose.length ? near(loose, acc) : acc);
    acc = bounds.at(-1);
  }
  bounds.push(t1);
  const out = chosen.map((s, i) => {
    const start = bounds[i], end = bounds[i + 1];
    // Dissolve where the music is calm, or between two aerials; a hard cut otherwise.
    const x = i === 0 ? 0 : energyAt(bm, start) < 0.5 || (isAerial(s) && isAerial(chosen[i - 1])) ? 0.5 : 0;
    const shot = { ...s, start: start - x / 2, end, fadeIn: x, fadeOut: 0 };
    if (shot.caption && end - start < CAP_MIN) delete shot.caption;
    return shot;
  }).map((s, i, all) => (all[i + 1]?.fadeIn ? { ...s, end: s.end + all[i + 1].fadeIn / 2 } : s));
  report.shots = out.length;
  report.short = out.filter((s) => isAerial(s) && s.end - s.start < AERIAL_MIN - 0.05).map((s) => s.shows);
  return { shots: out, report };
}

function spreadStills(list) {
  const stills = list.filter((s) => s.fill), clips = list.filter((s) => !s.fill);
  if (!stills.length || clips.length < 2) return list;
  const out = [...clips];
  stills.forEach((st, k) => out.splice(Math.min(out.length, Math.round(((k + 1) * (clips.length + k)) / (stills.length + 1))), 0, st));
  return out;
}

// The end card: in on a downbeat, lines on the beats, lockup on the final hit.
export function closeShot(bm) {
  const D = bm.duration;
  const end = endCard(bm, D);
  const closeAt = end.start;
  const lockAt = end.hit ? Math.max(0.2, end.hit - closeAt - 0.55) : 0;
  return { start: closeAt, end: D, fadeIn: 0, fadeOut: 0.8, finalHit: end.hit,
    cues: end.hit ? [lockAt, 0.1, 0.1 + 2 * bm.beat, 0.1 + 4 * bm.beat] : [0, 0.1 + 2 * bm.beat, 0.1 + 4 * bm.beat, 0.1 + 6 * bm.beat] };
}

export function plan(kind, bm, footage, cards, fills = []) {
  const D = bm.duration;
  const hit = hitTime(bm, kind);
  const end = endCard(bm, D);
  const closeAt = end.start;
  const factsLen = kind === 'full' ? 8.5 : 6.2;
  const factsAt = near(bm.downbeats.filter((d) => d < closeAt - 4), closeAt - factsLen);
  const openEnd = after(bm.downbeats, hit + (kind === 'full' ? Math.max(3, 2 * bm.bar) : Math.max(2, bm.bar)));
  const shots = [];
  shots.push({ ...cards.open, start: 0, end: openEnd, fadeIn: 0, fadeOut: 0, hit,
    cues: [Math.max(0.15, hit - 1.7), Math.max(0.35, hit - 1.0), hit + 0.25] });
  let footStart = openEnd, mapPlan = null;
  if (kind === 'full') {
    const phraseEnds = bm.phrases.filter((p) => p >= openEnd + 9 && p <= openEnd + 15);
    const mapEnd = phraseEnds.length ? near(phraseEnds, openEnd + 12) : near(bm.downbeats.filter((d) => d >= openEnd + 9), openEnd + 12);
    mapPlan = { start: openEnd, end: mapEnd };
    shots.push({ ...cards.map, start: openEnd - 0.25, end: mapEnd, fadeIn: 0.5, fadeOut: 0 });
    footStart = mapEnd;
  }
  // Never squeeze an aerial: if snapping left one under AERIAL_MIN, drop the
  // shortest uncaptioned shot and lay the footage out again.
  let pool = footage, laid = layFootage(bm, pool, footStart, factsAt, fills);
  for (let tries = 0; laid.report.short.length && tries < 4; tries++) {
    const foot = laid.shots.filter((x) => !x.fill);
    const victim = [...foot].filter((x) => !x.caption).sort((x, y) => (x.end - x.start) - (y.end - y.start))[0];
    if (!victim || foot.length < 2) break;
    pool = pool.filter((x) => x.shows !== victim.shows);
    const again = layFootage(bm, pool, footStart, factsAt, fills);
    again.report.dropped.push(...laid.report.dropped, `${victim.shows} (too little room for a full aerial hold)`);
    laid = again;
  }
  shots.push(...laid.shots);
  const beatsAfter = (t0) => bm.beats.filter((b) => b > t0 + 0.6).map((b) => +(b - t0).toFixed(3));
  const fb = beatsAfter(factsAt);
  const nh = cards.facts.highlights ?? 3;
  shots.push({ ...cards.facts, start: factsAt - 0.25, end: closeAt, fadeIn: 0.5, fadeOut: 0,
    cues: [0.3, ...Array.from({ length: nh + 1 }, (_, i) => fb[Math.min(fb.length - 1, i * 2)] ?? 1 + i)] });
  const cb = beatsAfter(closeAt).map((b) => b - 0.6);
  shots.push({ ...cards.close, ...closeShot(bm) });
  const changes = shots.slice(1).map((s) => +(s.start + (s.fadeIn ?? 0) / 2).toFixed(3));
  return { shots, duration: D, hit, closeAt, finalHit: end.hit, factsAt, map: mapPlan, changes, report: laid.report };
}
