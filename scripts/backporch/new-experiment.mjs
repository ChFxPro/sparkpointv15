#!/usr/bin/env node
// Start a new BackPorch experiment (a coded, one-of-a-kind post).
//   npm run porch:experiment <id>          e.g.  npm run porch:experiment story-map
// Creates src/experiments/backporch/<id>/ with meta.ts and index.tsx. Build it out,
// open a pull request, and once it's merged pick it in the editor's Experiment block.
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const id = process.argv[2];
if (!id || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
  console.error('Usage: npm run porch:experiment <id>   (lowercase letters, numbers, and dashes, e.g. story-map)');
  process.exit(1);
}
const dir = path.join('src/experiments/backporch', id);
if (existsSync(dir)) {
  console.error(`${dir} already exists.`);
  process.exit(1);
}
const title = id.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
const component = id.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase());

await mkdir(dir, { recursive: true });
await writeFile(
  path.join(dir, 'meta.ts'),
  `import type { ExperimentMeta } from '../registry';

export default {
  title: '${title}',
  description: 'What this is, in one line, for the editor picker.',
  minHeight: '24rem',
} satisfies ExperimentMeta;
`,
);
await writeFile(
  path.join(dir, 'index.tsx'),
  `// ${title}: a BackPorch experiment.
// Rules of the porch:
//  - Keep it self-contained: no new site-wide styles, no tracking, no third-party scripts.
//  - Work with keyboard and screen readers; label every control.
//  - Nothing moves on its own unless the visitor starts it, and respect prefers-reduced-motion.
//  - It sits on the dark BackPorch theme (#1f1b26 background, #f4ecdf text).
export default function ${component}() {
  return (
    <div style={{ padding: '2rem', borderRadius: '1.25rem', background: 'rgba(255,246,232,0.05)' }}>
      <p>${title} goes here.</p>
    </div>
  );
}
`,
);
console.log(`Created ${dir}/meta.ts and index.tsx.\nRun npm run dev and add an Experiment block to a draft post to see it.`);
