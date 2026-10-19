// /internal/backporch: where staff write BackPorch posts.
// Behind the internal sign-in, and writes are further limited by the database to
// emails listed in `porch_editors` (see supabase/migrations/20261015_backporch.sql).
import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { SEOHead } from '../../components/SEOHead';
import { RequireInternalAuth } from '../../components/RequireInternalAuth';
import { useInternalAuth } from '../../hooks/useInternalAuth';
import { supabase } from '../../lib/supabaseClient';
import { PorchLead, PorchRow } from '../../components/backporch/PorchParts';
import { BlazeMark, KIND_BLAZE } from '../../components/backporch/fieldKit';
import {
  isListed,
  KIND_LABELS,
  LIMITS,
  MAX_PINS,
  porchImageUrl,
  postPath,
  shortAddress,
  shortDate,
  normalizePresentation,
  sortPosts,
  type Mood,
  type PorchKind,
  type PorchPost,
  type Presentation,
  withBlocks,
} from '../../lib/backporch';
import { LAB_FEATURES, STAGE_LABELS } from '../../lib/porchLab';
import { PostView } from '../../components/backporch/PostView';
import bakedForDemo from '../../data/backporch.generated.json';
import { uploadPorchImage } from './porchImages';
import { BlockComposer } from './BlockComposer';
import { coverFallback, newBlockId, normalizeBlocks, type PorchBlock } from '../../lib/porchBlocks';
import { FacebookKit } from './FacebookKit';
import '../internalReports.css';
import './internalBackporch.css';

const PAGE_PATH = '/internal/backporch';
const LOGO = `${import.meta.env.BASE_URL}logo-wordmark.webp`;
const KINDS: PorchKind[] = ['news', 'gathering', 'ask', 'story'];
const KIND_HELP: Record<PorchKind, string> = {
  news: 'Something that happened or changed.',
  gathering: 'An event people can come to. Adds a date chip.',
  ask: 'Something we need: volunteers, stories, donations, a survey.',
  story: 'A moment worth telling: a recap, a person, a photo.',
};

type PublishMode = 'draft' | 'now' | 'schedule';

interface Form {
  id: string | null;
  slug: string;
  slugTouched: boolean;
  title: string;
  summary: string;
  blocks: PorchBlock[];
  presentation: Presentation;
  kind: PorchKind;
  image_path: string | null;
  image_alt: string;
  link_url: string;
  link_label: string;
  event_start: string; // datetime-local
  event_end: string;
  event_place: string;
  pinned: boolean;
  mode: PublishMode;
  publish_at: string; // datetime-local, for 'schedule'
  expires_at: string; // datetime-local
  status: PorchPost['status'];
  published_at: string | null;
}

const EMPTY: Form = {
  id: null,
  slug: '',
  slugTouched: false,
  title: '',
  summary: '',
  blocks: [],
  presentation: { layout: 'standard', mood: 'dusk', reactions: false },
  kind: 'news',
  image_path: null,
  image_alt: '',
  link_url: '',
  link_label: '',
  event_start: '',
  event_end: '',
  event_place: '',
  pinned: false,
  mode: 'now',
  publish_at: '',
  expires_at: '',
  status: 'draft',
  published_at: null,
};

/** ISO -> value for <input type="datetime-local"> in the browser's own time zone. */
function toLocalInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const fromLocalInput = (value: string) => (value ? new Date(value).toISOString() : null);

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
    .replace(/-+[^-]*$/, (m) => (m.length < 6 ? '' : m)) // don't end on a cut-off word fragment
    .replace(/-+$/g, '');
}

function formFromPost(post: PorchPost): Form {
  const scheduled = post.status === 'published' && post.published_at && Date.parse(post.published_at) > Date.now();
  return {
    id: post.id,
    slug: post.slug,
    slugTouched: true,
    title: post.title,
    summary: post.summary,
    blocks: normalizeBlocks(post.blocks),
    presentation: normalizePresentation(post.presentation),
    kind: post.kind,
    image_path: post.image_path,
    image_alt: post.image_alt ?? '',
    link_url: post.link_url ?? '',
    link_label: post.link_label ?? '',
    event_start: toLocalInput(post.event_start),
    event_end: toLocalInput(post.event_end),
    event_place: post.event_place ?? '',
    pinned: post.pinned,
    mode: post.status === 'published' ? (scheduled ? 'schedule' : 'now') : 'draft',
    publish_at: toLocalInput(post.published_at),
    expires_at: toLocalInput(post.expires_at),
    status: post.status,
    published_at: post.published_at,
  };
}

