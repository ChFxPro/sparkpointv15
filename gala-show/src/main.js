// The show runner: loads the content from show/content.js, draws the current
// page over the live globe, and handles the keys a presenter needs.
import './deck.css';
import { injectFonts } from './fonts.js';
import { createGlobe } from './globe.js';
import { render, h, SPARKMARK } from './slides.js';
import { TYPES, slideName } from './schema.js';
import { createEditor } from './editor.js';

injectFonts();
const favicon = h('link', { rel: 'icon', href: SPARKMARK });
document.head.append(favicon);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const show = (window.SHOW = window.SHOW || { slides: [] });
show.slides = show.slides || [];

// --- Frame ---------------------------------------------------------------
const viewport = h('div', { class: 'viewport' });
const stage = h('div', { class: 'stage' });
const canvas = h('canvas', { class: 'globe' });
const pages = h('div', { class: 'pages' });
const blackout = h('div', { class: 'blackout' });
const hint = h('div', { class: 'hint' });
const frame = h('div', { class: 'frame' });
stage.append(canvas, pages, frame);
viewport.append(stage, blackout, hint);
document.body.append(viewport);

const globe = createGlobe(canvas, { reducedMotion });

function layout() {
  const editW = document.body.classList.contains('editing') ? editorWidth() : 0;
  const availW = window.innerWidth - editW;
  const availH = window.innerHeight;
  const scale = Math.min(availW / 1920, availH / 1080);
  stage.style.transform = `translate(${(availW - 1920 * scale) / 2}px, ${(availH - 1080 * scale) / 2}px) scale(${scale})`;
  // The canvas renders at real screen pixels, then CSS undoes the stage scale.
  canvas.style.width = '1920px';
  canvas.style.height = '1080px';
  globe.resize(Math.round(1920 * scale), Math.round(1080 * scale));
}
window.addEventListener('resize', layout);
new ResizeObserver(() => layout()).observe(document.documentElement);

// --- Navigation ------------------------------------------------------------
let index = 0;
let current = null; // { slide, page }
let returnTo = null; // where L goes back to
const visible = () => show.slides.map((s, i) => [s, i]).filter(([s]) => !s.hidden || editor.isOpen());

function go(i, { fromBack = false, instant = false } = {}) {
  if (!show.slides.length) {
    pages.replaceChildren(h('section', { class: 'page page-empty' }, h('p', {}, 'No pages yet. Press E to open the editor.')));
    globe.setPose({ x: 960, y: 540, r: 380, opacity: 0.6 });
    return;
  }
  i = Math.max(0, Math.min(show.slides.length - 1, i));
  const old = current;
  index = i;
  const slide = show.slides[i];
  const ctx = {
    editing: editor.isOpen(),
    advance: () => current && current.slide === slide && next(),
    changed: () => editor.changed(),
    setGlobe: (pose) => current && current.slide === slide && globe.setPose(pose),
  };
  const page = render(slide, ctx);
  current = { slide, page };

  if (old) {
    old.page.leave();
    const leaving = old.page.root;
    leaving.classList.add('is-leaving');
    leaving.classList.remove('is-in');
    setTimeout(() => leaving.remove(), instant || reducedMotion ? 0 : 700);
  }
  pages.append(page.root);
  // Next frame, so the entrance transition runs.
  requestAnimationFrame(() => {
    page.root.classList.add('is-in');
    page.enter({ fromBack, reducedMotion });
  });
  globe.setPose(page.pose, { instant, route: page.route });
  stage.classList.toggle('bare', slide.type === 'loop' || slide.type === 'video');
  editor.selected(i);
  try {
    sessionStorage.setItem('gala-show-index', String(i));
  } catch {}
}

function step(dir) {
  const list = visible().map(([, i]) => i);
  if (!list.length) return;
  const pos = list.indexOf(index);
  const target = pos === -1 ? list.find((i) => (dir > 0 ? i > index : i < index)) : list[pos + dir];
  if (target !== undefined) go(target, { fromBack: dir < 0 });
}

function next() {
  if (current && current.page.next(() => step(1))) return;
  step(1);
}

function toggleLoop() {
  const loops = show.slides.map((s, i) => [s, i]).filter(([s]) => s.type === 'loop' && !s.hidden);
  if (!loops.length) return;
  if (current && current.slide.type === 'loop' && returnTo !== null) {
    const back = returnTo;
    returnTo = null;
    go(back);
  } else {
    returnTo = index;
    // The nearest loop before here (the intermission loop, say), else the first.
    const before = loops.filter(([, i]) => i <= index).pop();
    go((before || loops[0])[1]);
  }
}

function setBlack(on) {
  blackout.classList.toggle('on', on ?? !blackout.classList.contains('on'));
}

function flash(text) {
  hint.textContent = text;
  hint.classList.add('on');
  clearTimeout(flash.t);
  flash.t = setTimeout(() => hint.classList.remove('on'), 1600);
}

// --- Overview ----------------------------------------------------------------
const overview = h('div', { class: 'overview' });
document.body.append(overview);

