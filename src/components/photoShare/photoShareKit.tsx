import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, Copy, Download, Share2, X } from 'lucide-react';

// Shared pieces of the unlisted photo-share pages (/rural-health-convening/photos,
// /collaboration-lab/media): the grid tile, selection tray, lightbox, share/download
// actions, and the filter/selection/deep-link state. Each page supplies a `Gallery`
// (its photos, where their files live, its caption) and its own surrounding sections.
// Class names are the `.rhp-*` / `.rh-lightbox` rules in ruralHealthPhotoShare.css and
// ruralHealthConvening.css; a page retints them by overriding the `--rh-*` tokens.
//
// Sharing never hands out the page's link: these pages are passed to people directly,
// not meant to spread. A website can't post an image to Instagram, Facebook, or
// LinkedIn itself — their web share links take a URL only — so photos go through the
// device's share sheet as files (phones, and some desktop browsers), which is also how
// one post can carry several photos. Where a browser can't share files, only Download
// is offered. People pick up to MAX_SELECT photos at a time: enough for a post
// (Instagram's carousel takes 10), not the whole set. Several photos download as one
// ZIP built in the browser from just that selection.

export type SharePhoto = {
  id: string;
  set: string;
  title?: string;
  alt: string;
  width: number;
  height: number;
  bytes: number;
};

export type ShareSet = { id: string; title: string; note?: string };

export type Gallery = {
  photos: SharePhoto[];
  sets: ShareSet[];
  /** Public storage folder holding the files. */
  base: string;
  /** File name prefix of the web copies: `<prefix>-<id>-960.webp`. */
  filePrefix: string;
  /** Download names: `<downloadPrefix>-<id>.jpg`. */
  downloadPrefix: string;
  /** Copied to the clipboard on Share (Instagram drops text shared with images). */
  caption: string;
  /** "About these photos.txt" inside a multi-photo ZIP. */
  zipNote: string;
};

export const MAX_SELECT = 5;
export const PAGE_SIZE = 36;

export const webp = (g: Gallery, photo: SharePhoto, size: 960 | 1920) => `${g.base}/${g.filePrefix}-${photo.id}-${size}.webp`;
const downloadName = (g: Gallery, photo: SharePhoto) => `${g.downloadPrefix}-${photo.id}.jpg`;
const fileUrl = (g: Gallery, photo: SharePhoto) => `${g.base}/${downloadName(g, photo)}`;
// The bucket is cross-origin, where browsers ignore <a download>; Supabase's
// `?download=` makes it answer with Content-Disposition: attachment instead.
export const storageDownload = (url: string, name: string) => `${url}?download=${encodeURIComponent(name)}`;
export const downloadHref = (g: Gallery, photo: SharePhoto) => storageDownload(fileUrl(g, photo), downloadName(g, photo));
export const photoLabel = (photo: SharePhoto) => (photo.title ? `photo ${photo.id}, ${photo.title}` : `photo ${photo.id}`);

export async function copyText(text: string) {
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
export function loadFile(g: Gallery, photo: SharePhoto) {
  const url = fileUrl(g, photo);
  let pending = fileCache.get(url);
  if (!pending) {
    pending = fetch(url)
      .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(String(res.status)))))
      .then((blob) => new File([blob], downloadName(g, photo), { type: 'image/jpeg' }))
      .catch(() => {
        fileCache.delete(url);
        return null;
      });
    fileCache.set(url, pending);
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

