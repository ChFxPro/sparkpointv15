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
  /** Decimal degrees, from the kit's research (trips.json `stops`). */
  lat?: number;
  lon?: number;
  /** Nights spent here; 0 for a day visit or port call. */
  nights?: number;
  /** Map only: left off the card's stop line (an arrival airport, a return leg). */
  routeOnly?: boolean;
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
  /**
   * The hero still from the trip's promo pack (trips/<id>/pack/stills/, `01`),
   * copied to public/assets/events/gala/trips/. `credit` is stills.json's credit
   * line, used exactly: the photos are CC BY / CC BY-SA and need visible credit.
   */
  image?: {
    file: string;
    alt: string;
    /** Caption place name; null where it could mislead (South Africa's camp isn't named). */
    place: string | null;
    credit: string;
    sourceUrl: string;
    licenseUrl: string;
    width: number;
    height: number;
  };
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
    stops: [
      { name: "Athens airport", lat: 37.9364, lon: 23.9445, nights: 0, routeOnly: true },
      { name: "Santorini", lat: 36.4166, lon: 25.432, nights: 3 },
      { name: "Mykonos", lat: 37.4467, lon: 25.3289, nights: 3 },
      { name: "Athens", lat: 37.9715, lon: 23.7257, nights: 2 },
    ],
    board: 'GREECE',
    code: 'ATH',
    price: null,
    image: {
      file: "greece-01-santorini-oia",
      alt: "Blue-domed white churches of Oia above the Santorini caldera and the Aegean Sea",
      place: "Oia, Santorini",
      credit: "Giles Laurent / CC BY-SA 4.0, via Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:1000_Three_domes_of_Oia_in_Santorini_Photo_by_Giles_Laurent.jpg",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      width: 2400,
      height: 1600,
    },
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
    stops: [
      { name: "Reykjavík", lat: 64.1466, lon: -21.9426, nights: 6 },
      { name: "Þingvellir National Park", lat: 64.2559, lon: -21.1299, nights: 0 },
      { name: "Geysir / Strokkur", lat: 64.3104, lon: -20.3024, nights: 0 },
      { name: "Gullfoss", lat: 64.3271, lon: -20.1199, nights: 0 },
      { name: "Sky Lagoon", lat: 64.115, lon: -21.945, nights: 0 },
    ],
    board: 'ICELAND',
    code: 'KEF',
    price: null,
    image: {
      file: "iceland-01-gullfoss",
      alt: "Gullfoss waterfall plunging into its canyon with a rainbow in the spray",
      place: "Gullfoss, Golden Circle",
      credit: "Diego Delso / CC BY-SA 4.0, via Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Gullfoss,_Su%C3%B0urland,_Islandia,_2014-08-16,_DD_123.JPG",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      width: 2400,
      height: 1482,
    },
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
    stops: [
      { name: "Cortona", lat: 43.2753, lon: 11.9858, nights: 6 },
    ],
    board: 'CORTONA',
    code: 'FLR',
    price: null,
    image: {
      file: "cortona-01-cortona-hilltop",
      alt: "The walled hilltop town of Cortona among olive terraces, seen from the air",
      place: "Cortona",
      credit: "TeKappa / CC BY-SA 4.0, via Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Cortona_dall%27aereo.jpg",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      width: 2400,
      height: 1598,
    },
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
    stops: [
      { name: "Edinburgh", lat: 55.9486, lon: -3.1999, nights: 4 },
      { name: "Inverness", lat: 57.4778, lon: -4.2247, nights: 0 },
      { name: "Loch Ness / Urquhart Castle", lat: 57.3242, lon: -4.4419, nights: 0 },
      { name: "Glasgow", lat: 55.8642, lon: -4.2518, nights: 3 },
      { name: "Glencoe", lat: 56.6826, lon: -5.1023, nights: 0 },
      { name: "Loch Lomond", lat: 56.101, lon: -4.638, nights: 0 },
    ],
    board: 'SCOTLAND',
    code: 'EDI',
    price: null,
    image: {
      file: "scotland-01-glencoe",
      alt: "Golden evening light on the mountains of Glencoe in the Scottish Highlands",
      place: "Glencoe, West Highlands",
      credit: "john mcsporran from Trossachs, Scotland / CC BY 2.0, via Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Glencoe_(26642526873).jpg",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0",
      width: 2400,
      height: 1200,
    },
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
    // The camp isn't named yet, so it has no coordinates and the photo has no place caption.
    stops: [
      { name: "Johannesburg", lat: -26.2041, lon: 28.0473, nights: 1 },
      { name: 'Lakefront tented safari camp', nights: 5 },
    ],
    board: 'SOUTH AFRICA',
    code: 'JNB',
    price: null,
    image: {
      file: "south-africa-01-lion",
      alt: "A young male lion resting in the long grass, looking toward the camera",
      place: null,
      credit: "Chris Eason / CC BY 2.0, via Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Lion_Kruger_National_Park.jpg",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0",
      width: 2400,
      height: 1594,
    },
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
    stops: [
      { name: "Lisbon", lat: 38.7223, lon: -9.1393, nights: 3 },
      { name: "Sintra", lat: 38.7876, lon: -9.3906, nights: 0 },
      { name: "Cabo da Roca", lat: 38.7804, lon: -9.4989, nights: 0 },
      { name: "Cascais", lat: 38.6979, lon: -9.4215, nights: 0 },
      { name: "Porto", lat: 41.1496, lon: -8.611, nights: 3 },
      { name: "Douro Valley", lat: 41.192, lon: -7.546, nights: 0 },
      { name: "Lisbon", lat: 38.7223, lon: -9.1393, nights: 1, routeOnly: true },
    ],
    board: 'PORTUGAL',
    code: 'LIS',
    price: null,
    image: {
      file: "portugal-01-porto-ribeira",
      alt: "Traditional rabelo boats on the Douro in front of Porto's Ribeira waterfront at golden hour",
      place: "Ribeira, Porto",
      credit: "Krzysztof Golik / CC BY-SA 4.0, via Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:View_of_Ribeira_(21).jpg",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      width: 2400,
      height: 1455,
    },
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
    stops: [
      { name: "Arenal", lat: 10.471, lon: -84.6453 },
      { name: "Tamarindo", lat: 10.2993, lon: -85.8371 },
    ],
    board: 'COSTA RICA',
    code: 'LIR',
    price: null,
    image: {
      file: "costa-rica-01-arenal-volcano",
      alt: "The cone of Arenal Volcano rising above green rainforest and farmland",
      place: "Arenal Volcano",
      credit: "Rhododendrites / CC BY-SA 4.0, via Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Arenal_volcano_(70785p)_(cropped).jpg",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
      width: 2400,
      height: 1326,
    },
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
    stops: [
      { name: "Seattle", lat: 47.6062, lon: -122.3321, nights: 1 },
      { name: "Juneau", lat: 58.3019, lon: -134.4197, nights: 0 },
      { name: "Skagway", lat: 59.4583, lon: -135.3139, nights: 0 },
      { name: "Ketchikan", lat: 55.3422, lon: -131.6461, nights: 0 },
      { name: "Victoria, BC", lat: 48.4284, lon: -123.3656, nights: 0 },
      { name: "Seattle", lat: 47.6062, lon: -122.3321, nights: 0, routeOnly: true },
    ],
    board: 'ALASKA',
    code: 'SEA',
    price: null,
    image: {
      file: "alaska-01-mendenhall-glacier",
      alt: "Mendenhall Glacier flowing between mountains into its lake near Juneau",
      place: "Mendenhall Glacier, Juneau",
      credit: "Jay Galvin (jay galvin) / CC BY 2.0, via Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mendenhall_Glacier_(Alaska).jpg",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0",
      width: 2400,
      height: 1414,
    },
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

/** Responsive sources for a trip's hero still. */
export const tripImageSrc = (file: string, width: 800 | 1600) =>
  `${import.meta.env.BASE_URL}assets/events/gala/trips/${file}-${width}.webp`;

/** The stops named on a trip's card: no arrival airports or return legs. */
export const cardStops = (trip: GalaTrip) => trip.stops.filter((stop) => !stop.routeOnly);

/** True once every trip has at least one stop with coordinates (the route map then draws real routes). */
export const GALA_TRIPS_HAVE_COORDS = GALA_TRIPS.every((trip) =>
  trip.stops.some((stop) => stop.lat != null && stop.lon != null)
);
