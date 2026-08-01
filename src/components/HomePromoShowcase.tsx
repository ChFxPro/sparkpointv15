'use client';

import { StoryCollectionPromoCard } from './StoryCollectionPromo';
import { CommonGroundPromoCard, isCommonGroundPromoActive } from './CommonGroundPromo';
import { ACTIVE_STORY_COLLECTIONS } from '../data/storyCollections';

export function HomePromoShowcase() {
  const hasStory = ACTIVE_STORY_COLLECTIONS.length > 0;
  const hasCoffee = isCommonGroundPromoActive();

  if (!hasStory && !hasCoffee) return null;

  return (
    <section className="relative px-6 py-8 md:py-10">
      <div
        className={`mx-auto grid max-w-6xl items-stretch gap-8 ${hasStory && hasCoffee ? 'md:grid-cols-2' : ''}`}
      >
        {hasStory && <StoryCollectionPromoCard />}
        {hasCoffee && <CommonGroundPromoCard />}
      </div>
    </section>
  );
}
