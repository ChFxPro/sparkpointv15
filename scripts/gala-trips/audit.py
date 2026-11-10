"""Jump-cut audit for the trip promos (Jeff's no-jump-cut rules, 2026-11-10).

  python audit.py <trips-dir> <packs.json> <trip> [<trip> ...]  -> JSON on stdout

For every footage-to-footage shot change in each rendered cut (from the saved
edit-<layout>.json and the trip's reel in packs.json) it reports:
  same-source   the two shots come from the same clip, still or Commons file
                (rule 1); "continued" when the second picks up the same move
                within a few seconds of where the first left off (rule 2)
  look-alike    different files but near-identical frames either side of the
                cut: perceptual-hash distance, colour-histogram correlation and
                the dominant motion direction (rule 1)
  short-aerial  an aerial/drone shot held under 3.5 s (rule 3)
  near-reuse    the same source again within 3 shots (rule 4)
Frames are read from the cut's silent master.
"""
import json
import subprocess
import sys

import numpy as np

AERIAL = ('aerial', 'drone', 'top-down', 'from the air', 'flying', 'birds-eye')


def frame(video, t, w=64, h=36, gray=False):
    fmt = 'gray' if gray else 'rgb24'
    out = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{max(0, t):.3f}', '-i', video, '-frames:v', '1',
                          '-vf', f'scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', fmt, '-'], capture_output=True).stdout
    n = w * h * (1 if gray else 3)
    if len(out) < n:
        return None
    a = np.frombuffer(out[:n], np.uint8).astype(np.float32)
    return a.reshape(h, w) if gray else a.reshape(h, w, 3)


def dhash(img):
    g = img.mean(axis=2) if img.ndim == 3 else img
    # 9x8 by block-averaging the 64x36 frame
    ys = np.linspace(0, g.shape[0], 9).astype(int)
    xs = np.linspace(0, g.shape[1], 10).astype(int)
    small = np.array([[g[ys[i]:ys[i + 1], xs[j]:xs[j + 1]].mean() for j in range(9)] for i in range(8)])
    return (small[:, 1:] > small[:, :-1]).flatten()


def hist_corr(a, b):
    ha = np.concatenate([np.histogram(a[..., c], 16, (0, 255))[0] for c in range(3)]).astype(float)
    hb = np.concatenate([np.histogram(b[..., c], 16, (0, 255))[0] for c in range(3)]).astype(float)
    ha -= ha.mean(); hb -= hb.mean()
    return float(ha @ hb / (np.linalg.norm(ha) * np.linalg.norm(hb) + 1e-9))


def motion(video, t):
    """Dominant camera motion around t, by phase correlation of two frames 0.2 s apart."""
    a, b = frame(video, t - 0.1, 160, 90, True), frame(video, t + 0.1, 160, 90, True)
    if a is None or b is None:
        return None
    win = np.outer(np.hanning(a.shape[0]), np.hanning(a.shape[1]))
    fa, fb = np.fft.fft2(a * win), np.fft.fft2(b * win)
    r = fa * np.conj(fb)
    r /= np.abs(r) + 1e-9
    c = np.abs(np.fft.ifft2(r))
    y, x = np.unravel_index(np.argmax(c), c.shape)
    if y > a.shape[0] // 2: y -= a.shape[0]
    if x > a.shape[1] // 2: x -= a.shape[1]
    if abs(x) + abs(y) < 1:
        return 'still'
    return ('left' if x > 0 else 'right') if abs(x) >= abs(y) else ('up' if y > 0 else 'down')


def source_of(r):
    if 'local' in r:
        return ('clip', r['local']['local'], r['local']['at'], r['local']['dur'])
    if 'clip' in r:
        return ('clip', r['clip']['commons'], r['clip']['at'], r['clip']['dur'])
    if 'still' in r:
        return ('still', r['still'], 0, 0)
    if 'commonsStill' in r:
        return ('still', r['commonsStill'], 0, 0)
    return ('?', r.get('shows', '?'), 0, 0)


def is_aerial(r, src):
    text = (src[1] + ' ' + r.get('shows', '')).lower()
    return src[0] == 'clip' and any(k in text for k in AERIAL)


