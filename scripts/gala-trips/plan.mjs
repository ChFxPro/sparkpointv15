// Cuts a promo to its music. Given a beat map (beatmap.py) and the trip's
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

function maxDur(s) {
  return s.frames ? s.frames.count / s.frames.fps - 0.1 : STILL_MAX;
}

// Lays footage shots into [t0, t1] with boundaries on the cut grid. Lengths
// follow the music (shorter where it's busy) within each shot's limits: a
// caption needs CAP_MIN, a clip can't run past its footage.
function layFootage(bm, shots, t0, t1) {
  const grid = cutGrid(bm).filter((g) => g >= t0 - 1e-3 && g <= t1 + 1e-3);
  const span = t1 - t0;
  const target = (t) => 5.2 - 2.6 * energyAt(bm, t);
  const lo = (s) => (s.caption ? CAP_MIN : 1.8);
  const hi = (s) => Math.max(lo(s), maxDur(s));
  // How many shots: as many as the music's pace asks for, captioned first, in reel order.
  const pace = (target(t0) + target((t0 + t1) / 2) + target(t1)) / 3;
  let n = Math.max(1, Math.min(shots.length, Math.round(span / pace)));
  const ranked = shots.map((s, i) => ({ s, i, keep: s.caption ? 2 : s.social ? 1 : s.extra ? -1 : 0 }));
  let chosen = ranked.sort((a, b) => b.keep - a.keep || a.i - b.i).slice(0, n).sort((a, b) => a.i - b.i).map((x) => x.s);
  const fits = () => chosen.reduce((a, s) => a + hi(s), 0) >= span && chosen.reduce((a, s) => a + lo(s), 0) <= span;
  while (!fits() && chosen.reduce((a, s) => a + hi(s), 0) < span && chosen.length < shots.length) {
    chosen = shots.filter((s) => chosen.includes(s) || s === shots.find((x) => !chosen.includes(x)));
  }
  while (chosen.length > 1 && chosen.reduce((a, s) => a + lo(s), 0) > span) {
    const drop = [...chosen].reverse().find((s) => !s.caption) ?? chosen.at(-1);
    chosen = chosen.filter((s) => s !== drop);
  }
  // Ideal lengths from the energy where each shot falls, scaled to the span, clamped.
  let d = chosen.map(() => span / chosen.length);
  for (let pass = 0; pass < 6; pass++) {
    let t = t0;
    const ideal = chosen.map((s, i) => { const v = target(t + d[i] / 2); t += d[i]; return v; });
    const k = span / ideal.reduce((a, b) => a + b, 0);
    d = ideal.map((v, i) => Math.min(hi(chosen[i]), Math.max(lo(chosen[i]), v * k)));
    // Hand any shortfall or excess to the shots that still have room.
    for (let r = 0; r < 4; r++) {
      const diff = span - d.reduce((a, b) => a + b, 0);
      if (Math.abs(diff) < 0.05) break;
      const room = chosen.map((s, i) => (diff > 0 ? hi(s) - d[i] : d[i] - lo(s)));
      const total = room.reduce((a, b) => a + Math.max(0, b), 0);
      if (total <= 0) break;
      d = d.map((v, i) => v + Math.sign(diff) * Math.max(0, room[i]) * Math.min(1, Math.abs(diff) / total));
    }
  }
  // Snap each boundary to the grid, keeping every shot within its limits.
  const bounds = [t0];
  let acc = t0;
  for (let i = 0; i < chosen.length - 1; i++) {
    acc += d[i];
    const prev = bounds.at(-1);
    const rest = chosen.slice(i + 1).reduce((x, c) => x + Math.min(lo(c), 2.4), 0);
    const ok = grid.filter((g) => g >= prev + lo(chosen[i]) - 0.05 && g <= prev + hi(chosen[i]) + 0.05 && g <= t1 - rest + 0.05);
    const loose = grid.filter((g) => g >= prev + 1.5 && g <= t1 - 1.5);
    bounds.push(ok.length ? near(ok, acc) : loose.length ? near(loose, acc) : acc);
    acc = bounds.at(-1);
  }
  bounds.push(t1);
  return chosen.map((s, i) => {
    const start = bounds[i], end = bounds[i + 1];
    const x = i === 0 ? 0 : energyAt(bm, start) < 0.5 ? 0.5 : 0;
    const shot = { ...s, start: start - x / 2, end, fadeIn: x, fadeOut: 0 };
    if (shot.caption && end - start < CAP_MIN) delete shot.caption;
    return shot;
  }).map((s, i, all) => (all[i + 1]?.fadeIn ? { ...s, end: s.end + all[i + 1].fadeIn / 2 } : s));
}

export function plan(kind, bm, footage, cards) {
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
  shots.push(...layFootage(bm, footage, footStart, factsAt));
  const beatsAfter = (t0) => bm.beats.filter((b) => b > t0 + 0.6).map((b) => +(b - t0).toFixed(3));
  const fb = beatsAfter(factsAt);
  const nh = cards.facts.highlights ?? 3;
  shots.push({ ...cards.facts, start: factsAt - 0.25, end: closeAt, fadeIn: 0.5, fadeOut: 0,
    cues: [0.3, ...Array.from({ length: nh + 1 }, (_, i) => fb[Math.min(fb.length - 1, i * 2)] ?? 1 + i)] });
  const cb = beatsAfter(closeAt).map((b) => b - 0.6);
  // Lockup (step 0) lands on the final hit; the lines step in on the beats before it.
  const lockAt = end.hit ? Math.max(0.2, end.hit - closeAt - 0.55) : 0;
  shots.push({ ...cards.close, start: closeAt, end: D, fadeIn: 0, fadeOut: 0.8, finalHit: end.hit,
    cues: end.hit ? [lockAt, 0.1, 0.1 + 2 * bm.beat, 0.1 + 4 * bm.beat] : [0, 0.1 + 2 * bm.beat, 0.1 + 4 * bm.beat, 0.1 + 6 * bm.beat] });
  const changes = shots.slice(1).map((s) => +(s.start + (s.fadeIn ?? 0) / 2).toFixed(3));
  return { shots, duration: D, hit, closeAt, finalHit: end.hit, factsAt, map: mapPlan, changes };
}
