import { lazy, Suspense, useCallback, useEffect, useId, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { Sparkmark } from '../components/Sparkmark';
import {
  GALA_TRIPS_IN_ORDER,
  cardStops,
  tripImageSrc,
  tripAnchor,
  tripPrice,
  travelersLabel,
  type GalaTrip,
} from '../data/galaTrips';
import { tripMedia, tripVideoSrc, type GalaCreditPart, type GalaLoopSources } from '../data/galaTripMedia';
import { useTripLoungeEnv } from './galaTrips/useTripLoungeEnv';

// The trips lounge: the eight trips as a departures lounge.
//
// The featured five (presented on stage) get wide cinematic cards; the other
// three get tall cards with the same content, motion and film. Each card is an
// anchor (`#trip-greece` etc.) for emails and QR codes.
//
// Every card leads with its trip's credited hero still. A card "boards" (brass
// frame, Now boarding cue) on hover or focus with a mouse, or, on touch screens,
// when it's the card nearest the middle of the screen. A boarding card plays its
// silent loop if the trip has one (`npm run gala:trip-media`); otherwise its
// still drifts slowly.
//
// Performance and access rules, kept on purpose:
// - No <video> exists until its card is near the viewport and has boarded, and
//   it has preload="none", so nothing is fetched for a card no one looks at. The
//   first load carries no video at all.
// - Only the boarding card plays: one loop at a time, paused when it stops boarding.
// - No video, no drift and no pulsing cue under reduced motion (OS or the site's
//   toggle), Save-Data or 2G. Those visitors get the stills.
// - Moving video has a visible pause control (WCAG 2.2.2), and pausing holds for
//   every card until the visitor presses play.
// - The full film (with sound) loads only when someone asks for it, in a lazily
//   loaded dialog: pressing the photo plays the vertical cut (the 16:9 if the
//   trip has none), and Watch the film plays the 16:9 (the vertical cut on a
//   phone held upright). Either way the player can switch to the full film.

const TripFilmDialog = lazy(() => import('./galaTrips/TripFilmDialog'));

// How long the loop takes to dissolve in or out over its still (matches the CSS).
const DISSOLVE_MS = 900;

// Renders stills.json's credit text exactly ("Author / Licence, via Site"),
// linking the author to the source page and the licence to its deed. Splits on
// the last " / " because some author names contain commas.
function CreditLine({ credit, sourceUrl, licenseUrl }: { credit: string; sourceUrl: string; licenseUrl: string }) {
  const slash = credit.lastIndexOf(' / ');
  if (slash < 0) {
    return (
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
        {credit}
      </a>
    );
  }
  const author = credit.slice(0, slash);
  const rest = credit.slice(slash + 3);
  const comma = rest.indexOf(', ');
  const license = comma < 0 ? rest : rest.slice(0, comma);
  const tail = comma < 0 ? '' : rest.slice(comma);
  return (
    <>
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
        {author}
      </a>
      {' / '}
      <a href={licenseUrl} target="_blank" rel="noopener noreferrer license">
        {license}
      </a>
      {tail}
    </>
  );
}

// The CC work in a loop: "Gullfoss with a rainbow: Diego Delso / CC BY-SA 4.0",
// with each author linked to its source and the licence to its deed.
function LoopCredit({ parts }: { parts: GalaCreditPart[] }) {
  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {index > 0 ? ' · ' : null}
          {part.label ? `${part.label}: ` : null}
          <a href={part.sourceUrl} target="_blank" rel="noopener noreferrer">
            {part.author}
          </a>{' '}
          /{' '}
          {part.licenseUrl ? (
            <a href={part.licenseUrl} target="_blank" rel="noopener noreferrer license">
              {part.license}
            </a>
          ) : (
            part.license
          )}
        </span>
      ))}
    </>
  );
}

function loopFor(trip: GalaTrip): GalaLoopSources | undefined {
  const media = tripMedia(trip.id);
  if (!media) return undefined;
  return trip.featured ? media.loopWide ?? media.loopTall : media.loopTall ?? media.loopWide;
}

interface TripArtProps {
  trip: GalaTrip;
  boarding: boolean;
  near: boolean;
  videoAllowed: boolean;
  paused: boolean;
  onTogglePause: () => void;
  onPlayFilm?: (from: HTMLButtonElement) => void;
}

