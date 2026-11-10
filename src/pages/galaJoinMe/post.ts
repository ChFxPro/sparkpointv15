// Draws the "Join me" post for the Gala post maker: a 1080×1350 feed post and a 1080×1920
// story. Everything is drawn on the visitor's device; nothing is uploaded.
//
// The lockup is drawn from the brand kit's values (scripts/gala-print/templates/shared/
// lockup.css, ported from Branding/Gala/WorldOfConnections/lockup.html): every size is a
// multiple of C, the cap size of WORLD. The globe art behind it is simplified to the
// sunburst and a faint globe; the routes are left out at this size.
import QRCode from 'qrcode';
import { F, GALA_STAMP_ID, MONO, STAMPS, fallbackStamp, spacedWidth, spark, stampCanvas, text, type Ctx, type StampArt } from './stamps';

export const PAGE_URL = 'https://yoursparkpoint.org/events/sparkpoint-gala';
export const SHORT_URL = 'yoursparkpoint.org/events/sparkpoint-gala';

export interface Photo {
  kind: 'sample' | 'own' | 'none';
  source: CanvasImageSource | null;
  w: number;
  h: number;
}
export interface Frame {
  zoom: number;
  ox: number;
  oy: number;
}
export interface PostTrip {
  id: string;
  name: string;
  connection: string;
}
export interface PostInput {
  name: string;
  photo: Photo;
  frame: Frame;
  trip: PostTrip | null;
}
export interface PostAssets {
  sparkmark: HTMLImageElement | null;
}
export type PostKind = 'feed' | 'story';

interface Layout {
  W: number;
  H: number;
  /** Lockup cap size and top. */
  C: number;
  lockTop: number;
  pass: number;
  band: number;
  bandH: number;
  join: number;
  qr: number;
  qrLabel: boolean;
  /** Date line and link size in the band. */
  small: number;
}

export const LAYOUTS: Record<PostKind, Layout> = {
  feed: { W: 1080, H: 1350, C: 98, lockTop: 62, pass: 334, band: 1140, bandH: 140, join: 64, qr: 128, qrLabel: false, small: 24 },
  story: { W: 1080, H: 1920, C: 138, lockTop: 286, pass: 660, band: 1470, bandH: 200, join: 92, qr: 170, qrLabel: true, small: 30 },
};

/** Passport geometry inside a layout (canvas pixels). */
export function geo(L: Layout) {
  const px = 72;
  const py = L.pass;
  const pw = L.W - 144;
  const ph = 760;
  const Lx = px + 44;
  const T = py + 40;
  const fx = Lx;
  const fy = T + 104;
  const fw = 280;
  const fh = Math.round((280 * 385) / 300);
  return {
    px, py, pw, ph, Lx, T, fx, fy, fw, fh,
    ix: fx + 8, iy: fy + 8, iw: fw - 16, ih: fh - 16,
    // The two stamps are a pair: mirrored about the page centre, same height, opposite tilts.
    // [centre x, centre y, scale, rotation in degrees]
    trip: [px + pw * 0.73, py + 535, 2.05, -9] as const,
    gala: [px + pw * 0.27, py + 535, 2.4, 8] as const,
  };
}

export function artFor(trip: PostTrip | null): { id: string; art: StampArt } {
  if (!trip) return { id: GALA_STAMP_ID, art: STAMPS[GALA_STAMP_ID] };
  return { id: trip.id, art: STAMPS[trip.id] ?? fallbackStamp(trip.name, trip.connection) };
}

/** Where a stamp sits on the feed card, as CSS percentages, for the on-screen overlay. */
export function stampPlacement(which: 'trip' | 'gala', art: StampArt) {
  const L = LAYOUTS.feed;
  const [cx, cy, scale, rot] = geo(L)[which];
  return {
    left: `${(cx / L.W) * 100}%`,
    top: `${(cy / L.H) * 100}%`,
    width: `${((art.w * scale) / L.W) * 100}%`,
    rotate: `${rot}deg`,
  };
}

