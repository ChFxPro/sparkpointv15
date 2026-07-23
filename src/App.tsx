import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router';
import { useEffect, lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StructuredData } from './components/StructuredData';
import { ExternalRedirect } from './components/ExternalRedirect';
import { HomePage } from './pages/HomePage';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { MotionConfig } from 'motion/react';

const MissionPage = lazy(() =>
  import('./pages/MissionPage').then((module) => ({ default: module.MissionPage }))
);
const StoriesPage = lazy(() =>
  import('./pages/StoriesPage').then((module) => ({ default: module.StoriesPage }))
);
const StoryCategoryPage = lazy(() =>
  import('./pages/StoryCategoryPage').then((module) => ({ default: module.StoryCategoryPage }))
);
const StoryArticlePage = lazy(() =>
  import('./pages/StoryArticlePage').then((module) => ({ default: module.StoryArticlePage }))
);
const ImpactPage = lazy(() =>
  import('./pages/ImpactPage').then((module) => ({ default: module.ImpactPage }))
);
const GetInvolvedPage = lazy(() =>
  import('./pages/GetInvolvedPage').then((module) => ({ default: module.GetInvolvedPage }))
);
const ProgramsPage = lazy(() => import('./pages/programs/ProgramsPage'));
const PurposeWorkshopsPage = lazy(() => import('./pages/programs/PurposeWorkshopsPage'));
const ProgramDetailRoute = lazy(() => import('./pages/programs/ProgramDetailRoute'));
const CommunityConnectorsPage = lazy(() =>
  import('./pages/CommunityConnectorsPage').then((module) => ({ default: module.CommunityConnectorsPage }))
);
const SponsorsPage = lazy(() =>
  import('./pages/SponsorsPage').then((module) => ({ default: module.SponsorsPage }))
);
const ResilienceHubPage = lazy(() =>
  import('./pages/ResilienceHubPage').then((module) => ({ default: module.ResilienceHubPage }))
);
const DirectoryPage = lazy(() =>
  import('./pages/DirectoryPage').then((module) => ({ default: module.DirectoryPage }))
);
const DirectoryEntryPage = lazy(() =>
  import('./pages/DirectoryEntryPage').then((module) => ({ default: module.DirectoryEntryPage }))
);
// NewsMediaPage retired — /news-media now redirects to /press (the Newsroom).
const PressPortalPage = lazy(() =>
  import('./pages/press/PressPortalPage').then((module) => ({ default: module.PressPortalPage }))
);
const PressReleasePage = lazy(() =>
  import('./pages/press/PressReleasePage').then((module) => ({ default: module.PressReleasePage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then((module) => ({ default: module.AboutPage }))
);
const IntakePage = lazy(() =>
  import('./pages/IntakePage').then((module) => ({ default: module.IntakePage }))
);
const TrustPage = lazy(() =>
  import('./pages/TrustPage').then((module) => ({ default: module.TrustPage }))
);
const PrivacyPage = lazy(() =>
  import('./pages/PrivacyPage').then((module) => ({ default: module.PrivacyPage }))
);
const CommunityChampionsArticle = lazy(() => import('./pages/CommunityChampionsArticle'));
const HeleneOneYearArticle = lazy(() => import('./pages/HeleneOneYearArticle'));
const HEALTHCARE_STORY_FORM_URL =
  'https://sparkconnection.org/wp-content/plugins/narrafirma/webapp/survey.html#project=Rural%20Health&survey=Rural%20Health%20Care%20Access';

// GitHub Pages SPA redirect handler
// This restores the original path after the 404.html redirect
(function(l) {
  if (l.search[1] === '/' ) {
    var decoded = l.search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    window.history.replaceState(null, null,
        l.pathname.slice(0, -1) + decoded + l.hash
    );
  }
}(window.location));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.lang = 'en';
  }, [pathname]);

  return null;
}

