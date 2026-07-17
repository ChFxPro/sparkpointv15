# SparkPoint Press Portal

The press portal is a reusable, single-source publishing system for official SparkPoint releases.

## Routes

- `/press` is the permanent press portal and release archive.
- `/press/:slug` renders an individual release from the shared content source.
- `/news-media` includes releases where `showOnMediaPage` is `true`.

## Canonical content source

All release copy, metadata, media captions, contact information, event details, related links, and partnership history live in `src/data/pressReleases.json`. Do not duplicate a release in a page component.

`src/data/pressReleases.ts` validates required fields, sorts releases by date, filters the media-page feed, resolves press images, and exposes helpers used by the portal and detail route.

## Publishing a future release

1. Add the release images beneath `src/assets/press/<release-folder>/`.
2. Add one release entry to `src/data/pressReleases.json`.
3. Supply accurate captions, alt text, credits when known, and any required usage notes.
4. Point `heroImageId` and, if used, `socialImageId` to image IDs in the same entry.
5. Set `featured` and `showOnMediaPage` as appropriate.
6. Run `npm run build` and deploy.

The image loader discovers common web image formats beneath `src/assets/press` automatically. No image import list needs maintenance.

The build runs `scripts/generate-press-media-kits.js`, which reads the same JSON entry, updates the marked press-release section of `public/sitemap.xml`, and creates the release ZIP under `public/downloads/press/` before Vite copies public files into the production build. Generated download files are ignored by Git because they are reproducible.

## Media kit contents

Each configured media kit contains:

- `START-HERE.txt`
- HTML, plain-text, and Markdown release files
- unchanged copies of the supplied source images
- captions, alt text, credits, and usage notes
- SparkPoint boilerplate
- partnership history
- media contact information

The generator uses only Node built-ins and writes a standard compressed ZIP. No third-party packaging dependency is required.

## Validation and content rules

Builds fail when a release is missing its title, slug, publication date, summary, hero image, body, or configured media-contact identity. Builds also fail for duplicate slugs, missing hero image IDs, or unresolved image paths.

Do not invent photographer credits, contact details, RSVP URLs, quotes, or usage permissions. If a conceptual rendering is added, keep its disclaimer in that asset’s `usageNote` and set `conceptualRendering` to `true`.
