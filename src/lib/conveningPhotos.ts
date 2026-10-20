import { projectId } from '../utils/supabase/info';

// Photos from the October 1, 2026 WNC Regional Rural Health Convening live in the
// public-read Supabase Storage bucket `convening-photos` (see AGENTS.md and
// src/data/ruralHealthPhotoShare.json). Every photo has 960px and 1920px WebP
// renditions named `rhp-<id>-<size>.webp`.
export const CONVENING_PHOTO_ORIGIN = `https://${projectId}.supabase.co`;
const PHOTO_BASE = `${CONVENING_PHOTO_ORIGIN}/storage/v1/object/public/convening-photos/rural-health-2026`;

export type ConveningPhotoSize = 960 | 1920;

export function conveningPhotoUrl(id: string, size: ConveningPhotoSize = 960) {
  return `${PHOTO_BASE}/rhp-${id}-${size}.webp`;
}

// Small tiles (the homepage photo wall) use Supabase's on-the-fly resizing rather
// than a third stored rendition: ~38 KB at 320px against ~95 KB for the 960.
const RENDER_BASE = `${CONVENING_PHOTO_ORIGIN}/storage/v1/render/image/public/convening-photos/rural-health-2026`;
export function conveningPhotoThumbSrcSet(id: string) {
  return [320, 480, 640].map((w) => `${RENDER_BASE}/rhp-${id}-960.webp?width=${w}&quality=70 ${w}w`).join(', ');
}

export function conveningPhotoSrcSet(id: string) {
  return `${conveningPhotoUrl(id, 960)} 960w, ${conveningPhotoUrl(id, 1920)} 1920w`;
}

// Matches the catch-all source line on the photo-share page (keep that order).
export const CONVENING_PHOTO_CREDIT = 'Photos by Seyl Park, Afton Lorenz, and Hannah Erickson';
