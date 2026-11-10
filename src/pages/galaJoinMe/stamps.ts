// Passport stamps for the Gala "Join me" post maker. Each trip's stamp is drawn after
// that country's real entry stamp (in the style of, never a copy): the four Schengen
// trips carry the ring of stars and country code, Scotland the UK "leave to enter"
// stamp, South Africa the Home Affairs arrival stamp, Costa Rica the round Migración
// stamp, and Alaska a ship's port-of-call postmark (Americans get no passport stamp).
// Place names come only from each trip's own stops in galaTrips.ts.
//
// Stamps are drawn on canvas, once, so the on-screen stamp and the saved image match.
// Dates use machine type, the Gala's one exception to Josefin, because a stamp is a machine.

export type Ctx = CanvasRenderingContext2D;

export const DISPLAY_FAMILY = '"Josefin Sans Variable", "Josefin Sans", sans-serif';
export const F = (weight: number, size: number, italic = false) =>
  `${italic ? 'italic ' : ''}${weight} ${size}px ${DISPLAY_FAMILY}`;
export const MONO = (weight: number, size: number) =>
  `${weight} ${size}px ui-monospace, "SF Mono", Menlo, Consolas, monospace`;

/** Fill text, optionally letter-spaced (canvas letterSpacing is not on every browser yet). */
export function text(x: Ctx, t: string, X: number, Y: number, font: string, align: CanvasTextAlign = 'center', spacing = 0) {
  x.font = font;
  if (!spacing) {
    x.textAlign = align;
    x.fillText(t, X, Y);
    return;
  }
  const chars = [...t];
  const widths = chars.map((c) => x.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  let px = align === 'center' ? X - total / 2 : align === 'right' ? X - total : X;
  x.textAlign = 'left';
  chars.forEach((c, i) => {
    x.fillText(c, px, Y);
    px += widths[i] + spacing;
  });
}

/** Width of letter-spaced text, without the trailing space. */
export function spacedWidth(x: Ctx, t: string, font: string, spacing: number) {
  x.font = font;
  const chars = [...t];
  return chars.reduce((a, c) => a + x.measureText(c).width, 0) + spacing * (chars.length - 1);
}

/** Text along a circle: 'top' reads clockwise over the top, 'bottom' left to right along the bottom. */
function arcText(x: Ctx, t: string, cx: number, cy: number, r: number, font: string, spacing: number, where: 'top' | 'bottom') {
  x.font = font;
  const chars = [...t];
  const widths = chars.map((c) => x.measureText(c).width);
  const total = widths.reduce((a, b) => a + b, 0) + spacing * (chars.length - 1);
  const bottom = where === 'bottom';
  const mid = bottom ? Math.PI / 2 : -Math.PI / 2;
  let a = bottom ? mid + total / (2 * r) : mid - total / (2 * r);
  x.textAlign = 'center';
  chars.forEach((c, i) => {
    const ac = bottom ? a - widths[i] / (2 * r) : a + widths[i] / (2 * r);
    x.save();
    x.translate(cx + r * Math.cos(ac), cy + r * Math.sin(ac));
    x.rotate(bottom ? ac - Math.PI / 2 : ac + Math.PI / 2);
    x.fillText(c, 0, 0);
    x.restore();
    a = bottom ? a - (widths[i] + spacing) / r : a + (widths[i] + spacing) / r;
  });
}

function star5(x: Ctx, cx: number, cy: number, R: number) {
  x.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 ? R * 0.42 : R;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    x.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
  }
  x.closePath();
  x.fill();
}

const cache = new Map<string, HTMLCanvasElement>();

// The official sparkmark (src/components/Sparkmark.tsx), set once it has loaded. Its shape is
// used as a mask, filled with the ink of whatever it's drawn in, like Sparkmark's `ink` variant.
let sparkmark: HTMLImageElement | null = null;
const tinted = new Map<string, HTMLCanvasElement>();

export function setSparkmark(img: HTMLImageElement) {
  sparkmark = img;
  tinted.clear();
  cache.clear();
}

function inkedMark(color: string) {
  const hit = tinted.get(color);
  if (hit || !sparkmark) return hit ?? null;
  const c = document.createElement('canvas');
  c.width = sparkmark.naturalWidth || 256;
  c.height = sparkmark.naturalHeight || 256;
  const x = c.getContext('2d');
  if (!x) return null;
  x.drawImage(sparkmark, 0, 0, c.width, c.height);
  x.globalCompositeOperation = 'source-in';
  x.fillStyle = color;
  x.fillRect(0, 0, c.width, c.height);
  tinted.set(color, c);
  return c;
}

