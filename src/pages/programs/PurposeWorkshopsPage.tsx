import { SEOHead } from "../../components/SEOHead";
import { PurposeWorkshopLanding } from "./purpose-workshop/PurposeWorkshopLanding";
import { purposeWorkshopData } from "./purpose-workshop/purposeWorkshopData";

export default function PurposeWorkshopsPage() {
  return (
    <>
      <SEOHead
        title="Purpose Workshops | SparkPoint"
        description="Purpose Workshops are guided SparkPoint sessions that help people and teams align strengths, goals, and purpose with practical next steps."
        path="/programs/purpose-workshops"
        keywords={[
          "Purpose Workshops",
          "SparkPoint workshop",
          "team purpose workshop",
          "guided reflection workshop",
          "Transylvania County workshops",
        ]}
      />
      <PurposeWorkshopLanding data={purposeWorkshopData} backToPrograms />
    </>
  );
}
