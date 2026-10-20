import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { CONVENING_PHOTO_CREDIT, conveningPhotoSrcSet, conveningPhotoUrl } from '../../lib/conveningPhotos';

// Convening photos come from the Supabase bucket by id. Photos from other
// gatherings carry their own src/srcSet and a `where` line in place of the
// convening's date, place and credit.
export type ViewerPhoto = { id: string; alt: string; caption: string; src?: string; srcSet?: string; where?: string };

// A full-size view of one photo with its caption. Arrow keys and the
// buttons step through the set; Escape or the backdrop closes it; focus stays
// inside while open and returns to the photo that opened it.
export function PhotoViewer({
  photos,
  index,
  onIndex,
  onClose,
}: {
  photos: ViewerPhoto[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const photo = photos[index];
  const step = (d: number) => onIndex((index + d + photos.length) % photos.length);

  // Mount-only: remember the opener, lock page scroll, focus the close button.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const buttons = dialogRef.current?.querySelectorAll<HTMLElement>('button');
    buttons?.[buttons.length - 1]?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
      opener?.focus();
    };
  }, []);

  // Keys: Escape closes, arrows step, Tab stays inside the dialog.
  const stepRef = useRef(step);
  stepRef.current = step;
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
      else if (e.key === 'ArrowRight') stepRef.current(1);
      else if (e.key === 'ArrowLeft') stepRef.current(-1);
      else if (e.key === 'Tab') {
        const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button') ?? []);
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (typeof document === 'undefined' || !photo) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-8">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-[#140a18]/90" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-full w-full max-w-5xl flex-col"
      >
        <img
          src={photo.src ?? conveningPhotoUrl(photo.id, 1920)}
          srcSet={photo.srcSet ?? conveningPhotoSrcSet(photo.id)}
          sizes="(min-width: 1024px) 64rem, 100vw"
          alt={photo.alt}
          className="max-h-[72vh] w-full rounded-2xl bg-[#2A1430] object-contain"
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-white">
          <div>
            <p id={titleId} className="text-lg font-bold">{photo.caption}</p>
            <p className="text-sm text-white/80">
              {photo.where ?? `October 1, 2026 · Deerwoode Reserve, Brevard · ${CONVENING_PHOTO_CREDIT}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-2 text-sm tabular-nums text-white/80">
              {index + 1} of {photos.length}
            </span>
            <button type="button" onClick={() => step(-1)} className="home-icon-btn" aria-label="Previous photo">
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => step(1)} className="home-icon-btn" aria-label="Next photo">
              <ChevronRight size={20} aria-hidden="true" />
            </button>
            <button type="button" onClick={onClose} className="home-icon-btn" aria-label="Close">
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
