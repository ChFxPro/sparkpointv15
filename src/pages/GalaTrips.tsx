import { Sparkmark } from '../components/Sparkmark';
import {
  GALA_TRIPS_IN_ORDER,
  tripAnchor,
  tripPrice,
  travelersLabel,
  type GalaTrip,
} from '../data/galaTrips';

// The eight trips as equal cards: featured five first, then the other three,
// with no badge or size difference between them. Each card is an anchor
// (`#trip-greece` etc.) so emails and QR codes can link straight to a trip.
//
// Until a trip's still from its promo pack is in (`image` in galaTrips.ts),
// the card shows a night-blue Deco panel with its connection number instead.

function TripArt({ trip }: { trip: GalaTrip }) {
  if (trip.image) {
    return (
      <div className="gala-trip-art">
        <img src={trip.image.src} srcSet={trip.image.srcSet} sizes="(min-width: 1100px) 280px, (min-width: 640px) 45vw, 90vw" alt={trip.image.alt} loading="lazy" />
      </div>
    );
  }
  return (
    <div className="gala-trip-art gala-trip-art-panel" aria-hidden="true">
      <svg viewBox="0 0 200 120" className="gala-trip-globe">
        <circle cx="100" cy="128" r="92" />
        <ellipse cx="100" cy="128" rx="58" ry="92" />
        <ellipse cx="100" cy="128" rx="24" ry="92" />
        <ellipse cx="100" cy="128" rx="92" ry="36" />
        <path className="gala-trip-globe-route" d="M16 116 Q 34 92 60 96" />
        <circle className="gala-trip-globe-node" cx="60" cy="96" r="2.2" />
      </svg>
      <span className="gala-trip-art-num">{trip.connection}</span>
      <span className="gala-trip-art-country">
        {trip.name === trip.country ? trip.name : `${trip.name} · ${trip.country}`}
      </span>
    </div>
  );
}

function TripCard({ trip }: { trip: GalaTrip }) {
  const price = tripPrice(trip);
  const headingId = `${tripAnchor(trip)}-title`;
  return (
    <li className="gala-trip" id={tripAnchor(trip)} aria-labelledby={headingId}>
      <TripArt trip={trip} />
      <div className="gala-trip-body">
        <p className="gala-trip-connection">
          Connection {trip.connection} · {trip.name}
        </p>
        <h3 id={headingId}>{trip.title}</h3>
        <p className="gala-trip-meta">
          <span>{trip.nights} nights</span>
          <span aria-hidden="true">·</span>
          <span>{travelersLabel(trip.travelers)}</span>
          {price ? (
            <>
              <span aria-hidden="true">·</span>
              <span className="gala-trip-price">{price}</span>
            </>
          ) : null}
        </p>
        <p className="gala-trip-summary">{trip.summary}</p>
        <h4 className="gala-trip-included-title">Included</h4>
        <ul className="gala-trip-included">
          {trip.included.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="gala-trip-stops">
          <Sparkmark variant="ink" size="12px" className="gala-trip-stops-mark" />
          <span className="sr-only">Stops: </span>
          {trip.stops.map((stop) => stop.name).join(' → ')}
        </p>
      </div>
    </li>
  );
}

export function GalaTrips() {
  return (
    <ol className="gala-trips">
      {GALA_TRIPS_IN_ORDER.map((trip) => (
        <TripCard key={trip.id} trip={trip} />
      ))}
    </ol>
  );
}
