// BackPorch experiments: coded, one-of-a-kind posts.
//
// Each experiment is a folder here with two files:
//   meta.ts    export default { title, description, ... } satisfies ExperimentMeta
//   index.tsx  export default function Experiment() { ... }
// They're separate so the editor can list every experiment without loading any
// experiment's code.
// Start one with:  npm run porch:experiment <id>
//
// A post shows an experiment through an Experiment block that names its id. The
// code lives in the repo (not the database) on purpose: anything that runs on
// yoursparkpoint.org could reach a signed-in editor's session, so every experiment
// goes through a pull request and the build before it can run. Each one is its own
// lazy chunk, loaded only on the post that uses it.
import type { ComponentType } from 'react';

export interface ExperimentMeta {
  /** Shown in the editor's picker. */
  title: string;
  /** One line for the editor: what it is and what it needs. */
  description: string;
  /** Optional share image in public/, e.g. '/assets/backporch/experiments/porch-light.jpg'. */
  shareImage?: string;
  /** Rough height so the page doesn't jump while it loads, e.g. '32rem'. */
  minHeight?: string;
}

type ExperimentModule = { default: ComponentType };

const loaders = import.meta.glob<ExperimentModule>('./*/index.tsx');
const metas = import.meta.glob<ExperimentMeta>('./*/meta.ts', { import: 'default', eager: true });

const idOf = (path: string) => path.replace(/^\.\/([^/]+)\/meta\.ts$/, '$1');

/** Every experiment in the repo, for the editor's picker. */
export const EXPERIMENTS: { id: string; meta: ExperimentMeta }[] = Object.entries(metas)
  .map(([path, meta]) => ({ id: idOf(path), meta }))
  .sort((a, b) => a.meta.title.localeCompare(b.meta.title));

export function experimentMeta(id: string): ExperimentMeta | undefined {
  return EXPERIMENTS.find((e) => e.id === id)?.meta;
}

export function experimentLoader(id: string): (() => Promise<ExperimentModule>) | undefined {
  return loaders[`./${id}/index.tsx`];
}
