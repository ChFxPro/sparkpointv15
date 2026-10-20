import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import {
  pathways,
  allPrograms,
  getFormatLabel,
  getOfferingTypeLabel,
  DEEP,
  type Pathway,
  type Program,
} from "../programsData";
import wrcBrandmarkWhite from "../../../assets/wrc/wrc-brandmark-white.svg";
import { ProgramLogo } from "../ProgramLogo";
import "./programsLineup.css";

// The programs page, built on the 2026-10 lineup: thirteen programs in four pathways
// (Listen, Learn, Lead, Connect), the work SparkPoint leads with up front, then each
// pathway in turn. Same visual language as the
// homepage programs cards.

// Event photography from the October 1 convening, in public/assets/Rural Health/recap/highlights/.
const highlight = (name: string, width: 800 | 1600) =>
  `${import.meta.env.BASE_URL}assets/Rural%20Health/recap/highlights/${name}-${width}.webp`;

const byId = (id: string) => allPrograms.find((p) => p.id === id)!;

type Featured = {
  program: Program;
  image: { src: string; srcSet: string; alt: string };
  tone: string;
  logo?: string;
  /** Compact logo for narrow screens. */
  logoSmall?: string;
  note: string;
};

const FEATURED: Featured[] = [
  {
    program: byId("wellness-rooted-in-connection-collaborative-trcn"),
    image: {
      src: highlight("across-the-table", 800),
      srcSet: `${highlight("across-the-table", 800)} 800w, ${highlight("across-the-table", 1600)} 1600w`,
      alt: "Two women in conversation across a table, one leaning in to listen as the other speaks.",
    },
    // WRC's own Pisgah Slate, with its white logo.
    tone: "#075079",
    logo: byId("wellness-rooted-in-connection-collaborative-trcn").logoReversed,
    logoSmall: wrcBrandmarkWhite,
    note: "Organizations across the county, listening together.",
  },
  {
    program: byId("trailhead"),
    image: {
      src: highlight("simulator-tablet", 800),
      srcSet: `${highlight("simulator-tablet", 800)} 800w, ${highlight("simulator-tablet", 1600)} 1600w`,
      alt: "A small group gathers around a tablet, working through TrailHead at the October 1 convening.",
    },
    tone: "#2F4A3C",
    logo: byId("trailhead").logoReversed,
    note: "Its first edition filled the room on October 1.",
  },
];

function FeaturedCard({ item, side, onOpen }: { item: Featured; side: "left" | "right"; onOpen: (p: Program) => void }) {
  const { program } = item;
  const pathway = pathways.find((p) => p.id === program.pathway)!;
  return (
    <article
      className="spl-feature"
      data-side={side}
      style={{ ["--tone" as string]: item.tone }}
      aria-labelledby={`feature-${program.id}`}
    >
      <img src={item.image.src} srcSet={item.image.srcSet} sizes="(min-width: 1024px) 1100px, 100vw" alt={item.image.alt} className="spl-feature-photo" loading="lazy" decoding="async" />
      <div className="spl-feature-scrim" aria-hidden="true" />
      <div className="spl-feature-body">
        <h3 id={`feature-${program.id}`} className="spl-feature-title">
          {item.logo ? (
            <picture>
              {item.logoSmall && <source media="(max-width: 400px)" srcSet={item.logoSmall} />}
              <img src={item.logo} alt={program.title} className="spl-feature-logo" />
            </picture>
          ) : (
            program.title
          )}
        </h3>
        <p className="spl-feature-text">{program.shortDescription}</p>
        <p className="spl-feature-note">{item.note}</p>
        <ul className="spl-chips spl-chips-dark" aria-label="About this program">
          <li className="spl-chip-path">
            <span style={{ background: pathway.color }} aria-hidden="true" />
            {pathway.label}
          </li>
          <li>{getFormatLabel(program.format)}</li>
        </ul>
        <div className="spl-actions">
          {program.contactCTA.href.startsWith("/") ? (
            <Link to={program.contactCTA.href} className="spl-btn-light" style={{ color: item.tone }}>
              {program.contactCTA.label} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ) : (
            <a href={program.contactCTA.href} className="spl-btn-light" style={{ color: item.tone }}>
              {program.contactCTA.label} <ArrowRight size={16} aria-hidden="true" />
            </a>
          )}
          <button type="button" className="spl-link-light" onClick={() => onOpen(program)}>
            More about {program.id === "trailhead" ? "TrailHead" : "the collaborative"}
          </button>
        </div>
      </div>
    </article>
  );
}