/** Start with the crop on the upper part of the photo, where faces usually are. */
export function autoFrame(photo: Photo): Frame {
  const G = geo(LAYOUTS.feed);
  if (!photo.source) return { zoom: 1, ox: 0, oy: 0 };
  const s = Math.max(G.iw / photo.w, G.ih / photo.h);
  return { zoom: 1, ox: 0, oy: Math.max(0, (photo.h * s - G.ih) / 2) * 0.55 };
}

export function clampFrame(photo: Photo, f: Frame): Frame {
  const G = geo(LAYOUTS.feed);
  if (!photo.source) return f;
  const s = Math.max(G.iw / photo.w, G.ih / photo.h) * f.zoom;
  const mx = Math.max(0, (photo.w * s - G.iw) / 2);
  const my = Math.max(0, (photo.h * s - G.ih) / 2);
  return { zoom: f.zoom, ox: Math.min(mx, Math.max(-mx, f.ox)), oy: Math.min(my, Math.max(-my, f.oy)) };
}

/** The photo's box on the feed card, in canvas pixels, for drag hit-testing. */
export function photoBox() {
  const G = geo(LAYOUTS.feed);
  return { x: G.fx, y: G.fy, w: G.fw, h: G.fh };
}

const displayName = (input: PostInput) => input.name.trim() || 'You';

function mrzLines(input: PostInput): [string, string] {
  const parts = displayName(input).toUpperCase().normalize('NFD').replace(/[^A-Z ]/g, '').trim().split(/\s+/).filter(Boolean);
  const surname = parts.length > 1 ? parts[parts.length - 1] : parts[0] ?? 'YOU';
  const given = parts.length > 1 ? parts.slice(0, -1).join('<') : '';
  const dest = input.trip ? input.trip.name.toUpperCase().normalize('NFD').replace(/[^A-Z ]/g, '').replace(/ /g, '<') : 'GALA';
  return [
    `P<SPK${surname}<<${given}`.padEnd(44, '<').slice(0, 44),
    `GALA1211<${dest}<<DEC<11<2026`.padEnd(44, '<').slice(0, 44),
  ];
}

function fitText(x: Ctx, t: string, X: number, Y: number, max: number, weight: number, size: number, italic = false) {
  let s = size;
  x.font = F(weight, s, italic);
  while (x.measureText(t).width > max && s > 14) {
    s -= 1;
    x.font = F(weight, s, italic);
  }
  x.fillText(t, X, Y);
}

function vintage(x: Ctx, X: number, Y: number, w: number, h: number) {
  const img = x.getImageData(X, Y, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const l = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    d[i] = d[i] * 0.68 + (l * 1.07 + 8) * 0.32;
    d[i + 1] = d[i + 1] * 0.68 + (l * 0.95 + 4) * 0.32;
    d[i + 2] = d[i + 2] * 0.68 + l * 0.78 * 0.32;
  }
  x.putImageData(img, X, Y);
}

export function drawBackground(x: Ctx, L: Layout) {
  const g = x.createRadialGradient(L.W / 2, L.lockTop + 200, 60, L.W / 2, L.lockTop + 400, L.H * 0.75);
  g.addColorStop(0, '#1b2a48');
  g.addColorStop(1, '#0b1322');
  x.fillStyle = g;
  x.fillRect(0, 0, L.W, L.H);
  // Deco double hairline (kit: brass at 50% and 28%).
  x.strokeStyle = 'rgba(217,181,106,.5)';
  x.lineWidth = 2;
  x.strokeRect(34, 34, L.W - 68, L.H - 68);
  x.strokeStyle = 'rgba(217,181,106,.28)';
  x.lineWidth = 1.5;
  x.strokeRect(46, 46, L.W - 92, L.H - 92);
}

