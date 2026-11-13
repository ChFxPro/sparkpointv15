// Two of the Gala page's chapter marks, drawn by the same engine as the
// passport maker's trip stamps (stamps.ts). The visa is an ink stamp (one ink,
// a heavy outer frame and a hairline inner one, Josefin capitals, a machine-type
// date, seeded rubber wear), exported as a single-colour image and inked with a
// CSS mask. The postage stamp is paper plus engraving, exported in full colour.
// Both are written to public/assets/events/gala/stamps/ by `npm run gala:stamps`.
//
// Jeff's picks (2026-11-12): the visa, landscape, for "How it works", and the
// postmarked postage stamp for "The return trip". (Departures is the hero
// board's split-flap, not a stamp.)
import { F, MONO, arcText, frameRect, spark, star5, text, type Ctx, type StampArt } from './stamps';

function circle(x: Ctx, cx: number, cy: number, r: number, lw: number, dash?: number[]) {
  x.lineWidth = lw;
  if (dash) x.setLineDash(dash);
  x.beginPath();
  x.arc(cx, cy, r, 0, Math.PI * 2);
  x.stroke();
  x.setLineDash([]);
}

export const CHAPTER_STAMPS: Record<string, StampArt> = {
  // How it works B, landscape (Jeff's pick, 2026-11-12): the visa with its ring
  // of eight stars, one per trip, around the sparkmark.
  'entry-visa': {
    w: 226, h: 122, ink: '#a3245f', seed: 159,
    draw(x) {
      frameRect(x, 3, 3, 220, 116, 12, 3.2);
      frameRect(x, 9, 9, 208, 104, 8, 1);
      circle(x, 56, 61, 34, 1.6);
      circle(x, 56, 61, 40, 0.8, [1.2, 2.6]);
      for (let i = 0; i < 8; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 4;
        star5(x, 56 + 25 * Math.cos(a), 61 + 25 * Math.sin(a), 3.8);
      }
      spark(x, 56, 61, 12);
      text(x, 'VISA · ENTRY', 156, 35, F(700, 8.4), 'center', 2.3);
      text(x, 'HOW IT WORKS', 156, 60, F(700, 11.6), 'center', 0.9);
      text(x, 'EIGHT TRIPS · SET PRICE', 156, 76, F(600, 6.8), 'center', 1.15);
      x.lineWidth = 1;
      x.beginPath();
      x.moveTo(112, 84);
      x.lineTo(200, 84);
      x.stroke();
      text(x, '11 DEC 2026', 156, 104, MONO(700, 13), 'center', 0.4);
    },
  },
};

// The return trip, as a postage stamp (Jeff, 2026-11-12: "more like a postal
// stamp, but elevated"). Unlike the ink stamps these are paper and engraving:
// a perforated sheet, and a one-ink, fine-line engraving of a Deco sunburst
// rising over the Blue Ridge with the Resilience Hub at home, under a reversed
// THE RETURN TRIP banner. Drawn at `k` pixels per unit.
export interface PostalArt {
  w: number;
  h: number;
  paper: string;
  ink: string;
  /** An ink postmark tying the stamp to the page, or none. */
  cancel?: string;
  seed: number;
}

const POSTAL_W = 228;
const POSTAL_H = 156;

export const POSTAL_STAMPS: Record<string, PostalArt> = {
  // Ivory paper, midnight engraving, struck with a plum Brevard postmark.
  'return-postage': { w: POSTAL_W, h: POSTAL_H, paper: '#fbf6ea', ink: '#14213a', cancel: '#7a1f4d', seed: 191 },
  // The same stamp unused, for the return-trip postcard, which strikes its own postmark.
  'return-postage-mint': { w: POSTAL_W, h: POSTAL_H, paper: '#fbf6ea', ink: '#14213a', seed: 191 },
};

function rand(seed: number) {
  let v = seed >>> 0;
  return () => (v = (v * 1664525 + 1013904223) >>> 0) / 4294967296;
}

