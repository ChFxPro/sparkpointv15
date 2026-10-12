import '@fontsource-variable/fraunces';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Copy, Download, Mail, Share2, X } from 'lucide-react';
import { Link } from 'react-router';
import { SEOHead } from '../components/SEOHead';
import { canonicalUrl } from '../lib/siteOrigin';
import { projectId } from '../utils/supabase/info';
import { RuralHealthMasthead } from './RuralHealthMasthead';
import shareData from '../data/ruralHealthPhotoShare.json';
import { conveningPartners, sponsorTiers } from '../data/ruralHealthConveningSponsors';
import './ruralHealthConvening.css';
import './ruralHealthPhotoShare.css';

// Unlisted photo-share page for the October 1, 2026 convening — a standalone page,
// separate from the recap at /rural-health-convening (which it doesn't change and
// which doesn't link here). It borrows the recap's masthead and paper/forest/brass
// styling so the two read as a set. Reached by direct link only: noindex, and
// prerender.mjs keeps it out of the sitemap (UNLISTED). It is still prerendered so a
// shared link unfurls with a real preview instead of hitting the GitHub Pages 404.
//
// The image files live in the public-read Supabase Storage bucket
// `convening-photos` (rural-health-2026/), not in this repo, so the gallery can grow
// to hundreds of photos. Their metadata — sets, optional titles, alt, sizes — plus the
// credit and usage terms live in src/data/ruralHealthPhotoShare.json (display order =
// array order). Add a batch with
// `SUPABASE_SECRET_KEY=... node scripts/rural-health-photo-share.mjs ingest <folder> --set <id>`.
// `#photo-<id>` deep-links straight to a photo in the lightbox.

type SharePhoto = (typeof shareData.photos)[number];

const PAGE_PATH = '/rural-health-convening/photos';
const RECAP_PATH = '/rural-health-convening';
const PHOTO_BASE = `https://${projectId}.supabase.co/storage/v1/object/public/convening-photos/rural-health-2026`;
const PAGE_SIZE = 36;
const { creditLine, photos } = shareData;
const setTitle: Record<string, string> = Object.fromEntries(shareData.sets.map((s) => [s.id, s.title]));
const sets = shareData.sets
  .map((set) => ({ ...set, count: photos.filter((p) => p.set === set.id).length }))
  .filter((set) => set.count > 0);
const featured = photos[0];

const webp = (photo: SharePhoto, size: 960 | 1920) => `${PHOTO_BASE}/rhp-${photo.id}-${size}.webp`;
const downloadName = (photo: SharePhoto) => `${shareData.downloadPrefix}-${photo.id}.jpg`;
const fileUrl = (photo: SharePhoto) => `${PHOTO_BASE}/${downloadName(photo)}`;
// The bucket is cross-origin, where browsers ignore <a download>; Supabase's
// `?download=` makes it answer with Content-Disposition: attachment instead.
const downloadHref = (photo: SharePhoto) => `${fileUrl(photo)}?download=${encodeURIComponent(downloadName(photo))}`;
const photoLabel = (photo: SharePhoto) => (photo.title ? `photo ${photo.id}, ${photo.title}` : `photo ${photo.id}`);

// Written in the participant's voice, about the day. No photo credit (the caption
// travels with whatever photo is picked) and no thanks to SparkPoint, which would read
// as the host scripting its own praise.
const SUGGESTED_CAPTION = `Spent October 1 at the 2026 WNC Regional Rural Health Convening in Brevard with rural health leaders from across Western North Carolina. We walked a family's story through the Rural Health Field Simulator, saw where the doors, delays, and handoffs really are, and left with new people to call. Rural health is stronger when we build it together. ${canonicalUrl(RECAP_PATH).replace(/^https?:\/\//, '')}`;

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older Safari and non-secure contexts: fall back to a hidden textarea.
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

// ── Sharing and downloading ──
//
// Sharing never hands out this page's link: the page is passed to participants
// directly, not meant to spread. A website can't post an image to Instagram,
// Facebook, or LinkedIn itself — their web share links take a URL only — so photos
// go through the device's share sheet as files (phones, and some desktop browsers),
// which is also how one post can carry several photos. Where a browser can't share
// files, only Download is offered. People pick up to MAX_SELECT photos at a time:
// enough for a post (Instagram's carousel takes 10), not the whole set. Several
// photos download as one ZIP built in the browser from just that selection.

