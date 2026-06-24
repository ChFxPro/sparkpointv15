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

export type ProgramVoice = 'soft' | 'corporate' | 'coalition' | 'youth' | 'grounded';

export type ProgramPalette = 'warm' | 'neutral' | 'cool';

export type ProgramTypographicTone = 'balanced' | 'structured' | 'energetic';

export interface ProgramBrand {
  /** Pathway-relative accent color. If omitted, consumers fall back to pathway.color via getProgramAccent(). */
  accent?: string;
  /** Softer accent for gradients / backgrounds. Falls back to pathway.colorLight. */
  accentSoft?: string;
  /** Voice label — drives data-voice attribute on ProgramShell */
  voice: ProgramVoice;
  /** One-line hover sample shown on program cards */
  voiceSample: string;
  /** Palette hint for section backgrounds */
  palette: ProgramPalette;
  /** Typographic tone hint — defaults to 'balanced' when omitted */
  typographicTone?: ProgramTypographicTone;
}

export interface ProgramFormat {
  type: ProgramFormatType;
  cadence?: string;
}

export interface Program {
  id: string;
  slug: string;
  title: string;
  pathway: PathwayId;
  shortDescription: string;
  longDescription: string;
  whyItExists?: string;
  detailPageHref?: string;
  tags: string[];
  whoItsFor: string[];
  whatYoullExperience: string[];
  outcomes: string[];
  idealPartners: string[];
  format: ProgramFormat;
  offeringType: OfferingType;
  contactCTA: {
    label: string;
    href: string;
  };
  brand: ProgramBrand;
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
    shortDescription:
      "A bi-weekly column sharing what SparkPoint is hearing across community conversations and story projects.",
    longDescription:
      "Echoes from the Community runs in print and online, lifting local voices and connecting relationships, community conditions, and health. It translates ongoing story collection into practical insight people can use.",
    tags: ["Community", "Individuals", "Educators"],
    whoItsFor: ["Community members", "Individuals", "Educators"],
    whatYoullExperience: [
      "Local stories from residents and partners",
      "Practical insights tied to real community conditions",
      "Reflections that inform individual and collective action",
    ],
    outcomes: [
      "Shared understanding of local realities",
      "More informed community dialogue",
      "Stronger connection between lived experience and action",
    ],
    idealPartners: ["Local media", "Storytellers", "Schools", "Community organizations"],
    format: {
      type: "ongoing",
      cadence: "Bi-weekly",
    },
    offeringType: "community",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'A bi-weekly column sharing what SparkPoint is hearing across community conversations and story projects.',
      palette: 'neutral',
    },
  }),
  createProgram({
    id: "story-collection-projects",
    title: "Story Collection Projects",
    pathway: "listen",
    shortDescription:
      "Targeted story gathering around topics shaping community well-being and recovery.",
    longDescription:
      "These projects gather stories through interviews, written prompts, and youth-led activities on issues like youth mental health, food access, and recovery after Helene. SparkPoint synthesizes themes to guide programs and partnerships.",
    tags: ["Community", "Individuals", "Partners", "Youth"],
    whoItsFor: ["Community members", "Individuals", "Partners", "Youth"],
    whatYoullExperience: [
      "Story prompts and interviews",
      "Community listening sessions",
      "Theme synthesis and insight sharing",
    ],
    outcomes: [
      "Clearer understanding of needs and strengths",
      "Data-informed program adaptation",
      "Stronger partner alignment around community priorities",
    ],
    idealPartners: [
      "Schools",
      "Nonprofits",
      "Neighborhood groups",
      "Funders supporting learning and resilience",
    ],
    format: {
      type: "project",
      cadence: "Topic-based cycles",
    },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'Targeted story gathering around topics shaping community well-being and recovery.',
      palette: 'neutral',
    },
  }),
  createProgram({
    id: "story-lab-studios",
    title: "Story Lab Studios (Media Navigator Mentorships)",
    pathway: "listen",
    shortDescription:
      "A story studio that mentors youth and community members in ethical media and narrative practice.",
    longDescription:
      "Story Lab Studios provides guided mentorship for youth, nonprofits, and community members to strengthen storytelling craft and confidence. Participants build media and narrative skills that support civic voice and local impact.",
    tags: ["Youth", "Community", "Organizations"],
    whoItsFor: ["Youth", "Community members", "Organizations"],
    whatYoullExperience: [
      "Mentorship and coaching",
      "Media and storytelling skill-building",
      "Narrative development for community impact",
    ],
    outcomes: [
      "Increased storytelling confidence",
      "Stronger youth leadership expression",
      "Better communication capacity across partner groups",
    ],
    idealPartners: ["Schools", "Youth programs", "Nonprofits", "Local creatives"],
    format: {
      type: "cohort",
      cadence: "Seasonal studio cycles",
    },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'A story studio that mentors youth and community members in ethical media and narrative practice.',
      palette: 'neutral',
    },
  }),
  createProgram({
    id: "thrive-at-5",
    title: "Thrive @ 5",
    pathway: "listen",
    shortDescription:
      "Monthly community gatherings that create low-barrier connection across the county.",
    longDescription:
      "Thrive @ 5 hosts monthly meetups in Cedar Mountain, Brevard, and Rosman (Headwaters). The gatherings are designed for relationship-building, local conversation, and everyday belonging.",
    tags: ["Individuals", "Community"],
    whoItsFor: ["Individuals", "Community members"],
    whatYoullExperience: [
      "Low-barrier social connection",
      "Facilitated and informal conversation",
      "Local belonging in shared community space",
    ],
    outcomes: [
      "Stronger neighborhood relationships",
      "Increased social connectedness",
      "Greater sense of belonging",
    ],
    idealPartners: ["Community hosts", "Local organizations", "Neighborhood connectors"],
    format: {
      type: "event",
      cadence: "Monthly",
    },
    offeringType: "community",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'Monthly community gatherings that create low-barrier connection across the county.',
      palette: 'neutral',
    },
  }),
];

