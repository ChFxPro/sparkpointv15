import React from "react";
import { motion } from "motion/react";
import {
  Users,
  Sparkles,
  Heart,
  Mic,
  Compass,
} from "lucide-react";
import { cn } from "../components/ui/utils";
import sparkPointLogo from "figma:asset/35bb889d1f4d0b05ae6753439b58199640858447.png";

// Data for the pillars
const pillars = [
  {
    id: "social",
    title: "Social Connection & Community Wellness",
    description:
      "Creating spaces where residents feel seen, supported, and connected.",
    icon: Users,
    color: "bg-[#C2185B]", // Berry / Magenta
  },
  {
    id: "youth",
    title: "Youth Engagement & Future-Ready Skills",
    description:
      "Empowering students with mentorship, leadership, and creative skill-building.",
    icon: Sparkles,
    color: "bg-[#9B59B6]", // Violet / Purple
  },
  {
    id: "healing",
    title: "Community Healing & Emotional Recovery",
    description:
      "Supporting emotional well-being, shared processing, and healing through community connection and storytelling.",
    icon: Heart,
    color: "bg-[#E57373]", // Clay / Coral
  },
  {
    id: "storytelling",
    title: "Community Storytelling & Local Media",
    description:
      "Capturing community voices and strengthening shared understanding through StoryLab and Media Navigators.",
    icon: Mic,
    color: "bg-[#8E44AD]", // Deep Purple
  },
  {
    id: "resource",
    title: "Resource Navigation & Local Support Pathways",
    description:
      "Helping residents access trusted information, partner programs, and local support.",
    icon: Compass,
    color: "bg-[#F1C40F]", // Golden Yellow
  },
];

// Updated card style: auto height, min-h-[170px], padding p-7 (28px)
const cardStyle =
  "absolute w-[340px] h-auto min-h-[170px] bg-white rounded-[20px] shadow-[0_16px_36px_-4px_rgba(0,0,0,0.08)] p-7 flex flex-col items-center justify-center text-center gap-4 overflow-visible";
const iconBadgeStyle =
  "w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white shadow-sm";