const MAX_SELECT = 5;

// Whether this browser can share image files. Checked on the client after mount, so
// the prerendered HTML (and browsers without it) show Download only.
function detectFileShare() {
  try {
    if (typeof navigator === 'undefined' || !navigator.canShare) return false;
    const probe = new File([new Uint8Array([0xff, 0xd8, 0xff])], 'probe.jpg', { type: 'image/jpeg' });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

// navigator.share must run inside the tap's user activation, which fetching a 1 MB
// photo can outlast, so files are fetched ahead of time (when a photo is selected,
// hovered, focused, or opened) and the tap shares what's already in hand.
const fileCache = new Map<string, Promise<File | null>>();
function loadFile(photo: SharePhoto) {
  let pending = fileCache.get(photo.id);
  if (!pending) {
    pending = fetch(fileUrl(photo))
      .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(String(res.status)))))
      .then((blob) => new File([blob], downloadName(photo), { type: 'image/jpeg' }))
      .catch(() => {
        fileCache.delete(photo.id);
        return null;
      });
    fileCache.set(photo.id, pending);
  }
  return pending;
}

const isAbort = (error: unknown) => error instanceof DOMException && error.name === 'AbortError';

function clickLink(href: string, filename?: string) {
  const link = document.createElement('a');
  link.href = href;
  link.rel = 'noopener';
  if (filename) link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

// Minimal "stored" (uncompressed) ZIP — JPEGs don't compress further, and this keeps
// the bundle free of a ZIP library for one small selection.
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(bytes: Uint8Array) {
  let c = 0xffffffff;
  for (const byte of bytes) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function storedZip(entries: { name: string; data: Uint8Array<ArrayBuffer> }[]) {
  const encoder = new TextEncoder();
  const parts: BlobPart[] = [];
  const central: Uint8Array<ArrayBuffer>[] = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBytes = encoder.encode(name);
    const crc = crc32(data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint16(6, 0x0800, true); // UTF-8 names
    local.setUint16(12, 0x0021, true); // 1980-01-01
    local.setUint32(14, crc, true);
    local.setUint32(18, data.length, true);
    local.setUint32(22, data.length, true);
    local.setUint16(26, nameBytes.length, true);
    parts.push(local.buffer, nameBytes, data);

    const dir = new DataView(new ArrayBuffer(46));
    dir.setUint32(0, 0x02014b50, true);
    dir.setUint16(4, 20, true);
    dir.setUint16(6, 20, true);
    dir.setUint16(8, 0x0800, true);
    dir.setUint16(14, 0x0021, true);
    dir.setUint32(16, crc, true);
    dir.setUint32(20, data.length, true);
    dir.setUint32(24, data.length, true);
    dir.setUint16(28, nameBytes.length, true);
    dir.setUint32(42, offset, true);
    central.push(new Uint8Array(dir.buffer), nameBytes);
    offset += 30 + nameBytes.length + data.length;
  }
  const centralSize = central.reduce((sum, part) => sum + part.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, entries.length, true);
  end.setUint16(10, entries.length, true);
  end.setUint32(12, centralSize, true);
  end.setUint32(16, offset, true);
  return new Blob([...parts, ...central, end.buffer], { type: 'application/zip' });
}

function usePhotoActions(announce: (message: string) => void) {
  // Instagram drops any text that comes with shared images, so the caption goes on
  // the clipboard first (before the share sheet takes the tap's activation).
  const share = useCallback(
    async (list: SharePhoto[]) => {
      const captionCopied = copyText(SUGGESTED_CAPTION);
      try {
        const files = await Promise.all(list.map(loadFile));
        if (files.some((file) => !file)) throw new Error('A photo didn’t load');
        await navigator.share({ files: files as File[] });
        announce((await captionCopied) ? 'Caption copied—paste it into your post' : 'Shared');
      } catch (error) {
        if (isAbort(error)) return;
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          // The files arrived after the tap's activation expired; they're cached now.
          announce(list.length === 1 ? 'Photo ready—tap Share again' : 'Photos ready—tap Share again');
          return;
        }
        announce('Couldn’t open sharing here—try Download instead');
      }
    },
    [announce],
  );

  const download = useCallback(
    async (list: SharePhoto[]) => {
      if (list.length === 1) {
        clickLink(downloadHref(list[0]));
        return;
      }
      announce(`Preparing ${list.length} photos…`);
      const files = await Promise.all(list.map(loadFile));
      if (files.some((file) => !file)) {
        announce('A photo didn’t load—please try again');
        return;
      }
      const folder = `${shareData.downloadPrefix}-Photos`;
      const note = `2026 WNC Regional Rural Health Convening · October 1, 2026 · Brevard, NC\n\n${creditLine}.\n\n${shareData.usage.map((line) => `- ${line}`).join('\n')}\n`;
      const entries = [
        { name: `${folder}/About these photos.txt`, data: new TextEncoder().encode(note) },
        ...(await Promise.all(
          (files as File[]).map(async (file) => ({ name: `${folder}/${file.name}`, data: new Uint8Array(await file.arrayBuffer()) })),
        )),
      ];
      const url = URL.createObjectURL(storedZip(entries));
      clickLink(url, `${folder}.zip`);
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      announce(`${list.length} photos downloaded`);
    },
    [announce],
  );

  return { share, download };
}

function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2200);
    return () => window.clearTimeout(timer);
  }, [copied]);
  return (
    <button type="button" className="rhp-copy" onClick={async () => setCopied(await copyText(text))} aria-live="polite">
      {copied ? <Check aria-hidden="true" size={16} /> : <Copy aria-hidden="true" size={16} />}
      {copied ? copiedLabel : label}
    </button>
  );
}

