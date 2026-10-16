// The view from the porch: friends in rocking chairs at sunset, looking out over
// layered Blue Ridge ridges. An illustrative, AI-generated image (owner, 2026-10-15),
// not a photo of a real SparkPoint gathering, and the page says so.
//
// Three crops of the same scene, chosen by screen shape rather than squeezed:
// wide (2.34:1) for desktop, square for tablets and the homepage band on phones,
// tall (9:16) for the BackPorch page on phones.
// Files: public/assets/backporch/view-{wide,square,tall}-<width>.webp

export const PORCH_VIEW_ALT =
  'Friends in rocking chairs on a covered back porch at sunset, one laughing, a mug in hand, looking out past the railing over layers of Blue Ridge mountains with mist in the valleys.';

export function PorchView({
  variant,
  eager = false,
  className = '',
}: {
  /** hero: the BackPorch page (tall on phones). band: the homepage (square on phones). */
  variant: 'hero' | 'band';
  eager?: boolean;
  className?: string;
}) {
  const a = `${import.meta.env.BASE_URL}assets/backporch/`;
  const wide = `${a}view-wide-800.webp 800w, ${a}view-wide-1280.webp 1280w, ${a}view-wide-1920.webp 1918w`;
  const square = `${a}view-square-800.webp 800w, ${a}view-square-1254.webp 1254w`;
  const tall = `${a}view-tall-640.webp 640w, ${a}view-tall-941.webp 941w`;
  return (
    <picture className={`porch-view ${className}`} data-variant={variant}>
      <source media="(min-width: 900px)" srcSet={wide} sizes="100vw" />
      {variant === 'hero' && <source media="(min-width: 560px)" srcSet={square} sizes="100vw" />}
      <img
        src={`${a}${variant === 'hero' ? 'view-tall-640' : 'view-square-800'}.webp`}
        srcSet={variant === 'hero' ? tall : square}
        sizes="100vw"
        alt={PORCH_VIEW_ALT}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  );
}
