import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';

// Photo recap for the 2026 WNC Regional Rural Health Convening (October 1, 2026),
// drawn as a connection web in the style of the page's Connection Map: the regional
// briefing is the hub, the photos gather around three "doors", and a few dashed
// handoffs cross between them. The map shows at every width: below 900px the field
// card drops under it, and on narrow phones the map keeps a minimum width inside a
// sideways-scrolling frame (opened centered on the briefing) so every photo stays
// tappable. Owner asked for the map everywhere rather than per-door photo strips.
//
// Files: each photo `id` has three WebP sizes in public/assets/Rural Health/recap/ —
// `<id>-400` (web nodes), `<id>-800` (field card, strips), `<id>-1600` (lightbox) —
// all 1600 px wide at full size; `height` is the 1600-wide height.
//
// Web layout: `x`, `y`, `r` are in WEB_WIDTH × WEB_HEIGHT units (node center and
// radius). Keep 14 units of clear space between circles, and keep each door label's
// box clear of every circle at the narrowest side-by-side map (~700 px wide, where a
// label is ~1.4 units per px). The layout was checked for both when it was drawn, so
// re-check if you move or add nodes or rename a door.
//
// Copy: `title` and `note` are the visible caption, written in the page's voice;
// `alt` describes the scene for screen readers. Only program speakers are named.
// The tablet-and-handout shots are the Rural Health Field Simulator in use
// (confirmed by the owner), which is why they sit under "Walking the system".

const BASE = import.meta.env.BASE_URL;
const PHOTO_WIDTH = 1600;
const WEB_WIDTH = 1000;
const WEB_HEIGHT = 680;
const HUB = { x: 500, y: 330 };

type ClusterId = 'briefing' | 'grounds' | 'system' | 'room';

type Cluster = {
  id: ClusterId;
  title: string;
  note: string;
  door?: { x: number; y: number };
};

type RecapPhoto = {
  id: string;
  cluster: ClusterId;
  height: number;
  title: string;
  note: string;
  alt: string;
  x: number;
  y: number;
  r: number;
  /** object-position for the round web crop; defaults to the center. */
  focus?: string;
};

const clusters: Cluster[] = [
  {
    id: 'briefing',
    title: 'The briefing',
    note: 'One room, one regional picture—the update everything else connected back to.',
  },
  {
    id: 'grounds',
    title: 'Out on the grounds',
    note: 'Under the pavilion and out on the lawn, introductions turned into plans before the program even started.',
    door: { x: 235, y: 195 },
  },
  {
    id: 'system',
    title: 'Walking the system',
    note: 'Small groups carried a family’s story through the Rural Health Field Simulator—story cards in hand, every choice on the tablet.',
    door: { x: 740, y: 350 },
  },
  {
    id: 'room',
    title: 'Across the room',
    note: 'The real measure of the day: who you can call next week.',
    door: { x: 330, y: 535 },
  },
];