const learnPrograms: Program[] = [
  createProgram({
    id: "social-health-101",
    title: "Social Health 101: The Science of Connection",
    pathway: "learn",
    shortDescription:
      "A foundational workshop on why relationships and belonging are central to health.",
    longDescription:
      "Social Health 101 explains how connection affects physical and mental well-being, then translates that science into habits people can use at home, work, and in community life.",
    tags: ["Community", "Individuals", "Teams"],
    whoItsFor: ["Community members", "Individuals", "Teams"],
    whatYoullExperience: [
      "Simple science of connection and belonging",
      "Practical reflection on current support patterns",
      "Tools for building and sustaining supportive networks",
    ],
    outcomes: [
      "Greater relational awareness",
      "Usable connection practices",
      "Stronger day-to-day social support",
    ],
    idealPartners: ["Community groups", "Workplaces", "Schools"],
    format: {
      type: "workshop",
      cadence: "Single session",
    },
    offeringType: "community",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'A foundational workshop on why relationships and belonging are central to health.',
      palette: 'neutral',
    },
  }),
  createProgram({
    id: "integrative-well-being-food-mood-movement",
    title: "Integrative Well-Being: Food, Mood & Movement",
    pathway: "learn",
    shortDescription:
      "Interactive learning on how daily rhythms shape mood, focus, and energy.",
    longDescription:
      "This workshop connects nutrition, movement, rest, and emotional health through practical examples. Depending on context, it may include shared meals, gentle movement, and mindfulness practices.",
    tags: ["Individuals", "Community"],
    whoItsFor: ["Individuals", "Community members"],
    whatYoullExperience: [
      "Practical well-being practices",
      "An integrative mind-body lens",
      "Gentle activities and reflection",
    ],
    outcomes: [
      "Improved self-regulation habits",
      "Better awareness of daily energy patterns",
      "Clear next steps for sustainable well-being",
    ],
    idealPartners: ["Wellness organizations", "Food access organizations", "Community groups"],
    format: {
      type: "workshop",
      cadence: "Single session or short series",
    },
    offeringType: "community",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'Interactive learning on how daily rhythms shape mood, focus, and energy.',
      palette: 'neutral',
    },
  }),
  createProgram({
    id: "brain-stress-resilience",
    title: "Brain, Stress & Resilience",
    pathway: "learn",
    shortDescription:
      "A practical workshop on stress response and relationship-based resilience.",
    longDescription:
      "Participants learn what stress does in the brain and body, and how connection buffers its impact. The workshop includes breathing, reframing, and trusted-connection practices.",
    tags: ["Individuals", "Community", "Educators"],
    whoItsFor: ["Individuals", "Community members", "Educators"],
    whatYoullExperience: [
      "Clear stress-response education",
      "Breathing and grounding practices",
      "Tools for supporting yourself and others",
    ],
    outcomes: [
      "Improved stress navigation",
      "Greater resilience capacity",
      "More confidence in offering support to others",
    ],
    idealPartners: ["Schools", "Health organizations", "Community groups"],
    format: {
      type: "workshop",
      cadence: "Single session",
    },
    offeringType: "community",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'A practical workshop on stress response and relationship-based resilience.',
      palette: 'neutral',
    },
  }),
  createProgram({
    id: "positive-culture-belonging",
    title: "Positive Culture & Belonging",
    pathway: "learn",
    shortDescription:
      "A workshop on belonging through everyday interactions, play, and trust.",
    longDescription:
      "This offering shows how low-stakes interaction and shared laughter build trust, creativity, and connection. Participants practice culture-building behaviors that strengthen relationships over time.",
    tags: ["Community", "Teams", "Educators"],
    whoItsFor: ["Community members", "Teams", "Educators"],
    whatYoullExperience: [
      "Playful and relational exercises",
      "Belonging-building culture practices",
      "Reflection on daily interaction patterns",
    ],
    outcomes: [
      "Improved team trust",
      "Stronger belonging culture",
      "More human-centered group dynamics",
    ],
    idealPartners: ["Schools", "Workplaces", "Community organizations"],
    format: {
      type: "workshop",
      cadence: "Single session or mini-series",
    },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'A workshop on belonging through everyday interactions, play, and trust.',
      palette: 'neutral',
    },
  }),
  createProgram({
    id: "learn-connect-nights",
    title: "Learn & Connect Nights (Community & Personal Growth Nights)",
    pathway: "learn",
    shortDescription:
      "Evening gatherings where people learn, reflect, and build meaningful connection.",
    longDescription:
      "Learn & Connect Nights bring people across ages and backgrounds together around topics like resilience, boundaries, joy, and purpose. Each evening blends activity or guest input with conversation and relationship-building.",
    tags: ["Community", "Individuals"],
    whoItsFor: ["Community members", "Individuals"],
    whatYoullExperience: [
      "Guest speaker or guided activity",
      "Facilitated group reflection",
      "Connection-focused conversation",
    ],
    outcomes: [
      "Increased community learning",
      "Expanded social connection",
      "More shared language around well-being",
    ],
    idealPartners: ["Libraries", "Community centers", "Local speakers"],
    format: {
      type: "event",
      cadence: "Recurring evening gatherings",
    },
    offeringType: "community",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'Evening gatherings where people learn, reflect, and build meaningful connection.',
      palette: 'neutral',
    },
  }),
  createProgram({
    id: "supported-connected-classrooms",
    title: "SupportEd: Connected Classrooms & Educator Well-Being",
    pathway: "learn",
    shortDescription:
      "Professional learning and wellness support for educators and school teams.",
    longDescription:
      "SupportEd combines relationship-centered teaching strategies with practical educator well-being tools, including boundaries, peer support, play, and culture practices that help classrooms thrive.",
    tags: ["Educators", "Schools"],
    whoItsFor: ["Educators", "Schools"],
    whatYoullExperience: [
      "Applied educator training",
      "Supportive well-being practices",
      "Classroom and school culture tools",
    ],
    outcomes: [
      "Stronger educator support capacity",
      "Healthier school culture",
      "More connected classrooms",
    ],
    idealPartners: ["School districts", "Colleges", "Educator support organizations"],
    format: {
      type: "series",
      cadence: "Professional learning series",
    },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'Professional learning and wellness support for educators and school teams.',
      palette: 'neutral',
    },
  }),
  createProgram({
    id: "purpose-workshops",
    title: "Purpose Workshops",
    pathway: "learn",
    shortDescription:
      "Guided workshops helping people and teams align strengths, goals, and purpose.",
    longDescription:
      "Purpose Workshops are adapted for businesses, schools, and community settings. Participants clarify strengths and aspirations, then connect that insight to practical decisions and shared direction.",
    tags: ["Organizations", "Schools", "Community", "Individuals"],
    whoItsFor: ["Organizations", "Schools", "Community members", "Individuals"],
    whatYoullExperience: [
      "Guided reflection and discovery",
      "Practical purpose alignment exercises",
      "Planning next steps for individual or team context",
    ],
    outcomes: [
      "Clearer purpose alignment",
      "Stronger motivation and cohesion",
      "More intentional decision-making",
    ],
    idealPartners: ["Employers", "Schools", "Community organizations"],
    format: {
      type: "workshop",
      cadence: "Single session or multi-session",
    },
    offeringType: "fee-based",
    detailPageHref: "/programs/purpose-workshops",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'soft',
      voiceSample: 'We\'re more connected than ever. And still searching for what matters.',
      palette: 'warm',
      typographicTone: 'balanced',
    },
  }),
  createProgram({
    id: "leadership-well-being",
    title: "Leadership Well-Being",
    pathway: "learn",
    shortDescription:
      "Sustainable leadership practices focused on self-awareness, boundaries, and connection.",
    longDescription:
      "Designed for leaders in schools, nonprofits, and community organizations, this program helps leaders build healthier environments where people feel respected, connected, and supported.",
    tags: ["Leaders", "Organizations", "Educators"],
    whoItsFor: ["Leaders", "Organizations", "Educators"],
    whatYoullExperience: [
      "Practices for sustainable leadership",
      "Boundary and self-awareness tools",
      "Relational leadership reflection",
    ],
    outcomes: [
      "Improved leadership sustainability",
      "Healthier team norms",
      "Reduced burnout pressure",
    ],
    idealPartners: ["Nonprofits", "Schools", "Partner organizations"],
    format: {
      type: "series",
      cadence: "Leadership development series",
    },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'corporate',
      voiceSample: 'Strong leadership starts with well-regulated attention. We teach both.',
      palette: 'neutral',
      typographicTone: 'structured',
    },
  }),
  createProgram({
    id: "emotional-intelligence-connective-leadership",
    title: "Emotional Intelligence for Connective Leadership",
    pathway: "learn",
    shortDescription:
      "Practical EI and communication tools for trust-based leadership under stress.",
    longDescription:
      "Participants strengthen empathy, regulation, feedback, and repair skills to improve communication and trust. The program focuses on habits leaders can use immediately in real team dynamics.",
    tags: ["Leaders", "Teams", "Organizations"],
    whoItsFor: ["Leaders", "Teams", "Organizations"],
    whatYoullExperience: [
      "Applied emotional intelligence tools",
      "Communication and feedback habits",
      "Repair and trust-building practices",
    ],
    outcomes: [
      "Improved team communication",
      "Higher trust during pressure",
      "Stronger conflict recovery capacity",
    ],
    idealPartners: ["Workplaces", "Nonprofits", "Schools"],
    format: {
      type: "workshop",
      cadence: "Single workshop or series",
    },
    offeringType: "fee-based",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'Practical EI and communication tools for trust-based leadership under stress.',
      palette: 'neutral',
    },
  }),
  createProgram({
    id: "workplace-well-being-positive-culture",
    title: "Workplace Well-Being & Positive Culture",
    pathway: "learn",
    shortDescription:
      "Team workshops on communication, recognition, trust, and belonging.",
    longDescription:
      "This offering helps teams strengthen morale and everyday relationships through practical culture tools. Sessions are built to be actionable and relevant to daily workplace realities.",
    tags: ["Teams", "Organizations"],
    whoItsFor: ["Teams", "Organizations"],
    whatYoullExperience: [
      "Team exercises and dialogue",
      "Simple, repeatable culture tools",
      "Recognition and trust-building practices",
    ],
    outcomes: [
      "Better team morale",
      "Improved workplace relationships",
      "Stronger day-to-day culture habits",
    ],
    idealPartners: ["Employers", "Nonprofits", "Partner agencies"],
    format: {
      type: "workshop",
      cadence: "Single session or short series",
    },
    offeringType: "fee-based",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'Team workshops on communication, recognition, trust, and belonging.',
      palette: 'neutral',
    },
  }),
  createProgram({
    id: "connected-leadership-culture",
    title: "Connected Leadership & Culture",
    pathway: "learn",
    shortDescription:
      "A deeper multi-session program for culture change through a well-being lens.",
    longDescription:
      "Connected Leadership & Culture is a customizable engagement that analyzes team culture and develops a practical roadmap. It weaves emotional intelligence, leadership habits, and team strategies to support retention and belonging.",
    tags: ["Organizations", "Leaders", "Teams"],
    whoItsFor: ["Organizations", "Leaders", "Teams"],
    whatYoullExperience: [
      "Culture analysis and diagnosis",
      "Leadership and team strategy work",
      "A practical multi-session roadmap",
    ],
    outcomes: [
      "More connected workplace culture",
      "Improved retention conditions",
      "Clearer leadership alignment",
    ],
    idealPartners: ["Employers", "Nonprofits", "Agencies"],
    format: {
      type: "series",
      cadence: "Multi-session engagement",
    },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'A deeper multi-session program for culture change through a well-being lens.',
      palette: 'neutral',
    },
  }),
];

