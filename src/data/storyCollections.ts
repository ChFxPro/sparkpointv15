import ruralHealthcareFlyer from '../assets/story-collections/rural-healthcare-flyer.webp';
import ruralHealthcareQr from '../assets/story-collections/rural-healthcare-qr.svg';
import heleneImage from '../assets/compd/0835779aef52124bf5c00840473e8285f8e0f937.webp';

// import.meta.env is only defined in a Vite (browser) context, not in the Node/esbuild
// context scripts/prerender.mjs uses to import this file — so resolve it lazily, at call
// time, rather than as a module-level constant (see also src/data/pressReleases.ts).
export function storyCollectionDownloadUrl(filename: string) {
  return `${import.meta.env.BASE_URL}downloads/story-collections/${filename}`;
}

export interface SocialCopyBlock {
  platform: string;
  text: string;
}

export type StoryCollectionStatus = 'active' | 'closed';

export interface StoryCollection {
  id: string; // slug used at /stories/collections/:id
  title: string;
  status: StoryCollectionStatus;
  statusLabel: string;
  tagline: string;
  summary: string; // short teaser for hub/section cards
  promoLine?: string; // one-liner for compact placements (e.g. homepage strip)
  description: string; // longer paragraph for the detail page
  incentive?: string;
  privacyNote?: string;
  formPath?: string; // vanity path on this site, e.g. '/healthcare-story' — only for active collections
  formUrlAbsolute?: string; // full https URL — used in QR/social copy
  resultsPath?: string; // where a closed collection's stories now live
  resultsLabel?: string;
  image: string;
  imageAlt: string;
  flyerImage?: string;
  flyerImageAlt?: string;
  flyerDownloadFile?: string; // filename under public/downloads/story-collections — pass to storyCollectionDownloadUrl()
  qrImage?: string;
  qrDownloadFile?: string; // filename under public/downloads/story-collections — pass to storyCollectionDownloadUrl()
  socialCopy?: SocialCopyBlock[];
  seoTitle?: string;
  seoDescription?: string;
}

// Adding a new active collection? Also add its QR target to
// scripts/generate-story-collection-qr.mjs and run it once.
export const STORY_COLLECTIONS: StoryCollection[] = [
  {
    id: 'rural-healthcare',
    title: 'Rural Health Care Stories',
    status: 'active',
    statusLabel: 'Now collecting',
    tagline: 'Everyone has a healthcare story.',
    summary:
      "Help SparkPoint understand the realities of accessing care in Transylvania County — share your experience for a chance to win a $100 gift card.",
    promoLine: 'Share your healthcare story for a chance to win a $100 gift card.',
    description:
      "Every view has a story behind it. SparkPoint is collecting real experiences of accessing health care across Transylvania County — the wins, the barriers, and everything in between. Your story helps us identify what's working, what's not, and where connection and support are needed most.",
    incentive: 'Every response is entered for a chance to win a $100 gift card.',
    privacyNote:
      'Your responses are anonymous and combined with others to help identify barriers, highlight what works, and strengthen care, connection, and support across our community.',
    formPath: '/healthcare-story',
    formUrlAbsolute: 'https://yoursparkpoint.org/healthcare-story',
    image: ruralHealthcareFlyer,
    imageAlt:
      'SparkPoint flyer over a Blue Ridge Mountains sunset: "Every view has a story behind it — everyone has a healthcare story."',
    flyerImage: ruralHealthcareFlyer,
    flyerImageAlt:
      'SparkPoint Rural Health Care Stories flyer with a QR code and link to yoursparkpoint.org/healthcare-story.',
    flyerDownloadFile: 'SparkPoint-Rural-Healthcare-Story-Flyer.jpg',
    qrImage: ruralHealthcareQr,
    qrDownloadFile: 'SparkPoint-Rural-Healthcare-Story-QR.png',
    socialCopy: [
      {
        platform: 'Facebook & Instagram',
        text: "Everyone has a healthcare story. SparkPoint wants to hear yours — share your experience accessing care in Transylvania County and you'll be entered for a chance to win a $100 gift card. It only takes a few minutes, and your voice helps us understand what's working and what's not.\n\nShare your story: https://yoursparkpoint.org/healthcare-story\n\n#YourSparkPoint #RuralHealth #TransylvaniaCounty",
      },
      {
        platform: 'X / Threads',
        text: 'Every view has a story behind it. Share your rural health care experience with SparkPoint for a chance to win a $100 gift card → https://yoursparkpoint.org/healthcare-story',
      },
      {
        platform: 'Email & newsletter',
        text: "Subject: Share your healthcare story\n\nEveryone has a healthcare story — and we want to hear yours. SparkPoint is collecting real experiences of accessing health care across Transylvania County to help us understand the realities our neighbors face. Responses are anonymous and combined with others to help identify barriers and strengthen care.\n\nAs a thank-you, every response is entered for a chance to win a $100 gift card.\n\nShare your story: https://yoursparkpoint.org/healthcare-story",
      },
      {
        platform: 'Text / direct message',
        text: "Hi! SparkPoint is collecting healthcare stories from folks across Transylvania County and I thought of you. It's anonymous, takes a few minutes, and you're entered to win a $100 gift card: https://yoursparkpoint.org/healthcare-story",
      },
    ],
    seoTitle: 'Rural Health Care Stories | SparkPoint Story Collection',
    seoDescription:
      'Share your experience accessing health care in Transylvania County. SparkPoint is collecting rural health care stories to identify barriers and strengthen support — anonymous, a few minutes, chance to win a $100 gift card.',
  },
  {
    id: 'helene-recovery',
    title: 'Helene: One Year of Healing',
    status: 'closed',
    statusLabel: 'Collection closed — stories published',
    tagline: 'Recovery, told by the people who lived it.',
    summary:
      'Over 140 residents across Transylvania County shared what the year after Hurricane Helene was like. That listening became a tribute film and the Community Connectors initiative.',
    description:
      'In the year following Hurricane Helene, SparkPoint set out to listen. Our team interviewed more than 140 residents, volunteers, partners, and community leaders across Transylvania County, asking a simple question: what has this year been like for you? Those conversations became "Helene: One Year of Healing" and helped launch Community Connectors.',
    resultsPath: '/stories/disaster-recovery/helene-one-year',
    resultsLabel: 'Watch Helene: One Year of Healing',
    image: heleneImage,
    imageAlt: 'Community members gathered for the Helene: One Year of Healing tribute film.',
  },
];

export function getStoryCollection(id: string | undefined) {
  return STORY_COLLECTIONS.find((c) => c.id === id);
}

export const ACTIVE_STORY_COLLECTIONS = STORY_COLLECTIONS.filter((c) => c.status === 'active');