/**
 * The sparkmark at (cx, cy), r from centre to tip, in the current fill colour.
 * Until the official mark has loaded, a plain four-point star holds its place.
 */
export function spark(x: Ctx, cx: number, cy: number, r: number) {
  const mark = typeof x.fillStyle === 'string' ? inkedMark(x.fillStyle) : null;
  if (mark) {
    x.drawImage(mark, cx - r, cy - r, r * 2, r * 2);
    return;
  }
  const q = r * 0.22;
  x.beginPath();
  x.moveTo(cx, cy - r);
  x.lineTo(cx + q, cy - q);
  x.lineTo(cx + r, cy);
  x.lineTo(cx + q, cy + q);
  x.lineTo(cx, cy + r);
  x.lineTo(cx - q, cy + q);
  x.lineTo(cx - r, cy);
  x.lineTo(cx - q, cy - q);
  x.closePath();
  x.fill();
}

/** The Schengen ring of twelve stars with the country code inside. */
function schengen(x: Ctx, cx: number, cy: number, R: number, code: string) {
  x.lineWidth = 1.6;
  x.beginPath();
  x.arc(cx, cy, R, 0, Math.PI * 2);
  x.stroke();
  for (let i = 0; i < 12; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 6;
    star5(x, cx + R * 0.7 * Math.cos(a), cy + R * 0.7 * Math.sin(a), R * 0.12);
  }
  text(x, code, cx, cy + R * 0.2, F(700, R * (code.length > 1 ? 0.5 : 0.62)));
}

function plane(x: Ctx, cx: number, cy: number, size: number, rot = -0.35) {
  const pts = [[11, 0], [7, -1.4], [2, -1.4], [-3, -8.5], [-5.6, -8.5], [-2.6, -1.4], [-7.4, -1.4], [-9.4, -4.6], [-11, -4.6], [-9.8, 0], [-11, 4.6], [-9.4, 4.6], [-7.4, 1.4], [-2.6, 1.4], [-5.6, 8.5], [-3, 8.5], [2, 1.4], [7, 1.4]];
  x.save();
  x.translate(cx, cy);
  x.rotate(rot);
  x.scale(size / 22, size / 22);
  x.beginPath();
  pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b)));
  x.closePath();
  x.fill();
  x.restore();
}

function frameRect(x: Ctx, X: number, Y: number, w: number, h: number, r: number, lw: number) {
  x.lineWidth = lw;
  x.beginPath();
  if (r) x.roundRect(X, Y, w, h, r);
  else x.rect(X, Y, w, h);
  x.stroke();
}

function poly(x: Ctx, pts: number[][], lw: number, close = true) {
  x.lineWidth = lw;
  x.beginPath();
  pts.forEach(([a, b], i) => (i ? x.lineTo(a, b) : x.moveTo(a, b)));
  if (close) x.closePath();
  x.stroke();
}

function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

/** Worn rubber: knock flecks and a few dry streaks out of the ink. Seeded, so a stamp always wears the same way. */
function wear(x: Ctx, w: number, h: number, seed: number) {
  const R = rng(seed);
  x.save();
  x.globalCompositeOperation = 'destination-out';
  x.fillStyle = x.strokeStyle = '#000';
  const flecks = Math.round((w * h) / 26);
  for (let i = 0; i < flecks; i++) {
    x.globalAlpha = 0.35 + R() * 0.65;
    x.beginPath();
    x.arc(R() * w, R() * h, 0.25 + R() * R() * 1.6, 0, Math.PI * 2);
    x.fill();
  }
  for (let i = 0; i < 5; i++) {
    x.globalAlpha = 0.25 + R() * 0.3;
    x.lineWidth = 0.6 + R() * 1.4;
    const y0 = R() * h;
    x.beginPath();
    x.moveTo(R() * w * 0.3, y0);
    x.lineTo(w * (0.5 + R() * 0.5), y0 + (R() - 0.5) * 12);
    x.stroke();
  }
  x.restore();
}

export interface StampArt {
  /** Size in stamp units. */
  w: number;
  h: number;
  ink: string;
  seed: number;
  draw(x: Ctx): void;
}

export const GALA_STAMP_ID = 'gala';

