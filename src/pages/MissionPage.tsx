'use client';

import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { useNavigate } from 'react-router';
import { 
  Heart, 
  Users, 
  Leaf, 
  Shield, 
  Sparkles, 
  Home, 
  BarChart3, 
  MessageCircle, 
  BookOpen, 
  HeartHandshake, 
  Handshake,
  Landmark,
  Sun,
  GraduationCap,
  ArrowRight,
  X,
  Radar
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useState, useRef, useEffect } from 'react';
import { useAccessibility } from '../context/AccessibilityContext';
import { SEOHead } from '../components/SEOHead';
import { KeepExploringLinks } from '../components/KeepExploringLinks';
import sparkPointIcon from 'figma:asset/046ca85659860578eeeab6a45f52700c54c519a3.png';
import stickyBackground from 'figma:asset/c4e1406ca17d5d9941f67714b4ad381639235894.png';
import stickyBackgroundWebp from '../assets/compd/c4e1406ca17d5d9941f67714b4ad381639235894.webp';
import learningImg from 'figma:asset/ce0a67a45092b4432ec7c00f4a17cb5a77e95a50.png';
import voiceImg from 'figma:asset/90544aa933b2c117f40fb5271f7b12942198041b.png';
import partnersImg from 'figma:asset/5463509e242f1244d018bbff5b9c9fc1831a9b2f.png';
import preparednessImg from 'figma:asset/56901f1a91f140dcee14c66f977ed2a0bd9120ed.png';

// --- DATA: Sectors & Partners ---

type Sector = {
  id: string;
  title: string;
  description: string;
  color: string;
  icon: any; // LucideIcon
  partners: string[];
  examples?: string[];
};

const SECTORS_DATA: Sector[] = [
  {
    id: 'edu-youth',
    title: 'Education & Youth',
    description: 'Learning, youth leadership, and school-connected support.',
    color: '#FDB515', // Gold
    icon: GraduationCap,
    partners: [
      'TCS',
      'Blue Ridge Community College',
      'Brevard College',
      'TC Strong',
      'Boys & Girls Club of Transylvania County',
      'El Centro',
      'Brevard Academy',
      'Mountain Sun Community School',
      'Rise & Shine Afterschool Program',
      'Brevard Music Center Institute',
      'Eagles Nest Camp',
      'UNC Chapel Hill, Gillings School of Public Health',
      'Mountain Roots',
      'Smart Start of Transylvania County',
      'VISION Transylvania',
      'Transylvania County Education Foundation'
    ],
    examples: ['School and youth coordination', 'Community leadership development']
  },
  {
    id: 'nonprofit-community',
    title: 'Nonprofit & Community',
    description: 'Community-serving organizations working together on access and support.',
    color: '#E03694', // Pink
    icon: HeartHandshake,
    partners: [
      'The Hunger Coalition',
      'Just Economics of Western North Carolina',
      'FWRD Transylvania (LTRG)',
      'Through the Trees',
      'Housing Assitance',
      'Camp Bluebird',
      'Friends of Rosman',
      'Meals on Wheels',
      'Bread of Life',
      'The Sharing House',
      'Pisgah Legal Services',
      'Habitat for Humanity Transylvania County',
      'Center for Trauma Resilient Communities',
      'Jameson’s Joy',
      'Transylvania County Arts Council',
      'Transylvania County Tourism Development Authority'
    ],
    examples: ['Resource sharing and referral', 'Community recovery collaboration']
  },
  {
    id: 'civic-government',
    title: 'Civic & Government',
    description: 'Public and civic leadership supporting countywide resilience.',
    color: '#F15F48', // Orange/Red
    icon: Landmark,
    partners: [
      'Transylvania County',
      'City of Brevard',
      'Town of Rosman',
      'Transylvania County Sheriff’s Office',
      'Brevard/Transylvania Chamber of Commerce',
      'Rotary Club of Pisgah Forest',
      'AAUW',
      'Mary C Jenkins Community & Cultural Center',
      'Looking Glass, CPA'
    ],
    examples: ['Civic partnerships', 'Local leadership coordination']
  },
  {
    id: 'health-wellness',
    title: 'Health & Wellness',
    description: 'Health systems and wellness partners strengthening community care.',
    color: '#9E509F', // Purple
    icon: Heart,
    partners: [
      'UNC Health Pardee',
      'Transylvania Regional Hospital',
      'Transylvania Public Health Department',
      'TREND 2.0 - Mental Health',
      'Hendersonville Pediatrics',
      'CARE Coalition'
    ],
    examples: ['Whole-person wellness collaboration', 'Community mental health support']
  },
  {
    id: 'business',
    title: 'Business',
    description: 'Business partners supporting workforce and opportunity pathways.',
    color: '#4F46E5', // Indigo
    icon: Handshake,
    partners: [
      'Alulua (formally TVS)',
      'Schenck Jobs Corps Civilian Conservation Center'
    ],
    examples: ['Workforce and opportunity partnerships', 'Industry collaboration']
  },
  {
    id: 'sponsors-funders',
    title: 'Sponsors & Funders',
    description: 'Funders and sponsors helping sustain long-term impact.',
    color: '#14B8A6', // Teal
    icon: Sparkles,
    partners: [
      'Dogwood Health Trust',
      'Lake Toxaway Charitites',
      'WNC Bridge Foundation',
      'Vaya Health',
      'The American Red Cross',
      'St. Phillips Episcopal Church',
      'Pisgah Health Foundation'
    ],
    examples: ['Sustained funding partnerships', 'Strategic investment in resilience']
  },
];

// --- COMPONENTS ---