function engraving(x: Ctx, W: number, H: number) {
  const L = 22;
  const R = W - 22;
  const T = 36;
  const B = H - 40;
  // Frame: a heavy rule and a hairline, with stepped Deco corners.
  x.lineWidth = 2.2;
  x.strokeRect(13, 13, W - 26, H - 26);
  x.lineWidth = 0.7;
  x.strokeRect(17, 17, W - 34, H - 34);
  [[17, 17], [W - 17, 17], [17, H - 17], [W - 17, H - 17]].forEach(([cx, cy]) => {
    x.fillRect(cx - 3, cy - 3, 6, 6);
  });
  text(x, 'TRANSYLVANIA COUNTY · NORTH CAROLINA', W / 2, 30, F(700, 6.2), 'center', 1.15);

  // The picture.
  x.save();
  x.beginPath();
  x.rect(L, T, R - L, B - T);
  x.clip();
  const sunX = L + (R - L) * 0.62;
  const horizon = B - 18;
  const sunY = horizon - 24;
  // Sky: engraved horizontal lines, finer toward the sun.
  for (let y = T + 1; y < horizon; y += 2.1) {
    x.lineWidth = 0.28 + ((y - T) / (horizon - T)) * 0.32;
    x.beginPath();
    x.moveTo(L, y);
    x.lineTo(R, y);
    x.stroke();
  }
  // Sunburst: 25 rays, as in the lockup, cut out of the sky lines and drawn.
  x.save();
  x.globalCompositeOperation = 'destination-out';
  x.beginPath();
  x.arc(sunX, sunY, 19, 0, Math.PI * 2);
  x.fill();
  x.restore();
  x.lineWidth = 0.9;
  for (let i = 0; i <= 24; i++) {
    const a = Math.PI + (i * Math.PI) / 24;
    x.beginPath();
    x.moveTo(sunX + Math.cos(a) * 23, sunY + Math.sin(a) * 23);
    x.lineTo(sunX + Math.cos(a) * 140, sunY + Math.sin(a) * 140);
    x.stroke();
  }
  x.lineWidth = 1.2;
  x.beginPath();
  x.arc(sunX, sunY, 19, Math.PI, 0);
  x.stroke();
  x.lineWidth = 0.5;
  for (let r = 15; r > 2; r -= 3) {
    x.beginPath();
    x.arc(sunX, sunY, r, Math.PI, 0);
    x.stroke();
  }
  // Far ridge: hatched.
  const far = [[L, horizon - 6], [L + 30, horizon - 26], [L + 52, horizon - 16], [L + 84, horizon - 34], [L + 108, horizon - 20], [L + 140, horizon - 30], [R, horizon - 12], [R, B], [L, B]];
  x.save();
  x.beginPath();
  far.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b)));
  x.closePath();
  x.save();
  x.globalCompositeOperation = 'destination-out';
  x.fill();
  x.restore();
  x.clip();
  x.lineWidth = 0.55;
  for (let d = -80; d < W; d += 2.4) {
    x.beginPath();
    x.moveTo(L + d, B);
    x.lineTo(L + d + 60, B - 60);
    x.stroke();
  }
  x.restore();
  x.lineWidth = 0.9;
  x.beginPath();
  far.slice(0, 7).forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b)));
  x.stroke();
  // Near ridge: solid, with the Hub cut out of it in paper, its windows lit.
  const near = [[L, horizon + 2], [L + 40, horizon - 12], [L + 70, horizon - 4], [L + 98, horizon - 14], [L + 132, horizon - 2], [R, horizon - 8], [R, B], [L, B]];
  x.beginPath();
  near.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b)));
  x.closePath();
  x.fill();
  const hx = L + 52;
  const hb = B - 4;
  x.save();
  x.globalCompositeOperation = 'destination-out';
  x.beginPath();
  x.moveTo(hx - 16, hb - 13);
  x.lineTo(hx, hb - 25);
  x.lineTo(hx + 16, hb - 13);
  x.lineTo(hx + 13, hb - 13);
  x.lineTo(hx + 13, hb);
  x.lineTo(hx - 13, hb);
  x.lineTo(hx - 13, hb - 13);
  x.closePath();
  x.fill();
  x.restore();
  [[hx - 8, hb - 10], [hx + 4, hb - 10]].forEach(([wx, wy]) => x.fillRect(wx, wy, 4, 4));
  x.fillRect(hx - 2, hb - 7, 4, 7);
  x.save();
  x.globalCompositeOperation = 'destination-out';
  spark(x, hx, hb - 33, 6);
  x.restore();
  x.restore();
  x.lineWidth = 0.8;
  x.strokeRect(L, T, R - L, B - T);

  // The date plate, top left of the picture, and the banner beneath it.
  x.fillRect(L, T, 58, 14);
  x.save();
  x.globalCompositeOperation = 'destination-out';
  text(x, '11·XII·26', L + 29, T + 10, MONO(700, 7.2), 'center', 0.2);
  x.restore();
  x.fillRect(L, B + 4, R - L, 15);
  x.save();
  x.globalCompositeOperation = 'destination-out';
  text(x, 'THE RETURN TRIP', W / 2, B + 15, F(700, 9.6), 'center', 3.4);
  x.restore();
}