function TripLoop({ sources, play, onPlaying }: { sources: GalaLoopSources; play: boolean; onPlaying: (on: boolean) => void }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (play) {
      video.play().catch(() => onPlaying(false));
      return;
    }
    // Dissolve back to the still, then stop decoding.
    setShown(false);
    onPlaying(false);
    const t = window.setTimeout(() => video.pause(), DISSOLVE_MS);
    return () => window.clearTimeout(t);
  }, [play, onPlaying]);

  return (
    <video
      ref={ref}
      className={`gala-trip-loop${shown ? ' is-shown' : ''}`}
      muted
      playsInline
      loop
      preload="none"
      disablePictureInPicture
      aria-hidden="true"
      tabIndex={-1}
      onPlaying={() => {
        setShown(true);
        onPlaying(true);
      }}
    >
      {sources.webm ? <source src={tripVideoSrc(sources.webm)} type="video/webm" /> : null}
      {sources.mp4 ? <source src={tripVideoSrc(sources.mp4)} type="video/mp4" /> : null}
    </video>
  );
}

function TripArt({ trip, boarding, near, videoAllowed, paused, onTogglePause, onPlayFilm }: TripArtProps) {
  const image = trip.image;
  const loop = loopFor(trip);
  const [playing, setPlaying] = useState(false);
  // The <video> is created the first time the card boards (never speculatively,
  // so nothing is fetched for cards no one looks at) and kept while it stays near.
  const [boarded, setBoarded] = useState(false);
  useEffect(() => {
    if (boarding) setBoarded(true);
    else if (!near) setBoarded(false);
  }, [boarding, near]);
  const mountVideo = Boolean(loop) && videoAllowed && near && (boarded || boarding);
  const play = mountVideo && boarding && !paused;
  const onPlaying = useCallback((on: boolean) => setPlaying(on), []);
  const showControl = mountVideo && boarding && (playing || paused);

  return (
    <figure className="gala-trip-figure">
      <div className="gala-trip-art">
        {image ? (
          <img
            className="gala-trip-still"
            src={tripImageSrc(image.file, 800)}
            srcSet={`${tripImageSrc(image.file, 800)} 800w, ${tripImageSrc(image.file, 1600)} 1600w`}
            sizes={trip.featured ? '(min-width: 1100px) 760px, 92vw' : '(min-width: 1100px) 400px, (min-width: 640px) 40vw, 92vw'}
            width={image.width}
            height={image.height}
            alt={image.alt}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="gala-trip-art-panel" aria-hidden="true">
            <svg viewBox="0 0 200 120" className="gala-trip-globe">
              <circle cx="100" cy="128" r="92" />
              <ellipse cx="100" cy="128" rx="58" ry="92" />
              <ellipse cx="100" cy="128" rx="24" ry="92" />
              <ellipse cx="100" cy="128" rx="92" ry="36" />
              <path className="gala-trip-globe-route" d="M16 116 Q 34 92 60 96" />
              <circle className="gala-trip-globe-node" cx="60" cy="96" r="2.2" />
            </svg>
            <span className="gala-trip-art-num">{trip.connection}</span>
            <span className="gala-trip-art-country">
              {trip.name === trip.country ? trip.name : `${trip.name} · ${trip.country}`}
            </span>
          </div>
        )}
        {mountVideo && loop ? <TripLoop sources={loop} play={play} onPlaying={onPlaying} /> : null}
        {/* The whole photo is a button that opens the film. The pause control
            sits above it, a separate button, never inside it. */}
        {onPlayFilm ? (
          <button
            type="button"
            className="gala-trip-art-play"
            onClick={(event) => onPlayFilm(event.currentTarget)}
            aria-label={`Play the film: ${trip.title}`}
          >
            <span className="gala-trip-art-play-cue" aria-hidden="true">
              <Play size={13} />
              Play film
            </span>
          </button>
        ) : null}
        <span className="gala-trip-art-tag" aria-hidden="true">
          {trip.connection}
        </span>
        <span className="gala-trip-boarding" aria-hidden="true">
          <span className="gala-trip-boarding-dot" />
          Now boarding
        </span>
        {showControl ? (
          <button
            type="button"
            className="gala-trip-motion"
            onClick={onTogglePause}
            aria-pressed={paused}
            aria-label={paused ? 'Play the trip videos' : 'Pause the trip videos'}
          >
            {paused ? <Play aria-hidden="true" size={14} /> : <Pause aria-hidden="true" size={14} />}
            <span aria-hidden="true">{paused ? 'Play' : 'Pause'}</span>
          </button>
        ) : null}
      </div>
    </figure>
  );
}

// "Author / Licence, via Site" -> its author and licence, for the compact line.
function photoCredit(credit: string) {
  const slash = credit.lastIndexOf(' / ');
  if (slash < 0) return { author: credit, license: '' };
  const rest = credit.slice(slash + 3);
  const comma = rest.indexOf(', ');
  return { author: credit.slice(0, slash), license: comma < 0 ? rest : rest.slice(0, comma) };
}

