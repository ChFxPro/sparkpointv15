// The Porch Lab: experimental BackPorch tools and where each one stands.
//
//   lab       still being shaped. Editors can add it, preview it, and try it on the
//             lab bench (/internal/lab); the public site never shows it.
//   field     field test. Shows on published posts; its "Field test" tag shows only to editors,
//             so we learn from real readers.
//   released  done. Listed with the regular blocks, no tag.
//
// Promoting a tool is changing its stage here. Retiring one is safe too: posts that
// used it keep rendering through each tool's plain fallback (see the feeds in
// scripts/backporch/bake.mjs and PostBlocks).
//
// Before a tool moves to "released" it must pass the checklist below.
import type { BlockType, PorchBlock } from './porchBlocks';

export type LabStage = 'lab' | 'field' | 'released';

export interface LabTool {
  type: BlockType;
  stage: LabStage;
  group: 'Motion' | 'Storytelling' | 'Participation';
  pitch: string;
  /** What's left before it can be released. */
  notes: string;
}

export const RELEASE_CHECKLIST = [
  'Works on a phone, in portrait and landscape',
  'Works with a keyboard and a screen reader',
  'Nothing moves on its own without a pause, and it respects reduced motion',
  'No tracking and no third-party requests',
  'Falls back to something sensible in RSS and the Facebook kit',
  'Tried on at least two published posts',
];

export const LAB_TOOLS: LabTool[] = [
  {
    type: 'motionText',
    stage: 'field',
    group: 'Motion',
    pitch: 'A line that types itself, or words that light up as you scroll past.',
    notes: 'Check long lines on small phones.',
  },
  {
    type: 'backdrop',
    stage: 'field',
    group: 'Motion',
    pitch: 'A living scene behind a heading: a sunrise, fireflies, or drifting ridges. Pausable; still under reduced motion.',
    notes: 'Watch battery use on older phones.',
  },
  {
    type: 'counter',
    stage: 'field',
    group: 'Motion',
    pitch: 'Up to four numbers that count up as they come into view.',
    notes: 'Numbers must be sourced; add the source in the text around it.',
  },
  {
    type: 'beforeAfter',
    stage: 'field',
    group: 'Storytelling',
    pitch: 'Drag between two photos of the same place: a build day, a recovery, a season.',
    notes: 'Both photos should be framed the same way.',
  },
  {
    type: 'scrolly',
    stage: 'field',
    group: 'Storytelling',
    pitch: 'A photo that stays put while the story scrolls beside it, changing picture with each step.',
    notes: 'Best with 3 to 6 steps. Check on phones.',
  },
  {
    type: 'timeline',
    stage: 'field',
    group: 'Storytelling',
    pitch: 'Dated moments along a line: a year of a program, a recovery, a history.',
    notes: '',
  },
  {
    type: 'poll',
    stage: 'lab',
    group: 'Participation',
    pitch: 'An anonymous quick poll. One vote per browser; results show after voting.',
    notes: 'Needs the database live to test voting and spam limits. Informal only: not a survey.',
  },
];

/** Post-level lab features (not blocks). */
export const LAB_FEATURES = {
  reactions: {
    stage: 'lab' as LabStage,
    name: 'Porch reactions',
    pitch: 'A few warm reactions under a post instead of likes: "Pulled up a chair", "Lit a lantern", "Waved hello", "Thank you".',
    notes: 'Needs the database live to test counts and spam limits.',
  },
  takeover: {
    stage: 'field' as LabStage,
    name: 'Takeover post',
    pitch: 'The post breaks the frame: its first block fills the screen with the title over it, the page shifts to the post’s mood, and in the feed it breaks out of the list.',
    notes: 'Pick an opening block that works full screen: a backdrop, photo, or scrolly story.',
  },
};

export function labTool(type: BlockType): LabTool | undefined {
  return LAB_TOOLS.find((t) => t.type === type);
}

/** Stage of a block's type; regular blocks are released. */
export function stageOf(type: BlockType): LabStage {
  return labTool(type)?.stage ?? 'released';
}

/** Blocks the public may see: lab-stage tools are editor-only. */
export function publicBlocks(blocks: PorchBlock[], preview = false): PorchBlock[] {
  return preview ? blocks : blocks.filter((b) => stageOf(b.type) !== 'lab');
}

export const STAGE_LABELS: Record<LabStage, string> = {
  lab: 'Lab',
  field: 'Field test',
  released: 'Released',
};
