// /events/sparkpoint-gala/join-me — "Issue my passport": a one-screen post maker for the Gala.
// A guest adds a photo and their name, taps the trip they dream of, and the passport is
// stamped (the trip's stamp, then the Gala's) while a "Join me" post builds around it.
// One image (4:5, saved at 2160×2700) for every use: a Facebook or Instagram post, an email
// attachment or a print. Phones share it through the share sheet; computers save it.
//
// Privacy: the photo is read and drawn on this device only. It is never uploaded, stored or
// tracked, and the page has no analytics of its own. A pre-filled name can ride in the link's
// hash (#name=Clara%20Bennett), which browsers never send to the server.
import '@fontsource-variable/josefin-sans';
import '@fontsource-variable/josefin-sans/wght-italic.css';
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { GALA_TRIPS_IN_ORDER } from '../data/galaTrips';
import { SPARKMARK_URL } from '../components/Sparkmark';
import { GALA_STAMP_ID, STAMPS, clearStampCache, setSparkmark, stampCanvas } from './galaJoinMe/stamps';
import {
  LAYOUTS,
  artFor,
  autoFrame,
  caption,
  clampFrame,
  drawBackground,
  drawBand,
  drawLockup,
  drawPassport,
  exportPost,
  photoBox,
  stampPlacement,
  type Frame,
  type Photo,
  type PostAssets,
  type PostInput,
  type PostTrip,
} from './galaJoinMe/post';
import './galaJoinMe/galaJoinMe.css';

const BASE = import.meta.env.BASE_URL;
const SAMPLE_SRC = `${BASE}assets/events/gala/passport-bearer-600.webp`;
const GALA_PATH = '/events/sparkpoint-gala';
const PAGE_PATH = '/events/sparkpoint-gala/join-me';
const SHARE_IMAGE = '/assets/events/gala/gala-share-world-of-connections.jpg';
const PRIVACY = 'Your photo stays on this device. It’s never uploaded, saved or tracked.';
// The sample passport's bearer, shown only with the sample photo. Once a guest adds their own
// photo (or the Gala seal), a blank name reads "You", so nobody's post goes out as Clara.
const SAMPLE_NAME = 'Clara Bennett';

const TRIPS: PostTrip[] = GALA_TRIPS_IN_ORDER.map((t) => ({ id: t.id, name: t.name, connection: t.connection }));
const STEPS = ['Photo', 'Name', 'Stamp', 'Share'] as const;

const FEED = LAYOUTS.feed;

function prefersLessMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('reduce-motion');
}

/** Android buzzes; iOS 18+ gives a light tick through a switch control; elsewhere nothing happens. */
function useHaptics() {
  const label = useRef<HTMLLabelElement>(null);
  const tap = useCallback((ms: number) => {
    if (prefersLessMotion()) return;
    // Browsers refuse (and log) vibration until the visitor has tapped the page.
    if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;
    try {
      if (navigator.vibrate && navigator.vibrate(ms)) return;
    } catch {
      // Vibration not allowed here.
    }
    label.current?.click();
  }, []);
  return { label, tap };
}

