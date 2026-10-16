import { useEffect, useRef, useState } from 'react';
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import { useAccessibility } from '../../context/AccessibilityContext';

// One dot per `perDot` attendances. Dots light up in a scattered (but fixed)
// order as the field scrolls through the viewport, like a room filling in.
// Decorative: the number it pictures is printed beside it as text.
const CELL = 15;
const RADIUS = 4.4;

// rank[i] = when dot i lights up; dot i is lit once `filled` passes it.
function seededRank(n: number) {
  const order = Array.from({ length: n }, (_, i) => i);
  let seed = 20261001;
  for (let i = n - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    const j = seed % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  const rank = new Array<number>(n);
  order.forEach((dot, position) => {
    rank[dot] = position;
  });
  return rank;
}

export function DotField({ total, perDot = 10 }: { total: number; perDot?: number }) {
  const count = Math.round(total / perDot);
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rankRef = useRef<number[]>(seededRank(count));
  const filledRef = useRef(0);
  const [height, setHeight] = useState(0);
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const reducedMotion = Boolean(systemReducedMotion) || motionPreference === 'reduce';

  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start 0.95', 'end 0.55'] });

  const draw = (filled: number) => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const width = wrap.clientWidth;
    const cols = Math.max(1, Math.floor(width / CELL));
    const rows = Math.ceil(count / cols);
    const h = rows * CELL;
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${h}px`;
      setHeight(h);
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, h);
    const rank = rankRef.current;
    for (let i = 0; i < count; i++) {
      const x = (i % cols) * CELL + CELL / 2;
      const y = Math.floor(i / cols) * CELL + CELL / 2;
      ctx.beginPath();
      ctx.arc(x, y, RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = rank[i] < filled ? '#FDB515' : 'rgba(255,255,255,0.13)';
      ctx.fill();
    }
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const initial = reducedMotion ? count : Math.round(scrollYProgress.get() * count);
    filledRef.current = initial;
    draw(initial);
    const ro = new ResizeObserver(() => draw(filledRef.current));
    ro.observe(wrap);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, count]);

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    if (reducedMotion) return;
    const filled = Math.round(Math.min(1, Math.max(0, p)) * count);
    if (filled === filledRef.current) return;
    filledRef.current = filled;
    draw(filled);
  });

  return (
    <div ref={wrapRef} aria-hidden="true" style={{ minHeight: height || undefined }}>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
