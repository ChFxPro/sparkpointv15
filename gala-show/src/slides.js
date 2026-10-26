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
  return h('div', { class: 'rule' }, h('span'), h('img', { src: sparkmark, alt: '' }), h('span'));
}

export function lockup(cls = '') {
  return h(
    'div',
    { class: `lockup ${cls}` },
    h('p', { class: 'lk-name' }, h('span', { class: 'lk-an' }, 'An'), h('span', { class: 'lk-atlas' }, 'Atlas'), h('em', { class: 'lk-wonders' }, 'of Wonders')),
    rule(),
    h('p', { class: 'lk-byline' }, 'The SparkPoint Gala')
  );
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
  const fallback = h('div', { class: 'loop-fallback' }, lockup('lockup-loop'));
  const stack = h('div', { class: 'loop-stack' }, loopV, introV, outroV);
  root.append(fallback, stack);
  if (s.caption) root.append(h('p', { class: 'loop-caption' }, s.caption));

  let state = 'idle';
  let failed = false;
  loopV.addEventListener('error', () => {
    failed = true;
    root.classList.add('is-fallback');
    ctx.setGlobe({ x: 960, y: 540, r: 430, opacity: 0.45, lat: 18, spin: 6 });
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

R.title = (s) => {
  const root = h(
    'section',
    { class: 'page page-cover' },
    s.kicker && h('p', { class: 'title-kicker' }, s.kicker),
    lockup('lockup-title'),
    s.tagline && h('p', { class: 'title-tagline' }, s.tagline),
    s.footer && h('p', { class: 'page-footer' }, s.footer)
  );
  return { root };
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
    h('p', { class: 'trip-lot' }, s.lot ? `Lot ${s.lot}` : 'Lot', s.place && h('span', { class: 'trip-place' }, s.place)),
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