// 1. Listen • Learn • Lead Diagram (Preserved)
function ListenLearnLeadDiagram() {
  const [hoveredArc, setHoveredArc] = useState<string | null>(null);
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const prefersReducedMotion = systemReducedMotion || motionPreference === 'reduce';

  useEffect(() => {
    if (import.meta.env.DEV) {
      const svg = document.querySelector('svg[viewBox="0 0 900 900"]') as SVGElement | null;
      const wrapper = document.querySelector('[data-engine-wrapper]') as HTMLElement | null;
      const svgRect = svg?.getBoundingClientRect();
      const wrapperRect = wrapper?.getBoundingClientRect();
      console.log('ListenLearnLeadDiagram mounted', { svgRect, wrapperRect });
    }
  }, []);

  // Configuration for the 3 Arcs
  const arcs = [
    {
      id: 'listen',
      label: 'Listen',
      color: '#FDB515', // Gold
      startAngle: -145,
      endAngle: -35,
      centerAngle: -105,
      nodes: [
        { icon: BarChart3, label: 'Community Research', angle: -125 },
        { icon: MessageCircle, label: 'Story Collection', angle: -55 },
      ]
    },
    {
      id: 'lead', // Right
      label: 'Lead',
      color: '#F15F48', // Red/Orange
      startAngle: -25,
      endAngle: 85,
      centerAngle: 30,
      nodes: [
        { icon: Handshake, label: 'Collaborative Initiatives', angle: 5 },
        { icon: Home, label: 'Community Resilience Projects', angle: 65 },
      ]
    },
    {
      id: 'learn', // Left
      label: 'Learn',
      color: '#9E509F', // Purple
      startAngle: 95,
      endAngle: 205,
      centerAngle: 150,
      nodes: [
        { icon: BookOpen, label: 'Community Education & Training', angle: 125 },
        { icon: HeartHandshake, label: 'Leadership & Well-Being Programs', angle: 185 },
      ]
    }
  ];

  // Helper to calculate SVG path for an arc
  const createArcPath = (startAngle: number, endAngle: number, radius: number, cx: number, cy: number) => {
    const start = polarToCartesian(cx, cy, radius, endAngle);
    const end = polarToCartesian(cx, cy, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    return [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");
  };

  // Helper to calculate a subtle curved connector path (quadratic Bezier)
  const createConnectorPath = (
    startAngle: number,
    startRadius: number,
    endRadius: number,
    curvature: number
  ) => {
    const start = polarToCartesian(center, center, startRadius, startAngle);
    const end = polarToCartesian(center, center, endRadius, startAngle);

    // Perpendicular unit vector (approx) to create a gentle curve
    const angleRad = (startAngle - 90) * Math.PI / 180.0;
    const perpX = -Math.sin(angleRad);
    const perpY = Math.cos(angleRad);

    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;

    const ctrlX = midX + perpX * curvature;
    const ctrlY = midY + perpY * curvature;

    return `M ${start.x} ${start.y} Q ${ctrlX} ${ctrlY} ${end.x} ${end.y}`;
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  // Diagram dimensions
  const size = 900;
  const center = size / 2;
  const arcRadius = 210;
  // Pull nodes in so icons + labels stay inside the rounded container and never overlap the cards below.
  // (This is the main fix for the bottom cropping / overlap you’re seeing.)
  const nodeRadius = 290;

  // Small global correction for the HTML node layer (icons + labels) to match the SVG endpoints.
  const nodeLayerNudge = { x: -10, y: 0 };

  // Per-node ICON nudges (in px) to fine-tune icon placement relative to connector endpoints.
  // Negative dx = left, negative dy = up.
  const NODE_ICON_OVERRIDES: Record<string, { dx: number; dy: number }> = {
    // Yellow + Orange nodes were still landing a touch down/right from the connector endpoint.
    // Nudge slightly further up/left so the icon circle center sits right on the connector end.
    'Story Collection': { dx: -14, dy: -12 },
    'Collaborative Initiatives': { dx: -10, dy: -10 },
  };

  // Keep node centers mathematically derived from the same polar coordinates as the SVG,
  // then apply a small global nudge + optional per-node override.
  const getNodeNudgePx = (label: string) => {
    const o = NODE_ICON_OVERRIDES[label];
    return {
      x: nodeLayerNudge.x + (o?.dx ?? 0),
      y: nodeLayerNudge.y + (o?.dy ?? 0),
    };
  };

  // Deterministic label offsets per node (prevents endless micro-misalignment iterations)
  // Values are relative to the ICON center (the node circle). Tweak here, not by changing radii.
  const NODE_LABEL_OVERRIDES: Record<string, { dx: number; dy: number; width?: number; textAlign?: React.CSSProperties['textAlign'] }> = {
    'Community Research': { dx: -92, dy: 44, width: 210, textAlign: 'right' },
    'Story Collection': { dx: -78, dy: -40, width: 190, textAlign: 'right' },
    'Collaborative Initiatives': { dx: 0, dy: -40, width: 260, textAlign: 'center' },
    'Community Resilience Projects': { dx: 150, dy: -40, width: 300, textAlign: 'left' },
    'Community Education & Training': { dx: 92, dy: 40, width: 240, textAlign: 'left' },
    // Bottom label needs to stay inside the rounded frame and above the cards below
    'Leadership & Well-Being Programs': { dx: 0, dy: 56, width: 260, textAlign: 'center' },
  };

  // Fallback placement (used if we ever add nodes without overrides)
  const getNodeLabelPlacement = (label: string, angle: number) => {
    const override = NODE_LABEL_OVERRIDES[label];
    if (override) {
      return {
        dx: override.dx,
        dy: override.dy,
        textAlign: override.textAlign ?? 'center',
        width: override.width ?? 220,
      };
    }

    // Default: push label outward along the radial direction with safe bottom bias
    const rad = (angle - 90) * Math.PI / 180.0;
    const ux = Math.cos(rad);
    const uy = Math.sin(rad);

    const dist = 52;
    let dx = ux * dist;
    let dy = uy * dist;

    const isRight = ux > 0.25;
    const isLeft = ux < -0.25;
    const isBottom = uy > 0.55;

    const textAlign: React.CSSProperties['textAlign'] = isRight ? 'left' : isLeft ? 'right' : 'center';

    if (isBottom) dy -= 34;

    return { dx, dy, textAlign, width: 220 };
  };

  const getLabelNudgePx = (arcId: string) => {
    // LISTEN pill reads optically right-heavy; nudge left more than the others
    if (arcId === 'listen') return { x: -18, y: 0 };
    return { x: 0, y: 0 };
  };

  return (
    <div className="relative w-full h-full mx-auto flex flex-col md:block items-center justify-center">
      
      {/* --- Desktop/Tablet SVG Diagram --- */}
      <div className="hidden md:block relative w-full h-full">
        <div className="absolute inset-0">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          preserveAspectRatio="xMidYMid meet"
          className="absolute inset-0 w-full h-full block overflow-hidden"
        >
          <defs>
            {arcs.map(arc => (
              <radialGradient key={arc.id} id={`grad-${arc.id}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="40%" stopColor={arc.color} stopOpacity="0.1" />
                <stop offset="100%" stopColor={arc.color} stopOpacity="0" />
              </radialGradient>
            ))}
            <filter id="glow-strong">
              <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="glow-soft">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Institutional Outer Ring Gradient */}
            <linearGradient id="outer-ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E03694" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#9E509F" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#FDB515" stopOpacity="0.25" />
            </linearGradient>
          </defs>

          {/* Institutional Outer Ring */}
          <motion.circle
            cx={center}
            cy={center}
            r={arcRadius + 60}
            fill="none"
            stroke="url(#outer-ring-grad)"
            strokeWidth="2"
            opacity="0.4"
            animate={
              prefersReducedMotion
                ? {}
                : { opacity: [0.35, 0.5, 0.35] }
            }
            transition={
              prefersReducedMotion
                ? {}
                : { duration: 8, repeat: Infinity, ease: "easeInOut" }
            }
          />

          {/* Arc Group */}
          <g>
            {arcs.map((arc) => {
              const isHovered = hoveredArc === arc.id;
              const isDimmed = hoveredArc && hoveredArc !== arc.id;
              
              return (
                <g key={arc.id} 
                   onMouseEnter={() => setHoveredArc(arc.id)}
                   onMouseLeave={() => setHoveredArc(null)}
                   className="cursor-pointer transition-opacity duration-500"
                   style={{ opacity: isDimmed ? 0.3 : 1 }}
                >
                  {/* Connector Lines to Nodes */}
                  {arc.nodes.map((node, i) => {
                    // End the connector at the same radial position as the HTML node icon center
                    const endRadius = nodeRadius;
                    const startPos = polarToCartesian(center, center, arcRadius + 18, node.angle);
                    const endPos = polarToCartesian(center, center, endRadius, node.angle);
                    const connectorD = createConnectorPath(
                      node.angle,
                      arcRadius + 18,
                      endRadius,
                      isHovered ? 24 : 14
                    );

                    return (
                      <>
                        {/* Curved connector with subtle pulse on hover */}
                        <motion.path
                          key={i}
                          d={connectorD}
                          fill="none"
                          stroke={arc.color}
                          strokeWidth={isHovered ? 2.25 : 1.25}
                          strokeLinecap="round"
                          initial={false}
                          strokeDasharray={isHovered ? "6 10" : "1 0"}
                          animate={
                            prefersReducedMotion
                              ? { opacity: isHovered ? 0.9 : 0.45 }
                              : {
                                  opacity: isHovered ? 0.92 : 0.45,
                                  strokeDashoffset: isHovered ? [0, -32] : 0
                                }
                          }
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : isHovered
                                ? { duration: 1.6, repeat: Infinity, ease: "linear" }
                                : { duration: 0.35, ease: "easeOut" }
                          }
                          style={{
                            filter: isHovered ? "url(#glow-soft)" : "none"
                          }}
                        />

                        {/* Node endpoint dot */}
                        <motion.circle
                          cx={endPos.x}
                          cy={endPos.y}
                          r={isHovered ? 4 : 3}
                          fill={arc.color}
                          initial={false}
                          animate={{
                            opacity: isHovered ? 1 : 0.6,
                            scale: isHovered ? 1.18 : 1
                          }}
                          transition={{
                            duration: prefersReducedMotion ? 0 : 0.25
                          }}
                          style={{
                            filter: isHovered ? "url(#glow-soft)" : "none"
                          }}
                        />
                      </>
                    );
                  })}

                  {/* Arc Segment */}
                  <motion.path
                    d={createArcPath(arc.startAngle, arc.endAngle, arcRadius, center, center)}
                    fill="none"
                    stroke={arc.color}
                    strokeWidth="42"
                    strokeLinecap="round"
                    strokeDasharray="600"
                    initial={false}
                    animate={{
                      pathLength: 1,
                      opacity: 1,
                      scale: isHovered ? 1.03 : 1
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 1.2,
                      ease: "easeOut"
                    }}
                    style={{
                      filter: isHovered ? "url(#glow-strong)" : "none",
                      transformOrigin: `${center}px ${center}px`
                    }}
                    className="transition-all duration-300"
                  />
                  <motion.path
                    d={createArcPath(arc.startAngle, arc.endAngle, arcRadius, center, center)}
                    fill="none"
                    stroke="rgba(255,255,255,0.16)"
                    strokeWidth="18"
                    strokeLinecap="round"
                    initial={false}
                    animate={{
                      opacity: isHovered ? 0.22 : 0.12
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.35,
                      ease: "easeOut"
                    }}
                    style={{
                      filter: isHovered ? "url(#glow-soft)" : "none"
                    }}
                    pointerEvents="none"
                  />
                </g>
              );
            })}
          </g>
        </svg>
        {/* HTML Layer for Interactivity & Labels */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Center Hub */}
          <motion.div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20 pointer-events-auto"
            initial={false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.8,
              delay: prefersReducedMotion ? 0 : 0.2
            }}
          >
            <div className="relative w-32 h-32 rounded-full bg-[#1A1A1A] border-2 border-[#E03694] flex items-center justify-center shadow-[0_0_40px_rgba(224,54,148,0.4)]">
              {/* Inner Spark */}
              <motion.div 
                className="absolute inset-0 rounded-full"
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(224,54,148,0.15)",
                    "0 0 35px rgba(224,54,148,0.35)",
                    "0 0 15px rgba(224,54,148,0.15)"
                  ]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="text-center z-10">
                <img 
                  src={sparkPointIcon} 
                  alt="Connection" 
                  className="w-12 h-12 mx-auto mb-1 object-contain"
                />
                <span className="text-white font-bold text-sm tracking-wider uppercase">Connection</span>
              </div>
              
              {/* Decorative Brackets */}
              <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-[#E03694]" />
              <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-[#E03694]" />
              <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-[#E03694]" />
              <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-[#E03694]" />
            </div>
          </motion.div>

          {/* Arc Labels & Nodes */}
          {arcs.map((arc) => {
            // Position labels using the same SVG geometry, then convert to % so they stay locked to the ring
            const labelR = arcRadius - 2; // sit on the ring; slight inward nudge avoids clipping
            const labelPosPx = polarToCartesian(center, center, labelR, arc.centerAngle);
            const labelPos = { x: (labelPosPx.x / size) * 100, y: (labelPosPx.y / size) * 100 };
            const isHovered = hoveredArc === arc.id;
            const isDimmed = hoveredArc && hoveredArc !== arc.id;

            return (
              <div key={arc.id} className={`transition-opacity duration-500 ${isDimmed ? 'opacity-30' : 'opacity-100'}`}>
                {/* Arc Label */}
                <div 
                  className="absolute pointer-events-auto cursor-pointer"
                  style={{
                    left: `${labelPos.x}%`,
                    top: `${labelPos.y}%`,
                    transform: `translate(-50%, -50%) translate(${getLabelNudgePx(arc.id).x}px, ${getLabelNudgePx(arc.id).y}px)`
                  }}
                  onMouseEnter={() => setHoveredArc(arc.id)}
                  onMouseLeave={() => setHoveredArc(null)}
                >
                  <span
                    className="text-white font-bold sp-text-xl uppercase tracking-widest px-4 py-1.5 rounded-full border"
                    style={{
                      textShadow: `0 2px 12px rgba(0,0,0,0.55)`,
                      background: isHovered
                        ? `linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.36) 100%)`
                        : `linear-gradient(180deg, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0.30) 100%)`,
                      borderColor: isHovered ? `${arc.color}66` : `rgba(255,255,255,0.10)`,
                      boxShadow: isHovered
                        ? `0 0 26px ${arc.color}55, inset 0 0 0 1px rgba(255,255,255,0.06)`
                        : `inset 0 0 0 1px rgba(255,255,255,0.05)`,
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)'
                    }}
                  >
                    {arc.label}
                  </span>
                </div>

                {/* Nodes */}
                {arc.nodes.map((node, i) => {
                  // Compute node position in the same coordinate space as the SVG, then convert to %.
                  // This keeps the HTML node centers locked to the SVG connector endpoint dots.
                  const nodePosPx = polarToCartesian(center, center, nodeRadius, node.angle);
                  const nodePos = {
                    x: (nodePosPx.x / size) * 100,
                    y: (nodePosPx.y / size) * 100
                  };
                  const NodeIcon = node.icon;

                  return (
                    <motion.div
                      key={i}
                      className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2"
                      style={{
                        left: `${nodePos.x}%`,
                        top: `${nodePos.y}%`
                      }}
                      initial={false}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: prefersReducedMotion ? 0 : 0.5,
                        delay: prefersReducedMotion ? 0 : 0.6 + i * 0.1
                      }}
                      onMouseEnter={() => setHoveredArc(arc.id)}
                      onMouseLeave={() => setHoveredArc(null)}
                    >
                      {/* Nudge wrapper: keeps icon centers aligned to connector endpoints */}
                      <div
                        className="relative w-12 h-12"
                        style={{
                          transform: `translate(${getNodeNudgePx(node.label).x}px, ${getNodeNudgePx(node.label).y}px)`
                        }}
                      >
                        {/* Anchor point is the icon circle center (matches SVG endpoint dot) */}
                        <motion.div
                          className="absolute inset-0 rounded-full bg-[#1A1A1A] border flex items-center justify-center shadow-lg"
                          style={{ borderColor: arc.color }}
                          whileHover={{
                            scale: 1.15,
                            y: -4,
                            boxShadow: `0 0 25px ${arc.color}80`,
                            backgroundColor: '#2a2a2a'
                          }}
                        >
                          <NodeIcon size={20} style={{ color: arc.color }} />
                        </motion.div>

                        {/* Label is positioned OUTWARD along the radial direction to avoid overlaps */}
                        {(() => {
                          const place = getNodeLabelPlacement(node.label, node.angle);
                          return (
                            <div
                              className="absolute"
                              style={{
                                left: '50%',
                                top: '50%',
                                transform: `translate(-50%, -50%) translate(${place.dx}px, ${place.dy}px)`,
                                width: place.width,
                                pointerEvents: 'none',
                                textAlign: place.textAlign
                              }}
                            >
                              <span
                                className="block text-white/90 sp-text-base font-medium"
                                style={{ textShadow: '0 2px 10px rgba(0,0,0,0.55)' }}
                              >
                                {node.label}
                              </span>
                            </div>
                          );
                        })()}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            );
          })}
        </div>
        </div>
      </div>

      {/* --- Mobile View (Stacked) --- */}
      <div className="md:hidden w-full flex flex-col items-center space-y-8 py-8">
        {/* Center Hub Mobile */}
        <div className="relative w-28 h-28 rounded-full bg-[#1A1A1A] border-2 border-[#E03694] flex items-center justify-center shadow-[0_0_30px_rgba(224,54,148,0.3)] mb-4">
          <img 
            src={sparkPointIcon} 
            alt="Connection" 
            className="w-8 h-8 object-contain mb-1"
          />
          <span className="text-white font-bold text-xs uppercase block text-center">Connection</span>
        </div>

        {/* Stacked Arcs */}
        <div className="w-full space-y-6">
          {arcs.map((arc) => (
            <div key={arc.id} className="bg-white/5 rounded-2xl p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-10 rounded-full" style={{ backgroundColor: arc.color }} />
                <h3 className="text-2xl font-bold text-white tracking-wide">{arc.label}</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {arc.nodes.map((node, i) => {
                  const NodeIcon = node.icon;
                  return (
                    <div key={i} className="flex items-center gap-4">
                      <div 
                        className="w-10 h-10 rounded-full bg-black/40 border flex-shrink-0 flex items-center justify-center"
                        style={{ borderColor: arc.color }}
                      >
                        <NodeIcon size={18} style={{ color: arc.color }} />
                      </div>
                      <span className="text-white/80 text-sm font-medium">{node.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 2. Animated Stacked Anchor Component
function StackedAnchor() {
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Listening", "Learning", "Leading", "Strengthened"];
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const prefersReducedMotion = systemReducedMotion || motionPreference === 'reduce';
  
  useEffect(() => {
    // Only cycle if we haven't reached the last word AND reduced motion is not active
    if (prefersReducedMotion) return;

    if (wordIndex < words.length - 1) {
      const timer = setTimeout(() => {
        setWordIndex(prev => prev + 1);
      }, 1500); // Calm pacing: 1.5s per word
      return () => clearTimeout(timer);
    }
  }, [wordIndex, words.length, prefersReducedMotion]);

  const fontStyles = {
    fontFamily: '"Manrope", sans-serif',
    fontSize: 'clamp(2.5rem, 7vw, 4.625rem)', // Reduced min size
    fontWeight: 800,
    lineHeight: '1.15',
    letterSpacing: '-0.02em',
    textShadow: '0px 0px 4px rgba(0, 0, 0, 0.25)',
  };

  return (
    <div className="flex flex-col items-center justify-center mb-10">
      {/* Container for animated text - increased height to prevent cropping */}
      <div 
        className="h-[1.4em] relative flex items-center justify-center w-full overflow-hidden"
        style={fontStyles}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={words[wordIndex]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="block text-white"
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>
      
      <span 
        className="block text-white mt-1"
        style={fontStyles}
      >
        Through
      </span>
      
      <span 
        className="block text-white mt-1"
        style={fontStyles}
      >
        Connection
      </span>
    </div>
  );
}

// 3. Main Page Component
export function MissionPage() {
  const navigate = useNavigate();
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [engineDebug, setEngineDebug] = useState<{
    width: number;
    isMd: boolean;
    display: string;
    wrapperRect?: DOMRect;
    svgRect?: DOMRect;
  } | null>(null);
  const systemReducedMotion = useReducedMotion();
  const { motionPreference } = useAccessibility();
  const prefersReducedMotion = systemReducedMotion || motionPreference === 'reduce';
  
  // Scroll Parallax Hooks
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], [0, 200]); // Moves slower than scroll

  // Scroll Helpers
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const svg = document.querySelector('svg[viewBox="0 0 900 900"]') as SVGElement | null;
    const wrapper = document.querySelector('[data-engine-wrapper]') as HTMLElement | null;
    const display = wrapper ? window.getComputedStyle(wrapper).display : 'n/a';
    setEngineDebug({
      width: window.innerWidth,
      isMd: window.matchMedia('(min-width: 768px)').matches,
      display,
      wrapperRect: wrapper?.getBoundingClientRect(),
      svgRect: svg?.getBoundingClientRect()
    });
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden" ref={containerRef}>
      {import.meta.env.DEV && engineDebug && (
        <div className="fixed bottom-4 right-4 z-[9999] rounded-lg bg-black/80 text-white text-xs px-3 py-2 font-mono shadow-lg">
          <div>width: {engineDebug.width}</div>
          <div>md: {engineDebug.isMd ? 'true' : 'false'}</div>
          <div>display: {engineDebug.display}</div>
          <div>wrapper: {Math.round(engineDebug.wrapperRect?.width || 0)}×{Math.round(engineDebug.wrapperRect?.height || 0)}</div>
          <div>svg: {Math.round(engineDebug.svgRect?.width || 0)}×{Math.round(engineDebug.svgRect?.height || 0)}</div>
        </div>
      )}
      <SEOHead
        title="Our Mission | SparkPoint"
        description="Explore SparkPoint’s mission to foster community well-being through listening, shared learning, and collaborative leadership across Western North Carolina."
        path="/mission"
      />
      {/* 1. Immersive Sticky Background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Animated Gradient Background */}
        <motion.div 
          style={{ y: backgroundY }} // Parallax Effect
          className="absolute inset-0 w-full h-[120%]" // Taller to allow parallax movement
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              background: `center / cover no-repeat url(${stickyBackground})`,
              backgroundImage: `image-set(
                url("${stickyBackgroundWebp}") type("image/webp"),
                url("${stickyBackground}") type("image/png")
              )`,
            }}
          />
          
          {/* Subtle Gradient Overlay for Text Legibility (Match Homepage Vibe) */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </motion.div>
      </div>

      {/* 2. Hero Content (Transparent) */}
      <section className="relative z-10 pt-48 pb-32 px-6 min-h-[90vh] flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl mx-auto"
        >
          {/* Stacked Animated Anchor */}
          <StackedAnchor />
          
          <div className="max-w-2xl mx-auto mb-12">
            {/* Option C (refined): Mission Statement label + readable glass scrim */}
            <div
              className="relative mx-auto rounded-2xl px-6 py-6 md:px-8 md:py-7 border border-white/10 shadow-xl"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.42) 55%, rgba(0,0,0,0.58) 100%)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 18px 50px rgba(0,0,0,0.45)'
              }}
            >
              {/* subtle highlight ring */}
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{
                  boxShadow: 'inset 0 0 0 1px rgba(224,54,148,0.14), inset 0 0 40px rgba(224,54,148,0.08)'
                }}
              />

              <div className="relative">
                <div className="flex items-center justify-center mb-5">
                  {/* Engraved label (etched text + hairline rules) */}
                  <div className="relative inline-flex items-center justify-center px-2">
                    <span
                      aria-hidden="true"
                      className="hidden sm:block w-16 md:w-20 h-px"
                      style={{
                        background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.28) 45%, rgba(255,255,255,0.06) 100%)'
                      }}
                    />

                    <span
                      className="mx-3 md:mx-4 text-[0.95rem] md:text-[1.02rem] font-semibold uppercase"
                      style={{
                        letterSpacing: '0.26em',
                        color: 'rgba(255,255,255,0.62)',
                        textShadow: '0 1px 0 rgba(0,0,0,0.55), 0 -1px 0 rgba(255,255,255,0.08)'
                      }}
                    >
                      Mission Statement
                    </span>

                    <span
                      aria-hidden="true"
                      className="hidden sm:block w-16 md:w-20 h-px"
                      style={{
                        background: 'linear-gradient(90deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.28) 55%, rgba(255,255,255,0) 100%)'
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <h1
                    className="text-xl md:text-2xl text-white font-semibold leading-relaxed"
                    style={{ textShadow: '0 8px 28px rgba(0,0,0,0.55)' }}
                  >
                    SparkPoint fosters community well-being rooted in connection.
                  </h1>
                  {/* Elegant divider */}
                  <div className="flex items-center justify-center py-2" aria-hidden="true">
                    <svg
                      width="320"
                      height="14"
                      viewBox="0 0 320 14"
                      className="w-[240px] md:w-[320px] h-[14px]"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 7H142"
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                      <path
                        d="M178 7H314"
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                      <path
                        d="M160 1L166 7L160 13L154 7L160 1Z"
                        fill="rgba(255,255,255,0.14)"
                        stroke="rgba(255,255,255,0.22)"
                        strokeWidth="1"
                      />
                    </svg>
                  </div>
                  <p
                    className="text-lg md:text-xl font-serif italic leading-relaxed"
                    style={{
                      color: 'rgba(255,255,255,0.86)',
                      textShadow: '0 10px 28px rgba(0,0,0,0.60)'
                    }}
                  >
                    We strengthen Transylvania County by aligning people and organizations around community voice—so resources are shared openly, trust grows, and our region becomes more resilient over time.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Micro-Nav Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { label: 'How We Work', target: 'section-framework' },
              { label: 'What It Looks Like', target: 'section-practice' },
              { label: 'Who We Work With', target: 'section-network' }
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => scrollToSection(btn.target)}
                className="px-6 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-sm font-semibold tracking-wide hover:bg-white hover:text-[#E03694] transition-all shadow-sm"
              >
                {btn.label} &darr;
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 3. A Feedback Loop Rooted in Community (Listen. Learn. Lead.) - Semi-Transparent Dark */}
      <section id="section-framework" className="relative z-10 py-16 md:py-28 px-4 bg-[#121214]/90 backdrop-blur-xl border-t border-white/5">
        <div className="max-w-6xl mx-auto">
           {/* Section Header */}
           <motion.div 
             className="text-center mb-10 md:mb-16 max-w-3xl mx-auto"
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
           >
              <h2 className="text-white text-3xl md:text-5xl font-bold mb-4 md:mb-6 tracking-tight">
                A Feedback Loop Rooted in Community
              </h2>
              <p className="text-white/60 text-lg md:text-xl font-light mb-6 md:mb-8">
                How SparkPoint turns listening into action.
              </p>
              <div className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-[#E03694] tracking-widest uppercase mb-4">
                The Engine
              </div>
           </motion.div>

           {/* Diagram */}
           <motion.div 
             className="relative rounded-[32px] md:rounded-[40px] bg-[#000000]/40 border border-white/10 shadow-2xl overflow-hidden p-8 md:p-12 pt-8 md:pt-10 pb-16 md:pb-20 mb-12 md:mb-20"
             initial={{ opacity: 0, scale: 0.98 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             style={{ boxShadow: '0 25px 60px rgba(0,0,0,0.5)' }}
           >
              <div className="hidden md:flex w-full items-center justify-center" data-engine-wrapper>
                {/* Responsive square: cannot exceed container width, capped by viewport height */}
                <div
                  className="relative flex items-center justify-center w-full"
                  style={{ maxWidth: 900, aspectRatio: '1 / 1', maxHeight: '78vh' }}
                >
                  {/* Optical nudge up so the diagram sits centered inside the rounded frame */}
                  <div className="relative w-full h-full" style={{ transform: 'translateY(-10px)' }}>
                    <ListenLearnLeadDiagram />
                  </div>
                </div>
              </div>

              {/* Mobile-Specific Guided Sequence */}
              <div className="md:hidden">
                 <div className="flex flex-col relative">
                    {/* Continuous Vertical Spine */}
                    <div className="absolute left-8 top-16 bottom-10 w-0.5 bg-gradient-to-b from-[#FDB515] via-[#9E509F] to-[#F15F48] opacity-30" />
                    
                    {/* Connection Anchor */}
                    <div className="flex items-center gap-5 mb-10 relative z-10">
                       <div className="w-16 h-16 rounded-full bg-[#1A1A1A] border-2 border-[#E03694] flex flex-shrink-0 items-center justify-center shadow-[0_0_20px_rgba(224,54,148,0.3)] relative">
                          <img src={sparkPointIcon} alt="" className="w-8 h-8 object-contain" />
                       </div>
                       <div>
                          <h3 className="text-white font-bold text-lg uppercase tracking-widest">Connection</h3>
                          <p className="text-white/60 text-sm mt-0.5">The engine that drives our work</p>
                       </div>
                    </div>

                    {/* Phases */}
                    {[
                      {
                        title: 'Listen',
                        color: '#FDB515',
                        items: [
                          { icon: BarChart3, label: 'Community Research' },
                          { icon: MessageCircle, label: 'Story Collection' }
                        ]
                      },
                      {
                        title: 'Learn',
                        color: '#9E509F',
                        items: [
                          { icon: BookOpen, label: 'Community Education' },
                          { icon: HeartHandshake, label: 'Leadership Programs' }
                        ]
                      },
                      {
                        title: 'Lead',
                        color: '#F15F48',
                        items: [
                          { icon: Handshake, label: 'Collaborative Initiatives' },
                          { icon: Home, label: 'Resilience Projects' }
                        ]
                      }
                    ].map((phase, i) => (
                       <div key={phase.title} className="relative pl-24 mb-8 last:mb-0">
                          {/* Node on Spine */}
                          <div 
                            className="absolute left-8 top-6 w-4 h-4 -ml-[7px] rounded-full border-2 border-[#121214] z-10"
                            style={{ backgroundColor: phase.color }} 
                          />
                          
                          {/* Connector Line to Card */}
                          <div 
                             className="absolute left-8 top-8 w-16 h-[1px] opacity-30"
                             style={{ backgroundColor: phase.color }}
                          />

                          <div className="bg-white/5 border border-white/10 rounded-xl p-5 relative overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: phase.color }} />
                              
                              <h4 className="font-bold text-xl mb-3" style={{ color: phase.color }}>
                                {phase.title}
                              </h4>
                              
                              <div className="space-y-3">
                                 {phase.items.map((item, idx) => (
                                   <div key={idx} className="flex items-center gap-3 text-white/80">
                                      <item.icon size={16} style={{ color: phase.color }} />
                                      <span className="text-sm font-medium">{item.label}</span>
                                   </div>
                                 ))}
                              </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </motion.div>

           {/* 3 Columns Explaining The Loop */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white/90 mb-16">
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-[#FDB515] font-bold text-xl mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#FDB515]"></span> Listen
                </h3>
                <p className="text-white/70 leading-relaxed">
                  We start by listening to lived experience and community voice, creating spaces where people can safely share what’s working, what’s missing, and what matters.
                </p>
              </div>
              
              <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-[#9E509F] font-bold text-xl mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#9E509F]"></span> Learn
                </h3>
                <p className="text-white/70 leading-relaxed">
                  We learn alongside partners through shared insight and reflection, translating community input into shared understanding across sectors.
                </p>
              </div>

              <div className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <h3 className="text-[#F15F48] font-bold text-xl mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#F15F48]"></span> Lead
                </h3>
                <p className="text-white/70 leading-relaxed">
                  We lead by convening collaborative action—creating space for connection, coordination, and long-term resilience.
                </p>
              </div>
           </div>

           <motion.div 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="text-center"
           >
             <p className="text-white/50 text-lg font-serif italic">
               This isn't just a process—it's a living promise to stay accountable to the community we serve.
             </p>
           </motion.div>
        </div>
      </section>

      {/* 4. Mission in Practice - Semi-Transparent Light */}
      <section id="section-practice" className="relative z-10 py-16 md:py-24 px-6 bg-[#FAFAFA]/80 backdrop-blur-xl border-t border-white/50">
        <div className="relative z-10 max-w-7xl mx-auto">
           {/* Header */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-10 md:mb-16"
           >
             <h2 className="text-gray-900 text-3xl md:text-5xl font-bold mb-4 md:mb-6">What This Looks Like in Real Life</h2>
             <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
               Connection becomes powerful when it turns into action. Here are a few ways SparkPoint shows up across the community.
             </p>
           </motion.div>

           {/* 4 Photo Cards Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
             {[
               {
                 title: 'Community Learning',
                 text: 'Large-scale learning that strengthens how our community supports brain health and well-being.',
                 image: learningImg,
                 alt: '500+ attendees at Dr. Ora Wells’ Brain Health keynote at Brevard College'
               },
               {
                 title: 'Community Voice',
                 text: 'We listen with care and turn lived experience into insights that help partners respond better.',
                 image: voiceImg,
                 alt: 'Helene Tribute story collection behind-the-scenes'
               },
               {
                 title: 'Partners in Action',
                 text: 'Collaboration that moves practical support to the people who need it—fast and locally.',
                 image: partnersImg,
                 alt: 'SparkPoint and partners packing wellness packs'
               },
               {
                 title: 'Preparedness & Care',
                 text: 'Building local capacity so care and support are ready when crisis hits.',
                 image: preparednessImg,
                 alt: 'Psychological First Aid training session'
               }
             ].map((item, idx) => (
               <motion.div
                 key={item.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: idx * 0.1 }}
                 className="group relative h-[400px] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500"
               >
                 {/* Background Image */}
                 <div className="absolute inset-0">
                   <img 
                     src={item.image} 
                     alt={item.alt}
                     className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                   />
                   {/* Gradient Overlay */}
                   <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 group-hover:via-black/50 transition-colors duration-500" />
                 </div>

                 {/* Content */}
                 <div className="relative h-full flex flex-col justify-between p-8 z-10">
                   {/* Badge */}
                   <div className="self-start">
                     <span className="inline-block px-3 py-1 rounded-full bg-[#E03694]/90 backdrop-blur-md text-white text-xs font-bold tracking-wider uppercase shadow-sm border border-white/20">
                       {item.title}
                     </span>
                   </div>

                   {/* Text */}
                   <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                     <p className="text-white text-lg md:text-xl font-medium leading-relaxed drop-shadow-md group-hover:text-white/100 text-white/95">
                       {item.text}
                     </p>
                   </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>
      </section>

      {/* 5. Working Together Across Sectors - Solid/Opaque for Clarity */}
      <section 
        id="section-network"
        className="relative z-10 py-24 px-6 bg-[#FFFFFF]/95 backdrop-blur-sm border-t border-gray-100"
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Working Together Across Sectors
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              In partnership with our community, we center lived experience and bring neighbors, leaders, and organizations into shared alignment. Through open collaboration and trusted relationships, we help cultivate long-term resilience across Transylvania County.
            </p>
          </motion.div>

          {/* Sector Hubs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {SECTORS_DATA.map((sector, index) => {
              const Icon = sector.icon;
              return (
                <motion.div
                  key={sector.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <button 
                    onClick={() => setSelectedSector(sector)}
                    className="w-full h-full text-left bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col"
                  >
                    <div className="h-2 w-full" style={{ backgroundColor: sector.color }} />
                    <div className="p-6 flex-1 flex flex-col">
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${sector.color}15`, color: sector.color }}
                      >
                        <Icon size={24} strokeWidth={2.5} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
                        {sector.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-6 leading-relaxed flex-1">
                        {sector.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {sector.partners.length} Partners
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1" style={{ color: sector.color }}>
                          View <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Rooted in Transylvania County - Glass Reveal (Visual Pause) */}
      <section className="relative z-10 py-40 px-6 bg-[#1A1A1A]/80 backdrop-blur-md text-white text-center border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Rooted in Transylvania County</h2>
            <div className="text-lg md:text-xl text-gray-200 leading-relaxed space-y-10 font-light">
              <p>
                SparkPoint began by listening. That simple act shaped our feedback loop and continues to guide how we grow, adapt, and serve.
              </p>
              <p>
                We don’t believe in scaling ideas before they’re rooted in trust. As neighboring communities express interest, we share what we’ve learned carefully—prioritizing stewardship, relationships, and local voice over speed.
              </p>
              <p className="text-white font-medium text-2xl pt-4 font-serif italic">
                The feedback loop never ends — and that’s what keeps SparkPoint accountable to the people it serves.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <KeepExploringLinks
        className="relative z-10"
        title="Keep Exploring"
        intro="If this mission resonates with you, these pages offer clear next steps."
        links={[
          {
            to: '/about',
            label: 'Meet our team and board',
            description: 'Learn who helps guide SparkPoint’s community-first approach.',
          },
          {
            to: '/impact',
            label: 'See community impact',
            description: 'Review 2025 outcomes and where momentum has grown across the county.',
          },
          {
            to: '/get-involved',
            label: 'Find ways to get involved',
            description: 'Volunteer, donate, or partner to support long-term community resilience.',
          },
        ]}
      />

      {/* SECTOR MODAL (Pop-up) - Preserved */}
      <AnimatePresence>
        {selectedSector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSector(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"
            />
            
            <motion.div
              layoutId={prefersReducedMotion ? undefined : `sector-${selectedSector.id}`}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            >
              <div className="p-8 pb-6 relative overflow-hidden" style={{ backgroundColor: `${selectedSector.color}10` }}>
                <button 
                  onClick={() => setSelectedSector(null)}
                  className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors z-20 pointer-events-auto"
                >
                  <X size={20} className="text-gray-500" />
                </button>
                
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="p-3 bg-white rounded-xl shadow-sm" style={{ color: selectedSector.color }}>
                    <selectedSector.icon size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedSector.title}</h3>
                    <p className="text-sm font-medium opacity-60 uppercase tracking-wider" style={{ color: selectedSector.color }}>Sector Hub</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg">{selectedSector.description}</p>
                
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-20 blur-3xl" style={{ backgroundColor: selectedSector.color }} />
              </div>

              <div className="p-8 pt-6 overflow-y-auto">
                {selectedSector.examples && (
                  <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Examples of Collaboration</h4>
                    <ul className="space-y-2">
                      {selectedSector.examples.map((ex, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-700 font-medium">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: selectedSector.color }} />
                          {ex}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Active Partners</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedSector.partners.map((partner, i) => (
                      <div key={i} className="p-3 rounded-lg border border-gray-100 text-gray-600 hover:bg-gray-50 hover:border-gray-200 transition-colors text-sm font-medium">
                        {partner}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                 <Button 
                   onClick={() => setSelectedSector(null)}
                   variant="ghost" 
                   className="text-gray-500 hover:text-gray-900"
                 >
                   Close
                 </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