export default function InteractiveSparkPointInfographic() {
  return (
  // Section Container: Auto height, Min-height 1040px, Padding Top 100px, Bottom 200px, Overflow Visible
<div className="w-full min-h-[720px] lg:min-h-[1040px] bg-gradient-radial from-[#FFFDF9] to-[#F5F2EB] font-['Manrope',sans-serif] relative pt-16 sm:pt-20 lg:pt-[100px] pb-12 sm:pb-24 lg:pb-[200px] overflow-visible">
  {/* Framing Band */}
  <div className="relative z-10 w-full max-w-[1200px] mx-auto rounded-[20px] bg-[#FFFDF9]/85 py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-8 text-center mb-0 lg:mb-4">
    <h2 className="text-[2.5rem] lg:text-[3rem] font-extrabold text-[#1A1A1A] leading-[1.2] tracking-[-1px] mb-4">
      Where connection takes shape in our work
    </h2>
    <p className="text-[1.125rem] lg:text-[1.25rem] text-[#666666] leading-[1.5] max-w-3xl mx-auto">
      Our programs reflect a shared approach to connection, collaboration, and community well-being.
    </p>
  </div>

  {/* Desktop Orbit Container: Fixed canvas height for absolute positioning */}
  <div className="relative w-[1200px] h-[1040px] hidden lg:block mx-auto">
    
    {/* --- Background Concentric Rings (Centered on Badge) --- */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
      {/* Ring 1: 420px */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] rounded-full border border-gray-400/10" />
      {/* Ring 2: 560px */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full border border-gray-400/10" />
      {/* Ring 3: 700px */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-gray-400/10" />
    </div>

        {/* --- Center Badge System --- */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[280px] h-[280px] rounded-full bg-[#FFF0E8] shadow-[0_20px_40px_-4px_rgba(200,160,140,0.15)] flex flex-col items-center justify-center text-center p-8 group overflow-hidden">
          {/* Inner white stroke ring (6-8px) */}
          <div className="absolute inset-0 rounded-full border-[6px] border-white pointer-events-none" />
          {/* Outer faint ring (1px) */}
          <div className="absolute inset-[-1px] rounded-full border border-gray-400/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center gap-2 mt-1 w-full">
            <img
              src={sparkPointLogo}
              alt="SparkPoint Logo"
              className="w-[180px] h-auto object-contain"
            />
            <p className="text-[13px] text-gray-500 font-medium leading-tight mt-1 max-w-[160px] line-clamp-2">
              Connecting People, Programs, and Purpose
            </p>
          </div>
        </div>

        {/* --- Program Cards Orbit --- */}

        {/* Card A (Top): Moved down to top-[50px] for more breathing room (Center is at 450px) */}
        <div
          className={cn(
            cardStyle,
            "top-[50px] left-1/2 -translate-x-1/2 z-20",
          )}
        >
          <div className={cn(iconBadgeStyle, pillars[0].color)}>
            <Users className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2.5 w-full px-2">
            <h3 className="text-[18px] font-semibold text-gray-900 leading-[1.3]">
              {pillars[0].title}
            </h3>
            <p className="text-[13px] text-gray-500 leading-[1.5]">
              {pillars[0].description}
            </p>
          </div>
        </div>

        {/* Card B (Left): Remains vertically centered (50%) */}
        <div
          className={cn(
            cardStyle,
            "top-1/2 left-[50px] -translate-y-1/2 z-20",
          )}
        >
          <div className={cn(iconBadgeStyle, pillars[1].color)}>
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2.5 w-full px-2">
            <h3 className="text-[18px] font-semibold text-gray-900 leading-[1.3]">
              {pillars[1].title}
            </h3>
            <p className="text-[13px] text-gray-500 leading-[1.5]">
              {pillars[1].description}
            </p>
          </div>
        </div>

        {/* Card C (Right): Remains vertically centered (50%) */}
        <div
          className={cn(
            cardStyle,
            "top-1/2 left-[810px] -translate-y-1/2 z-20",
          )}
        >
          <div className={cn(iconBadgeStyle, pillars[2].color)}>
            <Heart className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2.5 w-full px-2">
            <h3 className="text-[18px] font-semibold text-gray-900 leading-[1.3]">
              {pillars[2].title}
            </h3>
            <p className="text-[13px] text-gray-500 leading-[1.5]">
              {pillars[2].description}
            </p>
          </div>
        </div>

        {/* Card D (Bottom-Left): Moved down to top-[700px] to clear center badge comfortably */}
        <div
          className={cn(
            cardStyle,
            "top-[700px] left-[200px] z-20",
          )}
        >
          <div className={cn(iconBadgeStyle, pillars[3].color)}>
            <Mic className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2.5 w-full px-2">
            <h3 className="text-[18px] font-semibold text-gray-900 leading-[1.3]">
              {pillars[3].title}
            </h3>
            <p className="text-[13px] text-gray-500 leading-[1.5]">
              {pillars[3].description}
            </p>
          </div>
        </div>

        {/* Card E (Bottom-Right): Moved down to top-[700px] to clear center badge comfortably */}
        <div
          className={cn(
            cardStyle,
            "top-[700px] left-[660px] z-20",
          )}
        >
          <div className={cn(iconBadgeStyle, pillars[4].color)}>
            <Compass className="w-6 h-6" />
          </div>
          <div className="flex flex-col gap-2.5 w-full px-2">
            <h3 className="text-[18px] font-semibold text-gray-900 leading-[1.3]">
              {pillars[4].title}
            </h3>
            <p className="text-[13px] text-gray-500 leading-[1.5]">
              {pillars[4].description}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Stacked Layout (Simple Vertical Stack for now) */}
      <div className="flex flex-col items-center gap-5 lg:hidden w-full px-4 py-8 sm:py-10">
        <div className="w-[200px] h-[200px] rounded-full bg-[#FFF0E8] border-[4px] border-white shadow-lg flex flex-col items-center justify-center text-center p-4 overflow-hidden">
          <img
            src={sparkPointLogo}
            alt="SparkPoint Logo"
            className="w-[140px] h-auto object-contain mb-2"
          />
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            Connecting People, Programs, and Purpose
          </p>
        </div>

        {pillars.map((pillar) => (
          <div
            key={pillar.id}
            className="w-full max-w-[340px] bg-white rounded-[20px] shadow-md p-5 sm:p-6 flex flex-col items-center text-center gap-3 sm:gap-4"
          >
            <div className={cn(iconBadgeStyle, pillar.color)}>
              <pillar.icon className="w-5 h-5" />
            </div>
            <div className="flex flex-col gap-2.5 w-full px-2">
              <h3 className="text-[16px] font-bold text-gray-900 leading-[1.3]">
                {pillar.title}
              </h3>
              <p className="text-[13px] text-gray-500 leading-[1.5]">
                {pillar.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