/** The post as the site would show it, for the live preview and the Facebook kit. */
function previewPost(form: Form): PorchPost {
  return {
    id: form.id ?? 'preview',
    slug: form.slug || 'your-post',
    title: form.title || 'Your title',
    summary: form.summary || 'Your summary shows here.',
    blocks: normalizeBlocks(form.blocks),
    presentation: form.presentation,
    kind: form.kind,
    org: 'sparkpoint',
    image_path: form.image_path ?? coverFallback(normalizeBlocks(form.blocks))?.img.path ?? null,
    image_alt: form.image_path ? form.image_alt || null : coverFallback(normalizeBlocks(form.blocks))?.img.alt ?? null,
    link_url: form.link_url || null,
    link_label: form.link_label || null,
    event_start: form.kind === 'gathering' ? fromLocalInput(form.event_start) : null,
    event_end: form.kind === 'gathering' ? fromLocalInput(form.event_end) : null,
    event_place: form.kind === 'gathering' ? form.event_place || null : null,
    pinned: form.pinned,
    status: form.mode === 'draft' ? 'draft' : 'published',
    published_at: form.published_at ?? new Date().toISOString(),
    expires_at: fromLocalInput(form.expires_at),
    updated_at: new Date().toISOString(),
  };
}

function validateBlocks(blocks: PorchBlock[]): string | null {
  for (const [i, b] of blocks.entries()) {
    const n = `Block ${i + 1}`;
    if ((b.type === 'image' && !b.alt.trim()) || (b.type === 'gallery' && b.images.some((img) => !img.alt.trim()))) {
      return `${n}: describe every photo for people who can't see it (alt text).`;
    }
    if (b.type === 'embed' && !b.videoId) return `${n}: paste a YouTube or Vimeo video link, or remove the block.`;
    if (b.type === 'link' && !/^https:\/\//.test(b.url.trim())) return `${n}: links must start with https://`;
    if (b.type === 'quote' && !b.text.trim()) return `${n}: the quote is empty.`;
    if (b.type === 'place' && !b.name.trim()) return `${n}: add the place's name.`;
    if (b.type === 'experiment' && !b.experiment) return `${n}: choose an experiment.`;
    if (b.type === 'motionText' && !b.text.trim()) return `${n}: the animated line is empty.`;
    if (b.type === 'counter' && b.items.some((x) => !x.label.trim() || !Number.isFinite(x.value))) return `${n}: every number needs a value and a label.`;
    if (b.type === 'beforeAfter' && (!b.before.path || !b.after.path)) return `${n}: choose both the before and after photos.`;
    if (b.type === 'beforeAfter' && (!b.before.alt.trim() || !b.after.alt.trim())) return `${n}: describe both photos.`;
    if (b.type === 'scrolly' && b.steps.length === 0) return `${n}: add at least one step.`;
    if (b.type === 'scrolly' && b.steps.some((x) => !x.text.trim() || !x.image.alt.trim())) return `${n}: every step needs words and a photo description.`;
    if (b.type === 'timeline' && b.items.some((x) => !x.date.trim() || !x.title.trim())) return `${n}: every moment needs a when and a what.`;
    if (b.type === 'poll' && (!b.question.trim() || b.options.filter((o) => o.trim()).length < 2)) return `${n}: a poll needs a question and at least two choices.`;
  }
  return null;
}

function validate(form: Form): string | null {
  if (!form.title.trim()) return 'Add a title.';
  if (!form.summary.trim()) return 'Add a summary. It shows in lists and link previews.';
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(form.slug) || form.slug.length < 2) {
    return 'The short address can use lowercase letters, numbers, and single dashes.';
  }
  if (form.image_path && !form.image_alt.trim()) return "Describe the cover photo for people who can't see it (alt text).";
  const blockProblem = validateBlocks(form.blocks);
  if (blockProblem) return blockProblem;
  if (form.link_label && !form.link_url) return 'Add the link the button should go to, or clear the button label.';
  if (form.link_url && !/^https:\/\//.test(form.link_url)) return 'Links must start with https://';
  if (form.kind === 'gathering' && !form.event_start) return 'Add when the gathering starts.';
  if (form.event_end && form.event_start && form.event_end < form.event_start) return 'The end time is before the start.';
  if (form.mode === 'schedule' && !form.publish_at) return 'Choose when the post should go up.';
  return null;
}

const MOODS: { id: Mood; label: string; swatch: string }[] = [
  { id: 'dusk', label: 'Dusk', swatch: '#1f1b26' },
  { id: 'sunrise', label: 'Sunrise', swatch: '#2a1b22' },
  { id: 'forest', label: 'Forest', swatch: '#142019' },
  { id: 'plum', label: 'Plum', swatch: '#24112a' },
];

interface Starter {
  name: string;
  description: string;
  kind: PorchKind;
  hint: string;
  blocks: () => PorchBlock[];
}

const STARTERS: Starter[] = [
  {
    name: 'Event',
    description: 'Date, place, what to expect',
    kind: 'gathering',
    hint: 'Set the date and time above. Add a photo or flyer if you have one.',
    blocks: () => [
      { id: newBlockId(), type: 'text', text: '' },
      { id: newBlockId(), type: 'place', name: '' },
    ],
  },
  {
    name: 'Ask',
    description: 'What we need, and where to help',
    kind: 'ask',
    hint: 'Say what you need in a sentence or two, then link to the form or sign-up.',
    blocks: () => [
      { id: newBlockId(), type: 'text', text: '' },
      { id: newBlockId(), type: 'link', url: '', label: '' },
    ],
  },
  {
    name: 'Photo story',
    description: 'A set of photos with a few words',
    kind: 'story',
    hint: 'Drop all your photos onto the box below at once. They become a gallery.',
    blocks: () => [{ id: newBlockId(), type: 'text', text: '' }],
  },
  {
    name: 'Voice note',
    description: 'A recording, a song, an interview',
    kind: 'story',
    hint: 'Drop the audio file onto the box below, then add a line about who and where.',
    blocks: () => [{ id: newBlockId(), type: 'text', text: '' }],
  },
];

const DRAFT_KEY = (id: string | null) => `backporch-draft:${id ?? 'new'}`;

function readDraft(id: string | null, current: Form): { form: Form; at: number } | null {
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY(id));
    if (!raw) return null;
    const saved = JSON.parse(raw) as { form: Form; at: number };
    if (JSON.stringify(saved.form) === JSON.stringify(current)) return null;
    return saved;
  } catch {
    return null;
  }
}

