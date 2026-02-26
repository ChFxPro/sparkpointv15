export type PathwayId = "listen" | "learn" | "lead";

export type ProgramFormatType =
  | "workshop"
  | "series"
  | "cohort"
  | "event"
  | "ongoing"
  | "project"
  | "collaborative";

export type OfferingType = "community" | "partner" | "fee-based";

export interface ProgramFormat {
  type: ProgramFormatType;
  cadence?: string;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  pathway: PathwayId;
  tagline: string;
  overview: string;
  whyItExists?: string;
  whoItsFor: string[];
  whatYoullExperience: string[];
  outcomes: string[];
  idealPartners: string[];
  format: ProgramFormat;
  offeringType: OfferingType;
  tags: string[];
  contactCTA: {
    label: string;
    href: string;
  };
}

export interface Pathway {
  id: PathwayId;
  label: "Listen" | "Learn" | "Lead";
  color: string;
  colorLight: string;
  description: string;
  programs: Program[];
}

const defaultContactCTA = {
  label: "Talk with us about this program",
  href: "/intake?intent=contact",
};

function createProgram(program: Omit<Program, "slug">): Program {
  return {
    ...program,
    slug: program.id,
  };
}

const listenPrograms: Program[] = [
  createProgram({
    id: "echoes-from-the-community",
    title: "Echoes from the Community",
    pathway: "listen",
    tagline: "Bi-weekly storytelling column amplifying local voices and shared insight.",
    overview:
      "A recurring column in print and online that shares themes emerging from community conversations, youth storytelling, and listening projects. Each release translates local voice into clear public insight.",
    whyItExists:
      "Communities need their lived experience reflected back in ways that reduce stigma and surface shared patterns.",
    whoItsFor: ["Community members", "Partners", "Educators", "Residents"],
    whatYoullExperience: [
      "Story highlights grounded in local experience",
      "Thematic summaries that connect patterns across voices",
      "Public reflection prompts that invite continued conversation",
    ],
    outcomes: [
      "Increased awareness of local needs and strengths",
      "Reduced stigma around emotional and social health",
      "Shared understanding that informs next-step action",
    ],
    idealPartners: [
      "Local media outlets",
      "Schools and youth storytelling groups",
      "Community organizations gathering resident insight",
    ],
    format: {
      type: "ongoing",
      cadence: "Bi-weekly column",
    },
    offeringType: "community",
    tags: ["Community", "Residents", "Educators", "Partners"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "story-collection-projects",
    title: "Story Collection Projects",
    pathway: "listen",
    tagline: "Community listening projects that guide real decisions.",
    overview:
      "Targeted listening initiatives gather stories around issues shaping local well-being, including youth mental health, food access, and recovery. Findings are synthesized into practical guidance for program and funding decisions.",
    whyItExists:
      "Programs and funding should be guided by lived experience, not assumptions.",
    whoItsFor: ["Community residents", "Youth", "Program teams", "Funders"],
    whatYoullExperience: [
      "One-on-one interviews with community members",
      "Facilitated group conversations",
      "Youth-led story prompts and documentation",
    ],
    outcomes: [
      "Clear summary reports",
      "Strengths and needs mapping",
      "Actionable recommendations for partners and funders",
    ],
    idealPartners: [
      "Public agencies",
      "Schools and youth-serving organizations",
      "Foundations and community collaboratives",
    ],
    format: {
      type: "project",
      cadence: "Topic-based project cycles",
    },
    offeringType: "partner",
    tags: ["Community", "Youth", "Organizations", "Partners"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "story-lab-studios",
    title: "Story Lab Studios (Media Navigator Mentorships)",
    pathway: "listen",
    tagline: "Ethical storytelling studio for youth and community.",
    overview:
      "A hands-on media mentorship studio where participants learn interviewing practice, story ethics, and production skills. The studio supports youth and community members in sharing stories with care and accuracy.",
    whyItExists:
      "Communities need storytelling spaces that protect dignity while developing local media leadership.",
    whoItsFor: ["Youth storytellers", "Community creatives", "Emerging peer leaders"],
    whatYoullExperience: [
      "Interview skill building and listening practice",
      "Story editing and ethical review",
      "Public sharing opportunities with guided facilitation",
    ],
    outcomes: [
      "Youth leadership growth",
      "Amplified local voices",
      "Stronger belonging through shared narrative",
    ],
    idealPartners: [
      "Schools and after-school programs",
      "Community media partners",
      "Youth development organizations",
    ],
    format: {
      type: "cohort",
      cadence: "Seasonal studio cohorts",
    },
    offeringType: "partner",
    tags: ["Youth", "Community", "Educators", "Partners"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "thrive-at-5",
    title: "Thrive @ 5",
    pathway: "listen",
    tagline: "Monthly gatherings that connect neighbors.",
    overview:
      "Community meetups across the county create space for relationship-building and shared reflection. Each gathering captures real-time community insight while strengthening neighborhood ties.",
    whyItExists:
      "Regular, low-barrier gathering spaces are essential for trust, connection, and shared problem solving.",
    whoItsFor: ["Residents", "Community members", "Neighbors", "Local volunteers"],
    whatYoullExperience: [
      "Facilitated conversation circles",
      "Informal connection across neighborhoods",
      "Lightweight insight capture for future programming",
    ],
    outcomes: [
      "Stronger neighborhood relationships",
      "Shared themes surfaced across communities",
      "Clearer understanding of local priorities",
    ],
    idealPartners: [
      "Libraries and community centers",
      "Faith and civic groups",
      "Neighborhood associations",
    ],
    format: {
      type: "event",
      cadence: "Monthly",
    },
    offeringType: "community",
    tags: ["Community", "Residents", "Volunteers"],
    contactCTA: defaultContactCTA,
  }),
];

const learnPrograms: Program[] = [
  createProgram({
    id: "social-health-101",
    title: "Social Health 101: The Science of Connection",
    pathway: "learn",
    tagline: "Foundational workshop on how relationships shape health and healing.",
    overview:
      "A practical introductory workshop that connects social relationships to physical and mental health outcomes. Participants leave with concrete tools for building supportive networks.",
    whyItExists:
      "Connection is a core health factor, but many people have never been taught the science behind it.",
    whoItsFor: ["Community members", "Caregivers", "Educators", "Workplace teams"],
    whatYoullExperience: [
      "Accessible neuroscience of social connection",
      "Hands-on tools for strengthening support systems",
      "Guided reflection on everyday relational habits",
    ],
    outcomes: [
      "Increased relational awareness",
      "Practical support-building tools",
      "Improved confidence in helping others stay connected",
    ],
    idealPartners: ["Schools", "Community hubs", "Employer wellness teams"],
    format: {
      type: "workshop",
      cadence: "Single-session offering",
    },
    offeringType: "community",
    tags: ["Community", "Educators", "Organizations", "Leaders"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "integrative-well-being-food-mood-movement",
    title: "Integrative Well-Being: Food, Mood & Movement",
    pathway: "learn",
    tagline: "Interactive learning on the daily foundations of emotional well-being.",
    overview:
      "This workshop links nutrition, movement, rest, and emotional health through practical exercises. Participants test low-lift practices they can use immediately in home, school, or workplace settings.",
    whyItExists:
      "Well-being improves when people understand how daily habits interact instead of treating health in silos.",
    whoItsFor: ["Individuals", "Families", "Community groups", "Staff teams"],
    whatYoullExperience: [
      "Shared activities and guided practice",
      "Reflection on current routines",
      "Take-home tools for sustainable habit shifts",
    ],
    outcomes: [
      "Energy and regulation tools",
      "Holistic awareness of mind-body connection",
      "Clear next steps for personal and group well-being",
    ],
    idealPartners: ["Community centers", "Schools", "Workplace wellness programs"],
    format: {
      type: "workshop",
      cadence: "Single-session or paired sessions",
    },
    offeringType: "community",
    tags: ["Community", "Individuals", "Youth", "Organizations"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "brain-stress-resilience",
    title: "Brain, Stress & Resilience",
    pathway: "learn",
    tagline: "Science-based stress education with practical regulation tools.",
    overview:
      "A workshop that explains stress response systems and how connection buffers overload. Participants practice breathing, reframing, and regulation techniques they can use in high-pressure moments.",
    whyItExists:
      "People need clear, evidence-informed ways to understand stress and build resilience in real time.",
    whoItsFor: ["Community members", "Educators", "Leaders", "Care teams"],
    whatYoullExperience: [
      "Stress physiology explained in plain language",
      "Guided breathing and grounding tools",
      "Cognitive reframing practice for stressful scenarios",
    ],
    outcomes: [
      "Improved regulation skills",
      "Increased resilience under pressure",
      "Greater confidence supporting others during stress",
    ],
    idealPartners: ["Schools", "Nonprofits", "Public service teams"],
    format: {
      type: "workshop",
      cadence: "Single-session offering",
    },
    offeringType: "partner",
    tags: ["Community", "Educators", "Leaders", "Organizations"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "positive-culture-belonging",
    title: "Positive Culture & Belonging",
    pathway: "learn",
    tagline: "Experiential workshop for trust, play, and relational culture.",
    overview:
      "An interactive session using play-based and reflective practices to build trust and belonging in groups. Designed for teams that want stronger everyday connection, not just one-time inspiration.",
    whyItExists:
      "Belonging and team culture are built through shared experience, not policy language alone.",
    whoItsFor: ["Educators", "Leaders", "Staff teams", "Community facilitators"],
    whatYoullExperience: [
      "Structured interaction and play",
      "Relational trust-building exercises",
      "Facilitated debrief for culture translation",
    ],
    outcomes: [
      "Increased interpersonal connection",
      "Strengthened team culture",
      "Shared language for belonging practices",
    ],
    idealPartners: ["Schools", "Employer teams", "Community coalitions"],
    format: {
      type: "workshop",
      cadence: "Single-session or mini-series",
    },
    offeringType: "partner",
    tags: ["Educators", "Leaders", "Organizations", "Community"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "learn-connect-nights",
    title: "Learn & Connect Nights",
    pathway: "learn",
    tagline: "Evening gatherings that blend practical learning with community reflection.",
    overview:
      "Recurring evening sessions combine short learning modules with facilitated dialogue. The format supports cross-community learning while keeping relationship-building at the center.",
    whyItExists:
      "People need learning spaces that are relational, accessible, and rooted in local context.",
    whoItsFor: ["Residents", "Families", "Volunteers", "Community partners"],
    whatYoullExperience: [
      "Short practical learning segments",
      "Facilitated community reflection",
      "Connection activities across diverse participants",
    ],
    outcomes: [
      "Shared local learning culture",
      "Increased peer support",
      "Clear ideas for community-led next steps",
    ],
    idealPartners: ["Libraries", "Civic groups", "Neighborhood hosts"],
    format: {
      type: "event",
      cadence: "Evening series",
    },
    offeringType: "community",
    tags: ["Community", "Residents", "Volunteers", "Partners"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "supported",
    title: "SupportEd",
    pathway: "learn",
    tagline: "Professional learning and wellness support for educators.",
    overview:
      "SupportEd provides educator-centered learning focused on emotional health, relational practice, and sustainable classroom leadership. Sessions are designed for real school conditions and implementation.",
    whyItExists:
      "Educator burnout and isolation directly affect both staff well-being and student experience.",
    whoItsFor: ["Teachers", "School staff", "Administrators", "Instructional teams"],
    whatYoullExperience: [
      "Professional learning tailored to school settings",
      "Wellness practices for daily classroom pressure",
      "Team reflection on culture and support systems",
    ],
    outcomes: [
      "Reduced burnout risk",
      "Stronger classroom and staff culture",
      "More consistent relational practices in schools",
    ],
    idealPartners: ["School districts", "School leadership teams", "Education nonprofits"],
    format: {
      type: "series",
      cadence: "Professional learning series",
    },
    offeringType: "partner",
    tags: ["Educators", "Schools", "Leaders"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "purpose-workshops",
    title: "Purpose Workshops",
    pathway: "learn",
    tagline: "Purpose alignment workshops for teams, schools, and community leaders.",
    overview:
      "Facilitated workshops help participants align mission, role clarity, and lived values. The process translates purpose language into practical choices and team behavior.",
    whyItExists:
      "Groups operate with more coherence when purpose is explicit, shared, and actionable.",
    whoItsFor: ["Leaders", "School teams", "Business teams", "Community organizations"],
    whatYoullExperience: [
      "Purpose mapping exercises",
      "Facilitated alignment dialogue",
      "Action planning tied to day-to-day decisions",
    ],
    outcomes: [
      "Clearer role and mission alignment",
      "Stronger team cohesion",
      "Improved decision consistency",
    ],
    idealPartners: ["Businesses", "Schools", "Nonprofit leadership teams"],
    format: {
      type: "workshop",
      cadence: "Single session or retreat format",
    },
    offeringType: "fee-based",
    tags: ["Leaders", "Organizations", "Schools", "Partners"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "leadership-well-being",
    title: "Leadership Well-Being",
    pathway: "learn",
    tagline: "Resilience and boundary-setting series for sustained leadership.",
    overview:
      "A leadership-focused series that strengthens personal sustainability, relational practice, and boundary clarity. Designed for leaders navigating long-term stress and high responsibility.",
    whyItExists:
      "Leadership effectiveness declines when leaders lack structures for well-being and recovery.",
    whoItsFor: ["Executive leaders", "Managers", "School and nonprofit leaders"],
    whatYoullExperience: [
      "Resilience routines for sustained leadership",
      "Boundary-setting frameworks",
      "Peer dialogue on leadership load and support",
    ],
    outcomes: [
      "Improved leadership sustainability",
      "Healthier workload boundaries",
      "Better relational climate within teams",
    ],
    idealPartners: ["Leadership teams", "Boards", "Supervisory cohorts"],
    format: {
      type: "series",
      cadence: "Multi-session leadership series",
    },
    offeringType: "fee-based",
    tags: ["Leaders", "Organizations", "Educators"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "emotional-intelligence-connective-leadership",
    title: "Emotional Intelligence for Connective Leadership",
    pathway: "learn",
    tagline: "Team-based emotional intelligence and communication training.",
    overview:
      "This training builds practical emotional intelligence habits for leaders and teams. Sessions focus on communication, feedback, conflict navigation, and trust repair.",
    whyItExists:
      "Teams need emotional fluency to communicate clearly and maintain healthy collaboration under stress.",
    whoItsFor: ["Leadership teams", "Supervisors", "Cross-functional staff groups"],
    whatYoullExperience: [
      "EI skill practice in real workplace scenarios",
      "Communication and feedback drills",
      "Facilitated conflict navigation frameworks",
    ],
    outcomes: [
      "Stronger team communication",
      "Improved trust and accountability",
      "Reduced escalation in team conflict",
    ],
    idealPartners: ["Businesses", "Nonprofits", "Public sector teams"],
    format: {
      type: "workshop",
      cadence: "Single session or workshop series",
    },
    offeringType: "fee-based",
    tags: ["Leaders", "Organizations", "Partners"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "connected-leadership-culture",
    title: "Connected Leadership & Culture",
    pathway: "learn",
    tagline: "Culture audit and leadership development for long-term change.",
    overview:
      "A deeper engagement that combines culture sensing, leadership development, and implementation support. The program helps teams move from assessment to sustained behavior change.",
    whyItExists:
      "Culture work is most effective when data, leadership practice, and follow-through are integrated.",
    whoItsFor: ["Executive teams", "School leaders", "Nonprofit leadership"],
    whatYoullExperience: [
      "Culture signal gathering and analysis",
      "Leadership development sessions",
      "Implementation support for priority culture shifts",
    ],
    outcomes: [
      "Clear culture priorities",
      "Aligned leadership behavior",
      "Measurable progress on team culture goals",
    ],
    idealPartners: ["Schools", "Nonprofits", "Mission-driven companies"],
    format: {
      type: "collaborative",
      cadence: "Multi-phase engagement",
    },
    offeringType: "partner",
    tags: ["Leaders", "Organizations", "Schools", "Nonprofits"],
    contactCTA: defaultContactCTA,
  }),
];

const leadPrograms: Program[] = [
  createProgram({
    id: "wellness-rooted-in-connection-collaborative-trcn",
    title: "Wellness Rooted in Connection Collaborative (TRCN)",
    pathway: "lead",
    tagline: "Cross-sector resilience initiative linking systems around shared outcomes.",
    overview:
      "A collaborative initiative connecting health, youth, education, and food systems to improve community resilience. Partners align strategy, share data themes, and coordinate action across sectors.",
    whyItExists:
      "Complex community challenges require coordinated infrastructure, not isolated programming.",
    whoItsFor: ["Cross-sector partners", "Community coalitions", "Public-serving organizations"],
    whatYoullExperience: [
      "Shared priority setting across sectors",
      "Coordination sessions and action alignment",
      "Collaborative learning around resilience practices",
    ],
    outcomes: [
      "Stronger system coordination",
      "Improved partner alignment",
      "More coherent community-facing initiatives",
    ],
    idealPartners: ["Health systems", "Schools", "Food access leaders", "Youth-serving organizations"],
    format: {
      type: "collaborative",
      cadence: "Ongoing cross-sector initiative",
    },
    offeringType: "partner",
    tags: ["Partners", "Organizations", "Community", "Nonprofits"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "education-coalition-connected-communities-roundtable",
    title: "Education Coalition / Connected Communities Roundtable",
    pathway: "lead",
    tagline: "Recurring coordination forum for education and community partners.",
    overview:
      "A standing roundtable where education partners coordinate around belonging, student support, and community resilience. Meetings convert shared insight into aligned action commitments.",
    whyItExists:
      "Education systems are more effective when schools and community partners coordinate consistently.",
    whoItsFor: ["School leaders", "Educators", "Youth organizations", "Community partners"],
    whatYoullExperience: [
      "Structured partner convenings",
      "Cross-site problem solving",
      "Shared accountability check-ins",
    ],
    outcomes: [
      "Better cross-partner coordination",
      "Reduced duplicated effort",
      "Clearer pathways of support for students and families",
    ],
    idealPartners: ["School districts", "Youth nonprofits", "Family-serving agencies"],
    format: {
      type: "collaborative",
      cadence: "Recurring roundtable",
    },
    offeringType: "partner",
    tags: ["Schools", "Educators", "Leaders", "Partners"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "nonprofit-partner-network",
    title: "Nonprofit Partner Network",
    pathway: "lead",
    tagline: "Convening and backbone support for nonprofit alignment.",
    overview:
      "A network structure that convenes nonprofit and coalition leaders for shared planning, coordination, and support. SparkPoint provides backbone facilitation to keep collaboration moving.",
    whyItExists:
      "Nonprofits can increase impact when they align strategy, timing, and resources instead of operating in parallel.",
    whoItsFor: ["Nonprofit leaders", "Coalition members", "Community-serving organizations"],
    whatYoullExperience: [
      "Convenings for strategic alignment",
      "Backbone facilitation and follow-through support",
      "Shared planning around community priorities",
    ],
    outcomes: [
      "Improved coalition cohesion",
      "Faster partner coordination",
      "Higher collective effectiveness",
    ],
    idealPartners: ["Nonprofit coalitions", "Regional collaboratives", "Community foundations"],
    format: {
      type: "collaborative",
      cadence: "Quarterly convening with between-session support",
    },
    offeringType: "partner",
    tags: ["Nonprofits", "Organizations", "Partners", "Leaders"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "voice-of-the-students-youth-leadership",
    title: "Voice of the Students (VOS) & Youth Leadership",
    pathway: "lead",
    tagline: "Student-led initiatives advancing belonging and school culture.",
    overview:
      "A youth leadership effort that equips students to surface school culture insights and guide action. The model centers student voice in practical decisions affecting belonging and climate.",
    whyItExists:
      "Students are essential co-designers of school culture and should have meaningful leadership roles.",
    whoItsFor: ["Students", "Youth leaders", "Educators", "School partners"],
    whatYoullExperience: [
      "Student leadership development",
      "Facilitated culture and belonging projects",
      "Youth-adult partnership practices",
    ],
    outcomes: [
      "Stronger youth voice in decision making",
      "Improved school belonging climate",
      "Increased student leadership confidence",
    ],
    idealPartners: ["Schools", "Youth organizations", "Student support teams"],
    format: {
      type: "cohort",
      cadence: "School-year youth leadership cycles",
    },
    offeringType: "partner",
    tags: ["Youth", "Schools", "Educators", "Community"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "ready-together-community-preparedness-resilience",
    title: "Ready Together: Community Preparedness & Resilience",
    pathway: "lead",
    tagline: "Preparedness workshops combining logistics and emotional readiness.",
    overview:
      "Preparedness sessions integrate practical planning with relational and emotional readiness strategies. Participants build plans that strengthen both response capacity and community trust.",
    whyItExists:
      "Preparedness is strongest when technical planning and people-centered resilience are developed together.",
    whoItsFor: ["Residents", "Community volunteers", "Local teams", "Neighborhood leaders"],
    whatYoullExperience: [
      "Preparedness logistics planning",
      "Emotional readiness and regulation tools",
      "Scenario-based team practice",
    ],
    outcomes: [
      "Improved community readiness",
      "Clearer response coordination",
      "Stronger resilience under disruption",
    ],
    idealPartners: ["Emergency response partners", "Neighborhood organizations", "Volunteer groups"],
    format: {
      type: "series",
      cadence: "Preparedness workshop series",
    },
    offeringType: "community",
    tags: ["Community", "Residents", "Volunteers", "Organizations"],
    contactCTA: defaultContactCTA,
  }),
  createProgram({
    id: "community-connectors-program",
    title: "Community Connectors Program",
    pathway: "lead",
    tagline: "Volunteer readiness training in partnership with the Red Cross.",
    overview:
      "A connector training program that prepares trusted local volunteers to bridge residents, resources, and support systems. Delivered with partner agencies to strengthen local response capacity.",
    whyItExists:
      "Communities recover and adapt faster when trusted connectors are equipped before moments of crisis.",
    whoItsFor: ["Volunteers", "Community members", "Neighborhood leaders", "Partner agencies"],
    whatYoullExperience: [
      "Readiness and referral training",
      "Relational support and communication tools",
      "Partner-coordinated field practice",
    ],
    outcomes: [
      "Prepared volunteer connector network",
      "Improved access to local resources",
      "Stronger coordination between residents and services",
    ],
    idealPartners: ["Red Cross and emergency partners", "Civic groups", "Faith and neighborhood organizations"],
    format: {
      type: "cohort",
      cadence: "Volunteer training cohorts",
    },
    offeringType: "partner",
    tags: ["Volunteers", "Community", "Organizations", "Partners"],
    contactCTA: defaultContactCTA,
  }),
];

export const pathways: Pathway[] = [
  {
    id: "listen",
    label: "Listen",
    color: "#9E509F",
    colorLight: "rgba(158, 80, 159, 0.08)",
    description:
      "Community insight infrastructure that captures lived experience, identifies patterns, and informs shared direction.",
    programs: listenPrograms,
  },
  {
    id: "learn",
    label: "Learn",
    color: "#FDB515",
    colorLight: "rgba(253, 181, 21, 0.08)",
    description:
      "Relational capacity building through practical workshops, team learning, and leadership development.",
    programs: learnPrograms,
  },
  {
    id: "lead",
    label: "Lead",
    color: "#E03694",
    colorLight: "rgba(224, 54, 148, 0.08)",
    description:
      "Cross-sector coordination that aligns partners, mobilizes action, and strengthens community resilience.",
    programs: leadPrograms,
  },
];

export const allPrograms: Program[] = pathways.flatMap((pathway) => pathway.programs);

export const audienceFilters = Array.from(
  new Set(allPrograms.flatMap((program) => program.tags))
).sort((a, b) => a.localeCompare(b));

export const offeringTypeLabels: Record<OfferingType, string> = {
  community: "Community Offering",
  partner: "Partner-Based",
  "fee-based": "Fee-Based",
};

export const formatTypeLabels: Record<ProgramFormatType, string> = {
  workshop: "Workshop",
  series: "Series",
  cohort: "Cohort",
  event: "Event",
  ongoing: "Ongoing",
  project: "Project",
  collaborative: "Collaborative",
};

export function getOfferingTypeLabel(offeringType: OfferingType): string {
  return offeringTypeLabels[offeringType];
}

export function getFormatLabel(format: ProgramFormat): string {
  const baseLabel = formatTypeLabels[format.type];
  return format.cadence ? `${baseLabel} • ${format.cadence}` : baseLabel;
}

export function getProgramBySlug(slug: string): Program | undefined {
  return allPrograms.find((program) => program.slug === slug || program.id === slug);
}

export function getProgramById(id: string): Program | undefined {
  return allPrograms.find((program) => program.id === id);
}
