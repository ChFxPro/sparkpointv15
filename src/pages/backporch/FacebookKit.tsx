// The Facebook kit: ready-to-paste post text and a share image, made in the
// browser. The image carries the short address and a QR code, so the post
// needs no link card and doesn't count against Meta's 2-link-a-month limit.
// No tracking parameters anywhere (the site promises no analytics).
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { blockImages, normalizeBlocks } from '../../lib/porchBlocks';
import {
  clockTime,
  dateChip,
  longDate,
  porchImageUrl,
  porchMediaUrl,
  shortAddress,
  type PorchPost,
} from '../../lib/backporch';

const W = 1080;
const H = 1350; // 4:5, the tallest shape Facebook shows uncropped in the feed
const PHOTO_H = 700;
const PLUM = '#2a1430';
const GOLD = '#fdb515';
const CREAM = '#fffaf2';
const SERIF = '"Fraunces Variable", Fraunces, Georgia, serif';
const SANS = 'Manrope, system-ui, sans-serif';

export function composePostText(post: PorchPost): string {
  const lines = [post.title, '', post.summary];
  if (post.kind === 'gathering' && post.event_start) {
    const when = `${longDate(post.event_start)}, ${clockTime(post.event_start)}`;
    lines.push('', post.event_place ? `${when} · ${post.event_place}` : when);
  }
  lines.push('', `More on the BackPorch: ${shortAddress(post.slug)}`);
  return lines.join('\n');
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Could not load ${src}`));
    img.src = src;
  });
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, maxLines: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width <= maxWidth) {
      line = next;
      continue;
    }
    if (line) lines.push(line);
    line = word;
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && line) lines.push(line);
  if (lines.length === maxLines && words.join(' ') !== lines.join(' ')) {
    let last = lines[maxLines - 1];
    while (last && ctx.measureText(`${last}…`).width > maxWidth) last = last.replace(/\s*\S+$/, '');
    lines[maxLines - 1] = `${last}…`;
  }
  return lines;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

async function drawShareImage(canvas: HTMLCanvasElement, post: PorchPost) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = W;
  canvas.height = H;
  // Load the exact faces before drawing, or the canvas silently falls back.
  await Promise.all([
    document.fonts.load('600 64px "Fraunces Variable"'),
    document.fonts.load('700 72px "Fraunces Variable"'),
    document.fonts.load('800 40px Manrope'),
    document.fonts.load('600 32px Manrope'),
  ]).catch(() => {});
  await document.fonts.ready;

  ctx.fillStyle = PLUM;
  ctx.fillRect(0, 0, W, H);

  // Photo, cover-fit into the top band; a board pattern if there is none.
  const photoUrl = porchImageUrl(post.image_path, 1600);
  if (photoUrl) {
    try {
      const img = await loadImage(photoUrl);
      const frame = post.presentation?.cover;
      const fill = Math.max(W / img.naturalWidth, PHOTO_H / img.naturalHeight);
      // Crop around the cover's focal point (centred unless one was set).
      const fx = (frame?.fit === 'fill' ? frame.x : 50) / 100;
      const fy = (frame?.fit === 'fill' ? frame.y : 50) / 100;
      const dw = img.naturalWidth * fill;
      const dh = img.naturalHeight * fill;
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, W, PHOTO_H);
      ctx.clip();
      if (frame?.fit !== 'whole') {
        ctx.drawImage(img, (W - dw) * fx, (PHOTO_H - dh) * fy, dw, dh);
      } else {
        // Shown whole: a filled copy, blurred and dimmed, then the full photo on it.
        // (Canvas blur is skipped where unsupported; the dim still sets the photo apart.)
        ctx.filter = 'blur(28px) brightness(0.8)';
        ctx.drawImage(img, (W - dw) / 2, (PHOTO_H - dh) / 2, dw, dh);
        ctx.filter = 'none';
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(0, 0, W, PHOTO_H);
        const fit = Math.min(W / img.naturalWidth, PHOTO_H / img.naturalHeight);
        const ww = img.naturalWidth * fit;
        const wh = img.naturalHeight * fit;
        ctx.drawImage(img, (W - ww) / 2, (PHOTO_H - wh) / 2, ww, wh);
      }
      ctx.restore();
    } catch {
      /* leave the plum */
    }
  } else {
    ctx.fillStyle = '#3b1d42';
    ctx.fillRect(0, 0, W, PHOTO_H);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for (let y = 40; y < PHOTO_H; y += 56) ctx.fillRect(0, y, W, 2);
  }
  // Soft fade from photo into the panel.
  const fade = ctx.createLinearGradient(0, PHOTO_H - 160, 0, PHOTO_H);
  fade.addColorStop(0, 'rgba(42,20,48,0)');
  fade.addColorStop(1, 'rgba(42,20,48,1)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, PHOTO_H - 160, W, 160);

  const pad = 72;
  let x = pad;
  let y = PHOTO_H + 24;

  // Date chip for gatherings.
  if (post.kind === 'gathering' && post.event_start) {
    const { month, day } = dateChip(post.event_start);
    ctx.fillStyle = GOLD;
    roundRect(ctx, pad, PHOTO_H - 120, 132, 150, 26);
    ctx.fill();
    ctx.fillStyle = PLUM;
    ctx.textAlign = 'center';
    ctx.font = `800 30px ${SANS}`;
    ctx.fillText(month.toUpperCase(), pad + 66, PHOTO_H - 70);
    ctx.font = `700 72px ${SERIF}`;
    ctx.fillText(day, pad + 66, PHOTO_H + 6);
    ctx.textAlign = 'left';
    y = PHOTO_H + 70;
  }

  // Title: three lines, or two when a date line follows. Everything above the
  // footer stays clear of the QR code (the footer starts at y = 1068).
  const isGathering = post.kind === 'gathering' && Boolean(post.event_start);
  ctx.fillStyle = '#fff';
  ctx.font = `600 64px ${SERIF}`;
  const titleLines = wrap(ctx, post.title, W - pad * 2, isGathering ? 2 : 3);
  y += 40;
  for (const line of titleLines) {
    y += 72;
    ctx.fillText(line, x, y);
  }

  // When and where.
  if (isGathering && post.event_start) {
    ctx.font = `600 32px ${SANS}`;
    ctx.fillStyle = 'rgba(255,255,255,0.82)';
    const when = `${longDate(post.event_start)}, ${clockTime(post.event_start)}`;
    const lines = wrap(ctx, post.event_place ? `${when} · ${post.event_place}` : when, W - pad * 2, 1);
    y += 18;
    for (const line of lines) {
      y += 44;
      ctx.fillText(line, x, y);
    }
  }

  // Footer: short address and the SparkPoint name on the left, QR on the right.
  const qrSize = 196;
  const qrX = W - pad - qrSize;
  const qrY = H - pad - qrSize;
  ctx.fillStyle = CREAM;
  roundRect(ctx, qrX - 14, qrY - 14, qrSize + 28, qrSize + 28, 22);
  ctx.fill();
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, `https://${shortAddress(post.slug)}`, {
    width: qrSize,
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: PLUM, light: CREAM },
  });
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // The address shrinks to fit beside the QR code rather than running under it.
  const addressWidth = qrX - 40 - pad;
  let size = 40;
  ctx.font = `800 ${size}px ${SANS}`;
  while (size > 24 && ctx.measureText(shortAddress(post.slug)).width > addressWidth) {
    size -= 2;
    ctx.font = `800 ${size}px ${SANS}`;
  }
  ctx.fillStyle = GOLD;
  ctx.fillText(shortAddress(post.slug), pad, H - pad - 64);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = `600 28px ${SANS}`;
  ctx.fillText('SparkPoint · The BackPorch', pad, H - pad - 14);
}