function writeDraft(form: Form) {
  try {
    window.localStorage.setItem(DRAFT_KEY(form.id), JSON.stringify({ form, at: Date.now() }));
  } catch {
    /* private mode or full: autosave is a convenience */
  }
}

function clearDraft(id: string | null) {
  try {
    window.localStorage.removeItem(DRAFT_KEY(id));
    if (id) window.localStorage.removeItem(DRAFT_KEY(null));
  } catch {
    /* ignore */
  }
}

function Counter({ value, max }: { value: string; max: number }) {
  const left = max - value.length;
  return (
    <span className="pe-count" data-over={left < 0}>
      {left < 0 ? `${-left} over` : `${left} left`}
    </span>
  );
}

function statusLabel(post: PorchPost): string {
  if (post.status === 'draft') return 'Draft';
  if (post.status === 'archived') return 'Taken down';
  if (post.published_at && Date.parse(post.published_at) > Date.now()) return `Scheduled · ${shortDate(post.published_at)}`;
  if (post.expires_at && Date.parse(post.expires_at) <= Date.now()) return 'Expired';
  return 'Live';
}

/**
 * Demo mode only (the database does this itself): pinning `post` keeps at most
 * MAX_PINS pins, unpinning the one pinned longest ago.
 */
function keepPinLimit(list: PorchPost[], post: PorchPost): PorchPost[] {
  if (!post.pinned) return list;
  const others = sortPosts(list.filter((p) => p.pinned && p.id !== post.id));
  const drop = new Set(others.slice(MAX_PINS - 1).map((p) => p.id));
  return list.map((p) => (drop.has(p.id) ? { ...p, pinned: false, pinned_at: null } : p));
}

// ─────────────────────────────────────────────────────────────

