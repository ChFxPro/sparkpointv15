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
    <div className="group relative h-full pt-9 md:pt-11">
      <div
        className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl shadow-xl transition-shadow duration-300 group-hover:shadow-2xl"
        style={{ background: 'linear-gradient(155deg, #123d34, #092b25 55%, #3a2019)' }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ background: 'linear-gradient(90deg, #d5a32d, #e14c9a, #f7d36d)' }}
          aria-hidden="true"
        />
        <div className="flex flex-1 flex-col justify-between gap-6 p-7 pt-14 md:p-8 md:pt-16">
          <div>
            <span
              className="mb-3 inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em]"
              style={{ color: '#f3c853' }}
            >
              <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: '#e14c9a' }} aria-hidden="true" />
              Available now &middot; through August
            </span>
            <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">Buy a bag. Build the Hub.</h2>
            <p className="max-w-xl leading-relaxed text-white/70">
              Common Ground Resilience Roast — a SparkPoint &times; Pisgah Coffee Roasters
              collaboration. Half of August profits from every bag help build SparkPoint&rsquo;s
              Resilience Hub.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              asChild
              className="w-full rounded-full px-8 py-6 text-base shadow-lg hover:shadow-xl"
              style={{ background: 'linear-gradient(135deg, #f7d36d, #d5a32d)', color: '#123d34' }}
            >
              <a href={COMMON_GROUND_PURCHASE_URL} target="_blank" rel="noreferrer">
                <Coffee size={18} aria-hidden="true" /> Buy now <ExternalLink size={16} className="ml-1" aria-hidden="true" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full rounded-full px-8 py-5 text-base"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', background: 'rgba(255,255,255,0.06)' }}
            >
              <Link to="/events/thrive-at-five">
                Learn more <ArrowRight size={16} className="ml-1" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute -top-2 right-6 z-10 md:right-8">
        <div
          className="absolute -inset-4 -z-10 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70"
          style={{ background: 'radial-gradient(circle, #f7d36d, transparent 70%)' }}
          aria-hidden="true"
        />
        <span
          className="absolute -right-3 -top-3 z-20 grid h-14 w-14 rotate-[8deg] place-items-center rounded-full text-center text-[9px] font-black uppercase leading-tight transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105"
          style={{
            color: '#123d34',
            background: '#f7d36d',
            border: '3px solid #fffdf8',
            boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
          }}
        >
          New
          <br />
          roast
        </span>
        <img
          src={packageImage}
          alt=""
          aria-hidden="true"
          className="w-24 rotate-[-6deg] rounded-lg shadow-2xl transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-105 md:w-28"
        />
      </div>
    </div>
  );
}
