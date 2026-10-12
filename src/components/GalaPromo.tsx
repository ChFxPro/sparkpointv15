'use client';

import '@fontsource-variable/fraunces';

import { Link } from 'react-router';
import { ArrowRight, Plane } from 'lucide-react';
import { Sparkmark } from './Sparkmark';

// Homepage promo for the SparkPoint Gala (December 11, 2026). It shares the
// band structure of the other homepage promo cards (kicker, headline, rule,
// lede, three-cell facts row, full-width button, footnote) so the row
// balances, and borrows the Gala page's midnight-and-brass palette.
export const GALA_PATH = '/events/sparkpoint-gala';

const heroPhoto = `${import.meta.env.BASE_URL}assets/events/gala/hero-wing-800.webp`;

const MIDNIGHT = '#0b1322';
const MIDNIGHT_2 = '#14213a';
const BRASS = '#d9b56a';
const BRASS_LIGHT = '#f1d9a0';
const IVORY = '#f7f1e5';
const DISPLAY_FONT = "'Fraunces Variable', 'Fraunces', Georgia, serif";

// The card retires once the evening is over; move this if a recap should run.
const PROMO_EXPIRES = new Date('2026-12-12T00:00:00-05:00');

export function isGalaPromoActive(now = new Date()) {
  return now < PROMO_EXPIRES;
}

const facts = [
  { label: 'Date', value: 'Fri, Dec 11, 2026' },
  { label: 'Time', value: '6:00 p.m.' },
  { label: 'Featuring', value: 'A live travel auction' },
];

export function GalaPromoCard() {
  return (
    <div className="group relative h-full pt-9 md:pt-11">
      <div
        className="relative flex h-full min-h-[320px] flex-col overflow-hidden rounded-2xl shadow-xl transition-shadow duration-300 group-hover:shadow-2xl"
        style={{
          color: IVORY,
          background: `radial-gradient(ellipse at 85% 0%, rgba(217, 181, 106, 0.2), transparent 55%), linear-gradient(160deg, ${MIDNIGHT_2}, ${MIDNIGHT})`,
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{ background: `linear-gradient(90deg, ${BRASS_LIGHT}, ${BRASS} 50%, #e03694)` }}
          aria-hidden="true"
        />

        <div className="relative flex flex-1 flex-col justify-between gap-6 p-7 pt-14 md:p-8 md:pt-16">
          <div>
            <span
              className="mb-3 flex w-full items-center justify-end gap-2 text-[11px] font-extrabold uppercase tracking-[0.16em]"
              style={{ color: BRASS }}
            >
              Save the date <Sparkmark size="14px" />
            </span>
            <h2
              className="mb-1 text-2xl font-semibold md:text-3xl"
              style={{ fontFamily: DISPLAY_FONT, color: IVORY }}
            >
              The SparkPoint Gala
            </h2>
            <div
              className="my-3 h-px w-full max-w-[240px]"
              style={{ background: `linear-gradient(90deg, ${BRASS}, #e03694 60%, transparent)` }}
              aria-hidden="true"
            />
            <p
              className="max-w-xl text-[1.3rem] leading-tight md:text-[1.45rem]"
              style={{ fontFamily: DISPLAY_FONT, textWrap: 'balance' }}
            >
              See the world. <em style={{ color: BRASS }}>Strengthen home.</em>
            </p>
            <p className="mt-1.5 max-w-xl leading-relaxed" style={{ color: 'rgba(247, 241, 229, 0.72)' }}>
              An evening of connection and a live auction of eight travel experiences, with a
              portion of every trip coming home to the Transylvania Resilience Hub.
            </p>

            <dl className="mt-4 grid gap-x-5 gap-y-3 sm:grid-cols-3">
              {facts.map((fact) => (
                <div key={fact.label}>
                  <dt className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: BRASS }}>
                    {fact.label}
                  </dt>
                  <dd className="mt-0.5 text-[11px] font-bold uppercase leading-snug tracking-[0.12em] text-white/90">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>

            {/* The boarding pass's route, in miniature. */}
            <div
              className="mt-6 flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.16em]"
              style={{ color: BRASS_LIGHT }}
              aria-hidden="true"
            >
              <span>TCN</span>
              <span className="h-0 flex-1 border-t-2 border-dashed" style={{ borderColor: 'rgba(217, 181, 106, 0.55)' }} />
              <Plane size={16} className="rotate-45" style={{ color: BRASS }} />
              <span className="h-0 flex-1 border-t-2 border-dashed" style={{ borderColor: 'rgba(217, 181, 106, 0.55)' }} />
              <span>Anywhere</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to={GALA_PATH}
              className="inline-flex min-h-[54px] w-full items-center justify-center gap-3 rounded-full px-8 text-base font-extrabold shadow-lg transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-xl"
              style={{
                color: MIDNIGHT,
                background: `linear-gradient(135deg, ${BRASS_LIGHT}, ${BRASS})`,
                boxShadow: '0 12px 30px rgba(217, 181, 106, 0.28)',
              }}
            >
              Explore the gala <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <p
              className="text-center text-[10px] font-bold uppercase leading-relaxed tracking-[0.13em]"
              style={{ color: 'rgba(247, 241, 229, 0.55)' }}
            >
              Venue &amp; tickets announced soon · Transylvania County, NC
            </p>
          </div>
        </div>
      </div>

      {/* Keepsake: a tilted print of the Gala's hero photo with a date badge. */}
      <div className="absolute -top-2 left-6 z-10 md:left-8" aria-hidden="true">
        <div
          className="absolute -inset-4 -z-10 rounded-full opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-70"
          style={{ background: `radial-gradient(circle, ${BRASS}, transparent 70%)` }}
        />
        <span
          className="absolute -left-3 -top-3 z-20 grid h-14 w-14 rotate-[-8deg] place-items-center rounded-full text-center text-[9px] font-black uppercase leading-tight transition-transform duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105"
          style={{
            color: MIDNIGHT,
            background: `linear-gradient(135deg, ${BRASS_LIGHT}, ${BRASS})`,
            border: '3px solid #fffdf8',
            boxShadow: '0 10px 24px rgba(0,0,0,0.25)',
          }}
        >
          Dec 11
          <br />
          2026
        </span>
        <div
          className="w-28 rotate-[-6deg] bg-[#fffdf7] p-1.5 pb-5 shadow-2xl transition-transform duration-300 ease-out group-hover:-translate-y-1.5 group-hover:scale-105 md:w-36"
        >
          <img
            src={heroPhoto}
            alt=""
            width={800}
            height={533}
            loading="lazy"
            className="block aspect-[4/3] w-full object-cover"
            style={{ objectPosition: '72% 40%' }}
          />
        </div>
      </div>
    </div>
  );
}
