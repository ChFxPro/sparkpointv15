// Partner logos live in src/assets/partner-logos/ (used by the homepage wall and /partners),, one file
// per partner, named after the partner's name in src/data/partners.ts
// (lowercase, words joined by hyphens: "The Sharing House" -> the-sharing-house.png).
// A file ending in `-ink` (brevard-college-ink.svg) is an all-white logo: the
// site draws its shape in near-black. `npm run logos:list` shows every partner's
// expected file name and which are still missing. See the folder's README.
export type PartnerLogo = { src: string; ink: boolean };

export const partnerLogoSlug = (name: string) =>
  name.toLowerCase().replace(/&/g, ' ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const files = import.meta.glob('../assets/partner-logos/*.{svg,png,webp,jpg,jpeg}', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const LOGOS_BY_SLUG: Record<string, PartnerLogo> = {};
for (const [file, src] of Object.entries(files)) {
  const base = file.split('/').pop()!.replace(/\.[^.]+$/, '');
  const ink = base.endsWith('-ink');
  LOGOS_BY_SLUG[ink ? base.slice(0, -4) : base] = { src, ink };
}

export function partnerLogo(name: string): PartnerLogo | undefined {
  return LOGOS_BY_SLUG[partnerLogoSlug(name)];
}
