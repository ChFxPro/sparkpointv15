// Renders one page's background with no words on it: the night sky and the
// globe in the pose that page type uses (or a route, for a trip). The kit
// script (kit/make-kit.mjs) screenshots these for the Keynote / PowerPoint /
// Canva template.
//
//   plate.html?type=divider              the divider background
//   plate.html?type=trip&lat=41.9&lon=12.5   a trip with its route from Brevard
//   plate.html?type=cover&clear=1        the globe alone on a transparent ground
//   plate.html?type=cover&clear=1&view=20   …turned to face longitude 20 (Europe/Africa)
import './deck.css';
import { createGlobe } from './globe.js';
import { TYPES } from './schema.js';

const q = new URLSearchParams(location.search);
const type = q.get('type') || 'divider';
const clear = q.get('clear') === '1';

const POSES = {
  // The kit's own names for the poses it renders.
  cover: TYPES.title.globe,
  divider: TYPES.divider.globe,
  programme: TYPES.programme.globe,
  content: TYPES.people.globe,
  numbers: TYPES.numbers.globe,
  auction: TYPES.auction.globe,
  trip: { ...TYPES.trip.globe, lat: 20, lon: -40 },
  thanks: TYPES.thanks.globe,
  plain: { opacity: 0 },
};

document.documentElement.style.background = clear ? 'transparent' : '#000';
document.body.style.background = clear ? 'transparent' : '#000';
const stage = document.createElement('div');
stage.className = 'stage';
if (clear) stage.style.background = 'transparent';
const canvas = document.createElement('canvas');
canvas.className = 'globe';
stage.append(canvas);
document.body.append(stage);

const scale = window.innerWidth / 1920;
stage.style.transform = `scale(${scale})`;

// reducedMotion: lands every tween and route at its end at once.
const globe = createGlobe(canvas, { reducedMotion: true, clear });
globe.resize(Math.round(1920 * scale), Math.round(1080 * scale));

const lat = parseFloat(q.get('lat'));
const lon = parseFloat(q.get('lon'));
const route = Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
const pose = { lat: 20, lon: -60, ...(POSES[type] || POSES.divider), spin: 0 };
// A cut-out is the globe alone, centred and at full strength.
if (clear) Object.assign(pose, { x: 960, y: 540, r: 440, opacity: 1 });
// view=<longitude> turns that longitude to face the room.
if (q.get('view') !== null) pose.lon = Number(q.get('view'));
globe.setPose(pose, { instant: true, route });

requestAnimationFrame(() => requestAnimationFrame(() => (window.__plateReady = true)));
