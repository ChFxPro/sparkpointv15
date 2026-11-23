"""Beat maps for the Gala trip promos, so each video can be cut to its music.

  python beatmap.py analyze <audio> <out.json>
  python beatmap.py splice  <audio> <target-seconds> <out.wav> <out.json>

analyze: tempo, beats, downbeats (4/4 assumed; the phase is the beat that
carries the most low-end attack), bars, phrase starts (every 4 bars from the
first downbeat), section boundaries, energy per bar (0-1), and the final hit
(the last strong attack before the track rings out).

splice: shortens a long track to about <target> seconds with a real ending:
it keeps the opening up to a bar line A, then jumps to a bar line B late in the
track and plays to the end. A and B are chosen on phrase lines, where the music
either side sounds most alike (beat-synchronous chroma), with a 40 ms
equal-power crossfade, so there's no mid-phrase fade.

Needs librosa (see README: a venv on the render-scratch drive).
"""
import json
import sys

import librosa
import numpy as np
import soundfile as sf

SR = 44100


def load(path):
    y, sr = librosa.load(path, sr=SR, mono=False)
    if y.ndim == 1:
        y = np.stack([y, y])
    return y, sr


def analyze_signal(y, sr):
    mono = librosa.to_mono(y)
    dur = len(mono) / sr
    hop = 512
    onset = librosa.onset.onset_strength(y=mono, sr=sr, hop_length=hop)
    tempo, beat_frames = librosa.beat.beat_track(onset_envelope=onset, sr=sr, hop_length=hop, units='frames', trim=False)
    tempo = float(np.atleast_1d(tempo)[0])
    beats = librosa.frames_to_time(beat_frames, sr=sr, hop_length=hop)
    if len(beats) < 8:
        # Free-time or very sparse music: fall back to an even grid.
        step = 60.0 / (tempo or 90)
        beats = np.arange(0.0, dur, step)
        beat_frames = librosa.time_to_frames(beats, sr=sr, hop_length=hop)

    # Downbeat phase: low-frequency attack summed over beats k, k+4, k+8...
    low = librosa.onset.onset_strength(y=mono, sr=sr, hop_length=hop, fmax=250, n_mels=16)
    bf = np.clip(beat_frames, 0, len(low) - 1)
    scores = [low[bf[k::4]].mean() if len(bf[k::4]) else 0 for k in range(4)]
    phase = int(np.argmax(scores))
    downbeats = beats[phase::4]

    # Energy per bar, scaled 0-1.
    rms = librosa.feature.rms(y=mono, hop_length=hop)[0]
    rt = librosa.frames_to_time(np.arange(len(rms)), sr=sr, hop_length=hop)
    edges = list(downbeats) + [dur]
    energy = []
    for a, b in zip(edges[:-1], edges[1:]):
        m = (rt >= a) & (rt < b)
        energy.append(float(rms[m].mean()) if m.any() else 0.0)
    e = np.array(energy) if energy else np.zeros(1)
    e = (e - e.min()) / (e.max() - e.min() + 1e-9)

    # Sections: agglomerative segmentation on beat-synced chroma + MFCC, snapped to bars.
    sections = []
    try:
        chroma = librosa.feature.chroma_cqt(y=mono, sr=sr, hop_length=hop)
        mfcc = librosa.feature.mfcc(y=mono, sr=sr, hop_length=hop, n_mfcc=13)
        feat = librosa.util.sync(np.vstack([librosa.util.normalize(chroma), librosa.util.normalize(mfcc)]), bf)
        k = max(2, min(10, int(round(dur / 14))))
        bounds = librosa.segment.agglomerative(feat, k)
        bt = beats[np.clip(bounds, 0, len(beats) - 1)]
        for t in bt:
            if len(downbeats):
                sections.append(float(downbeats[np.argmin(np.abs(downbeats - t))]))
        sections = sorted(set(round(s, 3) for s in sections))
    except Exception:
        pass

    # Final hit: last onset peak above 40% of the track's strong attacks, with the tail after it.
    ot = librosa.frames_to_time(np.arange(len(onset)), sr=sr, hop_length=hop)
    strong = np.percentile(onset, 97)
    peaks = librosa.util.peak_pick(onset, pre_max=8, post_max=8, pre_avg=8, post_avg=8, delta=0.1, wait=8)
    peaks = [p for p in peaks if onset[p] >= 0.4 * strong and ot[p] < dur - 0.5]
    final_hit = float(ot[peaks[-1]]) if peaks else float(downbeats[-1] if len(downbeats) else dur - 2)

    bar = float(np.median(np.diff(downbeats))) if len(downbeats) > 1 else 4 * 60.0 / (tempo or 90)
    return {
        'duration': round(dur, 3), 'tempo': round(tempo, 2), 'beat': round(bar / 4, 4), 'bar': round(bar, 4),
        'beats': [round(float(b), 3) for b in beats],
        'downbeats': [round(float(d), 3) for d in downbeats],
        'phrases': [round(float(d), 3) for d in downbeats[::4]],
        'sections': sections,
        'barEnergy': [round(float(x), 3) for x in e],
        'finalHit': round(final_hit, 3),
    }


