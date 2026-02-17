'use client';

import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useState, useEffect } from 'react';
import heroImage from 'figma:asset/0c7f5d615ddb7365345eec2cd86bf98d3be9ca22.png';
import teamHeroImage from 'figma:asset/c88e8fd418fa5de2d8271a01eff7835b8bc45301.png';
import blueZonesImage from 'figma:asset/006b84f90bae2616433d7bda85278d8264e4e33c.png';
import sparkPointLaunchImage from 'figma:asset/ce8cfb7a67e4c9db354c1d7021333b647621f8d5.png';
import launchSocialImage from 'figma:asset/08d6097996fec1db647eccd1343a8e7ebf420b7b.png';
import launchGroupImage from 'figma:asset/bef0024c7f7aa5cba807241e9b1a543393d1afd6.png';
import studentVoiceImage from 'figma:asset/20c2a905251c86d5a4f9333b83199204b6928c7d.png';
import responseTeamImage from 'figma:asset/56901f1a91f140dcee14c66f977ed2a0bd9120ed.png';
import responseFlyerImage from 'figma:asset/238168330742171cebb538968793e34afcac231e.png';
import wellnessWorkshopImage from 'figma:asset/6188b8c6c445b647b8e4e9b74a1010513b0cc4b6.png';
import youthGroupImage from 'figma:asset/5b0388c9542f078a58f8b6be96161b02480d4b7d.png';
import regionalAuditoriumImage from 'figma:asset/ce0a67a45092b4432ec7c00f4a17cb5a77e95a50.png';
import seniorGatheringImage from 'figma:asset/2f54cc163c056ac592d9e429a8920f74d0a98f56.png';
import interviewFilmingImage from 'figma:asset/183c96a680c45035b0835db81082bdb93af69f97.png';
import sparkPointCommonsImage from 'figma:asset/63f606372ec6e500e9a7547d300fb9f0d31dae7e.png';
import mediaStudioImage from 'figma:asset/7c67e828e47be75e27ecc6de02db283be5ae7589.png';

import sarahHeadshotWebp from '../assets/staff_pics/webp/sp_port26__0004_sarah.webp';
import sarahHeadshotJpg from '../assets/staff_pics/sp_port26__0004_sarah.jpg';

import charlotteHeadshotWebp from '../assets/staff_pics/webp/sp_port26__0003_charlotte.webp';
import charlotteHeadshotJpg from '../assets/staff_pics/sp_port26__0003_charlotte.jpg';

import jeffHeadshotWebp from '../assets/staff_pics/webp/sp_port26__0002_jeff.webp';
import jeffHeadshotJpg from '../assets/staff_pics/sp_port26__0002_jeff.jpg';

import maggieHeadshotWebp from '../assets/staff_pics/webp/sp_port26__0001_maggie.webp';
import maggieHeadshotJpg from '../assets/staff_pics/sp_port26__0001_maggie.jpg';

import jennyHeadshotWebp from '../assets/staff_pics/webp/sp_port26__0000_jenny.webp';
import jennyHeadshotJpg from '../assets/staff_pics/sp_port26__0000_jenny.jpg';

import joshHeadshotWebp from '../assets/staff_pics/webp/sp_port26__0005_josh.webp';
import joshHeadshotJpg from '../assets/staff_pics/sp_port26__0005_josh.jpg';

import sophiaHeadshotWebp from '../assets/staff_pics/webp/sp_port26__0006_sophia.webp';
import sophiaHeadshotJpg from '../assets/staff_pics/sp_port26__0006_sophia.jpg';

import danielBoardWebp from '../assets/board_pics/webp/sp_port26_0000_daniel.webp';
import danielBoardJpg from '../assets/board_pics/sp_port26_0000_daniel.jpg';

import marshaBoardWebp from '../assets/board_pics/webp/sp_port26_0001_marsha.webp';
import marshaBoardJpg from '../assets/board_pics/sp_port26_0001_marsha.jpg';

import oraBoardWebp from '../assets/board_pics/webp/sp_port26_0002_ora.webp';
import oraBoardJpg from '../assets/board_pics/sp_port26_0002_ora.jpg';

import jeffreyBoardWebp from '../assets/board_pics/webp/sp_port26_0003_jeffrey.webp';
import jeffreyBoardJpg from '../assets/board_pics/sp_port26_0003_jeffrey.jpg';

import carolynBoardWebp from '../assets/board_pics/webp/sp_port26_0004_carolyn.webp';
import carolynBoardJpg from '../assets/board_pics/sp_port26_0004_carolyn.jpg';

import saundraBoardWebp from '../assets/board_pics/webp/sp_port26_0005_saundra.webp';
import saundraBoardJpg from '../assets/board_pics/sp_port26_0005_saundra.jpg';

import gailBoardWebp from '../assets/board_pics/webp/sp_port26_0006_gail.webp';
import gailBoardJpg from '../assets/board_pics/sp_port26_0006_gail.jpg';

import maureenBoardWebp from '../assets/board_pics/webp/sp_port26_0007_maureen.webp';
import maureenBoardJpg from '../assets/board_pics/sp_port26_0007_maureen.jpg';

