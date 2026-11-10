// The Gala's eight trip packages (board vote 2026-11-09), ported from the trip
// kit: /Users/jeffbannister/Code/sparkpoint/Branding/Gala/WorldOfConnections/
// trips/trips.json (data) and its README (rules). Update the kit first, then
// this file.
//
// Rules from the kit that this file and its readers follow:
// - No auction: every trip is available to every guest at a set price, and
//   more than one guest can choose the same trip.
// - Prices stay hidden until Jeff sets the public prices. The kit's `listPrice`
//   is the provider's internal land-only price and is deliberately NOT copied
//   here: anything in src/ ships in the public JavaScript bundle. Each trip's
//   `price` stays null until a public price is set, and nothing renders it
//   unless GALA_SHOW_TRIP_PRICES is true.
// - Never name the package provider or its staff, never say the trips can be
//   bought after the Gala, and don't state payment timing, child pricing,
//   insurance or transferability (not confirmed).
// - Alaska: don't name the cruise line until it's confirmed.

/** One switch for every trip price on the site. Leave false until the public prices are final. */
export const GALA_SHOW_TRIP_PRICES = false;

export interface GalaTripStop {
  name: string;
  /** Decimal degrees. Filled in from the kit once the research session adds them. */
  lat?: number;
  lon?: number;
}

export interface GalaTrip {
  /** Also the page anchor: `#trip-${id}`. */
  id: string;
  order: number;
  /** Presented on stage at the Gala. Shown first, with the same visual weight as the rest. */
  featured: boolean;
  /** "01"–"08": the trip's connection number on the board, map and cards. */
  connection: string;
  name: string;
  title: string;
  country: string;
  nights: number;
  travelers: number;
  summary: string;
  included: string[];
  stops: GalaTripStop[];
  /** Departures-board destination, 16 characters max. */
  board: string;
  /** Airport code shown on the luggage tags. */
  code: string;
  /** Public price in USD; null until set. Rendered only when GALA_SHOW_TRIP_PRICES is true. */
  price: number | null;
  /** A still from the trip's promo pack (trips/<id>/pack/stills/), once one is in. */
  image?: { src: string; srcSet?: string; alt: string };
}