function usePhotoActions(g: Gallery, announce: (message: string) => void) {
  // Instagram drops any text that comes with shared images, so the caption goes on
  // the clipboard first (before the share sheet takes the tap's activation).
  const share = useCallback(
    async (list: SharePhoto[]) => {
      const captionCopied = copyText(g.caption);
      try {
        const files = await Promise.all(list.map((photo) => loadFile(g, photo)));
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
    [announce, g],
  );

  const download = useCallback(
    async (list: SharePhoto[]) => {
      if (list.length === 1) {
        clickLink(downloadHref(g, list[0]));
        return;
      }
      announce(`Preparing ${list.length} photos…`);
      const files = await Promise.all(list.map((photo) => loadFile(g, photo)));
      if (files.some((file) => !file)) {
        announce('A photo didn’t load—please try again');
        return;
      }
      const folder = `${g.downloadPrefix}-Photos`;
      const entries = [
        { name: `${folder}/About these photos.txt`, data: new TextEncoder().encode(g.zipNote) },
        ...(await Promise.all(
          (files as File[]).map(async (file) => ({ name: `${folder}/${file.name}`, data: new Uint8Array(await file.arrayBuffer()) })),
        )),
      ];
      const url = URL.createObjectURL(storedZip(entries));
      clickLink(url, `${folder}.zip`);
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      announce(`${list.length} photos downloaded`);
    },
    [announce, g],
  );

  return { share, download };
}

export function CopyButton({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
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

export function PhotoTile({
  gallery: g,
  photo,
  selected,
  canShareFiles,
  onOpen,
  onToggle,
  onShare,
}: {
  gallery: Gallery;
  photo: SharePhoto;
  selected: boolean;
  canShareFiles: boolean;
  onOpen: () => void;
  onToggle: () => void;
  onShare: () => void;
}) {
  const warm = () => void loadFile(g, photo);
  return (
    <li className={`rhp-tile${selected ? ' is-selected' : ''}`} id={`photo-${photo.id}`}>
      <div className="rhp-tile-media">
        <button type="button" className="rhp-tile-open" onClick={onOpen} aria-label={`Open ${photoLabel(photo)}`}>
          <img
            src={webp(g, photo, 960)}
            srcSet={`${webp(g, photo, 960)} 960w, ${webp(g, photo, 1920)} 1920w`}
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
                img.src = `${webp(g, photo, 960)}?retry=${tries + 1}`;
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
          href={downloadHref(g, photo)}
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
  gallery: g,
  selected,
  canShareFiles,
  onShare,
  onDownload,
  onRemove,
  onClear,
}: {
  gallery: Gallery;
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
                <img src={webp(g, photo, 960)} alt="" width={photo.width} height={photo.height} />
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
  gallery: g,
  list,
  index,
  onClose,
  onStep,
  onShare,
  canShareFiles,
  isSelected,
  onToggle,
}: {
  gallery: Gallery;
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
  const setTitle = g.sets.find((s) => s.id === photo.set)?.title;

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
    void loadFile(g, photo);
    // Warm the neighbours so stepping through feels instant.
    for (const delta of [1, -1]) new Image().src = webp(g, list[(index + delta + list.length) % list.length], 1920);
  }, [g, index, list, photo]);

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
        <img key={photo.id} src={webp(g, photo, 1920)} alt={photo.alt} width={photo.width} height={photo.height} />
        <figcaption>
          <span>
            No. {photo.id}
            {setTitle && g.sets.length > 1 ? ` · ${setTitle}` : ''} · {index + 1} of {list.length}
          </span>
          {photo.title && <strong>{photo.title}</strong>}
          <div className="rhp-lightbox-actions">
            {canShareFiles && (
              <button type="button" className="rhp-action rhp-action-solid" onClick={() => onShare(photo)}>
                <Share2 aria-hidden="true" size={17} />
                Share
              </button>
            )}
            <a className={`rhp-action${canShareFiles ? '' : ' rhp-action-solid'}`} href={downloadHref(g, photo)}>
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

/**
 * The gallery's state: set filter, paging, selection, the lightbox (with `#photo-<id>`
 * deep links kept in the address bar), and the toast. `grid` and `overlays` are the
 * rendered pieces; a page places `grid` in its gallery section and `overlays` once at
 * the end of the page.
 */
export function usePhotoGallery(g: Gallery) {
  const { photos } = g;
  const [filter, setFilter] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE_SIZE);
  // Lightbox position within `visible` (the filtered list), or null when closed.
  const [active, setActive] = useState<number | null>(null);
  const [notice, setNotice] = useState('');
  const noticeTimer = useRef<number>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [canShareFiles, setCanShareFiles] = useState(false);

  useEffect(() => setCanShareFiles(detectFileShare()), []);

  const sets = useMemo(
    () => g.sets.map((set) => ({ ...set, count: photos.filter((p) => p.set === set.id).length })).filter((set) => set.count > 0),
    [g.sets, photos],
  );
  const visible = useMemo(() => (filter ? photos.filter((p) => p.set === filter) : photos), [filter, photos]);

  const announce = useCallback((message: string) => {
    setNotice(message);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(''), 3200);
  }, []);
  const { share, download } = usePhotoActions(g, announce);

  const selected = useMemo(
    () => selectedIds.map((id) => photos.find((p) => p.id === id)).filter((p): p is SharePhoto => Boolean(p)),
    [photos, selectedIds],
  );
  const isSelected = useCallback((photo: SharePhoto) => selectedIds.includes(photo.id), [selectedIds]);
  const toggle = useCallback(
    (photo: SharePhoto) => {
      if (selectedIds.includes(photo.id)) {
        setSelectedIds(selectedIds.filter((id) => id !== photo.id));
      } else if (selectedIds.length >= MAX_SELECT) {
        announce(`You can pick up to ${MAX_SELECT} photos at a time`);
      } else {
        void loadFile(g, photo); // in hand before the Share tap
        setSelectedIds([...selectedIds, photo.id]);
      }
    },
    [announce, g, selectedIds],
  );

  // A deep link always opens against the full list, so clear any filter first.
  useEffect(() => {
    const open = () => {
      const id = /^#photo-(\d+)$/.exec(window.location.hash)?.[1];
      const index = id ? photos.findIndex((p) => p.id === id) : -1;
      if (index >= 0) setFilter(null);
      setActive(index >= 0 ? index : null);
    };
    open();
    window.addEventListener('hashchange', open);
    return () => window.removeEventListener('hashchange', open);
  }, [photos]);

  // Keep the address bar pointing at the open photo, so copying it shares that photo.
  // Other hashes (a section link) are left alone while no photo is open.
  useEffect(() => {
    const { pathname, search, hash } = window.location;
    const photo = active === null ? null : visible[active];
    if (!photo && !hash.startsWith('#photo-')) return;
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
  const filterNote = filter ? g.sets.find((s) => s.id === filter)?.note : null;

  const grid = (
    <>
      {sets.length > 1 && (
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
      )}

      <p className="rhp-filter-note" aria-live="polite">
        {filterNote ||
          `Tap a photo to see it larger. Pick up to ${MAX_SELECT} with the check mark to ${canShareFiles ? 'share or download them together' : 'download them together'}.`}
      </p>

      <ul className="rhp-grid">
        {visible.slice(0, shown).map((photo) => (
          <PhotoTile
            key={photo.id}
            gallery={g}
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
    </>
  );

  const overlays = (
    <>
      {active !== null && visible[active] && (
        <PhotoLightbox
          gallery={g}
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
        gallery={g}
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
    </>
  );

  return { grid, overlays, openPhoto, hasSelection: selected.length > 0 };
}