function PhotoTile({
  photo,
  selected,
  canShareFiles,
  onOpen,
  onToggle,
  onShare,
}: {
  photo: SharePhoto;
  selected: boolean;
  canShareFiles: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onShare: () => void;
}) {
  const warm = () => void loadFile(photo);
  return (
    <li className={`rhp-tile${selected ? ' is-selected' : ''}`} id={`photo-${photo.id}`}>
      <div className="rhp-tile-media">
        <button type="button" className="rhp-tile-open" onClick={onOpen} aria-label={`Open ${photoLabel(photo)}`}>
          <img
            src={webp(photo, 960)}
            srcSet={`${webp(photo, 960)} 960w, ${webp(photo, 1920)} 1920w`}
            sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 25vw"
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            decoding="async"
            onError={(event) => {
              // Up to two retries after short pauses, bypassing any cached failure. Right
              // after a batch upload, Supabase's CDN can briefly refuse a burst of
              // first-time requests; an immediate retry would hit the same wall.
              const img = event.currentTarget;
              const tries = Number(img.dataset.tries ?? 0);
              if (tries >= 2) return;
              img.dataset.tries = String(tries + 1);
              window.setTimeout(() => {
                img.srcset = '';
                img.src = `${webp(photo, 960)}?retry=${tries + 1}`;
              }, tries === 0 ? 1500 : 4000);
            }}
          />
        </button>
        <button
          type="button"
          className="rhp-select"
          aria-pressed={selected}
          aria-label={`${selected ? 'Deselect' : 'Select'} ${photoLabel(photo)}`}
          title={selected ? 'Selected' : 'Select'}
          onClick={onToggle}
        >
          <Check aria-hidden="true" size={16} strokeWidth={3} />
        </button>
      </div>
      <div className="rhp-tile-bar">
        <span className="rhp-tile-label">
          <b>No. {photo.id}</b>
          {photo.title && <span>{photo.title}</span>}
        </span>
        <a
          className="rhp-icon-action"
          href={downloadHref(photo)}
          aria-label={`Download ${photoLabel(photo)} (JPEG, ${(photo.bytes / 1e6).toFixed(1)} MB)`}
          title="Download"
        >
          <Download aria-hidden="true" size={17} />
        </a>
        {canShareFiles && (
          <button
            type="button"
            className="rhp-icon-action"
            onClick={onShare}
            onPointerEnter={warm}
            onPointerDown={warm}
            onFocus={warm}
            aria-label={`Share ${photoLabel(photo)}`}
            title="Share"
          >
            <Share2 aria-hidden="true" size={17} />
          </button>
        )}
      </div>
    </li>
  );
}

