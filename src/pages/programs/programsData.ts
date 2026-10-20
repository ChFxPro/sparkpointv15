export type PathwayId = "listen" | "learn" | "lead" | "connect";

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
  /** The program's own logo, for light grounds, when it has a brand (files from its kit). */
  logo?: string;
  /** Size the logo up or down from the default; a stacked two-line lockup needs more height. */
  logoScale?: number;
}

export interface Pathway {
  id: PathwayId;
  label: "Listen" | "Learn" | "Lead" | "Connect";
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

// StoryLab's logo, from its kit in Branding/StoryLab (draft identity, 2026-10-18).
import storylabLogo from "../../assets/storylab/storylab-logo-plum.svg";
import trailheadLogo from "../../assets/trailhead/trailhead-lockup-horizontal-full.svg";
import { COMMUNITY_CONNECTORS_BRAND } from "../../components/communityConnectorsBrand";

// The program lineup, settled 2026-10-15 (Brain: 02-Areas/SparkPoint/SparkPoint Program
// Lineup.md): 13 programs in four pathways, plus StoryLab as an initiative. Programs that
// were retired or paused are listed in RETIRED_PROGRAM_SLUGS so their old links still land.

const listenPrograms: Program[] = [
  createProgram({
    id: "story-collection",
    title: "Community Story Collection",
    pathway: "listen",
    shortDescription:
      "We gather residents' stories on one question at a time and take what we hear to the people making local decisions.",
    longDescription:
      "Each collection focuses on a topic shaping community well-being: health care access, food, recovery after Helene, what it's like to be a student here. Stories come in through interviews, short written prompts, and youth-led activities. SparkPoint reads across them for strengths, needs, and patterns, and shares a summary with the partners who can act on it.",
    whyItExists:
      "Decisions about a community are better when they start from what its people are actually living. Story collection makes that experience visible and usable.",
    tags: ["Community", "Individuals", "Partners", "Youth"],
    whoItsFor: ["Residents with a story to share", "Partners who want to understand a need", "Schools and youth groups", "Funders supporting community learning"],
    whatYoullExperience: [
      "Short, anonymous story prompts and recorded interviews",
      "Community listening sessions",
      "A plain-language summary of what was heard",
    ],
    outcomes: [
      "A clearer picture of local strengths and needs",
      "Programs and partnerships shaped by lived experience",
      "Residents who see their stories lead somewhere",
    ],
    idealPartners: ["Schools", "Nonprofits", "Health and county partners", "Neighborhood groups"],
    format: { type: "project", cadence: "One topic at a time" },
    offeringType: "community",
    contactCTA: { label: "See current collections", href: "/stories/collections" },
    brand: {
      voice: "grounded",
      voiceSample: "Everyone has a story about this place. We ask, and we listen.",
      palette: "neutral",
    },
  }),
];

const learnPrograms: Program[] = [
  createProgram({
    id: "connected-leadership-culture",
    title: "Connected Leadership",
    pathway: "learn",
    shortDescription:
      "A yearlong series for workplaces that want a more connected culture, built around their own team.",
    longDescription:
      "Connected Leadership starts with a look at how a team actually works together, then builds a practical roadmap across a series of sessions. It weaves leadership habits, emotional intelligence, and team practices together to support belonging and retention.",
    tags: ["Organizations", "Leaders", "Teams"],
    whoItsFor: ["Employers", "Leadership teams", "Nonprofits and agencies"],
    whatYoullExperience: [
      "A culture read of your team",
      "Leadership and team practice sessions",
      "A roadmap your team keeps using",
    ],
    outcomes: ["A more connected workplace culture", "Better conditions for retention", "Leaders aligned on how they lead"],
    idealPartners: ["Employers", "Nonprofits", "Public agencies"],
    format: { type: "series", cadence: "Yearlong" },
    offeringType: "fee-based",
    contactCTA: defaultContactCTA,
    brand: { voice: "corporate", voiceSample: "Culture is how a team treats each other on an ordinary Tuesday.", palette: "neutral", typographicTone: "structured" },
  }),
  createProgram({
    id: "leadership-well-being",
    title: "Leadership Wellbeing",
    pathway: "learn",
    shortDescription:
      "A series for leaders on attention, boundaries, and leading in a way they can sustain.",
    longDescription:
      "Designed for leaders in schools, nonprofits, and community organizations, Leadership Wellbeing builds the habits that keep leaders steady: regulated attention, clear boundaries, and relationships that hold under pressure.",
    tags: ["Leaders", "Organizations", "Educators"],
    whoItsFor: ["Executive directors and managers", "School leaders", "Community organization leaders"],
    whatYoullExperience: ["Practices for sustainable leadership", "Tools for boundaries and self-awareness", "Reflection with other leaders"],
    outcomes: ["Leadership that lasts", "Healthier team norms", "Less burnout pressure"],
    idealPartners: ["Nonprofits", "Schools", "Partner organizations"],
    format: { type: "series", cadence: "Leadership series" },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: { voice: "corporate", voiceSample: "Strong leadership starts with well-regulated attention. We teach both.", palette: "neutral", typographicTone: "structured" },
  }),
  createProgram({
    id: "purpose-workshops",
    title: "SparkPurpose Workshops",
    pathway: "learn",
    shortDescription:
      "Two-hour guided sessions where teams and individuals talk through what matters to them and leave with a next step.",
    longDescription:
      "SparkPurpose workshops run for workplaces, schools, and community groups. A facilitator leads the group through reflection prompts and conversation, and everyone leaves with a written next step.",
    tags: ["Organizations", "Schools", "Community", "Individuals"],
    whoItsFor: ["Workplace teams", "Schools", "Community groups", "Individuals"],
    whatYoullExperience: ["Guided reflection and conversation", "A facilitator keeping it open", "A written next step to take home"],
    outcomes: ["Clearer sense of purpose", "Stronger team connection", "More intentional next steps"],
    idealPartners: ["Employers", "Schools", "Community organizations"],
    format: { type: "workshop", cadence: "Two hours" },
    offeringType: "fee-based",
    detailPageHref: "/programs/purpose-workshops",
    contactCTA: defaultContactCTA,
    brand: { voice: "soft", voiceSample: "We're more connected than ever. And still searching for what matters.", palette: "warm", typographicTone: "balanced" },
  }),
  createProgram({
    id: "media-navigators",
    title: "Media Navigators",
    pathway: "learn",
    shortDescription:
      "SparkPoint's mentorship fellowship, training media generalists in ethical storytelling, editing, design, and responsible AI tools.",
    longDescription:
      "Media Navigators mentors young people and community members, including neurodivergent participants, in the media skills nonprofits, local government, and small businesses need: video and audio editing, graphics, captioning, and careful, human-checked use of AI tools. Navigators build a portfolio on real SparkPoint and partner projects, and help bring StoryLab to life as it opens.",
    tags: ["Youth", "Individuals", "Organizations"],
    whoItsFor: ["Young people and career changers", "Neurodivergent creators", "Nonprofits and agencies that need media help"],
    whatYoullExperience: ["Mentorship from working media makers", "Real projects for real partners", "A portfolio and a path to placements"],
    outcomes: ["Job-ready media skills", "A local pipeline of media talent", "Partners with the storytelling capacity they need"],
    idealPartners: ["Nonprofits", "Local government", "Small businesses", "Workforce partners"],
    format: { type: "cohort", cadence: "Fellowship cohorts" },
    offeringType: "community",
    contactCTA: defaultContactCTA,
    brand: { voice: "youth", voiceSample: "Learn the craft on work that matters here.", palette: "warm", typographicTone: "energetic" },
  }),
];

const leadPrograms: Program[] = [
  createProgram({
    id: "voice-of-the-students-youth-leadership",
    title: "Voices of the Students (VOS)",
    pathway: "lead",
    shortDescription:
      "Student-led sessions on middle and high school campuses, where students say what school is really like and help decide what changes.",
    longDescription:
      "VOS meets students where they are, on campus and during the school day. Students lead the conversations, name what helps and what gets in the way, and turn it into action plans with their schools.",
    tags: ["Youth", "Schools"],
    whoItsFor: ["Middle and high school students", "School leaders and counselors"],
    whatYoullExperience: ["Sessions led by students", "Time with peers from across the school", "Student-built action plans"],
    outcomes: ["Student leadership and confidence", "School decisions informed by students", "A stronger sense of belonging"],
    idealPartners: ["Schools", "Youth organizations", "Youth-serving partners"],
    format: { type: "cohort", cadence: "Through the school year" },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: { voice: "youth", voiceSample: "Your voice is already data. Here's what we do with it.", palette: "warm", typographicTone: "energetic" },
  }),
  createProgram({
    id: "trailhead",
    title: "TrailHead",
    pathway: "lead",
    shortDescription:
      "A SparkPoint simulation that turns a room into a system: small groups carry a fictional family through its doors, delays, and handoffs, then read the map together.",
    longDescription:
      "TrailHead is a facilitated simulation. Each group carries a fictional family's story through a community system, making the choices that family would face, and the room sees what each path cost in time, money, and connection. Its first edition, TrailHead: Rural Health, filled the room at the October 1, 2026 Western NC Regional Rural Health Convening. New editions can be built around the system a group is working on.",
    whyItExists: "Connection is easy to praise and hard to see. TrailHead makes the cost of a missing handoff something a room can feel, and talk about together.",
    tags: ["Organizations", "Partners", "Leaders"],
    whoItsFor: ["Health systems and agencies", "Coalitions and funders", "Organizations planning together"],
    whatYoullExperience: ["A fictional family's story to carry", "Choices at every door", "A shared map of what the journeys took"],
    outcomes: ["A shared picture of how the system really works", "Concrete places to strengthen handoffs", "Partners who've walked it together"],
    idealPartners: ["Health systems", "Public agencies", "Coalitions", "Funders"],
    format: { type: "event", cadence: "Facilitated session" },
    offeringType: "fee-based",
    contactCTA: { label: "Bring TrailHead to your group", href: "/intake?intent=partner" },
    brand: { accent: "#2F4A3C", accentSoft: "rgba(47, 74, 60, 0.1)", voice: "grounded", voiceSample: "Walk the system. Count what the journey costs.", palette: "cool", typographicTone: "structured" },
    logo: trailheadLogo,
  }),
];

const connectPrograms: Program[] = [
  createProgram({
    id: "wellness-rooted-in-connection-collaborative-trcn",
    title: "Wellness Rooted in Connection Collaborative",
    pathway: "connect",
    shortDescription:
      "A community of practice where organizations listen together and strengthen mental wellness and resilience across the county.",
    longDescription:
      "The Wellness Rooted in Connection (WRC) collaborative brings residents and organizations from education, health, youth work, and food access into one room. Members share what they are hearing, align on priorities, and build shared strategies for wellness and resilience in Transylvania County.",
    tags: ["Partners", "Organizations", "Community"],
    whoItsFor: ["Community organizations", "Schools and health partners", "Residents who want a voice in local priorities"],
    whatYoullExperience: ["Regular cross-sector gatherings", "Shared listening and planning", "Joint action on shared priorities"],
    outcomes: ["Organizations working from the same picture", "Better-coordinated support", "Lasting connections across sectors"],
    idealPartners: ["Cross-sector organizations", "Coalitions", "Public agencies"],
    format: { type: "collaborative", cadence: "Ongoing" },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: { voice: "coalition", voiceSample: "When organizations listen together, the community hears itself.", palette: "cool", typographicTone: "balanced" },
  }),
  createProgram({
    id: "community-connectors",
    title: "Community Connectors",
    pathway: "connect",
    shortDescription:
      "Neighbors people already trust, with the training and tools to help their communities get ready for hard days and recover from them.",
    longDescription:
      "Community Connectors grew from SparkPoint's listening after Hurricane Helene. With the American Red Cross and FWRD Transylvania, it strengthens the trusted people and informal networks that already help neighbors find information and resources before, during, and after hard moments.",
    whyItExists:
      "After Helene, residents kept naming the trusted people who knew who to call, where to go, and how to help a neighbor take the next step.",
    tags: ["Community", "Partners", "Preparedness", "Organizations"],
    whoItsFor: ["People others already turn to", "Faith leaders and neighborhood hosts", "Volunteers, business owners, and educators"],
    whatYoullExperience: ["Training and practical small-group conversations", "Preparedness tools and resource sharing", "Identifying local Connection Points"],
    outcomes: ["Stronger neighbor-to-neighbor support", "Clearer paths to information and resources", "Readier, better-connected communities"],
    idealPartners: ["American Red Cross", "FWRD Transylvania", "Faith communities", "Neighborhood groups"],
    format: { type: "collaborative", cadence: "Ongoing" },
    offeringType: "community",
    detailPageHref: "/community-connectors",
    contactCTA: { label: "Fill out the interest form", href: "https://wkf.ms/4azGJiS" },
    brand: { accent: "#224a39", accentSoft: "rgba(83, 134, 129, 0.12)", voice: "coalition", voiceSample: "Rooted in connection. Ready for what's next.", palette: "cool", typographicTone: "structured" },
    logo: COMMUNITY_CONNECTORS_BRAND.logoDark,
    logoScale: 1.4,
  }),
  createProgram({
    id: "powher",
    title: "PowHer",
    pathway: "connect",
    shortDescription:
      "A monthly gathering of women for honest conversation, shared growth, leadership, and belonging.",
    longDescription:
      "PowHer is a joint program of SparkPoint, Pisgah Health Foundation, the Brevard/Transylvania Chamber of Commerce, and KL Creative. Each month women from across the county gather to talk honestly, learn from each other, and build the relationships that carry into work and community life.",
    tags: ["Community", "Individuals", "Leaders"],
    whoItsFor: ["Women across Transylvania County", "Emerging and established leaders"],
    whatYoullExperience: ["Monthly gatherings", "Honest, guided conversation", "Connections that last past the evening"],
    outcomes: ["A stronger network of women leaders", "Shared growth and support", "A greater sense of belonging"],
    idealPartners: ["Pisgah Health Foundation", "Brevard/Transylvania Chamber of Commerce", "KL Creative"],
    format: { type: "event", cadence: "Monthly" },
    offeringType: "community",
    contactCTA: defaultContactCTA,
    brand: { voice: "soft", voiceSample: "Bring yourself. Leave with a few more people in your corner.", palette: "warm" },
  }),
  createProgram({
    id: "nonprofit-partner-network-convening-space",
    title: "Nonprofit Partner Network",
    pathway: "connect",
    shortDescription:
      "A facilitated space where local nonprofits and coalitions meet, coordinate, and track shared goals.",
    longDescription:
      "SparkPoint provides backbone support for local nonprofits and coalitions: organizing the meetings, facilitating the conversation, and keeping track of shared goals, so partners can spend their time on the work itself.",
    tags: ["Organizations", "Partners"],
    whoItsFor: ["Local nonprofits", "Coalitions and networks"],
    whatYoullExperience: ["Facilitated convenings", "Backbone and meeting support", "Shared goal tracking"],
    outcomes: ["A more connected nonprofit community", "Less duplicated effort", "More coordinated responses to community needs"],
    idealPartners: ["Nonprofits", "Coalitions", "Community initiatives"],
    format: { type: "collaborative", cadence: "Ongoing" },
    offeringType: "partner",
    contactCTA: defaultContactCTA,
    brand: { voice: "grounded", voiceSample: "We hold the agenda so partners can hold the work.", palette: "neutral" },
  }),
  createProgram({
    id: "resource-lobby",
    title: "Resource Lobby",
    pathway: "connect",
    shortDescription:
      "A front door to local help at the Resilience Hub, with the same listings online in the Resource Directory.",
    longDescription:
      "The Resource Lobby is the welcoming entrance to the Resilience Hub at 94 S. Caldwell Street in Brevard, where people can find out what help exists locally and who to talk to. The same information lives online in SparkPoint's Resource Directory.",
    tags: ["Community", "Individuals"],
    whoItsFor: ["Residents looking for local help", "Partners who want to be easy to find"],
    whatYoullExperience: ["A welcoming place to ask", "Up-to-date local listings", "A warm handoff to the right partner"],
    outcomes: ["Easier paths to local help", "Partners who are easier to reach", "Fewer people left without a next step"],
    idealPartners: ["Local service providers", "County and town offices", "Community organizations"],
    format: { type: "ongoing", cadence: "At the Hub and online" },
    offeringType: "community",
    detailPageHref: "/directory",
    contactCTA: { label: "Browse the Resource Directory", href: "/directory" },
    brand: { voice: "grounded", voiceSample: "Not sure where to start? Start here.", palette: "neutral" },
  }),
  createProgram({
    id: "family-parent-program",
    title: "Family and Parent Program",
    pathway: "connect",
    shortDescription:
      "A place for families to connect, learn, and get a warm handoff to the right support. Opening with the Resilience Hub build-out.",
    longDescription:
      "Built on resource navigation, the Family and Parent Program will give parents and caregivers a place to connect with each other, learn together, and be introduced to the partners who can help. It is on hold until the Resilience Hub is funded and built out.",
    tags: ["Families", "Community"],
    whoItsFor: ["Parents and caregivers", "Family-serving partners"],
    whatYoullExperience: ["A place to connect with other families", "Learning together", "Warm introductions to local partners"],
    outcomes: ["Families with more connections", "Easier paths to support", "Stronger family-serving partnerships"],
    idealPartners: ["Family-serving nonprofits", "Schools", "Health partners"],
    format: { type: "ongoing", cadence: "Coming with the Hub" },
    offeringType: "community",
    contactCTA: { label: "Support the Hub build-out", href: "/resilience-hub" },
    brand: { voice: "soft", voiceSample: "A place for families to land.", palette: "warm" },
  }),
];

/** Something SparkPoint is building that isn't a program yet. */
export interface Initiative {
  id: string;
  title: string;
  description: string;
  status: string;
  href?: string;
  /** The initiative's own logo, if it has a brand (files from its kit in Branding/). */
  logo?: string;
}

export const initiatives: Initiative[] = [
  {
    id: "storylab",
    title: "StoryLab",
    description:
      "SparkPoint's community media studio at the Resilience Hub, where people record stories and oral histories, and where what we hear becomes captioned video, archives, and public learning. Media Navigators help run it.",
    status: "Planned for the Resilience Hub build-out",
    href: "/resilience-hub",
    logo: storylabLogo,
  },
];

/**
 * Old program URLs, mapped to where they should land now: a program that absorbed them,
 * or null for the programs page. Keeps links from before the 2026-10 lineup working.
 */
export const RETIRED_PROGRAM_SLUGS: Record<string, string | null> = {
  "echoes-from-the-community": "story-collection",
  "story-collection-projects": "story-collection",
  "story-lab-studios": "media-navigators",
  "ready-together-community-preparedness-resilience": "community-connectors",
  "emotional-intelligence-connective-leadership": "connected-leadership-culture",
  "workplace-well-being-positive-culture": "connected-leadership-culture",
  "thrive-at-5": null,
  "social-health-101": null,
  "integrative-well-being-food-mood-movement": null,
  "brain-stress-resilience": null,
  "positive-culture-belonging": null,
  "learn-connect-nights": null,
  "supported-connected-classrooms": null,
  "education-coalition-connected-communities-roundtable": null,
};

export const pathways: Pathway[] = [
  {
    id: "listen",
    label: "Listen",
    color: "#9E509F",
    colorLight: "rgba(158, 80, 159, 0.08)",
    description: "Hearing what the community is living, and making it visible to the people who can act on it.",
    programs: listenPrograms,
  },
  {
    id: "learn",
    label: "Learn",
    color: "#FDB515",
    colorLight: "rgba(253, 181, 21, 0.08)",
    description: "Building the skills and habits that help people, teams, and leaders do their best work together.",
    programs: learnPrograms,
  },
  {
    id: "lead",
    label: "Lead",
    color: "#E03694",
    colorLight: "rgba(224, 54, 148, 0.08)",
    description: "Putting students, and the room itself, in charge of seeing what needs to change.",
    programs: leadPrograms,
  },
  {
    id: "connect",
    label: "Connect",
    color: "#F15F48",
    colorLight: "rgba(241, 95, 72, 0.08)",
    description: "Working alongside partners, and linking people to the help that already exists.",
    programs: connectPrograms,
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

/**
 * Other programs that share at least one audience tag with `program`, ranked
 * by number of shared tags (ties broken by same pathway, then title). Powers
 * the "Related" links on a program detail page — every match is grounded in
 * the program's own `tags` data.
 */
export function getRelatedPrograms(program: Program, limit = 4): Program[] {
  const scored = allPrograms
    .filter((p) => p.id !== program.id)
    .map((p) => ({
      program: p,
      sharedCount: p.tags.filter((t) => program.tags.includes(t)).length,
      samePathway: p.pathway === program.pathway,
    }))
    .filter((p) => p.sharedCount > 0);

  scored.sort((a, b) => {
    if (b.sharedCount !== a.sharedCount) return b.sharedCount - a.sharedCount;
    if (a.samePathway !== b.samePathway) return a.samePathway ? -1 : 1;
    return a.program.title.localeCompare(b.program.title);
  });

  return scored.slice(0, limit).map((p) => p.program);
}