export function drawLockup(x: Ctx, L: Layout, assets: PostAssets) {
  const C = L.C;
  const cx = L.W / 2;
  // Kit proportions, with pixel floors on the small lines so they stay legible when the
  // post is seen at phone-feed size (the same departure the site's GalaLockup makes).
  const connSize = Math.max(0.2 * C, 22);
  const bySize = Math.max(0.1 * C, 21);
  const by2Size = Math.max(0.08 * C, 17);
  const height = 0.264 * C + C + 0.056 * C + connSize + 0.0715 * C + 0.195 * C + 0.06 * C + bySize + 0.75 * by2Size + by2Size;
  const top = L.lockTop;

  // Art behind: a 25-ray sunburst and a faint globe, centred 44% down, 150% of the lockup tall.
  const ay = top + height * 0.44;
  const R = height * 0.75;
  x.save();
  x.strokeStyle = 'rgba(217,181,106,.16)';
  x.lineWidth = 1.2;
  for (let i = 0; i < 25; i++) {
    const a = Math.PI + (Math.PI * i) / 24;
    x.beginPath();
    x.moveTo(cx + Math.cos(a) * R * 0.55, ay + Math.sin(a) * R * 0.55);
    x.lineTo(cx + Math.cos(a) * R * 2.2, ay + Math.sin(a) * R * 2.2);
    x.stroke();
  }
  x.strokeStyle = 'rgba(241,217,160,.12)';
  x.lineWidth = 1.2;
  [[R, R], [R * 0.42, R], [R, R * 0.32]].forEach(([rx, ry]) => {
    x.beginPath();
    x.ellipse(cx, ay, rx, ry, 0, 0, Math.PI * 2);
    x.stroke();
  });
  x.restore();

  x.textBaseline = 'alphabetic';
  let y = top;
  // "A": italic 300, 0.22em, accent brass.
  x.fillStyle = '#d9b56a';
  text(x, 'A', cx, y + 0.22 * C * 0.78, F(300, 0.22 * C, true), 'center', 0);
  y += 0.22 * C + 0.044 * C;
  // WORLD: 700, letter-spacing 0.26em; edge line at 0.07em, gap line at 0.045em.
  const wf = F(700, C);
  const base = y + C * 0.8;
  x.fillStyle = '#d9b56a';
  text(x, 'WORLD', cx + 0.07 * C, base + 0.07 * C, wf, 'center', 0.26 * C);
  x.fillStyle = '#0b1322';
  text(x, 'WORLD', cx + 0.045 * C, base + 0.045 * C, wf, 'center', 0.26 * C);
  x.fillStyle = '#f7f1e5';
  text(x, 'WORLD', cx, base, wf, 'center', 0.26 * C);
  y += C;
  // — OF CONNECTIONS —: 400, 0.2em, letter-spacing 0.62em, bars 2.6em wide.
  y += 0.056 * C;
  const cf = F(400, connSize);
  const cw = spacedWidth(x, 'OF CONNECTIONS', cf, 0.62 * connSize);
  x.fillStyle = '#d9b56a';
  text(x, 'OF CONNECTIONS', cx, y + connSize * 0.8, cf, 'center', 0.62 * connSize);
  x.save();
  x.globalAlpha = 0.7;
  const barY = y + connSize * 0.48;
  x.fillRect(cx - cw / 2 - 0.6 * connSize - 2.6 * connSize, barY, 2.6 * connSize, 1.5);
  x.fillRect(cx + cw / 2 + 0.6 * connSize, barY, 2.6 * connSize, 1.5);
  x.restore();
  y += connSize;
  // Rule: double hairlines, diamond outlines and the sparkmark, at 0.13em.
  y += 0.0715 * C;
  const f = 0.13 * C;
  const ry = y + 0.75 * f;
  const total = 15.3 * f;
  let rx = cx - total / 2;
  x.save();
  x.strokeStyle = '#f1d9a0';
  x.lineWidth = 1.2;
  const hair = (len: number) => {
    x.globalAlpha = 0.6;
    x.beginPath();
    x.moveTo(rx, ry - 2.5);
    x.lineTo(rx + len, ry - 2.5);
    x.moveTo(rx, ry + 2.5);
    x.lineTo(rx + len, ry + 2.5);
    x.stroke();
    rx += len + 0.7 * f;
  };
  const diamond = () => {
    const s = 0.5 * f;
    x.globalAlpha = 0.7;
    x.beginPath();
    x.moveTo(rx + s / 2, ry - s / 2);
    x.lineTo(rx + s, ry);
    x.lineTo(rx + s / 2, ry + s / 2);
    x.lineTo(rx, ry);
    x.closePath();
    x.stroke();
    rx += s + 0.7 * f;
  };
  hair(5 * f);
  diamond();
  x.globalAlpha = 1;
  if (assets.sparkmark) x.drawImage(assets.sparkmark, rx, ry - 0.75 * f, 1.5 * f, 1.5 * f);
  else {
    x.fillStyle = '#e03694';
    spark(x, rx + 0.75 * f, ry, 0.7 * f);
  }
  rx += 1.5 * f + 0.7 * f;
  diamond();
  hair(5 * f);
  x.restore();
  y += 1.5 * f;
  // THE SPARKPOINT GALA: 600, 0.1em, letter-spacing 0.44em.
  y += 0.06 * C;
  x.fillStyle = '#f1d9a0';
  text(x, 'THE SPARKPOINT GALA', cx, y + bySize * 0.8, F(600, bySize), 'center', 0.44 * bySize);
  y += bySize;
  // TRAVEL EXPERIENCE: 400, 0.08em (with a floor), letter-spacing 0.38em, at 85%.
  y += 0.75 * by2Size;
  x.save();
  x.globalAlpha = 0.85;
  text(x, 'TRAVEL EXPERIENCE', cx, y + by2Size * 0.8, F(400, by2Size), 'center', 0.38 * by2Size);
  x.restore();
}

