// "Our travel partner": who AmFund is, under the eight trips on the Gala page.
// AmFund asked (2026-11-12) to be presented as a partner, not a vendor, and the
// owner wanted more than a credit line. Every fact here is from AmFund's own
// site (amfund.org: home, About, Fundraising Travel Program, Golden Pear Grant
// Program, nonprofit testimonials), read 2026-11-12, plus its IRS record
// (EIN 81-1160316, 501(c)(3), Maitland, FL). Re-check the figures before
// changing them; AmFund's pages don't all agree ($64M in an older bio vs $70M+
// on the home page), so this uses the current home-page number.
// Keep off: AmFund staff names and contact details (the founders are history,
// not contacts), trip prices, and SparkPoint's share of each trip.

const BASE = import.meta.env.BASE_URL;
const AMFUND_URL = 'https://www.amfund.org/';

const FACTS = [
  { value: '1999', label: 'Founded' },
  { value: '$70M+', label: 'Raised for nonprofits' },
  { value: '50', label: 'States served' },
  { value: '~800', label: 'Nonprofits a year' },
];

const PROMISES = [
  {
    title: 'No cost to SparkPoint',
    body: 'AmFund supplies the trips. SparkPoint pays nothing to offer them, so what comes home goes to the Resilience Hub.',
  },
  {
    title: 'Their own travel team',
    body: 'In-house travel specialists help you choose your dates, handle the booking, and are on call while you’re away.',
  },
  {
    title: 'With us on the night',
    body: 'AmFund’s team will host the travel table at the Gala to answer questions and help you choose your trip.',
  },
];

export function GalaTravelPartner() {
  return (
    <section className="gala-amfund" aria-labelledby="travel-partner-title">
      <div className="gala-amfund-intro">
        <a className="gala-amfund-logo" href={AMFUND_URL} target="_blank" rel="noopener noreferrer">
          <img
            src={`${BASE}assets/events/gala/amfund-logo-reversed.webp`}
            alt="AmFund, American Fundraising Foundation (opens in a new tab)"
            width={503}
            height={155}
            loading="lazy"
            decoding="async"
          />
        </a>
        <p className="gala-label">Our travel partner</p>
        <h3 id="travel-partner-title">
          A nonprofit that <em>funds nonprofits.</em>
        </h3>
        <p>
          Every trip at the Gala comes from AmFund, the American Fundraising Foundation, a national
          501(c)(3) that turns travel into support for community causes.
        </p>
        <p>
          It began in 1999 with two television journalists, Wade and Barbara West, who had spent years
          reporting on nonprofits doing vital work on too little money. Their conviction was simple:
          no worthy nonprofit should have to spend money to raise it. They called the answer Travel for a
          Good Cause.
        </p>
      </div>

      <dl className="gala-amfund-facts">
        {FACTS.map((fact) => (
          <div key={fact.label}>
            <dt>{fact.label}</dt>
            <dd>{fact.value}</dd>
          </div>
        ))}
      </dl>

      <ul className="gala-amfund-promises">
        {PROMISES.map((promise) => (
          <li key={promise.title}>
            <strong>{promise.title}</strong>
            <p>{promise.body}</p>
          </li>
        ))}
      </ul>

      <p className="gala-amfund-more">
        Beyond events, AmFund’s Golden Pear grants have given more than $750,000 in unrestricted funding
        to U.S. nonprofits since 2020. Groups that have offered its trips include Big Brothers Big
        Sisters, Delaware Hospice and the Zonta Club.{' '}
        <a href={AMFUND_URL} target="_blank" rel="noopener noreferrer">
          More about AmFund<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    </section>
  );
}
