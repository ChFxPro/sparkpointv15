// Renders a BackPorch post's blocks. Input is always run through normalizeBlocks()
// first (see src/lib/porchBlocks.ts), so every field here is known-good.
import { Component, lazy, Suspense, useMemo, useRef, useState, type ReactNode } from 'react';
import { bodyParagraphs, porchImageSrcSet, porchImageUrl, porchMediaUrl } from '../../lib/backporch';
import { clockDuration, type MediaRef, type PorchBlock } from '../../lib/porchBlocks';
import { experimentLoader, experimentMeta } from '../../experiments/backporch/registry';
import { TopoPin, Waymark } from './fieldKit';
import { publicBlocks, stageOf, STAGE_LABELS } from '../../lib/porchLab';
import { Backdrop } from './lab/Backdrop';
import { BeforeAfter, Counter, MotionText, Poll, Scrolly, Timeline } from './lab/LabBlocks';
import './lab/lab.css';

/** Plain text with bare https:// links made clickable. Nothing else is interpreted. */
export function linkify(text: string): ReactNode[] {
  return text.split(/(https:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/g).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} rel="noopener">
        {part.replace(/^https:\/\//, '')}
      </a>
    ) : (
      part
    ),
  );
}

function Picture({ img, sizes, eager = false }: { img: MediaRef; sizes: string; eager?: boolean }) {
  return (
    <img
      src={porchImageUrl(img.path, 1600) ?? ''}
      srcSet={porchImageSrcSet(img.path)}
      sizes={sizes}
      alt={img.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}

function Caption({ children }: { children?: string }) {
  return children ? <figcaption>{children}</figcaption> : null;
}

function Gallery({ images }: { images: MediaRef[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const go = (i: number) => {
    const el = track.current?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  };
  return (
    <div className="pb-gallery" role="group" aria-roledescription="gallery" aria-label={`${images.length} photos`}>
      <div
        className="pb-gallery-track"
        ref={track}
        tabIndex={0}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
        }}
      >
        {images.map((img, i) => (
          <figure key={img.path} className="pb-slide" aria-label={`Photo ${i + 1} of ${images.length}`}>
            <div className="porch-img">
              <Picture img={img} sizes="(min-width: 760px) 720px, 100vw" />
            </div>
            <Caption>{img.caption}</Caption>
          </figure>
        ))}
      </div>
      {images.length > 1 && (
        <div className="pb-gallery-nav">
          <button type="button" onClick={() => go(Math.max(0, index - 1))} disabled={index === 0} aria-label="Previous photo">
            <span aria-hidden="true">←</span>
          </button>
          <span aria-live="polite">
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={() => go(Math.min(images.length - 1, index + 1))}
            disabled={index >= images.length - 1}
            aria-label="Next photo"
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * YouTube/Vimeo, privacy first: nothing loads from the provider until someone
 * presses play (the site promises no third-party tracking), and then only the
 * no-cookie / do-not-track players.
 */
function Embed({ block }: { block: Extract<PorchBlock, { type: 'embed' }> }) {
  const [on, setOn] = useState(false);
  const src =
    block.provider === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${block.videoId}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${block.videoId}?autoplay=1&dnt=1`;
  const name = block.provider === 'youtube' ? 'YouTube' : 'Vimeo';
  return (
    <figure className="pb-embed">
      <div className="pb-embed-frame">
        {on ? (
          <iframe
            src={src}
            title={block.title ?? `${name} video`}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
          />
        ) : (
          <button type="button" className="pb-embed-play" onClick={() => setOn(true)}>
            <span className="pb-play" aria-hidden="true" />
            <span className="pb-embed-title">{block.title ?? 'Play video'}</span>
            <small>Plays from {name}. Nothing loads from {name} until you press play.</small>
          </button>
        )}
      </div>
      <Caption>{block.caption}</Caption>
    </figure>
  );
}

class ExperimentBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <p className="pb-note">This interactive piece couldn't load. Try refreshing the page.</p> : this.props.children;
  }
}

function Experiment({ id }: { id: string }) {
  const meta = experimentMeta(id);
  const loader = experimentLoader(id);
  const Lazy = useMemo(() => (loader ? lazy(loader) : null), [loader]);
  if (!Lazy || !meta) return null;
  return (
    <div className="pb-experiment">
      <ExperimentBoundary>
        {/* Hold roughly its height only while it loads, so the page doesn't jump. */}
        <Suspense
          fallback={
            <p className="pb-note" role="status" style={{ minHeight: meta.minHeight }}>
              Loading {meta.title}…
            </p>
          }
        >
          <Lazy />
        </Suspense>
      </ExperimentBoundary>
    </div>
  );
}

function sizeLabel(bytes?: number): string | null {
  if (!bytes) return null;
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

interface BlockContext {
  postId: string;
  /** A Link block whose preview image is already the post's cover. */
  omitLinkImage?: string;
  /** The post is published and live, so polls can take votes. */
  live: boolean;
}

function Block({ block, first, ctx }: { block: PorchBlock; first: boolean; ctx: BlockContext }) {
  switch (block.type) {
    case 'text':
      return (
        <div className="pb-text">
          {bodyParagraphs(block.text).map((para, i) => (
            <p key={i}>
              {para.split('\n').map((line, j) => (
                <span key={j}>
                  {j > 0 && <br />}
                  {linkify(line)}
                </span>
              ))}
            </p>
          ))}
        </div>
      );
    case 'image':
      return (
        <figure className="pb-image">
          <div className="porch-img">
            <Picture img={block} sizes="(min-width: 760px) 720px, 100vw" eager={first} />
          </div>
          <Caption>{block.caption}</Caption>
        </figure>
      );
    case 'gallery':
      return <Gallery images={block.images} />;
    case 'video':
      return (
        <figure className="pb-video">
          <video
            controls
            playsInline
            preload="metadata"
            src={porchMediaUrl(block.path)}
            poster={block.poster ? porchMediaUrl(block.poster) : undefined}
          />
          <Caption>{block.caption}</Caption>
        </figure>
      );
    case 'embed':
      return <Embed block={block} />;
    case 'audio':
      return (
        <figure className="pb-audio">
          <div className="pb-audio-head">
            <span className="pb-wave" aria-hidden="true" />
            <div>
              <strong>{block.title ?? 'Listen'}</strong>
              {clockDuration(block.duration) && <small>{clockDuration(block.duration)}</small>}
            </div>
          </div>
          <audio controls preload="metadata" src={porchMediaUrl(block.path)} />
          <Caption>{block.caption}</Caption>
        </figure>
      );
    case 'quote':
      return (
        <blockquote className="pb-quote">
          <p>{block.text}</p>
          {block.cite && <footer>{block.cite}</footer>}
        </blockquote>
      );
    case 'link':
      if (block.preview) {
        const p = block.id === ctx.omitLinkImage ? { ...block.preview, image: undefined } : block.preview;
        const host = new URL(block.url).hostname.replace(/^www\./, '');
        return (
          <a className="pb-unfurl" href={block.url} rel="noopener" data-has-image={Boolean(p.image)}>
            {p.image && (
              <span className="pb-unfurl-img">
                <img src={porchImageUrl(p.image, 960) ?? ''} srcSet={porchImageSrcSet(p.image)} sizes="(min-width: 720px) 240px, 100vw" alt="" loading="lazy" decoding="async" />
              </span>
            )}
            <span className="pb-unfurl-text">
              <small>{p.site ?? host}</small>
              <strong>{p.title ?? block.label}</strong>
              {(block.note ?? p.description) && <span>{block.note ?? p.description}</span>}
              <em>
                {block.label} <Waymark size={16} />
              </em>
            </span>
          </a>
        );
      }
      return (
        <a className="pb-card pb-link" href={block.url} rel="noopener">
          <span>
            <strong>{block.label}</strong>
            {block.note && <span>{block.note}</span>}
            <small>{new URL(block.url).hostname.replace(/^www\./, '')}</small>
          </span>
          <Waymark size={20} />
        </a>
      );
    case 'place': {
      const q = encodeURIComponent([block.name, block.address].filter(Boolean).join(', '));
      return (
        <div className="pb-card pb-place">
          <TopoPin size={22} />
          <span>
            <strong>{block.name}</strong>
            {block.address && <span>{block.address}</span>}
          </span>
          <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} rel="noopener">
            Directions
          </a>
        </div>
      );
    }
    case 'file':
      return (
        <a className="pb-card pb-file" href={porchMediaUrl(block.path)} download rel="noopener">
          <span className="pb-file-icon" aria-hidden="true">PDF</span>
          <span>
            <strong>{block.label}</strong>
            {sizeLabel(block.size) && <small>{sizeLabel(block.size)}</small>}
          </span>
          <span className="pb-file-get">Download</span>
        </a>
      );
    case 'experiment':
      return <Experiment id={block.experiment} />;
    case 'motionText':
      return <MotionText text={block.text} effect={block.effect} size={block.size} />;
    case 'backdrop':
      return <Backdrop scene={block.scene} heading={block.heading} sub={block.sub} tall={block.frame === 'bleed'} />;
    case 'counter':
      return <Counter items={block.items} />;
    case 'beforeAfter':
      return <BeforeAfter before={block.before} after={block.after} beforeLabel={block.beforeLabel} afterLabel={block.afterLabel} />;
    case 'scrolly':
      return <Scrolly steps={block.steps} />;
    case 'timeline':
      return <Timeline items={block.items} />;
    case 'poll':
      return <Poll postId={ctx.postId} blockId={block.id} question={block.question} options={block.options} live={ctx.live} />;
    default:
      return null;
  }
}

/**
 * A post's blocks. `preview` (the editor and the lab bench) also shows lab-stage
 * tools; the public site never does. Lab tools carry a small stage tag.
 */
export function PostBlocks({
  blocks,
  postId = 'preview',
  live = false,
  preview = false,
  omitLinkImage,
}: {
  blocks: PorchBlock[];
  postId?: string;
  live?: boolean;
  preview?: boolean;
  omitLinkImage?: string;
}) {
  const shown = publicBlocks(blocks, preview);
  if (!shown.length) return null;
  return (
    <div className="pb">
      {shown.map((b, i) => {
        const stage = stageOf(b.type);
        return (
          <div key={b.id} className="pb-frame" data-frame={b.frame ?? 'column'}>
            {stage !== 'released' && (
              <span className="pb-stage" data-stage={stage}>
                {STAGE_LABELS[stage]}
              </span>
            )}
            <Block block={b} first={i === 0} ctx={{ postId, live, omitLinkImage }} />
          </div>
        );
      })}
    </div>
  );
}
