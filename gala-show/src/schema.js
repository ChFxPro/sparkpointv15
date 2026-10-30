// Page types: what each one is called in the editor, which fields the team
// can change, and where the globe sits behind it. Layouts are fixed per type
// so every page stays on brand whatever gets typed in.
//
// Field kinds: text, area (multi-line), lines (one entry per line, parts split
// with "|"), media (a file in show/media), number, check.

export const TYPES = {
  loop: {
    label: 'Holding loop',
    help: 'Plays the Gala loop while people arrive or during a break. Build-in plays once first; build-out plays when you move on. The current loop files still show the old name, An Atlas of Wonders: swap in the World of Connections files once they are rendered.',
    fields: [
      { key: 'video', label: 'Loop video', kind: 'media' },
      { key: 'intro', label: 'Build-in video (plays once, optional)', kind: 'media' },
      { key: 'outro', label: 'Build-out video (plays when you move on, optional)', kind: 'media' },
      { key: 'caption', label: 'Caption along the bottom (optional)', kind: 'text' },
    ],
    globe: { opacity: 0 },
  },
  title: {
    label: 'Title',
    help: 'The A World of Connections lockup over the globe. Put *stars* around words in the tagline to set them in brass.',
    fields: [
      { key: 'kicker', label: 'Line above (optional)', kind: 'text' },
      { key: 'tagline', label: 'Tagline', kind: 'text' },
      { key: 'footer', label: 'Line along the bottom (optional)', kind: 'text' },
    ],
    globe: { x: 960, y: 520, r: 470, opacity: 0.42, lat: 18, spin: 3 },
  },
  divider: {
    label: 'Section divider',
    help: 'A section title beside the globe.',
    fields: [
      { key: 'number', label: 'Section number (optional)', kind: 'text' },
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'subtitle', label: 'Subtitle (optional)', kind: 'area' },
    ],
    globe: { x: 1400, y: 560, r: 430, opacity: 1, lat: 22, spin: 5 },
  },
  programme: {
    label: 'Programme',
    help: 'The evening at a glance. One item per line: time | what happens.',
    fields: [
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'items', label: 'Items (time | what happens)', kind: 'lines', parts: ['Time', 'What happens'] },
    ],
    globe: { x: 1560, y: 820, r: 520, opacity: 0.55, lat: 30, spin: 3 },
  },
  video: {
    label: 'Video',
    help: 'Plays full screen with sound as soon as the page opens. Press → again to move on.',
    fields: [
      { key: 'title', label: 'Title (shows if the file is missing, and in the overview)', kind: 'text' },
      { key: 'video', label: 'Video file', kind: 'media' },
      { key: 'autoAdvance', label: 'Move on by itself when the video ends', kind: 'check' },
    ],
    globe: { opacity: 0 },
  },
  numbers: {
    label: 'Year in numbers',
    help: 'Up to six figures. One per line: number | what it counts.',
    fields: [
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'stats', label: 'Figures (number | what it counts)', kind: 'lines', parts: ['Number', 'Label'] },
      { key: 'note', label: 'Footnote (optional)', kind: 'text' },
    ],
    globe: { x: 960, y: 1180, r: 620, opacity: 0.5, lat: 40, spin: 3 },
  },
  people: {
    label: 'People',
    help: 'Staff or board recognition. One person per line: name | role.',
    fields: [
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'subtitle', label: 'Line under the title (optional)', kind: 'text' },
      { key: 'people', label: 'People (name | role)', kind: 'lines', parts: ['Name', 'Role'] },
    ],
    globe: { x: 960, y: 1240, r: 640, opacity: 0.4, lat: 40, spin: 2 },
  },
  sponsors: {
    label: 'Sponsors',
    help: 'One sponsor per line: name | logo file in show/media (optional). Hidden until sponsors are confirmed.',
    fields: [
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'subtitle', label: 'Line under the title (optional)', kind: 'text' },
      { key: 'sponsors', label: 'Sponsors (name | logo file)', kind: 'lines', parts: ['Name', 'Logo file'] },
    ],
    globe: { x: 960, y: 1240, r: 640, opacity: 0.35, lat: 40, spin: 2 },
  },
  auction: {
    label: 'Auction opener',
    help: 'Introduces the live travel auction.',
    fields: [
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'body', label: 'Text', kind: 'area' },
      { key: 'footer', label: 'Line along the bottom (optional)', kind: 'text' },
    ],
    globe: { x: 960, y: 540, r: 470, opacity: 0.5, lat: 15, spin: 9 },
  },
  trip: {
    label: 'Trip',
    help: 'One auction lot, numbered as a connection (Connection 01). The globe turns to the destination and draws the route from Brevard. Press S during the show to stamp it SOLD.',
    fields: [
      { key: 'lot', label: 'Connection number (the lot number, e.g. 1)', kind: 'text' },
      { key: 'title', label: 'Trip name', kind: 'text' },
      { key: 'place', label: 'Destination (as it should read)', kind: 'text' },
      { key: 'lat', label: 'Latitude (e.g. 41.9 for Rome)', kind: 'number' },
      { key: 'lon', label: 'Longitude (west is negative, e.g. -70.7)', kind: 'number' },
      { key: 'blurb', label: 'Short description', kind: 'area' },
      { key: 'details', label: 'What’s included (one per line)', kind: 'lines' },
      { key: 'value', label: 'Value (optional)', kind: 'text' },
      { key: 'opening', label: 'Opening bid (optional)', kind: 'text' },
      { key: 'photo', label: 'Photo (optional)', kind: 'media' },
      { key: 'donor', label: 'Donated by (optional)', kind: 'text' },
      { key: 'sold', label: 'Sold', kind: 'check' },
      { key: 'soldFor', label: 'Sold for (optional, shows on the stamp)', kind: 'text' },
    ],
    globe: { x: 1390, y: 560, r: 420, opacity: 1 },
  },
  text: {
    label: 'Words',
    help: 'A heading and a few lines — intermission, a quote, an announcement.',
    fields: [
      { key: 'title', label: 'Heading', kind: 'text' },
      { key: 'body', label: 'Text (optional)', kind: 'area' },
      { key: 'attribution', label: 'Attribution (optional, for a quote)', kind: 'text' },
    ],
    globe: { x: 960, y: 1300, r: 700, opacity: 0.35, lat: 45, spin: 2 },
  },
  thanks: {
    label: 'Thank you',
    help: 'Closing page with a QR code for giving.',
    fields: [
      { key: 'title', label: 'Title', kind: 'text' },
      { key: 'body', label: 'Text', kind: 'area' },
      { key: 'qrUrl', label: 'QR code link', kind: 'text' },
      { key: 'qrLabel', label: 'Address shown under the QR code', kind: 'text' },
    ],
    globe: { x: 520, y: 560, r: 360, opacity: 0.9, lat: 25, spin: 4 },
  },
};

export function blankSlide(type) {
  const base = { id: newId(), type };
  for (const f of TYPES[type].fields) base[f.key] = f.kind === 'check' ? false : f.kind === 'lines' ? [] : '';
  if (type === 'loop') base.video = 'Atlas-of-Wonders-Loop-1440p30.mp4';
  if (type === 'sponsors') base.hidden = true;
  return base;
}

export function newId() {
  return Math.random().toString(36).slice(2, 9);
}

/** Display name for a page in lists. */
export function slideName(s) {
  const t = TYPES[s.type];
  if (s.type === 'trip') return [s.lot && `Connection ${/^\d$/.test(String(s.lot)) ? `0${s.lot}` : s.lot}`, s.title || s.place || 'Untitled trip'].filter(Boolean).join(' · ');
  if (s.type === 'loop') return s.caption ? `Loop · ${s.caption}` : 'Holding loop';
  if (s.type === 'title') return 'Title';
  return s.title || (t ? t.label : s.type);
}

/** Split a "lines" field entry into its parts. */
export function parts(line) {
  return String(line)
    .split('|')
    .map((p) => p.trim());
}
