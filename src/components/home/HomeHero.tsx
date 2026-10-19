import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { ArrowDown, Pause, Play } from 'lucide-react';
import { conveningPhotoUrl } from '../../lib/conveningPhotos';
import { useAccessibility } from '../../context/AccessibilityContext';
import { PhotoViewer, type ViewerPhoto } from './PhotoViewer';
import { GATHERINGS } from './gatherings';

// Faces from SparkPoint gatherings (the October 1 convening and others) drift past in three columns (one sliding
// row on phones). Any photo opens full size with its caption. Each column
// repeats its list once and moves by exactly half its height, so the loop is
// seamless; spacing is padding on every tile (not flex gap) for the same reason.
type WallPhoto = ViewerPhoto & { ratio: string };

const WALL: WallPhoto[][] = [
  [
    { id: '225', ratio: '4 / 5', caption: 'Cheek to cheek under the pavilion.', alt: 'Two friends cheek to cheek, laughing and pointing at the camera under the pavilion' },
    { id: 'g-connectors-circle', ratio: '1 / 1', caption: 'Listening in a Community Connectors circle.', alt: 'A Community Connectors participant speaks with neighbors in a listening circle', ...GATHERINGS.connectorsCircle },
    { id: '43', ratio: '4 / 5', caption: 'Connection to Action card in hand.', alt: 'Two attendees smile side by side, holding a Connection to Action card' },
    { id: 'g-students', ratio: '1 / 1', caption: 'Students set the agenda.', alt: 'Four students smile beside a whiteboard covered in their ideas', ...GATHERINGS.students },
    { id: '146', ratio: '4 / 5', caption: 'A quiet corner and a good laugh.', alt: 'Two women sit together against a white wall, laughing' },
    { id: 'g-quilt', ratio: '1 / 1', caption: 'Adding to the community quilt.', alt: 'A child in a knit hat draws on a fabric quilt panel at a community gathering', ...GATHERINGS.quilt },
  ],
  [
    { id: '18', ratio: '1 / 1', caption: 'Between sessions, by the SparkPoint banner.', alt: 'An attendee in glasses laughs mid-conversation in front of a SparkPoint banner' },
    { id: 'g-helene-music', ratio: '4 / 5', caption: 'Music on the One Year of Healing stage.', alt: 'A musician plays keyboard on stage in front of the Helene: One Year of Healing banner', ...GATHERINGS.heleneMusic },
    { id: '03', ratio: '1 / 1', caption: 'Across the table, listening.', alt: 'Two attendees deep in conversation across a round table' },
    { id: 'g-mural', ratio: '4 / 5', caption: 'Recording a story by the mural.', alt: 'A storyteller is interviewed on camera outdoors in front of a painted mural', ...GATHERINGS.mural },
    { id: '135', ratio: '1 / 1', caption: 'Talking it through across the table.', alt: 'Two attendees talk across a table, one in a bright green jacket' },
    { id: 'g-sparkpurpose', ratio: '4 / 5', caption: 'Next steps in hand after a SparkPurpose workshop.', alt: 'A group holds up their written next steps after a SparkPurpose workshop', ...GATHERINGS.sparkpurpose },
  ],
  [
    { id: '142', ratio: '4 / 5', caption: 'A laugh between sessions.', alt: 'Three attendees laugh together in a circle' },
    { id: 'g-brain-health', ratio: '1 / 1', caption: 'Questions for the panel.', alt: 'Panelists seated on stage take questions during a community brain health talk', ...GATHERINGS.brainHealth },
    { id: '25', ratio: '4 / 5', caption: 'Three heads over one tablet.', alt: 'Three attendees lean over a tablet together' },
    { id: 'g-connectors-table', ratio: '1 / 1', caption: 'Around the table with Community Connectors.', alt: 'Community Connectors participants talk around a table during a facilitated session', ...GATHERINGS.connectorsTable },
    { id: '77', ratio: '4 / 5', caption: 'A smile during the morning program.', alt: 'An attendee smiles across her table during the morning program' },
    { id: '21', ratio: '1 / 1', caption: 'Deep in conversation.', alt: 'An attendee smiles in conversation' },
  ],
];

const ALL: WallPhoto[] = WALL.flat();
const indexOf = (id: string) => ALL.findIndex((p) => p.id === id);

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

function Tile({ photo, duplicate, eager, onOpen, className = '' }: {
  photo: WallPhoto;
  duplicate: boolean;
  eager: boolean;
  onOpen: (i: number) => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(indexOf(photo.id))}
      // The second copy of each list exists only to make the loop seamless.
      aria-hidden={duplicate || undefined}
      tabIndex={duplicate ? -1 : undefined}
      aria-label={duplicate ? undefined : `Open photo: ${photo.caption}`}
      className={`home-tile group relative block w-full text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--home-gold)] ${className}`}
      style={{ aspectRatio: photo.ratio }}
    >
      <img src={photo.src ?? conveningPhotoUrl(photo.id)} alt="" width={960} height={640} loading={eager ? 'eager' : 'lazy'} decoding="async" />
    </button>
  );
}

