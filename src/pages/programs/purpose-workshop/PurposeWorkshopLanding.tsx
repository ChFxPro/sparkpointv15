import type { PurposeWorkshopData } from "./purposeWorkshopData";
import {
  HeroSection,
  WhatIsSection,
  ExperienceSection,
  ConnectionSection,
  GallerySection,
  AudienceSection,
  FinalCTASection,
} from "./sections";
import "./purposeWorkshopShared.css";

type LandingProps = {
  data: PurposeWorkshopData;
  backToPrograms?: boolean;
};

export function PurposeWorkshopLanding({ data, backToPrograms = false }: LandingProps) {
  return (
    <div className="pw-shared relative min-h-screen overflow-x-hidden bg-spark-cream text-spark-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-spark-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <HeroSection data={data} backToPrograms={backToPrograms} />

      <main id="main-content" className="relative z-10 px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <WhatIsSection data={data} />
          <ExperienceSection data={data} />
          <ConnectionSection data={data} />
          <GallerySection data={data} />
          <AudienceSection data={data} />
          <FinalCTASection data={data} />
        </div>
      </main>
    </div>
  );
}
