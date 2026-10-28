// Page renderers. Each builds its page into a fixed 1920×1080 frame from the
// page's fields, and returns hooks the show calls as the page comes and goes.
import QRCode from 'qrcode';
import sparkmark from '../../public/assets/brand/sparkmark-256.webp';
import { TYPES, parts } from './schema.js';

export const SPARKMARK = sparkmark;

const media = (file) => (file ? `media/${encodeURI(String(file).trim())}` : '');

function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'style') el.style.cssText = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false || kid === '') continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

/** Paragraphs from a multi-line field. */
function paras(text, cls) {
  return String(text || '')
    .split(/\n\s*\n|\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => h('p', { class: cls }, p));
}

const lines = (v) => (Array.isArray(v) ? v : String(v || '').split('\n')).map((l) => String(l).trim()).filter(Boolean);

/** Shrink an element's font until its content fits its box. */
export function fit(el, min = 24) {
  if (!el || !el.isConnected) return;
  el.style.fontSize = '';
  let size = parseFloat(getComputedStyle(el).fontSize);
  let guard = 60;
  // Display type overhangs its line box a little (descenders, italics), so
  // allow a quarter of the font size before calling it an overflow.
  const over = () => el.scrollHeight > el.clientHeight + size * 0.25 || el.scrollWidth > el.clientWidth + 1;
  while (guard-- > 0 && size > min && over()) {
    size *= 0.94;
    el.style.fontSize = `${size}px`;
  }
}

function rule() {
  return h('div', { class: 'rule' }, h('i'), h('b'), h('img', { src: sparkmark, alt: '' }), h('b'), h('i'));
}

