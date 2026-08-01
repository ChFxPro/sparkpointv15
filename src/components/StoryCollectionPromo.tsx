'use client';

import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { ACTIVE_STORY_COLLECTIONS } from '../data/storyCollections';

export function StoryCollectionPromoCard() {
  const collection = ACTIVE_STORY_COLLECTIONS[0];
  if (!collection) return null;

  return (
    <div className="group relative h-full pt-9 md:pt-11">
      <div
        className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl shadow-xl transition-shadow duration-300 group-hover:shadow-2xl"
        style={{ background: 'linear-gradient(155deg, #1A1A1A, #2b1730 55%, #3a1f42)' }}
      >
        <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#E03694] via-[#FDB515] to-[#F15F48]" aria-hidden="true" />
        <div className="flex flex-1 flex-col justify-between gap-6 p-7 pt-14 md:p-8 md:pt-16">
          <div>
            <span className="mb-3 flex w-full items-center justify-end gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#FDB515]">
              {collection.statusLabel} <span className="h-2 w-2 animate-pulse rounded-full bg-[#25b06a]" aria-hidden="true" />
            </span>
            <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">{collection.title}</h2>
            <p className="max-w-xl leading-relaxed text-white/70">
              <span className="text-white">{collection.tagline}</span> {collection.summary}
            </p>
          </div>
          <Button
            asChild
            className="w-full rounded-full px-8 py-6 text-base shadow-lg hover:shadow-xl md:w-auto"
            style={{ background: 'linear-gradient(135deg, #E03694, #9E509F)', color: 'white' }}
          >
            <Link to={collection.formPath ?? `/stories/collections/${collection.id}`}>
              Share your story <ArrowRight size={18} className="ml-1.5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute -top-2 left-6 z-10 md:left-8">
        <div
          className="absolute -inset-4 -z-10 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70"
          style={{ background: 'radial-gradient(circle, #FDB515, transparent 70%)' }}
          aria-hidden="true"
        />
        {collection.incentive ? (
          <span
            className="absolute -left-3 -top-3 z-20 grid h-14 w-14 rotate-[-8deg] place-items-center rounded-full text-center text-[9px] font-black uppercase leading-tight transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105"
            style={{
              color: '#3a1f42',
              background: 'linear-gradient(135deg, #FDB515, #f7d36d)',
              border: '3px solid #fffdf8',
              boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
            }}
          >
            Enter to
            <br />
            win $100
          </span>
        ) : null}
        <div className="h-28 w-24 rotate-[-6deg] overflow-hidden rounded-lg shadow-2xl transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-105 md:h-32 md:w-28">
          <img
            src={collection.flyerImage ?? collection.image}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            style={{ objectPosition: '50% 15%' }}
          />
        </div>
      </div>
    </div>
  );
}
