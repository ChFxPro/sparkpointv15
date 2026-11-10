import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Download, Link2, Search } from 'lucide-react';

// The program recordings as something to watch rather than a file to download:
// chapters, captions, and a transcript that follows the video, can be searched, and
// jumps the video to any line. `#moment-<part>-<seconds>` opens the player at that
// moment (the pull quotes link this way too), and every transcript line can copy one.
// Transcripts and captions were made with Whisper on the 1080p copies and lightly
// corrected; they live in public/assets/collab-lab/ so the <track> is same-origin.

export type ProgramPart = {
  id: string;
  label: string;
  title: string;
  src: string;
  poster: string;
  captions: string;
  transcript: string;
  duration: number;
  bytes: number;
  download: string;
  chapters: { t: number; title: string }[];
};

type Segment = { start: number; end: number; text: string };

export const formatTime = (seconds: number) => {
  const s = Math.max(0, Math.floor(seconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
};

export const momentHash = (partIndex: number, seconds: number) => `#moment-${partIndex + 1}-${Math.floor(seconds)}`;

const parseMoment = (hash: string) => {
  const match = /^#moment-(\d+)-(\d+)$/.exec(hash);
  return match ? { part: Number(match[1]) - 1, t: Number(match[2]) } : null;
};

const size = (bytes: number) => (bytes >= 1e9 ? `${(bytes / 1e9).toFixed(1)} GB` : `${Math.round(bytes / 1e6)} MB`);

export function ProgramPlayer({ parts }: { parts: ProgramPart[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const pendingSeek = useRef<number | null>(null);
  const [partIndex, setPartIndex] = useState(0);
  const [time, setTime] = useState(0);
  const [query, setQuery] = useState('');
  const [follow, setFollow] = useState(true);
  const [copied, setCopied] = useState<number | null>(null);
  const [transcripts, setTranscripts] = useState<Record<string, Segment[]>>({});
  const part = parts[partIndex];
  const segments = transcripts[part.id];

  // Load a part's transcript the first time it's shown.
  useEffect(() => {
    if (transcripts[part.id]) return;
    let cancelled = false;
    fetch(part.transcript)
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => [])
      .then((data: Segment[]) => !cancelled && setTranscripts((t) => ({ ...t, [part.id]: Array.isArray(data) ? data : [] })));
    return () => {
      cancelled = true;
    };
  }, [part.id, part.transcript, transcripts]);

  const seek = useCallback(
    (index: number, seconds: number, play = true) => {
      setFollow(true);
      if (index !== partIndex) {
        pendingSeek.current = seconds;
        setPartIndex(index);
        setTime(seconds);
        return;
      }
      const video = videoRef.current;
      if (!video) return;
      if (video.readyState >= 1) video.currentTime = seconds;
      else pendingSeek.current = seconds;
      setTime(seconds);
      if (play) void video.play().catch(() => {});
    },
    [partIndex],
  );

  // `#moment-…` links, on arrival and when a pull quote is clicked.
  useEffect(() => {
    const open = () => {
      const moment = parseMoment(window.location.hash);
      if (!moment || !parts[moment.part]) return;
      // Jump (not glide) to the player, now and again once images above have loaded and
      // shifted the layout, and after the site's ScrollToTop has run on arrival.
      const land = () => sectionRef.current?.scrollIntoView({ block: 'start' });
      land();
      window.setTimeout(land, 700);
      seek(moment.part, moment.t, false);
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, [parts, seek]);

  const activeIndex = useMemo(() => {
    if (!segments) return -1;
    let lo = 0;
    let hi = segments.length - 1;
    let found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (segments[mid].start <= time) {
        found = mid;
        lo = mid + 1;
      } else hi = mid - 1;
    }
    return found;
  }, [segments, time]);

  const activeChapter = useMemo(() => {
    let found = 0;
    part.chapters.forEach((c, i) => {
      if (c.t <= time) found = i;
    });
    return found;
  }, [part.chapters, time]);

  // Keep the current line in view inside the transcript panel (never scrolls the page).
  useEffect(() => {
    const list = listRef.current;
    if (!list || !follow || query || activeIndex < 0) return;
    const item = list.children[activeIndex] as HTMLElement | undefined;
    if (!item) return;
    const top = item.offsetTop - list.clientHeight / 3;
    // Glide line to line while it plays; jump after a seek, which can be a long way off.
    const far = Math.abs(list.scrollTop - top) > list.clientHeight;
    list.scrollTo({ top, behavior: far ? 'auto' : 'smooth' });
  }, [activeIndex, follow, query]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!segments || !q) return null;
    return segments.map((s, i) => (s.text.toLowerCase().includes(q) ? i : -1)).filter((i) => i >= 0);
  }, [segments, query]);

  const copyMoment = async (seconds: number) => {
    const url = `${window.location.origin}${window.location.pathname}${momentHash(partIndex, seconds)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(seconds);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      window.location.hash = momentHash(partIndex, seconds);
    }
  };

  const visibleSegments = segments?.map((s, i) => ({ ...s, i })).filter((s) => !matches || matches.includes(s.i));

  return (
    <div className="clb-player" ref={sectionRef} id="program">
      <div className="clb-player-tabs" role="tablist" aria-label="Program recording">
        {parts.map((p, i) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={i === partIndex}
            onClick={() => {
              setQuery('');
              setPartIndex(i);
              setTime(0);
            }}
          >
            <strong>{p.label}</strong>
            <span>
              {p.title} · {Math.round(p.duration / 60)} min
            </span>
          </button>
        ))}
      </div>

      <div className="clb-player-grid">
        <div className="clb-player-main">
          <div className="clb-player-video">
            <video
              key={part.id}
              ref={videoRef}
              src={part.src}
              poster={part.poster}
              controls
              playsInline
              preload="metadata"
              onLoadedMetadata={(event) => {
                if (pendingSeek.current !== null) {
                  event.currentTarget.currentTime = pendingSeek.current;
                  pendingSeek.current = null;
                }
              }}
              onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
              onSeeked={(event) => setTime(event.currentTarget.currentTime)}
            >
              <track kind="captions" srcLang="en" label="English" src={part.captions} default />
            </video>
          </div>

          <ol className="clb-chapters" aria-label={`Chapters in ${part.label}`}>
            {part.chapters.map((chapter, i) => (
              <li key={chapter.t}>
                <button
                  type="button"
                  aria-current={i === activeChapter ? 'true' : undefined}
                  onClick={() => seek(partIndex, chapter.t)}
                >
                  <span className="clb-chapter-time">{formatTime(chapter.t)}</span>
                  <span>{chapter.title}</span>
                </button>
              </li>
            ))}
          </ol>

          <a className="rhp-action clb-player-download" href={part.download}>
            <Download aria-hidden="true" size={17} />
            Download {part.label.toLowerCase()} · {size(part.bytes)}
          </a>
        </div>

        <div className="clb-transcript">
          <div className="clb-transcript-head">
            <h3>Transcript</h3>
            <label className="clb-transcript-search">
              <Search aria-hidden="true" size={16} />
              <span className="sr-only">Search the transcript</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search what was said"
              />
            </label>
            <p className="clb-transcript-status" aria-live="polite">
              {matches ? `${matches.length} ${matches.length === 1 ? 'line' : 'lines'} mention “${query.trim()}”` : 'Tap a line to jump there.'}
            </p>
          </div>
          {segments && segments.length === 0 ? (
            <p className="clb-transcript-status">The transcript for this part isn’t ready yet.</p>
          ) : segments ? (
            <ol ref={listRef} className="clb-transcript-list" onWheel={() => setFollow(false)} onTouchMove={() => setFollow(false)}>
              {visibleSegments?.map((s) => (
                <li key={s.i} className={s.i === activeIndex ? 'is-active' : undefined}>
                  <button type="button" onClick={() => seek(partIndex, s.start)}>
                    <span className="clb-transcript-time">{formatTime(s.start)}</span>
                    <span>{s.text}</span>
                  </button>
                  <button
                    type="button"
                    className="clb-transcript-link"
                    onClick={() => void copyMoment(s.start)}
                    aria-label={`Copy a link to ${formatTime(s.start)}`}
                    title="Copy a link to this moment"
                  >
                    {copied === Math.floor(s.start) || copied === s.start ? (
                      <Check aria-hidden="true" size={15} />
                    ) : (
                      <Link2 aria-hidden="true" size={15} />
                    )}
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <p className="clb-transcript-status">Loading the transcript…</p>
          )}
          {!follow && !query && (
            <button type="button" className="clb-transcript-follow" onClick={() => setFollow(true)}>
              Follow along
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