const SVG = 'http://www.w3.org/2000/svg';
function svg(tag, attrs = {}) {
  const el = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

// The lockup's art: a faint globe, a 25-ray sunburst fanning up from below
// the name, and three dashed flight routes meeting at a ringed home node.
// Same geometry as Branding/Gala/WorldOfConnections/lockup.html.
function lockupArt() {
  const art = svg('svg', { class: 'lk-art', viewBox: '0 0 200 200', 'aria-hidden': 'true' });
  const rays = svg('g', { class: 'rays' });
  for (let i = 0; i <= 24; i++) {
    const a = Math.PI * (i / 24);
    const r2 = i % 2 ? 98 : 112;
    rays.append(svg('line', { x1: 100 - Math.cos(a) * 20, y1: 132 - Math.sin(a) * 20, x2: 100 - Math.cos(a) * r2, y2: 132 - Math.sin(a) * r2 }));
  }
  const globe = svg('g', { class: 'globe' });
  globe.append(
    svg('circle', { cx: 100, cy: 100, r: 78 }),
    svg('ellipse', { cx: 100, cy: 100, rx: 52, ry: 78 }),
    svg('ellipse', { cx: 100, cy: 100, rx: 24, ry: 78 }),
    svg('ellipse', { cx: 100, cy: 100, rx: 78, ry: 32 }),
    svg('path', { d: 'M100 22v156M22 100h156' })
  );
  art.append(
    rays,
    globe,
    svg('path', { class: 'route', d: 'M38 62 Q 62 32 100 30' }),
    svg('path', { class: 'route', d: 'M100 30 Q 138 32 162 62' }),
    svg('path', { class: 'route', d: 'M100 30 Q 124 16 142 40' }),
    svg('circle', { class: 'node', cx: 38, cy: 62, r: 1.8 }),
    svg('circle', { class: 'node', cx: 162, cy: 62, r: 1.8 }),
    svg('circle', { class: 'node', cx: 142, cy: 40, r: 1.8 }),
    svg('circle', { class: 'home', cx: 100, cy: 30, r: 3.6 }),
    svg('circle', { class: 'node', cx: 100, cy: 30, r: 1.6 })
  );
  return art;
}

export function lockup(cls = '') {
  return h(
    'div',
    { class: `lockup ${cls}`, role: 'img', 'aria-label': 'A World of Connections, the SparkPoint Gala' },
    lockupArt(),
    h('span', { class: 'lk-a', 'aria-hidden': 'true' }, 'A'),
    h('span', { class: 'lk-world', 'aria-hidden': 'true' }, 'World'),
    h('span', { class: 'lk-conn', 'aria-hidden': 'true' }, 'of Connections'),
    rule(),
    h('span', { class: 'lk-by', 'aria-hidden': 'true' }, 'The SparkPoint Gala'),
    h('span', { class: 'lk-by2', 'aria-hidden': 'true' }, 'Live travel auction')
  );
}

/**
 * Line up the live globe with the lockup's drawn one (which it then hides),
 * with Brevard's pin on the drawn home node where the dashed routes meet.
 * Measured from layout offsets (stage pixels), so entrance motion and the
 * stage's scaling don't skew it. Returns a globe pose.
 */
const HOME_UP = 70 / 78; // the home node sits this far up the drawn globe's radius
export function globeBehind(lk, opacity) {
  let x = lk.offsetLeft;
  let y = lk.offsetTop;
  for (let el = lk.offsetParent; el && !el.classList.contains('page'); el = el.offsetParent) {
    x += el.offsetLeft;
    y += el.offsetTop;
  }
  const artH = 1.5 * lk.offsetHeight; // .lk-art is 150% of the lockup, centred 44% down
  lk.classList.add('on-globe');
  return {
    x: x + lk.offsetWidth / 2,
    y: y + 0.44 * lk.offsetHeight,
    r: (78 / 200) * artH,
    opacity,
    lat: 35.23 - (Math.asin(HOME_UP) * 180) / Math.PI,
    lon: -82.73,
    spin: 0,
  };
}

/** Text with *stars* around a phrase sets that phrase in brass, as the tagline does. */
function emphasis(text) {
  return String(text)
    .split(/\*([^*]+)\*/)
    .map((part, i) => (i % 2 ? h('em', {}, part) : part));
}

/** "Connection 01": trips are numbered as connections. */
export function connectionLabel(lot) {
  const n = String(lot ?? '').trim();
  if (!n) return 'Connection';
  return `Connection ${/^\d$/.test(n) ? `0${n}` : n}`;
}

function missing(label, file) {
  return h('div', { class: 'missing' }, h('p', {}, label), h('code', {}, `media/${file || '(no file chosen)'}`));
}

// --- Video helper ----------------------------------------------------------
function video(file, { loop = false, muted = false } = {}) {
  const v = h('video', { src: media(file), preload: 'auto', playsinline: true });
  v.loop = loop;
  v.muted = muted;
  return v;
}

// --- Renderers --------------------------------------------------------------
const R = {};

R.loop = (s, ctx) => {
  const root = h('section', { class: 'page page-loop' });
  const loopV = video(s.video, { loop: true, muted: true });
  const introV = s.intro ? video(s.intro, { muted: true }) : null;
  const outroV = s.outro ? video(s.outro, { muted: true }) : null;
  // Fallback when the loop file isn't in the folder: the live globe and lockup.
  const loopLk = lockup('lockup-loop');
  const fallback = h('div', { class: 'loop-fallback' }, loopLk);
  const stack = h('div', { class: 'loop-stack' }, loopV, introV, outroV);
  root.append(fallback, stack);
  if (s.caption) root.append(h('p', { class: 'loop-caption' }, s.caption));

  let state = 'idle';
  let failed = false;
  loopV.addEventListener('error', () => {
    failed = true;
    root.classList.add('is-fallback');
    // Once it's showing, put the live globe behind the fallback lockup.
    requestAnimationFrame(() => ctx.setGlobe(globeBehind(loopLk, 0.55)));
  });
  const show = (v) => [loopV, introV, outroV].forEach((x) => x && (x.style.opacity = x === v ? 1 : 0));

  function playLoop() {
    state = 'loop';
    show(loopV);
    loopV.currentTime = 0;
    loopV.play().catch(() => {});
  }

  return {
    root,
    enter({ fromBack } = {}) {
      if (failed) return;
      if (introV && !fromBack) {
        state = 'intro';
        show(introV);
        introV.currentTime = 0;
        introV.onended = playLoop;
        introV.onerror = playLoop;
        introV.play().catch(playLoop);
      } else playLoop();
    },
    leave() {
      [loopV, introV, outroV].forEach((v) => v && v.pause());
      state = 'idle';
    },
    // While looping, the first → plays the build-out; the next → (or its end) moves on.
    next(advance) {
      if (outroV && !failed && state !== 'outro') {
        state = 'outro';
        loopV.pause();
        show(outroV);
        outroV.currentTime = 0;
        outroV.onended = advance;
        outroV.onerror = advance;
        outroV.play().catch(advance);
        return true;
      }
      return false;
    },
  };
};

R.title = (s, ctx) => {
  const lk = lockup('lockup-title');
  const root = h(
    'section',
    { class: 'page page-cover' },
    s.kicker && h('p', { class: 'title-kicker' }, s.kicker),
    lk,
    s.tagline && h('p', { class: 'title-tagline' }, emphasis(s.tagline)),
    s.footer && h('p', { class: 'page-footer' }, s.footer)
  );
  return { root, enter: () => ctx.setGlobe(globeBehind(lk, 0.55)) };
};

R.divider = (s) => {
  const t = h('h2', { class: 'divider-title' }, s.title);
  const root = h(
    'section',
    { class: 'page page-divider' },
    h(
      'div',
      { class: 'divider-copy' },
      s.number && h('p', { class: 'divider-number' }, s.number),
      t,
      rule(),
      s.subtitle && h('div', { class: 'divider-sub' }, paras(s.subtitle))
    )
  );
  return { root, enter: () => fit(t, 60) };
};

R.programme = (s) => {
  const list = h(
    'ol',
    { class: 'prog-list' },
    lines(s.items).map((l) => {
      const [time, what] = parts(l);
      return h('li', {}, h('span', { class: 'prog-time' }, what === undefined ? '' : time), h('span', { class: 'prog-what' }, what === undefined ? time : what));
    })
  );
  const root = h('section', { class: 'page page-programme' }, h('h2', { class: 'page-title' }, s.title), rule(), list);
  return { root, enter: () => fit(list, 22) };
};

R.video = (s, ctx) => {
  const v = video(s.video);
  const card = h('div', { class: 'video-card' }, h('h2', { class: 'page-title' }, s.title || 'Video'), rule(), ctx.editing ? missing('This video isn’t in the media folder yet', s.video) : null);
  const root = h('section', { class: 'page page-video' }, card, v);
  let ok = true;
  v.addEventListener('error', () => {
    ok = false;
    root.classList.add('is-missing');
  });
  v.addEventListener('ended', () => {
    if (s.autoAdvance) ctx.advance();
  });
  return {
    root,
    enter() {
      if (!ok) return;
      v.currentTime = 0;
      v.play().catch(() => {});
    },
    leave() {
      v.pause();
    },
  };
};

R.numbers = (s) => {
  const stats = lines(s.stats).slice(0, 6);
  const grid = h(
    'div',
    { class: `stats stats-${stats.length}` },
    stats.map((l) => {
      const [num, label] = parts(l);
      return h('div', { class: 'stat' }, h('p', { class: 'stat-num', 'data-count': num }, num), h('p', { class: 'stat-label' }, label || ''));
    })
  );
  const root = h('section', { class: 'page page-numbers' }, h('h2', { class: 'page-title' }, s.title), rule(), grid, s.note && h('p', { class: 'page-footer' }, s.note));
  return {
    root,
    enter({ reducedMotion } = {}) {
      if (reducedMotion) return;
      // Count up any figure that is a plain number (keeps "$", "+", "%" and commas).
      grid.querySelectorAll('.stat-num').forEach((el, i) => {
        const raw = el.dataset.count;
        const m = raw.match(/^(\D*)([\d,]+(?:\.\d+)?)(\D*)$/);
        if (!m) return;
        const target = Number(m[2].replace(/,/g, ''));
        const decimals = (m[2].split('.')[1] || '').length;
        const start = performance.now() + i * 140;
        const step = (now) => {
          const p = Math.max(0, Math.min(1, (now - start) / 1600));
          const e = 1 - Math.pow(1 - p, 3);
          el.textContent = m[1] + (target * e).toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + m[3];
          if (p < 1 && el.isConnected) requestAnimationFrame(step);
          else el.textContent = raw;
        };
        requestAnimationFrame(step);
      });
    },
  };
};

R.people = (s) => {
  const people = lines(s.people);
  const cols = people.length > 12 ? 4 : people.length > 6 ? 3 : people.length > 3 ? 2 : 1;
  const grid = h(
    'ul',
    { class: 'people', style: `--cols:${cols}` },
    people.map((l) => {
      const [name, role] = parts(l);
      return h('li', {}, h('p', { class: 'person-name' }, name), role && h('p', { class: 'person-role' }, role));
    })
  );
  const root = h(
    'section',
    { class: 'page page-people' },
    h('h2', { class: 'page-title' }, s.title),
    s.subtitle && h('p', { class: 'page-sub' }, s.subtitle),
    rule(),
    grid
  );
  return { root, enter: () => fit(grid, 18) };
};

R.sponsors = (s) => {
  const list = lines(s.sponsors);
  const grid = h(
    'ul',
    { class: `sponsors ${list.length > 8 ? 'sponsors-many' : ''}` },
    list.map((l) => {
      const [name, logo] = parts(l);
      const label = h('p', { class: 'sponsor-name' }, name);
      if (!logo) return h('li', {}, label);
      const img = h('img', { src: media(logo), alt: name });
      img.addEventListener('error', () => img.replaceWith(label));
      return h('li', { class: 'has-logo' }, h('div', { class: 'sponsor-plate' }, img));
    })
  );
  const root = h(
    'section',
    { class: 'page page-sponsors' },
    h('h2', { class: 'page-title' }, s.title),
    s.subtitle && h('p', { class: 'page-sub' }, s.subtitle),
    rule(),
    grid
  );
  return { root, enter: () => fit(grid, 18) };
};

R.auction = (s) => {
  const root = h(
    'section',
    { class: 'page page-auction' },
    h('h2', { class: 'auction-title' }, s.title),
    rule(),
    h('div', { class: 'auction-body' }, paras(s.body)),
    s.footer && h('p', { class: 'page-footer' }, s.footer)
  );
  return { root, enter: () => fit(root.querySelector('.auction-title'), 60) };
};

R.trip = (s, ctx) => {
  const details = lines(s.details);
  const meta = [s.value && ['Value', s.value], s.opening && ['Opening bid', s.opening]].filter(Boolean);
  const photo = s.photo ? h('img', { class: 'trip-photo', src: media(s.photo), alt: '' }) : null;
  if (photo) photo.addEventListener('error', () => photo.remove());
  const stamp = h('div', { class: 'stamp', 'aria-hidden': 'true' }, h('span', { class: 'stamp-word' }, 'Sold'), h('span', { class: 'stamp-amt' }, s.soldFor || ''));
  const title = h('h2', { class: 'trip-title' }, s.title || 'Trip to be announced');
  const copy = h(
    'div',
    { class: 'trip-copy' },
    h('p', { class: 'trip-lot' }, connectionLabel(s.lot), s.place && h('span', { class: 'trip-place' }, s.place)),
    title,
    rule(),
    s.blurb && h('div', { class: 'trip-blurb' }, paras(s.blurb)),
    details.length > 0 && h('ul', { class: 'trip-details' }, details.map((d) => h('li', {}, d))),
    meta.length > 0 && h('dl', { class: 'trip-meta' }, meta.map(([k, v]) => h('div', {}, h('dt', {}, k), h('dd', {}, v)))),
    s.donor && h('p', { class: 'trip-donor' }, `Donated by ${s.donor}`)
  );
  const root = h('section', { class: `page page-trip ${photo ? 'has-photo' : ''} ${s.sold ? 'is-sold' : ''}` }, photo, copy, stamp);
  const hasPlace = s.lat !== '' && s.lon !== '' && Number.isFinite(Number(s.lat)) && Number.isFinite(Number(s.lon));
  return {
    root,
    route: hasPlace ? { lat: Number(s.lat), lon: Number(s.lon) } : null,
    enter() {
      fit(title, 56);
      fit(copy, 16);
    },
    toggleSold() {
      s.sold = !s.sold;
      root.classList.toggle('is-sold', s.sold);
      ctx.changed();
    },
  };
};

R.text = (s) => {
  const root = h(
    'section',
    { class: `page page-text ${s.attribution ? 'is-quote' : ''}` },
    h('h2', { class: 'text-title' }, s.title),
    rule(),
    s.body && h('div', { class: 'text-body' }, paras(s.body)),
    s.attribution && h('p', { class: 'text-attr' }, s.attribution)
  );
  return { root, enter: () => fit(root.querySelector('.text-title'), 50) };
};

// Let a web address wrap after its slashes and dots, never mid-word.
function breakable(text) {
  return String(text)
    .split(/(?<=[/.])/)
    .flatMap((part, i) => (i ? [h('wbr'), part] : [part]));
}

R.thanks = (s) => {
  const qr = h('div', { class: 'qr' });
  if (s.qrUrl) {
    QRCode.toString(s.qrUrl, { type: 'svg', margin: 0, errorCorrectionLevel: 'M', color: { dark: '#0b1322', light: '#00000000' } })
      .then((svg) => (qr.innerHTML = svg))
      .catch(() => {});
  }
  const root = h(
    'section',
    { class: 'page page-thanks' },
    h(
      'div',
      { class: 'thanks-copy' },
      h('h2', { class: 'thanks-title' }, s.title),
      rule(),
      h('div', { class: 'thanks-body' }, paras(s.body)),
      s.qrUrl && h('div', { class: 'qr-card' }, qr, h('p', { class: 'qr-label' }, breakable(s.qrLabel || s.qrUrl)))
    )
  );
  return { root };
};

export function render(slide, ctx) {
  const make = R[slide.type];
  const page = make ? make(slide, ctx) : { root: h('section', { class: 'page' }, `Unknown page type: ${slide.type}`) };
  const pose = { ...(TYPES[slide.type]?.globe || { opacity: 0 }) };
  return { enter() {}, leave() {}, next: () => false, route: null, ...page, pose };
}

export { h };
