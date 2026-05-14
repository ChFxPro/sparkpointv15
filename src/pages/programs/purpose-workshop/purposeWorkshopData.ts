import heroImage from "../../../assets/purpose_workshops/workshop-84582941395525283.jpg";
import reflectionImage from "../../../assets/purpose_workshops/workshop-2459.jpg";
import tableConversationImage from "../../../assets/purpose_workshops/workshop-2469.jpg";
import warmConnectionImage from "../../../assets/purpose_workshops/workshop-2501.jpg";
import wideReflectionImage from "../../../assets/purpose_workshops/workshop-2522.jpg";
import sparkPurposeLogo from "../../../assets/purpose_workshops/sparkpurpose-logo.png";

export const purposeWorkshopData = {
  title: "SparkPurpose Workshop",
  logo: sparkPurposeLogo,
  host: "SparkPoint",
  registrationUrl:
    "https://forms.monday.com/forms/96c4b0c72749be133899fb8b679f9671?r=use1",
  eyebrow: "SparkPoint workshop",
  openingLines: [
    "We're more connected than ever.",
    "And still searching for what matters.",
  ],
  heroSecondaryLines: ["That's not a failure.", "It's a signal."],
  heroTakeaway: "Something deeper needs your attention.",
  beliefLine: "At SparkPoint, connection is where clarity begins.",
  heroSummary:
    "Reflection, conversation, and practical next steps for people and teams.",
  heroHighlights: [
    { label: "Format", value: "Reflection + conversation" },
    { label: "For", value: "People and teams" },
    { label: "Outcome", value: "Clearer next steps" },
  ],
  heroCtaLabel: "Register Now",
  heroImage: {
    src: heroImage,
    alt: "Participants gathered during a SparkPurpose workshop session.",
    note:
      "Guided reflection, real conversation, and practical next steps.",
  },
  whatIs: {
    eyebrow: "Overview",
    title: "A guided workshop for aligning strengths, goals, and purpose.",
    description: "A guided path from reflection into direction.",
    body: [
      "Participants move through guided reflection, conversation, and practical exercises that bring strengths and aspirations into focus.",
      "That insight is then connected to real decisions, shared direction, and the next step that makes sense in context.",
    ],
    takeaway:
      "The value is not more pressure. It is clearer direction people can actually use.",
    settingsNote:
      "The structure adapts to the room while keeping the same grounded flow.",
    settings: ["Businesses", "Schools", "Community settings"],
  },
  experience: {
    eyebrow: "What You'll Experience",
    title: "A clear three-part workshop flow.",
    description: "Three parts, built to move from reflection to action.",
    items: [
      {
        title: "Guided reflection and discovery",
        description:
          "Notice the strengths, values, and aspirations already asking for attention.",
      },
      {
        title: "Practical purpose alignment exercises",
        description:
          "Connect them to the choices, responsibilities, and relationships in front of you.",
      },
      {
        title: "Planning next steps",
        description:
          "Leave with next steps that fit your life, team, or community.",
      },
    ],
    takeaway:
      "Each part is designed to move from noticing what matters to acting on it.",
  },
  connection: {
    eyebrow: "Why It Feels Different",
    title: "Not another workshop built around passive listening.",
    description:
      "It asks people to participate, reflect, and leave with something usable.",
    paragraphs: [
      "Most workshops ask people to take in more information. SparkPurpose asks them to pause, reflect, and participate.",
      "That shift changes the outcome. People leave with clearer direction, not just more notes.",
    ],
    points: [
      {
        title: "People take part",
        description:
          "Reflection and conversation are part of the work, not a break from it.",
      },
      {
        title: "Direction stays practical",
        description:
          "The session closes around usable next steps, not abstract inspiration.",
      },
    ],
    takeaway:
      "It feels more human because people are invited to bring their real questions into the room.",
    image: {
      src: reflectionImage,
      alt: "Participants gathered together during a SparkPurpose workshop activity.",
      label: "People leave with direction, not just notes.",
    },
  },
  gallery: {
    eyebrow: "In the room",
    title: "Moments from recent sessions.",
    description: "Real moments from previous workshops.",
    photos: [
      {
        src: tableConversationImage,
        alt: "People in conversation around tables during the workshop.",
      },
      {
        src: wideReflectionImage,
        alt: "Participants gathered for guided reflection in the workshop room.",
      },
      {
        src: warmConnectionImage,
        alt: "Workshop attendees listening and smiling together.",
      },
    ],
  },
  audience: {
    eyebrow: "Who It's For",
    title: "Made for different rooms, not just one kind of audience.",
    description:
      "A good fit for people and groups looking for clearer direction.",
    items: [
      {
        title: "Individuals",
        description:
          "People reconnecting strengths, purpose, and the next right step in life or work.",
      },
      {
        title: "Community members",
        description:
          "Groups building reflection, belonging, and forward movement together.",
      },
      {
        title: "Organizations",
        description:
          "Teams wanting stronger alignment and more intentional decisions.",
      },
      {
        title: "Schools",
        description:
          "Learning communities thinking about direction in a grounded, human way.",
      },
    ],
    takeaway:
      "The format adapts to the room without losing its focus.",
  },
  closing: {
    eyebrow: "Register",
    title: "Join the next session.",
    support: "Add your name to hear when the next workshop opens.",
    details: [
      ["Hosted by", "SparkPoint"],
      ["Format", "Facilitated session"],
      ["Best for", "People, teams, schools, and community settings"],
      ["Next step", "We will follow up with details"],
    ],
    ctaLabel: "Register Now",
  },
} as const;

export type PurposeWorkshopData = typeof purposeWorkshopData;
