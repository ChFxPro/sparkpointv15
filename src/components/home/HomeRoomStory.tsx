import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { CONVENING_PHOTO_CREDIT, conveningPhotoSrcSet, conveningPhotoUrl } from '../../lib/conveningPhotos';

// A photo story of the October 1 convening. On large screens the section pins
// and the filmstrip pans sideways as you scroll; on phones, and under reduced
// motion, it's a plain swipeable row.
type Frame = { id: string; caption: string; alt: string; shape: 'tall' | 'wide' | 'square'; position?: string };

const FRAMES: Frame[] = [
  { id: '01', shape: 'wide', caption: 'Every table taken in the barn.', alt: 'A wide view of the barn at Deerwoode Reserve, every round table filled beneath rows of chandeliers' },
  { id: '05', shape: 'tall', caption: 'Story cards in hand: each one a real family’s path through care.', alt: 'Four attendees read printed story cards together at a simulator station', position: '50% 40%' },
  { id: '08', shape: 'square', caption: 'Small groups walked one family’s story through the Rural Health Field Simulator.', alt: 'Four attendees crowd around a tablet, talking through a simulator scenario together' },
  { id: '177', shape: 'wide', caption: 'Then the whole run on one screen: every door, delay, and handoff.', alt: 'A presenter points to a large projected map of one family’s path through the health system' },
  { id: '10', shape: 'tall', caption: 'Circles under the pavilion and around the fire ring.', alt: 'A circle of attendees in blue Adirondack chairs around a stone fire ring beside a log cabin', position: '40% 50%' },
  { id: '258', shape: 'square', caption: 'Commitments, posted to the Connection to Action wall.', alt: 'An attendee pins a card to a window covered in Connection to Action cards' },
  { id: '86', shape: 'tall', caption: 'A hug between sessions.', alt: 'Two attendees hug between sessions', position: '45% 40%' },
];

const SHAPE_CLASS: Record<Frame['shape'], string> = {
  tall: 'w-[min(22rem,70vw)] aspect-[4/5]',
  wide: 'w-[min(40rem,86vw)] aspect-[3/2]',
  square: 'w-[min(26rem,78vw)] aspect-square',
};

function FrameFigure({ frame }: { frame: Frame }) {
  return (
    <figure className={`home-room-frame flex-none ${frame.shape === 'tall' ? 'self-end' : frame.shape === 'square' ? 'self-center' : 'self-start'}`}>
      <div className={`overflow-hidden rounded-2xl bg-[var(--home-pink-deep)] ${SHAPE_CLASS[frame.shape]}`}>
        <img
          src={conveningPhotoUrl(frame.id)}
          srcSet={conveningPhotoSrcSet(frame.id)}
          sizes={frame.shape === 'wide' ? '(min-width: 1024px) 40rem, 60vw' : '(min-width: 1024px) 26rem, 50vw'}
          alt={frame.alt}
          width={960}
          height={640}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
          style={{ objectPosition: frame.position }}
        />
      </div>
      <figcaption className="mt-4 max-w-[22rem] text-base font-semibold leading-snug text-white md:text-lg">{frame.caption}</figcaption>
    </figure>
  );
}

function Intro() {
  return (
    <div className="flex w-[min(30rem,86vw)] flex-none flex-col justify-center self-stretch">
      <h2 id="home-room-heading" className="home-h2 text-white">
        October 1: a full house at Deerwoode Reserve
      </h2>
      <p className="mt-6 text-lg leading-relaxed text-white">
        Rural health leaders from across Western North Carolina spent the day in Brevard at the 2026
        WNC Regional Rural Health Convening, hosted by SparkPoint.
      </p>
    </div>
  );
}