function openOverview() {
  overview.replaceChildren(
    h('div', { class: 'ov-head' }, h('p', {}, 'All pages'), h('p', { class: 'ov-keys' }, 'Click a page to go to it · Esc to close')),
    h(
      'ol',
      { class: 'ov-grid' },
      show.slides.map((s, i) =>
        h(
          'li',
          {
            class: `ov-card ov-${s.type} ${i === index ? 'is-current' : ''} ${s.hidden ? 'is-hidden' : ''}`,
            onclick: () => {
              closeOverview();
              go(i);
            },
          },
          h('span', { class: 'ov-num' }, String(i + 1)),
          h('span', { class: 'ov-type' }, TYPES[s.type]?.label || s.type),
          h('span', { class: 'ov-name' }, slideName(s)),
          s.hidden && h('span', { class: 'ov-flag' }, 'Hidden'),
          s.type === 'trip' && s.sold && h('span', { class: 'ov-flag ov-sold' }, 'Sold')
        )
      )
    )
  );
  overview.classList.add('on');
  overview.querySelector('.is-current')?.scrollIntoView({ block: 'center' });
}
function closeOverview() {
  overview.classList.remove('on');
}

// --- Keys --------------------------------------------------------------------
let typed = '';
window.addEventListener('keydown', (e) => {
  if (editor.ownsKey(e)) return;
  const k = e.key;
  if (overview.classList.contains('on')) {
    if (k === 'Escape' || k === 'o' || k === 'O' || k === 'g' || k === 'G') closeOverview();
    return;
  }
  // Any key brings the screen back from black (except the black key itself).
  if (blackout.classList.contains('on') && !['b', 'B', '.', 'w', 'W', ','].includes(k)) {
    setBlack(false);
    return;
  }
  if (/^\d$/.test(k)) {
    typed += k;
    flash(`Go to page ${typed} — press Enter`);
    return;
  }
  if (k === 'Enter' && typed) {
    go(Number(typed) - 1);
    typed = '';
    return;
  }
  typed = '';
  switch (k) {
    case 'ArrowRight':
    case 'ArrowDown':
    case 'PageDown':
    case ' ':
    case 'Enter':
      e.preventDefault();
      next();
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
    case 'PageUp':
    case 'Backspace':
      e.preventDefault();
      step(-1);
      break;
    case 'Home':
      go(visible()[0]?.[1] ?? 0);
      break;
    case 'End':
      go(visible().at(-1)?.[1] ?? 0);
      break;
    case 'b':
    case 'B':
    case '.':
    case 'w':
    case 'W':
    case ',':
      setBlack();
      break;
    case 'l':
    case 'L':
      toggleLoop();
      break;
    case 'o':
    case 'O':
    case 'g':
    case 'G':
      openOverview();
      break;
    case 's':
    case 'S':
      if (current && current.page.toggleSold) {
        current.page.toggleSold();
        flash(current.slide.sold ? 'Marked sold' : 'Sold mark removed');
      }
      break;
    case 'f':
    case 'F':
    case 'F5':
      e.preventDefault();
      if (document.fullscreenElement) document.exitFullscreen();
      else document.documentElement.requestFullscreen().catch(() => {});
      break;
    case 'e':
    case 'E':
      editor.toggle();
      break;
    case '?':
    case 'h':
    case 'H':
      help.classList.toggle('on');
      break;
    case 'Escape':
      help.classList.remove('on');
      break;
  }
});

// Clicking the screen during the show moves on (handy with a mouse as a clicker).
pages.addEventListener('click', () => {
  if (!editor.isOpen()) next();
});

const help = h(
  'div',
  { class: 'help' },
  h('h2', {}, 'Show keys'),
  h(
    'dl',
    {},
    [
      ['→  Space  Page Down', 'Next (clickers send these)'],
      ['←  Page Up', 'Back'],
      ['B  or  .', 'Black screen (any key brings it back)'],
      ['L', 'Jump to the holding loop, and back again'],
      ['S', 'Stamp a trip SOLD (again to remove)'],
      ['O', 'All pages'],
      ['12 then Enter', 'Go to page 12'],
      ['F', 'Full screen'],
      ['E', 'Edit the show'],
      ['H', 'This list'],
    ].map(([k, v]) => h('div', {}, h('dt', {}, k), h('dd', {}, v)))
  )
);
document.body.append(help);

// --- Editor --------------------------------------------------------------------
const editor = createEditor({
  show,
  getIndex: () => index,
  go: (i, opts) => go(i, opts),
  rerender: () => go(index, { instant: true }),
  relayout: () => layout(),
  flash,
});
function editorWidth() {
  return Math.min(520, Math.max(380, window.innerWidth * 0.32));
}

// --- Start -------------------------------------------------------------------
layout();
let start = 0;
try {
  start = Number(sessionStorage.getItem('gala-show-index') || 0);
} catch {}
go(start, { instant: true });
if (!sessionStorage.getItem('gala-show-hinted')) {
  flash('Press H for the show keys');
  try {
    sessionStorage.setItem('gala-show-hinted', '1');
  } catch {}
}
