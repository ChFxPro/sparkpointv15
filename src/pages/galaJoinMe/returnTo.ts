// Getting back to where you were on the Gala page after "Issue my passport".
//
// Each way into the maker (a trip card's "Stamp this trip", the passport photo, the
// button under the passport) does two things:
// 1. markReturn() rewrites the Gala page's own history entry to end in that section's
//    #anchor, without a new entry, so the browser's Back button (or a back swipe) lands
//    on it: ScrollToTop in App.tsx scrolls to a route's #hash when the page loads.
// 2. The link carries { returnTo, returnLabel } as router state, so the maker's own
//    "back" links can say where they go ("Back to Greece") and go there.
// Anyone who arrives some other way (a shared link) just goes back to the top of the page.

export type JoinMeReturn = { returnTo: string; returnLabel: string };

const ANCHOR = /^[a-z0-9-]{1,40}$/;

export function markReturn(anchor: string) {
  if (!ANCHOR.test(anchor)) return;
  try {
    const { pathname, search } = window.location;
    window.history.replaceState(window.history.state, '', `${pathname}${search}#${anchor}`);
  } catch {
    // History not writable here; the maker's own links still know the way back.
  }
}

export function readReturn(state: unknown): JoinMeReturn | null {
  if (!state || typeof state !== 'object') return null;
  const { returnTo, returnLabel } = state as Partial<JoinMeReturn>;
  if (typeof returnTo !== 'string' || !ANCHOR.test(returnTo)) return null;
  return { returnTo, returnLabel: typeof returnLabel === 'string' ? returnLabel.slice(0, 40) : '' };
}