// Display order: the order of plates, strips, and lightbox stepping.
const recapPhotos: RecapPhoto[] = [
  {
    id: 'rhc-2026-01',
    cluster: 'briefing',
    height: 1103,
    title: 'The regional update',
    note: 'Laurie Stradley, CEO of Impact Health, on NC ROOTS and what it means for Region 1—to a full room.',
    alt: 'Laurie Stradley, CEO of Impact Health, speaks from the podium beside a slide quoting Virginia Burden—“Cooperation is the thorough conviction that nobody can get there unless everybody gets there”—as a full room listens.',
    x: 500,
    y: 330,
    r: 92,
    focus: '62% 50%',
  },
  {
    id: 'rhc-2026-02',
    cluster: 'grounds',
    height: 1067,
    title: 'Under the pavilion',
    note: 'Mountains on one side, new colleagues on the other.',
    alt: 'Four attendees talk under the open-air pavilion at Deerwoode Reserve, with trees and mountains behind them.',
    x: 95,
    y: 95,
    r: 52,
  },
  {
    id: 'rhc-2026-04',
    cluster: 'grounds',
    height: 1067,
    title: 'Comparing notes',
    note: 'Handouts first, then the questions they raised.',
    alt: 'A small group compares printed materials in conversation under the pavilion roof.',
    x: 245,
    y: 62,
    r: 40,
  },
  {
    id: 'rhc-2026-05',
    cluster: 'grounds',
    height: 900,
    title: 'The partner tables',
    note: 'Real doors, within reach: who to call, and how to reach them.',
    alt: 'Attendees with handouts gather at a resource table under the pavilion.',
    x: 385,
    y: 120,
    r: 44,
  },
  {
    id: 'rhc-2026-07',
    cluster: 'grounds',
    height: 1134,
    title: 'Glad to be here',
    note: 'Some of the day’s best conversations happened out on the lawn.',
    alt: 'A smiling attendee in a quilted vest stands on the lawn, a vintage teal pickup truck behind him.',
    x: 72,
    y: 255,
    r: 44,
  },
  {
    id: 'rhc-2026-16',
    cluster: 'grounds',
    height: 900,
    title: 'On the patio',
    note: 'The conversation spilled outside and stayed there.',
    alt: 'A group of attendees chats outdoors on the sunny gravel patio.',
    x: 200,
    y: 335,
    r: 38,
  },
  {
    id: 'rhc-2026-18',
    cluster: 'grounds',
    height: 900,
    title: 'Another door',
    note: 'Out on the lawn, one more table and one more way in.',
    alt: 'Attendees gather around a table on the lawn, pines and hills behind them.',
    x: 345,
    y: 262,
    r: 34,
  },
  {
    id: 'rhc-2026-27',
    cluster: 'grounds',
    height: 900,
    title: 'In good light',
    note: 'The light was good. So was the company.',
    alt: 'Two women talk at the edge of the pavilion, the bright lawn behind them.',
    x: 70,
    y: 400,
    r: 34,
  },
  {
    id: 'rhc-2026-03',
    cluster: 'system',
    height: 900,
    title: 'The first door',
    note: 'Every journey starts with a family, a need, and the first choice on the path.',
    alt: 'Three attendees look over handouts and a tablet together at a table on the pavilion.',
    x: 640,
    y: 75,
    r: 44,
  },
  {
    id: 'rhc-2026-06',
    cluster: 'system',
    height: 900,
    title: 'Three readers, one route',
    note: 'Groups worked each family’s path together, one handoff at a time.',
    alt: 'Three women lean in over a tablet inside the timber-walled event hall.',
    x: 800,
    y: 72,
    r: 52,
  },
  {
    id: 'rhc-2026-12',
    cluster: 'system',
    height: 900,
    title: 'Counting the cost',
    note: 'Every delay on the path shows up somewhere—in hours, in miles, or in care that waits.',
    alt: 'Two women at a round table listen intently, a tablet in front of them.',
    x: 655,
    y: 190,
    r: 36,
  },
  {
    id: 'rhc-2026-08',
    cluster: 'system',
    height: 900,
    title: 'Paper and screen',
    note: 'Story cards in hand, the family’s next decision on the tablet.',
    alt: 'Four attendees work through handouts and a tablet together inside the hall.',
    x: 935,
    y: 165,
    r: 40,
  },
  {
    id: 'rhc-2026-09',
    cluster: 'system',
    height: 900,
    title: 'Some turns earn a laugh',
    note: 'Not every handoff goes to plan. The simulator makes sure you feel it.',
    alt: 'Two women laugh as they look at a tablet together in the event hall.',
    x: 925,
    y: 320,
    r: 50,
  },
  {
    id: 'rhc-2026-13',
    cluster: 'system',
    height: 900,
    title: 'Reading the fine print',
    note: 'Paperwork is one of the barriers families meet. Participants met it too.',
    alt: 'Three attendees read printed pages and a tablet in the event hall.',
    x: 660,
    y: 450,
    r: 38,
  },
  {
    id: 'rhc-2026-10',
    cluster: 'system',
    height: 1067,
    title: 'Everyone leans in',
    note: 'When one screen holds a family’s next step, the whole group gathers round.',
    alt: 'A group crowds around a tablet held by one attendee, studying the screen closely.',
    x: 905,
    y: 478,
    r: 46,
  },
  {
    id: 'rhc-2026-11',
    cluster: 'system',
    height: 900,
    title: 'What happens next?',
    note: 'Two players, one handout, and the question every family faces at each door.',
    alt: 'Three women review a tablet and printed pages together under the pavilion.',
    x: 770,
    y: 520,
    r: 40,
  },
  {
    id: 'rhc-2026-20',
    cluster: 'system',
    height: 900,
    title: 'Logging the journey',
    note: 'Writing down what the path cost—and what it took to get through it.',
    alt: 'An attendee writes at a table inside the hall.',
    x: 785,
    y: 630,
    r: 34,
  },
  {
    id: 'rhc-2026-17',
    cluster: 'system',
    height: 900,
    title: 'Talking it through',
    note: 'Out on the patio, a family’s journey turns into a real conversation.',
    alt: 'Two attendees talk through a tablet outdoors on the sunny patio.',
    x: 930,
    y: 620,
    r: 36,
  },
  {
    id: 'rhc-2026-19',
    cluster: 'room',
    height: 1067,
    title: 'The warm handoff',
    note: 'The simulator asks for warm handoffs. Under the pavilion, they started happening for real.',
    alt: 'Two men talk under the pavilion, one holding a tablet, as others visit resource tables behind them.',
    x: 345,
    y: 420,
    r: 38,
  },
  {
    id: 'rhc-2026-26',
    cluster: 'room',
    height: 900,
    title: 'New numbers to call',
    note: 'A full house means a fuller phone list on Monday.',
    alt: 'An attendee smiles in conversation near a SparkPoint banner.',
    x: 245,
    y: 470,
    r: 34,
  },
  {
    id: 'rhc-2026-14',
    cluster: 'room',
    height: 900,
    title: 'Listening first',
    note: 'SparkPoint’s work starts with listening. So did a lot of the day.',
    alt: 'An attendee beside a window listens closely to a conversation.',
    x: 150,
    y: 515,
    r: 40,
  },
  {
    id: 'rhc-2026-23',
    cluster: 'room',
    height: 900,
    title: 'A full house is a loud house',
    note: 'Two hundred seats, and very few quiet moments.',
    alt: 'An attendee laughs during a conversation, a SparkPoint banner behind her.',
    x: 505,
    y: 480,
    r: 36,
  },
  {
    id: 'rhc-2026-15',
    cluster: 'room',
    height: 1067,
    title: 'A new circle',
    note: 'The kind of conversation that doesn’t form unless everyone is in the same room.',
    alt: 'Three women talk beside a wooden wall, one gesturing as she speaks.',
    x: 255,
    y: 615,
    r: 46,
  },
  {
    id: 'rhc-2026-21',
    cluster: 'room',
    height: 900,
    title: 'In the room, not just on the banner',
    note: 'Presenting sponsor UNC Health Pardee showed up to listen and connect.',
    alt: 'A smiling attendee in a UNC Health Pardee polo in the timber-walled hall.',
    x: 415,
    y: 620,
    r: 42,
  },
  {
    id: 'rhc-2026-22',
    cluster: 'room',
    height: 900,
    title: 'Conversations that outlast the day',
    note: 'The point was never one day. It was what happens after it.',
    alt: 'Three women talk in front of a SparkPoint banner.',
    x: 560,
    y: 600,
    r: 42,
  },
  {
    id: 'rhc-2026-24',
    cluster: 'room',
    height: 900,
    title: 'Making the point',
    note: 'Everyone came with experience worth sharing.',
    alt: 'An attendee gestures as she speaks with others in the hall.',
    x: 650,
    y: 640,
    r: 32,
  },
  {
    id: 'rhc-2026-25',
    cluster: 'room',
    height: 900,
    title: 'Taking it in',
    note: 'Some ideas take a minute. This room gave them one.',
    alt: 'Two men listen closely during a discussion, one resting his chin on his hand.',
    x: 85,
    y: 630,
    r: 34,
  },
];

