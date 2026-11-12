import type { ComponentType } from 'react';
import { flushSync } from 'react-dom';
import type TripFilmDialogType from './TripFilmDialog';

// Opening the film player: the player's code loads once (ahead of time when a
// visitor points at or touches a film's button), then the film "floats" from
// the photo or button that opened it into the player, using the browser's view
// transitions (Chrome, Edge, Safari 18 and later). Browsers without them, and
// visitors who ask for reduced motion, get the player straight away.

export type FilmPlayer = ComponentType<Parameters<typeof TripFilmDialogType>[0]>;

let loading: Promise<FilmPlayer> | null = null;

/** Loads the player's code (once); safe to call on hover, focus or touch to warm it up. */
export function loadFilmPlayer(): Promise<FilmPlayer> {
  loading ??= import('./TripFilmDialog').then((m) => m.default as FilmPlayer);
  return loading;
}

// The name the float uses; gala.css gives the player's frame the same one.
const NAME = 'gala-film';

type DocWithTransition = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Runs `update` (which opens or closes the player) inside a view transition,
 * so the film appears to grow out of `from` on opening and shrink back into it
 * on closing. `motion` is false under the site's own reduced-motion toggle.
 */
export function floatFilm(direction: 'open' | 'close', from: HTMLElement | null, update: () => void, motion = true) {
  const doc = document as DocWithTransition;
  // Not from full screen: the page behind it isn't on screen to land on.
  if (!doc.startViewTransition || !from || !motion || prefersReducedMotion() || document.fullscreenElement) {
    update();
    return;
  }
  // The photo carries the name on the page's side of the transition; the
  // player's frame carries it on the player's side.
  if (direction === 'open') from.style.setProperty('view-transition-name', NAME);
  const t = doc.startViewTransition(() => {
    if (direction === 'open') from.style.removeProperty('view-transition-name');
    else from.style.setProperty('view-transition-name', NAME);
    flushSync(update);
  });
  t.finished.finally(() => from.style.removeProperty('view-transition-name'));
}