export function drawPassport(x: Ctx, L: Layout, input: PostInput) {
  const G = geo(L);
  const { px, py, pw, ph, Lx, T, fx, fy, fw, fh, ix, iy, iw, ih } = G;
  x.textBaseline = 'alphabetic';
  // Cover and page
  x.save();
  x.shadowColor = 'rgba(0,0,0,.5)';
  x.shadowBlur = 50;
  x.shadowOffsetY = 20;
  x.fillStyle = '#13203a';
  x.beginPath();
  x.roundRect(px - 16, py - 16, pw + 32, ph + 32, 22);
  x.fill();
  x.restore();
  x.strokeStyle = 'rgba(217,181,106,.55)';
  x.lineWidth = 2;
  x.beginPath();
  x.roundRect(px - 14, py - 14, pw + 28, ph + 28, 20);
  x.stroke();
  x.fillStyle = '#efe5cf';
  x.beginPath();
  x.roundRect(px, py, pw, ph, 8);
  x.fill();
  x.save();
  x.beginPath();
  x.roundRect(px, py, pw, ph, 8);
  x.clip();
  x.strokeStyle = 'rgba(122,96,52,.07)';
  x.lineWidth = 1.5;
  for (let r = 20; r < 1200; r += 22) {
    x.beginPath();
    x.arc(px + pw / 2, py + ph + 160, r, 0, Math.PI * 2);
    x.stroke();
  }
  x.restore();
  // Issuer
  x.strokeStyle = x.fillStyle = '#b08d45';
  x.lineWidth = 2;
  [25, 20].forEach((r) => {
    x.beginPath();
    x.arc(Lx + 26, T + 26, r, 0, Math.PI * 2);
    x.stroke();
  });
  spark(x, Lx + 26, T + 26, 14);
  x.fillStyle = '#3a2f1d';
  text(x, 'World of Connections', Lx + 72, T + 24, F(600, 30), 'left');
  x.fillStyle = '#8a7754';
  text(x, 'PASSPORT · PASSEPORT · PASAPORTE', Lx + 72, T + 52, F(700, 16), 'left', 2.2);
  text(x, 'PASSPORT NO.', px + pw - 44, T + 16, F(700, 16), 'right', 2.2);
  x.fillStyle = '#2d2618';
  text(x, 'GALA1211', px + pw - 44, T + 46, F(700, 22), 'right');
  x.fillStyle = '#d8c7a1';
  x.fillRect(Lx, T + 74, pw - 88, 1.5);
  // Photo
  x.fillStyle = '#fbf6ea';
  x.fillRect(fx, fy, fw, fh);
  x.strokeStyle = '#d3c09a';
  x.lineWidth = 1.5;
  x.strokeRect(fx, fy, fw, fh);
  const { photo, frame } = input;
  if (photo.kind === 'none' || !photo.source) {
    // No photo: the Gala seal (a globe and the star).
    x.fillStyle = '#e6dbc2';
    x.fillRect(ix, iy, iw, ih);
    const ecx = ix + iw / 2;
    const ecy = iy + ih / 2;
    const R = iw * 0.39;
    x.strokeStyle = '#b08d45';
    x.lineWidth = 2;
    [[R, R], [R * 0.86, R * 0.86], [R * 0.39, R * 0.86], [R * 0.86, R * 0.3]].forEach(([a, b]) => {
      x.beginPath();
      x.ellipse(ecx, ecy, a, b, 0, 0, Math.PI * 2);
      x.stroke();
    });
    x.beginPath();
    x.moveTo(ecx - R, ecy);
    x.lineTo(ecx + R, ecy);
    x.moveTo(ecx, ecy - R);
    x.lineTo(ecx, ecy + R);
    x.stroke();
    x.fillStyle = '#8e2a5c';
    spark(x, ecx, ecy, R * 0.45);
  } else {
    const s = Math.max(iw / photo.w, ih / photo.h) * frame.zoom;
    const dw = photo.w * s;
    const dh = photo.h * s;
    x.save();
    x.beginPath();
    x.rect(ix, iy, iw, ih);
    x.clip();
    x.drawImage(photo.source, ix + iw / 2 - dw / 2 + frame.ox, iy + ih / 2 - dh / 2 + frame.oy, dw, dh);
    x.restore();
    vintage(x, ix, iy, iw, ih);
    if (photo.kind === 'sample') {
      x.fillStyle = 'rgba(11,19,34,.72)';
      x.fillRect(ix + 8, iy + 8, 96, 26);
      x.fillStyle = '#f7f1e5';
      text(x, 'SAMPLE', ix + 56, iy + 26, F(600, 13), 'center', 3);
    }
  }
  // Fields
  const cx0 = fx + fw + 44;
  const colW = px + pw - 44 - cx0;
  const field = (label: string, value: string, Y: number, size: number, weight = 400) => {
    x.fillStyle = '#8a7754';
    text(x, label, cx0, Y, F(700, 17), 'left', 2.2);
    x.fillStyle = '#1b1a1f';
    x.textAlign = 'left';
    fitText(x, value, cx0, Y + size + 8, colW, weight, size);
  };
  field('BEARER · TITULAIRE', displayName(input), fy + 14, 58, 600);
  field('HOME PORT', 'Transylvania County, NC', fy + 122, 30);
  field('DATE OF ISSUE', '11 Dec 2026', fy + 204, 30);
  field('DESTINATION', input.trip ? `Connection ${input.trip.connection} · ${input.trip.name}` : 'The SparkPoint Gala', fy + 286, 32, 600);
  // Signature: the name in script
  const sy = py + 590;
  x.save();
  x.translate(Lx, sy);
  x.rotate(-0.06);
  x.fillStyle = '#1f3a66';
  x.textAlign = 'left';
  fitText(x, input.name.trim() || 'Bon voyage!', 0, 0, 440, 300, 48, true);
  x.restore();
  x.fillStyle = '#b8a37a';
  x.fillRect(Lx, sy + 14, 470, 1.5);
  x.fillStyle = '#8a7754';
  text(x, 'SIGNATURE OF BEARER', Lx, sy + 38, F(700, 16), 'left', 2.2);
  // Machine-readable zone
  x.fillStyle = '#d8c7a1';
  x.fillRect(Lx, py + ph - 92, pw - 88, 1.5);
  x.fillStyle = '#4d4433';
  x.font = MONO(500, 21);
  x.textAlign = 'left';
  const step = (pw - 88) / 44;
  mrzLines(input).forEach((line, k) => [...line].forEach((ch, i) => x.fillText(ch, Lx + i * step, py + ph - 56 + k * 32)));
}