function RouteLoading() {
  return (
    <div className="px-6 py-20 text-center text-slate-500" role="status" aria-live="polite">
      Loading page...
    </div>
  );
}

// Flagship program routes that render as immersive, chromeless landing pages.
// These skip the site-wide <Header /> and wrapping <main> so the program's own
// hero can occupy the full viewport without colliding with site chrome.
const CHROMELESS_PATH_PREFIXES = ['/programs/purpose-workshops'];

function isChromelessPath(pathname: string): boolean {
  return CHROMELESS_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
}

function AppContent() {
  const location = useLocation();
  const chromeless = isChromelessPath(location.pathname);

  const routes = (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mission" element={<MissionPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/stories/:categoryId" element={<StoryCategoryPage />} />
        <Route path="/stories/:categoryId/:slug" element={<StoryArticlePage />} />
        <Route path="/impact" element={<ImpactPage />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/purpose-workshops" element={<PurposeWorkshopsPage />} />
        <Route path="/programs/:slug" element={<ProgramDetailRoute />} />
        <Route path="/community-connectors" element={<CommunityConnectorsPage />} />
        <Route path="/commconn" element={<Navigate to="/community-connectors" replace />} />
        <Route path="/sponsors" element={<SponsorsPage />} />
        <Route path="/resiliency-hub" element={<Navigate to="/resilience-hub" replace />} />
        <Route path="/resilience-hub" element={<ResilienceHubPage />} />
        <Route path="/directory" element={<DirectoryPage />} />
        <Route path="/directory/:id" element={<DirectoryEntryPage />} />
        <Route path="/news-media" element={<Navigate to="/press" replace />} />
        <Route path="/newsroom" element={<Navigate to="/press" replace />} />
        <Route path="/press" element={<PressPortalPage />} />
        <Route path="/press/:slug" element={<PressReleasePage />} />
        <Route path="/get-involved" element={<GetInvolvedPage />} />
        <Route path="/volunteer" element={<Navigate to="/intake?intent=volunteer" replace />} />
        <Route path="/partner" element={<Navigate to="/intake?intent=partner" replace />} />
        <Route path="/contact" element={<Navigate to="/intake?intent=contact" replace />} />
        <Route path="/intake" element={<IntakePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/community-champions/helene-one-year" element={<CommunityChampionsArticle />} />
        <Route path="/stories/community-champions/helene-anniversary" element={<HeleneOneYearArticle />} />
        <Route path="/trust" element={<TrustPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route
          path="/healthcare-story"
          element={
            <ExternalRedirect
              to={HEALTHCARE_STORY_FORM_URL}
              title="Healthcare Story Form | SparkPoint"
              description="Share your healthcare experience through SparkPoint’s Rural Health Care Access story-collection form."
              path="/healthcare-story"
              heading="Opening the healthcare story form…"
              body="You’re being sent to SparkPoint’s secure story-collection form through SparkConnection/NarraFirma."
              linkText="Continue to the healthcare story form"
            />
          }
        />
        <Route path="/donations" element={<ExternalRedirect to="https://cowbell-primrose-tet2.squarespace.com/donations" />} />
        <Route path="/newsletter" element={<ExternalRedirect to="https://cowbell-primrose-tet2.squarespace.com/newsletter" />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Suspense>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen relative flex flex-col">
        <ScrollToTop />
        {!chromeless && (
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] px-6 py-3 bg-white text-[#E03694] font-bold rounded-lg shadow-lg border-2 border-[#E03694] transition-all"
          >
            Skip to main content
          </a>
        )}
        {!chromeless && <Header />}
        <StructuredData />
        {chromeless ? (
          <div className="flex-grow">{routes}</div>
        ) : (
          <main id="main-content" className="flex-grow">
            {routes}
          </main>
        )}
        <Footer />
      </div>
    </MotionConfig>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <AccessibilityProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <AppContent />
        </Router>
      </AccessibilityProvider>
    </HelmetProvider>
  );
}
