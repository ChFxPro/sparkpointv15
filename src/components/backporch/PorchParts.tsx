import { Link } from 'react-router';
import { coverImgStyle, dateChip, porchImageSrcSet, porchImageUrl, postPath, shortDate, type PorchPost } from '../../lib/backporch';
import { BlazeTag, KIND_BLAZE, PINNED_BLAZE } from './fieldKit';
import '@fontsource-variable/fraunces';
import './porch.css';

export function PorchWordmark({ as: Tag = 'span', className = '' }: { as?: 'span' | 'h1' | 'h2'; className?: string }) {
  return (
    <Tag className={`porch-wordmark ${className}`}>
      <span className="porch-wordmark-the">The</span>
      <span>BackPorch</span>
    </Tag>
  );
}

export function PorchImage({
  post,
  sizes,
  width = 960,
  eager = false,
  className = '',
}: {
  post: PorchPost;
  sizes: string;
  width?: number;
  eager?: boolean;
  className?: string;
}) {
  const src = porchImageUrl(post.image_path, width);
  if (!src) return <div className={`porch-img porch-img-blank ${className}`} aria-hidden="true" />;
  const frame = post.presentation?.cover;
  return (
    <div className={`porch-img ${className}`} data-fit={frame?.fit === 'whole' ? 'whole' : undefined}>
      {frame?.fit === 'whole' && <WholeBackdrop path={post.image_path} className="porch-img-backdrop" />}
      <img
        src={src}
        srcSet={porchImageSrcSet(post.image_path)}
        sizes={sizes}
        alt={post.image_alt ?? ''}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={coverImgStyle(frame)}
      />
    </div>
  );
}

/**
 * Behind a cover shown whole: the same photo, small, filling the frame and blurred,
 * so the bands beside a portrait flyer carry its colours instead of empty paper.
 */
export function WholeBackdrop({ path, className }: { path: string | null; className: string }) {
  const src = porchImageUrl(path, 480);
  return src ? <img className={className} src={src} alt="" aria-hidden="true" loading="lazy" decoding="async" /> : null;
}

export function DateChip({ iso }: { iso: string }) {
  const { month, day } = dateChip(iso);
  return (
    <span className="porch-chip" aria-hidden="true">
      <small>{month}</small>
      <b>{day}</b>
    </span>
  );
}

/** The date a list shows: the event date for gatherings, otherwise when it was posted. */
export function listDate(post: PorchPost): string | null {
  const when = post.kind === 'gathering' && post.event_start ? post.event_start : post.published_at;
  return when ? shortDate(when) : null;
}

/** Trail blaze + kind, then the date; "Pinned" leads with its own blaze. */
export function PostMarks({ post, size = 14 }: { post: PorchPost; size?: number }) {
  const date = listDate(post);
  return (
    <p className="porch-meta">
      {post.pinned && <BlazeTag blaze={PINNED_BLAZE} size={size} />}
      <BlazeTag blaze={KIND_BLAZE[post.kind]} size={size} />
      {date && <span className="porch-date">{date}</span>}
    </p>
  );
}

/** The lead post: photo, then its caption on the paper. */
export function PorchLead({ post, eager = false }: { post: PorchPost; eager?: boolean }) {
  const isGathering = post.kind === 'gathering' && post.event_start;
  return (
    <Link className="porch-lead" to={postPath(post.slug)}>
      <PorchImage post={post} sizes="(min-width: 900px) 600px, 100vw" eager={eager} />
      <div className="porch-lead-cap">
        {isGathering && <DateChip iso={post.event_start!} />}
        <div>
          <PostMarks post={post} />
          <h3>{post.title}</h3>
          <p className="porch-lead-summary">{post.summary}</p>
        </div>
      </div>
    </Link>
  );
}

/** A quieter post: small photo, its blaze and date, title, one line. */
export function PorchRow({ post }: { post: PorchPost }) {
  return (
    <Link className="porch-row" to={postPath(post.slug)}>
      <PorchImage post={post} sizes="96px" width={480} />
      <div>
        <PostMarks post={post} size={12} />
        <h4>{post.title}</h4>
        <p className="porch-row-summary">{post.summary}</p>
      </div>
    </Link>
  );
}
