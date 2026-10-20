# Partner logos

Logos for the homepage partner strip. Drop a file in this folder and it appears
on the homepage automatically — no code change.

## Naming

Name the file after the partner exactly as it is written in
`src/data/partners.ts`: lowercase, with every run of spaces and punctuation
turned into one hyphen (`&` is dropped).

| Partner in partners.ts | File name |
| --- | --- |
| The Sharing House | `the-sharing-house.png` |
| Boys & Girls Club of Transylvania County | `boys-girls-club-of-transylvania-county.svg` |
| St. Philips Episcopal Church | `st-philips-episcopal-church.webp` |

`npm run logos:list` prints every partner with its expected file name and
whether a logo is here yet, and flags any file whose name matches no partner.

## Formats

SVG is best. Otherwise PNG or WebP with a transparent background, at least
about 400px wide. Trim empty space around the mark.

## Logos with white in them

The strip sits on white, so white parts of a logo disappear.

- **The whole logo is white** (a white wordmark made for dark backgrounds):
  add `-ink` to the name, e.g. `brevard-college-ink.svg`. The site draws the
  logo's shape in near-black (#2a2a2a).
- **Only the text or some elements are white** (the rest is in colour):
  recolour just the white parts, then check the result:

  ```
  npm run logos:ink-white -- path/to/logo.png                  # white -> near-black grey
  npm run logos:ink-white -- path/to/logo.png --primary        # white -> the logo's own main colour
  npm run logos:ink-white -- path/to/logo.png --color '#1f3a5f'
  ```

  It writes a PNG here named after the input file (rename it to the
  partner's file name if needed). Don't run it on logos whose white is meant
  to stay white inside a coloured shape (a waterfall in a badge, stripes on a
  shield) — those already read fine on white.

Best of all is the partner's own full-colour or dark version.

## Which partners count as regional/national

The strip keeps a mix of regional, state, or national organizations and local
ones. The regional list is `WIDE` in `src/components/home/HomePartners.tsx`;
everyone else counts as local.
