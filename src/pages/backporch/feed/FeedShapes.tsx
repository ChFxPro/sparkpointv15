// One component per shape a post takes on the /backporch board. Which shape a post
// gets is decided in src/lib/porchFeed.ts (shapeOf); styles are in feed.css.
//
// Every post is an <article> with an h3 title that links to its page. Buttons and
// links inside sit beside the title link, never inside it.
import { useState } from 'react';
import { Link } from 'react-router';
import { PostMarks } from '../../../components/backporch/PorchParts';
import { Backdrop } from '../../../components/backporch/lab/Backdrop';
import { coverImgStyle, postPath, porchImageSrcSet, porchImageUrl, type PorchPost } from '../../../lib/backporch';
import { monthDay, shortMonthYear, shapeOf, weekdayAndTime } from '../../../lib/porchFeed';
import { AddToCalendar, CopyLink, DateBlock, Photo, WhenLine } from './FeedParts';

const SIZES_HALF = '(min-width: 1040px) 520px, 100vw';
const SIZES_FULL = '(min-width: 1240px) 1152px, 100vw';
const SIZES_THIRD = '(min-width: 1040px) 380px, 100vw';

/** The post's own call to action: its link and label, else its page. */
function primary(post: PorchPost, fallback: string) {
  return post.link_url
    ? { href: post.link_url, label: post.link_label || fallback, external: true }
    : { href: postPath(post.slug), label: fallback, external: false };
}

function Action({ post, fallback, className }: { post: PorchPost; fallback: string; className: string }) {
  const p = primary(post, fallback);
  return p.external ? (
    <a className={className} href={p.href} rel="noopener">
      {p.label}
    </a>
  ) : (
    <Link className={className} to={p.href}>
      {p.label}
    </Link>
  );
}

function Title({ post, as: Tag = 'h3' }: { post: PorchPost; as?: 'h3' }) {
  return (
    <Tag className="pf-title">
      <Link to={postPath(post.slug)}>{post.title}</Link>
    </Tag>
  );
}

const fullDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric' });

// ── Tickets: upcoming gatherings ───────────────────────────────

export function LeadTicket({ post }: { post: PorchPost }) {
  const start = post.event_start!;
  return (
    <article className="pf-ticket pf-ticket-lead">
      <div className="pf-ticket-photo">
        <Photo path={post.image_path} frame={post.presentation?.cover} alt={post.image_alt ?? ''} sizes={SIZES_HALF} eager />
      </div>
      <div className="pf-ticket-body">
        <div className="pf-ticket-when">
          <DateBlock iso={start} />
          <p>
            <WhenLine post={post} fallback={fullDate(start)} />
            <span>
              {weekdayAndTime(start)}
              {post.event_place ? ` · ${post.event_place}` : ''}
            </span>
          </p>
        </div>
        <Title post={post} />
        <p className="pf-summary">{post.summary}</p>
        <div className="pf-actions">
          <Action post={post} fallback="See the details" className="pf-btn pf-btn-primary" />
          <AddToCalendar post={post} />
          <CopyLink post={post} />
        </div>
      </div>
    </article>
  );
}

export function SmallTicket({ post }: { post: PorchPost }) {
  const start = post.event_start!;
  return (
    <article className="pf-ticket pf-ticket-small">
      <div className="pf-ticket-photo">
        <Photo path={post.image_path} frame={post.presentation?.cover} alt={post.image_alt ?? ''} sizes={SIZES_THIRD} />
        <DateBlock iso={start} size="small" />
      </div>
      <div className="pf-ticket-body">
        <p className="pf-ticket-line">
          <WhenLine post={post} fallback={fullDate(start)} />
          <span> · {weekdayAndTime(start).split(' · ')[1]}</span>
        </p>
        <Title post={post} />
        <p className="pf-summary">{post.summary}</p>
        <div className="pf-actions">
          <Action post={post} fallback="See the details" className="pf-btn pf-btn-primary" />
          <AddToCalendar post={post} />
          <CopyLink post={post} />
        </div>
      </div>
    </article>
  );
}

// ── Ask: a full-width rose band ────────────────────────────────