import shannonBoardWebp from '../assets/board_pics/webp/sp_port26_0008_shannon.webp';
import shannonBoardJpg from '../assets/board_pics/sp_port26_0008_shannon.jpg';

import gloriaBoardWebp from '../assets/board_pics/webp/sp_port26_0009_gloria.webp';
import gloriaBoardJpg from '../assets/board_pics/sp_port26_0009_gloria.jpg';
import { Button } from '../components/ui/button';
import { TimelinePhotoStack } from '../components/TimelinePhotoStack';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../components/ui/dialog";

const blueZonesPhase = {
  phaseLabel: 'Foundational Phase',
  years: '2019–2022',
  title: 'Blue Zones Project – Brevard',
  subtitle: 'Foundational community health initiative',
  achievements: [
    'Community listening and engagement',
    'Cross-sector partnerships formed',
    'Brevard certified as a Blue Zones Community'
  ],
  legalStatus: '501(c)(3) status established (2020)'
};

const timeline = [
  { 
    year: '2023', 
    milestone: 'SparkPoint Founded', 
    description: 'A countywide nonprofit built to support connection and collaboration',
    achievements: ['Founding board assembled', 'Initial partnerships formed', 'Organizational launch'],
    gallery: [
      { src: sparkPointLaunchImage, caption: 'Launch celebration', rotation: -3 },
      { src: launchSocialImage, caption: 'Community gathering', rotation: 2 },
      { src: launchGroupImage, caption: 'Team assembly', rotation: -1.5 },
      { src: studentVoiceImage, caption: 'Voice of Students', rotation: 3 }
    ]
  },
  { 
    year: '2024', 
    milestone: 'Community Response & Coordination', 
    description: 'Supporting countywide response during Hurricane Helene',
    achievements: ['Emergency response activated', '1,200+ families assisted', 'Multi-agency coordination'],
    gallery: [
      { src: responseTeamImage, caption: 'Response Volunteers', rotation: -2 },
      { src: responseFlyerImage, caption: 'Psychological First Aid', rotation: 3 }
    ]
  },
  { 
    year: '2024', 
    milestone: 'Wellness & Connection Programs Expand', 
    description: 'Building access to support beyond Brevard',
    achievements: ['6 new wellness programs', '450+ participants', 'Peer support networks'],
    gallery: [
      { src: wellnessWorkshopImage, caption: 'Board Workshop', rotation: 2 },
      { src: youthGroupImage, caption: 'Youth Connection', rotation: -2.5 }
    ]
  },
  { 
    year: '2025', 
    milestone: 'Regional Collaboration Grows', 
    description: 'Extending SparkPoint’s connective role across Western North Carolina',
    achievements: ['3 new counties reached', '15 additional partners', 'Capacity doubled'],
    gallery: [
      { src: regionalAuditoriumImage, caption: 'Regional Summit', rotation: -3 },
      { src: seniorGatheringImage, caption: 'Community Connection', rotation: 2 },
      { src: interviewFilmingImage, caption: 'Sharing Stories', rotation: 1.5 }
    ]
  },
  {
    year: '2026',
    milestone: 'Looking Ahead',
    description: 'Deepening impact and sustainable growth',
    achievements: ['Continued regional expansion', 'New strategic initiatives', 'Building long-term resilience'],
    gallery: [
      { src: sparkPointCommonsImage, caption: 'SparkPoint Commons', rotation: -2 },
      { src: mediaStudioImage, caption: 'Media Studio', rotation: 2.5 }
    ]
  }
];

type StaffMember = {
  name: string;
  role: string;
  bio: string;
  initials?: string;
  // Legacy remote image support (still used for Olivia for now)
  headshot?: string;
  // Local portrait support (preferred): WebP + JPG fallback
  headshotWebp?: string;
  headshotJpg?: string;
  // Optional per-person crop/zoom overrides when needed
  imageClassName?: string;
};

