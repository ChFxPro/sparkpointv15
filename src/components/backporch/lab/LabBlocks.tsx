// Porch Lab tools: animated text, count-up numbers, before & after, scrolly story,
// timeline, quick poll, and porch reactions. Each one works with a keyboard and a
// screen reader, and under reduced motion shows its finished state with no motion.
import { useEffect, useRef, useState } from 'react';
import { porchImageSrcSet, porchImageUrl, porchRpc } from '../../../lib/backporch';
import type { CounterItem, MediaRef, ScrollyStep, TimelineItem } from '../../../lib/porchBlocks';
import { remember, useCalm, useInView, voterToken } from './hooks';

function Img({ img, sizes, className }: { img: MediaRef; sizes: string; className?: string }) {
  return (
    <img
      className={className}
      src={porchImageUrl(img.path, 1600) ?? ''}
      srcSet={porchImageSrcSet(img.path)}
      sizes={sizes}
      alt={img.alt}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
}

// ── Animated text ────────────────────────────────────────────────────────
export function MotionText({ text, effect, size }: { text: string; effect: 'type' | 'light'; size: 'large' | 'huge' }) {
  const calm = useCalm();
  const [ref, seen] = useInView<HTMLDivElement>({ once: effect === 'type', threshold: 0.4 });
  const [shown, setShown] = useState(calm ? text.length : 0);
  const [lit, setLit] = useState(calm ? 1 : 0);
  const words = text.split(/(\s+)/);

  // Typewriter: once on screen, letters arrive over about two seconds.
  useEffect(() => {
    if (effect !== 'type' || calm) return setShown(text.length);
    if (!seen) return;
    let i = 0;
    const step = Math.max(1, Math.round(text.length / 70));
    const id = window.setInterval(() => {
      i += step;
      setShown(Math.min(text.length, i));
      if (i >= text.length) window.clearInterval(id);
    }, 28);
    return () => window.clearInterval(id);
  }, [effect, seen, calm, text]);

  // Scroll-lit: words brighten as the line travels up the screen.
  useEffect(() => {
    if (effect !== 'light' || calm) return setLit(1);
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      setLit(Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.55))));
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [effect, calm, ref]);

  const wordCount = words.filter((w) => w.trim()).length;
  let wordIndex = 0;
  return (
    <div ref={ref} className="lab-motion" data-size={size}>
      <p className="sr-only">{text}</p>
      <p aria-hidden="true">
        {effect === 'type' ? (
          <>
            {text.slice(0, shown)}
            {shown < text.length && <span className="lab-caret" />}
            {/* The untyped rest holds its space, so the line never reflows as it types. */}
            <span className="lab-motion-rest">{text.slice(shown)}</span>
          </>
        ) : (
          words.map((w, i) => {
            if (!w.trim()) return w;
            const on = wordIndex++ / Math.max(1, wordCount) < lit;
            return (
              <span key={i} className="lab-word" data-on={on}>
                {w}
              </span>
            );
          })
        )}
      </p>
    </div>
  );
}