export function AskBand({ post }: { post: PorchPost }) {
  return (
    <article className="pf-ask">
      <div className="pf-ask-body">
        <p className="pf-ask-kicker">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 3l10 18H2z" />
          </svg>
          We're asking{post.published_at ? ` · ${monthDay(post.published_at)}` : ''}
        </p>
        <Title post={post} />
        <p className="pf-summary">{post.summary}</p>
        <div className="pf-actions">
          <Action post={post} fallback="See how to help" className="pf-btn pf-btn-paper" />
          {post.presentation.doIt && <span className="pf-ask-doit">{post.presentation.doIt}</span>}
          <CopyLink post={post} />
        </div>
        {/* Reactions and a live count ("neighbors have shared") wait for real data
            and the per-voter rate limit; leave them out until then. */}
      </div>
      {post.image_path && (
        <div className="pf-ask-photo">
          <Photo path={post.image_path} frame={post.presentation?.cover} alt={post.image_alt ?? ''} sizes={SIZES_HALF} />
        </div>
      )}
    </article>
  );
}

// ── Stories ────────────────────────────────────────────────────

/** Photo-led: the cover with the title over a scrim, then a strip from its gallery. */
export function PhotoStory({ post }: { post: PorchPost }) {
  const gallery = post.hints?.gallery;
  const more = gallery && gallery.total > 3 ? `See all ${gallery.total} photos` : 'See the whole post';
  return (
    <article className="pf-photo-story">
      <div className="pf-photo-hero">
        <Photo path={post.image_path} frame={post.presentation?.cover} alt={post.image_alt ?? ''} sizes={SIZES_FULL} />
        <div className="pf-photo-text">
          <PostMarks post={post} />
          <Title post={post} />
          <p className="pf-summary">{post.summary}</p>
        </div>
      </div>
      {gallery && (
        <ul className="pf-strip" aria-label={`Photos from “${post.title}”`}>
          {gallery.images.map((img) => (
            <li key={img.path}>
              <Link to={postPath(post.slug)}>
                <Photo path={img.path} alt={img.alt} sizes="(min-width: 1040px) 280px, 33vw" />
              </Link>
            </li>
          ))}
          <li>
            <Link className="pf-strip-more" to={postPath(post.slug)}>
              {more} <span aria-hidden="true">→</span>
            </Link>
          </li>
        </ul>
      )}
      <div className="pf-actions">
        <CopyLink post={post} />
      </div>
    </article>
  );
}

/**
 * A film: a big still with a play button. Nothing loads from YouTube or Vimeo until
 * it's pressed (the site's privacy promise); without JavaScript it opens the post.
 */
