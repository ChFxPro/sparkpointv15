import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, School, Landmark, Users, Stethoscope, Handshake } from "lucide-react";

type PartnerSector = {
  id: string;
  title: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  partners: string[];
  position: { x: number; y: number }; // percent positions for desktop
};

const modalOverlay = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const modalPanel = {
  hidden: { opacity: 0, y: 18, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, y: 18, scale: 0.98, transition: { duration: 0.18 } },
};

function splitTwoColumns(items: string[]) {
  const mid = Math.ceil(items.length / 2);
  return [items.slice(0, mid), items.slice(mid)];
}

export function PartnerNetworkHub() {
  const [active, setActive] = React.useState<PartnerSector | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleEnter = (sector: PartnerSector) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActive(sector);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActive(null);
    }, 300);
  };

  const sectors: PartnerSector[] = [
    {
      id: "education-youth",
      title: "Education & Youth",
      color: "#C05693",
      icon: School,
      position: { x: 15, y: 20 },
      partners: [
        "TCS",
        "Blue Ridge Community College",
        "Brevard College",
        "TC Strong",
        "Boys & Girls Club of Transylvania County",
        "El Centro",
        "Brevard Academy",
        "Mountain Sun Community School",
        "Rise & Shine Afterschool Program",
        "Brevard Music Center Institute",
        "Eagles Nest Camp",
        "UNC Chapel Hill, Gillings School of Public Health",
        "Mountain Roots",
        "Smart Start of Transylvania County",
        "VISION Transylvania",
        "Transylvania County Education Foundation",
      ],
    },
    {
      id: "nonprofit-community",
      title: "Nonprofit & Community",
      color: "#D07A54",
      icon: Heart,
      position: { x: 85, y: 20 },
      partners: [
        "The Hunger Coalition",
        "Just Economics of Western North Carolina",
        "FWRD Transylvania (LTRG)",
        "Through the Trees",
        "Housing Assitance",
        "Camp Bluebird",
        "Friends of Rosman",
        "Meals on Wheels",
        "Bread of Life",
        "The Sharing House",
        "Pisgah Legal Services",
        "Habitat for Humanity Transylvania County",
        "Center for Trauma Resilient Communities",
        "Jameson’s Joy",
        "Transylvania County Arts Council",
        "Transylvania County Tourism Development Authority",
      ],
    },
    {
      id: "health-wellness",
      title: "Health & Wellness",
      color: "#8B5FBF",
      icon: Stethoscope,
      position: { x: 90, y: 65 },
      partners: [
        "UNC Health Pardee",
        "Transylvania Regional Hospital",
        "Transylvania Public Health Department",
        "TREND 2.0 - Mental Health",
        "Hendersonville Pediatrics",
        "CARE Coalition",
      ],
    },
    {
      id: "business",
      title: "Business",
      color: "#8A6F55",
      icon: Handshake,
      position: { x: 25, y: 88 },
      partners: [
        "Alulua (formally TVS)",
        "Schenck Jobs Corps Civilian Conservation Center",
      ],
    },
    {
      id: "sponsors-funders",
      title: "Sponsors & Funders",
      color: "#0EA5A3",
      icon: Users,
      position: { x: 75, y: 88 },
      partners: [
        "Dogwood Health Trust",
        "Lake Toxaway Charitites",
        "WNC Bridge Foundation",
        "Vaya Health",
        "The American Red Cross",
        "St. Phillips Episcopal Church",
        "Pisgah Health Foundation",
      ],
    },
    {
      id: "civic-government",
      title: "Civic & Government",
      color: "#E0B43A",
      icon: Landmark,
      position: { x: 10, y: 65 },
      partners: [
        "Transylvania County",
        "City of Brevard",
        "Town of Rosman",
        "Transylvania County Sheriff’s Office",
        "Brevard/Transylvania Chamber of Commerce",
        "Rotary Club of Pisgah Forest",
        "AAUW",
        "Mary C Jenkins Community & Cultural Center",
        "Looking Glass, CPA",
      ],
    },
  ];

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="w-full">
      <div
        className="relative w-full rounded-3xl px-6 py-10 md:px-10 md:py-14 overflow-hidden"
        style={{
          background: "rgba(0,0,0,0.55)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
          backdropFilter: "blur(20px)",
          minHeight: "800px",
        }}
      >
        <div className="relative mx-auto w-full h-full min-h-[720px]">
          {/* Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {sectors.map((s, i) => (
              <motion.line
                key={s.id}
                x1="50%"
                y1="50%"
                x2={`${s.position.x}%`}
                y2={`${s.position.y}%`}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="2"
                strokeDasharray="4 6"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.08 }}
              />
            ))}
          </svg>

          {/* Central Content Area - Swaps between Title and List */}
          <div 
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-10"
            onMouseEnter={() => {
              if (active && timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
            onMouseLeave={handleLeave}
          >
            <AnimatePresence mode="wait">
              {!active ? (
                <motion.div
                  key="default-hub"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-center"
                >
                  <div className="inline-block rounded-2xl bg-white/10 px-10 py-8 backdrop-blur-md border border-white/20 shadow-2xl">
                    <div className="text-[32px] md:text-[42px] font-extrabold text-white leading-tight">
                      Connection is a <span className="text-[#F15F48]">team effort.</span>
                    </div>
                    <div className="mt-3 text-lg text-white/70 font-medium tracking-wide">
                      SparkPoint as a central connector.
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="partner-list"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="rounded-3xl bg-white/95 text-gray-900 shadow-2xl overflow-hidden"
                  style={{
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                    borderTop: `6px solid ${active.color}`,
                  }}
                >
                  <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="h-10 w-10 rounded-full flex items-center justify-center text-white shadow-md"
                        style={{ backgroundColor: active.color }}
                      >
                        <active.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">{active.title}</h3>
                    </div>
                  </div>
                  
                  <div className="px-8 py-6 max-h-[400px] overflow-y-auto custom-scrollbar">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        {active.partners.map((partner) => (
                          <div key={partner} className="flex items-start gap-3 text-left">
                            <span 
                              className="mt-2 h-1.5 w-1.5 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: active.color }} 
                            />
                            <span className="text-base font-medium text-gray-700 leading-snug">
                              {partner}
                            </span>
                          </div>
                        ))}
                     </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Satellite Buttons */}
          {sectors.map((s, i) => {
            const Icon = s.icon;
            const isActive = active?.id === s.id;
            
            return (
              <motion.button
                key={s.id}
                type="button"
                onMouseEnter={() => handleEnter(s)}
                onMouseLeave={handleLeave}
                onClick={() => handleEnter(s)}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.15 + i * 0.08 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group outline-none z-20"
                style={{ left: `${s.position.x}%`, top: `${s.position.y}%` }}
              >
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    animate={{ 
                      scale: isActive ? 1.2 : 1,
                      boxShadow: isActive 
                        ? `0 0 0 4px rgba(255,255,255,0.2), 0 20px 40px ${s.color}60` 
                        : `0 10px 24px rgba(0,0,0,0.3)`
                    }}
                    className="h-16 w-16 rounded-full bg-white flex items-center justify-center transition-colors duration-300"
                    style={{
                      border: `3px solid ${isActive ? s.color : 'white'}`,
                    }}
                  >
                    <Icon 
                      className="h-7 w-7 transition-colors duration-300" 
                      style={{ color: s.color }} 
                    />
                  </motion.div>

                  <motion.div
                    animate={{ 
                      opacity: isActive ? 1 : 0.7,
                      y: isActive ? 0 : 0
                    }}
                    className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white text-sm font-semibold tracking-wide shadow-sm"
                  >
                    {s.title}
                  </motion.div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
