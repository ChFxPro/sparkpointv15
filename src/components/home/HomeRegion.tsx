import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { TRANSYLVANIA_TOWNS, WNC_COUNTIES, WNC_VIEWBOX } from '../../data/wncCounties';
import { LitSentence } from './LitSentence';

// Home, then the region, over the pinned county photo. On large screens the
// section pins and scrolling pulls the map back from Transylvania County (its
// towns lit) to the 18 counties of Western North Carolina; then the
// "rooted in connection" sentence takes over the caption column beside the
// finished map, using the end of the pin rather than leaving it idle. On phones and under reduced motion it's
// one still band where pointing at a county names it, with the sentence below.
const HOME = WNC_COUNTIES.find((c) => c.name === 'Transylvania')!;
const OTHERS = WNC_COUNTIES.filter((c) => c.name !== 'Transylvania');
const { width: VW, height: VH } = WNC_VIEWBOX;
const START_H = 190;
const START_BOX = [HOME.cx + 5 - (START_H * VW) / VH / 2, HOME.cy - 8 - START_H / 2, (START_H * VW) / VH, START_H];
const END_BOX = [0, 0, VW, VH];
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const TOWN_LIST = 'Brevard, Rosman, Pisgah Forest, Cedar Mountain, Lake Toxaway, Balsam Grove';

function HomeCopy() {
  return (
    <>
      <h2 className="home-h2 text-white">Home is Transylvania County.</h2>
      <p className="mt-6 max-w-lg text-lg leading-relaxed text-white">
        About 33,000 people in {TOWN_LIST}, and the communities around them. SparkPoint started
        here and answers to its neighbors here.
      </p>
    </>
  );
}

function RegionCopy() {
  return (
    <>
      <h2 className="home-h2 text-white">We work across Western North Carolina.</h2>
      <p className="mt-6 max-w-lg text-lg leading-relaxed text-white">
        What we learn at home, we share with partners across the region, from health systems to
        schools to local government.
      </p>
    </>
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

function RegionMap({ svgRef, zoomable, othersOpacity, townsOpacity, onCaption }: {
  svgRef?: React.Ref<SVGSVGElement>;
  zoomable: boolean;
  othersOpacity?: MotionValue<number>;
  townsOpacity?: MotionValue<number>;
  onCaption?: (c: string | null) => void;
}) {
  return (
    <svg
      ref={svgRef}
      viewBox={(zoomable ? START_BOX : END_BOX).join(' ')}
      className={zoomable ? 'h-full w-full overflow-visible' : 'h-auto w-full'}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Map of the 18 counties of Western North Carolina, with Transylvania County and its towns highlighted"
      onMouseLeave={() => onCaption?.(null)}
    >
      <motion.g style={zoomable ? { opacity: othersOpacity } : undefined}>
        {OTHERS.map((c) => (
          <path
            key={c.fips}
            d={c.d}
            fill="rgba(255,255,255,0.07)"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={1.25}
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            className="transition-[fill] duration-200 hover:fill-white/25"
            onMouseEnter={() => onCaption?.(`${c.name} County`)}
          />
        ))}
      </motion.g>
      <path
        d={HOME.d}
        fill="var(--home-pink)"
        stroke="#fff"
        strokeWidth={2.5}
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        onMouseEnter={() => onCaption?.('Transylvania County: home')}
      />
      <motion.g style={zoomable ? { opacity: townsOpacity } : undefined}>
        {TRANSYLVANIA_TOWNS.map((t) => (
          <g key={t.name} onMouseEnter={() => onCaption?.(`${t.name}, Transylvania County`)}>
            <circle cx={t.x} cy={t.y} r={zoomable ? 2.6 : 5} fill="var(--home-gold)" stroke="var(--home-plum)" strokeWidth={zoomable ? 0.6 : 1.2} />
            {zoomable && (
              <text
                x={t.x}
                y={t.y - 4.5}
                textAnchor="middle"
                fill="#fff"
                style={{ fontSize: 6.8, fontWeight: 700, fontFamily: 'var(--home-display)', paintOrder: 'stroke', stroke: 'rgba(42,20,48,0.7)', strokeWidth: 1.4 }}
              >
                {t.name}
              </text>
            )}
          </g>
        ))}
      </motion.g>
    </svg>
  );
}

function PinnedRegion() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const t = easeInOut(Math.min(1, Math.max(0, (p - 0.06) / 0.4)));
    const box = START_BOX.map((v, i) => v + (END_BOX[i] - v) * t);
    svgRef.current?.setAttribute('viewBox', box.map((n) => n.toFixed(2)).join(' '));
  });

  const othersOpacity = useTransform(scrollYProgress, [0.16, 0.36], [0, 1]);
  const townsOpacity = useTransform(scrollYProgress, [0.12, 0.24], [1, 0]);
  // The two captions hand over with no empty middle: one fades as the other arrives.
  const homeOpacity = useTransform(scrollYProgress, [0.2, 0.27], [1, 0]);
  const homeY = useTransform(scrollYProgress, [0.2, 0.27], [0, -20]);
  // Last beat: the region caption hands over to the sentence, which lights word by word beside the full map.
  const regionOpacity = useTransform(scrollYProgress, [0.25, 0.32, 0.54, 0.6], [0, 1, 1, 0]);
  const regionY = useTransform(scrollYProgress, [0.25, 0.32, 0.54, 0.6], [20, 0, 0, -20]);
  const sentenceOpacity = useTransform(scrollYProgress, [0.58, 0.64], [0, 1]);
  const sentenceY = useTransform(scrollYProgress, [0.58, 0.64], [20, 0]);
  const sentenceProgress = useTransform(scrollYProgress, [0.62, 0.9], [0, 1]);

  return (
    <div ref={sectionRef} style={{ height: '300vh' }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid h-full w-full max-w-7xl grid-cols-[0.8fr_1.2fr] items-center gap-10 px-6">
          <div className="relative min-h-[22rem]">
            <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity: homeOpacity, y: homeY }}>
              <HomeCopy />
            </motion.div>
            <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity: regionOpacity, y: regionY }}>
              <RegionCopy />
            </motion.div>
            <motion.div className="absolute inset-0 flex flex-col justify-center" style={{ opacity: sentenceOpacity, y: sentenceY }}>
              <LitSentence onDark compact progress={sentenceProgress} />
            </motion.div>
          </div>
          <div className="h-[80vh] min-h-0 w-full">
            <RegionMap zoomable svgRef={svgRef} othersOpacity={othersOpacity} townsOpacity={townsOpacity} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StillRegion() {
  const [caption, setCaption] = useState<string | null>(null);
  return (
    <div className="px-6 py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <div className="space-y-12">
          <div><HomeCopy /></div>
          <div><RegionCopy /></div>
        </div>
        <figure>
          <RegionMap zoomable={false} onCaption={setCaption} />
          <figcaption className="mt-3 min-h-[1.75rem] text-base font-semibold text-white" aria-hidden="true">
            {caption ?? 'Transylvania County, inside the 18 counties of Western North Carolina'}
          </figcaption>
        </figure>
      </div>
      <div className="mx-auto mt-20 max-w-7xl md:mt-28">
        <LitSentence onDark />
      </div>
    </div>
  );
}

export function HomeRegion() {
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const reducedMotion = Boolean(systemReducedMotion) || motionPreference === 'reduce';
  const isDesktop = useIsDesktop();

  return (
    <section aria-label="Transylvania County and Western North Carolina" className="relative" style={{ background: 'rgba(24, 12, 28, 0.66)' }}>
      {isDesktop && !reducedMotion ? <PinnedRegion /> : <StillRegion />}
    </section>
  );
}
