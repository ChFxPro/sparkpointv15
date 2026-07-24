'use client';

import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, Gift } from 'lucide-react';
import { Button } from './ui/button';
import { ACTIVE_STORY_COLLECTIONS } from '../data/storyCollections';

export function StoryCollectionPromo() {
  const collection = ACTIVE_STORY_COLLECTIONS[0];
  if (!collection) return null;

  return (
    <section className="relative px-6 py-8 md:py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="mx-auto max-w-6xl"
      >
        <div className="relative overflow-hidden rounded-2xl shadow-xl" style={{ background: 'linear-gradient(135deg, #1A1A1A, #2b1730)' }}>
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#E03694] via-[#FDB515] to-[#F15F48]" />
          <div className="grid grid-cols-1 items-center gap-6 p-7 md:grid-cols-[1fr_auto] md:gap-10 md:p-10">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FDB515]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#25b06a]" /> {collection.statusLabel}
              </span>
              <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">{collection.title}</h2>
              <p className="max-w-xl leading-relaxed text-white/70">{collection.promoLine ?? collection.summary}</p>
              {collection.incentive ? (
                <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white/60">
                  <Gift size={16} className="text-[#FDB515]" aria-hidden="true" /> {collection.incentive}
                </p>
              ) : null}
            </div>
            <Button
              asChild
              className="w-full flex-shrink-0 rounded-full px-8 py-6 text-base shadow-lg hover:shadow-xl md:w-auto"
              style={{ background: 'linear-gradient(135deg, #E03694, #9E509F)', color: 'white' }}
            >
              <Link to={collection.formPath ?? `/stories/collections/${collection.id}`}>
                Share your story <ArrowRight size={18} className="ml-1.5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