function Editor({
  initial,
  pinnedTitle,
  onSaved,
  onCancel,
  demo = false,
}: {
  initial: Form;
  pinnedTitle: string | null;
  onSaved: (post: PorchPost) => void;
  onCancel: () => void;
  /** Local demo (dev server only): saving stays in this browser tab, nothing is written. */
  demo?: boolean;
}) {
  const [form, setForm] = useState<Form>(initial);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const wasPublished = initial.status === 'published';
  const set = <K extends keyof Form>(key: K, value: Form[K]) => setForm((f) => ({ ...f, [key]: value }));
  const preview = useMemo(() => previewPost(form), [form]);
  const [full, setFull] = useState(false);
  const [starterHint, setStarterHint] = useState<string | null>(null);
  const [restorable, setRestorable] = useState<{ form: Form; at: number } | null>(() => readDraft(initial.id, initial));

  // Autosave: every change is kept in this browser until the post is saved.
  useEffect(() => {
    const t = window.setTimeout(() => writeDraft(form), 600);
    return () => window.clearTimeout(t);
  }, [form]);

  const isBlank = !initial.id && !form.title && !form.summary && form.blocks.length === 0;
  const startWith = (s: Starter) => {
    setForm((f) => ({ ...f, kind: s.kind, blocks: s.blocks() }));
    setStarterHint(s.hint);
  };

  const onTitle = (title: string) =>
    setForm((f) => ({ ...f, title, slug: f.slugTouched ? f.slug : slugify(title) }));

  const onPhoto = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const path = await uploadPorchImage(file, form.slug || slugify(form.title));
      set('image_path', path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The photo could not be uploaded.');
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    const problem = validate(form);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setSaving(true);

    const status: PorchPost['status'] = form.mode === 'draft' ? (form.status === 'archived' ? 'archived' : 'draft') : 'published';
    const published_at =
      form.mode === 'schedule'
        ? fromLocalInput(form.publish_at)
        : form.mode === 'now'
          ? form.published_at && Date.parse(form.published_at) <= Date.now()
            ? form.published_at
            : new Date().toISOString()
          : form.published_at;
    const gathering = form.kind === 'gathering';
    // No cover chosen: the first photo, or else the first link's preview image.
    const cover = coverFallback(normalizeBlocks(form.blocks))?.img;
    const row = {
      slug: form.slug,
      title: form.title.trim(),
      summary: form.summary.trim(),
      blocks: normalizeBlocks(form.blocks),
      presentation: {
        ...form.presentation,
        // Lists don't load blocks, so a takeover remembers its opening scene here.
        scene: (() => {
          const first = normalizeBlocks(form.blocks)[0];
          return form.presentation.layout === 'takeover' && first?.type === 'backdrop' ? first.scene : undefined;
        })(),
      },
      kind: form.kind,
      org: 'sparkpoint',
      // No cover chosen: the first photo in the post is the cover.
      image_path: form.image_path ?? cover?.path ?? null,
      image_alt: form.image_path ? form.image_alt.trim() : cover?.alt ?? null,
      link_url: form.link_url.trim() || null,
      link_label: form.link_url.trim() ? form.link_label.trim() || null : null,
      event_start: gathering ? fromLocalInput(form.event_start) : null,
      event_end: gathering ? fromLocalInput(form.event_end) : null,
      event_place: gathering ? form.event_place.trim() || null : null,
      pinned: status === 'published' && form.pinned,
      status,
      published_at,
      expires_at: fromLocalInput(form.expires_at),
    };

    if (demo) {
      setSaving(false);
      onSaved({
        ...previewPost(form),
        ...row,
        id: form.id ?? `demo-${Date.now()}`,
        updated_at: new Date().toISOString(),
      } as PorchPost);
      return;
    }
    const query = form.id
      ? supabase.from('porch_posts').update(row).eq('id', form.id).select('*').single()
      : supabase.from('porch_posts').insert(row).select('*').single();
    const { data, error: saveError } = await query;
    setSaving(false);
    if (saveError) {
      setError(
        saveError.code === '23505'
          ? `Another post already uses the address ${shortAddress(form.slug)}. Pick a different one.`
          : saveError.code === '42501'
            ? "Your account isn't set up to post on the BackPorch."
            : `Could not save: ${saveError.message}`,
      );
      return;
    }
    clearDraft(form.id);
    onSaved(data as PorchPost);
  };

  return (
    <form className="pe-editor" onSubmit={save} noValidate>
      <div className="pe-editor-main">
        {restorable && (
          <div className="ir-status-message pe-restore" role="status">
            <span>You have unsaved changes from {new Date(restorable.at).toLocaleString()}.</span>
            <button type="button" className="pe-btn pe-btn-sm" onClick={() => { setForm(restorable.form); setRestorable(null); }}>
              Restore them
            </button>
            <button type="button" className="pe-btn pe-btn-sm pe-btn-link" onClick={() => { clearDraft(initial.id); setRestorable(null); }}>
              Discard
            </button>
          </div>
        )}

        {isBlank && (
          <div className="pe-starters" role="group" aria-label="Start from">
            {STARTERS.map((st) => (
              <button key={st.name} type="button" onClick={() => startWith(st)}>
                <strong>{st.name}</strong>
                <small>{st.description}</small>
              </button>
            ))}
          </div>
        )}

        <div className="pe-field">
          <div className="pe-label-row">
            <label className="pe-label" htmlFor="pe-title">Title</label>
            <Counter value={form.title} max={LIMITS.title} />
          </div>
          <input id="pe-title" className="ir-input" value={form.title} maxLength={LIMITS.title + 20} onChange={(e) => onTitle(e.target.value)} />
        </div>

        <div className="pe-field">
          <div className="pe-label-row">
            <label className="pe-label" htmlFor="pe-summary">Summary</label>
            <Counter value={form.summary} max={LIMITS.summary} />
          </div>
          <textarea id="pe-summary" className="ir-input pe-textarea" rows={3} value={form.summary} onChange={(e) => set('summary', e.target.value)} />
          <p className="pe-help">One or two sentences. Shows in lists, on the homepage, and in link previews.</p>
        </div>

        <fieldset className="pe-field pe-fieldset">
          <legend className="pe-label">Kind</legend>
          <div className="pe-kinds">
            {KINDS.map((k) => (
              <label key={k} className="pe-kind" data-on={form.kind === k}>
                <input type="radio" name="kind" value={k} checked={form.kind === k} onChange={() => set('kind', k)} />
                <strong className="pe-kind-name"><BlazeMark blaze={KIND_BLAZE[k]} size={14} /> {KIND_LABELS[k]}</strong>
                <span>{KIND_HELP[k]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {form.kind === 'gathering' && (
          <div className="pe-grid-3">
            <div className="pe-field">
              <label className="pe-label" htmlFor="pe-start">Starts</label>
              <input id="pe-start" type="datetime-local" className="ir-input" value={form.event_start} onChange={(e) => set('event_start', e.target.value)} />
            </div>
            <div className="pe-field">
              <label className="pe-label" htmlFor="pe-end">Ends (optional)</label>
              <input id="pe-end" type="datetime-local" className="ir-input" value={form.event_end} onChange={(e) => set('event_end', e.target.value)} />
            </div>
            <div className="pe-field">
              <label className="pe-label" htmlFor="pe-place">Where (optional)</label>
              <input id="pe-place" className="ir-input" value={form.event_place} maxLength={LIMITS.place} onChange={(e) => set('event_place', e.target.value)} />
            </div>
          </div>
        )}

        <section className="pe-field" aria-labelledby="pe-blocks-label">
          <div className="pe-label-row">
            <span className="pe-label" id="pe-blocks-label">The post</span>
          </div>
          {starterHint && <p className="pe-hint">{starterHint}</p>}
          <BlockComposer
            blocks={form.blocks}
            onChange={(blocks) => set('blocks', blocks)}
            slug={form.slug || slugify(form.title)}
            onError={setError}
            demo={demo}
          />
        </section>

        <fieldset className="pe-field pe-fieldset pe-lab-set">
          <legend className="pe-label">Porch Lab: how this post presents itself</legend>
          <div className="pe-modes">
            <label>
              <input
                type="radio"
                name="layout"
                checked={form.presentation.layout !== 'takeover'}
                onChange={() => set('presentation', { ...form.presentation, layout: 'standard' })}
              />{' '}
              Standard
            </label>
            <label>
              <input
                type="radio"
                name="layout"
                checked={form.presentation.layout === 'takeover'}
                onChange={() => set('presentation', { ...form.presentation, layout: 'takeover' })}
              />{' '}
              Takeover <span className="bc-stage" data-stage={LAB_FEATURES.takeover.stage}>{STAGE_LABELS[LAB_FEATURES.takeover.stage]}</span>
            </label>
          </div>
          {form.presentation.layout === 'takeover' && <p className="pe-help">{LAB_FEATURES.takeover.pitch} {LAB_FEATURES.takeover.notes}</p>}
          <div className="pe-moods" role="radiogroup" aria-label="Mood">
            {MOODS.map((m) => (
              <label key={m.id} className="pe-mood" data-on={(form.presentation.mood ?? 'dusk') === m.id} style={{ ['--swatch' as string]: m.swatch }}>
                <input
                  type="radio"
                  name="mood"
                  checked={(form.presentation.mood ?? 'dusk') === m.id}
                  onChange={() => set('presentation', { ...form.presentation, mood: m.id })}
                />
                <span aria-hidden="true" />
                {m.label}
              </label>
            ))}
          </div>
          <label className="pe-check">
            <input
              type="checkbox"
              checked={Boolean(form.presentation.reactions)}
              onChange={(e) => set('presentation', { ...form.presentation, reactions: e.target.checked })}
            />
            <span>
              Porch reactions under the post <span className="bc-stage" data-stage={LAB_FEATURES.reactions.stage}>{STAGE_LABELS[LAB_FEATURES.reactions.stage]}</span>
            </span>
          </label>
        </fieldset>

        <div className="pe-field">
          <span className="pe-label">Cover photo</span>
          {form.image_path ? (
            <>
              <div className="pe-photo">
                <img src={porchImageUrl(form.image_path, 480) ?? ''} alt="" />
                <button type="button" className="pe-btn" onClick={() => setForm((f) => ({ ...f, image_path: null, image_alt: '' }))}>
                  Use the first photo instead
                </button>
              </div>
              <div className="pe-label-row" style={{ marginTop: 10 }}>
                <label className="pe-label" htmlFor="pe-alt">Describe the cover photo</label>
                <Counter value={form.image_alt} max={LIMITS.imageAlt} />
              </div>
              <input id="pe-alt" className="ir-input" value={form.image_alt} onChange={(e) => set('image_alt', e.target.value)} />
            </>
          ) : (
            <div className="pe-cover-auto">
              <p className="pe-help">
                {(() => {
                  const auto = coverFallback(normalizeBlocks(form.blocks));
                  if (!auto) return 'No photo yet. Add one to the post, paste a link with a preview image, or choose a separate cover.';
                  return auto.link
                    ? `Using the preview image from ${auto.link.site}. It shows on the homepage, in lists, and in link previews, and on the post it opens the link.`
                    : 'Using the first photo in the post. It shows on the homepage, in lists, and in link previews.';
                })()}
              </p>
              <label className="pe-btn pe-btn-sm pe-file-btn">
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => void onPhoto(e.target.files?.[0])} disabled={uploading} />
                {uploading ? 'Uploading…' : 'Choose a different cover'}
              </label>
            </div>
          )}
        </div>

        <div className="pe-grid-2">
          <div className="pe-field">
            <label className="pe-label" htmlFor="pe-link">Button link (optional)</label>
            <input id="pe-link" type="url" className="ir-input" placeholder="https://" value={form.link_url} onChange={(e) => set('link_url', e.target.value)} />
          </div>
          <div className="pe-field">
            <label className="pe-label" htmlFor="pe-link-label">Button label</label>
            <input id="pe-link-label" className="ir-input" placeholder="Learn more" maxLength={LIMITS.linkLabel} value={form.link_label} onChange={(e) => set('link_label', e.target.value)} />
          </div>
        </div>

        <div className="pe-field">
          <label className="pe-label" htmlFor="pe-slug">Short address</label>
          <div className="pe-slug">
            <span>{shortAddress('')}</span>
            <input
              id="pe-slug"
              className="ir-input"
              value={form.slug}
              readOnly={wasPublished}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''), slugTouched: true }))}
            />
          </div>
          <p className="pe-help">
            {wasPublished
              ? "Locked once a post is published, so links people already shared keep working."
              : 'Short and sayable. This is what goes on flyers, the QR code, and Facebook.'}
          </p>
        </div>

        <fieldset className="pe-field pe-fieldset">
          <legend className="pe-label">When</legend>
          <div className="pe-modes">
            <label><input type="radio" name="mode" checked={form.mode === 'now'} onChange={() => set('mode', 'now')} /> {wasPublished ? 'Published' : 'Publish now'}</label>
            <label><input type="radio" name="mode" checked={form.mode === 'schedule'} onChange={() => set('mode', 'schedule')} /> Schedule</label>
            <label><input type="radio" name="mode" checked={form.mode === 'draft'} onChange={() => set('mode', 'draft')} /> {wasPublished ? 'Take down (back to draft)' : 'Save as draft'}</label>
          </div>
          {form.mode === 'schedule' && (
            <input aria-label="Publish at" type="datetime-local" className="ir-input pe-inline-input" value={form.publish_at} onChange={(e) => set('publish_at', e.target.value)} />
          )}
          <div className="pe-field" style={{ marginTop: 14 }}>
            <label className="pe-label" htmlFor="pe-expires">Take off the lists after (optional)</label>
            <input id="pe-expires" type="datetime-local" className="ir-input pe-inline-input" value={form.expires_at} onChange={(e) => set('expires_at', e.target.value)} />
            <p className="pe-help">The post's own page keeps working after this; it just drops off the homepage and the BackPorch list.</p>
          </div>
        </fieldset>

        <label className="pe-check">
          <input type="checkbox" checked={form.pinned} disabled={form.mode === 'draft'} onChange={(e) => set('pinned', e.target.checked)} />
          <span>
            Pin to the top of the BackPorch and the homepage (up to {MAX_PINS} at once)
            {pinnedTitle && !initial.pinned && <small> (replaces “{pinnedTitle}”, pinned longest ago)</small>}
          </span>
        </label>

        {error && <p className="ir-error" role="alert">{error}</p>}

        <div className="pe-actions">
          <button type="submit" className="pe-btn pe-btn-primary" disabled={saving || uploading}>
            {saving ? 'Saving…' : form.mode === 'draft' ? 'Save draft' : form.mode === 'schedule' ? 'Schedule post' : wasPublished ? 'Save changes' : 'Publish'}
          </button>
          <button type="button" className="pe-btn" onClick={onCancel}>Cancel</button>
        </div>
      </div>

      <div className="pe-full-preview">
        <button type="button" className="pe-btn" onClick={() => setFull((f) => !f)} aria-expanded={full}>
          {full ? 'Hide the full post preview' : 'Preview the whole post, as the public will see it'}
        </button>
        {full && (
          <div className="pe-full-frame">
            <PostView post={preview} preview />
          </div>
        )}
      </div>

      <aside className="pe-preview" aria-label="Preview">
        <p className="pe-label">On the homepage</p>
        <div className="porch porch-dusk pe-preview-frame">
          <PorchLead post={preview} />
        </div>
        <p className="pe-label" style={{ marginTop: 20 }}>In a list</p>
        <div className="porch porch-dusk pe-preview-frame">
          <ul className="porch-log-list">
            <li>
              <PorchRow post={preview} />
            </li>
          </ul>
        </div>
      </aside>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────

