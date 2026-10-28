// Edit mode (press E). The team changes words, files and the page order here;
// layouts stay fixed. Saving writes content.js back into the show folder
// (Chrome asks once for permission to the folder), keeping the previous
// version in backups/. Where Chrome can't write to the folder, Save downloads
// content.js instead, to drop into the folder by hand.
import { TYPES, blankSlide, newId, slideName } from './schema.js';
import { h } from './slides.js';

const DB = 'gala-show';

function idb(mode, fn) {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB, 1);
    open.onupgradeneeded = () => open.result.createObjectStore('kv');
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const tx = open.result.transaction('kv', mode);
      const req = fn(tx.objectStore('kv'));
      tx.oncomplete = () => resolve(req && req.result);
      tx.onerror = () => reject(tx.error);
    };
  });
}
const saveHandle = (handle) => idb('readwrite', (s) => s.put(handle, 'folder')).catch(() => {});
const loadHandle = () => idb('readonly', (s) => s.get('folder')).catch(() => null);

function stamp() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

export function serialize(show) {
  return (
    `// The show's content. Edit it in the deck (open index.html, press E), which saves this file.\n` +
    `// Hand edits are fine too: keep it valid JavaScript.\n` +
    `window.SHOW = ${JSON.stringify(show, null, 2)};\n`
  );
}