function ProgramTile({ program, pathway, onOpen }: { program: Program; pathway: Pathway; onOpen: (p: Program) => void }) {
  // A program with its own brand uses its own colour.
  const deep = program.logo && program.brand.accent ? program.brand.accent : DEEP[pathway.id];
  const detailHref = program.detailPageHref ?? `/programs/${program.slug}`;
  const external = detailHref.startsWith("http");
  // Resource Lobby's page is the Resource Directory, so say so.
  const moreLabel = detailHref === "/directory" ? "Resource Directory" : "Program page";
  return (
    <article className="spl-tile" aria-labelledby={`tile-${program.id}`}>
      <span className="spl-tile-band" style={{ background: program.logo ? deep : pathway.color }} aria-hidden="true" />
      <h3 id={`tile-${program.id}`} className="spl-tile-title">
        {program.logo ? <ProgramLogo program={program} className="spl-tile-logo" /> : program.title}
      </h3>
      <p className="spl-tile-text">{program.shortDescription}</p>
      <ul className="spl-chips" aria-label="About this program">
        <li>{getFormatLabel(program.format)}</li>
        <li>{getOfferingTypeLabel(program.offeringType)}</li>
      </ul>
      <div className="spl-tile-actions">
        <button type="button" className="spl-tile-peek" onClick={() => onOpen(program)} style={{ color: deep }}>
          Quick look<span className="sr-only"> at {program.title}</span>
        </button>
        {external ? (
          <a href={detailHref} className="spl-tile-more" style={{ color: deep }}>
            {moreLabel}<span className="sr-only"> for {program.title}</span> <ArrowRight size={15} aria-hidden="true" />
          </a>
        ) : (
          <Link to={detailHref} className="spl-tile-more" style={{ color: deep }}>
            {moreLabel}<span className="sr-only"> for {program.title}</span> <ArrowRight size={15} aria-hidden="true" />
          </Link>
        )}
      </div>
    </article>
  );
}

export function ProgramsLineup({ onOpenProgram }: { onOpenProgram: (pathway: Pathway, program: Program) => void }) {
  const open = (program: Program) => onOpenProgram(pathways.find((p) => p.id === program.pathway)!, program);
  const total = allPrograms.length;

  return (
    <>
      <section className="spl-hero" aria-labelledby="programs-heading">
        <div className="spl-wrap">
          <h1 id="programs-heading" className="spl-h1">
            {total} programs, four ways in
          </h1>
          <p className="spl-lede">
            Every SparkPoint program follows one of four pathways: Listen, Learn, Lead, and
            Connect. They&rsquo;re rooted in Transylvania County, and we run them with partners
            across Western North Carolina.
          </p>
          <nav className="spl-pathnav" aria-label="Pathways">
            {pathways.map((p) => (
              <a key={p.id} href={`#pathway-${p.id}`} className="spl-pathnav-item" style={{ ["--c" as string]: p.color }}>
                <span className="spl-pathnav-top">
                  <span className="spl-dot" aria-hidden="true" />
                  <span className="spl-pathnav-name">{p.label}</span>
                  <span className="spl-pathnav-count">{p.programs.length}</span>
                </span>
                <span className="spl-pathnav-desc">{p.description}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      <section className="spl-section" aria-labelledby="featured-heading">
        <div className="spl-wrap">
          <div className="spl-head">
            <h2 id="featured-heading" className="spl-h2">What we&rsquo;re leading with</h2>
            <p className="spl-sub">
              A collaborative that brings the county&rsquo;s organizations into one room, and a
              simulation that lets a room walk the system together.
            </p>
          </div>
          <div className="spl-features">
            {FEATURED.map((item) => (
              <FeaturedCard key={item.program.id} item={item} side="left" onOpen={open} />
            ))}
          </div>
        </div>
      </section>

      {pathways.map((p) => (
        <section key={p.id} id={`pathway-${p.id}`} className="spl-section spl-pathway" aria-labelledby={`pathway-${p.id}-heading`}>
          <div className="spl-wrap spl-pathway-grid">
            <div className="spl-pathway-head">
              <h2 id={`pathway-${p.id}-heading`} className="spl-h2">
                <span className="spl-dot spl-dot-lg" style={{ ["--c" as string]: p.color }} aria-hidden="true" />
                {p.label}
              </h2>
              <p className="spl-sub">{p.description}</p>
              <p className="spl-count">
                {p.programs.length} {p.programs.length === 1 ? "program" : "programs"}
              </p>
            </div>
            <div className="spl-tiles">
              {p.programs.map((program) => (
                <ProgramTile key={program.id} program={program} pathway={p} onOpen={open} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="spl-cta" aria-labelledby="cta-heading">
        <div className="spl-wrap spl-cta-inner">
          <h2 id="cta-heading" className="spl-h2 spl-h2-light">Bring a program to your group</h2>
          <p className="spl-lede">
            Tell us what you&rsquo;re working on and who you&rsquo;re working with. We&rsquo;ll find
            the program, or the partner, that fits.
          </p>
          <div className="spl-actions spl-actions-center">
            <Link to="/intake?intent=partner" className="spl-btn-light" style={{ color: "#2a1430" }}>
              Talk with us <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link to="/get-involved" className="spl-link-light">
              Other ways to get involved
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