export const STAMPS: Record<string, StampArt> = {
  // Greece: Schengen entry stamp, square corners, with a Greek key band.
  greece: {
    w: 176, h: 124, ink: '#1d4a78', seed: 11,
    draw(x) {
      frameRect(x, 3, 3, 170, 118, 0, 3.4);
      frameRect(x, 9, 9, 158, 106, 0, 1);
      schengen(x, 38, 40, 22, 'GR');
      plane(x, 154, 30, 17);
      text(x, 'ATHINA', 99, 47, F(700, 16), 'center', 1.2);
      text(x, '11.12.26', 88, 78, MONO(700, 21), 'center', 1);
      const y0 = 88;
      const hh = 18;
      x.lineWidth = 1.6;
      x.beginPath();
      x.moveTo(14, y0);
      x.lineTo(162, y0);
      x.moveTo(14, y0 + hh + 4);
      x.lineTo(162, y0 + hh + 4);
      x.stroke();
      x.beginPath();
      for (let ux = 16; ux + 14 <= 162; ux += 15) {
        const t = y0 + 3;
        x.moveTo(ux, t + hh - 2);
        x.lineTo(ux, t);
        x.lineTo(ux + 12, t);
        x.lineTo(ux + 12, t + 10);
        x.lineTo(ux + 4, t + 10);
        x.lineTo(ux + 4, t + 5);
        x.lineTo(ux + 8, t + 5);
      }
      x.stroke();
    },
  },
  // Iceland: Schengen stamp, portrait with round corners, with a ridge and aurora.
  iceland: {
    w: 124, h: 156, ink: '#22566b', seed: 23,
    draw(x) {
      frameRect(x, 3, 3, 118, 150, 14, 3.2);
      frameRect(x, 9, 9, 106, 138, 10, 1);
      schengen(x, 62, 38, 22, 'IS');
      plane(x, 101, 22, 14);
      text(x, 'REYKJAVÍK', 62, 80, F(700, 14), 'center', 1);
      poly(x, [[14, 112], [30, 96], [40, 104], [56, 86], [70, 100], [82, 92], [98, 106], [110, 98]], 1.4, false);
      x.lineWidth = 1;
      [0, 5].forEach((d) => {
        x.beginPath();
        for (let px = 18; px <= 106; px += 2) x.lineTo(px, 92 - d + Math.sin(px / 9) * 3);
        x.stroke();
      });
      text(x, '11.12.26', 62, 134, MONO(700, 17), 'center', 1);
    },
  },
  // Cortona, Italy: Schengen stamp with clipped corners and two Tuscan cypresses.
  cortona: {
    w: 178, h: 118, ink: '#9a3b1f', seed: 37,
    draw(x) {
      const oct = (o: number, c: number, lw: number) =>
        poly(x, [[o + c, o], [178 - o - c, o], [178 - o, o + c], [178 - o, 118 - o - c], [178 - o - c, 118 - o], [o + c, 118 - o], [o, 118 - o - c], [o, o + c]], lw);
      oct(3, 14, 3.2);
      oct(9, 11, 1);
      schengen(x, 40, 62, 22, 'I');
      plane(x, 40, 25, 13);
      text(x, 'CORTONA', 72, 50, F(700, 16), 'left', 1);
      text(x, 'TOSCANA', 73, 65, F(600, 9), 'left', 2.6);
      text(x, '11.12.26', 72, 92, MONO(700, 15), 'left', 0.5);
      [[156, 62, 32], [164, 72, 22]].forEach(([cx, top, hgt]) => {
        x.beginPath();
        x.ellipse(cx, top + hgt / 2, 3.6, hgt / 2, 0, 0, Math.PI * 2);
        x.fill();
        x.fillRect(cx - 0.8, top + hgt - 1, 1.6, 6);
      });
    },
  },
  // Scotland: the UK "leave to enter" stamp, arched, with a thistle.
  scotland: {
    w: 134, h: 158, ink: '#563a7a', seed: 41,
    draw(x) {
      const arch = (o: number, lw: number) => {
        x.lineWidth = lw;
        x.beginPath();
        x.moveTo(o, 158 - o);
        x.lineTo(o, 62);
        x.ellipse(67, 62, 67 - o, 58 - o, 0, Math.PI, 0);
        x.lineTo(134 - o, 158 - o);
        x.closePath();
        x.stroke();
      };
      arch(3, 3.2);
      arch(9, 1);
      x.save();
      x.translate(67, 40);
      x.lineWidth = 1.5;
      x.beginPath();
      x.ellipse(0, 4, 7, 6, 0, 0, Math.PI * 2);
      x.stroke();
      x.lineWidth = 1.1;
      x.beginPath();
      for (let i = -3; i <= 3; i++) {
        x.moveTo(i * 2, -1);
        x.lineTo(i * 3.4, -13 + Math.abs(i) * 1.5);
      }
      x.stroke();
      x.lineWidth = 1.2;
      x.beginPath();
      x.moveTo(-6, 7);
      x.lineTo(6, 2);
      x.moveTo(-6, 2);
      x.lineTo(6, 7);
      x.stroke();
      x.lineWidth = 1.5;
      x.beginPath();
      x.moveTo(0, 10);
      x.lineTo(0, 22);
      x.moveTo(0, 17);
      x.lineTo(-9, 12);
      x.lineTo(-6, 17);
      x.moveTo(0, 17);
      x.lineTo(9, 12);
      x.lineTo(6, 17);
      x.stroke();
      x.restore();
      text(x, 'LEAVE TO ENTER', 67, 78, F(700, 9), 'center', 2.2);
      text(x, 'EDINBURGH', 67, 100, F(700, 16), 'center', 1);
      text(x, '11 DEC 2026', 67, 124, MONO(700, 14), 'center', 0.5);
      text(x, 'FOR SIX MONTHS', 67, 142, F(600, 8), 'center', 2);
    },
  },
  // South Africa: the Home Affairs arrival stamp, with a reversed banner and a sun.
  'south-africa': {
    w: 186, h: 114, ink: '#83561a', seed: 53,
    draw(x) {
      frameRect(x, 3, 3, 180, 108, 4, 3.2);
      x.fillRect(8, 8, 170, 24);
      x.save();
      x.globalCompositeOperation = 'destination-out';
      text(x, 'SOUTH AFRICA', 93, 26, F(700, 14), 'center', 4);
      x.restore();
      x.save();
      x.translate(32, 70);
      x.beginPath();
      x.arc(0, 0, 7, 0, Math.PI * 2);
      x.fill();
      x.lineWidth = 1.8;
      x.beginPath();
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 6;
        x.moveTo(Math.cos(a) * 10, Math.sin(a) * 10);
        x.lineTo(Math.cos(a) * 16, Math.sin(a) * 16);
      }
      x.stroke();
      x.restore();
      text(x, 'JOHANNESBURG', 112, 55, F(700, 12.5), 'center', 0.6);
      text(x, 'ARRIVAL · VISITOR', 112, 71, F(600, 9), 'center', 2);
      text(x, '2026-12-11', 112, 96, MONO(700, 17), 'center', 0.5);
    },
  },
  // Portugal: Schengen stamp with tile-pattern corners, in port-wine ink.
  portugal: {
    w: 172, h: 124, ink: '#7a1f3d', seed: 67,
    draw(x) {
      frameRect(x, 3, 3, 166, 118, 0, 3.2);
      frameRect(x, 9, 9, 154, 106, 0, 1);
      const tile = (cx: number, cy: number) => {
        x.lineWidth = 1;
        x.strokeRect(cx - 8, cy - 8, 16, 16);
        [[0, -4], [4, 0], [0, 4], [-4, 0]].forEach(([a, b]) => {
          x.beginPath();
          x.arc(cx + a, cy + b, 3.4, 0, Math.PI * 2);
          x.stroke();
        });
        x.beginPath();
        x.arc(cx, cy, 1.4, 0, Math.PI * 2);
        x.fill();
      };
      tile(19, 19);
      tile(153, 19);
      tile(19, 105);
      tile(153, 105);
      schengen(x, 50, 52, 21, 'P');
      text(x, 'LISBOA', 80, 59, F(700, 17), 'left', 1.2);
      text(x, '11.12.26', 80, 96, MONO(700, 17), 'center', 0.8);
      plane(x, 141, 84, 14);
    },
  },
  // Costa Rica: the round Migración entry stamp, with Arenal at its heart.
  'costa-rica': {
    w: 146, h: 146, ink: '#2c6a3c', seed: 79,
    draw(x) {
      const c = 73;
      x.lineWidth = 3.2;
      x.beginPath();
      x.arc(c, c, 69, 0, Math.PI * 2);
      x.stroke();
      x.lineWidth = 1.2;
      x.beginPath();
      x.arc(c, c, 48, 0, Math.PI * 2);
      x.stroke();
      arcText(x, 'MIGRACIÓN · COSTA RICA', c, c, 55, F(700, 10.5), 1.6, 'top');
      arcText(x, 'ENTRADA · PURA VIDA', c, c, 62, F(700, 10.5), 1.6, 'bottom');
      poly(x, [[c - 22, c + 4], [c - 5, c - 18], [c + 5, c - 18], [c + 22, c + 4]], 1.6, false);
      [[0, -24, 3], [4, -30, 3.6], [-1, -37, 4.2]].forEach(([dx, dy, r]) => {
        x.beginPath();
        x.arc(c + dx, c + dy, r, 0, Math.PI * 2);
        x.stroke();
      });
      text(x, 'ARENAL', c, c + 18, F(700, 14), 'center', 1.5);
      text(x, '11 DIC 2026', c, c + 32, MONO(700, 9.5), 'center', 0.2);
    },
  },
  // Alaska: a ship's port-of-call postmark with a whale tail and wavy cancellation lines.
  alaska: {
    w: 196, h: 124, ink: '#22446a', seed: 97,
    draw(x) {
      const cx = 62;
      const cy = 62;
      x.lineWidth = 3;
      x.beginPath();
      x.arc(cx, cy, 56, 0, Math.PI * 2);
      x.stroke();
      x.lineWidth = 1.1;
      x.beginPath();
      x.arc(cx, cy, 39, 0, Math.PI * 2);
      x.stroke();
      arcText(x, 'PORT OF CALL', cx, cy, 44, F(700, 10.5), 2, 'top');
      arcText(x, 'JUNEAU · ALASKA', cx, cy, 52, F(700, 10.5), 2, 'bottom');
      x.save();
      x.translate(cx, cy - 8);
      x.beginPath();
      x.moveTo(0, 10);
      x.quadraticCurveTo(-2, 2, -13, -4);
      x.quadraticCurveTo(-5, -4, 0, 0);
      x.quadraticCurveTo(5, -4, 13, -4);
      x.quadraticCurveTo(2, 2, 0, 10);
      x.fill();
      x.restore();
      text(x, 'DEC 11', cx, cy + 16, MONO(700, 12), 'center', 0.5);
      text(x, '2026', cx, cy + 29, MONO(700, 10), 'center', 1);
      x.lineWidth = 2.2;
      for (let k = 0; k < 5; k++) {
        const y0 = 30 + k * 16;
        x.beginPath();
        for (let px = 122; px <= 192; px += 2) x.lineTo(px, y0 + Math.sin((px - 122) / 8) * 3.2);
        x.stroke();
      }
    },
  },
  // The Gala's own entry stamp.
  [GALA_STAMP_ID]: {
    w: 136, h: 136, ink: '#a3245f', seed: 5,
    draw(x) {
      const c = 68;
      x.lineWidth = 2.4;
      x.setLineDash([1.2, 3]);
      x.beginPath();
      x.arc(c, c, 65, 0, Math.PI * 2);
      x.stroke();
      x.setLineDash([]);
      x.lineWidth = 3;
      x.beginPath();
      x.arc(c, c, 59, 0, Math.PI * 2);
      x.stroke();
      x.lineWidth = 1.1;
      x.beginPath();
      x.arc(c, c, 40, 0, Math.PI * 2);
      x.stroke();
      arcText(x, 'A WORLD OF CONNECTIONS', c, c, 45, F(700, 9.5), 1.7, 'top');
      arcText(x, 'ADMITTED', c, c, 52, F(700, 9.5), 3, 'bottom');
      spark(x, c, c - 17, 9);
      text(x, 'THE GALA', c, c + 8, F(700, 10.5), 'center', 1.2);
      text(x, '11 · XII · 2026', c, c + 22, MONO(700, 8), 'center', 0.1);
    },
  },
};