/** Fetches a file and saves it under a friendly name (cross-origin `download` links don't). */
async function saveFile(url: string, name: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not fetch ${name}`);
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(href), 4000);
}

/** A 1080×1080 centre crop, the shape Facebook shows best in a multi-photo post. */
async function squarePhoto(path: string, name: string) {
  const src = porchImageUrl(path, 1600);
  if (!src) return;
  const img = await loadImage(src);
  const side = Math.min(img.naturalWidth, img.naturalHeight);
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  canvas.getContext('2d')?.drawImage(
    img,
    (img.naturalWidth - side) / 2,
    (img.naturalHeight - side) / 2,
    side,
    side,
    0,
    0,
    1080,
    1080,
  );
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.9));
  if (!blob) return;
  const href = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = href;
  a.download = name;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(href), 4000);
}

function MediaForFacebook({ post }: { post: PorchPost }) {
  const blocks = normalizeBlocks(post.blocks);
  const photos = blockImages(blocks).slice(0, 10);
  const clips = blocks.filter((b): b is Extract<typeof b, { type: 'video' }> => b.type === 'video');
  const [busy, setBusy] = useState<string | null>(null);
  if (!photos.length && !clips.length) return null;

  const run = async (label: string, job: () => Promise<void>) => {
    setBusy(label);
    try {
      await job();
    } catch {
      alert('That download did not work. Try again in a moment.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="pe-kit-media">
      <h3>Photos and clips for Facebook</h3>
      {photos.length > 1 && (
        <p className="pe-help">
          Post these together as one multi-photo post with the text above. Facebook shows square photos best.
        </p>
      )}
      <div className="pe-actions">
        {photos.length > 0 && (
          <button
            type="button"
            className="pe-btn"
            disabled={!!busy}
            onClick={() =>
              void run('photos', async () => {
                for (const [i, img] of photos.entries()) {
                  await squarePhoto(img.path, `backporch-${post.slug}-${i + 1}.jpg`);
                  await new Promise((r) => window.setTimeout(r, 400));
                }
              })
            }
          >
            {busy === 'photos' ? 'Preparing…' : `Download ${photos.length > 1 ? `${photos.length} square photos` : 'square photo'}`}
          </button>
        )}
        {clips.map((c, i) => (
          <button
            key={c.id}
            type="button"
            className="pe-btn"
            disabled={!!busy}
            onClick={() => void run(c.id, () => saveFile(porchMediaUrl(c.path), `backporch-${post.slug}-clip${clips.length > 1 ? `-${i + 1}` : ''}.${c.path.split('.').pop()}`))}
          >
            {busy === c.id ? 'Downloading…' : `Download the clip${clips.length > 1 ? ` ${i + 1}` : ''}`}
          </button>
        ))}
      </div>
      {clips.length > 0 && (
        <p className="pe-help">Upload clips to Facebook directly rather than linking; it plays better there.</p>
      )}
    </div>
  );
}

export function FacebookKit({ post }: { post: PorchPost }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState(() => composePostText(post));
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setText(composePostText(post));
  }, [post]);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawShareImage(canvas, post).then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, [post]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      const a = document.createElement('a');
      a.download = `backporch-${post.slug}.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    } catch {
      alert('The photo could not be included in the download. Try again in a moment.');
    }
  };

  return (
    <section className="pe-kit" aria-labelledby="pe-kit-title">
      <h2 id="pe-kit-title">Facebook kit</h2>
      <p className="pe-help">
        Post the image with this text as a regular photo post. Don't paste a link: the short address and QR
        code bring people here, and the post won't count toward Facebook's link limit.
      </p>
      <div className="pe-kit-grid">
        <canvas
          ref={canvasRef}
          className="pe-kit-canvas"
          role="img"
          aria-label={`Share image: ${post.title}, with the address ${shortAddress(post.slug)} and a QR code`}
        />
        <div>
          <label className="pe-label" htmlFor="pe-kit-text">
            Post text
          </label>
          <textarea
            id="pe-kit-text"
            className="ir-input pe-textarea"
            rows={9}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="pe-actions">
            <button
              type="button"
              className="pe-btn pe-btn-primary"
              onClick={() => {
                void navigator.clipboard?.writeText(text).then(() => {
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                });
              }}
            >
              <span aria-live="polite">{copied ? 'Copied' : 'Copy post text'}</span>
            </button>
            <button type="button" className="pe-btn" onClick={download} disabled={!ready}>
              Download image
            </button>
          </div>
        </div>
      </div>
      <MediaForFacebook post={post} />
    </section>
  );
}
