import { useEffect, type RefObject } from 'react';
import { useReducedMotion } from 'motion/react';
import { useAccessibility } from '../../context/AccessibilityContext';

// The hand-off from the hero to the BackPorch band, which forms the hero's bottom
// edge. Two layers move at different speeds as the page scrolls:
//   - the hero's contents lag slightly behind the page (--hero-drift), so the band rises over them;
//   - the porch view lags behind its frame (--porch-drift), like scenery seen through a window.
// Both are CSS variables written on scroll, one frame at a time. With reduced motion
// (the OS setting or the site's own toggle) nothing moves.
const HERO_LAG = 0.12; // share of the scroll the hero's contents give back: depth, not movement
const VIEW_TRAVEL = 44; // px the porch view travels across its frame

export function useHeroHandoff(root: RefObject<HTMLElement | null>) {
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const reducedMotion = Boolean(systemReducedMotion) || motionPreference === 'reduce';

  useEffect(() => {
    const el = root.current;
    const hero = el?.querySelector<HTMLElement>('.home-hero');
    if (!el || !hero) return;
    // Looked up each time: the band only renders once there are posts.
    const findBand = () => el.querySelector<HTMLElement>('.porch-band-wrap');
    const reset = () => {
      hero.style.removeProperty('--hero-drift');
      findBand()?.style.removeProperty('--porch-drift');
    };
    if (reducedMotion) {
      reset();
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      const h = hero.getBoundingClientRect();
      // Only while the hero is on screen: 0 at the top of the page, then lagging.
      if (h.bottom > 0) hero.style.setProperty('--hero-drift', `${Math.max(0, -h.top) * HERO_LAG}px`);
      const band = findBand();
      if (band) {
        const b = band.getBoundingClientRect();
        if (b.top < vh && b.bottom > 0) {
          // 0 as the band's top enters at the bottom of the screen, 1 as it leaves the top.
          const t = Math.min(1, Math.max(0, (vh - b.top) / (vh + Math.min(b.height, vh))));
          band.style.setProperty('--porch-drift', `${(t - 0.5) * VIEW_TRAVEL}px`);
        }
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      reset();
    };
  }, [root, reducedMotion]);
}