// Dashed cross-links between doors: moments that echo each other across the day.
const handoffs: [string, string][] = [
  ['rhc-2026-19', 'rhc-2026-13'],
  ['rhc-2026-05', 'rhc-2026-14'],
  ['rhc-2026-17', 'rhc-2026-22'],
  ['rhc-2026-04', 'rhc-2026-03'],
  ['rhc-2026-16', 'rhc-2026-26'],
];

// Optional recap video: an embeddable URL (YouTube no-cookie or Vimeo player).
const RECAP_VIDEO_EMBED_URL: string | null = null;

export const recapPhotoCount = recapPhotos.length;
export const hasRecapVideo = RECAP_VIDEO_EMBED_URL !== null;
export const hasRecapMedia = recapPhotoCount > 0 || hasRecapVideo;

function recapAsset(id: string, width: 400 | 800 | 1600) {
  return `${BASE}assets/Rural%20Health/recap/${id}-${width}.webp`;
}

const clusterById = Object.fromEntries(clusters.map((c) => [c.id, c])) as Record<ClusterId, Cluster>;
const photoIndex = Object.fromEntries(recapPhotos.map((p, i) => [p.id, i]));

type Edge = { key: string; a: string; b: string; kind: 'spoke' | 'trunk' | 'handoff'; x1: number; y1: number; x2: number; y2: number };

