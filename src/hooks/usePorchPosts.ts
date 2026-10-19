import { useEffect, useState } from 'react';
import bakedIndex from '../data/backporch.index.generated.json';
import { fetchPublishedPosts, isListed, normalizePresentation, sortPosts, type PorchPost } from '../lib/backporch';

// Baked at build time without blocks (lists never show them).
const BAKED = (bakedIndex.posts as Omit<PorchPost, 'blocks'>[]).map((p) => ({ ...p, blocks: [], presentation: normalizePresentation((p as { presentation?: unknown }).presentation) })) as PorchPost[];

/**
 * Listed BackPorch posts, pinned first. Renders the baked posts immediately (so
 * prerendered HTML and the first paint match, with no layout shift), then quietly
 * swaps in the live list from Supabase. If the live fetch fails, the baked list stays.
 */
export function usePorchPosts(): PorchPost[] {
  const [posts, setPosts] = useState<PorchPost[]>(() => sortPosts(BAKED.filter((p) => isListed(p))));

  useEffect(() => {
    // Local preview with sample posts (`npm run dev:samples`): keep them, skip the live list.
    if ((bakedIndex as { samples?: boolean }).samples) return;
    let cancelled = false;
    fetchPublishedPosts()
      .then((live) => {
        if (!cancelled) setPosts(sortPosts(live.filter((p) => isListed(p))));
      })
      .catch(() => {
        /* keep the baked list */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return posts;
}