const staff: StaffMember[] = [
  {
    name: 'Sarah Hankey',
    role: 'Founder / Executive Director',
    headshotWebp: sarahHeadshotWebp,
    headshotJpg: sarahHeadshotJpg,
    bio: `Sarah's experience in leading Brevard through the Blue Zones Certification, coupled with her background in integrative health and education, fuels her passion for driving a sustainable program that advances community well-being. She strongly believes that good health is a fundamental right that should be within reach of everyone.\n\nAs the Director of SparkPoint, Sarah places great importance on building connections, promoting resilience, and leading with empathy. She is profoundly honored and proud to be spearheading another impactful initiative throughout Transylvania County and the broader Western North Carolina region.\n\nIn addition to her role with SparkPoint, Sarah serves on the boards of the Mary C. Jenkins Community and Cultural Center, Pisgah Forest Rotary Club, and the Transylvania County Family and Consumer Science Advisory Board. Sarah was honored to be awarded the 2023 Duke Energy Citizenship & Service Award presented by the Transylvania Chamber of Commerce.`
  },
  {
    name: 'Charlotte Shackleford, EdD',
    role: 'Co-Founder / Program Manager',
    headshotWebp: charlotteHeadshotWebp,
    headshotJpg: charlotteHeadshotJpg,
    bio: `Charlotte is a longtime educator and community builder with more than 20 years of experience helping people grow and thrive. She recently completed her Doctorate in Educational Leadership from Western Carolina University, building on her background in psychology, sociology, and elementary education.\n\nCharlotte believes that strong communities are rooted in meaningful relationships. She’s passionate about promoting wellness in all areas of life — emotional, mental, and physical — and works to integrate those values into everything she does.\n\nAt SparkPoint, Charlotte brings her heart for people and her love of learning to support community well-being across Transylvania County.\n\nWhen she’s not working, you can find her outside exploring nature, spending time with friends and family, or enjoying the quiet beauty of western North Carolina.`
  },
  {
    name: 'Jeff Bannister',
    role: 'Marketing Manager',
    headshotWebp: jeffHeadshotWebp,
    headshotJpg: jeffHeadshotJpg,
    bio: `Jeff Bannister, formerly Vice President of the Board of Directors at SparkPoint, now brings his extensive experience in community engagement and leadership to his role overseeing Marketing and Operations. His commitment to inclusivity and cultural competence, developed during his tenure on the Board, is now pivotal in enhancing SparkPoint's outreach and operational effectiveness.\n\nJeff's unique ability to connect with diverse groups and his passion for community empowerment are key assets in driving the organization's mission forward, ensuring a significant and positive impact in the communities served.`
  },
  {
    name: 'Maggie Grimm',
    role: 'Outreach Coordinator',
    headshotWebp: maggieHeadshotWebp,
    headshotJpg: maggieHeadshotJpg,
    bio: `As Outreach Coordinator, Maggie helps strengthen SparkPoint’s connections across the community by building partnerships, coordinating volunteers, and ensuring residents know about available programs and resources.\n\nWith a passion for community engagement and a heart for service, Maggie brings energy and creativity to the team. From planning outreach events to supporting communications and collaborations with local organizations, they play a key role in helping SparkPoint continue to grow its impact and reach.\n\nWhen Maggie isn’t at work, you can find her exploring nature with her husband and two young kids.`
  },
  {
    name: 'Jenny Carlberg',
    role: 'Development Manager',
    headshotWebp: jennyHeadshotWebp,
    headshotJpg: jennyHeadshotJpg,
    initials: 'JC',
    bio: `Jenny Carlberg serves as SparkPoint’s Development Manager, where she leads fundraising strategy and donor engagement to support the organization’s long-term sustainability. She joined SparkPoint in November 2025 and brings more than a decade of nonprofit experience, with a focus on fundraising and grant development.\n\nJenny holds a Master of Public Administration with a concentration in nonprofit management from the University of North Carolina at Chapel Hill. Throughout her career, he has helped organizations raise millions of dollars in support of programs that strengthen community well-being and resilience.\n\nShe is especially drawn to SparkPoint’s mission of fostering community wellness through connection and is grateful to serve the Western North Carolina community she now calls home.\n\nOutside of work, Jenny enjoys hiking, camping, and traveling with her family, practicing yoga, reading, writing, and baking for friends and neighbors. She is a mom to two young daughters and a nine-year-old dog adopted from Uganda, and after living in several countries across three continents, she is deeply happy to be putting down roots in the North Carolina mountains.`,
  },
  {
    name: 'Josh Nelson',
    role: 'CPA / Financial Advisor',
    headshotWebp: joshHeadshotWebp,
    headshotJpg: joshHeadshotJpg,
    initials: 'JN',
    bio: `Josh Nelson serves as SparkPoint’s CPA and financial advisor, providing oversight and strategic guidance to ensure the organization’s financial health and long-term sustainability. With more than a decade of experience in public accounting and corporate financial reporting — including leadership roles at a top 15 U.S. public accounting firm and a Fortune Global 500 company — Josh brings deep expertise in compliance, reporting, and financial strategy.

Based in Western North Carolina, Josh partners closely with SparkPoint’s leadership to strengthen financial transparency, support responsible growth, and help steward community resources with care. He is also an active member of the Brevard/Transylvania Chamber of Commerce and the Rotary Club of Pisgah Forest.`
  },
  {
    name: 'Olivia Hankey',
    role: 'Content & Communications Intern',
    headshot: 'https://images.squarespace-cdn.com/content/v1/5e13af05d72fc96230cefbd1/72201284-5042-4368-b9b8-b64f85120734/Olivia-265.JPG?format=2500w',
    bio: `As a dedicated and involved high school senior aspiring to pursue a career in the communications field, Olivia is gaining real-world experience through her work with SparkPoint. She supports community outreach, reporting, and story-collecting efforts across programs and events.\n\nThis internship provides Olivia with hands-on learning opportunities and insight into the world of communications and reporting. She hopes to leverage this experience to shape a future career that meaningfully contributes to community well-being and professional growth.`
  },
  {
    name: 'Sophia DePasquale',
    role: 'Intern',
    headshotWebp: sophiaHeadshotWebp,
    headshotJpg: sophiaHeadshotJpg,
    initials: 'SD',
    bio: `Sophia joins the SparkPoint team as an intern, supporting our community programs and initiatives. Full bio coming soon.`
  }
];

