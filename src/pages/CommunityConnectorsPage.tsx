import { Link } from "react-router";
import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Handshake,
  MapPin,
  MessageCircle,
  Network,
  Radio,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { SEOHead } from "../components/SEOHead";
import commconnLogoDark from "../assets/commconn/logos/commconn_logo_dk.webp";
import commconnBrandmarkDark from "../assets/commconn/logos/comcon_brandmark_comcon_bndmrk_dk_color.webp";
import groupGathering from "../assets/commconn/imgs/comcon_group_elev.webp";
import cathyCreekConversation from "../assets/commconn/imgs/comcon_cathycreek.webp";
import attendeePortrait from "../assets/commconn/imgs/comcon_attendee.webp";
import listeningTables from "../assets/commconn/imgs/comcon_maggie_yesica.webp";
import sparkPointLogo from "../assets/commconn/other/SparkPointLogoSimple.png";
import fwrdLogo from "../assets/commconn/other/fwrd_main.png";
import redCrossLogo from "../assets/commconn/other/red_cross.png";
import "./communityConnectors.css";

const INTEREST_FORM_URL = "https://wkf.ms/4azGJiS";
const COMMUNITY_CONNECTORS_VIDEO_ID = "xuDCRx2CwOU";
const COMMUNITY_CONNECTORS_VIDEO_EMBED_URL = `https://www.youtube-nocookie.com/embed/${COMMUNITY_CONNECTORS_VIDEO_ID}`;
const COMMUNITY_CONNECTORS_VIDEO_THUMBNAIL = `https://img.youtube.com/vi/${COMMUNITY_CONNECTORS_VIDEO_ID}/maxresdefault.jpg`;
const COMMUNITY_CONNECTORS_CANONICAL_URL = "https://yoursparkpoint.org/community-connectors";
const COMMUNITY_CONNECTORS_PREVIEW_IMAGE_URL = "https://yoursparkpoint.org/assets/commconn/imgs/comcon_endcard.jpg";
const COMMUNITY_CONNECTORS_PREVIEW_ALT =
  "Community Connectors of Transylvania County graphic with SparkPoint, FWRD Transylvania, and American Red Cross logos.";
const COMMUNITY_CONNECTORS_SOCIAL_DESCRIPTION =
  "Rooted in connection. Ready for what’s next. Learn about SparkPoint’s Community Connectors initiative in Transylvania County.";
const META_DESCRIPTION =
  "Community Connectors is a SparkPoint initiative supporting trusted local leaders who help neighbors find information, resources, care, and calm when it matters most.";

const connectorActions = [
  {
    title: "Share timely information",
    description: "Pass along updates in ways neighbors can understand, trust, and act on.",
    icon: Radio,
  },
  {
    title: "Help neighbors find resources",
    description: "Point people toward local support, services, and practical next steps.",
    icon: MapPin,
  },
  {
    title: "Connect people to trusted organizations",
    description: "Bridge everyday questions to the groups already serving Transylvania County.",
    icon: Network,
  },
  {
    title: "Listen for emerging needs",
    description: "Notice what is changing and help SparkPoint and partners hear what communities are carrying.",
    icon: MessageCircle,
  },
  {
    title: "Support preparedness and resilience",
    description: "Help families and neighborhoods get ready before the next hard moment arrives.",
    icon: ShieldCheck,
  },
  {
    title: "Strengthen relationships",
    description: "Build connection before, during, and after crisis so people are not starting from scratch.",
    icon: UsersRound,
  },
];

const heroSignals = [
  { label: "125+ stories heard", value: "Helene listening work" },
  { label: "50+ invited leaders", value: "First gathering" },
  { label: "Countywide focus", value: "Connection Points" },
];

const sectionLinks = [
  { href: "#video", label: "Video" },
  { href: "#origin", label: "Origin" },
  { href: "#article", label: "Article" },
  { href: "#connector-role", label: "Role" },
  { href: "#partners", label: "Partners" },
  { href: "#get-involved", label: "Get involved" },
];

const partnerLogos = [
  {
    name: "SparkPoint",
    label: "Visit SparkPoint",
    href: "https://yoursparkpoint.org",
    src: sparkPointLogo,
    className: "commconn-partner-logo-spark",
  },
  {
    name: "FWRD Transylvania County",
    label: "Visit FWRD Transylvania County",
    href: "https://gofwrd.org/",
    src: fwrdLogo,
    className: "commconn-partner-logo-fwrd",
  },
  {
    name: "American Red Cross",
    label: "Visit the American Red Cross",
    href: "https://www.redcross.org/",
    src: redCrossLogo,
    className: "commconn-partner-logo-redcross",
  },
];