// The card's credits: one compact line at its foot (the photo's author and
// licence, linked, and "Video: Wikimedia Commons" when the loop holds CC work),
// and a Credits button that opens every item in full, each author linked to its
// source and each licence to its deed. Only what a licence requires is credited
// (CC BY and BY-SA); the stock footage and music are not, by the owner's call.
function TripCredits({ trip }: { trip: GalaTrip }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const image = trip.image;
  const media = tripMedia(trip.id);
  const loop = loopFor(trip);
  const ccParts = loop?.credit ?? [];
  const filmCC = Boolean(media?.film && media.filmCredits?.length);
  if (!image && !ccParts.length && !filmCC) return null;
  const photo = image ? photoCredit(image.credit) : null;
  const videoSources = ccParts.length ? 'Wikimedia Commons' : null;

  return (
    <div className="gala-trip-credits">
      <div className="gala-trip-credits-line">
        <p>
          {photo && image ? (
            <>
              Photo:{' '}
              <a href={image.sourceUrl} target="_blank" rel="noopener noreferrer">
                {photo.author}
              </a>
              {photo.license ? (
                <>
                  ,{' '}
                  <a href={image.licenseUrl} target="_blank" rel="noopener noreferrer license">
                    {photo.license}
                  </a>
                </>
              ) : null}
            </>
          ) : null}
          {photo && videoSources ? ' · ' : null}
          {videoSources ? <>Video: {videoSources}</> : null}
        </p>
        <button
          type="button"
          className="gala-trip-credits-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
        >
          Credits
          <span className="gala-trip-credits-caret" aria-hidden="true" />
        </button>
      </div>
      <div id={panelId} className="gala-trip-credits-panel" hidden={!open}>
        <ul>
          {image ? (
            <li>
              Photo{image.place ? <>, {image.place}</> : null}:{' '}
              <CreditLine credit={image.credit} sourceUrl={image.sourceUrl} licenseUrl={image.licenseUrl} />
            </li>
          ) : null}
          {ccParts.length ? (
            <li>
              Video: <LoopCredit parts={ccParts} />
            </li>
          ) : null}
          {filmCC ? <li>The film lists its photo and clip credits as it plays.</li> : null}
        </ul>
      </div>
    </div>
  );
}

interface TripCardProps {
  trip: GalaTrip;
  boarding: boolean;
  near: boolean;
  videoAllowed: boolean;
  paused: boolean;
  onTogglePause: () => void;
  onBoard: (id: string | null) => void;
  hover: boolean;
  onWatch: (trip: GalaTrip, from: HTMLButtonElement, preferVertical: boolean) => void;
  register: (id: string, el: HTMLLIElement | null) => void;
}

function TripCard({ trip, boarding, near, videoAllowed, paused, onTogglePause, onBoard, hover, onWatch, register }: TripCardProps) {
  const price = tripPrice(trip);
  const headingId = `${tripAnchor(trip)}-title`;
  const film = tripMedia(trip.id)?.film;
  const stops = cardStops(trip).map((stop) => stop.name);

  return (
    <li
      ref={(el) => register(trip.id, el)}
      className={`gala-trip ${trip.featured ? 'is-featured' : 'is-tall'}${boarding ? ' is-boarding' : ''}`}
      id={tripAnchor(trip)}
      data-trip={trip.id}
      aria-labelledby={headingId}
      onPointerEnter={hover ? () => onBoard(trip.id) : undefined}
      onPointerLeave={hover ? () => onBoard(null) : undefined}
      onFocus={() => onBoard(trip.id)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onBoard(null);
      }}
    >
      <TripArt
        trip={trip}
        boarding={boarding}
        near={near}
        videoAllowed={videoAllowed}
        paused={paused}
        onTogglePause={onTogglePause}
        onPlayFilm={film ? (from) => onWatch(trip, from, true) : undefined}
      />
      <div className="gala-trip-body">
        <p className="gala-trip-connection">
          <a href={`#${tripAnchor(trip)}`} className="gala-trip-anchor">
            Connection {trip.connection}
          </a>{' '}
          · {trip.name}
        </p>
        <h3 id={headingId}>{trip.title}</h3>
        <p className="gala-trip-meta">
          <span>{trip.nights} nights</span>
          <span aria-hidden="true">·</span>
          <span>{travelersLabel(trip.travelers)}</span>
          {price ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="gala-trip-price">{price}</span>
            </>
          ) : null}
        </p>
        <p className="gala-trip-route">
          <Sparkmark variant="ink" size="12px" className="gala-trip-stops-mark" />
          <span>
            <span className="sr-only">Route: </span>
            <span className="gala-trip-route-home">Transylvania County</span>
            <span className="gala-trip-route-flight" aria-hidden="true">
              {' '}
              ✈{' '}
            </span>
            <span className="sr-only"> to </span>
            {stops.join(' → ')}
          </span>
        </p>
        <p className="gala-trip-summary">{trip.summary}</p>
        <h4 className="gala-trip-included-title">Highlights</h4>
        <ul className="gala-trip-included">
          {trip.included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {film ? (
          <div className="gala-trip-actions">
            <button
              type="button"
              className="gala-button gala-button-gold gala-trip-watch"
              onClick={(event) => onWatch(trip, event.currentTarget, false)}
              aria-label={`Watch the film: ${trip.title}`}
            >
              <Play aria-hidden="true" size={14} />
              Watch the film
            </button>
          </div>
        ) : null}
      </div>
      <TripCredits trip={trip} />
    </li>
  );
}

