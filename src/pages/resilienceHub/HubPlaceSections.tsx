import { useId, useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import todaySmall from '../../assets/hub/hub-today-960.webp';
import todayLarge from '../../assets/hub/hub-today-1800.webp';
import renderingSmall from '../../assets/hub/hub-rendering-960.webp';
import renderingLarge from '../../assets/hub/hub-rendering-1800.webp';
import houseIcon from '../../assets/hub/house-icon.webp';
import './resilienceHub.css';

type RevealProps = { reveal: { duration: number; ease?: 'easeOut' } };

/** The owner's standard disclaimer for hub renderings, with its gold house mark. */
export function RenderingNote({ className = '' }: { className?: string }) {
  return (
    <p className={`rh-render-note ${className}`}>
      <img src={houseIcon} alt="" width={22} height={21} />
      <span>
        <strong>Conceptual rendering</strong> shown for illustrative purposes only. Final
        design, features, and layout are subject to change based on funding availability and
        project development.
      </span>
    </p>
  );
}

// ─── Today → what it becomes ───

export function TransformationSection({ reveal }: RevealProps) {
  const [split, setSplit] = useState(50);
  const sliderId = useId();

  return (
    <section className="rh-band rh-band--night" aria-labelledby="rh-transform-title">
      <div className="rh-wrap">
        <motion.div
          className="rh-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reveal}
        >
          <p className="rh-kicker rh-kicker--dark">94 S. Caldwell Street</p>
          <h2 id="rh-transform-title" className="rh-title">
            A building on Caldwell Street, becoming a community&rsquo;s front porch.
          </h2>
          <p className="rh-lede">
            Drag to compare the building as it stands today with what SparkPoint is working
            toward.
          </p>
        </motion.div>

        <motion.figure
          className="rh-compare"
          style={{ '--split': `${split}%` } as CSSProperties}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={reveal}
        >
          <div className="rh-compare__frame">
            <img
              className="rh-compare__img"
              src={renderingLarge}
              srcSet={`${renderingSmall} 960w, ${renderingLarge} 1800w`}
              sizes="(min-width: 1180px) 1152px, 100vw"
              alt="Conceptual rendering of the building at dusk, with SparkPoint signage, warm lighting, landscaping, and people meeting inside the front window."
              loading="lazy"
              width={1800}
              height={1200}
            />
            <img
              className="rh-compare__img rh-compare__img--today"
              src={todayLarge}
              srcSet={`${todaySmall} 960w, ${todayLarge} 1800w`}
              sizes="(min-width: 1180px) 1152px, 100vw"
              alt="The building at 94 S. Caldwell Street today: a one-story brick office with a chimney, an empty parking lot, and the Blue Ridge behind it."
              loading="lazy"
              width={1800}
              height={1200}
            />
            <span className="rh-compare__tag rh-compare__tag--today" aria-hidden="true">Today</span>
            <span className="rh-compare__tag rh-compare__tag--next" aria-hidden="true">The vision</span>
            <span className="rh-compare__handle" aria-hidden="true" />
            <label htmlFor={sliderId} className="sr-only">
              Compare today&rsquo;s building with the conceptual rendering
            </label>
            <input
              id={sliderId}
              className="rh-compare__range"
              type="range"
              min={0}
              max={100}
              value={split}
              onChange={(event) => setSplit(Number(event.target.value))}
              aria-valuetext={`${split}% today, ${100 - split}% rendering`}
            />
          </div>
          <figcaption>
            <RenderingNote />
          </figcaption>
        </motion.figure>
      </div>
    </section>
  );
}

// ─── The suite, from the architect's plan ───

// Room outlines are traced from ARCA Design sheet A101 ("Sparkpoint
// Alterations", 26030, 2026-06-23, For Permit & Construction), in the
// sheet's own coordinates. Square footage is the architect's, except the studio, which uses
// SparkPoint's 128 sq ft planning figure (the sheet labels it 124). The uses are
// SparkPoint's intended program for each room, not part of the drawings.

type RoomId = 'studio' | 'meeting' | 'conference' | 'reception' | 'offices';

type Room = {
  id: RoomId;
  name: string;
  sf: string;
  use: string;
  shapes: string[];
  /** One label per shape; `short` replaces the name where the room is small. */
  labels: { x: number; y: number; short?: string }[];
};

const ROOMS: Room[] = [
  {
    id: 'meeting',
    name: 'Meeting room',
    sf: '665 sq ft',
    use: 'The big room: workshops, trainings, community gatherings, and convenings.',
    shapes: ['660,350 1285,350 1285,860 660,860'],
    labels: [{ x: 972, y: 605 }],
  },
  {
    id: 'studio',
    name: 'StoryLab studio',
    sf: '128 sq ft',
    use: 'Recording, interviews, and editing, where community stories are captured with care.',
    shapes: ['70,95 455,95 455,250 70,250'],
    labels: [{ x: 262, y: 172 }],
  },
  {
    id: 'conference',
    name: 'Conference room',
    sf: '139 sq ft',
    use: 'Partner coordination, planning sessions, and small-group meetings.',
    shapes: ['655,95 930,95 930,345 655,345'],
    labels: [{ x: 792, y: 220 }],
  },
  {
    id: 'reception',
    name: 'Reception',
    sf: '135 sq ft',
    use: 'The front door: a welcome, a question answered, and a clear next step.',
    shapes: ['70,605 285,605 285,535 455,535 455,755 70,755'],
    labels: [{ x: 262, y: 680 }],
  },
  {
    id: 'offices',
    name: 'Two offices',
    sf: '70 sq ft each',
    use: 'Workspace for SparkPoint staff and visiting partners.',
    shapes: ['70,255 285,255 285,425 70,425', '70,430 285,430 285,600 70,600'],
    labels: [
      { x: 177, y: 338, short: 'Office' },
      { x: 177, y: 513, short: 'Office' },
    ],
  },
];

// Hall, restrooms, and the kitchenette block: drawn for context, not listed.
const SUPPORT_SHAPES = [
  '290,255 645,255 645,425 455,425 455,535 290,535',
  '480,95 645,95 645,320 480,320',
  '485,430 655,430 655,690 485,690',
  '480,695 655,695 655,840 480,840',
];

function SuitePlan({ active, onSelect }: { active: RoomId; onSelect: (id: RoomId) => void }) {
  return (
    <svg
      className="rh-suite"
      viewBox="40 60 1270 830"
      role="img"
      aria-label="Floor plan of the Resilience Hub suite: a large meeting room on the right; the StoryLab studio, two offices, and reception along the left; a conference room at the top; restrooms, a hall, and a kitchenette in between."
    >
      {SUPPORT_SHAPES.map((points) => (
        <polygon key={points} points={points} className="rh-suite__support" />
      ))}
      {ROOMS.map((room) => (
        <g
          key={room.id}
          className={`rh-suite__room${room.id === active ? ' is-active' : ''}${room.id === 'studio' ? ' is-studio' : ''}`}
          onMouseEnter={() => onSelect(room.id)}
          onClick={() => onSelect(room.id)}
        >
          {room.shapes.map((points) => (
            <polygon key={points} points={points} />
          ))}
          {room.labels.map((label) => (
            <g key={`${label.x},${label.y}`} aria-hidden="true">
              <text x={label.x} y={label.y} textAnchor="middle">
                {label.short ?? room.name}
              </text>
              <text x={label.x} y={label.y + 32} textAnchor="middle" className="rh-suite__sf">
                {label.short ? room.sf.replace(' each', '') : room.sf}
              </text>
            </g>
          ))}
        </g>
      ))}
      {/* Front entrance, off the new sidewalk */}
      <g className="rh-suite__entry" aria-hidden="true">
        <path d="M250 812 L250 768 M236 784 L250 768 L264 784" />
        <text x="250" y="846" textAnchor="middle">Entrance</text>
      </g>
    </svg>
  );
}

export function SuitePlanSection({ reveal }: RevealProps) {
  const [active, setActive] = useState<RoomId>('studio');
  const activeRoom = ROOMS.find((room) => room.id === active) ?? ROOMS[1];

  return (
    <section className="rh-band rh-band--paper" aria-labelledby="rh-suite-title">
      <div className="rh-wrap">
        <motion.div
          className="rh-head"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={reveal}
        >
          <p className="rh-kicker rh-kicker--light">Inside the hub</p>
          <h2 id="rh-suite-title" className="rh-title rh-title--ink">
            One suite, built for gathering, coordinating, and listening.
          </h2>
          <p className="rh-lede rh-lede--ink">
            Drawn from the architect&rsquo;s permit plans. Choose a room to see what it&rsquo;s for.
          </p>
        </motion.div>

        <div className="rh-suite-layout">
          <motion.figure
            className="rh-suite-figure"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={reveal}
          >
            <SuitePlan active={active} onSelect={setActive} />
            <figcaption>
              Simplified from ARCA Design&rsquo;s permit set (sheet A101, June 2026). Restrooms, hall,
              and kitchenette shown in gray.
            </figcaption>
          </motion.figure>

          <div className="rh-rooms">
            <div className="rh-rooms__list" role="group" aria-label="Rooms">
              {ROOMS.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  className={`rh-rooms__item${room.id === active ? ' is-active' : ''}`}
                  aria-pressed={room.id === active}
                  onClick={() => setActive(room.id)}
                  onMouseEnter={() => setActive(room.id)}
                  onFocus={() => setActive(room.id)}
                >
                  <span className="rh-rooms__name">{room.name}</span>
                  <span className="rh-rooms__sf">{room.sf}</span>
                </button>
              ))}
            </div>
            <div className="rh-rooms__detail" aria-live="polite">
              <p className="rh-rooms__detail-name">
                {activeRoom.name} <span>{activeRoom.sf}</span>
              </p>
              <p>{activeRoom.use}</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
