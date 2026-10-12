'use client';

import { GalaPromoCard, isGalaPromoActive } from './GalaPromo';
import { RuralHealthPromoCard, isRuralHealthPromoActive } from './RuralHealthPromo';

// The homepage promo row. Each card retires itself on its own date; when only
// one is active it takes the full width.
export function HomePromoShowcase() {
  const hasGala = isGalaPromoActive();
  const hasConvening = isRuralHealthPromoActive();

  if (!hasGala && !hasConvening) return null;

  return (
    <section className="relative px-6 py-8 md:py-10">
      <div
        className={`mx-auto grid max-w-6xl items-stretch gap-8 ${hasGala && hasConvening ? 'md:grid-cols-2' : ''}`}
      >
        {hasGala && <GalaPromoCard />}
        {hasConvening && <RuralHealthPromoCard />}
      </div>
    </section>
  );
}