type BoardMember = {
  name: string;
  role: string;
  bio: string;
  initials?: string;
  headshotWebp?: string;
  headshotJpg?: string;
  // legacy (not preferred)
  headshot?: string;
};

const boardMembers: BoardMember[] = [
  {
    name: 'Dr. Ora Wells',
    role: 'Board President',
    headshotWebp: oraBoardWebp,
    headshotJpg: oraBoardJpg,
    initials: 'OW',
    bio: `As a newly retired pediatrician, Dr. Ora Wells continues his lifetime passion for wellness. He served Hendersonville Pediatrics for over 30 years, specializing in ADHD, allergies, and asthma management. Dr. Wells began his medical career at the University of North Carolina at Chapel Hill and earned his medical degree from the Medical College of Georgia. He taught pediatrics as an assistant clinical professor at Charlotte Memorial Hospital, where he also completed his residency.

After teaching, Dr. Wells joined Hendersonville Pediatrics, where he practiced for decades. He regularly volunteers on medical trips to Haiti through Consider Haiti and is an avid supporter of Young Life. He enjoys traveling with his wife to visit their children and grandchildren, playing the bagpipes, and riding his motorcycle — and may be spotted around Brevard in his 1954 Chevy pickup.`
  },
  {
    name: 'Daniel Mehdi',
    role: 'Vice President',
    headshotWebp: danielBoardWebp,
    headshotJpg: danielBoardJpg,
    initials: 'DM',
    bio: `Daniel serves as Vice President of SparkPoint’s Board of Directors. Full bio coming soon.`
  },
  {
    name: 'Saundra Lemaster',
    role: 'Treasurer',
    headshotWebp: saundraBoardWebp,
    headshotJpg: saundraBoardJpg,
    initials: 'SL',
    bio: `Saundra Lemaster began her career in media sales after earning a degree in communications from the University of Kentucky. She has worked across newspaper, television, and radio in both sales and leadership roles.

She has supported numerous nonprofit initiatives, including pediatric cancer fundraising through Duke University and substance abuse recovery programs in Western North Carolina. Growing up in rural Kentucky shaped her compassion for underserved communities, a value she brings to her work with SparkPoint.`
  },
  {
    name: 'Mayor Maureen Copelof',
    role: 'Board Member',
    headshotWebp: maureenBoardWebp,
    headshotJpg: maureenBoardJpg,
    initials: 'MC',
    bio: `Maureen Copelof is a retired U.S. Navy Captain with 30 years of active-duty service. After retiring, she returned to Brevard and was elected to Brevard City Council in 2017. In November 2021, she was elected Mayor of the City of Brevard.

She holds master’s degrees in both Business Administration and Political Science. An avid gardener, Maureen is deeply committed to supporting the community’s built environment and its connection to overall well-being. She served on the Brevard Blue Zones Project Steering Committee and is proud to continue that work through SparkPoint.`
  },
  {
    name: 'Shannon Meadows Allison',
    role: 'Board Member',
    headshotWebp: shannonBoardWebp,
    headshotJpg: shannonBoardJpg,
    initials: 'SA',
    bio: `Shannon lives on her family’s multi-generational cattle farm in Transylvania County. Her lived experience with Ehlers-Danlos syndrome inspired her to pursue nursing and community health work.

She is a registered nurse, a Women’s Health Nurse Practitioner student at Duke University, and the founder of Meadows Collaborative Health & Consulting. Shannon is passionate about advancing health literacy, resilience, and healthcare access in rural communities.`
  },
  {
    name: 'Jeffrey Ambrose',
    role: 'Board Member',
    headshotWebp: jeffreyBoardWebp,
    headshotJpg: jeffreyBoardJpg,
    initials: 'JA',
    bio: `Jeffrey serves on SparkPoint’s Board of Directors. Full bio coming soon.`
  },
  {
    name: 'Carolyn Foster',
    role: 'Board Member',
    headshotWebp: carolynBoardWebp,
    headshotJpg: carolynBoardJpg,
    initials: 'CF',
    bio: `Carolyn Foster was born, raised, and educated in New Brunswick, Canada, and began her nursing career there before becoming a traveling nurse in the United States. She settled in Brevard in 1992 and worked at Transylvania Regional Hospital for nearly 29 years.

After retiring in 2021, Carolyn has focused on civic involvement and community wellbeing. She enjoys hiking, kayaking, traveling, and spending time with family.`
  },
  {
    name: 'Marsha C. Farrell',
    role: 'Board Member',
    headshotWebp: marshaBoardWebp,
    headshotJpg: marshaBoardJpg,
    initials: 'MF',
    bio: `Marsha Farrell is a retired nurse with a 44-year career, including two decades in hospice and palliative care. Her work taught her the importance of presence, purpose, and quality of life.

After moving to Brevard in 2021, Marsha became active with the Blue Zones Project as a Purpose Workshop facilitator and Potluck Moai speaker. She is passionate about helping people advocate for their quality of life and discover what matters most. Marsha and her husband Jay are deeply involved in volunteer work throughout the community.`
  },
  {
    name: 'Gail Masterson',
    role: 'Board Member',
    headshotWebp: gailBoardWebp,
    headshotJpg: gailBoardJpg,
    initials: 'GM',
    bio: `Gail serves on SparkPoint’s Board of Directors. Full bio coming soon.`
  },
  {
    name: 'Gloria Clouse',
    role: 'Board Member',
    headshotWebp: gloriaBoardWebp,
    headshotJpg: gloriaBoardJpg,
    initials: 'GC',
    bio: `Gloria serves on SparkPoint’s Board of Directors. Full bio coming soon.`
  }
];