function Outro() {
  return (
    <div className="flex w-[min(24rem,80vw)] flex-none flex-col justify-center self-stretch">

      <Link
        to="/rural-health-convening"
        className="home-btn home-btn-white w-fit"
      >
        See the convening recap
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
      <p className="mt-6 text-sm text-white">{CONVENING_PHOTO_CREDIT}</p>
    </div>
  );
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = () => setIsDesktop(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return isDesktop;
}

// A frame in the pinned strip responds to where it sits on screen: it scales
// up and straightens as it reaches the middle, tilts and dips toward the edges,
// the photo inside pans the other way, and its caption fades in near centre.
function PinnedFrame({ frame, index, x }: { frame: Frame; index: number; x: MotionValue<number> }) {
  const ref = useRef<HTMLElement>(null);
  const [geom, setGeom] = useState({ center: 0, vw: 1440 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setGeom({ center: el.offsetLeft + el.offsetWidth / 2, vw: window.innerWidth });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // -1 (far left) ... 0 (centre) ... 1 (far right)
  const pos = useTransform(x, (v) => Math.max(-1, Math.min(1, (geom.center + v - geom.vw / 2) / (geom.vw * 0.62))));
  const tilt = index % 2 === 0 ? 1 : -1;
  const scale = useTransform(pos, [-1, 0, 1], [0.84, 1, 0.84]);
  const rotate = useTransform(pos, [-1, 0, 1], [-5 * tilt, 0, 5 * tilt]);
  const y = useTransform(pos, [-1, 0, 1], [70 * tilt, 0, -50 * tilt]);
  const imgX = useTransform(pos, [-1, 1], ['7%', '-7%']);
  const captionOpacity = useTransform(pos, [-0.7, -0.2, 0.2, 0.7], [0, 1, 1, 0]);
  const captionY = useTransform(pos, [-0.7, -0.2, 0.2, 0.7], [16, 0, 0, -10]);

  return (
    <motion.figure
      ref={ref}
      className={`flex-none ${frame.shape === 'tall' ? 'self-end' : frame.shape === 'square' ? 'self-center' : 'self-start'}`}
      style={{ scale, rotate, y }}
    >
      <div className={`relative overflow-hidden rounded-2xl bg-[var(--home-pink-deep)] shadow-[0_30px_60px_-30px_rgba(42,20,48,0.6)] ${SHAPE_CLASS[frame.shape]}`}>
        <motion.img
          src={conveningPhotoUrl(frame.id)}
          srcSet={conveningPhotoSrcSet(frame.id)}
          sizes={frame.shape === 'wide' ? '40rem' : '26rem'}
          alt={frame.alt}
          width={960}
          height={640}
          loading={index < 3 ? 'eager' : 'lazy'}
          decoding="async"
          className="absolute inset-0 h-full w-full scale-[1.18] object-cover"
          style={{ objectPosition: frame.position, x: imgX }}
        />
      </div>
      <motion.figcaption
        className="mt-5 max-w-[22rem] text-lg font-semibold leading-snug text-white"
        style={{ opacity: captionOpacity, y: captionY }}
      >
        {frame.caption}
      </motion.figcaption>
    </motion.figure>
  );
}

function PinnedStrip() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [current, setCurrent] = useState(0);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  // A spring between the scrollbar and the strip: it glides, eases in and
  // out, and settles a beat after you stop, instead of tracking 1:1.
  const progress = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.6, restDelta: 0.0005 });
  const x = useTransform(progress, [0, 1], [0, -distance]);
  const backdropX = useTransform(progress, [0, 1], ['4%', '-38%']);
  const barScale = useTransform(progress, [0, 1], [0, 1]);

  useMotionValueEvent(progress, 'change', (p) => {
    const i = Math.min(FRAMES.length - 1, Math.max(0, Math.round(p * (FRAMES.length + 1) - 1)));
    setCurrent((c) => (c === i ? c : i));
  });

  return (
    <div ref={sectionRef} style={{ height: `calc(100vh + ${Math.round(distance * 1.35)}px)` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* Slow, faint place name behind the strip for depth. */}
        <motion.p
          aria-hidden="true"
          className="home-display pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[var(--home-plum)] opacity-[0.12]"
          style={{ x: backdropX, fontSize: 'clamp(9rem, 22vw, 20rem)' }}
        >
          Deerwoode Reserve
        </motion.p>

        <motion.div
          ref={trackRef}
          className="relative flex h-[76vh] max-h-[46rem] items-stretch gap-14 pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-[14vw]"
          style={{ x }}
        >
          <Intro />
          {FRAMES.map((frame, i) => (
            <PinnedFrame key={frame.id} frame={frame} index={i} x={x} />
          ))}
          <Outro />
        </motion.div>

        {/* Where you are in the story. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 mx-auto flex max-w-7xl items-center gap-4 px-6" aria-hidden="true">
          <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
            <motion.div className="h-full origin-left rounded-full bg-white" style={{ scaleX: barScale }} />
          </div>
          <span className="w-16 text-right text-sm font-bold tabular-nums text-white">
            {current + 1} of {FRAMES.length}
          </span>
        </div>
      </div>
    </div>
  );
}

function SwipeStrip() {
  return (
    <div className="py-16 md:py-20">
      <div className="px-6">
        <Intro />
      </div>
      <div className="home-room-scroller mt-10 flex scroll-px-6 gap-5 overflow-x-auto px-6 pb-4" tabIndex={0} aria-label="Convening photos, scroll sideways">
        {FRAMES.map((frame) => (
          <FrameFigure key={frame.id} frame={frame} />
        ))}
      </div>
      <div className="px-6 pt-6">
        <Outro />
      </div>
    </div>
  );
}

export function HomeRoomStory() {
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const reducedMotion = Boolean(systemReducedMotion) || motionPreference === 'reduce';
  const isDesktop = useIsDesktop();

  return (
    <section className="home-room relative" aria-labelledby="home-room-heading">
      {isDesktop && !reducedMotion ? <PinnedStrip /> : <SwipeStrip />}
    </section>
  );
}