export function createEditor({ show, getIndex, go, rerender, relayout, flash }) {
  let open = false;
  let dirty = false;
  let folder = null;
  const canWrite = typeof window.showDirectoryPicker === 'function';

  const panel = h('aside', { class: 'editor', 'aria-label': 'Show editor' });
  document.body.append(panel);

  const status = h('p', { class: 'ed-status' });
  const list = h('ol', { class: 'ed-list' });
  const form = h('div', { class: 'ed-form' });
  const report = h('div', { class: 'ed-report' });
  const addSelect = h(
    'select',
    { class: 'ed-add', 'aria-label': 'Add a page' },
    h('option', { value: '' }, '+ Add a page after this one…'),
    Object.entries(TYPES).map(([k, t]) => h('option', { value: k }, t.label))
  );
  addSelect.addEventListener('change', () => {
    const type = addSelect.value;
    addSelect.value = '';
    if (!type) return;
    const i = getIndex() + 1;
    show.slides.splice(i, 0, blankSlide(type));
    changed();
    go(i, { instant: true });
  });

  const saveBtn = h('button', { class: 'ed-btn ed-primary', onclick: () => save() }, 'Save');
  const folderBtn = h('button', { class: 'ed-btn', onclick: () => connect() }, 'Choose show folder');
  panel.append(
    h(
      'header',
      { class: 'ed-head' },
      h('div', {}, h('h2', {}, 'Edit the show'), status),
      h('div', { class: 'ed-actions' }, saveBtn, h('button', { class: 'ed-btn', onclick: () => toggle(false), title: 'Close (E)' }, 'Close'))
    ),
    h('section', { class: 'ed-sec' }, h('h3', {}, 'Pages'), list, addSelect),
    form,
    h(
      'section',
      { class: 'ed-sec ed-tools' },
      h('h3', {}, 'Before the show'),
      h('div', { class: 'ed-row' }, h('button', { class: 'ed-btn', onclick: () => checkMedia() }, 'Check media files'), canWrite ? folderBtn : null),
      report
    )
  );

  function setStatus() {
    const where = folder ? `Saving to “${folder.name}”` : canWrite ? 'Save asks for the show folder the first time' : 'Save downloads content.js';
    status.textContent = dirty ? `Unsaved changes · ${where}` : where;
    status.classList.toggle('is-dirty', dirty);
    saveBtn.disabled = !dirty;
  }

  function changed() {
    dirty = true;
    setStatus();
    drawList();
  }

  window.addEventListener('beforeunload', (e) => {
    if (dirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // --- Folder -----------------------------------------------------------
  async function permitted(handle) {
    const opts = { mode: 'readwrite' };
    if ((await handle.queryPermission(opts)) === 'granted') return true;
    return (await handle.requestPermission(opts)) === 'granted';
  }

  async function connect() {
    try {
      const handle = await window.showDirectoryPicker({ id: 'gala-show', mode: 'readwrite' });
      // Make sure it's the show folder (the one with index.html and content.js).
      try {
        await handle.getFileHandle('index.html');
        await handle.getFileHandle('content.js');
      } catch {
        flash('That folder isn’t the show folder — pick the one with index.html in it');
        return null;
      }
      folder = handle;
      await saveHandle(handle);
      setStatus();
      return handle;
    } catch {
      return null;
    }
  }

  async function ensureFolder() {
    if (folder && (await permitted(folder))) return folder;
    const stored = await loadHandle();
    if (stored && (await permitted(stored).catch(() => false))) {
      folder = stored;
      setStatus();
      return folder;
    }
    return connect();
  }

  async function writeFile(dir, name, data) {
    const fh = await dir.getFileHandle(name, { create: true });
    const w = await fh.createWritable();
    await w.write(data);
    await w.close();
  }

  async function save() {
    const text = serialize(show);
    if (canWrite) {
      const dir = await ensureFolder();
      if (dir) {
        try {
          // Keep the version being replaced.
          const prev = await (await (await dir.getFileHandle('content.js')).getFile()).text();
          const backups = await dir.getDirectoryHandle('backups', { create: true });
          await writeFile(backups, `content-${stamp()}.js`, prev);
          await writeFile(dir, 'content.js', text);
          dirty = false;
          setStatus();
          flash('Saved');
          return;
        } catch (err) {
          flash(`Couldn’t save to the folder (${err.message}) — downloading instead`);
        }
      }
    }
    const a = h('a', { href: URL.createObjectURL(new Blob([text], { type: 'text/javascript' })), download: 'content.js' });
    a.click();
    dirty = false;
    setStatus();
    flash('Downloaded content.js — put it in the show folder, replacing the old one');
  }

  // Put a picked file into show/media (when the folder is connected).
  async function addMedia(file) {
    if (canWrite) {
      const dir = await ensureFolder();
      if (dir) {
        try {
          const mediaDir = await dir.getDirectoryHandle('media', { create: true });
          let exists = false;
          try {
            await mediaDir.getFileHandle(file.name);
            exists = true;
          } catch {}
          if (!exists) {
            flash(`Copying ${file.name} into media…`);
            await writeFile(mediaDir, file.name, file);
          }
          flash(exists ? `Using ${file.name} (already in media)` : `Copied ${file.name} into media`);
          return file.name;
        } catch (err) {
          flash(`Couldn’t copy the file (${err.message})`);
        }
      }
    }
    flash(`Put ${file.name} in the show’s media folder`);
    return file.name;
  }

  // --- Media check --------------------------------------------------------
  function probe(file, kind) {
    return new Promise((resolve) => {
      const src = `media/${encodeURI(file)}`;
      const el = kind === 'image' ? new Image() : document.createElement('video');
      const done = (ok) => {
        clearTimeout(t);
        resolve(ok);
        if (el.removeAttribute) el.removeAttribute('src');
      };
      const t = setTimeout(() => done(false), 8000);
      if (kind === 'image') {
        el.onload = () => done(true);
        el.onerror = () => done(false);
      } else {
        el.preload = 'metadata';
        el.onloadedmetadata = () => done(true);
        el.onerror = () => done(false);
      }
      el.src = src;
    });
  }

  async function checkMedia() {
    report.replaceChildren(h('p', {}, 'Checking…'));
    const rows = [];
    for (const [i, s] of show.slides.entries()) {
      for (const f of TYPES[s.type]?.fields || []) {
        if (f.kind === 'media' && s[f.key]) rows.push({ i, s, file: s[f.key], kind: f.key === 'photo' ? 'image' : 'video' });
      }
      if (s.type === 'sponsors') {
        for (const l of s.sponsors || []) {
          const logo = String(l).split('|')[1]?.trim();
          if (logo) rows.push({ i, s, file: logo, kind: 'image' });
        }
      }
    }
    const results = await Promise.all(rows.map(async (r) => ({ ...r, ok: await probe(r.file, r.kind) })));
    const bad = results.filter((r) => !r.ok);
    // The loop renders still carry the old name until the new title is rendered.
    const oldLoop = results.filter((r) => r.ok && /atlas-of-wonders/i.test(r.file));
    const trips = show.slides.filter((s) => s.type === 'trip' && !s.hidden);
    const noPlace = trips.filter((s) => !Number.isFinite(parseFloat(s.lat)) || !Number.isFinite(parseFloat(s.lon)));
    report.replaceChildren(
      h('p', { class: bad.length ? 'is-bad' : 'is-ok' }, bad.length ? `${bad.length} of ${results.length} files missing from media:` : `All ${results.length} media files found.`),
      bad.length > 0 &&
        h(
          'ul',
          {},
          bad.map((r) => h('li', {}, h('button', { class: 'ed-link', onclick: () => go(r.i, { instant: true }) }, `Page ${r.i + 1}`), ` ${r.file}`))
        ),
      oldLoop.length > 0 && h('p', { class: 'is-bad' }, `${oldLoop.length} loop file(s) still show the old name, An Atlas of Wonders. Swap in the World of Connections renders when they land.`),
      noPlace.length > 0 && h('p', { class: 'is-bad' }, `${noPlace.length} trip page(s) have no map location yet, so the globe won’t draw a route.`)
    );
  }

  // --- Page list ------------------------------------------------------------
  function move(i, d) {
    const j = i + d;
    if (j < 0 || j >= show.slides.length) return;
    [show.slides[i], show.slides[j]] = [show.slides[j], show.slides[i]];
    changed();
    go(j, { instant: true });
  }

  function drawList() {
    if (!open) return;
    const cur = getIndex();
    list.replaceChildren(
      ...show.slides.map((s, i) =>
        h(
          'li',
          { class: `ed-item ${i === cur ? 'is-current' : ''} ${s.hidden ? 'is-hidden' : ''}` },
          h(
            'button',
            { class: 'ed-pick', onclick: () => go(i, { instant: true }) },
            h('span', { class: 'ed-num' }, String(i + 1)),
            h('span', { class: 'ed-name' }, slideName(s)),
            h('span', { class: 'ed-type' }, (s.hidden ? 'Hidden · ' : '') + (s.type === 'trip' && s.sold ? 'Sold · ' : '') + (TYPES[s.type]?.label || s.type))
          ),
          i === cur &&
            h(
              'span',
              { class: 'ed-tools-row' },
              h('button', { class: 'ed-icon', title: 'Move up', onclick: () => move(i, -1) }, '↑'),
              h('button', { class: 'ed-icon', title: 'Move down', onclick: () => move(i, 1) }, '↓'),
              h(
                'button',
                {
                  class: 'ed-icon',
                  title: 'Duplicate',
                  onclick: () => {
                    show.slides.splice(i + 1, 0, { ...structuredClone(s), id: newId(), sold: false, soldFor: '' });
                    changed();
                    go(i + 1, { instant: true });
                  },
                },
                '⧉'
              ),
              h(
                'button',
                {
                  class: 'ed-icon',
                  title: s.hidden ? 'Show in the show' : 'Hide from the show (keeps it here)',
                  onclick: () => {
                    s.hidden = !s.hidden;
                    changed();
                  },
                },
                s.hidden ? 'Unhide' : 'Hide'
              ),
              h(
                'button',
                {
                  class: 'ed-icon ed-danger',
                  title: 'Delete',
                  onclick: () => {
                    if (!confirm(`Delete page ${i + 1}, “${slideName(s)}”? (Save keeps a backup of the old file.)`)) return;
                    show.slides.splice(i, 1);
                    changed();
                    go(Math.min(i, show.slides.length - 1), { instant: true });
                  },
                },
                'Delete'
              )
            )
        )
      )
    );
    list.querySelector('.is-current')?.scrollIntoView({ block: 'nearest' });
  }

  // --- Field form -----------------------------------------------------------
  let redraw = 0;
  function update(s, key, value) {
    s[key] = value;
    changed();
    clearTimeout(redraw);
    redraw = setTimeout(rerender, 250);
  }

  function field(s, f) {
    const id = `f-${s.id}-${f.key}`;
    const label = h('label', { for: id }, f.label);
    let input;
    if (f.kind === 'area' || f.kind === 'lines') {
      const value = f.kind === 'lines' ? (s[f.key] || []).join('\n') : s[f.key] || '';
      input = h('textarea', { id, rows: f.kind === 'lines' ? 6 : 4, spellcheck: true }, value);
      input.value = value;
      input.addEventListener('input', () =>
        update(
          s,
          f.key,
          f.kind === 'lines'
            ? input.value
                .split('\n')
                .map((l) => l.trimEnd())
                .filter((l, i, a) => l || i < a.length - 1)
            : input.value
        )
      );
    } else if (f.kind === 'check') {
      input = h('input', { id, type: 'checkbox' });
      input.checked = Boolean(s[f.key]);
      input.addEventListener('change', () => update(s, f.key, input.checked));
      return h('div', { class: 'ed-field ed-check' }, input, label);
    } else if (f.kind === 'media') {
      input = h('input', { id, type: 'text', placeholder: 'file name in media/' });
      input.value = s[f.key] || '';
      input.addEventListener('input', () => update(s, f.key, input.value.trim()));
      const picker = h('input', { type: 'file', accept: f.key === 'photo' ? 'image/*' : 'video/*', hidden: true });
      picker.addEventListener('change', async () => {
        const file = picker.files && picker.files[0];
        if (!file) return;
        const name = await addMedia(file);
        input.value = name;
        update(s, f.key, name);
      });
      return h(
        'div',
        { class: 'ed-field' },
        label,
        h('div', { class: 'ed-row' }, input, h('button', { class: 'ed-btn', onclick: () => picker.click() }, 'Choose…'), picker)
      );
    } else {
      input = h('input', { id, type: 'text', inputmode: f.kind === 'number' ? 'decimal' : null });
      input.value = s[f.key] ?? '';
      input.addEventListener('input', () => {
        const v = input.value.trim();
        update(s, f.key, f.kind === 'number' ? (v === '' || Number.isNaN(Number(v)) ? v : Number(v)) : input.value);
      });
    }
    return h('div', { class: 'ed-field' }, label, input);
  }

  let formFor = null;
  function drawForm() {
    if (!open) return;
    const s = show.slides[getIndex()];
    formFor = s || null;
    if (!s) {
      form.replaceChildren();
      return;
    }
    const t = TYPES[s.type];
    form.replaceChildren(
      h(
        'section',
        { class: 'ed-sec' },
        h('h3', {}, `Page ${getIndex() + 1} · ${t ? t.label : s.type}`),
        t && h('p', { class: 'ed-help' }, t.help),
        s.type === 'trip' &&
          h('p', { class: 'ed-help' }, 'To find a latitude and longitude: in Google Maps, right-click the place and click the numbers at the top of the menu to copy them (latitude first).'),
        (t ? t.fields : []).map((f) => field(s, f))
      )
    );
  }

  // --- Open / close -----------------------------------------------------------
  function toggle(force) {
    open = force ?? !open;
    document.body.classList.toggle('editing', open);
    relayout();
    if (open) {
      setStatus();
      drawList();
      drawForm();
      loadHandle().then((hd) => {
        if (hd && !folder) {
          folder = hd;
          setStatus();
        }
      });
    }
    formFor = null;
    rerender();
  }

  return {
    isOpen: () => open,
    toggle,
    changed,
    selected() {
      drawList();
      // Rebuilding the form while someone types would drop their cursor.
      if (show.slides[getIndex()] !== formFor) drawForm();
    },
    // While typing in the editor, show keys stay out of the way.
    ownsKey(e) {
      if (!open) return false;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        save();
        return true;
      }
      const el = document.activeElement;
      if (el && panel.contains(el) && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName)) {
        if (e.key === 'Escape') el.blur();
        // Buttons only keep Space/Enter; arrows still turn pages.
        if (el.tagName === 'BUTTON' && !(e.key === ' ' || e.key === 'Enter')) return false;
        return true;
      }
      return false;
    },
  };
}