export function GalaTrips() {
  const env = useTripLoungeEnv();
  const [hovered, setHovered] = useState<string | null>(null);
  const [centred, setCentred] = useState<string | null>(null);
  const [near, setNear] = useState<Set<string>>(() => new Set());
  const [paused, setPaused] = useState(false);
  const [film, setFilm] = useState<{ trip: GalaTrip; preferVertical: boolean } | null>(null);
  const filmOpener = useRef<HTMLButtonElement | null>(null);
  const cards = useRef(new Map<string, HTMLLIElement>());

  const register = useCallback((id: string, el: HTMLLIElement | null) => {
    if (el) cards.current.set(id, el);
    else cards.current.delete(id);
  }, []);

  // Which cards are close enough to mount their (still unloaded) video.
  useEffect(() => {
    if (!env.video) return;
    const io = new IntersectionObserver(
      (entries) => {
        setNear((prev) => {
          const next = new Set(prev);
          for (const entry of entries) {
            const id = (entry.target as HTMLElement).dataset.trip!;
            if (entry.isIntersecting) next.add(id);
            else next.delete(id);
          }
          return next;
        });
      },
      { rootMargin: '300px 0px' }
    );
    cards.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [env.video]);

  // Touch screens: the card nearest the middle of the screen boards.
  useEffect(() => {
    if (env.hover) {
      setCentred(null);
      return;
    }
    const inBand = new Set<HTMLElement>();
    const pick = () => {
      const mid = window.innerHeight / 2;
      let best: HTMLElement | null = null;
      let bestDistance = Infinity;
      inBand.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - mid);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = el;
        }
      });
      setCentred(best ? (best as HTMLElement).dataset.trip! : null);
    };
    // A band across the middle third of the screen, in pixels from the
    // viewport's height (so it holds in landscape too), rebuilt on resize.
    let io: IntersectionObserver | null = null;
    const observe = () => {
      io?.disconnect();
      inBand.clear();
      const inset = Math.round(window.innerHeight / 3);
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) inBand.add(entry.target as HTMLElement);
            else inBand.delete(entry.target as HTMLElement);
          }
          pick();
        },
        { rootMargin: `-${inset}px 0px -${inset}px 0px` }
      );
      cards.current.forEach((el) => io!.observe(el));
    };
    observe();
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(observe, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(resizeTimer);
      io?.disconnect();
    };
  }, [env.hover]);

  const boardingId = env.hover ? hovered : hovered ?? centred;

  const onBoard = useCallback((id: string | null) => setHovered(id), []);
  const onTogglePause = useCallback(() => setPaused((p) => !p), []);
  const onWatch = useCallback((trip: GalaTrip, from: HTMLButtonElement, preferVertical: boolean) => {
    filmOpener.current = from;
    setFilm({ trip, preferVertical });
  }, []);

  return (
    <>
      <ol className={`gala-trips${env.motion && env.data ? '' : ' is-still'}`}>
        {GALA_TRIPS_IN_ORDER.map((trip) => (
          <TripCard
            key={trip.id}
            trip={trip}
            boarding={boardingId === trip.id}
            near={near.has(trip.id)}
            videoAllowed={env.video}
            paused={paused}
            onTogglePause={onTogglePause}
            onBoard={onBoard}
            hover={env.hover}
            onWatch={onWatch}
            register={register}
          />
        ))}
      </ol>
      {film ? (
        <Suspense fallback={null}>
          <TripFilmDialog
            trip={film.trip}
            preferVertical={film.preferVertical}
            onClose={() => {
              setFilm(null);
              // Back to the button that opened it.
              window.requestAnimationFrame(() => filmOpener.current?.focus());
            }}
          />
        </Suspense>
      ) : null}
    </>
  );
}