export function drawBand(x: Ctx, L: Layout) {
  const X0 = 76;
  const base = L.band + L.join * 0.8;
  x.textBaseline = 'alphabetic';
  x.fillStyle = '#f7f1e5';
  x.font = F(300, L.join);
  const jw = x.measureText('Join ').width;
  x.textAlign = 'left';
  x.fillText('Join ', X0, base);
  x.fillStyle = '#d9b56a';
  x.font = F(600, L.join);
  x.fillText('me.', X0 + jw, base);
  x.fillStyle = '#f1d9a0';
  // The date line and link keep clear of the QR code: shrink only if they would reach it.
  const room = L.W - 76 - L.qr - 28 - X0;
  const DATE = 'FRIDAY · DECEMBER 11 · 2026 · BREVARD, NC';
  let ds = L.small;
  while (ds > 16 && spacedWidth(x, DATE, F(600, ds), ds * 0.1) > room) ds -= 1;
  text(x, DATE, X0, base + L.small * 1.9, F(600, ds), 'left', ds * 0.1);
  let us = L.small;
  while (us > 16 && spacedWidth(x, SHORT_URL, F(400, us), 0) > room) us -= 1;
  x.fillStyle = 'rgba(247,241,229,.88)';
  text(x, SHORT_URL, X0, base + L.small * 3.35, F(400, us), 'left');
  // QR code to the Gala page
  const qr = QRCode.create(PAGE_URL, { errorCorrectionLevel: 'M' }).modules;
  const n = qr.size;
  const size = L.qr;
  const X = L.W - 76 - size;
  const Y = L.band + (L.bandH - size) / 2;
  const pad = Math.round(size * 0.07);
  const cell = (size - pad * 2) / n;
  x.fillStyle = '#f7f1e5';
  x.fillRect(X, Y, size, size);
  x.fillStyle = '#0b1322';
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.get(r, c)) x.fillRect(X + pad + c * cell, Y + pad + r * cell, Math.ceil(cell), Math.ceil(cell));
  if (L.qrLabel) {
    x.fillStyle = 'rgba(247,241,229,.75)';
    text(x, 'SCAN FOR TICKETS', X + size / 2, Y + size + 26, F(600, 16), 'center', 2.4);
  }
}