function SelectionTray({
  selected,
  canShareFiles,
  onShare,
  onDownload,
  onRemove,
  onClear,
}: {
  selected: SharePhoto[];
  canShareFiles: boolean;
  onShare: () => void;
  onDownload: () => void;
  onRemove: (photo: SharePhoto) => void;
  onClear: () => void;
}) {
  if (!selected.length) return null;
  const many = selected.length > 1;
  return (
    <div className="rhp-tray" role="region" aria-label="Selected photos">
      <div className="rhp-tray-inner">
        <ul className="rhp-tray-thumbs">
          {selected.map((photo) => (
            <li key={photo.id}>
              <button type="button" onClick={() => onRemove(photo)} aria-label={`Remove ${photoLabel(photo)} from selection`}>
                <img src={webp(photo, 960)} alt="" width={photo.width} height={photo.height} />
                <X aria-hidden="true" size={12} strokeWidth={3} />
              </button>
            </li>
          ))}
        </ul>
        <div className="rhp-tray-copy">
          <p>
            <strong>{selected.length}</strong> of {MAX_SELECT} selected
          </p>
          <p className="rhp-tray-hint">
            {canShareFiles
              ? 'Share posts them together, and copies a caption to paste in.'
              : 'To post from a computer, download, then add the photos to your post.'}
          </p>
        </div>
        <div className="rhp-tray-actions">
          {canShareFiles && (
            <button type="button" className="rhp-tray-button rhp-tray-primary" onClick={onShare}>
              <Share2 aria-hidden="true" size={17} />
              Share {many ? selected.length : ''}
            </button>
          )}
          <button
            type="button"
            className={`rhp-tray-button${canShareFiles ? '' : ' rhp-tray-primary'}`}
            onClick={onDownload}
          >
            <Download aria-hidden="true" size={17} />
            Download {many ? selected.length : ''}
          </button>
          <button type="button" className="rhp-tray-clear" onClick={onClear}>
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}

function PhotoLightbox({
  list,
  index,
  onClose,
  onStep,
  onShare,
  canShareFiles,
  isSelected,
  onToggle,
}: {
  list: SharePhoto[];
  index: number;
  onClose: () => void;
  onStep: (delta: number) => void;
  onShare: (photo: SharePhoto) => void;
  canShareFiles: boolean;
  isSelected: (photo: SharePhoto) => boolean;
  onToggle: (photo: SharePhoto) => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const photo = list[index];

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
    void loadFile(photo);
    // Warm the neighbours so stepping through feels instant.
    for (const delta of [1, -1]) new Image().src = webp(list[(index + delta + list.length) % list.length], 1920);
  }, [index, list, photo]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
      else if (event.key === 'ArrowRight') onStep(1);
      else if (event.key === 'ArrowLeft') onStep(-1);
      else if (event.key === 'Tab') {
        // aria-modal alone doesn't stop Tab from reaching the page behind the overlay.
        const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href]') ?? []);
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
      className="rh-lightbox rhp-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`Photo ${index + 1} of ${list.length}${photo.title ? `: ${photo.title}` : ''}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onTouchStart={(event) => {
        const t = event.touches[0];
        touchStart.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start) return;
        const t = event.changedTouches[0];
        const dx = t.clientX - start.x;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(t.clientY - start.y) * 1.5) onStep(dx < 0 ? 1 : -1);
      }}
    >
      <button ref={closeRef} type="button" className="rh-lightbox-close" onClick={onClose} aria-label="Close photo">
        <X aria-hidden="true" size={26} />
      </button>
      <button type="button" className="rh-lightbox-prev" onClick={() => onStep(-1)} aria-label="Previous photo">
        <ChevronLeft aria-hidden="true" size={30} />
      </button>
      <figure>
        <img key={photo.id} src={webp(photo, 1920)} alt={photo.alt} width={photo.width} height={photo.height} />
        <figcaption>
          <span>
            No. {photo.id} · {setTitle[photo.set]} · {index + 1} of {list.length}
          </span>
          {photo.title && <strong>{photo.title}</strong>}
          <div className="rhp-lightbox-actions">
            {canShareFiles && (
              <button type="button" className="rhp-action rhp-action-solid" onClick={() => onShare(photo)}>
                <Share2 aria-hidden="true" size={17} />
                Share
              </button>
            )}
            <a className={`rhp-action${canShareFiles ? '' : ' rhp-action-solid'}`} href={downloadHref(photo)}>
              <Download aria-hidden="true" size={17} />
              Download
            </a>
            <button type="button" className="rhp-action" aria-pressed={isSelected(photo)} onClick={() => onToggle(photo)}>
              <Check aria-hidden="true" size={17} />
              {isSelected(photo) ? 'Selected' : 'Select'}
            </button>
          </div>
        </figcaption>
      </figure>
      <button type="button" className="rh-lightbox-next" onClick={() => onStep(1)} aria-label="Next photo">
        <ChevronRight aria-hidden="true" size={30} />
      </button>
    </div>
  );
}