export function FilmStory({ post }: { post: PorchPost }) {
  const embed = post.hints!.embed!;
  const [playing, setPlaying] = useState(false);
  const src =
    embed.provider === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${embed.videoId}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${embed.videoId}?autoplay=1&dnt=1`;
  return (
    <article className="pf-film">
      <div className="pf-film-frame">
        {playing ? (
          <iframe src={src} title={embed.title ?? post.title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen />
        ) : (
          <>
            <Photo path={post.image_path} frame={post.presentation?.cover} alt={post.image_alt ?? ''} sizes={SIZES_FULL} />
            <a
              className="pf-play"
              href={postPath(post.slug)}
              aria-label={`Play the film, ${embed.title ?? post.title}`}
              onClick={(e) => {
                e.preventDefault();
                setPlaying(true);
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </a>
          </>
        )}
      </div>
      <div className="pf-film-text">
        <div>
          <PostMarks post={post} />
          <Title post={post} />
          <p className="pf-summary">{post.summary}</p>
        </div>
        <div className="pf-actions">
          <CopyLink post={post} />
        </div>
        {!playing && <p className="pf-film-note">Plays from {embed.provider === 'youtube' ? 'YouTube' : 'Vimeo'}. Nothing loads from it until you press play.</p>}
      </div>
    </article>
  );
}

/** Side by side: photo on one side, words on the other. News, and stories without a gallery. */
export function Spread({ post }: { post: PorchPost }) {
  return (
    <article className="pf-spread" data-has-photo={Boolean(post.image_path)}>
      {post.image_path && <Photo path={post.image_path} frame={post.presentation?.cover} alt={post.image_alt ?? ''} sizes={SIZES_HALF} />}
      <div className="pf-spread-text">
        <PostMarks post={post} />
        <Title post={post} />
        <p className="pf-summary">{post.summary}</p>
        <div className="pf-actions">
          <Link className="pf-btn pf-btn-ghost" to={postPath(post.slug)}>
            Read the {post.kind === 'news' ? 'post' : 'story'}
          </Link>
          <CopyLink post={post} />
        </div>
      </div>
    </article>
  );
}

/** A takeover post breaks out of the board: full width, its scene behind the title. */
export function Breakout({ post }: { post: PorchPost }) {
  const scene = post.presentation.scene;
  return (
    <article className="pf-breakout">
      {scene ? (
        <Backdrop scene={scene} still />
      ) : post.image_path ? (
        <img src={porchImageUrl(post.image_path, 1600) ?? ''} srcSet={porchImageSrcSet(post.image_path)} sizes="100vw" alt="" loading="lazy" style={coverImgStyle(post.presentation.cover)} />
      ) : (
        <Backdrop scene="ridges" still />
      )}
      <div className="pf-breakout-text">
        <PostMarks post={post} />
        <Title post={post} />
        <p className="pf-summary">{post.summary}</p>
      </div>
    </article>
  );
}

// ── Rows ───────────────────────────────────────────────────────

/** A gathering that has happened: a compact row. */
export function HeldRow({ post }: { post: PorchPost }) {
  return (
    <article className="pf-row pf-held">
      <Photo path={post.image_path} frame={post.presentation?.cover} alt="" sizes="120px" className="pf-row-thumb" />
      <div className="pf-row-text">
        <p className="pf-row-meta">
          Held {monthDay(post.event_start!)}
          {post.event_place ? ` · ${post.event_place}` : ''}
        </p>
        <Title post={post} />
      </div>
      <span className="pf-row-go" aria-hidden="true">
        Read <span className="pf-arrow">→</span>
      </span>
    </article>
  );
}

/** Older than about a year: date, title, Read. */
export function EarlierRow({ post }: { post: PorchPost }) {
  return (
    <article className="pf-row pf-earlier">
      <p className="pf-row-meta">{post.published_at ? shortMonthYear(post.published_at) : ''}</p>
      <Title post={post} />
      <span className="pf-row-go" aria-hidden="true">
        Read <span className="pf-arrow">→</span>
      </span>
    </article>
  );
}

// ── A series ───────────────────────────────────────────────────

/** "Week 3" out of "Echoes from the Community, Week 3"; the full title otherwise. */
function partLabel(title: string, series: string) {
  const rest = title.startsWith(series) ? title.slice(series.length).replace(/^[\s,:–—-]+/, '') : '';
  return rest || title;
}

export function SeriesCard({ name, about, posts }: { name: string; about?: string; posts: PorchPost[] }) {
  const first = posts[0].published_at!;
  const last = posts[posts.length - 1].published_at!;
  const span = shortMonthYear(first) === shortMonthYear(last) ? shortMonthYear(first) : `${shortMonthYear(first)} – ${shortMonthYear(last)}`;
  const quote = posts.map((p) => p.hints?.quote).find(Boolean);
  return (
    <article className="pf-series">
      <div className="pf-series-head">
        <p className="pf-series-kicker">
          A series · {posts.length} posts · {span}
        </p>
        <h3 className="pf-title">{name}</h3>
        {quote && (
          <blockquote className="pf-series-quote">
            <p>“{quote.text}”</p>
            {quote.cite && <footer>{quote.cite}</footer>}
          </blockquote>
        )}
        {about && <p className="pf-series-about">{about}</p>}
      </div>
      <ol className="pf-series-list">
        {posts.map((p) => (
          <li key={p.id}>
            <Link to={postPath(p.slug)}>
              <b>{partLabel(p.title, name)}</b>
              <span>{p.summary}</span>
            </Link>
          </li>
        ))}
      </ol>
    </article>
  );
}

/** The shape for a post in a month, or as a non-gathering lead in Coming up. */
export function PostShape({ post }: { post: PorchPost }) {
  switch (shapeOf(post)) {
    case 'takeover':
      return <Breakout post={post} />;
    case 'held':
      return <HeldRow post={post} />;
    case 'ticket':
      return <SmallTicket post={post} />;
    case 'ask':
      return <AskBand post={post} />;
    case 'film':
      return <FilmStory post={post} />;
    case 'photo':
      return <PhotoStory post={post} />;
    default:
      return <Spread post={post} />;
  }
}
