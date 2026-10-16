// The block composer for /internal/backporch: build a post from text, photos,
// galleries, clips, YouTube/Vimeo links, audio, quotes, links, places, PDFs, and
// coded experiments. Drop files anywhere on it and the right blocks appear.
import { useEffect, useRef, useState, type DragEvent } from 'react';
import { porchImageUrl, porchMediaUrl } from '../../lib/backporch';
import {
  BLOCK_LABELS,
  BLOCK_LIMITS,
  clockDuration,
  newBlockId,
  parseVideoLink,
  type BlockType,
  type MediaRef,
  type PorchBlock,
} from '../../lib/porchBlocks';
import { EXPERIMENTS } from '../../experiments/backporch/registry';
import { LAB_TOOLS, STAGE_LABELS, stageOf } from '../../lib/porchLab';
import type { Frame } from '../../lib/porchBlocks';
import { fetchLinkPreview } from './linkPreview';
import { uploadPorchAudio, uploadPorchFile, uploadPorchImage, uploadPorchVideo } from './porchImages';

const ADDABLE: { type: BlockType; hint: string }[] = [
  { type: 'text', hint: 'Paragraphs' },
  { type: 'image', hint: 'Photos or a gallery' },
  { type: 'video', hint: 'Clip up to a minute' },
  { type: 'embed', hint: 'Paste a link' },
  { type: 'audio', hint: 'Voice note, song' },
  { type: 'quote', hint: 'Someone’s words' },
  { type: 'link', hint: 'A page or form' },
  { type: 'place', hint: 'Where it is' },
  { type: 'file', hint: 'A PDF flyer' },
  { type: 'experiment', hint: 'Coded piece' },
];

type Busy = Record<string, string>; // block id (or 'drop') -> what's uploading

function emptyBlock(type: BlockType): PorchBlock | null {
  const id = newBlockId();
  switch (type) {
    case 'text':
      return { id, type, text: '' };
    case 'embed':
      return { id, type, provider: 'youtube', videoId: '' };
    case 'quote':
      return { id, type, text: '' };
    case 'link':
      return { id, type, url: '', label: '' };
    case 'place':
      return { id, type, name: '' };
    case 'experiment':
      return { id, type, experiment: EXPERIMENTS[0]?.id ?? '' };
    case 'motionText':
      return { id, type, text: '', effect: 'type', size: 'large' };
    case 'backdrop':
      return { id, type, scene: 'sunrise', frame: 'bleed' };
    case 'counter':
      return { id, type, items: [{ value: 0, label: '' }] };
    case 'beforeAfter':
      return { id, type, before: { path: '', alt: '' }, after: { path: '', alt: '' }, beforeLabel: 'Before', afterLabel: 'After', frame: 'wide' };
    case 'scrolly':
      return { id, type, steps: [], frame: 'wide' };
    case 'timeline':
      return { id, type, items: [{ date: '', title: '' }] };
    case 'poll':
      return { id, type, question: '', options: ['', ''] };
    default:
      return null; // media blocks are created by choosing a file
  }
}

const ACCEPT: Partial<Record<BlockType, string>> = {
  image: 'image/jpeg,image/png,image/webp,image/heic',
  video: 'video/mp4,video/quicktime,video/webm',
  audio: 'audio/*',
  file: 'application/pdf',
};

/** Blocks that can reach past the text column. */
const FRAMEABLE = new Set<BlockType>(['image', 'gallery', 'video', 'embed', 'quote', 'motionText', 'backdrop', 'counter', 'beforeAfter', 'scrolly', 'timeline']);