function drawStamp(x: Ctx, id: string, art: StampArt, [cx, cy, scale, rot]: readonly [number, number, number, number]) {
  const c = stampCanvas(id, art);
  const w = art.w * scale;
  const h = art.h * scale;
  x.save();
  x.translate(cx, cy);
  x.rotate((rot * Math.PI) / 180);
  x.globalCompositeOperation = 'multiply';
  x.globalAlpha = 0.9;
  x.drawImage(c, -w / 2, -h / 2, w, h);
  x.restore();
}

/** The finished post, as a JPEG. */
export function exportPost(kind: PostKind, input: PostInput, assets: PostAssets): Promise<Blob | null> {
  const L = LAYOUTS[kind];
  const c = document.createElement('canvas');
  c.width = L.W;
  c.height = L.H;
  const x = c.getContext('2d', { willReadFrequently: true });
  if (!x) return Promise.resolve(null);
  drawBackground(x, L);
  drawLockup(x, L, assets);
  drawPassport(x, L, input);
  drawBand(x, L);
  const G = geo(L);
  if (input.trip) {
    const { id, art } = artFor(input.trip);
    drawStamp(x, id, art, G.trip);
  }
  drawStamp(x, GALA_STAMP_ID, STAMPS[GALA_STAMP_ID], G.gala);
  return new Promise((resolve) => c.toBlob(resolve, 'image/jpeg', 0.9));
}

export function caption(input: PostInput) {
  const trip = input.trip ? ` My dream trip: ${input.trip.name}.` : '';
  return `I’m going to A World of Connections, the SparkPoint Gala, on Friday, December 11 in Brevard.${trip} Join me?\n\nEvery journey connects back home.\nTickets: ${SHORT_URL}`;
}