export function HomeHero() {
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const reducedMotion = Boolean(systemReducedMotion) || motionPreference === 'reduce';
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  // Only one of the wall (desktop) or ribbon (phones) is rendered, so neither
  // downloads the other's photos.
  const isDesktop = useIsDesktop();
  const ribbon = [...WALL[0].slice(0, 3), ...WALL[1].slice(0, 3), ...WALL[2].slice(0, 3)];

  const pauseButton = !reducedMotion && (
    <button
      type="button"
      onClick={() => setPaused((p) => !p)}
      className="absolute z-20 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-black/50 px-4 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-black/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      style={isDesktop ? { top: '6.5rem', right: '1rem' } : { top: '-3.25rem', right: '1.25rem' }}
      aria-pressed={paused}
    >
      {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      {paused ? 'Play photos' : 'Pause photos'}
    </button>
  );

  return (
    <section className="home-hero relative isolate overflow-hidden text-white" aria-labelledby="home-hero-heading">
      <div className="mx-auto grid max-w-[90rem] items-center gap-6 px-6 pb-36 pt-24 grid-cols-[minmax(0,1fr)] lg:min-h-[100svh] lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:pb-0 lg:pt-20">
        {/* Words */}
        <div className="relative z-10 max-w-3xl lg:py-24 lg:pb-44">
          <h1 id="home-hero-heading" className="home-display" style={{ fontSize: 'clamp(2.6rem, 4.8vw, 5.25rem)' }}>
            <span className="home-rise"><span style={{ ['--i' as string]: 0 }}>Good things happen</span></span>
            <span className="home-rise"><span style={{ ['--i' as string]: 1 }}>when we&rsquo;re in</span></span>
            <span className="home-rise">
              <span style={{ ['--i' as string]: 2, color: 'var(--home-gold)' }}>the same room.</span>
            </span>
          </h1>

          <p className="home-fade-up mt-6 max-w-xl text-lg leading-relaxed text-white/90 md:text-xl lg:mt-8" style={{ ['--d' as string]: '450ms' }}>
            SparkPoint is rooted in Transylvania County and works across Western North Carolina,
            bringing neighbors, organizations, schools, and local government together.
          </p>

          <div className="home-fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 lg:mt-10" style={{ ['--d' as string]: '600ms' }}>
            <a href="#doors" className="home-btn home-btn-pink">
              Get involved <ArrowDown size={18} aria-hidden="true" />
            </a>
            <a href="/donations" className="home-btn home-btn-ghost">
              Donate
            </a>
          </div>
        </div>

        {/* Faces: three drifting columns on large screens */}
        {isDesktop && (
          <div className="relative h-[100svh]" role="group" aria-label="Photos from SparkPoint gatherings">
            <div className="home-wall grid h-full grid-cols-3 gap-4 overflow-hidden" data-paused={paused ? 'true' : 'false'}>
              {WALL.map((column, c) => (
                <div
                  key={c}
                  className="home-wall-col flex flex-col"
                  data-dir={c === 1 ? 'down' : 'up'}
                  // Negative delays stagger the columns without padding, which would
                  // throw off the -50% loop and make the restart jump.
                  style={{ ['--dur' as string]: `${[72, 86, 64][c]}s`, animationDelay: `${[-8, -40, -22][c]}s` }}
                >
                  {[...column, ...column].map((photo, i) => (
                    <div key={`${photo.id}-${i}`} className="pb-4">
                      <Tile photo={photo} duplicate={i >= column.length} eager={i < 2} onOpen={setOpen} />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {pauseButton}
          </div>
        )}

        {/* Faces: one sliding row above the words on phones and tablets */}
        {!isDesktop && (
          <div className="relative -mx-6 order-first mt-14 min-w-0" role="group" aria-label="Photos from SparkPoint gatherings">
            <div className="home-ribbon overflow-hidden" data-paused={paused ? 'true' : 'false'}>
              <div className="home-ribbon-row flex w-max" data-dir="left" style={{ ['--dur' as string]: '60s' }}>
                {[...ribbon, ...ribbon].map((photo, i) => (
                  <div key={`${photo.id}-${i}`} className="w-32 pr-3 sm:w-44">
                    <Tile photo={{ ...photo, ratio: '4 / 5' }} duplicate={i >= ribbon.length} eager={i < 3} onOpen={setOpen} />
                  </div>
                ))}
              </div>
            </div>
            {pauseButton}
          </div>
        )}
      </div>

      {open !== null && <PhotoViewer photos={ALL} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}
