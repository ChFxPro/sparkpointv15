import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router';
import { useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { StructuredData } from './components/StructuredData';
import { HomePage } from './pages/HomePage';
import { MissionPage } from './pages/MissionPage';
import { StoriesPage } from './pages/StoriesPage';
import { StoryCategoryPage } from './pages/StoryCategoryPage';
import { StoryArticlePage } from './pages/StoryArticlePage';
import { ImpactPage } from './pages/ImpactPage';
import { GetInvolvedPage } from './pages/GetInvolvedPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage'; // Keeping for reference or fallback? Probably unused now.
import { VolunteerPage } from './pages/VolunteerPage'; // Unused now.
import { IntakePage } from './pages/IntakePage';
import { TrustPage } from './pages/TrustPage';
import { PrivacyPage } from './pages/PrivacyPage';
import CommunityChampionsArticle from './pages/CommunityChampionsArticle';
import HeleneOneYearArticle from './pages/HeleneOneYearArticle';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { MotionConfig } from 'motion/react';

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

function AppContent() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen relative flex flex-col">
        <ScrollToTop />
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] px-6 py-3 bg-white text-[#E03694] font-bold rounded-lg shadow-lg border-2 border-[#E03694] transition-all"
        >
          Skip to main content
        </a>
        <Header />
        <StructuredData />
        <main id="main-content" className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/mission" element={<MissionPage />} />
            <Route path="/stories" element={<StoriesPage />} />
            <Route path="/stories/:categoryId" element={<StoryCategoryPage />} />
            <Route path="/stories/:categoryId/:slug" element={<StoryArticlePage />} />
            <Route path="/impact" element={<ImpactPage />} />
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
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
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
