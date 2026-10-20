// Community Connectors' own brand: the "C" brandmark with its compass star and
// gold dot, and the COMMUNITY / CONNECTORS lockup. The palette matches
// src/pages/communityConnectors.css. Everywhere else on the site that names the
// program (homepage card, /programs, /partners) draws it from here.
// The SVGs are copied from the logo kit in Code/sparkpoint/Branding/CommunityConnectors
// (built 2026-10-20 from the program's Illustrator masters; see its README).
import logoDark from '../assets/commconn/kit/community-connectors-logo-full.svg';
import logoLight from '../assets/commconn/kit/community-connectors-logo-reversed.svg';
import brandmark from '../assets/commconn/kit/community-connectors-brandmark-full.svg';

export const COMMUNITY_CONNECTORS_BRAND = {
  /** Lockup for light grounds (evergreen and teal letters). */
  logoDark,
  /** Lockup for dark grounds (cream and teal letters). */
  logoLight,
  brandmark,
  colors: {
    cream: '#f3ecdf',
    evergreen: '#224a39',
    teal: '#538681',
    olive: '#838444',
    gold: '#e09c2c',
    deep: '#1f2d26',
    ink: '#15231d',
    muted: '#4f5f57',
  },
} as const;