/** A postage stamp on its own canvas: perforated paper, engraving, an optional cancel. */
export function postalCanvas(art: PostalArt, k = 3): HTMLCanvasElement {
  const { w: W, h: H } = art;
  const make = () => {
    const c = document.createElement('canvas');
    c.width = Math.ceil(W * k);
    c.height = Math.ceil(H * k);
    const x = c.getContext('2d')!;
    x.scale(k, k);
    x.lineJoin = 'round';
    return [c, x] as const;
  };
  // Ink, worn lightly (engraving holds its line better than rubber).
  const [inkC, ink] = make();
  ink.fillStyle = ink.strokeStyle = art.ink;
  engraving(ink, W, H);
  const r = rand(art.seed);
  ink.save();
  ink.globalCompositeOperation = 'destination-out';
  for (let i = 0; i < (W * H) / 90; i++) {
    ink.globalAlpha = 0.25 + r() * 0.5;
    ink.beginPath();
    ink.arc(r() * W, r() * H, 0.2 + r() * r() * 0.9, 0, Math.PI * 2);
    ink.fill();
  }
  ink.restore();

  // Paper with perforated edges.
  const [c, x] = make();
  x.fillStyle = art.paper;
  x.fillRect(0, 0, W, H);
  x.save();
  x.globalCompositeOperation = 'destination-out';
  const hole = 3.1;
  const step = 9;
  for (let px = step / 2; px < W; px += step) {
    [0, H].forEach((py) => {
      x.beginPath();
      x.arc(px, py, hole, 0, Math.PI * 2);
      x.fill();
    });
  }
  for (let py = step / 2; py < H; py += step) {
    [0, W].forEach((px) => {
      x.beginPath();
      x.arc(px, py, hole, 0, Math.PI * 2);
      x.fill();
    });
  }
  x.restore();
  x.save();
  x.setTransform(1, 0, 0, 1, 0, 0);
  x.drawImage(inkC, 0, 0);
  x.restore();

  // A cancel: a postmark ring and waves, struck across the right edge.
  if (art.cancel) {
    const [cc, cx] = make();
    cx.fillStyle = cx.strokeStyle = art.cancel;
    const ox = W - 42;
    const oy = 46;
    cx.lineWidth = 2;
    cx.beginPath();
    cx.arc(ox, oy, 30, 0, Math.PI * 2);
    cx.stroke();
    cx.lineWidth = 0.9;
    cx.beginPath();
    cx.arc(ox, oy, 20, 0, Math.PI * 2);
    cx.stroke();
    arcText(cx, 'BREVARD NC', ox, oy, 24, F(700, 6.6), 1.3, 'top');
    arcText(cx, 'HOME', ox, oy, 27.5, F(700, 6.6), 2.6, 'bottom');
    text(cx, 'DEC 11', ox, oy + 1, MONO(700, 7.4), 'center', 0.2);
    text(cx, '2026', ox, oy + 9, MONO(700, 6.4), 'center', 0.4);
    cx.lineWidth = 1.5;
    for (let kk = 0; kk < 4; kk++) {
      const y0 = oy - 16 + kk * 11;
      cx.beginPath();
      for (let px = ox - 112; px <= ox - 34; px += 2) cx.lineTo(px, y0 + Math.sin((px - ox) / 7) * 2.6);
      cx.stroke();
    }
    const r2 = rand(art.seed + 3);
    cx.save();
    cx.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 260; i++) {
      cx.globalAlpha = 0.4 + r2() * 0.6;
      cx.beginPath();
      cx.arc(ox - 120 + r2() * 160, oy - 34 + r2() * 70, 0.3 + r2() * r2() * 1.4, 0, Math.PI * 2);
      cx.fill();
    }
    cx.restore();
    x.save();
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.globalAlpha = 0.82;
    x.drawImage(cc, 0, 0);
    x.restore();
  }
  return c;
}