export function BlockComposer({
  blocks,
  onChange,
  slug,
  onError,
  demo = false,
}: {
  blocks: PorchBlock[];
  onChange: (next: PorchBlock[]) => void;
  slug: string;
  onError: (message: string | null) => void;
  /** Local demo: link previews come from the dev server instead of the edge function. */
  demo?: boolean;
}) {
  const [busy, setBusy] = useState<Busy>({});
  const [dropping, setDropping] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const picker = useRef<HTMLInputElement>(null);
  const pickFor = useRef<{ type: BlockType; into?: string } | null>(null);
  const latest = useRef(blocks);
  latest.current = blocks;
  const slotPicker = useRef<HTMLInputElement>(null);
  const slotApply = useRef<{ key: string; apply: (path: string) => void } | null>(null);

  /** Pick one photo for a slot inside a block (before/after, scrolly step). */
  const pickPhoto = (key: string, apply: (path: string) => void) => {
    slotApply.current = { key, apply };
    slotPicker.current?.click();
  };
  const uploadSlot = async (file: File) => {
    const target = slotApply.current;
    if (!target) return;
    onError(null);
    setBusyFor(target.key, 'Uploading photo…');
    try {
      target.apply(await uploadPorchImage(file, slug || 'post'));
    } catch (err) {
      onError(err instanceof Error ? err.message : 'The photo could not be uploaded.');
    } finally {
      setBusyFor(target.key, null);
    }
  };

  const commit = (next: PorchBlock[]) => {
    latest.current = next;
    onChange(next);
  };
  const update = (id: string, patch: Partial<PorchBlock>) =>
    commit(latest.current.map((b) => (b.id === id ? ({ ...b, ...patch } as PorchBlock) : b)));
  const remove = (id: string) => commit(latest.current.filter((b) => b.id !== id));
  const move = (id: string, by: number) => {
    const list = [...latest.current];
    const i = list.findIndex((b) => b.id === id);
    const j = i + by;
    if (i < 0 || j < 0 || j >= list.length) return;
    [list[i], list[j]] = [list[j], list[i]];
    commit(list);
  };
  const append = (...add: PorchBlock[]) => commit([...latest.current, ...add]);
  const setBusyFor = (key: string, label: string | null) =>
    setBusy((b) => {
      const next = { ...b };
      if (label) next[key] = label;
      else delete next[key];
      return next;
    });

  /** Turn files into blocks: several photos become one gallery. */
  async function addFiles(files: File[], into?: string) {
    onError(null);
    const images = files.filter((f) => f.type.startsWith('image/'));
    const others = files.filter((f) => !f.type.startsWith('image/'));
    const s = slug || 'post';
    if (images.length) {
      const key = into ?? 'drop';
      setBusyFor(key, `Preparing ${images.length} photo${images.length > 1 ? 's' : ''}…`);
      try {
        const refs: MediaRef[] = [];
        for (const [i, f] of images.entries()) {
          setBusyFor(key, `Uploading photo ${i + 1} of ${images.length}…`);
          refs.push({ path: await uploadPorchImage(f, s), alt: '' });
        }
        const target = into ? latest.current.find((b) => b.id === into) : undefined;
        if (target?.type === 'gallery') {
          update(target.id, { images: [...target.images, ...refs] });
        } else if (target?.type === 'image') {
          update(target.id, { type: 'gallery', images: [{ path: target.path, alt: target.alt, caption: target.caption }, ...refs] } as Partial<PorchBlock>);
        } else if (refs.length === 1) {
          append({ id: newBlockId(), type: 'image', ...refs[0] });
        } else {
          append({ id: newBlockId(), type: 'gallery', images: refs });
        }
      } catch (err) {
        onError(err instanceof Error ? err.message : 'A photo could not be uploaded.');
      } finally {
        setBusyFor(key, null);
      }
    }
    for (const f of others) {
      const key = `f${newBlockId()}`;
      try {
        if (f.type.startsWith('video/')) {
          setBusyFor(key, `Uploading ${f.name}…`);
          const v = await uploadPorchVideo(f, s);
          append({ id: newBlockId(), type: 'video', path: v.path, poster: v.poster, duration: v.duration });
        } else if (f.type.startsWith('audio/')) {
          setBusyFor(key, `Uploading ${f.name}…`);
          const a = await uploadPorchAudio(f, s);
          append({ id: newBlockId(), type: 'audio', path: a.path, duration: a.duration, title: f.name.replace(/\.[^.]+$/, '') });
        } else if (f.type === 'application/pdf') {
          setBusyFor(key, `Uploading ${f.name}…`);
          const d = await uploadPorchFile(f, s);
          append({ id: newBlockId(), type: 'file', path: d.path, size: d.size, label: f.name.replace(/\.pdf$/i, '') });
        } else {
          onError(`${f.name} isn't a photo, video, audio file, or PDF.`);
        }
      } catch (err) {
        onError(err instanceof Error ? err.message : `${f.name} could not be uploaded.`);
      } finally {
        setBusyFor(key, null);
      }
    }
  }

  function addBlock(type: BlockType) {
    const made = emptyBlock(type);
    if (made) {
      append(made);
      return;
    }
    pickFor.current = { type };
    if (picker.current) {
      picker.current.accept = ACCEPT[type] ?? '';
      picker.current.multiple = type === 'image';
      picker.current.click();
    }
  }

  function addMoreTo(id: string) {
    pickFor.current = { type: 'image', into: id };
    if (picker.current) {
      picker.current.accept = ACCEPT.image ?? '';
      picker.current.multiple = true;
      picker.current.click();
    }
  }

  const onDrop = (e: DragEvent) => {
    if (!e.dataTransfer.files.length) return;
    e.preventDefault();
    setDropping(false);
    void addFiles([...e.dataTransfer.files]);
  };

  // Reorder by dragging a block's handle (the ↑ ↓ buttons do the same by keyboard).
  const onBlockDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    const list = [...latest.current];
    const from = list.findIndex((b) => b.id === dragId);
    const to = list.findIndex((b) => b.id === targetId);
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    commit(list);
    setDragId(null);
  };

  return (
    <div
      className="bc"
      data-dropping={dropping}
      onDragOver={(e) => {
        if (e.dataTransfer.types.includes('Files')) {
          e.preventDefault();
          setDropping(true);
        }
      }}
      onDragLeave={(e) => {
        if (e.currentTarget === e.target) setDropping(false);
      }}
      onDrop={onDrop}
    >
      <input
        ref={picker}
        type="file"
        hidden
        onChange={(e) => {
          const files = [...(e.target.files ?? [])];
          e.target.value = '';
          if (files.length) void addFiles(files, pickFor.current?.into);
        }}
      />

      <input
        ref={slotPicker}
        type="file"
        hidden
        accept="image/jpeg,image/png,image/webp,image/heic"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (f) void uploadSlot(f);
        }}
      />

      {blocks.length === 0 && (
        <p className="bc-empty">
          Drop photos, a video clip, audio, or a PDF here, or add a block below. Several photos at once become a gallery.
        </p>
      )}

      <ol className="bc-list">
        {blocks.map((b, i) => (
          <li
            key={b.id}
            className="bc-block"
            data-dragging={dragId === b.id}
            onDragOver={(e) => {
              if (dragId) e.preventDefault();
            }}
            onDrop={(e) => {
              if (dragId) {
                e.preventDefault();
                e.stopPropagation();
                onBlockDrop(b.id);
              }
            }}
          >
            <div className="bc-head">
              <span
                className="bc-handle"
                draggable
                onDragStart={(e) => {
                  setDragId(b.id);
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragEnd={() => setDragId(null)}
                title="Drag to move"
                aria-hidden="true"
              >
                ⋮⋮
              </span>
              <strong>{b.type === 'image' ? 'Photo' : BLOCK_LABELS[b.type]}</strong>
              {stageOf(b.type) !== 'released' && (
                <span className="bc-stage" data-stage={stageOf(b.type)}>
                  {STAGE_LABELS[stageOf(b.type)]}
                </span>
              )}
              {FRAMEABLE.has(b.type) && (
                <select
                  className="bc-frame"
                  value={b.frame ?? 'column'}
                  onChange={(e) => update(b.id, { frame: e.target.value === 'column' ? undefined : (e.target.value as Frame) })}
                  aria-label="Width"
                >
                  <option value="column">Column width</option>
                  <option value="wide">Wide</option>
                  <option value="bleed">Edge to edge</option>
                </select>
              )}
              <span className="bc-tools">
                <button type="button" onClick={() => move(b.id, -1)} disabled={i === 0} aria-label={`Move ${BLOCK_LABELS[b.type]} block up`}>
                  ↑
                </button>
                <button type="button" onClick={() => move(b.id, 1)} disabled={i === blocks.length - 1} aria-label={`Move ${BLOCK_LABELS[b.type]} block down`}>
                  ↓
                </button>
                <button type="button" onClick={() => remove(b.id)} aria-label={`Remove ${BLOCK_LABELS[b.type]} block`}>
                  Remove
                </button>
              </span>
            </div>
            <BlockFields
              block={b}
              update={(patch) => update(b.id, patch)}
              addMore={() => addMoreTo(b.id)}
              busy={busy[b.id]}
              busyMap={busy}
              pickPhoto={pickPhoto}
              slug={slug}
              demo={demo}
            />
          </li>
        ))}
      </ol>

      {Object.entries(busy)
        .filter(([k]) => !blocks.some((b) => b.id === k))
        .map(([k, label]) => (
          <p key={k} className="bc-busy" role="status">
            {label}
          </p>
        ))}

      <div className="bc-add" role="group" aria-label="Add a block">
        {ADDABLE.map(({ type, hint }) => (
          <button key={type} type="button" onClick={() => addBlock(type)} disabled={type === 'experiment' && !EXPERIMENTS.length}>
            <strong>+ {type === 'image' ? 'Photos' : BLOCK_LABELS[type]}</strong>
            <small>{hint}</small>
          </button>
        ))}
      </div>
      <p className="bc-lab-head">
        <strong>Porch Lab</strong> Experimental tools. <em>Field test</em> ones show on the site with a small tag;{' '}
        <em>Lab</em> ones only show in previews. Try them all at <a href="/internal/lab">the lab bench</a>.
      </p>
      <div className="bc-add bc-add-lab" role="group" aria-label="Add a Porch Lab tool">
        {LAB_TOOLS.filter((t) => t.stage !== 'released').map((t) => (
          <button key={t.type} type="button" onClick={() => addBlock(t.type)}>
            <strong>
              + {BLOCK_LABELS[t.type]} <span className="bc-stage" data-stage={t.stage}>{STAGE_LABELS[t.stage]}</span>
            </strong>
            <small>{t.pitch}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children, count }: { label: string; children: React.ReactNode; count?: [string, number] }) {
  return (
    <label className="bc-field">
      <span>
        {label}
        {count && <small data-over={count[0].length > count[1]}>{count[1] - count[0].length}</small>}
      </span>
      {children}
    </label>
  );
}

function MediaFields({ img, onChange }: { img: MediaRef; onChange: (patch: Partial<MediaRef>) => void }) {
  return (
    <div className="bc-media">
      <img src={porchImageUrl(img.path, 480) ?? ''} alt="" />
      <div>
        <Field label="Describe the photo (required)" count={[img.alt, BLOCK_LIMITS.alt]}>
          <input className="ir-input" value={img.alt} data-missing={!img.alt.trim()} onChange={(e) => onChange({ alt: e.target.value })} placeholder="What's in the picture, for people who can't see it" />
        </Field>
        <Field label="Caption (optional)">
          <input className="ir-input" value={img.caption ?? ''} onChange={(e) => onChange({ caption: e.target.value || undefined })} />
        </Field>
      </div>
    </div>
  );
}

function PhotoSlot({
  label,
  img,
  busy,
  onPick,
  onAlt,
}: {
  label: string;
  img: MediaRef;
  busy?: string;
  onPick: () => void;
  onAlt: (alt: string) => void;
}) {
  return (
    <div className="bc-slot">
      <span className="bc-slot-label">{label}</span>
      {img.path ? <img src={porchImageUrl(img.path, 480) ?? ''} alt="" /> : <div className="bc-slot-empty">No photo yet</div>}
      <button type="button" className="pe-btn pe-btn-sm" onClick={onPick} disabled={!!busy}>
        {busy ?? (img.path ? 'Replace photo' : 'Choose photo')}
      </button>
      {img.path && (
        <input className="ir-input" value={img.alt} data-missing={!img.alt.trim()} onChange={(e) => onAlt(e.target.value)} placeholder="Describe the photo (required)" aria-label={`Describe the ${label.toLowerCase()} photo`} />
      )}
    </div>
  );
}

function BlockFields({
  block: b,
  update,
  addMore,
  busy,
  busyMap,
  pickPhoto,
  slug,
  demo,
}: {
  block: PorchBlock;
  update: (patch: Partial<PorchBlock>) => void;
  addMore: () => void;
  busy?: string;
  busyMap: Busy;
  pickPhoto: (key: string, apply: (path: string) => void) => void;
  slug: string;
  demo: boolean;
}) {
  switch (b.type) {
    case 'text':
      return (
        <Field label="Text" count={[b.text, BLOCK_LIMITS.text]}>
          <textarea
            className="ir-input pe-textarea"
            rows={5}
            value={b.text}
            onChange={(e) => update({ text: e.target.value })}
            placeholder="Leave a blank line between paragraphs. Web addresses starting with https:// become links."
          />
        </Field>
      );
    case 'image':
      return (
        <>
          <MediaFields img={b} onChange={(p) => update(p)} />
          <button type="button" className="pe-btn pe-btn-sm" onClick={addMore} disabled={!!busy}>
            {busy ?? 'Add more photos (makes a gallery)'}
          </button>
        </>
      );
    case 'gallery':
      return (
        <>
          <div className="bc-gallery">
            {b.images.map((img, i) => (
              <div key={img.path} className="bc-gallery-item">
                <MediaFields
                  img={img}
                  onChange={(p) => update({ images: b.images.map((x, j) => (j === i ? { ...x, ...p } : x)) })}
                />
                <div className="bc-gallery-tools">
                  <button type="button" onClick={() => update({ images: swap(b.images, i, i - 1) })} disabled={i === 0} aria-label="Move photo earlier">
                    ←
                  </button>
                  <button type="button" onClick={() => update({ images: swap(b.images, i, i + 1) })} disabled={i === b.images.length - 1} aria-label="Move photo later">
                    →
                  </button>
                  <button type="button" onClick={() => update({ images: b.images.filter((_, j) => j !== i) })}>
                    Remove photo
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="pe-btn pe-btn-sm" onClick={addMore} disabled={!!busy || b.images.length >= BLOCK_LIMITS.galleryImages}>
            {busy ?? 'Add more photos'}
          </button>
        </>
      );
    case 'video':
      return (
        <div className="bc-media">
          <video src={porchMediaUrl(b.path)} poster={b.poster ? porchMediaUrl(b.poster) : undefined} controls preload="metadata" playsInline />
          <div>
            <p className="pe-help">{clockDuration(b.duration) ? `${clockDuration(b.duration)} long.` : ''} Plays here with its own controls; nothing autoplays.</p>
            <Field label="Caption (optional)">
              <input className="ir-input" value={b.caption ?? ''} onChange={(e) => update({ caption: e.target.value || undefined })} />
            </Field>
          </div>
        </div>
      );
    case 'embed':
      return <EmbedFields block={b} update={update} />;
    case 'audio':
      return (
        <>
          <audio src={porchMediaUrl(b.path)} controls preload="metadata" className="bc-audio" />
          <Field label="Title">
            <input className="ir-input" value={b.title ?? ''} onChange={(e) => update({ title: e.target.value || undefined })} />
          </Field>
          <Field label="Caption or transcript note (optional)">
            <input className="ir-input" value={b.caption ?? ''} onChange={(e) => update({ caption: e.target.value || undefined })} />
          </Field>
        </>
      );
    case 'quote':
      return (
        <>
          <Field label="Their words">
            <textarea className="ir-input pe-textarea" rows={3} value={b.text} onChange={(e) => update({ text: e.target.value })} />
          </Field>
          <Field label="Who said it (optional)">
            <input className="ir-input" value={b.cite ?? ''} onChange={(e) => update({ cite: e.target.value || undefined })} placeholder="First name, or a role like “a Brevard parent”" />
          </Field>
        </>
      );
    case 'link':
      return <LinkFields block={b} update={update} slug={slug} demo={demo} />;
    case 'place':
      return (
        <>
          <Field label="Place">
            <input className="ir-input" value={b.name} onChange={(e) => update({ name: e.target.value })} placeholder="Transylvania County Library" />
          </Field>
          <Field label="Address (optional, adds directions)">
            <input className="ir-input" value={b.address ?? ''} onChange={(e) => update({ address: e.target.value || undefined })} placeholder="212 S Gaston St, Brevard, NC" />
          </Field>
        </>
      );
    case 'file':
      return (
        <Field label="What it is">
          <input className="ir-input" value={b.label} onChange={(e) => update({ label: e.target.value })} placeholder="Event flyer (PDF)" />
        </Field>
      );
    case 'experiment':
      return (
        <>
          <Field label="Which experiment">
            <select className="ir-input" value={b.experiment} onChange={(e) => update({ experiment: e.target.value })}>
              {EXPERIMENTS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.meta.title}
                </option>
              ))}
            </select>
          </Field>
          <p className="pe-help">
            {EXPERIMENTS.find((x) => x.id === b.experiment)?.meta.description} New experiments start with{' '}
            <code>npm run porch:experiment &lt;name&gt;</code> and go live through a pull request.
          </p>
        </>
      );
    case 'motionText':
      return (
        <>
          <Field label="The line" count={[b.text, 280]}>
            <textarea className="ir-input pe-textarea" rows={2} value={b.text} onChange={(e) => update({ text: e.target.value })} placeholder="One strong sentence works best." />
          </Field>
          <div className="pe-grid-2">
            <Field label="Effect">
              <select className="ir-input" value={b.effect} onChange={(e) => update({ effect: e.target.value as 'type' | 'light' })}>
                <option value="type">Types itself out</option>
                <option value="light">Words light up as you scroll</option>
              </select>
            </Field>
            <Field label="Size">
              <select className="ir-input" value={b.size} onChange={(e) => update({ size: e.target.value as 'large' | 'huge' })}>
                <option value="large">Large</option>
                <option value="huge">Huge</option>
              </select>
            </Field>
          </div>
        </>
      );
    case 'backdrop':
      return (
        <>
          <Field label="Scene">
            <select className="ir-input" value={b.scene} onChange={(e) => update({ scene: e.target.value as 'sunrise' | 'fireflies' | 'ridges' })}>
              <option value="sunrise">Sunrise over the ridges</option>
              <option value="fireflies">Fireflies at dusk</option>
              <option value="ridges">Drifting ridges</option>
            </select>
          </Field>
          <Field label="Heading over it (optional)">
            <input className="ir-input" value={b.heading ?? ''} onChange={(e) => update({ heading: e.target.value || undefined })} />
          </Field>
          <Field label="Line under the heading (optional)">
            <input className="ir-input" value={b.sub ?? ''} onChange={(e) => update({ sub: e.target.value || undefined })} />
          </Field>
          <p className="pe-help">As the first block of a takeover post, the scene fills the screen behind the post's title.</p>
        </>
      );
    case 'counter':
      return (
        <>
          {b.items.map((item, i) => (
            <div key={i} className="bc-row">
              <Field label="Number">
                <input className="ir-input" type="number" value={Number.isFinite(item.value) ? item.value : ''} onChange={(e) => update({ items: b.items.map((x, j) => (j === i ? { ...x, value: Number(e.target.value) } : x)) })} />
              </Field>
              <Field label="Before">
                <input className="ir-input" value={item.prefix ?? ''} maxLength={4} placeholder="$" onChange={(e) => update({ items: b.items.map((x, j) => (j === i ? { ...x, prefix: e.target.value || undefined } : x)) })} />
              </Field>
              <Field label="After">
                <input className="ir-input" value={item.suffix ?? ''} maxLength={8} placeholder="%" onChange={(e) => update({ items: b.items.map((x, j) => (j === i ? { ...x, suffix: e.target.value || undefined } : x)) })} />
              </Field>
              <Field label="What it counts">
                <input className="ir-input" value={item.label} onChange={(e) => update({ items: b.items.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} placeholder="neighbors served" />
              </Field>
              <button type="button" className="bc-x" onClick={() => update({ items: b.items.filter((_, j) => j !== i) })} disabled={b.items.length < 2} aria-label="Remove number">
                ×
              </button>
            </div>
          ))}
          <button type="button" className="pe-btn pe-btn-sm" onClick={() => update({ items: [...b.items, { value: 0, label: '' }] })} disabled={b.items.length >= 4}>
            Add a number
          </button>
        </>
      );
    case 'beforeAfter':
      return (
        <>
          <div className="bc-slots">
            <PhotoSlot
              label="Before"
              img={b.before}
              busy={busyMap[`${b.id}:before`]}
              onPick={() => pickPhoto(`${b.id}:before`, (path) => update({ before: { ...b.before, path } }))}
              onAlt={(alt) => update({ before: { ...b.before, alt } })}
            />
            <PhotoSlot
              label="After"
              img={b.after}
              busy={busyMap[`${b.id}:after`]}
              onPick={() => pickPhoto(`${b.id}:after`, (path) => update({ after: { ...b.after, path } }))}
              onAlt={(alt) => update({ after: { ...b.after, alt } })}
            />
          </div>
          <div className="pe-grid-2">
            <Field label="Before label">
              <input className="ir-input" value={b.beforeLabel ?? ''} maxLength={40} onChange={(e) => update({ beforeLabel: e.target.value || undefined })} placeholder="October 2024" />
            </Field>
            <Field label="After label">
              <input className="ir-input" value={b.afterLabel ?? ''} maxLength={40} onChange={(e) => update({ afterLabel: e.target.value || undefined })} placeholder="October 2026" />
            </Field>
          </div>
          <p className="pe-help">Photos framed the same way from the same spot work best.</p>
        </>
      );
    case 'scrolly':
      return (
        <>
          {b.steps.map((step, i) => (
            <div key={i} className="bc-step">
              <PhotoSlot
                label={`Step ${i + 1}`}
                img={step.image}
                busy={busyMap[`${b.id}:${i}`]}
                onPick={() => pickPhoto(`${b.id}:${i}`, (path) => update({ steps: b.steps.map((x, j) => (j === i ? { ...x, image: { ...x.image, path } } : x)) }))}
                onAlt={(alt) => update({ steps: b.steps.map((x, j) => (j === i ? { ...x, image: { ...x.image, alt } } : x)) })}
              />
              <Field label="What happens here">
                <textarea className="ir-input pe-textarea" rows={3} value={step.text} onChange={(e) => update({ steps: b.steps.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} />
              </Field>
              <div className="bc-gallery-tools">
                <button type="button" onClick={() => update({ steps: swap(b.steps, i, i - 1) })} disabled={i === 0} aria-label="Move step earlier">↑</button>
                <button type="button" onClick={() => update({ steps: swap(b.steps, i, i + 1) })} disabled={i === b.steps.length - 1} aria-label="Move step later">↓</button>
                <button type="button" onClick={() => update({ steps: b.steps.filter((_, j) => j !== i) })}>Remove step</button>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="pe-btn pe-btn-sm"
            disabled={b.steps.length >= 8 || !!busyMap[`${b.id}:new`]}
            onClick={() => pickPhoto(`${b.id}:new`, (path) => update({ steps: [...b.steps, { text: '', image: { path, alt: '' } }] }))}
          >
            {busyMap[`${b.id}:new`] ?? 'Add a step (choose its photo)'}
          </button>
          <p className="pe-help">Each step pairs a photo with a few sentences. 3 to 6 steps feels best.</p>
        </>
      );
    case 'timeline':
      return (
        <>
          {b.items.map((item, i) => (
            <div key={i} className="bc-row bc-row-timeline">
              <Field label="When">
                <input className="ir-input" value={item.date} maxLength={40} onChange={(e) => update({ items: b.items.map((x, j) => (j === i ? { ...x, date: e.target.value } : x)) })} placeholder="Sept 2024" />
              </Field>
              <Field label="What">
                <input className="ir-input" value={item.title} onChange={(e) => update({ items: b.items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} />
              </Field>
              <Field label="More (optional)">
                <input className="ir-input" value={item.text ?? ''} onChange={(e) => update({ items: b.items.map((x, j) => (j === i ? { ...x, text: e.target.value || undefined } : x)) })} />
              </Field>
              <button type="button" className="bc-x" onClick={() => update({ items: b.items.filter((_, j) => j !== i) })} disabled={b.items.length < 2} aria-label="Remove moment">
                ×
              </button>
            </div>
          ))}
          <button type="button" className="pe-btn pe-btn-sm" onClick={() => update({ items: [...b.items, { date: '', title: '' }] })} disabled={b.items.length >= 20}>
            Add a moment
          </button>
        </>
      );
    case 'poll':
      return (
        <>
          <Field label="Question">
            <input className="ir-input" value={b.question} onChange={(e) => update({ question: e.target.value })} placeholder="What should the next Porch Talk be about?" />
          </Field>
          {b.options.map((o, i) => (
            <div key={i} className="bc-row bc-row-poll">
              <Field label={`Choice ${i + 1}`}>
                <input className="ir-input" value={o} maxLength={80} onChange={(e) => update({ options: b.options.map((x, j) => (j === i ? e.target.value : x)) })} />
              </Field>
              <button type="button" className="bc-x" onClick={() => update({ options: b.options.filter((_, j) => j !== i) })} disabled={b.options.length <= 2} aria-label="Remove choice">
                ×
              </button>
            </div>
          ))}
          <button type="button" className="pe-btn pe-btn-sm" onClick={() => update({ options: [...b.options, ''] })} disabled={b.options.length >= 5}>
            Add a choice
          </button>
          <p className="pe-help">Anonymous, one vote per browser. Voting opens when the post is published.</p>
        </>
      );
    default:
      return null;
  }
}

/**
 * A link that fills itself in: once a full https address is pasted, the page's own
 * preview (title, description, site, image) is fetched and shown as a card. The
 * image is copied into our storage; nothing on the public card loads from the
 * other site.
 */
function LinkFields({
  block: b,
  update,
  slug,
  demo,
}: {
  block: Extract<PorchBlock, { type: 'link' }>;
  update: (p: Partial<PorchBlock>) => void;
  slug: string;
  demo: boolean;
}) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [problem, setProblem] = useState<string | null>(null);
  const fetchedFor = useRef<string | null>(b.preview ? b.url : null);

  const load = async (url: string) => {
    fetchedFor.current = url;
    setState('loading');
    setProblem(null);
    try {
      const got = await fetchLinkPreview(url, slug, demo);
      if (fetchedFor.current !== url) return; // the link changed while this was loading
      update({
        preview: { title: got.title, description: got.description, site: got.site, image: got.imagePath },
        ...(b.label.trim() ? {} : { label: 'Read more' }),
      } as Partial<PorchBlock>);
      setState('idle');
    } catch (err) {
      if (fetchedFor.current !== url) return;
      setProblem(err instanceof Error ? err.message : 'Could not fetch a preview for that link.');
      setState('error');
    }
  };

  // Fetch once the address looks complete and has settled for a moment.
  useEffect(() => {
    const url = b.url.trim();
    if (!/^https:\/\/[^\s/]+\.[^\s/]+/.test(url) || url === fetchedFor.current) return;
    const t = window.setTimeout(() => void load(url), 700);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [b.url]);

  const p = b.preview;
  return (
    <>
      <Field label="Link">
        <input
          className="ir-input"
          type="url"
          placeholder="Paste a link: https://"
          value={b.url}
          onChange={(e) => {
            const video = parseVideoLink(e.target.value);
            // A YouTube or Vimeo link becomes a video block on its own.
            if (video) update({ type: 'embed', provider: video.provider, videoId: video.videoId } as Partial<PorchBlock>);
            else update({ url: e.target.value, preview: undefined } as Partial<PorchBlock>);
          }}
        />
      </Field>

      {state === 'loading' && <p className="bc-busy" role="status">Fetching the page's preview…</p>}
      {state === 'error' && problem && (
        <p className="pe-help" role="status">
          {problem} The link still works; it just shows as a plain card.
        </p>
      )}

      {p && (
        <div className="bc-unfurl">
          {p.image ? <img src={porchImageUrl(p.image, 480) ?? ''} alt="" /> : <div className="bc-unfurl-noimg">No image</div>}
          <div>
            <small>{p.site}</small>
            <strong>{p.title ?? b.label}</strong>
            {p.description && <span>{p.description}</span>}
            <div className="bc-gallery-tools">
              {p.image && (
                <button type="button" onClick={() => update({ preview: { ...p, image: undefined } } as Partial<PorchBlock>)}>
                  Remove image
                </button>
              )}
              <button type="button" onClick={() => void load(b.url.trim())}>
                Refresh preview
              </button>
              <button type="button" onClick={() => update({ preview: undefined } as Partial<PorchBlock>)}>
                Plain link instead
              </button>
            </div>
          </div>
        </div>
      )}

      <Field label="Button text">
        <input className="ir-input" value={b.label} onChange={(e) => update({ label: e.target.value })} placeholder="Read more, Sign up…" />
      </Field>
      <Field label={p ? 'Your own line about it (optional, replaces the page’s description)' : 'One line about it (optional)'}>
        <input className="ir-input" value={b.note ?? ''} onChange={(e) => update({ note: e.target.value || undefined })} />
      </Field>
    </>
  );
}

function EmbedFields({ block: b, update }: { block: Extract<PorchBlock, { type: 'embed' }>; update: (p: Partial<PorchBlock>) => void }) {
  const [raw, setRaw] = useState(
    b.videoId ? (b.provider === 'youtube' ? `https://youtu.be/${b.videoId}` : `https://vimeo.com/${b.videoId}`) : '',
  );
  const parsed = parseVideoLink(raw);
  return (
    <>
      <Field label="YouTube or Vimeo link">
        <input
          className="ir-input"
          type="url"
          placeholder="https://youtu.be/…"
          value={raw}
          data-missing={!!raw && !parsed}
          onChange={(e) => {
            setRaw(e.target.value);
            const v = parseVideoLink(e.target.value);
            update(v ? { provider: v.provider, videoId: v.videoId } : { videoId: '' });
          }}
        />
      </Field>
      {raw && !parsed && <p className="pe-help">That doesn't look like a YouTube or Vimeo video link.</p>}
      <Field label="Title (shown on the play button)">
        <input className="ir-input" value={b.title ?? ''} onChange={(e) => update({ title: e.target.value || undefined })} />
      </Field>
      <Field label="Caption (optional)">
        <input className="ir-input" value={b.caption ?? ''} onChange={(e) => update({ caption: e.target.value || undefined })} />
      </Field>
    </>
  );
}

function swap<T>(list: T[], i: number, j: number): T[] {
  if (j < 0 || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