export const GALA_TRIPS: GalaTrip[] = [
  {
    id: 'greece',
    order: 1,
    featured: true,
    connection: '01',
    name: 'Greece',
    title: 'Greece & the Greek Islands',
    country: 'Greece',
    nights: 8,
    travelers: 2,
    summary:
      'Three nights in Santorini, three in Mykonos, then two in Athens beneath the Acropolis, linked by an island flight and a ferry.',
    included: [
      '4+ star hotels: 3 nights Santorini, 3 Mykonos, 2 Athens',
      'Daily breakfast',
      'Inter-island flight and ferry to Mykonos',
      'Half-day guided tour of Athens',
    ],
    stops: [{ name: 'Santorini' }, { name: 'Mykonos' }, { name: 'Athens' }],
    board: 'GREECE',
    code: 'ATH',
    price: null,
  },
  {
    id: 'iceland',
    order: 2,
    featured: true,
    connection: '02',
    name: 'Iceland',
    title: 'Iceland: Land of the Vikings',
    country: 'Iceland',
    nights: 6,
    travelers: 2,
    summary:
      'Six nights in Reykjavík with a food tour, the geysers and waterfalls of the Golden Circle, and the Sky Lagoon spa ritual.',
    included: [
      '4+ star hotel in Reykjavík, daily breakfast',
      'Guided foodie tour of Reykjavík',
      'Guided Golden Circle tour with farm lunch',
      'Sky Lagoon with the 7-step spa ritual',
    ],
    stops: [{ name: 'Reykjavík' }, { name: 'Golden Circle (Þingvellir, Geysir, Gullfoss)' }, { name: 'Sky Lagoon' }],
    board: 'ICELAND',
    code: 'KEF',
    price: null,
  },
  {
    id: 'cortona',
    order: 3,
    featured: true,
    connection: '03',
    name: 'Cortona',
    title: 'Cortona: Under the Tuscan Sun for four',
    country: 'Italy',
    nights: 6,
    travelers: 4,
    summary:
      'Six nights in a two-bedroom suite in the old town of Cortona, the hilltop village made famous by Under the Tuscan Sun.',
    included: [
      '2-bedroom, 2-bath suite in the historic center',
      'Welcome cocktails at Sottovoce on the main square',
      'Gourmet tasting dinner with wine pairings',
      'Private 2-hour guided walk of the old town',
    ],
    stops: [{ name: 'Cortona' }],
    board: 'CORTONA',
    code: 'FLR',
    price: null,
  },
  {
    id: 'scotland',
    order: 4,
    featured: true,
    connection: '04',
    name: 'Scotland',
    title: 'Scotland: Lochs & Legends',
    country: 'Scotland',
    nights: 7,
    travelers: 2,
    summary:
      'Edinburgh’s castle and Royal Mile, a Loch Ness cruise, then Glasgow and the West Highlands to Glencoe and Loch Lomond.',
    included: [
      '4+ star hotels: 4 nights Edinburgh, 3 Glasgow',
      'Daily breakfast, train to Glasgow',
      'Edinburgh Castle and Royal Mile tour',
      'Loch Ness cruise and West Highlands day trips',
    ],
    stops: [{ name: 'Edinburgh' }, { name: 'Loch Ness' }, { name: 'Glasgow' }, { name: 'Glencoe' }, { name: 'Loch Lomond' }],
    board: 'SCOTLAND',
    code: 'EDI',
    price: null,
  },
  {
    id: 'south-africa',
    order: 5,
    featured: true,
    connection: '05',
    name: 'South Africa',
    title: 'South Africa: Wild Wonders Photo Safari',
    country: 'South Africa',
    nights: 6,
    travelers: 2,
    summary:
      'Five nights in a lakefront tented camp with a private plunge pool, guided game drives every day, and a Big Five drive.',
    included: [
      'Luxury tented suite, plus a night in Johannesburg',
      '15 farm-to-table meals and daily drinks',
      'Game drives, plus one Big Five safari drive',
      'A traditional bush braai, and all transfers',
    ],
    // The camp's location is still to be confirmed in the kit.
    stops: [{ name: 'Johannesburg' }, { name: 'Lakefront tented safari camp' }],
    board: 'SOUTH AFRICA',
    code: 'JNB',
    price: null,
  },
  {
    id: 'portugal',
    order: 6,
    featured: false,
    connection: '06',
    name: 'Portugal',
    title: 'Captivating Portugal: Lisbon & Porto',
    country: 'Portugal',
    nights: 7,
    travelers: 2,
    summary:
      'Lisbon and Sintra, a private guided drive north to Porto, and a Douro Valley day of wine, lunch and a river cruise.',
    included: [
      '4+ star hotels, daily breakfast',
      'Small-group tour of Sintra and the Riviera',
      'Private guided transfer from Lisbon to Porto',
      'Douro Valley: wine tasting, lunch, river cruise',
      'Train from Porto back to Lisbon',
    ],
    stops: [{ name: 'Lisbon' }, { name: 'Sintra' }, { name: 'Porto' }, { name: 'Douro Valley' }],
    board: 'PORTUGAL',
    code: 'LIS',
    price: null,
  },
  {
    id: 'costa-rica',
    order: 7,
    featured: false,
    connection: '07',
    name: 'Costa Rica',
    title: 'Colorful Costa Rica',
    country: 'Costa Rica',
    nights: 6,
    travelers: 2,
    summary:
      'Rainforest and volcano around Arenal, then the Pacific beaches of Tamarindo, with two tours of the traveler’s choosing.',
    included: [
      '4+ star hotels in Arenal and Tamarindo',
      'Daily breakfast',
      'Choice of 2 shared tours, such as ziplining',
      'Airport and in-country transfers',
    ],
    stops: [{ name: 'Arenal' }, { name: 'Tamarindo' }],
    board: 'COSTA RICA',
    code: 'LIR',
    price: null,
  },
  {
    id: 'alaska',
    order: 8,
    featured: false,
    connection: '08',
    name: 'Alaska',
    // "Alaska Cruise" in the kit; the cruise line stays unnamed until confirmed.
    title: 'Alaska Cruise: Explorer of the North',
    country: 'USA',
    nights: 8,
    travelers: 2,
    summary:
      'A cruise from Seattle in a balcony cabin, calling at Ketchikan, Juneau, Skagway and Victoria, British Columbia.',
    included: [
      '7-night cruise in a balcony stateroom',
      'A night in Seattle before boarding',
      'Drinks, Wi-Fi and specialty dining package',
      '$100 shore excursion credit',
    ],
    stops: [{ name: 'Seattle' }, { name: 'Ketchikan' }, { name: 'Juneau' }, { name: 'Skagway' }, { name: 'Victoria, BC' }],
    board: 'ALASKA',
    code: 'SEA',
    price: null,
  },
];

/** Featured five first, then the other three, each group in the kit's order. */
export const GALA_TRIPS_IN_ORDER = [...GALA_TRIPS].sort(
  (a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order
);

export const GALA_TRIP_COUNT = GALA_TRIPS.length;

/** The count spelled out, for running copy ("eight trips"). Update if the count changes. */
export const GALA_TRIP_COUNT_WORD = 'eight';

/** "Greece, Iceland, …, and Alaska" for running copy and metadata. */
export const GALA_TRIP_NAMES = (() => {
  const names = GALA_TRIPS_IN_ORDER.map((trip) => trip.name);
  return `${names.slice(0, -1).join(', ')}, and ${names[names.length - 1]}`;
})();

export const tripAnchor = (trip: Pick<GalaTrip, 'id'>) => `trip-${trip.id}`;

export const travelersLabel = (travelers: number) =>
  travelers === 2 ? 'For two' : travelers === 4 ? 'For four' : `For ${travelers}`;

/** The public price, or null when prices are switched off or not set. */
export const tripPrice = (trip: GalaTrip) =>
  GALA_SHOW_TRIP_PRICES && trip.price != null ? `$${trip.price.toLocaleString('en-US')}` : null;

/** True once every trip has at least one stop with coordinates (the route map then draws real routes). */
export const GALA_TRIPS_HAVE_COORDS = GALA_TRIPS.every((trip) =>
  trip.stops.some((stop) => stop.lat != null && stop.lon != null)
);