function SponsorWall() {
  return (
    <section className="rhp-sponsors" aria-labelledby="rhp-sponsors-title">
      <div className="rh-shell">
        <div className="rhp-section-head rhp-section-head-center">
          <p className="rhp-eyebrow">With gratitude</p>
          <h2 id="rhp-sponsors-title">The people who made the day possible</h2>
          <p>
            Thank you to the sponsors who underwrote the convening and the partners who helped build it. Tag
            them when you share.
          </p>
        </div>

        <div className="rhp-tiers">
          {sponsorTiers.map((tier) => (
            <div key={tier.id} className={`rhp-tier rhp-tier-${tier.id}`}>
              <p className="rhp-tier-label">{tier.label}</p>
              <ul>
                {tier.sponsors.map((sponsor) => (
                  <li key={sponsor.name}>
                    <a href={sponsor.href} target="_blank" rel="noreferrer" aria-label={`${sponsor.name} (opens in a new tab)`}>
                      <img
                        src={sponsor.src}
                        alt={sponsor.name}
                        width={sponsor.width}
                        height={sponsor.height}
                        loading="lazy"
                        style={{ '--optical': sponsor.optical ?? 1 } as CSSProperties}
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="rhp-tier rhp-tier-partners">
            <p className="rhp-tier-label">Hosted in partnership with</p>
            <ul>
              {conveningPartners.map((partner) => (
                <li key={partner.name}>
                  <a href={partner.href} target="_blank" rel="noreferrer" aria-label={`${partner.name} (opens in a new tab)`}>
                    <img
                      src={partner.src}
                      alt={partner.name}
                      width={partner.width}
                      height={partner.height}
                      loading="lazy"
                      style={{ '--optical': partner.optical ?? 1 } as CSSProperties}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function indexFromHash(hash: string) {
  const id = /^#photo-(\d+)$/.exec(hash)?.[1];
  const index = id ? photos.findIndex((p) => p.id === id) : -1;
  return index >= 0 ? index : null;
}

export function RuralHealthPhotoSharePage() {
  const [filter, setFilter] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE_SIZE);
  // Lightbox position within `visible` (the filtered list), or null when closed.
  const [active, setActive] = useState<number | null>(null);
  const [notice, setNotice] = useState('');
  const noticeTimer = useRef<number>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [canShareFiles, setCanShareFiles] = useState(false);

  useEffect(() => setCanShareFiles(detectFileShare()), []);

  const visible = useMemo(() => (filter ? photos.filter((p) => p.set === filter) : photos), [filter]);

  const announce = useCallback((message: string) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 3200);
  }, []);
  const { share, download } = usePhotoActions(announce);

  const selected = useMemo(
    () => selectedIds.map((id) => photos.find((p) => p.id === id)).filter((p): p is SharePhoto => Boolean(p)),
    [selectedIds],
  );
  const isSelected = useCallback((photo: SharePhoto) => selectedIds.includes(photo.id), [selectedIds]);
  const toggle = useCallback(
    (photo: SharePhoto) => {
      if (selectedIds.includes(photo.id)) {
        setSelectedIds(selectedIds.filter((id) => id !== photo.id));
      } else if (selectedIds.length >= MAX_SELECT) {
        announce(`You can pick up to ${MAX_SELECT} photos at a time`);
      } else {
        void loadFile(photo); // in hand before the Share tap
        setSelectedIds([...selectedIds, photo.id]);
      }
    },
    [announce, selectedIds],
  );

  // A deep link always opens against the full list, so clear any filter first.
  useEffect(() => {
    const open = () => {
      const index = indexFromHash(window.location.hash);
      if (index !== null) setFilter(null);
      setActive(index);
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, []);

  // Keep the address bar pointing at the open photo, so copying it shares that photo.
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    const photo = active === null ? null : visible[active];
    const next = photo ? `${pathname}${search}#photo-${photo.id}` : `${pathname}${search}`;
    if (`${pathname}${search}${hash}` !== next) window.history.replaceState(window.history.state, '', next);
  }, [active, visible]);

  const step = useCallback(
    (delta: number) => setActive((i) => (i === null ? i : (i + delta + visible.length) % visible.length)),
    [visible.length],
  );
  const close = useCallback(() => setActive(null), []);
  const openPhoto = (photo: SharePhoto) => {
    const index = visible.indexOf(photo);
    if (index >= 0) setActive(index);
    else {
      setFilter(null);
      setActive(photos.indexOf(photo));
    }
  };
  const choose = (setId: string | null) => {
    setFilter(setId);
    setShown(PAGE_SIZE);
  };

  const filterNote = filter ? shareData.sets.find((s) => s.id === filter)?.note : null;

  return (
    <div className={`rh-page rhp-page${selected.length ? ' has-tray' : ''}`}>
      <SEOHead
        title="Photos · 2026 Rural Health Convening | SparkPoint"
        description="Thank you for filling the room. Photos from the October 1, 2026 WNC Regional Rural Health Convening—free to download and share with credit."
        path={PAGE_PATH}
        image="/assets/Rural%20Health/photo-share-og.jpg"
        imageAlt={featured.alt}
        imageType="image/jpeg"
        imageWidth={1200}
        imageHeight={630}
        noindex
      />

      <a className="rh-skip-link" href="#photos">
        Skip to the photos
      </a>

      <RuralHealthMasthead backTo={RECAP_PATH} backLabel="Back to the recap" backAriaLabel="Back to the convening recap" />

      <main id="main-content">
        <section className="rhp-hero" aria-labelledby="rhp-title">
          <div className="rh-shell rhp-hero-grid">
            <div className="rhp-hero-copy">
              <p className="rh-past-kicker">
                <span aria-hidden="true">✦</span>
                October 1, 2026 · Photos from the day
              </p>
              <h1 id="rhp-title">
                <span>Thank you for</span>
                <span>filling the room.</span>
              </h1>
              <div className="rh-star-rule" aria-hidden="true">
                <span />
                <b>✦</b>
                <span />
              </div>
              <p className="rhp-lede">
                Rural health leaders from across Western North Carolina packed the barn at Deerwoode Reserve to
                listen, walk the Rural Health Field Simulator together, and leave with new people to call. These
                are the photos from that day. Pick a few favorites and share them with your network.
              </p>
              <div className="rh-actions">
                <a className="rh-button rh-button-primary" href="#photos">
                  See the photos
                  <ArrowDown aria-hidden="true" size={19} />
                </a>
              </div>
            </div>

            <figure className="rhp-hero-plate">
              <button type="button" onClick={() => openPhoto(featured)} aria-label={`Open ${photoLabel(featured)}`}>
                <img
                  src={webp(featured, 1920)}
                  srcSet={`${webp(featured, 960)} 960w, ${webp(featured, 1920)} 1920w`}
                  sizes="(max-width: 960px) 100vw, 56vw"
                  alt={featured.alt}
                  width={featured.width}
                  height={featured.height}
                />
              </button>
              <figcaption>
                <span>No. {featured.id}{featured.title ? ` · ${featured.title}` : ''}</span>
                <span>Tap to view larger</span>
              </figcaption>
            </figure>
          </div>
        </section>

        <section id="photos" className="rhp-gallery" aria-labelledby="rhp-gallery-title">
          <div className="rh-shell">
            <div className="rhp-gallery-head">
              <div>
                <p className="rhp-eyebrow">The gallery · {photos.length} photos</p>
                <h2 id="rhp-gallery-title">Photos from the day</h2>
                <p className="rhp-source">{creditLine}.</p>
              </div>
            </div>

            <div className="rhp-toolbar">
              <div className="rhp-filters" role="group" aria-label="Show photos from">
                <button type="button" aria-pressed={filter === null} onClick={() => choose(null)}>
                  All <span>{photos.length}</span>
                </button>
                {sets.map((set) => (
                  <button key={set.id} type="button" aria-pressed={filter === set.id} onClick={() => choose(set.id)}>
                    {set.title} <span>{set.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="rhp-filter-note" aria-live="polite">
              {filterNote ?? `Tap a photo to see it larger. Pick up to ${MAX_SELECT} with the check mark to ${canShareFiles ? 'share or download them together' : 'download them together'}.`}
            </p>

            <ul className="rhp-grid">
              {visible.slice(0, shown).map((photo) => (
                <PhotoTile
                  key={photo.id}
                  photo={photo}
                  selected={isSelected(photo)}
                  canShareFiles={canShareFiles}
                  onOpen={() => openPhoto(photo)}
                  onToggle={() => toggle(photo)}
                  onShare={() => void share([photo])}
                />
              ))}
            </ul>

            {visible.length > shown && (
              <div className="rhp-more">
                <button type="button" className="rh-button rh-button-secondary" onClick={() => setShown((n) => n + PAGE_SIZE)}>
                  Show more photos
                  <small>{visible.length - shown} more</small>
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="rhp-guide" aria-labelledby="rhp-guide-title">
          <div className="rh-shell rhp-guide-grid">
            <div>
              <p className="rhp-eyebrow">Sharing these photos</p>
              <h2 id="rhp-guide-title">Help us tell people what happened.</h2>
              <ul className="rhp-usage">
                {shareData.usage.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="rhp-guide-foot">
                Need a full-resolution original for print? Email{' '}
                <a href={`mailto:${shareData.contactEmail}`}>{shareData.contactEmail}</a>.
              </p>
            </div>

            <div className="rhp-guide-cards">
              <div className="rhp-guide-card">
                <p className="rhp-guide-label">Credit line</p>
                <p className="rhp-guide-credit">{creditLine}</p>
                <CopyButton text={creditLine} label="Copy credit" copiedLabel="Credit copied" />
              </div>
              <div className="rhp-guide-card">
                <p className="rhp-guide-label">Ready-to-post caption</p>
                <p className="rhp-guide-caption">{SUGGESTED_CAPTION}</p>
                <CopyButton text={SUGGESTED_CAPTION} label="Copy caption" copiedLabel="Caption copied" />
              </div>
            </div>
          </div>
        </section>

        <SponsorWall />

        <section className="rhp-closing" aria-label="More from the convening">
          <div className="rh-shell rhp-closing-inner">
            <div>
              <h2>The full story of the day</h2>
              <p>The program, the Rural Health Field Simulator, and what comes next for rural health in our region.</p>
            </div>
            <div className="rhp-closing-actions">
              <Link className="rh-button rh-button-primary" to={RECAP_PATH}>
                Read the convening recap
                <ArrowRight aria-hidden="true" size={19} />
              </Link>
              <a className="rhp-closing-mail" href={`mailto:${shareData.contactEmail}?subject=Photos%20from%20the%20Rural%20Health%20Convening`}>
                <Mail aria-hidden="true" size={16} />
                Took photos yourself? Send them our way.
              </a>
            </div>
          </div>
        </section>
      </main>

      {active !== null && visible[active] && (
        <PhotoLightbox
          list={visible}
          index={active}
          onClose={close}
          onStep={step}
          onShare={(photo) => void share([photo])}
          canShareFiles={canShareFiles}
          isSelected={isSelected}
          onToggle={toggle}
        />
      )}

      <SelectionTray
        selected={selected}
        canShareFiles={canShareFiles}
        onShare={() => void share(selected)}
        onDownload={() => void download(selected)}
        onRemove={toggle}
        onClear={() => setSelectedIds([])}
      />

      <p className={`rhp-toast${notice ? ' is-visible' : ''}`} role="status" aria-live="polite">
        {notice}
      </p>

      <footer className="rh-colophon">
        <div className="rh-shell">
          <Link to={RECAP_PATH}>
            <ArrowLeft aria-hidden="true" size={16} />
            Back to the convening recap
          </Link>
          <p>{creditLine}.</p>
        </div>
      </footer>
    </div>
  );
}

export default RuralHealthPhotoSharePage;