const articleParagraphs = [
  "When Hurricane Helene impacted Western North Carolina, something remarkable happened across Transylvania County: people stepped up. Neighbors checked on neighbors. Churches opened their doors. Businesses shared resources. Community members organized supplies, distributed information, and helped connect people to what they needed.",
  "Over the past year, SparkPoint heard many of those stories through the Helene: One Year of Healing initiative. Through that process, our team connected with more than 125 individuals from every corner of the county, listening to residents, volunteers, business owners, educators, faith leaders, nonprofit staff, first responders, and community leaders.",
  "As we listened, a pattern emerged. Again and again, people spoke about individuals they trusted: people who shared information, connected resources, answered questions, calmed fears, and helped neighbors navigate uncertainty. Long before any formal response system could reach every corner of the county, these trusted community members were already serving as informal connectors.",
  "That realization became the foundation for the Community Connectors initiative. On May 26, SparkPoint, in partnership with the American Red Cross and FWRD Transylvania County, hosted the first Community Connectors gathering. More than 50 invited individuals representing different communities, organizations, geographic areas, and networks throughout the county showed up with purpose and heart.",
  "The purpose of the gathering was not to launch a finished program or present a predetermined plan; it was to listen. Through facilitated listening circles and small-group conversations, participants shared what helped during and after the storm, where challenges existed, and how trusted people, relationships, and local networks became some of the community's most valuable resources.",
  "Community-led work takes time. It requires listening before planning, relationship-building before structure, and trust before action. While many programs begin with a solution, Community Connectors begins with a conversation.",
  "Over the coming months, SparkPoint and partners will review the themes that emerged from the listening circles and work alongside participants to identify natural next steps. The long-term vision is to support local Community Connectors, establish Connection Points throughout the county, and strengthen communication and relationships across communities.",
  "Rather than building a new system from scratch, the initiative seeks to strengthen and connect the trusted people and relationships that already exist throughout Transylvania County.",
];

