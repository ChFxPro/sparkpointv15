'use client';

import { StoryCollectionPromoCard } from './StoryCollectionPromo';
import { RuralHealthPromoCard, isRuralHealthPromoActive } from './RuralHealthPromo';
import { ACTIVE_STORY_COLLECTIONS } from '../data/storyCollections';

export function HomePromoShowcase() {
  const hasStory = ACTIVE_STORY_COLLECTIONS.length > 0;
  const hasConvening = isRuralHealthPromoActive();

  if (!hasStory && !hasConvening) return null;

  return (
    <section className="relative px-6 py-8 md:py-10">
      <div
        className={`mx-auto grid max-w-6xl items-stretch gap-8 ${hasStory && hasConvening ? 'md:grid-cols-2' : ''}`}
      >
        {hasStory && <StoryCollectionPromoCard />}
        {hasConvening && <RuralHealthPromoCard />}
      </div>
    </section>
  );
}