// Node ids: photo ids, plus `door:<cluster>` for door markers.
function buildEdges(): Edge[] {
  const edges: Edge[] = [];
  for (const cluster of clusters) {
    if (!cluster.door) continue;
    edges.push({
      key: `trunk-${cluster.id}`,
      a: `door:${cluster.id}`,
      b: 'rhc-2026-01',
      kind: 'trunk',
      x1: cluster.door.x,
      y1: cluster.door.y,
      x2: HUB.x,
      y2: HUB.y,
    });
  }
  for (const photo of recapPhotos) {
    const door = clusterById[photo.cluster].door;
    if (!door) continue;
    edges.push({
      key: `spoke-${photo.id}`,
      a: photo.id,
      b: `door:${photo.cluster}`,
      kind: 'spoke',
      x1: photo.x,
      y1: photo.y,
      x2: door.x,
      y2: door.y,
    });
  }
  for (const [a, b] of handoffs) {
    const pa = recapPhotos[photoIndex[a]];
    const pb = recapPhotos[photoIndex[b]];
    edges.push({ key: `handoff-${a}-${b}`, a, b, kind: 'handoff', x1: pa.x, y1: pa.y, x2: pb.x, y2: pb.y });
  }
  return edges;
}

const edges = buildEdges();

// The lit route for a node: its own edges, plus its door's trunk to the briefing, so
// every photo traces a path back to the center.
function routeFor(nodeId: string | null) {
  const lit = new Set<string>();
  const nodes = new Set<string>();
  if (!nodeId) return { lit, nodes };
  nodes.add(nodeId);
  const cluster = nodeId.startsWith('door:')
    ? (nodeId.slice(5) as ClusterId)
    : recapPhotos[photoIndex[nodeId]]?.cluster;
  for (const edge of edges) {
    const touches = edge.a === nodeId || edge.b === nodeId;
    const isTrunk = edge.kind === 'trunk' && edge.a === `door:${cluster}`;
    const isDoorSpoke = nodeId.startsWith('door:') && edge.kind === 'spoke' && edge.b === nodeId;
    if (touches || isTrunk || isDoorSpoke) {
      lit.add(edge.key);
      nodes.add(edge.a);
      nodes.add(edge.b);
    }
  }
  if (nodeId === 'rhc-2026-01') {
    for (const c of clusters) if (c.door) nodes.add(`door:${c.id}`);
  }
  return { lit, nodes };
}

function plateLabel(index: number) {
  return `Plate ${String(index + 1).padStart(2, '0')}`;
}

function RecapLightbox({
  index,
  onClose,
  onStep,
}: {
  index: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const photo = recapPhotos[index];

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      opener?.focus();
    };
  }, []);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight') onStep(1);
      else if (event.key === 'ArrowLeft') onStep(-1);
      else if (event.key === 'Tab') {
        // Keep focus on the dialog's own controls; aria-modal alone doesn't stop Tab
        // from reaching the page behind the overlay.
        const controls = Array.from(dialogRef.current?.querySelectorAll('button') ?? []);
        if (controls.length === 0) return;
        const first = controls[0];
        const last = controls[controls.length - 1];
        const current = document.activeElement;
        const inside = current instanceof Node && dialogRef.current?.contains(current);
        if (event.shiftKey && (current === first || !inside)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (current === last || !inside)) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onStep]);

  return (
    <div
      ref={dialogRef}
      className="rh-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${plateLabel(index)} of ${recapPhotos.length}: ${photo.title}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <button
        ref={closeRef}
        type="button"
        className="rh-lightbox-close"
        onClick={onClose}
        aria-label="Close photo"
      >
        <X aria-hidden="true" size={26} />
      </button>
      <button
        type="button"
        className="rh-lightbox-step rh-lightbox-prev"
        onClick={() => onStep(-1)}
        aria-label="Previous photo"
      >
        <ChevronLeft aria-hidden="true" size={30} />
      </button>
      <figure>
        <img
          src={recapAsset(photo.id, 1600)}
          alt={photo.alt}
          width={PHOTO_WIDTH}
          height={photo.height}
        />
        <figcaption>
          <span>
            {plateLabel(index)} · {clusterById[photo.cluster].title}
          </span>
          <strong>{photo.title}</strong>
          {photo.note}
        </figcaption>
      </figure>
      <button
        type="button"
        className="rh-lightbox-step rh-lightbox-next"
        onClick={() => onStep(1)}
        aria-label="Next photo"
      >
        <ChevronRight aria-hidden="true" size={30} />
      </button>
    </div>
  );
}

