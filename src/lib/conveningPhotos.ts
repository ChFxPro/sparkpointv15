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

export function conveningPhotoSrcSet(id: string) {
  return `${conveningPhotoUrl(id, 960)} 960w, ${conveningPhotoUrl(id, 1920)} 1920w`;
}

// Matches the catch-all source line on the photo-share page (keep that order).
export const CONVENING_PHOTO_CREDIT = 'Photos by Seyl Park, Afton Lorenz, and Hannah Erickson';