const leadPrograms: Program[] = [
  createProgram({
    id: "wellness-rooted-in-connection-collaborative-trcn",
    title: "Wellness Rooted in Connection Collaborative (TRCN)",
    pathway: "lead",
    shortDescription:
      "A cross-sector collaborative strengthening mental wellness, social connection, and resilience.",
    longDescription:
      "SparkPoint convenes as part of TRCN to align residents and partners across education, health, youth, and food access. The collaborative co-creates shared strategies for county-wide resilience in Transylvania.",
    tags: ["Partners", "Organizations", "Community"],
    whoItsFor: ["Partners", "Organizations", "Community"],
    whatYoullExperience: [
      "Cross-sector convening",
      "Coordination and shared strategy design",
      "Collaborative action planning",
    ],
    outcomes: [
      "Stronger system alignment",
      "Improved coordination around wellness priorities",
      "More durable community resilience infrastructure",
    ],
    idealPartners: ["Cross-sector organizations", "Coalitions", "Public agencies"],
    format: {
      type: "collaborative",
      cadence: "Ongoing",
    },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'coalition',
      voiceSample: 'When organizations listen together, the community hears itself.',
      palette: 'cool',
      typographicTone: 'balanced',
    },
  }),
  createProgram({
    id: "community-connectors",
    title: "Community Connectors",
    pathway: "lead",
    shortDescription:
      "Trusted local people helping neighbors find information, resources, care, and preparedness across Transylvania County.",
    longDescription:
      "Community Connectors grew from SparkPoint's post-Helene listening work. The initiative strengthens the trusted people, relationships, and informal networks that already help neighbors navigate uncertainty, find resources, and stay connected before, during, and after hard moments.",
    whyItExists:
      "After Hurricane Helene, residents repeatedly named the trusted people who knew who to call, where to go, what was changing, and how to help neighbors take the next step.",
    tags: ["Community", "Partners", "Preparedness", "Organizations"],
    whoItsFor: [
      "Community members others already turn to",
      "Faith leaders and neighborhood hosts",
      "Volunteers, business owners, educators, and local organizers",
      "Partners strengthening disaster preparedness and community resilience",
    ],
    whatYoullExperience: [
      "Connection with trusted people across Transylvania County",
      "Listening circles and practical small-group conversations",
      "Preparedness tools and resource-sharing relationships",
      "Opportunities to identify local Connection Points",
    ],
    outcomes: [
      "Stronger neighbor-to-neighbor support",
      "Clearer paths to information, services, and community resources",
      "More prepared and connected local communities",
    ],
    idealPartners: [
      "FWRD Transylvania County",
      "American Red Cross",
      "Faith communities",
      "Neighborhood groups",
      "Local agencies and nonprofits",
    ],
    format: {
      type: "collaborative",
      cadence: "Ongoing gatherings and local connection-building",
    },
    offeringType: "community",
    detailPageHref: "/community-connectors",
    contactCTA: {
      label: "Fill out the interest form",
      href: "https://wkf.ms/4azGJiS",
    },
    brand: {
      accent: "#174c36",
      accentSoft: "rgba(95, 150, 148, 0.12)",
      voice: 'coalition',
      voiceSample: "Rooted in connection. Ready for what's next.",
      palette: 'cool',
      typographicTone: 'structured',
    },
  }),
  createProgram({
    id: "education-coalition-connected-communities-roundtable",
    title: "Education Coalition / Connected Communities Roundtable",
    pathway: "lead",
    shortDescription:
      "Recurring roundtable for coordinated support of students, families, and schools.",
    longDescription:
      "This recurring gathering builds shared understanding and joint planning among organizations that support youth and families. It helps partners coordinate actions instead of working in isolation.",
    tags: ["Partners", "Educators", "Organizations"],
    whoItsFor: ["Partners", "Educators", "Organizations"],
    whatYoullExperience: [
      "Roundtable collaboration",
      "Joint planning and coordination",
      "Shared problem-solving around youth support",
    ],
    outcomes: [
      "More aligned youth-serving systems",
      "Reduced duplication across organizations",
      "Clearer partner accountability",
    ],
    idealPartners: ["Schools", "Youth organizations", "Family support organizations"],
    format: {
      type: "collaborative",
      cadence: "Recurring",
    },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'Recurring roundtable for coordinated support of students, families, and schools.',
      palette: 'neutral',
    },
  }),
  createProgram({
    id: "nonprofit-partner-network-convening-space",
    title: "Nonprofit Partner Network & Convening Space",
    pathway: "lead",
    shortDescription:
      "Facilitated convening space for nonprofits and coalitions building shared solutions.",
    longDescription:
      "SparkPoint offers facilitation and collaborative space where nonprofits and coalitions can connect, coordinate, and strengthen joint responses to community needs.",
    tags: ["Organizations", "Partners"],
    whoItsFor: ["Organizations", "Partners"],
    whatYoullExperience: [
      "Convening and relationship-building",
      "Facilitated collaboration",
      "Shared solution development",
    ],
    outcomes: [
      "Stronger partner network cohesion",
      "Higher collaboration capacity",
      "More coordinated community response",
    ],
    idealPartners: ["Nonprofits", "Coalitions", "Community initiatives"],
    format: {
      type: "collaborative",
      cadence: "Ongoing convening",
    },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'Facilitated convening space for nonprofits and coalitions building shared solutions.',
      palette: 'neutral',
    },
  }),
  createProgram({
    id: "voice-of-the-students-youth-leadership",
    title: "Voice of the Students (VOS) & Youth Leadership",
    pathway: "lead",
    shortDescription:
      "Student-led projects focused on belonging, school culture, and mental health support.",
    longDescription:
      "Youth participants design inclusive initiatives, strengthen leadership skills, and shape school culture through student-led action. The model centers youth voice in meaningful decision-making.",
    tags: ["Youth", "Schools"],
    whoItsFor: ["Youth", "Schools"],
    whatYoullExperience: [
      "Youth-led design and planning",
      "Leadership skill development",
      "Belonging-focused school culture work",
    ],
    outcomes: [
      "Increased youth leadership confidence",
      "Stronger school belonging practices",
      "More student-informed school initiatives",
    ],
    idealPartners: ["Schools", "Youth organizations", "Mental health partners"],
    format: {
      type: "cohort",
      cadence: "School-year cycles",
    },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'youth',
      voiceSample: 'Your voice is already data. Here\'s what we do with it.',
      palette: 'warm',
      typographicTone: 'energetic',
    },
  }),
  createProgram({
    id: "ready-together-community-preparedness-resilience",
    title: "Ready Together: Community Preparedness & Resilience",
    pathway: "lead",
    shortDescription:
      "Preparedness workshops and neighborhood projects that combine logistics with emotional readiness.",
    longDescription:
      "Ready Together helps communities prepare before, during, and after crises through practical planning and neighbor-to-neighbor support practices. It integrates communication, coordination, and care-centered resilience.",
    tags: ["Community", "Partners", "Organizations"],
    whoItsFor: ["Community members", "Partners", "Organizations"],
    whatYoullExperience: [
      "Practical preparedness planning",
      "Connection-based readiness practices",
      "Coordination tools for local response",
    ],
    outcomes: [
      "Improved neighborhood readiness",
      "Stronger local response coordination",
      "Greater emotional and practical resilience",
    ],
    idealPartners: [
      "Emergency management",
      "Neighborhood groups",
      "Local agencies",
      "Nonprofits",
    ],
    format: {
      type: "series",
      cadence: "Workshop series + neighborhood projects",
    },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: {
      voice: 'grounded',
      voiceSample: 'Ready isn\'t a feeling. It\'s a set of small, specific habits.',
      palette: 'neutral',
      typographicTone: 'structured',
    },
  }),
];