def write(path, data):
    with open(path, 'w') as f:
        json.dump(data, f, indent=1)


def splice(path, target, out_wav, out_json):
    y, sr = load(path)
    a = analyze_signal(y, sr)
    db = np.array(a['downbeats'])
    dur = a['duration']
    hop = 512
    mono = librosa.to_mono(y)
    chroma = librosa.feature.chroma_cqt(y=mono, sr=sr, hop_length=hop)
    ct = librosa.frames_to_time(np.arange(chroma.shape[1]), sr=sr, hop_length=hop)

    def window(t, before):
        # Mean chroma over one bar before (or after) t.
        bar = a['bar']
        m = (ct >= t - bar) & (ct < t) if before else (ct >= t) & (ct < t + bar)
        v = chroma[:, m].mean(axis=1) if m.any() else np.zeros(12)
        return v / (np.linalg.norm(v) + 1e-9)

    phr = set(a['phrases'])
    best = None
    for i, A in enumerate(db):
        if A < 8:
            continue
        for B in db[db > A + 4]:
            length = A + (dur - B)
            err = abs(length - target)
            if err > 6:
                continue
            sim = float(window(A, True) @ window(B, True)) + float(window(A, False) @ window(B, False))
            score = err * 0.6 - sim * 2 - (0.8 if A in phr else 0) - (0.8 if B in phr else 0)
            if best is None or score < best[0]:
                best = (score, float(A), float(B), length)
    if best is None:
        # Nothing workable: keep the opening and the last bars of the ending.
        A = float(db[db <= target * 0.75][-1]) if (db <= target * 0.75).any() else target * 0.75
        B = dur - (target - A)
        best = (0, A, B, target)
    _, A, B, length = best
    ia, ib = int(A * sr), int(B * sr)
    xf = int(0.04 * sr)
    head, tail = y[:, :ia + xf], y[:, ib:]
    ramp = np.linspace(0, np.pi / 2, xf)
    head[:, -xf:] *= np.cos(ramp)
    tail[:, :xf] *= np.sin(ramp)
    tail[:, :xf] += head[:, -xf:]
    out = np.concatenate([head[:, :-xf], tail], axis=1)
    sf.write(out_wav, out.T, sr, subtype='PCM_24')
    res = analyze_signal(out, sr)
    res['splice'] = {'source': path, 'keep': [0, round(A, 3)], 'jump': [round(B, 3), round(dur, 3)], 'length': round(length, 3)}
    write(out_json, res)


def main():
    cmd = sys.argv[1]
    if cmd == 'analyze':
        y, sr = load(sys.argv[2])
        res = analyze_signal(y, sr)
        res['source'] = sys.argv[2]
        write(sys.argv[3], res)
    elif cmd == 'splice':
        splice(sys.argv[2], float(sys.argv[3]), sys.argv[4], sys.argv[5])
    else:
        raise SystemExit(__doc__)


if __name__ == '__main__':
    main()
