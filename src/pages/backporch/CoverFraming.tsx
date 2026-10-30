import { useId, type KeyboardEvent, type MouseEvent } from 'react';
import { PorchImage } from '../../components/backporch/PorchParts';
import { CENTRED, normalizeCoverFrame, porchImageUrl, type CoverFrame, type PorchPost } from '../../lib/backporch';

// How the cover sits in the fixed-shape frames lists and the post page use
// (presentation.cover). Fill crops around a focal point picked on the photo;
// Whole fits a flyer or poster inside the frame without cropping. The previews are
// the site's own PorchImage, so what shows here is what the site shows.

const PREVIEWS = [
  { id: 'post', label: 'On its page', ratio: '16 / 10' },
  { id: 'card', label: 'In the feed', ratio: '4 / 3' },
  { id: 'square', label: 'Small square', ratio: '1 / 1' },
] as const;

const STEP = 5;

export function CoverFraming({
  path,
  alt,
  frame,
  onChange,
}: {
  path: string;
  alt: string;
  frame: CoverFrame | undefined;
  onChange: (frame: CoverFrame | undefined) => void;
}) {
  const id = useId();
  const current = frame ?? CENTRED;
  const set = (next: CoverFrame) => onChange(normalizeCoverFrame(next));

  const pick = (e: MouseEvent<HTMLButtonElement>) => {
    const img = e.currentTarget.querySelector('img');
    if (!img) return;
    const r = img.getBoundingClientRect();
    // Keyboard "clicks" (Enter/Space) arrive at 0,0; leave the point where it is.
    if (e.clientX === 0 && e.clientY === 0) return;
    set({ fit: 'fill', x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
  };

  const nudge = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 1 : STEP;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    const m = moves[e.key];
    if (!m) return;
    e.preventDefault();
    set({ fit: 'fill', x: current.x + m[0], y: current.y + m[1] });
  };

  const sample = { image_path: path, image_alt: '', presentation: { cover: frame } } as unknown as PorchPost;

  return (
    <fieldset className="pe-fieldset pe-framing">
      <legend className="pe-label">How the cover fits its frames</legend>
      <div className="pe-modes">
        <label>
          <input type="radio" name={`${id}-fit`} checked={current.fit === 'fill'} onChange={() => set({ ...current, fit: 'fill' })} /> Fill the frame
        </label>
        <label>
          <input type="radio" name={`${id}-fit`} checked={current.fit === 'whole'} onChange={() => set({ ...current, fit: 'whole' })} /> Show the whole image
        </label>
      </div>
      <p className="pe-help">
        {current.fit === 'fill'
          ? 'The photo is cropped to each frame. Click the part that should stay in view; arrow keys nudge it (Shift for small steps).'
          : 'Nothing is cropped: the whole image sits in each frame over a soft, blurred copy of itself. Best for flyers and posters.'}
      </p>

      {current.fit === 'fill' && (
        <div className="pe-focus-row">
          <button
            type="button"
            className="pe-focus"
            onClick={pick}
            onKeyDown={nudge}
            aria-label={`Focal point: ${current.x}% across, ${current.y}% down. Click the photo to move it, or use the arrow keys.`}
          >
            <img src={porchImageUrl(path, 960) ?? ''} alt={alt} draggable={false} />
            <span className="pe-focus-dot" style={{ left: `${current.x}%`, top: `${current.y}%` }} aria-hidden="true" />
          </button>
          {frame && (
            <button type="button" className="pe-btn pe-btn-sm" onClick={() => onChange(undefined)}>
              Centre it again
            </button>
          )}
        </div>
      )}

      <div className="pe-frame-previews" aria-label="How the cover will look">
        {PREVIEWS.map((p) => (
          <figure key={p.id} className="pe-frame-preview" style={{ ['--ratio' as string]: p.ratio }}>
            <PorchImage post={sample} sizes="200px" width={480} />
            <figcaption>{p.label}</figcaption>
          </figure>
        ))}
      </div>
    </fieldset>
  );
}