function nameFromHash(hash: string) {
  const named = hash.match(/^#name=(.{1,80})$/);
  if (named) {
    try {
      return decodeURIComponent(named[1].replace(/\+/g, ' ')).slice(0, 24);
    } catch {
      return '';
    }
  }
  const dashed = hash.match(/^#for-([A-Za-z][A-Za-z-]{0,40})$/);
  return dashed ? dashed[1].replace(/-/g, ' ').slice(0, 24) : '';
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

const wait = (ms: number) => new Promise((r) => window.setTimeout(r, prefersLessMotion() ? 0 : ms));

export default function GalaJoinMePage() {
  const [step, setStep] = useState(0);
  const [stepDir, setStepDir] = useState<'fwd' | 'back'>('fwd');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState<Photo>({ kind: 'sample', source: null, w: 600, h: 770 });
  const [frame, setFrame] = useState<Frame>({ zoom: 1, ox: 0, oy: 0 });
  const [trip, setTrip] = useState<PostTrip | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [built, setBuilt] = useState(false);
  const [building, setBuilding] = useState(false);
  const [tripStamp, setTripStamp] = useState<{ id: string; key: number } | null>(null);
  const [galaKey, setGalaKey] = useState(0);
  const [version, setVersion] = useState(0);
  const [notice, setNotice] = useState('');
  const [toast, setToast] = useState('');
  const [canShareFiles, setCanShareFiles] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const baseRef = useRef<HTMLCanvasElement>(null);
  const topRef = useRef<HTMLCanvasElement>(null);
  const bottomRef = useRef<HTMLCanvasElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const assets = useRef<PostAssets>({ sparkmark: null });
  const post = useRef<Blob | null>(null);
  const running = useRef(false);
  // Bumped by Back and Start over, so a stamping sequence still in flight stops where it is.
  const run = useRef(0);
  const pan = useRef<{ x: number; y: number; ox: number; oy: number; k: number } | null>(null);
  const { label: hapticLabel, tap } = useHaptics();

  const shownName = name.trim() || (photo.kind === 'sample' ? SAMPLE_NAME : '');
  const input: PostInput = useMemo(() => ({ name: shownName, photo, frame, trip }), [shownName, photo, frame, trip]);

  // ---- assets, fonts and the pre-filled name ----
  useEffect(() => {
    let live = true;
    setName(nameFromHash(window.location.hash));
    try {
      setCanShareFiles(!!navigator.canShare && navigator.canShare({ files: [new File([new Blob()], 'x.jpg', { type: 'image/jpeg' })] }));
    } catch {
      setCanShareFiles(false);
    }
    loadImage(SAMPLE_SRC)
      .then((img) => {
        if (!live) return;
        const sample: Photo = { kind: 'sample', source: img, w: img.naturalWidth, h: img.naturalHeight };
        setPhoto((p) => (p.kind === 'sample' ? sample : p));
        setFrame((f) => (f.ox || f.oy ? f : autoFrame(sample)));
      })
      .catch(() => undefined);
    loadImage(SPARKMARK_URL)
      .then((img) => {
        if (!live) return;
        assets.current.sparkmark = img;
        setSparkmark(img);
        setVersion((v) => v + 1);
      })
      .catch(() => undefined);
    // Canvas text needs Josefin loaded before it's drawn; redraw (and re-ink the stamps) when it arrives.
    const refresh = () => {
      clearStampCache();
      if (live) setVersion((v) => v + 1);
    };
    Promise.all(
      ['300', '400', '600', '700'].map((w) => document.fonts.load(`${w} 40px "Josefin Sans Variable"`)).concat(document.fonts.load('italic 300 40px "Josefin Sans Variable"')),
    )
      .then(refresh)
      .catch(() => undefined);
    document.fonts.addEventListener('loadingdone', refresh);
    const onHash = () => {
      const n = nameFromHash(window.location.hash);
      if (n) setName(n);
    };
    window.addEventListener('hashchange', onHash);
    return () => {
      live = false;
      document.fonts.removeEventListener('loadingdone', refresh);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  // ---- live drawing ----
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const x = baseRef.current?.getContext('2d', { willReadFrequently: true });
      if (!x) return;
      x.clearRect(0, 0, FEED.W, FEED.H);
      drawBackground(x, FEED);
      drawPassport(x, FEED, input);
    });
    return () => cancelAnimationFrame(id);
  }, [input, version]);

  useEffect(() => {
    const t = topRef.current?.getContext('2d');
    const b = bottomRef.current?.getContext('2d');
    if (t) {
      t.clearRect(0, 0, FEED.W, FEED.H);
      drawLockup(t, FEED, assets.current);
    }
    if (b) {
      b.clearRect(0, 0, FEED.W, FEED.H);
      drawBand(b, FEED);
    }
  }, [version]);

  const makePosts = useCallback(async (from: PostInput) => {
    const blob = await exportPost(from, assets.current);
    if (blob) post.current = blob;
  }, []);

  // After the first build, keep the saved images in step with any change.
  useEffect(() => {
    if (!built || running.current) return;
    const id = window.setTimeout(() => void makePosts(input), 400);
    return () => window.clearTimeout(id);
  }, [built, input, version, makePosts]);

  // Stamp images (for the card overlay and the picker), re-inked when the font arrives.
  const stampSrc = useMemo(() => {
    void version;
    if (typeof document === 'undefined') return {} as Record<string, string>;
    const out: Record<string, string> = {};
    [...TRIPS.map((t) => artFor(t)), { id: GALA_STAMP_ID, art: STAMPS[GALA_STAMP_ID] }].forEach(({ id, art }) => {
      out[id] = stampCanvas(id, art).toDataURL();
    });
    return out;
  }, [version]);

  // ---- steps ----
  const go = useCallback(
    (next: number) => {
      setStepDir(next < step ? 'back' : 'fwd');
      setStep(next);
      if (next === 1) window.setTimeout(() => nameRef.current?.focus({ preventScroll: true }), prefersLessMotion() ? 0 : 200);
    },
    [step],
  );

  // ---- photo ----
  const takeFile = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      let raw = '';
      try {
        raw = URL.createObjectURL(file);
        const img = await loadImage(raw);
        // Shrink big phone photos first, so older phones don't stall.
        const k = Math.min(1, 1400 / Math.max(img.naturalWidth, img.naturalHeight));
        const c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * k);
        c.height = Math.round(img.naturalHeight * k);
        c.getContext('2d')?.drawImage(img, 0, 0, c.width, c.height);
        const own: Photo = { kind: 'own', source: c, w: c.width, h: c.height };
        setPhoto(own);
        setFrame(autoFrame(own));
        setNotice('');
        tap(8);
      } catch {
        setNotice('That photo wouldn’t open. Try another, or use the Gala seal.');
      } finally {
        if (raw) URL.revokeObjectURL(raw);
      }
    },
    [tap],
  );
  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    void takeFile(e.target.files?.[0]);
    e.target.value = '';
  };
  const noPhoto = () => {
    setPhoto({ kind: 'none', source: null, w: 1, h: 1 });
    tap(8);
    go(1);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (photo.kind !== 'own' || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const k = FEED.W / r.width;
    const cx = (e.clientX - r.left) * k;
    const cy = (e.clientY - r.top) * k;
    const b = photoBox();
    if (cx < b.x || cx > b.x + b.w || cy < b.y || cy > b.y + b.h) return;
    pan.current = { x: e.clientX, y: e.clientY, ox: frame.ox, oy: frame.oy, k };
    cardRef.current.setPointerCapture(e.pointerId);
    e.preventDefault();
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const p = pan.current;
    if (!p) return;
    setFrame((f) => clampFrame(photo, { zoom: f.zoom, ox: p.ox + (e.clientX - p.x) * p.k, oy: p.oy + (e.clientY - p.y) * p.k }));
  };
  const endPan = () => {
    pan.current = null;
  };

  // ---- the moment: trip stamp, Gala stamp, then the post builds around the passport ----
  const thud = () => {
    const c = cardRef.current;
    if (!c || prefersLessMotion()) return;
    c.classList.remove('is-thud');
    void c.offsetWidth;
    c.classList.add('is-thud');
  };
  const cancelStamping = () => {
    run.current += 1;
    running.current = false;
    setBuilding(false);
  };
  const stampAndBuild = async (t: PostTrip | null) => {
    if (running.current) return;
    running.current = true;
    const id = ++run.current;
    const live = () => run.current === id;
    const firstTime = !built;
    setTrip(t);
    setPicked(t ? t.id : GALA_STAMP_ID);
    const exporting = makePosts({ name: shownName, photo, frame, trip: t });
    if (t) {
      setTripStamp((s) => ({ id: t.id, key: (s?.key ?? 0) + 1 }));
      await wait(210);
      if (!live()) return;
      thud();
      tap(18);
      await wait(300);
      if (!live()) return;
    } else {
      setTripStamp(null);
    }
    if (firstTime) {
      setGalaKey((k) => k + 1);
      await wait(210);
      if (!live()) return;
      thud();
      tap(26);
      await wait(420);
      if (!live()) return;
      setBuilt(true);
      setBuilding(true);
      await wait(860);
      if (!live()) return;
      setBuilding(false);
    }
    await exporting;
    if (!live()) return;
    if (firstTime) tap(12);
    running.current = false;
    setToast('');
    go(3);
  };

  // ---- share ----
  const copyCaption = async (from: PostInput) => {
    try {
      await navigator.clipboard.writeText(caption(from));
      return true;
    } catch {
      return false;
    }
  };
  const share = async () => {
    const blob = post.current;
    if (!blob) return;
    const copied = await copyCaption(input);
    const hint = copied ? 'Caption copied. Paste it into your post.' : 'Tap “Copy caption”, then paste it into your post.';
    const fileName = 'sparkpoint-gala-join-me.jpg';
    if (canShareFiles) {
      try {
        await navigator.share({ files: [new File([blob], fileName, { type: 'image/jpeg' })] });
        setToast(hint);
        return;
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setToast(copied ? 'Caption copied, ready when you are.' : '');
          return;
        }
      }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
    setToast(`Saved. ${hint}`);
  };

  const startOver = () => {
    cancelStamping();
    setName('');
    setTrip(null);
    setPicked(null);
    setBuilt(false);
    setTripStamp(null);
    setGalaKey(0);
    setToast('');
    post.current = null;
    loadImage(SAMPLE_SRC)
      .then((img) => {
        const sample: Photo = { kind: 'sample', source: img, w: img.naturalWidth, h: img.naturalHeight };
        setPhoto(sample);
        setFrame(autoFrame(sample));
      })
      .catch(() => setPhoto({ kind: 'sample', source: null, w: 600, h: 770 }));
    go(0);
  };

  const tripArt = tripStamp ? artFor(TRIPS.find((t) => t.id === tripStamp.id) ?? null) : null;
  const tripPlace = tripArt ? stampPlacement('trip', tripArt.art) : null;
  const galaPlace = stampPlacement('gala', STAMPS[GALA_STAMP_ID]);
  const cardLabel = built
    ? `Your post: a World of Connections passport for ${shownName || 'You'}${trip ? `, stamped for ${trip.name}` : ''}, with the Gala’s entry stamp, reading “Join me.” Friday, December 11, 2026, Brevard, North Carolina.`
    : 'Your passport post, before stamping.';
  const ownPhoto = photo.kind === 'own';

  return (
    <div className="jm">
      <SEOHead
        title="Join me at the Gala | A World of Connections, the SparkPoint Gala"
        description="Put yourself in the Gala passport: add your photo and name, stamp your dream trip, and share a “Join me” post for A World of Connections, the SparkPoint Gala, on Friday, December 11, 2026. Your photo never leaves your device."
        path={PAGE_PATH}
        image={SHARE_IMAGE}
        imageAlt="A World of Connections, the SparkPoint Gala: the title over an airplane wing above golden clouds at sunset."
        imageType="image/jpeg"
        imageWidth={1200}
        imageHeight={630}
      />
      <div className="jm-app">
        <header className="jm-head">
          {step === 0 ? (
            <Link className="jm-back" to={GALA_PATH} aria-label="Back to the Gala page">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </Link>
          ) : (
            <button className="jm-back" type="button" aria-label="Back" onClick={() => { cancelStamping(); tap(8); go(step - 1); }}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
          )}
          <div className="jm-title">
            <h1>Join me at the Gala</h1>
            <p>Dec 11 · Brevard, NC</p>
          </div>
          <ol className="jm-dots" aria-label={`Step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}>
            {STEPS.map((s, i) => (
              <li key={s} className={i <= step ? 'is-on' : undefined} />
            ))}
          </ol>
        </header>

        <main className="jm-stage">
          <div
            ref={cardRef}
            className={['jm-card', built ? 'is-built' : '', building ? 'is-building' : '', ownPhoto ? 'can-pan' : ''].join(' ')}
            role="img"
            aria-label={cardLabel}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endPan}
            onPointerCancel={endPan}
          >
            <canvas ref={baseRef} className="jm-layer jm-base" width={FEED.W} height={FEED.H} />
            <canvas ref={topRef} className="jm-layer jm-top" width={FEED.W} height={FEED.H} aria-hidden="true" />
            <canvas ref={bottomRef} className="jm-layer jm-bottom" width={FEED.W} height={FEED.H} aria-hidden="true" />
            {tripStamp && tripPlace && stampSrc[tripStamp.id] ? (
              <span
                key={`trip-${tripStamp.key}`}
                className="jm-stamp is-land"
                style={{ left: tripPlace.left, top: tripPlace.top, width: tripPlace.width, ['--r' as string]: tripPlace.rotate }}
                aria-hidden="true"
              >
                <img src={stampSrc[tripStamp.id]} alt="" />
              </span>
            ) : null}
            {galaKey > 0 && stampSrc[GALA_STAMP_ID] ? (
              <span
                key={`gala-${galaKey}`}
                className="jm-stamp is-land"
                style={{ left: galaPlace.left, top: galaPlace.top, width: galaPlace.width, ['--r' as string]: galaPlace.rotate }}
                aria-hidden="true"
              >
                <img src={stampSrc[GALA_STAMP_ID]} alt="" />
              </span>
            ) : null}
            {ownPhoto && step === 0 ? <span className="jm-pan-hint">Drag the photo to reframe</span> : null}
          </div>
        </main>

        <section className="jm-tray" aria-live="polite">
          {step === 0 ? (
            <div className={`jm-panel is-${stepDir}`} key="photo">
              <h2>
                Add your <b>photo.</b>
              </h2>
              <div className="jm-row">
                <label className="jm-btn jm-file">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3v11H4z" /><circle cx="12" cy="13" r="3.6" /></svg>
                  Take photo
                  <input type="file" accept="image/*" capture="user" onChange={onFile} aria-label="Take a photo with your camera" />
                </label>
                <label className="jm-btn jm-file">
                  <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="14" /><path d="M4 16l5-5 4 4 3-3 4 4" /></svg>
                  Choose
                  <input type="file" accept="image/*" onChange={onFile} aria-label="Choose a photo from your device" />
                </label>
              </div>
              {ownPhoto ? (
                <>
                  <label className="jm-zoom">
                    Zoom
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.01}
                      value={frame.zoom}
                      onChange={(e) => setFrame(clampFrame(photo, { ...frame, zoom: Number(e.target.value) }))}
                    />
                  </label>
                  <button className="jm-btn jm-primary" type="button" onClick={() => { tap(8); go(1); }}>
                    Next
                  </button>
                </>
              ) : null}
              <button className="jm-link" type="button" onClick={noPhoto}>
                No photo, use the Gala seal
              </button>
              <p className="jm-privacy">
                <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="1" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
                <span role={notice ? 'alert' : undefined}>{notice || PRIVACY}</span>
              </p>
            </div>
          ) : null}

          {step === 1 ? (
            <div className={`jm-panel is-${stepDir}`} key="name">
              <h2>
                Your name, for <b>the passport.</b>
              </h2>
              <label className="jm-sr" htmlFor="jm-name">
                Your name
              </label>
              <input
                ref={nameRef}
                id="jm-name"
                className="jm-input"
                value={name}
                maxLength={24}
                autoComplete="name"
                autoCapitalize="words"
                enterKeyHint="next"
                placeholder="Your name"
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    (e.target as HTMLInputElement).blur();
                    tap(8);
                    go(2);
                  }
                }}
              />
              <button className="jm-btn jm-primary" type="button" onClick={() => { tap(8); go(2); }}>
                Next
              </button>
            </div>
          ) : null}

          {step === 2 ? (
            <div className={`jm-panel is-${stepDir}`} key="trip">
              <h2>
                Stamp your <b>dream trip.</b>
              </h2>
              <div className="jm-trips" role="group" aria-label="Dream trips">
                {TRIPS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    className="jm-trip"
                    aria-pressed={picked === t.id}
                    aria-label={`Stamp Connection ${t.connection}, ${t.name}`}
                    onClick={() => void stampAndBuild(t)}
                  >
                    {stampSrc[t.id] ? <img src={stampSrc[t.id]} alt="" /> : null}
                    <span>{t.name}</span>
                  </button>
                ))}
                <button
                  type="button"
                  className="jm-trip"
                  aria-pressed={picked === GALA_STAMP_ID}
                  aria-label="Just the Gala stamp, no trip"
                  onClick={() => void stampAndBuild(null)}
                >
                  {stampSrc[GALA_STAMP_ID] ? <img src={stampSrc[GALA_STAMP_ID]} alt="" /> : null}
                  <span>Just the Gala</span>
                </button>
              </div>
              <p className="jm-note">Tap a stamp. The Gala stamps you in too.</p>
            </div>
          ) : null}

          {step === 3 ? (
            <div className={`jm-panel is-${stepDir}`} key="done">
              <h2>
                Your post is <b>ready.</b>
              </h2>
              <button className="jm-btn jm-primary" type="button" onClick={() => void share()}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4M8 8l4-4 4 4" /><path d="M5 12v8h14v-8" /></svg>
                {canShareFiles ? 'Share' : 'Save image'}
              </button>
              <p className="jm-note">
                {canShareFiles
                  ? 'Post it, text it, email it, save it to your photos or print it: it’s all in your phone’s share menu.'
                  : 'A high-resolution image for Facebook, Instagram, email or printing.'}
              </p>
              <p className="jm-toast" role="status">{toast}</p>
              <div className="jm-links">
                <button
                  className="jm-link"
                  type="button"
                  onClick={async () => setToast((await copyCaption(input)) ? 'Caption copied.' : 'Couldn’t copy on this device.')}
                >
                  Copy caption
                </button>
                <button className="jm-link" type="button" onClick={() => go(2)}>
                  Change trip
                </button>
                <button className="jm-link" type="button" onClick={startOver}>
                  Start over
                </button>
                <Link className="jm-link" to={GALA_PATH}>
                  The Gala page
                </Link>
              </div>
            </div>
          ) : null}
        </section>
      </div>
      {/* iOS 18+ ticks when a switch toggles; the haptics hook clicks this. */}
      <label ref={hapticLabel} className="jm-haptic" aria-hidden="true">
        <input type="checkbox" tabIndex={-1} {...{ switch: '' }} />
      </label>
    </div>
  );
}