function ConnectionWeb({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [drawn, setDrawn] = useState(false);
  const webRef = useRef<HTMLDivElement>(null);
  const focusId = hoverId ?? activeId;
  const route = useMemo(() => routeFor(focusId), [focusId]);

  // Draw the lines in once the web scrolls into view.
  useEffect(() => {
    const el = webRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setDrawn(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const pct = (value: number, total: number) => `${(value / total) * 100}%`;

  return (
    <div
      ref={webRef}
      className={`rh-web${drawn ? ' is-drawn' : ''}${hoverId ? ' is-hovering' : ''}`}
      onMouseLeave={() => setHoverId(null)}
    >
      <svg viewBox={`0 0 ${WEB_WIDTH} ${WEB_HEIGHT}`} aria-hidden="true" focusable="false">
        {edges.map((edge, i) => (
          <line
            key={edge.key}
            className={`rh-web-edge rh-web-edge-${edge.kind}${route.lit.has(edge.key) ? ' is-lit' : ''}`}
            x1={edge.x1}
            y1={edge.y1}
            x2={edge.x2}
            y2={edge.y2}
            pathLength={1}
            style={{ transitionDelay: drawn ? `${Math.min(i, 30) * 28}ms` : undefined }}
          />
        ))}
      </svg>

      {clusters.map((cluster) =>
        cluster.door ? (
          <button
            key={cluster.id}
            type="button"
            className={`rh-web-door${route.nodes.has(`door:${cluster.id}`) ? ' is-lit' : ''}`}
            style={{ left: pct(cluster.door.x, WEB_WIDTH), top: pct(cluster.door.y, WEB_HEIGHT) }}
            onMouseEnter={() => setHoverId(`door:${cluster.id}`)}
            onFocus={() => setHoverId(`door:${cluster.id}`)}
            onBlur={() => setHoverId(null)}
            onClick={() => onSelect(recapPhotos.find((p) => p.cluster === cluster.id)!.id)}
          >
            <span className="rh-web-door-mark" aria-hidden="true">
              ✦
            </span>
            <span className="rh-web-door-label">{cluster.title}</span>
          </button>
        ) : null,
      )}

      {recapPhotos.map((photo, index) => {
        const isActive = photo.id === activeId;
        const isLit = route.nodes.has(photo.id);
        return (
          <button
            key={photo.id}
            type="button"
            className={`rh-web-node${photo.cluster === 'briefing' ? ' is-hub' : ''}${isActive ? ' is-active' : ''}${isLit ? ' is-lit' : ''}`}
            style={{
              left: pct(photo.x, WEB_WIDTH),
              top: pct(photo.y, WEB_HEIGHT),
              width: pct(photo.r * 2, WEB_WIDTH),
              transitionDelay: drawn ? `${200 + index * 22}ms` : undefined,
            }}
            aria-pressed={isActive}
            aria-label={`${plateLabel(index)}, ${clusterById[photo.cluster].title}: ${photo.title}`}
            onMouseEnter={() => setHoverId(photo.id)}
            onFocus={() => setHoverId(photo.id)}
            onBlur={() => setHoverId(null)}
            onClick={() => onSelect(photo.id)}
          >
            <img
              src={recapAsset(photo.id, 400)}
              alt=""
              width={400}
              height={Math.round((photo.height / PHOTO_WIDTH) * 400)}
              loading="lazy"
              style={photo.focus ? { objectPosition: photo.focus } : undefined}
            />
            <span className="rh-web-node-num" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="rh-web-node-tip" aria-hidden="true">
              {photo.title}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function FieldCard({ activeId, onOpen, onSelect }: { activeId: string; onOpen: () => void; onSelect: (id: string) => void }) {
  const index = photoIndex[activeId];
  const photo = recapPhotos[index];
  const cluster = clusterById[photo.cluster];
  const linked = handoffs
    .filter(([a, b]) => a === photo.id || b === photo.id)
    .map(([a, b]) => recapPhotos[photoIndex[a === photo.id ? b : a]]);

  return (
    <aside className="rh-field-card" aria-live="polite" aria-label="Selected photo">
      <p className="rh-field-card-plate">
        {plateLabel(index)} <span aria-hidden="true">·</span> {cluster.title}
      </p>
      <button type="button" className="rh-field-card-photo" onClick={onOpen} aria-label={`View larger: ${photo.title}`}>
        <img
          key={photo.id}
          src={recapAsset(photo.id, 800)}
          srcSet={`${recapAsset(photo.id, 800)} 800w, ${recapAsset(photo.id, 1600)} 1600w`}
          sizes="(max-width: 1180px) 40vw, 480px"
          alt={photo.alt}
          width={PHOTO_WIDTH}
          height={photo.height}
        />
        <span className="rh-field-card-expand" aria-hidden="true">
          <Expand size={16} />
        </span>
      </button>
      <h3>{photo.title}</h3>
      <p className="rh-field-card-note">{photo.note}</p>
      <p className="rh-field-card-door">{cluster.note}</p>
      {linked.length > 0 ? (
        <div className="rh-field-card-links">
          <span>Handoff to</span>
          {linked.map((other) => (
            <button key={other.id} type="button" onClick={() => onSelect(other.id)}>
              {plateLabel(photoIndex[other.id])} · {other.title}
            </button>
          ))}
        </div>
      ) : null}
    </aside>
  );
}

// Holds the map. Where the map is wider than the frame (narrow phones), it scrolls
// sideways and opens centered on the briefing hub.
function WebScroller({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const overflow = el.scrollWidth - el.clientWidth;
    if (overflow > 0) el.scrollLeft = overflow * (HUB.x / WEB_WIDTH);
  }, []);
  return (
    <div ref={ref} className="rh-web-scroll">
      {children}
    </div>
  );
}

export function RecapMedia() {
  const [activeId, setActiveId] = useState(recapPhotos[0]?.id ?? '');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? current : (current + delta + recapPhotos.length) % recapPhotos.length,
      ),
    [],
  );

  return (
    <section id="recap-media" className="rh-recap-media" aria-labelledby="rh-recap-media-title">
      <div className="rh-shell">
        <div className="rh-recap-media-heading">
          <div>
            <p className="rh-recap-eyebrow">From the day · October 1, 2026</p>
            <h2 id="rh-recap-media-title">
              Every door, every handoff—and the people at each one.
            </h2>
          </div>
          <p>
            A full house at Deerwoode Reserve, mapped the way the simulator maps a rural
            health system: the regional briefing at the center, and the connections that
            formed around it. <span className="rh-recap-hint">Hover a point to trace its
            route; select it to read the plate.</span>
            <span className="rh-recap-hint rh-recap-hint-touch">Tap a point to read its
            plate; drag the map sideways to explore.</span>
          </p>
        </div>

        {RECAP_VIDEO_EMBED_URL ? (
          <div className="rh-recap-video">
            <iframe
              src={RECAP_VIDEO_EMBED_URL}
              title="2026 WNC Regional Rural Health Convening recap video"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        ) : null}

        {recapPhotos.length > 0 ? (
          <>
            <div className="rh-web-layout">
              <div className="rh-web-frame">
                <div className="rh-plate-label rh-web-plate-label">
                  <span>Connection map · October 1, 2026</span>
                  <span>{recapPhotos.length} plates · one full house</span>
                </div>
                <WebScroller>
                  <ConnectionWeb activeId={activeId} onSelect={setActiveId} />
                </WebScroller>
                <ul className="rh-web-legend" aria-hidden="true">
                  <li>
                    <i className="rh-legend-trunk" /> Route to the briefing
                  </li>
                  <li>
                    <i className="rh-legend-spoke" /> Door
                  </li>
                  <li>
                    <i className="rh-legend-handoff" /> Warm handoff
                  </li>
                </ul>
              </div>
              <FieldCard
                activeId={activeId}
                onOpen={() => setOpenIndex(photoIndex[activeId])}
                onSelect={setActiveId}
              />
            </div>
          </>
        ) : null}
      </div>

      {openIndex !== null ? <RecapLightbox index={openIndex} onClose={close} onStep={step} /> : null}
    </section>
  );
}