function useEditorCheck() {
  const [isEditor, setIsEditor] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.rpc('is_porch_editor').then(({ data, error }) => setIsEditor(!error && data === true));
  }, []);
  return isEditor;
}

function BackPorchAdmin({ demo = false }: { demo?: boolean }) {
  const { user, signOut } = useInternalAuth();
  const checked = useEditorCheck();
  const isEditor = demo ? true : checked;
  const [posts, setPosts] = useState<PorchPost[] | null>(demo ? demoPosts() : null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Form | null>(null);
  const [kitFor, setKitFor] = useState<PorchPost | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const load = useCallback(async () => {
    if (demo) return; // demo posts live in this tab's state
    const { data, error } = await supabase
      .from('porch_posts')
      .select('*')
      .order('status', { ascending: true })
      .order('published_at', { ascending: false, nullsFirst: true });
    if (error) setLoadError('Could not load posts right now.');
    else setPosts((data ?? []) as PorchPost[]);
  }, [demo]);

  useEffect(() => {
    if (isEditor) void load();
  }, [isEditor, load]);

  // With MAX_PINS already pinned, pinning another unpins the one pinned longest ago.
  const pins = sortPosts((posts ?? []).filter((p) => p.pinned));
  const replacedPin = (id: string | null) => {
    const others = pins.filter((p) => p.id !== id);
    return others.length >= MAX_PINS ? others[others.length - 1].title : null;
  };

  const publishSite = async () => {
    if (demo) {
      setNotice('Demo: on the live site, this starts a site update so link previews and feeds refresh.');
      return;
    }
    setPublishing(true);
    setNotice(null);
    const { error } = await supabase.functions.invoke('backporch-publish', { method: 'POST' });
    setPublishing(false);
    setNotice(
      error
        ? 'Could not start the site update. New posts still show on the site right away; their link previews catch up at the next scheduled update.'
        : 'Site update started. Link previews and the RSS feed refresh in about five minutes.',
    );
  };

  const update = async (post: PorchPost, patch: Partial<PorchPost>, message: string) => {
    if (demo) {
      const next = { ...post, ...patch, ...(patch.pinned !== undefined && { pinned_at: patch.pinned ? new Date().toISOString() : null }) };
      setPosts((list) => keepPinLimit((list ?? []).map((p) => (p.id === post.id ? next : p)), next));
      setNotice(`Demo: ${message}`);
      return;
    }
    const { error } = await supabase.from('porch_posts').update(patch).eq('id', post.id);
    setNotice(error ? `Could not update: ${error.message}` : message);
    void load();
  };

  const remove = async (post: PorchPost) => {
    if (!window.confirm(`Delete the draft “${post.title}”? This can't be undone.`)) return;
    if (demo) {
      setPosts((list) => (list ?? []).filter((p) => p.id !== post.id));
      setNotice('Demo: draft deleted.');
      return;
    }
    const { error } = await supabase.from('porch_posts').delete().eq('id', post.id);
    setNotice(error ? `Could not delete: ${error.message}` : 'Draft deleted.');
    void load();
  };

  if (isEditor === null) return <div className="ir-loading" role="status">Checking access…</div>;
  if (!isEditor) {
    return (
      <div className="ir-shell ir-shell-narrow" style={{ paddingTop: 48 }}>
        <p className="ir-status-message">
          You're signed in as {user?.email}, but this account isn't set up to post on the BackPorch yet. Ask Jeff to add
          you.
        </p>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="ir-shell pe-shell">
        <h2 className="pe-h2">{editing.id ? 'Edit post' : 'New post'}</h2>
        <Editor
          initial={editing}
          demo={demo}
          pinnedTitle={replacedPin(editing.id)}
          onCancel={() => setEditing(null)}
          onSaved={(saved) => {
            setEditing(null);
            if (demo) {
              setPosts((list) => {
                const prev = (list ?? []).find((p) => p.id === saved.id);
                const next = {
                  ...saved,
                  pinned_at: saved.pinned ? (prev?.pinned ? prev.pinned_at : new Date().toISOString()) : null,
                };
                return keepPinLimit([next, ...(list ?? []).filter((p) => p.id !== saved.id)], next);
              });
            }
            void load();
            if (saved.status === 'published') {
              setKitFor(saved);
              setNotice(
                isListed(saved)
                  ? `“${saved.title}” is live at ${shortAddress(saved.slug)}.`
                  : `“${saved.title}” is scheduled for ${shortDate(saved.published_at!)}.`,
              );
            } else setNotice(`Saved “${saved.title}” as a draft.`);
          }}
        />
      </div>
    );
  }

  return (
    <div className="ir-shell pe-shell">
      <div className="pe-toolbar">
        <button type="button" className="pe-btn pe-btn-primary" onClick={() => { setKitFor(null); setEditing({ ...EMPTY }); }}>
          New post
        </button>
        <button type="button" className="pe-btn" onClick={() => void publishSite()} disabled={publishing}>
          {publishing ? 'Starting…' : 'Update the site now'}
        </button>
        <Link className="pe-btn pe-btn-link" to="/backporch">View the BackPorch</Link>
        <Link className="pe-btn pe-btn-link" to={demo ? '/internal/lab/demo' : '/internal/lab'}>Porch Lab</Link>
        {!demo && <button type="button" className="pe-btn pe-btn-link" onClick={() => void signOut()}>Sign out</button>}
      </div>

      {demo && (
        <p className="ir-status-message pe-demo-note" role="note">
          <strong>Local demo.</strong> These are the sample posts, and nothing you do here is saved. Photo, video, and audio
          uploads need the database, so they won't work until it's set up.
        </p>
      )}

      {notice && <p className="ir-status-message" role="status">{notice}</p>}
      {loadError && <p className="ir-error" role="alert">{loadError}</p>}

      {kitFor && <FacebookKit post={kitFor} />}

      {posts === null && !loadError && <div className="ir-loading">Loading posts…</div>}
      {posts && posts.length === 0 && (
        <div className="ir-empty-state">Nothing on the porch yet. Start with “New post”.</div>
      )}

      {posts && posts.length > 0 && (
        <ul className="pe-list">
          {posts.map((post) => (
            <li key={post.id} className="pe-item">
              <div className="pe-item-main">
                <p className="pe-item-meta">
                  <span className="pe-status" data-status={statusLabel(post).split(' ')[0].toLowerCase()}>{statusLabel(post)}</span>
                  {post.pinned && <span className="pe-pinned">Pinned</span>}
                  <span>{KIND_LABELS[post.kind]}</span>
                  {post.published_at && <span>{shortDate(post.published_at)}</span>}
                </p>
                <h3>{post.title}</h3>
                <p className="pe-item-addr">{shortAddress(post.slug)}</p>
              </div>
              <div className="pe-item-actions">
                <button type="button" className="pe-btn pe-btn-sm" onClick={() => { setKitFor(null); setEditing(formFromPost(post)); }}>Edit</button>
                {post.status === 'published' && (
                  <>
                    <button type="button" className="pe-btn pe-btn-sm" onClick={() => { setKitFor(post); window.scrollTo({ top: 0 }); }}>Facebook kit</button>
                    <button
                      type="button"
                      className="pe-btn pe-btn-sm"
                      onClick={() => void update(post, { pinned: !post.pinned }, post.pinned ? 'Unpinned.' : `Pinned “${post.title}”.`)}
                    >
                      {post.pinned ? 'Unpin' : 'Pin'}
                    </button>
                    <a className="pe-btn pe-btn-sm pe-btn-link" href={`${import.meta.env.BASE_URL}${postPath(post.slug).slice(1)}`} target="_blank" rel="noreferrer">View</a>
                    <button
                      type="button"
                      className="pe-btn pe-btn-sm"
                      onClick={() => {
                        if (window.confirm(`Take “${post.title}” down? Its page and short address stop working.`)) {
                          void update(post, { status: 'archived', pinned: false }, 'Taken down.');
                        }
                      }}
                    >
                      Take down
                    </button>
                  </>
                )}
                {post.status === 'archived' && (
                  <button type="button" className="pe-btn pe-btn-sm" onClick={() => void update(post, { status: 'published' }, 'Back up.')}>Put back up</button>
                )}
                {post.status === 'draft' && (
                  <button type="button" className="pe-btn pe-btn-sm pe-btn-danger" onClick={() => void remove(post)}>Delete</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EditorShell({ demo = false }: { demo?: boolean }) {
  return (
      <div className="ir-page pe-page">
        <SEOHead title="BackPorch editor | SparkPoint" description="Write and publish BackPorch posts." path={PAGE_PATH} noindex />
        <header className="ir-masthead">
          <Link className="ir-back-link" to="/">
            <img src={LOGO} alt="SparkPoint" style={{ height: 22 }} />
          </Link>
          <Link className="ir-back-link" to="/internal/reports">Internal reports</Link>
        </header>
        <div className="pe-hero">
          <div className="pe-hero-inner">
            <h1>
              The BackPorch <span>editor</span>
            </h1>
            <p>Write it once here. It goes up on the site right away, and the Facebook kit gives you the post for Facebook.</p>
          </div>
        </div>
        <BackPorchAdmin demo={demo} />
      </div>
  );
}

export default function InternalBackPorchPage() {
  return (
    <RequireInternalAuth>
      <EditorShell />
    </RequireInternalAuth>
  );
}

/**
 * /internal/backporch/demo: the editor on the sample posts, no sign-in, nothing
 * saved. Only routed on the local dev server (see App.tsx); never in a build.
 */
export function InternalBackPorchDemoPage() {
  return <EditorShell demo />;
}

function demoPosts(): PorchPost[] {
  return (bakedForDemo.posts as unknown as PorchPost[]).map(withBlocks);
}
