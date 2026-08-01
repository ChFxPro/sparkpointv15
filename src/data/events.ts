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
  detailPath: string;
  registrationPath?: string;
  registrationLabel?: string;
  imagePath: string;
  imageAlt: string;
  featured?: boolean;
  partnerLine?: string;
}

// Add future events here. The Events page sorts upcoming gatherings by date,
// chooses the first explicitly featured event as its lead, and moves expired
// entries into the Past Gatherings section automatically.
export const EVENTS: SparkPointEvent[] = [
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
      'A day for rural health leaders across Western North Carolina to connect, collaborate, and experience the Rural Health Field Simulator together.',
    detailPath: '/rural-health-convening',
    registrationPath:
      'https://forms.monday.com/forms/a206690ce2304f99b5130fbdd2e0825b?r=use1',
    registrationLabel: 'Join the priority list',
    imagePath: 'assets/Rural Health/rural sim hero.webp',
    imageAlt:
      'The Rural Health Field Simulator connection map showing the paths between trusted doors, care providers, and community resources.',
    partnerLine:
      'Hosted by SparkPoint in partnership with the North Carolina Rural Health Association.',
  },
];

export function eventAssetUrl(event: SparkPointEvent) {
  return `${import.meta.env.BASE_URL}${event.imagePath}`;
}

export function getUpcomingEvents(now = new Date()) {
  return EVENTS.filter((event) => new Date(event.endDate ?? event.startDate) >= now).sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
}

export function getPastEvents(now = new Date()) {
  return EVENTS.filter((event) => new Date(event.endDate ?? event.startDate) < now).sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
}