export function CommunityConnectorsPage() {
  const jsonLd = [{
    "@context": "https://schema.org",
    "@type": "ProgramMembership",
    name: "Community Connectors",
    description: META_DESCRIPTION,
    url: COMMUNITY_CONNECTORS_CANONICAL_URL,
    hostingOrganization: {
      "@type": "NGO",
      name: "SparkPoint",
      url: "https://yoursparkpoint.org",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Transylvania County, North Carolina",
    },
  }, {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "Watch the Community Connectors story",
    description:
      "A short introduction to Community Connectors, a SparkPoint initiative shaped by local listening, trusted relationships, and neighbor-to-neighbor support after Hurricane Helene.",
    duration: "PT2M24S",
    thumbnailUrl: COMMUNITY_CONNECTORS_VIDEO_THUMBNAIL,
    embedUrl: COMMUNITY_CONNECTORS_VIDEO_EMBED_URL,
    publisher: {
      "@type": "NGO",
      name: "SparkPoint",
      url: "https://yoursparkpoint.org",
    },
  }];

  return (
    <div className="commconn-page">
      <SEOHead
        title="Community Connectors | SparkPoint"
        description={META_DESCRIPTION}
        path="/community-connectors"
        canonicalUrlOverride={COMMUNITY_CONNECTORS_CANONICAL_URL}
        image={COMMUNITY_CONNECTORS_PREVIEW_IMAGE_URL}
        imageAlt={COMMUNITY_CONNECTORS_PREVIEW_ALT}
        imageType="image/jpeg"
        socialDescription={COMMUNITY_CONNECTORS_SOCIAL_DESCRIPTION}
        keywords={[
          "Community Connectors",
          "SparkPoint",
          "Transylvania County",
          "community resilience",
          "Hurricane Helene recovery",
          "disaster preparedness",
          "neighbor-to-neighbor support",
          "community resources",
          "FWRD Transylvania County",
          "American Red Cross",
        ]}
        jsonLd={jsonLd}
      />

      <header className="commconn-hero">
        <div className="commconn-shell commconn-hero-grid">
          <div className="commconn-hero-copy">
            <img
              src={commconnLogoDark}
              alt="Community Connectors"
              className="commconn-logo"
              width={3098}
              height={967}
            />
            <h1>Rooted in connection. Ready for what's next.</h1>
            <p className="commconn-hero-lede">
              Community Connectors is a SparkPoint initiative built from what we learned after Hurricane
              Helene: every community has trusted people who help neighbors find information, resources,
              care, and calm when it matters most.
            </p>
            <div className="commconn-actions" aria-label="Community Connectors actions">
              <a className="commconn-button commconn-button-primary" href={INTEREST_FORM_URL} target="_blank" rel="noopener noreferrer">
                Get involved
                <ArrowRight size={18} aria-hidden="true" />
              </a>
              <a className="commconn-button commconn-button-secondary" href="#video">
                Learn more below
                <ArrowDown size={18} aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="commconn-hero-visual">
            <figure className="commconn-hero-photo">
              <img
                src={groupGathering}
                alt="Community members gathered around tables for a facilitated Community Connectors conversation."
                width={2200}
                height={1467}
              />
            </figure>
            <div className="commconn-signal-panel" aria-label="Community Connectors highlights">
              {heroSignals.map((signal) => (
                <div key={signal.label}>
                  <strong>{signal.label}</strong>
                  <span>{signal.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main>
        <nav className="commconn-page-nav" aria-label="Community Connectors page sections">
          <div className="commconn-shell commconn-page-nav-inner">
            {sectionLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <section id="video" className="commconn-section commconn-video-section" aria-labelledby="commconn-video-title">
          <div className="commconn-shell">
            <div className="commconn-video-intro">
              <p className="commconn-video-eyebrow">Community Connectors Video</p>
              <h2 id="commconn-video-title">Watch the Community Connectors story</h2>
              <p>
                See how Community Connectors grew from what SparkPoint heard after Hurricane Helene: trusted
                neighbors helping people find information, resources, care, and calm when it matters most.
              </p>
            </div>

            <figure className="commconn-video-card">
              <iframe
                src={COMMUNITY_CONNECTORS_VIDEO_EMBED_URL}
                title="Community Connectors intro video"
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                aria-describedby="commconn-video-summary"
              />
            </figure>

            <div className="commconn-video-summary" id="commconn-video-summary">
              <p>
                This short introduction shares the heart behind Community Connectors: a growing network shaped
                by local listening, trusted relationships, and the people who already help their neighbors find
                the next right connection.
              </p>
            </div>

            <aside className="commconn-video-cta" aria-labelledby="commconn-video-cta-title">
              <div>
                <h3 id="commconn-video-cta-title">Are you or someone you know a Community Connector?</h3>
                <p>
                  Every community has people others turn to. If that sounds like you, or someone you know,
                  we'd love to connect.
                </p>
                <p className="commconn-video-url">Visit yoursparkpoint.org/community-connectors to learn more.</p>
              </div>
              <a className="commconn-button commconn-button-primary" href={INTEREST_FORM_URL} target="_blank" rel="noopener noreferrer">
                Get involved
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </aside>
          </div>
        </section>

        <section id="origin" className="commconn-section commconn-origin">
          <div className="commconn-shell commconn-two-col">
            <div>
              <h2>Born from what we heard after Helene</h2>
              <p>
                After Hurricane Helene, SparkPoint listened to stories from residents, volunteers, faith
                leaders, educators, nonprofit staff, first responders, business owners, and community leaders
                across Transylvania County. Again and again, people named the same kind of person: someone
                trusted. Someone who knew who to call, where to go, what was changing, and how to help
                neighbors take the next step.
              </p>
              <p className="commconn-emphasis">Community Connectors grew from that pattern.</p>
            </div>
            <figure className="commconn-story-photo">
              <img
                src={cathyCreekConversation}
                alt="A Community Connectors attendee speaking with neighbors in a listening circle."
                width={2000}
                height={1333}
              />
            </figure>
          </div>
        </section>

        <section id="article" className="commconn-section commconn-article-section">
          <div className="commconn-shell">
            <article className="commconn-newspaper" aria-labelledby="commconn-article-title">
              <div className="commconn-paper-masthead">
                <span>SparkPoint Field Notes</span>
                <span>Transylvania County</span>
                <span>Community Connectors</span>
              </div>

              <header className="commconn-paper-header">
                <div>
                  <p className="commconn-paper-kicker">From the Community Connectors release</p>
                  <h2 id="commconn-article-title">When neighbors become leaders</h2>
                  <p className="commconn-paper-dek">
                    The first Community Connectors gathering began with a simple premise: before planning a
                    new structure, listen to the trusted people who already know their communities best.
                  </p>
                </div>
                <div className="commconn-paper-meta" aria-label="Article details">
                  <span>
                    <CalendarDays size={16} aria-hidden="true" />
                    May 26 gathering
                  </span>
                  <span>
                    <Handshake size={16} aria-hidden="true" />
                    SparkPoint, FWRD, Red Cross
                  </span>
                </div>
              </header>

              <figure className="commconn-paper-lead-image">
                <img
                  src={listeningTables}
                  alt="Community Connectors participants seated around tables during a facilitated listening session."
                  width={1920}
                  height={1080}
                />
                <figcaption>
                  Participants met in listening circles to name what helped after Helene and where community
                  connections could grow stronger.
                </figcaption>
              </figure>

              <div className="commconn-paper-story">
                <p>{articleParagraphs[0]}</p>
                <p>{articleParagraphs[1]}</p>
                <p>{articleParagraphs[2]}</p>

                <figure className="commconn-paper-inline-image">
                  <img
                    src={attendeePortrait}
                    alt="A Community Connectors participant listening during a small-group conversation."
                    width={1920}
                    height={1080}
                  />
                  <figcaption>
                    The initiative centers people who are already trusted sources of care, information, and
                    calm.
                  </figcaption>
                </figure>

                <p>{articleParagraphs[3]}</p>
                <p>{articleParagraphs[4]}</p>

                <blockquote className="commconn-paper-pullquote">
                  Community-led work takes time. It requires listening before planning, relationship-building
                  before structure, and trust before action.
                </blockquote>

                {articleParagraphs.slice(5).map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section id="connector-role" className="commconn-section commconn-what">
          <div className="commconn-shell">
            <div className="commconn-section-heading">
              <h2>What is a Community Connector?</h2>
              <p>A Community Connector may:</p>
            </div>

            <div className="commconn-card-grid">
              {connectorActions.map((item, index) => {
                const Icon = item.icon;
                return (
                  <article className="commconn-card" key={item.title}>
                    <span className="commconn-card-index">0{index + 1}</span>
                    <div className="commconn-card-icon">
                      <Icon size={26} aria-hidden="true" />
                    </div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="commconn-note">
              <CheckCircle2 size={22} aria-hidden="true" />
              <p>
                You do not need a formal title to be a Community Connector. Many people are already doing
                this work in quiet, trusted ways.
              </p>
            </div>
          </div>
        </section>

        <section className="commconn-section commconn-vision">
          <div className="commconn-shell commconn-vision-grid">
            <div>
              <h2>Strengthening the connections that already exist</h2>
              <p>
                This initiative is not about replacing the relationships that helped our county through hard
                moments. It is about supporting them. SparkPoint and partners are working alongside local
                leaders to strengthen communication, build preparedness, identify Connection Points, and make
                it easier for neighbors to find the support they need.
              </p>
            </div>
            <blockquote>
              The future of this work will be shaped by the people, relationships, and leadership already
              present throughout Transylvania County.
            </blockquote>
          </div>
        </section>

        <section id="partners" className="commconn-section commconn-partners">
          <div className="commconn-shell">
            <div className="commconn-section-heading">
              <h2>Built through partnership</h2>
              <p>
                SparkPoint is developing Community Connectors in partnership with FWRD Transylvania County,
                the American Red Cross, and local community partners.
              </p>
            </div>
            <div className="commconn-logo-row" aria-label="Community Connectors partner logos">
              {partnerLogos.map((partner) => (
                <a
                  key={partner.name}
                  className="commconn-logo-tile"
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={partner.label}
                >
                  <img src={partner.src} alt={partner.name} className={partner.className} />
                </a>
              ))}
            </div>

            <aside className="commconn-resource-callout" aria-labelledby="commconn-resource-title">
              <div>
                <h3 id="commconn-resource-title">Still navigating unmet needs from Helene?</h3>
                <p>
                  If you or someone you know still has unmet needs from Hurricane Helene, FWRD Transylvania
                  County can help connect you with recovery resources, support, and next steps.
                </p>
                <p className="commconn-resource-closer">
                  FWRD Transylvania is coordinating long-term recovery support so residents can find the right
                  resources, referrals, and help as recovery continues.
                </p>
              </div>
              <a className="commconn-button commconn-button-secondary" href="https://gofwrd.org/get-help/" target="_blank" rel="noopener noreferrer">
                Get help through FWRD
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </aside>
          </div>
        </section>

        <section id="get-involved" className="commconn-section commconn-cta">
          <div className="commconn-shell commconn-cta-panel">
            <div>
              <h2>Are you or someone you know a Community Connector?</h2>
              <p>
                Every community has people others turn to. The neighbor who checks in. The pastor who knows
                who needs help. The volunteer who shares updates. The business owner who opens their doors.
                The resident who knows how to get information where it needs to go.
              </p>
              <p>If that sounds like you, or someone you know, we'd love to connect.</p>
            </div>
            <div className="commconn-cta-actions">
              <a className="commconn-button commconn-button-gold" href={INTEREST_FORM_URL} target="_blank" rel="noopener noreferrer">
                Fill out the interest form
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>

        <section className="commconn-closing" aria-labelledby="commconn-closing-title">
          <div className="commconn-shell commconn-closing-inner">
            <img
              src={commconnBrandmarkDark}
              alt=""
              className="commconn-brandmark"
              width={1080}
              height={1080}
              aria-hidden="true"
            />
            <h2 id="commconn-closing-title">Rooted in connection. Ready for what's next.</h2>
            <a className="commconn-button commconn-button-primary" href={INTEREST_FORM_URL} target="_blank" rel="noopener noreferrer">
              Get involved
              <ArrowRight size={18} aria-hidden="true" />
            </a>
            <Link className="commconn-back-link" to="/programs">
              Back to all SparkPoint programs
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
