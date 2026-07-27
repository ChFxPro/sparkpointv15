import { motion } from 'motion/react';
import { ArrowRight, CalendarDays, Clock3, MapPin } from 'lucide-react';
import { Link } from 'react-router';
import heroImage from 'figma:asset/b7ea59b58a471ceacde60e41e5e3cd69fe78c66f.png';
import { SEOHead } from '../components/SEOHead';
import {
  eventAssetUrl,
  getPastEvents,
  getUpcomingEvents,
  type SparkPointEvent,
} from '../data/events';
import { canonicalUrl } from '../lib/siteOrigin';
import './events.css';

function eventMonth(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short' })
    .format(new Date(date))
    .toUpperCase();
}

function eventDay(date: string) {
  return new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(new Date(date));
}

function EventFacts({ event, compact = false }: { event: SparkPointEvent; compact?: boolean }) {
  return (
    <dl className={compact ? 'sp-event-facts sp-event-facts-compact' : 'sp-event-facts'}>
      <div>
        <CalendarDays aria-hidden="true" />
        <dt className="sr-only">Date</dt>
        <dd>{event.dateLabel}</dd>
      </div>
      <div>
        <Clock3 aria-hidden="true" />
        <dt className="sr-only">Time</dt>
        <dd>{event.timeLabel}</dd>
      </div>
      <div>
        <MapPin aria-hidden="true" />
        <dt className="sr-only">Location</dt>
        <dd>
          {event.locationName}
          <span>{event.locationLabel}</span>
        </dd>
      </div>
    </dl>
  );
}

function EventCard({ event }: { event: SparkPointEvent }) {
  return (
    <article className="sp-event-card">
      <Link className="sp-event-card-image" to={event.detailPath} aria-label={`View ${event.title}`}>
        <img src={eventAssetUrl(event)} alt={event.imageAlt} loading="lazy" />
        <span className="sp-event-date-stamp" aria-hidden="true">
          <b>{eventMonth(event.startDate)}</b>
          <strong>{eventDay(event.startDate)}</strong>
        </span>
      </Link>
      <div className="sp-event-card-copy">
        <p className="sp-event-category">{event.category}</p>
        <h3>
          <Link to={event.detailPath}>{event.title}</Link>
        </h3>
        <p>{event.summary}</p>
        <EventFacts event={event} compact />
        <Link className="sp-event-text-link" to={event.detailPath}>
          Event details <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function EventsPage() {
  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();
  const featuredEvent =
    upcomingEvents.find((event) => event.featured) ?? upcomingEvents[0];
  const remainingEvents = upcomingEvents.filter((event) => event.id !== featuredEvent?.id);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl('/events')}#events`,
    name: 'SparkPoint Events',
    description:
      'Upcoming SparkPoint convenings, workshops, community gatherings, and shared learning experiences across Western North Carolina.',
    url: canonicalUrl('/events'),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: upcomingEvents.map((event, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: canonicalUrl(event.detailPath),
        name: event.title,
      })),
    },
  };

  return (
    <div className="sp-events-page">
      <SEOHead
        title="Events & Gatherings | SparkPoint"
        description="Discover upcoming SparkPoint events, workshops, convenings, and shared learning experiences across Transylvania County and Western North Carolina."
        path="/events"
        image={featuredEvent ? `/${featuredEvent.imagePath}` : undefined}
        imageAlt={featuredEvent?.imageAlt}
        jsonLd={itemListJsonLd}
      />

      <section className="sp-events-hero" aria-labelledby="events-title">
        <div className="sp-events-hero-media" aria-hidden="true">
          <img src={heroImage} alt="" />
          <div />
        </div>
        <div className="sp-events-shell sp-events-hero-copy">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
          >
            <p className="sp-events-kicker">SparkPoint Events</p>
            <h1 id="events-title">Where we gather.</h1>
            <p className="sp-events-intro">
              Convenings, workshops, and community experiences designed to turn shared
              learning into stronger connection.
            </p>
            <p className="sp-events-note">
              Come curious. Leave knowing more people—and more ways forward.
            </p>
          </motion.div>
        </div>
      </section>

      {featuredEvent ? (
        <section className="sp-events-feature-section" aria-labelledby="featured-event-title">
          <div className="sp-events-shell">
            <p className="sp-events-section-label">Featured gathering</p>
            <motion.article
              className="sp-featured-event"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55 }}
            >
              <Link className="sp-featured-event-media" to={featuredEvent.detailPath}>
                <img src={eventAssetUrl(featuredEvent)} alt={featuredEvent.imageAlt} />
                <span className="sp-featured-date" aria-label={featuredEvent.dateLabel}>
                  <b>{eventMonth(featuredEvent.startDate)}</b>
                  <strong>{eventDay(featuredEvent.startDate)}</strong>
                  <small>2026</small>
                </span>
              </Link>

              <div className="sp-featured-event-copy">
                <p className="sp-event-category">{featuredEvent.category}</p>
                <h2 id="featured-event-title">{featuredEvent.title}</h2>
                <p className="sp-featured-summary">{featuredEvent.summary}</p>
                <EventFacts event={featuredEvent} />
                {featuredEvent.partnerLine ? (
                  <p className="sp-event-partner-line">{featuredEvent.partnerLine}</p>
                ) : null}
                <div className="sp-event-actions">
                  <Link className="sp-event-button sp-event-button-primary" to={featuredEvent.detailPath}>
                    Explore the event <ArrowRight aria-hidden="true" />
                  </Link>
                  {featuredEvent.registrationPath ? (
                    <a
                      className="sp-event-button sp-event-button-secondary"
                      href={featuredEvent.registrationPath}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {featuredEvent.registrationLabel ?? 'Register'}
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.article>
          </div>
        </section>
      ) : (
        <section className="sp-events-empty">
          <div className="sp-events-shell">
            <h2>The next gathering is taking shape.</h2>
            <p>Join the SparkPoint newsletter to hear when new events open.</p>
            <Link className="sp-event-button sp-event-button-primary" to="/newsletter">
              Join the newsletter <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {remainingEvents.length > 0 ? (
        <section className="sp-events-list-section" aria-labelledby="upcoming-events-title">
          <div className="sp-events-shell">
            <div className="sp-events-section-heading">
              <div>
                <p className="sp-events-section-label">On the calendar</p>
                <h2 id="upcoming-events-title">Upcoming events</h2>
              </div>
              <span>{remainingEvents.length} upcoming</span>
            </div>
            <div className="sp-events-grid">
              {remainingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="sp-events-more">
          <div className="sp-events-shell sp-events-more-inner">
            <div>
              <p className="sp-events-section-label">More to come</p>
              <h2>The calendar is growing.</h2>
              <p>
                New workshops, community gatherings, and learning experiences will appear
                here as registration opens.
              </p>
            </div>
            <Link className="sp-event-button sp-event-button-outline" to="/newsletter">
              Get event updates <ArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {pastEvents.length > 0 ? (
        <section className="sp-events-past" aria-labelledby="past-events-title">
          <div className="sp-events-shell">
            <div className="sp-events-section-heading">
              <div>
                <p className="sp-events-section-label">From the field</p>
                <h2 id="past-events-title">Past gatherings</h2>
              </div>
            </div>
            <div className="sp-events-grid">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
