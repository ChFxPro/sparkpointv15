import type { CSSProperties } from 'react';

// The official SparkPoint sparkmark (the eight-point star), resized from
// src/assets/046ca85659860578eeeab6a45f52700c54c519a3.png. Use this anywhere a
// "star" or "✦" would otherwise appear, rather than a drawn or typed star.
export const SPARKMARK_URL = `${import.meta.env.BASE_URL}assets/brand/sparkmark-256.webp`;

interface SparkmarkProps {
  /** Rendered width and height, in any CSS length. */
  size?: string;
  /**
   * `color` shows the official gradient. `ink` uses the mark's exact shape as
   * a mask filled with `currentColor`, for one-colour contexts (foil, stamps).
   */
  variant?: 'color' | 'ink';
  className?: string;
  style?: CSSProperties;
}

export function Sparkmark({ size = '1em', variant = 'color', className, style }: SparkmarkProps) {
  const box: CSSProperties = {
    display: 'inline-block',
    flex: 'none',
    width: size,
    height: size,
    verticalAlign: '-0.12em',
    ...style,
  };

  if (variant === 'ink') {
    const mask = `url("${SPARKMARK_URL}") center / contain no-repeat`;
    return (
      <span
        aria-hidden="true"
        className={className}
        style={{ ...box, backgroundColor: 'currentColor', mask, WebkitMask: mask }}
      />
    );
  }

  return <img src={SPARKMARK_URL} alt="" aria-hidden="true" className={className} style={box} />;
}