// ── Count-up numbers ─────────────────────────────────────────────────────
export function Counter({ items }: { items: CounterItem[] }) {
  const calm = useCalm();
  const [ref, seen] = useInView<HTMLDListElement>({ once: true, threshold: 0.4 });
  const [p, setP] = useState(calm ? 1 : 0);
  useEffect(() => {
    if (calm) return setP(1);
    if (!seen) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1400);
      setP(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [seen, calm]);
  return (
    <dl ref={ref} className="lab-counter" data-count={items.length}>
      {items.map((item, i) => {
        const decimals = Math.abs(item.value % 1) > 0 ? 1 : 0;
        const shown = (item.value * p).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
        const final = item.value.toLocaleString('en-US');
        return (
          <div key={i}>
            <dt>{item.label}</dt>
            <dd>
              <span aria-hidden="true">
                {item.prefix}
                {shown}
                {item.suffix}
              </span>
              <span className="sr-only">
                {item.prefix}
                {final}
                {item.suffix}
              </span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}

// ── Before & after ───────────────────────────────────────────────────────
export function BeforeAfter({
  before,
  after,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: {
  before: MediaRef;
  after: MediaRef;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const drag = (clientX: number) => {
    const r = box.current?.getBoundingClientRect();
    if (r) setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  return (
    <figure className="lab-ba">
      <div
        className="lab-ba-frame"
        ref={box}
        onPointerDown={(e) => {
          (e.target as Element).setPointerCapture?.(e.pointerId);
          drag(e.clientX);
        }}
        onPointerMove={(e) => {
          if (e.buttons) drag(e.clientX);
        }}
      >
        <Img img={after} sizes="(min-width: 900px) 64rem, 100vw" className="lab-ba-img" />
        <div className="lab-ba-before" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Img img={before} sizes="(min-width: 900px) 64rem, 100vw" className="lab-ba-img" />
        </div>
        <span className="lab-ba-tag lab-ba-tag-before" aria-hidden="true">{beforeLabel}</span>
        <span className="lab-ba-tag lab-ba-tag-after" aria-hidden="true">{afterLabel}</span>
        <div className="lab-ba-handle" style={{ left: `${pos}%` }} aria-hidden="true">
          <span>‹ ›</span>
        </div>
        <input
          className="lab-ba-range"
          type="range"
          min={0}
          max={100}
          step={1}
          value={Math.round(pos)}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare ${beforeLabel.toLowerCase()} and ${afterLabel.toLowerCase()}`}
          aria-valuetext={`${Math.round(pos)}% ${beforeLabel.toLowerCase()}`}
        />
      </div>
      <figcaption>
        {beforeLabel}: {before.alt} {afterLabel}: {after.alt}
      </figcaption>
    </figure>
  );
}

// ── Scrolly story ────────────────────────────────────────────────────────
export function Scrolly({ steps }: { steps: ScrollyStep[] }) {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step));
        }
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);
  return (
    <div className="lab-scrolly">
      <div className="lab-scrolly-stage" aria-hidden="true">
        {steps.map((s, i) => (
          <Img key={i} img={s.image} sizes="(min-width: 900px) 50vw, 100vw" className={i === active ? 'is-on' : ''} />
        ))}
      </div>
      <ol className="lab-scrolly-steps">
        {steps.map((s, i) => (
          <li key={i} data-step={i} ref={(el) => (stepRefs.current[i] = el)} data-on={i === active}>
            <p>{s.text}</p>
            <span className="sr-only">Photo: {s.image.alt}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── Timeline ─────────────────────────────────────────────────────────────
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="lab-timeline">
      {items.map((item, i) => (
        <li key={i}>
          <span className="lab-timeline-date">{item.date}</span>
          <div>
            <strong>{item.title}</strong>
            {item.text && <p>{item.text}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

// ── Quick poll ───────────────────────────────────────────────────────────
export function Poll({ postId, blockId, question, options, live }: { postId: string; blockId: string; question: string; options: string[]; live: boolean }) {
  const key = `porch-poll:${postId}:${blockId}`;
  const [mine, setMine] = useState<number | null>(() => {
    const v = remember(key);
    return v === null ? null : Number(v);
  });
  const [counts, setCounts] = useState<number[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState<string | null>(null);

  const load = async () => {
    const { data, error } = await porchRpc<{ option_index: number; votes: number }[]>('porch_poll_results', { p_post: postId, p_block: blockId });
    if (error) return;
    const next = options.map(() => 0);
    for (const row of (data ?? []) as { option_index: number; votes: number }[]) {
      if (row.option_index < next.length) next[row.option_index] = Number(row.votes);
    }
    setCounts(next);
  };

  useEffect(() => {
    if (live && mine !== null) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, mine]);

  const vote = async (i: number) => {
    setBusy(true);
    setProblem(null);
    const { data, error } = await porchRpc<boolean>('porch_vote', { p_post: postId, p_block: blockId, p_option: i, p_voter: voterToken() });
    setBusy(false);
    if (error || data !== true) {
      setProblem("Your vote didn't go through. Try again in a moment.");
      return;
    }
    remember(key, String(i));
    setMine(i);
  };

  const total = counts?.reduce((a, b) => a + b, 0) ?? 0;
  return (
    <fieldset className="lab-poll" disabled={!live || busy}>
      <legend>{question}</legend>
      {mine === null ? (
        <div className="lab-poll-options">
          {options.map((o, i) => (
            <button key={i} type="button" onClick={() => void vote(i)}>
              {o}
            </button>
          ))}
        </div>
      ) : (
        <ul className="lab-poll-results" aria-live="polite">
          {options.map((o, i) => {
            const n = counts?.[i] ?? 0;
            const pct = total ? Math.round((n / total) * 100) : 0;
            return (
              <li key={i} data-mine={i === mine}>
                <span className="lab-poll-bar" style={{ width: `${pct}%` }} aria-hidden="true" />
                <span>{o}{i === mine ? ' (your pick)' : ''}</span>
                <strong>{counts ? `${pct}%` : '…'}</strong>
              </li>
            );
          })}
        </ul>
      )}
      <p className="lab-poll-note">
        {!live
          ? 'Voting opens when this post is published.'
          : mine === null
            ? 'Anonymous. One vote per browser. An informal poll, not a survey.'
            : `${total} ${total === 1 ? 'vote' : 'votes'} so far. Anonymous.`}
      </p>
      {problem && <p className="lab-poll-note" role="alert">{problem}</p>}
    </fieldset>
  );
}

// ── Porch reactions (post-level) ─────────────────────────────────────────
const REACTIONS = [
  { id: 'chair', label: 'Pulled up a chair', icon: '🪑' },
  { id: 'lantern', label: 'Lit a lantern', icon: '🏮' },
  { id: 'wave', label: 'Waved hello', icon: '👋' },
  { id: 'thanks', label: 'Thank you', icon: '🙏' },
] as const;

export function Reactions({ postId, live }: { postId: string; live: boolean }) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [mine, setMine] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(REACTIONS.map((r) => [r.id, remember(`porch-react:${postId}:${r.id}`) === '1'])),
  );

  useEffect(() => {
    if (!live) return;
    void porchRpc<{ reaction: string; total: number }[]>('porch_reaction_counts', { p_post: postId }).then(({ data }) => {
      const next: Record<string, number> = {};
      for (const row of (data ?? []) as { reaction: string; total: number }[]) next[row.reaction] = Number(row.total);
      setCounts(next);
    });
  }, [postId, live]);

  const react = async (id: string) => {
    if (mine[id] || !live) return;
    setMine((m) => ({ ...m, [id]: true }));
    setCounts((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
    remember(`porch-react:${postId}:${id}`, '1');
    const { data, error } = await porchRpc<boolean>('porch_react', { p_post: postId, p_reaction: id, p_voter: voterToken() });
    if (error || data !== true) {
      setMine((m) => ({ ...m, [id]: false }));
      setCounts((c) => ({ ...c, [id]: Math.max(0, (c[id] ?? 1) - 1) }));
    }
  };

  return (
    <div className="lab-reactions" role="group" aria-label="Porch reactions">
      {REACTIONS.map((r) => (
        <button key={r.id} type="button" onClick={() => void react(r.id)} aria-pressed={mine[r.id]} disabled={!live}>
          <span aria-hidden="true">{r.icon}</span>
          {r.label}
          {counts[r.id] ? <small>{counts[r.id]}</small> : null}
        </button>
      ))}
    </div>
  );
}
