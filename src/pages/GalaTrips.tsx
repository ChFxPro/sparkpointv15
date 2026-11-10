import { Sparkmark } from '../components/Sparkmark';
import {
  GALA_TRIPS_IN_ORDER,
  cardStops,
  tripImageSrc,
  tripAnchor,
  tripPrice,
  travelersLabel,
  type GalaTrip,
} from '../data/galaTrips';

// The eight trips as equal cards: featured five first, then the other three,
// with no badge or size difference between them. Each card is an anchor
// (`#trip-greece` etc.) so emails and QR codes can link straight to a trip.
//
// Each card leads with the trip's hero still from its promo pack, with its
// credit line (stills.json's text, linked to the source and the licence) just
// under it: the photos are CC BY / CC BY-SA and must be credited visibly. A
// trip without a still falls back to a night-blue Deco panel.

// Renders stills.json's credit text exactly ("Author / Licence, via Site"),
// linking the author to the source page and the licence to its deed. Splits on
// the last " / " because some author names contain commas.
function CreditLine({ credit, sourceUrl, licenseUrl }: { credit: string; sourceUrl: string; licenseUrl: string }) {
  const slash = credit.lastIndexOf(' / ');
  if (slash < 0) {
    return (
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
        {credit}
      </a>
    );
  }
  const author = credit.slice(0, slash);
  const rest = credit.slice(slash + 3);
  const comma = rest.indexOf(', ');
  const license = comma < 0 ? rest : rest.slice(0, comma);
  const tail = comma < 0 ? '' : rest.slice(comma);
  return (
    <>
      <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
        {author}
      </a>
      {' / '}
      <a href={licenseUrl} target="_blank" rel="noopener noreferrer license">
        {license}
      </a>
      {tail}
    </>
  );
}

function TripArt({ trip }: { trip: GalaTrip }) {
  const image = trip.image;
  if (image) {
    return (
      <figure className="gala-trip-figure">
        <div className="gala-trip-art">
          <img
            src={tripImageSrc(image.file, 800)}
            srcSet={`${tripImageSrc(image.file, 800)} 800w, ${tripImageSrc(image.file, 1600)} 1600w`}
            sizes="(min-width: 1100px) 290px, (min-width: 640px) 46vw, 92vw"
            width={image.width}
            height={image.height}
            alt={image.alt}
            loading="lazy"
            decoding="async"
          />
          <span className="gala-trip-art-tag" aria-hidden="true">
            {trip.connection}
          </span>
        </div>
        <figcaption className="gala-trip-credit">
          {image.place ? <>{image.place} · </> : null}
          Photo: <CreditLine credit={image.credit} sourceUrl={image.sourceUrl} licenseUrl={image.licenseUrl} />
        </figcaption>
      </figure>
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
          {cardStops(trip).map((stop) => stop.name).join(' → ')}
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
