export interface Program {
  title: string;
  summary: string;
  audiences: string[];
  pathway: "listen" | "learn" | "lead";
}

export interface Pathway {
  id: "listen" | "learn" | "lead";
  label: string;
  color: string;
  colorLight: string;
  description: string;
  programs: Program[];
}

const listenPrograms: Program[] = [
  {
    title: "Echoes Articles",
    summary: "Published reflections that amplify community voices and spark meaningful dialogue.",
    audiences: ["Community", "Educators"],
    pathway: "listen",
  },
  {
    title: "Story Collection",
    summary: "Gathering lived experiences from individuals and communities to inform programs.",
    audiences: ["Community", "Partners"],
    pathway: "listen",
  },
  {
    title: "Story Lab Studios",
    summary: "Creative spaces where participants shape and share their own narratives.",
    audiences: ["Youth", "Community"],
    pathway: "listen",
  },
  {
    title: "Thrive @ 5",
    summary: "Brief, accessible conversations designed to check in and nurture well-being.",
    audiences: ["Individuals"],
    pathway: "listen",
  },
];

const learnPrograms: Program[] = [
  {
    title: "Community Learning & Emotional Recovery",
    summary: "Workshops that equip communities to process, recover, and grow after hardship.",
    audiences: ["Community", "Organizations"],
    pathway: "learn",
  },
  {
    title: "Integrative Connection",
    summary: "Experiences weaving mindfulness, relationship skills, and holistic well-being.",
    audiences: ["Individuals", "Teams"],
    pathway: "learn",
  },
  {
    title: "Leadership Well-Being",
    summary: "Sustaining leader health while guiding others with clarity and compassion.",
    audiences: ["Leaders"],
    pathway: "learn",
  },
  {
    title: "Purpose",
    summary: "Guided exploration reconnecting participants with meaning and personal direction.",
    audiences: ["Individuals", "Youth"],
    pathway: "learn",
  },
  {
    title: "SupportEd",
    summary: "Practical tools for educators navigating emotional complexity in learning spaces.",
    audiences: ["Educators"],
    pathway: "learn",
  },
  {
    title: "Youth Leadership",
    summary: "Building confidence, voice, and leadership capacity in young people.",
    audiences: ["Youth"],
    pathway: "learn",
  },
];

const leadPrograms: Program[] = [
  {
    title: "Voice of the Students",
    summary: "Amplifying student perspectives to shape policy, practice, and school culture.",
    audiences: ["Youth", "Schools"],
    pathway: "lead",
  },
  {
    title: "Spiritual & Emotional Healing",
    summary: "A collaborative healing initiative with FWRD Transylvania - rooted in spiritual connection and resilience.",
    audiences: ["Community"],
    pathway: "lead",
  },
  {
    title: "Non-Profit Support",
    summary: "Capacity-building and strategic guidance for mission-driven organizations.",
    audiences: ["Organizations"],
    pathway: "lead",
  },
  {
    title: "Community Connectors Program",
    summary: "Training trusted community members to bridge neighbors, resources, and systems.",
    audiences: ["Community", "Leaders"],
    pathway: "lead",
  },
  {
    title: "Wellness Rooted in Connection / TRCN",
    summary: "Embedding transformational resilience into community wellness efforts.",
    audiences: ["Community", "Partners"],
    pathway: "lead",
  },
  {
    title: "Education Support",
    summary: "Partnering with schools to strengthen connection-centered educational environments.",
    audiences: ["Educators", "Schools"],
    pathway: "lead",
  },
  {
    title: "Connected Leadership",
    summary: "A facilitated experience deepening connection, presence, and impact for leaders.",
    audiences: ["Leaders", "Organizations"],
    pathway: "lead",
  },
  {
    title: "General Facilitation",
    summary: "Custom facilitation supporting teams through dialogue and shared decision-making.",
    audiences: ["Organizations", "Teams"],
    pathway: "lead",
  },
];

export const pathways: Pathway[] = [
  {
    id: "listen",
    label: "Listen",
    color: "#9E509F",
    colorLight: "rgba(158, 80, 159, 0.08)",
    description: "Programs that create space to hear lived experience, surface community needs, and strengthen shared understanding.",
    programs: listenPrograms,
  },
  {
    id: "learn",
    label: "Learn",
    color: "#FDB515",
    colorLight: "rgba(253, 181, 21, 0.08)",
    description: "Workshops and experiences that build resilience, insight, and practical tools for individuals and communities.",
    programs: learnPrograms,
  },
  {
    id: "lead",
    label: "Lead",
    color: "#E03694",
    colorLight: "rgba(224, 54, 148, 0.08)",
    description: "Collaborative efforts that align partners, elevate voice, and guide action toward lasting change.",
    programs: leadPrograms,
  },
];

export const allPrograms: Program[] = [
  ...listenPrograms,
  ...learnPrograms,
  ...leadPrograms,
];

export const audienceFilters = [
  "Youth",
  "Community",
  "Educators",
  "Leaders",
  "Organizations",
  "Individuals",
];