/** Generic visa stamp, used only if a trip is added without art of its own. */
export function fallbackStamp(name: string, connection: string): StampArt {
  return {
    w: 172, h: 118, ink: '#1f4f7a', seed: 3,
    draw(x) {
      frameRect(x, 3, 3, 166, 112, 4, 3.2);
      frameRect(x, 10, 10, 152, 98, 0, 1);
      text(x, `CONNECTION ${connection}`, 86, 32, F(700, 9), 'center', 2.2);
      text(x, name.toUpperCase(), 86, 64, F(700, name.length > 9 ? 15 : 19), 'center', 1.4);
      text(x, 'ADMITTED · 11 DEC 2026', 86, 88, F(600, 8), 'center', 1.5);
    },
  };
}

/** A stamp rendered on its own canvas at `k` pixels per unit, inked and worn. */
export function stampCanvas(id: string, art: StampArt, k = 3): HTMLCanvasElement {
  const key = `${id}@${k}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = Math.ceil(art.w * k);
  c.height = Math.ceil(art.h * k);
  const x = c.getContext('2d');
  if (!x) return c;
  x.scale(k, k);
  x.fillStyle = x.strokeStyle = art.ink;
  x.lineJoin = 'round';
  art.draw(x);
  wear(x, art.w, art.h, art.seed);
  cache.set(key, c);
  return c;
}

/** Forget rendered stamps, e.g. once the display font has loaded. */
export function clearStampCache() {
  cache.clear();
}
