'use client';

import { Link } from 'react-router';
import { ArrowRight, Coffee, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { COMMON_GROUND_PURCHASE_URL } from '../data/events';

const ASSET_BASE = `${import.meta.env.BASE_URL}assets/events/pisgah_coffee_fundraiser/`;
const packageImage = `${ASSET_BASE}SparkPoint - Common Ground.webp`;

// Pisgah Coffee Roasters' 50% profit-share on Common Ground runs through August 2026.
const PROMO_EXPIRES = new Date('2026-09-01T00:00:00-04:00');

export function isCommonGroundPromoActive(now = new Date()) {
  return now < PROMO_EXPIRES;
}

export function CommonGroundPromoCard() {
  return (
    <div
      className="relative overflow-hidden rounded-2xl shadow-xl"
      style={{ background: 'linear-gradient(135deg, #fffdf8, #f5f0e6)', border: '1px solid rgba(18, 61, 52, 0.1)' }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1.5"
        style={{ background: 'linear-gradient(90deg, #d5a32d, #e14c9a, #123d34)' }}
        aria-hidden="true"
      />
      <div className="grid grid-cols-1 items-center gap-6 p-7 md:grid-cols-[auto_1fr_auto] md:gap-8 md:p-10">
        <div className="relative hidden h-28 w-24 flex-shrink-0 md:block" aria-hidden="true">
          <span
            className="absolute inset-0 rounded-lg"
            style={{ background: '#d5a32d', transform: 'rotate(5deg)' }}
          />
          <img
            src={packageImage}
            alt=""
            className="relative h-full w-full rounded-lg object-cover shadow-lg"
            style={{ transform: 'rotate(-3deg)' }}
          />
        </div>
        <div>
          <span
            className="mb-3 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em]"
            style={{ color: '#a97a1f' }}
          >
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: '#e14c9a' }} aria-hidden="true" />
            Available now &middot; through August
          </span>
          <h2 className="mb-2 text-2xl font-bold md:text-3xl" style={{ color: '#123d34' }}>
            Buy a bag. Build the Hub.
          </h2>
          <p className="max-w-xl leading-relaxed" style={{ color: '#5e5a52' }}>
            Common Ground Resilience Roast — a SparkPoint &times; Pisgah Coffee Roasters collaboration.
            Half of August profits from every bag help build SparkPoint&rsquo;s Resilience Hub.
          </p>
        </div>
        <div className="flex w-full flex-shrink-0 flex-col gap-3 md:w-auto">
          <Button
            asChild
            className="w-full rounded-full px-8 py-6 text-base shadow-lg hover:shadow-xl md:w-auto"
            style={{ background: 'linear-gradient(135deg, #123d34, #092b25)', color: 'white' }}
          >
            <a href={COMMON_GROUND_PURCHASE_URL} target="_blank" rel="noreferrer">
              <Coffee size={18} aria-hidden="true" /> Buy now <ExternalLink size={16} className="ml-1" aria-hidden="true" />
            </a>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full rounded-full px-8 py-5 text-base md:w-auto"
            style={{ borderColor: '#123d34', color: '#123d34', background: 'transparent' }}
          >
            <Link to="/events/thrive-at-five">
              Learn more <ArrowRight size={16} className="ml-1" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
