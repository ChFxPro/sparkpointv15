"""Cut the Collaboration Lab mark out of PHF's promo (promo 3, bottom lockup) into
src/assets/collab-lab/. Usage: python3 scripts/collab-lab-extract-mark.py <promo.webp> <out dir>,
then convert the PNGs to lossless WebP. Swap in PHF's own vector files if they send them.

Wordmark: each pixel is projected onto the nearest of the three brand inks
(teal, gold, grey) along the line from white, which gives its coverage (alpha);
the pixel is then drawn in that flat ink. The faint grey wave pattern behind the
type falls under a small threshold and drops out.
Icon: the white badge circle is cut out with an anti-aliased circular mask.
"""
import sys
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
im = np.asarray(Image.open(src).convert('RGB')).astype(float)

INKS = {
    'teal': (9, 124, 142),
    'gold': (214, 160, 37),
    'grey': (59, 59, 59),
}
REVERSED = {'teal': (255, 255, 255), 'gold': (214, 160, 37), 'grey': (255, 255, 255)}


def wordmark(region):
    d = 255.0 - region  # deviation from white
    best_alpha = np.zeros(region.shape[:2])
    best_resid = np.full(region.shape[:2], np.inf)
    best_ink = np.zeros(region.shape[:2], dtype=int)
    names = list(INKS)
    for k, name in enumerate(names):
        v = 255.0 - np.array(INKS[name])
        a = (d @ v) / (v @ v)
        a_c = np.clip(a, 0, 1)
        resid = np.linalg.norm(d - a_c[..., None] * v, axis=2)
        better = resid < best_resid
        best_resid[better], best_alpha[better], best_ink[better] = resid[better], a_c[better], k
    # Drop the background waves (deviation up to ~9/255) and re-stretch.
    lo = 0.07
    alpha = np.clip((best_alpha - lo) / (1 - lo), 0, 1)
    alpha[alpha > 0.97] = 1
    def render(palette):
        rgb = np.zeros(region.shape)
        for k, name in enumerate(names):
            rgb[best_ink == k] = palette[name]
        return np.dstack([rgb, alpha * 255]).round().astype(np.uint8)
    return render(INKS), render(REVERSED), alpha


# Wordmark bounds measured from the promo: x 76–1001, y 1060–1171 (+ a few px margin).
x0, y0, x1, y1 = 70, 1054, 1008, 1178
light, dark, alpha = wordmark(im[y0:y1, x0:x1])
# Trim to the ink.
ys, xs = np.where(alpha > 0.02)
crop = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
for name, arr in (('wordmark', light), ('wordmark-reversed', dark)):
    Image.fromarray(arr, 'RGBA').crop(crop).save(f'{out}/collab-lab-{name}.png')

# Icon badge: circle centre (528.4, 931.4), radius 105.3.
cx, cy, r = 528.4, 931.4, 105.3
pad = 2
X0, Y0 = int(cx - r - pad), int(cy - r - pad)
size = int(2 * (r + pad)) + 1
patch = im[Y0:Y0 + size, X0:X0 + size]
yy, xx = np.mgrid[0:size, 0:size]
dist = np.hypot(xx + X0 + 0.5 - cx, yy + Y0 + 0.5 - cy)
mask = np.clip(r - 0.6 - dist + 0.5, 0, 1)  # ~1 px soft edge, just inside the teal ring
badge = np.dstack([patch, mask * 255]).round().astype(np.uint8)
Image.fromarray(badge, 'RGBA').save(f'{out}/collab-lab-icon.png')
print('wordmark', Image.open(f'{out}/collab-lab-wordmark.png').size, 'icon', badge.shape[:2])