export const pathways: Pathway[] = [
  {
    id: "listen",
    label: "Listen",
    color: "#9E509F",
    colorLight: "rgba(158, 80, 159, 0.08)",
    description:
      "Community insight infrastructure that captures lived experience and turns it into shared direction.",
    programs: listenPrograms,
  },
  {
    id: "learn",
    label: "Learn",
    color: "#FDB515",
    colorLight: "rgba(253, 181, 21, 0.08)",
    description:
      "Relational capacity building through practical education, reflection, and leadership growth.",
    programs: learnPrograms,
  },
  {
    id: "lead",
    label: "Lead",
    color: "#E03694",
    colorLight: "rgba(224, 54, 148, 0.08)",
    description:
      "Cross-sector coordination that helps partners align strategy, action, and long-term resilience.",
    programs: leadPrograms,
  },
];

export const allPrograms: Program[] = pathways.flatMap((pathway) => pathway.programs);

export const programsWithDetailPages: Program[] = allPrograms.filter((program) => Boolean(program.detailPageHref));

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

export function getProgramAccent(program: Program): string {
  if (program.brand.accent) return program.brand.accent;
  const pathway = pathways.find((p) => p.id === program.pathway);
  return pathway?.color ?? '#1A1A1A';
}

export function getProgramAccentSoft(program: Program): string {
  if (program.brand.accentSoft) return program.brand.accentSoft;
  const pathway = pathways.find((p) => p.id === program.pathway);
  return pathway?.colorLight ?? 'rgba(0,0,0,0.06)';
}
