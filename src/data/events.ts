export type EventCategory =
  | 'Convening'
  | 'Workshop'
  | 'Community'
  | 'Learning'
  | 'Fundraiser';

// Common Ground Resilience Roast product page — shared by the Thrive @ Five event
// page and the homepage promo so both stay pointed at the same listing.
export const COMMON_GROUND_PURCHASE_URL =
  'https://pisgahroasters.com/collections/limited-edition/products/commonground-premium-microlot-roast';

// Monday WorkForm for Gala sponsor leads ("SparkPoint Gala · Sponsorship Interest",
// board 18435094223 in the SparkPoint workspace). Used by the seat-map teaser.
export const GALA_PARTNER_FORM_URL =
  'https://forms.monday.com/forms/8bc904c73a179d5be96939ed2c05b62a';

// SparkPoint Gala logistics, shared by the Gala page, the homepage card and
// the Events listing. Tickets aren't on sale yet: set GALA_TICKETS_URL to the
// purchase link and every ticket button switches from "on sale soon" to
// "Get tickets".
export const GALA_VENUE = {
  name: 'Connestee Falls Country Club',
  street: '98 Overlook Clubhouse Dr',
  city: 'Brevard',
  region: 'NC',
  postalCode: '28712',
  mapUrl:
    'https://www.google.com/maps/search/?api=1&query=Connestee+Falls+Country+Club+98+Overlook+Clubhouse+Dr+Brevard+NC+28712',
};
export const GALA_TICKET_PRICE = 100;
export const GALA_TICKET_PRICE_LABEL = `$${GALA_TICKET_PRICE} per person`;
export const GALA_TICKETS_URL: string | null =
  'https://secure.yoursparkpoint.org/store/p/2026-sparkpoint-gala';

export interface SparkPointEvent {
  id: string;
  title: string;
  shortTitle: string;
  category: EventCategory;
  startDate: string;
  endDate?: string;
  dateLabel: string;
  timeLabel: string;
  locationName: string;
  locationLabel: string;
  summary: string;
  detailPath?: string;
  registrationPath?: string;
  registrationLabel?: string;
  imagePath?: string;
  imageAlt?: string;
  featured?: boolean;
  partnerLine?: string;
  // Who puts the event on, shown as the line above its title on the Events
  // page (e.g. "The SparkPoint Gala"). Falls back to the category.
  presenter?: string;
  // Show the Gala's A World of Connections lockup in the save-the-date panel in
  // place of the big date.
  galaLockup?: boolean;
  // A save-the-date: an event without its own photo yet. The Events page gives
  // it a typographic panel instead of the photo layout (linking to
  // `detailPath` when there is one), and it never lists under Past Gatherings.
  // Drop this flag once the event has a photo.
  teaser?: boolean;
}

