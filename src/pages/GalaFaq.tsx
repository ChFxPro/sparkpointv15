// The Gala page's FAQ (#faq), directly under "How it works" (the passport).
//
// Only answers the package provider has confirmed in writing (its reply to
// Jenny, 2026-11-12) or that the trip kit already allows. Two things stay off
// on purpose (Jeff, 2026-11-16):
// - Buying a trip after the Gala. It's possible, but it isn't advertised until
//   after Dec 11, so guests choose on the night.
// - Who sends the tax acknowledgment. Say only that part of the price is a
//   tax-deductible gift until Jeff confirms who issues it.
// Local taxes and fees (hotel, tourist, port) aren't in the prices: say so, but
// not when or how much, and keep "by credit card" until checks are confirmed.
// Native <details> so every answer works without JavaScript and with a keyboard.

import { motion, useReducedMotion } from 'motion/react';
import { GALA_TRIP_COUNT_WORD } from '../data/galaTrips';

interface Faq {
  q: string;
  a: string;
  links?: { label: string; href: string }[];
}

// Directions follow the venue's own request (Oct 26 planning meeting): every guest
// comes in by the East Fork Gate, where an extra security guard lets Gala guests in,
// then follows the yellow line 1.4 miles to the Clubhouse; parking behind the wellness
// center. Route checked 2026-11-20 against OpenStreetMap (OSRM): US 276 South past
// Connestee's main entrance, right on East Fork Road, right through the East Fork
// Gate onto Connestee Trail. The map links go to the gate itself, because a phone
// routing to the Clubhouse address sends guests in by the main gate instead.
const VENUE_ADDRESS = '98 Overlook Clubhouse Dr, Brevard, NC 28712';
const EAST_FORK_GATE = '35.1501,-82.7083';

const FAQS: Faq[] = [
  {
    q: 'Do I have to buy a trip to come?',
    a: 'No. Your ticket is all you need. The trips are the night’s fundraiser, offered at set prices for anyone who’d like one; there’s no auction and no bidding.',
  },
  {
    q: 'What does my ticket include?',
    // Two drink tickets per guest: Oct 26 planning meeting. Whether more can be
    // bought after that wasn't settled, so the page doesn't say.
    a: 'Heavy hors d’oeuvres and cocktails, plenty to make a supper of, with two drink tickets; live music from the Blue Ridge Bakery Band; and an evening with friends and neighbors, looking back on 2026 together, from 6 to 9 p.m. Tickets are $100.',
  },
  {
    q: 'Do I need to bring a ticket?',
    a: 'No. Your name will be on our list at the door; there’s nothing to print.',
  },
  {
    q: 'What should I wear?',
    a: 'Festive cocktail attire: your holiday best, with a little sparkle.',
  },
  {
    q: 'I’m coming on my own, or I’m new to the area. Will I know anyone?',
    a: 'You’ll be among friends. The evening is made for meeting people, and our team will be glad to introduce you around.',
  },
  {
    q: 'How do I get there, and where do I park?',
    a: `Connestee Falls Clubhouse, ${VENUE_ADDRESS}. Please come in by the East Fork Gate, not the main entrance. From Brevard, take US 276 South (Greenville Highway) about 7 miles, past Connestee Falls’ main entrance, and turn right onto East Fork Road. In about a quarter mile, turn right through the East Fork Gate, where a security guard will welcome Gala guests, and follow the yellow line 1.4 miles to the Clubhouse. Park anywhere; the closest spaces are right behind the wellness center, and the golf parking is open in the evening.`,
    links: [
      { label: 'See the route on the map', href: '#getting-there' },
      { label: 'Directions to the East Fork Gate in Google Maps', href: `https://www.google.com/maps/dir/?api=1&destination=${EAST_FORK_GATE}` },
      { label: 'Directions in Apple Maps', href: `https://maps.apple.com/?daddr=${EAST_FORK_GATE}&q=East%20Fork%20Gate` },
    ],
  },
  {
    q: 'How do I choose a trip?',
    a: `At the Gala. Five trips are presented on stage and three more are offered at your table, ${GALA_TRIP_COUNT_WORD} in all. Every trip is available to every guest at a set price, and more than one guest can choose the same trip, so no one misses out.`,
  },
  {
    q: 'When and how do I pay?',
    a: 'In full, at the Gala or by the following week at the latest. Payment is by credit card, and you can split it across more than one card.',
  },
  {
    q: 'What isn’t included?',
    a: 'Airfare, and local taxes and fees, such as hotel, tourist or port taxes, which vary by destination. Each trip covers what’s listed in its highlights: hotels, tours and transfers on the ground. You book your own flights.',
  },
  {
    q: 'When can I travel?',
    a: 'Any time within three years, with no blackout dates. You choose your dates with a travel specialist.',
  },
  {
    q: 'Can I bring more people?',
    a: 'The Cortona apartment is for four, in any mix of adults and children. On the trips for two, children 18 and under, or adults with disabilities, can be added for an extra charge when you book. More travelers or extra nights can be added on request.',
  },
  {
    q: 'Will we be traveling with a big group?',
    a: 'No. It varies by trip: most tours are small-group and some are private, but the trip itself is your own vacation for two (or four).',
  },
  {
    q: 'Is travel insurance included?',
    a: 'It isn’t included. Optional travel insurance is offered when you book, or you can use your own.',
  },
  {
    q: 'Can I give the trip to someone else?',
    a: 'Yes. The person who chooses the trip at the Gala can transfer it to someone else.',
  },
  {
    q: 'Is any of it tax-deductible?',
    // Kept general on purpose (Jeff, 2026-11-20): the ticket's and each trip's
    // deductible amounts wait for the accountant's and AmFund's confirmation. For
    // payments over $75 that buy goods or services, the IRS requires a written
    // estimate of their value and the deductible amount, on the ticket confirmation
    // and trip receipts, not necessarily on this page.
    a: 'Yes. Part of every trip’s price is a tax-deductible gift to SparkPoint.',
  },
  {
    q: 'Where does the money go?',
    a: 'A portion of every trip comes home to SparkPoint, to strengthen community well-being through connection and help bring the Transylvania Resilience Hub to life.',
  },
];

const HALF = Math.ceil(FAQS.length / 2);

export function GalaFaq() {
  // Same reveal as the rest of the page; still under reduced motion.
  const reveal = useReducedMotion()
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-60px' },
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section id="faq" className="gala-faq" aria-labelledby="faq-title">
      <div className="gala-shell">
        <motion.div className="gala-section-head" {...reveal}>
          <h2 id="faq-title">
            Questions, <em>answered.</em>
          </h2>
        </motion.div>
        {/* Two independent columns, so opening an answer never leaves a gap beside it. */}
        <div className="gala-faq-list">
          {[FAQS.slice(0, HALF), FAQS.slice(HALF)].map((column, index) => (
            <div key={index} className="gala-faq-column">
              {column.map((item) => (
                <details key={item.q} className="gala-faq-item">
                  <summary>
                    <span>{item.q}</span>
                    <span className="gala-faq-mark" aria-hidden="true" />
                  </summary>
                  <p>{item.a}</p>
                  {item.links ? (
                    <p className="gala-faq-links">
                      {item.links.map((link) => (
                        link.href.startsWith('#') ? (
                          <a key={link.href} href={link.href}>
                            {link.label}
                          </a>
                        ) : (
                          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                            {link.label}
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        )
                      ))}
                    </p>
                  ) : null}
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
