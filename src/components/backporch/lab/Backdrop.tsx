// Living backdrop (Porch Lab): a generative scene behind a heading.
//   sunrise    the sky warms and the sun lifts behind layered ridges; mist drifts
//   fireflies  dusk ridges with fireflies wandering and blinking
//   ridges     ridge layers drifting slowly sideways at different speeds
// Drawn on a canvas, only while on screen, with a visible pause button
// (WCAG 2.2.2). Under reduced motion it draws one still frame and never animates.
import { useEffect, useRef, useState } from 'react';
import { useCalm, useInView } from './hooks';

type Scene = 'sunrise' | 'fireflies' | 'ridges';

const RIDGE_COLORS: Record<Scene, string[]> = {
  sunrise: ['#a49ab3', '#857a99', '#625874', '#463d55', '#2b2533'],
  fireflies: ['#3a3348', '#302a3d', '#262131', '#1f1b26', '#17141c'],
  ridges: ['#7d7390', '#62587a', '#4a4160', '#352e46', '#241f2e'],
};

/** A smooth ridge line: a few summed sines, offset by `shift`. */
function ridgeY(x: number, w: number, base: number, amp: number, seed: number, shift: number): number {
  const t = (x + shift) / w;
  return (
    base +
    Math.sin(t * Math.PI * 2 * (1.1 + seed * 0.3) + seed * 3) * amp * 0.55 +
    Math.sin(t * Math.PI * 2 * (2.7 + seed * 0.5) + seed * 5) * amp * 0.3 +
    Math.sin(t * Math.PI * 2 * (5.3 + seed) + seed) * amp * 0.15
  );
}

function draw(ctx: CanvasRenderingContext2D, w: number, h: number, scene: Scene, t: number, flies: Fly[]) {
  // Sky
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  if (scene === 'sunrise') {
    const warm = Math.min(1, 0.55 + Math.sin(t * 0.00012) * 0.15 + 0.3);
    sky.addColorStop(0, '#4b4466');
    sky.addColorStop(0.55, `rgba(214, 140, 120, ${warm})`);
    sky.addColorStop(1, '#f5c88a');
  } else if (scene === 'fireflies') {
    sky.addColorStop(0, '#15121b');
    sky.addColorStop(1, '#2b2436');
  } else {
    sky.addColorStop(0, '#5d567a');
    sky.addColorStop(0.7, '#c99482');
    sky.addColorStop(1, '#e8b47e');
  }
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);

  // Sun (sunrise and ridges)
  if (scene !== 'fireflies') {
    const rise = scene === 'sunrise' ? (Math.sin(t * 0.00009) + 1) / 2 : 0.4;
    const sx = w * 0.68;
    const sy = h * (0.62 - rise * 0.12);
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, h * 0.55);
    glow.addColorStop(0, 'rgba(255, 236, 190, 0.95)');
    glow.addColorStop(0.08, 'rgba(255, 214, 140, 0.8)');
    glow.addColorStop(0.35, 'rgba(242, 182, 50, 0.22)');
    glow.addColorStop(1, 'rgba(242, 182, 50, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
  }

  // Stars for fireflies
  if (scene === 'fireflies') {
    ctx.fillStyle = 'rgba(246, 239, 227, 0.6)';
    for (let i = 0; i < 60; i++) {
      const x = (i * 263.7) % w;
      const y = ((i * 97.3) % (h * 0.45)) + 6;
      ctx.fillRect(x, y, 1.2, 1.2);
    }
  }

  // Ridges, far to near
  const colors = RIDGE_COLORS[scene];
  colors.forEach((color, i) => {
    const base = h * (0.5 + i * 0.1);
    const amp = h * (0.07 - i * 0.008);
    const speed = scene === 'ridges' ? (i + 1) * 0.004 : scene === 'sunrise' ? (i + 1) * 0.0008 : 0;
    const shift = t * speed;
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 8) ctx.lineTo(x, ridgeY(x, w, base, amp, i + 1, shift));
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Mist pooling between layers
    if (scene !== 'fireflies' && i < colors.length - 1) {
      const mist = ctx.createLinearGradient(0, base - amp, 0, base + h * 0.06);
      mist.addColorStop(0, 'rgba(246, 239, 227, 0)');
      mist.addColorStop(1, `rgba(246, 239, 227, ${0.1 - i * 0.015})`);
      ctx.fillStyle = mist;
      ctx.fillRect(0, base - amp, w, h * 0.08);
    }
  });

  // Fireflies
  if (scene === 'fireflies') {
    for (const f of flies) {
      const x = (f.x + Math.sin(t * f.sx + f.p) * 0.03) * w;
      const y = (f.y + Math.cos(t * f.sy + f.p) * 0.04) * h;
      const blink = Math.max(0, Math.sin(t * f.b + f.p * 7));
      const r = 2 + blink * 2.5;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 6);
      g.addColorStop(0, `rgba(255, 233, 150, ${0.9 * blink})`);
      g.addColorStop(1, 'rgba(255, 233, 150, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - r * 6, y - r * 6, r * 12, r * 12);
    }
  }
}

interface Fly {
  x: number;
  y: number;
  sx: number;
  sy: number;
  b: number;
  p: number;
}

function makeFlies(): Fly[] {
  return Array.from({ length: 36 }, (_, i) => ({
    x: ((i * 0.6180339) % 1) * 0.96 + 0.02,
    y: 0.55 + ((i * 0.381966) % 1) * 0.4,
    sx: 0.0002 + (i % 5) * 0.00006,
    sy: 0.0003 + (i % 7) * 0.00005,
    b: 0.0016 + (i % 4) * 0.0005,
    p: i * 1.7,
  }));
}

export function Backdrop({
  scene,
  heading,
  sub,
  tall,
  still = false,
}: {
  scene: Scene;
  heading?: string;
  sub?: string;
  /** Takeover openers and bleed blocks are taller. */
  tall?: boolean;
  /** One still frame, no controls: for feed lists, where nothing should move on its own. */
  still?: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const calm = useCalm() || still;
  const [wrap, onScreen] = useInView<HTMLDivElement>({ threshold: 0 });
  const [paused, setPaused] = useState(false);
  const flies = useRef<Fly[]>(makeFlies());
  const running = onScreen && !paused && !calm;

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;
    let frame = 0;
    const start = performance.now() - 40000; // start mid-scene rather than at a blank first frame
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const { width, height } = el.getBoundingClientRect();
      el.width = Math.max(1, Math.round(width * dpr));
      el.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { width, height };
    };
    let dims = size();
    const ro = new ResizeObserver(() => {
      dims = size();
      if (!running) draw(ctx, dims.width, dims.height, scene, 40000, flies.current);
    });
    ro.observe(el);
    if (!running) {
      draw(ctx, dims.width, dims.height, scene, calm ? 40000 : performance.now() - start, flies.current);
      return () => ro.disconnect();
    }
    const tick = (now: number) => {
      draw(ctx, dims.width, dims.height, scene, now - start, flies.current);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, [scene, running, calm]);

  return (
    <div className="lab-backdrop" ref={wrap} data-tall={tall}>
      <canvas ref={canvas} aria-hidden="true" />
      {(heading || sub) && (
        <div className="lab-backdrop-text">
          {heading && <p className="lab-backdrop-heading">{heading}</p>}
          {sub && <p className="lab-backdrop-sub">{sub}</p>}
        </div>
      )}
      {!calm && (
        <button
          type="button"
          className="lab-pause"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? 'Play the animation' : 'Pause the animation'}
        >
          {paused ? '▶' : '❚❚'}
        </button>
      )}
    </div>
  );
}