// Add future events here. The Events page sorts upcoming gatherings by date,
// chooses the first explicitly featured event as its lead, and moves expired
// entries into the Past Gatherings section automatically.
export const EVENTS: SparkPointEvent[] = [
  {
    id: 'sparkpoint-gala-2026',
    title: 'A World of Connections',
    shortTitle: 'A World of Connections',
    presenter: 'The SparkPoint Gala',
    galaLockup: true,
    category: 'Fundraiser',
    startDate: '2026-12-11T18:00:00-05:00',
    // No end time announced yet; holding the whole evening keeps it upcoming
    // until the night is over.
    endDate: '2026-12-11T23:59:00-05:00',
    dateLabel: 'Friday, December 11, 2026',
    timeLabel: '6:00 p.m.',
    locationName: GALA_VENUE.name,
    locationLabel: `${GALA_VENUE.street}, ${GALA_VENUE.city}, ${GALA_VENUE.region} ${GALA_VENUE.postalCode}`,
    summary:
      'Every journey connects back home. An evening of connection and a live auction of eight travel experiences, with a portion of every trip coming home to support the Transylvania Resilience Hub.',
    detailPath: '/events/sparkpoint-gala',
    featured: true,
    teaser: true,
  },
  {
    id: 'thrive-at-five-common-ground-2026',
    title: 'Thrive @ Five: Common Ground Release Party',
    shortTitle: 'Thrive @ Five',
    category: 'Fundraiser',
    startDate: '2026-07-31T17:00:00-04:00',
    endDate: '2026-07-31T19:00:00-04:00',
    dateLabel: 'Friday, July 31, 2026',
    timeLabel: '5:00–7:00 p.m.',
    locationName: 'Pisgah Coffee Roasters',
    locationLabel: '6283 Asheville Highway, Pisgah Forest',
    summary:
      'Raise a cup to connection with a new limited roast, live music from Mark and Sally Wingate, food, drinks, and friends—all helping fuel SparkPoint’s Resilience Hub.',
    detailPath: '/events/thrive-at-five',
    registrationPath: 'https://www.facebook.com/share/1BaHvsc1p3/',
    registrationLabel: 'View the Facebook event',
    imagePath:
      'assets/events/pisgah_coffee_fundraiser/Sparkpoint Photos-2.webp',
    imageAlt:
      'Two bags of Common Ground Resilience Roast and a cup of coffee arranged over a map of Transylvania County.',
    featured: true,
    partnerLine:
      'A SparkPoint and Pisgah Coffee Roasters collaboration benefiting the new Resilience Hub.',
  },
  {
    id: 'dr-ora-brain-healthy-habits-2026',
    title: 'Building Healthy Brain Habits',
    shortTitle: 'Brain Healthy Habits',
    category: 'Workshop',
    startDate: '2026-08-10T18:00:00-04:00',
    endDate: '2026-08-10T19:30:00-04:00',
    dateLabel: 'Monday, August 10, 2026',
    timeLabel: '6:00–7:30 p.m.',
    locationName: 'Transylvania County Library',
    locationLabel: 'Rogow Family Community Room, 212 S Gaston St, Brevard',
    summary:
      'Dr. Ora Wells joined the Alzheimer’s Association and NC Cooperative Extension for an interactive workshop on brain health prevention, cognitive reserve strategies, nutrition, and wellness activities for everyone.',
    detailPath: '/stories/talks-lectures/dr-ora-brain-health',
    imagePath: 'assets/dr_ora_brain_img/drora_crowd1.webp',
    imageAlt: 'Dr. Ora Wells speaking to a full room at a past Brain Health talk.',
    partnerLine:
      'A community health talk from SparkPoint Board President Dr. Ora Wells, with the Alzheimer’s Association and NC Cooperative Extension.',
  },
  {
    id: 'rural-health-convening-2026',
    title: '2026 WNC Regional Rural Health Convening',
    shortTitle: 'Rural Health Convening',
    category: 'Convening',
    startDate: '2026-10-01T08:30:00-04:00',
    endDate: '2026-10-01T15:00:00-04:00',
    dateLabel: 'Thursday, October 1, 2026',
    timeLabel: '8:30 a.m.–3:00 p.m.',
    locationName: 'Deerwoode Reserve',
    locationLabel: 'Brevard, North Carolina',
    summary:
      'A full house of rural health leaders from across Western North Carolina connected, collaborated, and walked the Rural Health Field Simulator together.',
    detailPath: '/rural-health-convening',
    imagePath: 'assets/Rural Health/rural sim hero.webp',
    imageAlt:
      'The Rural Health Field Simulator connection map showing the paths between trusted doors, care providers, and community resources.',
    partnerLine:
      'Hosted by SparkPoint in partnership with the North Carolina Rural Health Association.',
  },
  {
    id: 'collaboration-lab-2026',
    title: 'Collaboration Lab: Building Partnerships That Last',
    shortTitle: 'Collaboration Lab',
    category: 'Learning',
    startDate: '2026-10-23T09:00:00-04:00',
    endDate: '2026-10-23T12:00:00-04:00',
    dateLabel: 'Friday, October 23, 2026',
    timeLabel: '9:00 a.m.–12:00 p.m.',
    locationName: 'Mary C. Jenkins Community & Cultural Center',
    locationLabel: 'Brevard, North Carolina',
    summary:
      'Nonprofit and community leaders from across Transylvania County spent a morning on what makes partnerships work, with SparkPoint and FWRD Transylvania sharing Wellness Rooted in Connection and Community Connectors. Watch the program and download the photos.',
    detailPath: '/collaboration-lab/media',
    imagePath: 'assets/collab-lab/collab-lab-tables-1920.webp',
    imageAlt: 'Attendees at a round table write on sticky notes during a small-group exercise.',
    partnerLine:
      'Hosted by Pisgah Health Foundation in partnership with Dogwood Health Trust, with SparkPoint and FWRD Transylvania.',
  },
];

export function eventAssetUrl(event: SparkPointEvent) {
  return event.imagePath ? `${import.meta.env.BASE_URL}${event.imagePath}` : undefined;
}

export function getUpcomingEvents(now = new Date()) {
  return EVENTS.filter((event) => new Date(event.endDate ?? event.startDate) >= now).sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

// The homepage hero's primary button points at the next gathering on the
// calendar. Returns null when nothing is scheduled, so the hero falls back to
// the Events hub.
export function getNextGathering(now = new Date()) {
  return getUpcomingEvents(now)[0] ?? null;
}

export function getPastEvents(now = new Date()) {
  return EVENTS.filter(
    (event) => !event.teaser && new Date(event.endDate ?? event.startDate) < now
  ).sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}