const HEADLINE_WORDS = ['Listen', 'Learn', 'Lead', 'Built'];

export function AboutPage() {
  const [wordIndex, setWordIndex] = useState(0);
  const { scrollY } = useScroll();
  
  // Parallax effects
  const textY = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    // Only cycle if we haven't reached the last word ("Built")
    if (wordIndex < HEADLINE_WORDS.length - 1) {
      const intervalDuration = 1400; // Hold for ~1.4s
      const timer = setTimeout(() => {
        setWordIndex(prev => prev + 1);
      }, intervalDuration);
      return () => clearTimeout(timer);
    }
  }, [wordIndex]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <Helmet>
        <title>About SparkPoint | Built Through Connection</title>
        <meta name="description" content="SparkPoint’s mission, history, and community-centered approach." />
        <link rel="canonical" href="https://chfxpro.github.io/sparkpointv15/about" />
      </Helmet>

      {/* 1. Hero Section — Documentary Presence with Connection Anchor */}
      <section className="relative h-screen min-h-[650px] flex items-end justify-center overflow-hidden pb-4 md:pb-8 bg-[#0a0a0a]">
        {/* Full-width image */}
        <div className="absolute inset-x-0 bottom-0 top-12 z-0">
          <img
            src={heroImage}
            alt="Community members in conversation"
            className="w-full h-full object-cover object-top"
          />
          {/* Readability Layer: Strong Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/40 to-transparent mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ y: textY, opacity }}
            className="flex flex-col items-center justify-center"
          >
            {/* Headline Group */}
            <h1
              className="mb-2 md:mb-6 flex flex-col items-center gap-0 leading-[1.05] tracking-tight"
              style={{
                fontFamily: '"Manrope", sans-serif',
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: 800,
                color: '#F8FAFC', // Near-white (Slate-50)
                textShadow: '0 4px 24px rgba(0, 0, 0, 0.5)', // Deep soft shadow for readability
              }}
            >
              {/* Line 1: Animated Cycle */}
              <div className="h-[1.2em] relative flex items-center justify-center w-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={HEADLINE_WORDS[wordIndex]}
                    initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -20, filter: 'blur(8px)' }}
                    transition={{ 
                      duration: 0.45,
                      ease: "easeOut" 
                    }}
                    className="block"
                  >
                    {HEADLINE_WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Line 2: Static */}
              <span className="block">Through</span>

              {/* Line 3: Static */}
              <span className="block">Connection</span>
            </h1>

            {/* Supporting Text */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md antialiased"
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}
            >
              Strengthening Transylvania County by connecting people, partners, and care.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* 2. Our Story — Narrative First (Dark Theme) */}
      <section className="py-20 md:py-32 px-6 relative overflow-hidden bg-gradient-to-b from-[#0a0a0a] via-[#111111] to-[#0a0a0a]">
        {/* Subtle Texture: Topographic/Organic Lines (Extremely Low Contrast) */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none select-none">
          <svg className="w-full h-full" viewBox="0 0 1440 1200" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-200 100 C 400 300, 800 0, 1640 200" stroke="white" strokeWidth="1.5" />
            <path d="M-200 300 C 300 500, 900 200, 1640 400" stroke="white" strokeWidth="1.5" />
            <path d="M-200 500 C 500 700, 1000 400, 1640 600" stroke="white" strokeWidth="1.5" />
            <path d="M-200 700 C 600 900, 1100 600, 1640 800" stroke="white" strokeWidth="1.5" />
            <path d="M-200 900 C 700 1100, 1200 800, 1640 1000" stroke="white" strokeWidth="1.5" />
          </svg>
        </div>
        
        {/* Existing Blobs for Depth (retained but tweaked) */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#1a1a1a] rounded-full blur-[150px] pointer-events-none opacity-40 mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#151515] rounded-full blur-[120px] pointer-events-none opacity-40 mix-blend-screen" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Header as Chapter Marker */}
            <div className="mb-20 text-center md:text-left">
              <span className="block text-sm font-bold tracking-[0.2em] text-[#E03694] uppercase mb-4 opacity-90">
                Chapter One
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                Our Story
              </h2>
              <div className="h-0.5 w-16 bg-gradient-to-r from-[#E03694] to-transparent mt-6 mx-auto md:mx-0 opacity-70" />
            </div>

            {/* 2. NEW: Narrative Thesis Block */}
            <div className="mb-32 relative">
              {/* Featured Visual Accent */}
              <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-[#E03694] via-[#E03694]/50 to-transparent hidden md:block opacity-80" />
              
              <p className="text-3xl md:text-5xl text-white leading-tight font-bold mb-12 tracking-tight max-w-5xl">
                Connection is the foundation of healthy, resilient communities — but it rarely exists by accident.
              </p>
              
              <div className="space-y-8 pl-0 md:pl-0 max-w-3xl">
                <p className="text-lg md:text-xl text-gray-300 leading-loose font-light">
                  Across Transylvania County and Western North Carolina, people and organizations are doing meaningful work every day. 
                  What’s often missing is not care or effort, but the <span className="text-white font-medium">connective structure</span> that allows community voice to surface, 
                  resources to be shared openly, and collaboration to happen across sectors and geography.
                </p>
                <p className="text-lg md:text-xl text-gray-300 font-light leading-loose">
                  SparkPoint exists to strengthen that connective tissue — fostering community well-being by creating space to 
                  listen, learn together, and lead collaborative action over time.
                </p>
              </div>
            </div>

            {/* Transition: Context */}
            <div className="flex items-center gap-4 mb-16 opacity-50">
                <div className="h-px w-12 bg-white"></div>
                <span className="text-xs font-bold uppercase tracking-widest text-white">Organization History</span>
            </div>

            <div className="prose prose-lg prose-invert max-w-none text-gray-300 font-serif">
              
              {/* Part 3: Roots & Context (Blue Zones as Catalyst) */}
              <div className="space-y-12 mb-24 max-w-2xl">
                <p className="leading-loose text-gray-300/90">
                  SparkPoint grew out of a powerful insight surfaced during the Blue Zones Project in Brevard. 
                  That initiative brought residents and leaders together to understand what supports long-term health. 
                  While the process successfully certified Brevard as a Blue Zones Community, its most lasting impact wasn’t the designation itself.
                </p>

                <p className="leading-loose text-gray-300/90">
                  It was the realization that well-being requires more than temporary programs. 
                  The work revealed a deep desire for connection that extended far beyond city limits — and a clear need for a way to sustain that connection over time.
                </p>
              </div>

              {/* Part 4: The Insight (Structural Gap) */}
              <div className="my-24 py-4">
                <p className="text-2xl md:text-4xl text-white font-medium leading-tight max-w-3xl">
                  What was missing wasn’t effort or care — it was <span className="italic">shared structure</span>.
                </p>
              </div>
              
              {/* Grouped: Gap Explanation + Proof */}
              <div className="mb-32">
                 <div className="space-y-8 mb-16 max-w-2xl">
                    <p className="leading-loose text-gray-300/90">
                      Listening sessions across the county confirmed a consistent pattern. 
                      Nonprofits, healthcare providers, schools, and neighbors were all working hard, but often in isolation. 
                      Without a shared backbone to coordinate efforts, collaboration relied on goodwill rather than reliable infrastructure.
                    </p>
                    <p className="leading-loose text-gray-300/90">
                      SparkPoint was built to fill that gap. We were shaped by community partners who wanted a durable way to work together — not just for a project, but for the long haul.
                    </p>
                 </div>

                 {/* Part 6: Hurricane Helene Callout (Proof of Model) */}
                 <div className="bg-white/5 p-8 md:p-10 rounded-lg border border-white/5 backdrop-blur-sm max-w-3xl">
                   <p className="leading-loose text-white/95 text-lg mb-6">
                     When Hurricane Helene tested Transylvania County in 2024, those relationships mattered.
                     SparkPoint became a coordination point — helping information, volunteers, and resources move more clearly
                     through the community.
                   </p>
                   <p className="text-sm text-[#E03694] font-bold tracking-wide uppercase opacity-90">
                     Response Capacity Built, Not Improvised
                   </p>
                 </div>
              </div>

              {/* Part 7: Closing (System) */}
              <div className="pt-16 border-t border-white/10">
                <p className="text-xl text-white/90 leading-relaxed font-medium mb-16 max-w-4xl">
                  Today, SparkPoint serves as that connective infrastructure, operating through a continuous loop:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-4xl">
                   <div className="relative pl-6 border-l-2 border-[#E03694]">
                      <span className="block text-white font-bold text-2xl tracking-wide mb-2">Listen</span>
                      <span className="text-sm text-gray-400 leading-relaxed block">Identifying needs directly from the community source.</span>
                   </div>
                   <div className="relative pl-6 border-l-2 border-[#E03694]">
                      <span className="block text-white font-bold text-2xl tracking-wide mb-2">Learn</span>
                      <span className="text-sm text-gray-400 leading-relaxed block">Analyzing shared data to find the best path forward.</span>
                   </div>
                   <div className="relative pl-6 border-l-2 border-[#E03694]">
                      <span className="block text-white font-bold text-2xl tracking-wide mb-2">Lead</span>
                      <span className="text-sm text-gray-400 leading-relaxed block">Taking collaborative action that sticks.</span>
                   </div>
                </div>

                <p className="text-lg text-gray-300 max-w-2xl leading-loose">
                    We don’t just run programs; we build the capacity for our community to solve problems together.
                    By staying grounded in local needs and adaptable to change, we help ensure that every person has the support they need to thrive.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. Timeline / Milestones */}
      <section className="py-24 px-6 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24 relative z-10"
          >
            <span className="text-[#E03694] font-bold tracking-wider text-sm uppercase mb-3 block">Our Journey</span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Milestones of Impact</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              From the foundational Blue Zones work to our current regional role, every step has been guided by community need.
            </p>
          </motion.div>

          {/* Connector Rail Container */}
          <div className="relative max-w-5xl mx-auto">
             {/* The Rail Line (Desktop Only) */}
             <div className="absolute left-0 md:left-0 top-0 bottom-0 w-px bg-white/10 hidden md:block z-0" />

             <div className="space-y-32 md:space-y-48 pb-20">
                
                {/* ORIGIN CHAPTER: Blue Zones (2019-2022) - Text Left, Photo Right */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative group grid grid-cols-1 md:grid-cols-12 gap-12 items-center"
                >
                   {/* Rail Marker */}
                   <div className="hidden md:block absolute left-0 top-8 -translate-x-1/2 w-3 h-3 rounded-full bg-[#0057B8] shadow-[0_0_10px_rgba(0,87,184,0.5)] z-20" />

                   {/* Background Wash */}
                   <div className="absolute inset-0 -mx-6 md:-mx-12 py-12 md:py-0 bg-blue-900/5 -z-10 rounded-3xl border border-blue-500/10" />

                   {/* Text Column (Left) */}
                   <div className="col-span-1 md:col-span-7 relative z-10 md:pl-16 text-center md:text-left">
                      {/* Watermark Year */}
                      <div className="absolute -top-12 left-0 right-0 md:right-auto md:-top-16 md:-left-8 text-[5rem] md:text-[8rem] font-bold text-[#0057B8]/10 select-none pointer-events-none z-0">
                         2019
                      </div>

                      <div className="relative z-10">
                         <div className="inline-block px-3 py-1 bg-[#0057B8]/20 border border-[#0057B8]/30 rounded-full text-xs font-bold text-blue-200 mb-4 tracking-wide">
                            {blueZonesPhase.phaseLabel}
                         </div>
                         <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
                            {blueZonesPhase.title}
                         </h3>
                         <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                            {blueZonesPhase.subtitle}
                         </p>
                         <ul className="space-y-2 mb-8 inline-block text-left">
                            {blueZonesPhase.achievements.map((item, i) => (
                              <li key={i} className="flex items-center gap-3 text-gray-400 text-sm">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#0057B8]" />
                                {item}
                              </li>
                            ))}
                         </ul>
                         <div className="block">
                            <motion.div 
                               className="inline-block px-4 py-2 border bg-black/20 rounded-[12px] text-xs text-[rgb(104,114,150)] font-medium text-[15px] font-bold cursor-default"
                               style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
                               whileHover={{ 
                                 scale: 1.05, 
                                 boxShadow: "0 0 20px rgba(104, 114, 150, 0.2)",
                                 borderColor: "rgba(104, 114, 150, 0.3)"
                               }}
                               transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                               {blueZonesPhase.legalStatus}
                            </motion.div>
                         </div>
                      </div>
                   </div>

                   {/* Photo Stack (Right) */}
                   <div className="col-span-1 md:col-span-5 flex justify-center md:justify-end">
                      <TimelinePhotoStack 
                         images={[{ src: blueZonesImage, caption: 'Blue Zones Project Brevard' }]} 
                         label="Organization History"
                         milestoneYear="2019–2022"
                      />
                   </div>
                </motion.div>

                {/* Timeline Loop */}
                {timeline.map((item, index) => {
                   // Alternate layout: Even index = Photo Left (Row 2), Odd index = Text Left (Row 3)
                   const isPhotoLeft = index % 2 === 0;

                   return (
                      <motion.div 
                        key={item.milestone}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6 }}
                        className="relative group grid grid-cols-1 md:grid-cols-12 gap-12 items-center"
                      >
                         {/* Rail Marker */}
                         <div className="hidden md:block absolute left-0 top-8 -translate-x-1/2 w-3 h-3 rounded-full bg-[#E03694] border-2 border-[#0a0a0a] z-20" />
                         
                         {/* Text Column */}
                         <div className={`col-span-1 md:col-span-7 relative z-10 text-center md:text-left ${isPhotoLeft ? 'md:order-last' : 'md:order-first md:pl-16'}`}>
                            {/* Watermark Year */}
                            <div className={`absolute -top-12 left-0 right-0 md:-top-20 text-[5rem] md:text-[9rem] font-bold text-white/5 select-none pointer-events-none z-0 ${isPhotoLeft ? 'md:right-[-2rem] md:left-auto md:text-right' : 'md:left-[-2rem] md:text-left'}`}>
                               {item.year}
                            </div>
                            
                            <div className="relative z-10">
                               <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
                                  {item.milestone}
                               </h3>
                               <p className="text-lg text-gray-400 leading-relaxed mb-6">
                                  {item.description}
                               </p>
                               <div className={`flex flex-wrap gap-2 ${isPhotoLeft ? 'md:justify-end justify-center' : 'md:justify-start justify-center'}`}>
                                  {item.achievements.map((ach, i) => (
                                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full bg-[#E03694]/10 border border-[#E03694]/20 text-[#E03694] text-xs font-medium">
                                       {ach}
                                    </span>
                                  ))}
                               </div>
                            </div>
                         </div>

                         {/* Photo Stack */}
                         <div className={`col-span-1 md:col-span-5 flex justify-center ${isPhotoLeft ? 'md:order-first md:justify-start md:pl-16' : 'md:order-last md:justify-end'}`}>
                            <TimelinePhotoStack 
                               images={item.gallery} 
                               label={item.year}
                               milestoneYear={item.year}
                            />
                         </div>
                      </motion.div>
                   );
                })}

             </div>
          </div>
        </div>
      </section>

      {/* Team Hero Image */}
      <section className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={teamHeroImage} 
            alt="SparkPoint Team and Community" 
            className="w-full h-full object-cover object-[50%_25%]"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        </div>
      </section>

      {/* 4. Team & Board — Human Scale */}
      <section className="py-32 px-6 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Team</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Guided by a dedicated staff and a board of local leaders committed to the long-term well-being of our community.
            </p>
          </motion.div>

          {/* Staff Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {staff.map((member, index) => (
              <Dialog key={member.name}>
                <DialogTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-[4/5] mb-6 overflow-hidden rounded-xl bg-gray-800">
                      {member.headshotWebp && member.headshotJpg ? (
                        <picture>
                          <source srcSet={member.headshotWebp} type="image/webp" />
                          <img
                            src={member.headshotJpg}
                            alt={member.name}
                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 ${member.imageClassName || ''}`}
                          />
                        </picture>
                      ) : member.headshot ? (
                        <img
                          src={member.headshot}
                          alt={member.name}
                          className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0 ${member.imageClassName || ''}`}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] text-white/20 text-4xl font-bold">
                          {member.initials}
                        </div>
                      )}
                      {/* Name Overlay on Hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                        <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                        <p className="text-[#E03694] text-sm font-medium tracking-wide uppercase">{member.role}</p>
                      </div>
                    </div>
                  </motion.div>
                </DialogTrigger>
                  <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-2xl max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                      <div className="flex flex-col md:flex-row gap-8 items-start mb-6">
                        <div className="w-32 h-32 md:w-48 md:h-48 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                          {member.headshotWebp && member.headshotJpg ? (
                            <picture>
                              <source srcSet={member.headshotWebp} type="image/webp" />
                              <img
                                src={member.headshotJpg}
                                alt={member.name}
                                className={`w-full h-full object-cover ${member.imageClassName || ''}`}
                              />
                            </picture>
                          ) : member.headshot ? (
                            <img src={member.headshot} alt={member.name} className={`w-full h-full object-cover ${member.imageClassName || ''}`} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20 text-2xl font-bold">{member.initials}</div>
                          )}
                        </div>
                        <div>
                          <DialogTitle className="text-3xl font-bold mb-2">{member.name}</DialogTitle>
                          <DialogDescription className="text-[#E03694] font-medium uppercase tracking-wide text-sm mb-6">
                            {member.role}
                          </DialogDescription>
                          <div className="prose prose-invert prose-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {member.bio}
                          </div>
                        </div>
                      </div>
                    </DialogHeader>
                  </DialogContent>
              </Dialog>
            ))}
          </div>

          {/* Board Grid - Compact */}
          <div className="mb-20">
            <h3 className="text-2xl font-bold text-white mb-10 border-l-4 border-[#E03694] pl-4">Board of Directors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {boardMembers.map((member, index) => (
                <Dialog key={member.name}>
                  <DialogTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="group cursor-pointer"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-gray-800 border border-white/5">
                        {member.headshotWebp && member.headshotJpg ? (
                          <picture>
                            <source srcSet={member.headshotWebp} type="image/webp" />
                            <img
                              src={member.headshotJpg}
                              alt={member.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                            />
                          </picture>
                        ) : member.headshot ? (
                          <img
                            src={member.headshot}
                            alt={member.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a] text-white/20 text-3xl font-bold">
                            {member.initials}
                          </div>
                        )}

                        {/* Readability overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                        {/* Name + Role */}
                        <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform">
                          <h4 className="text-lg font-bold text-white leading-snug mb-1">{member.name}</h4>
                          <p className="text-[#E03694] text-xs font-medium tracking-wide uppercase">{member.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  </DialogTrigger>
                  <DialogContent className="bg-[#1a1a1a] border-white/10 text-white max-w-xl">
                    <DialogHeader>
                       <div className="flex gap-6 items-start">
                         <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 bg-gray-800">
                           {member.headshotWebp && member.headshotJpg ? (
                             <picture>
                               <source srcSet={member.headshotWebp} type="image/webp" />
                               <img src={member.headshotJpg} alt={member.name} className="w-full h-full object-cover" />
                             </picture>
                           ) : member.headshot ? (
                             <img src={member.headshot} alt={member.name} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-white/20 text-xl font-bold">
                               {member.initials}
                             </div>
                           )}
                         </div>
                         <div>
                           <DialogTitle className="text-xl font-bold mb-1">{member.name}</DialogTitle>
                           <p className="text-[#E03694] text-sm font-medium mb-4">{member.role}</p>
                           <DialogDescription className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                             {member.bio}
                           </DialogDescription>
                         </div>
                       </div>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
