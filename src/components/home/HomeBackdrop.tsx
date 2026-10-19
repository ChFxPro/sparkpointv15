import mountainWebp from '../../assets/compd/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9.webp';
import mountainWebpSmall from '../../assets/compd/9cca1db07a8f8f3c2b4fe9b1989f3d9f9738c4c9-1400.webp';

// The drone shot of the county, pinned behind the whole homepage. Sections
// paint their own backgrounds over it; the hero tints it plum, and the region
// band lets it show through as the page scrolls past.
//
// It sits at z-index -1 inside `.home`, which is its own stacking context
// (isolation: isolate), so it can never paint over a later section the way the
// old hero's fixed layer did.
export function HomeBackdrop() {
  return (
    <div className="home-backdrop" aria-hidden="true">
      <img
        src={mountainWebp}
        srcSet={`${mountainWebpSmall} 1400w, ${mountainWebp} 2459w`}
        sizes="100vw"
        alt=""
        width={2459}
        height={1638}
        decoding="async"
      />
    </div>
  );
}
