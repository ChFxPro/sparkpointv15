// One BackPorch post, as the public sees it. Shared by the post page, the editor's
// full preview, and the lab bench, so all three render identically.
//
// Standard posts open with a short strip of the porch view. Takeover posts (Porch
// Lab) break the frame: their first block, a living backdrop or a photo, fills the
// screen with the title over it, and the post's mood recolours the page.
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { clockTime, longDate, PORCH_PATH, porchImageSrcSet, porchImageUrl, type PorchPost } from '../../lib/backporch';
import { blockImages, linkForImage } from '../../lib/porchBlocks';
import { LAB_FEATURES, publicBlocks, STAGE_LABELS } from '../../lib/porchLab';
import { DateChip, PorchImage, PostMarks } from './PorchParts';
import { ContourTerrain, TopoPin, Waymark, WaymarkBack } from './fieldKit';
import { PorchView } from './PorchView';
import { PostBlocks } from './PostBlocks';
import { Backdrop } from './lab/Backdrop';
import { Reactions } from './lab/LabBlocks';

export function PostView({
  post,
  preview = false,
  footer,
}: {
  post: PorchPost;
  /** Editor and lab bench: show lab-stage tools too. */
  preview?: boolean;
  /** Share box and related posts, on the public page. */
  footer?: ReactNode;
}) {
  const live = !preview && post.status === 'published';
  const blocks = publicBlocks(post.blocks, preview);
  const takeover = post.presentation.layout === 'takeover';
  const opener = takeover && (blocks[0]?.type === 'backdrop' || blocks[0]?.type === 'image') ? blocks[0] : null;
  const rest = opener ? blocks.slice(1) : blocks;
  const isGathering = post.kind === 'gathering' && post.event_start;
  const showReactions =
    post.presentation.reactions && (preview || LAB_FEATURES.reactions.stage !== 'lab');
  const coverInBody = blockImages(post.blocks).some((img) => img.path === post.image_path);
  // A cover taken from a link's preview opens that link, and the link's own card
  // below drops its copy of the image so it isn't shown twice.
  const coverLink = linkForImage(post.blocks, post.image_path);

  const header = (
    <>
      <PostMarks post={post} />
      <h1>{post.title}</h1>
      <p className="porch-article-lede">{post.summary}</p>
    </>
  );

  return (
    <div
      className="porch porch-page porch-article-wrap porch-dusk"
      data-mood={post.presentation.mood ?? 'dusk'}
      data-takeover={takeover}
    >
      {opener ? (
        <header className="porch-opener">
          {opener.type === 'backdrop' ? (
            <Backdrop scene={opener.scene} tall />
          ) : (
            <img
              className="porch-opener-img"
              src={porchImageUrl(opener.path, 1600) ?? ''}
              srcSet={porchImageSrcSet(opener.path)}
              sizes="100vw"
              alt={opener.alt}
            />
          )}
          <div className="porch-opener-text">
            <Link className="porch-back" to={PORCH_PATH}>
              <WaymarkBack size={18} /> The BackPorch
            </Link>
            {header}
          </div>
          <span className="pb-stage" data-stage={LAB_FEATURES.takeover.stage}>
            {STAGE_LABELS[LAB_FEATURES.takeover.stage]}
          </span>
        </header>
      ) : (
        <figure className="porch-post-view">
          <PorchView variant="band" />
          <figcaption>Illustrative image</figcaption>
        </figure>
      )}
      <ContourTerrain />

      <article className="porch-article" data-has-opener={Boolean(opener)}>
        {!opener && (
          <>
            <Link className="porch-back" to={PORCH_PATH}>
              <WaymarkBack size={18} /> The BackPorch
            </Link>
            {header}
          </>
        )}

        {isGathering && (
          <div className="porch-when">
            <DateChip iso={post.event_start!} />
            <div>
              <p>
                {longDate(post.event_start!)}, {clockTime(post.event_start!)}
                {post.event_end && ` to ${clockTime(post.event_end)}`}
              </p>
              {post.event_place && (
                <p>
                  <TopoPin size={16} /> {post.event_place}
                </p>
              )}
            </div>
          </div>
        )}

        {/* The cover leads unless the body already has that photo, or a takeover opened the post. */}
        {post.image_path && !coverInBody && !opener && (coverLink ? (
          <a className="porch-cover-link" href={coverLink.url} rel="noopener">
            <PorchImage post={post} sizes="(min-width: 720px) 704px, 100vw" width={1600} eager />
            <span className="porch-cover-link-tag">
              {coverLink.preview?.site ?? new URL(coverLink.url).hostname.replace(/^www\./, '')} <Waymark size={14} />
            </span>
          </a>
        ) : (
          <PorchImage post={post} sizes="(min-width: 720px) 704px, 100vw" width={1600} eager />
        ))}

        <PostBlocks
          blocks={rest}
          postId={post.id}
          live={live}
          preview={preview}
          omitLinkImage={coverLink && !opener ? coverLink.id : undefined}
        />

        {post.link_url && (
          <a className="porch-sign" href={post.link_url} rel="noopener">
            {post.link_label || 'Learn more'} <Waymark size={18} />
          </a>
        )}

        {showReactions && <Reactions postId={post.id} live={live} />}

        {footer}
      </article>
    </div>
  );
}