def audit_cut(trips_dir, trip, reel, layout):
    pack = f'{trips_dir}/{trip}/pack/video'
    try:
        edit = json.load(open(f'{pack}/edit-{layout}.json'))
    except FileNotFoundError:
        return None
    name = f'{trip}-promo-16x9-silent.mp4' if layout == '16x9' else f'{trip}-promo-30s-{layout}-silent.mp4'
    video = f'{pack}/{name}'
    by_show = {r.get('shows'): r for r in reel}
    foot = []
    for s in edit['shots']:
        if s.get('source'):  # newer edits record their source directly
            w = s.get('window') or [0, 0]
            kind = 'clip' if s.get('window') else 'still'
            r = by_show.get(s['what'], {'shows': s['what']})
            if s.get('aerial'):
                r = {**r, 'shows': r.get('shows', '') + ' aerial'}
            foot.append((s, r, (kind, s['source'], w[0], w[1])))
            continue
        r = by_show.get(s['what'])
        if r is None:
            foot.append(None)
            continue
        foot.append((s, r, source_of(r)))
    issues = []
    for i, cur in enumerate(foot):
        if cur is None:
            continue
        s, r, src = cur
        length = s['end'] - s['start']
        if is_aerial(r, src) and length < 3.5:
            issues.append({'rule': 3, 'kind': 'short-aerial', 'at': round(s['start'], 2), 'shot': s['what'], 'length': round(length, 2)})
        prev = foot[i - 1] if i > 0 else None
        if prev is not None:
            ps, pr, psrc = prev
            cut_t = s['start'] + (s.get('fadeIn') or 0) / 2
            if psrc[1] == src[1]:
                gap = src[2] - (psrc[2] + psrc[3])
                issues.append({'rule': 2 if src[0] == 'clip' and -1 <= gap <= 4 else 1,
                               'kind': 'same-source' + (' continued' if src[0] == 'clip' and -1 <= gap <= 4 else ''),
                               'at': round(cut_t, 2), 'from': ps['what'], 'to': s['what'], 'source': src[1]})
            else:
                a = frame(video, ps['end'] - 0.15)
                b = frame(video, s['start'] + (s.get('fadeIn') or 0) + 0.15)
                if a is not None and b is not None:
                    ham = int((dhash(a) != dhash(b)).sum())
                    hc = hist_corr(a, b)
                    ma, mb = motion(video, ps['end'] - 0.4), motion(video, s['start'] + (s.get('fadeIn') or 0) + 0.4)
                    same_motion = ma is not None and ma == mb and ma != 'still'
                    # Tuned on the first five trips: dark, low-contrast frames of different scenes reached
                    # hash 4-9 with histogram 0.87-0.92, so both must be close (and the motion too, if looser).
                    if (ham <= 8 and hc >= 0.94) or (ham <= 12 and hc >= 0.97 and same_motion):
                        issues.append({'rule': 1, 'kind': 'look-alike', 'at': round(cut_t, 2), 'from': ps['what'], 'to': s['what'],
                                       'hash': ham, 'hist': round(hc, 3), 'motion': [ma, mb]})
        for k in range(max(0, i - 3), i - 1):
            o = foot[k]
            if o is not None and o[2][1] == src[1]:
                issues.append({'rule': 4, 'kind': 'near-reuse', 'at': round(s['start'], 2), 'shot': s['what'], 'earlier': o[0]['what'], 'shotsApart': i - k})
    sources = {f[2][1] for f in foot if f}
    footage_span = sum(f[0]['end'] - f[0]['start'] for f in foot if f)
    return {'layout': layout, 'duration': edit['duration'], 'footageShots': sum(1 for f in foot if f),
            'distinctSources': len(sources), 'footageSeconds': round(footage_span, 1), 'issues': issues}


def main():
    trips_dir, packs = sys.argv[1], json.load(open(sys.argv[2]))
    out = {}
    for trip in sys.argv[3:]:
        reel = packs['trips'][trip].get('reel', [])
        out[trip] = [c for c in (audit_cut(trips_dir, trip, reel, l) for l in ('16x9', '9x16', '1x1')) if c]
    json.dump(out, sys.stdout, indent=1)


if __name__ == '__main__':
    main()
