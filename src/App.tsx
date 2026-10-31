import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { GameProgressProvider } from './contexts/GameProgressContext';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { AchievementToast } from './components/AchievementToast/AchievementToast';
import { HomePage } from './pages/Home/HomePage';
import { AllGamesPage } from './pages/AllGames/AllGamesPage';
import { CategoriesPage } from './pages/Categories/CategoriesPage';
import { GamePage } from './pages/GamePage/GamePage';
import { AboutPage } from './pages/About/AboutPage';
import { ContactPage } from './pages/Contact/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicy/PrivacyPolicyPage';
import { TermsPage } from './pages/Terms/TermsPage';
import { DisclaimerPage } from './pages/Disclaimer/DisclaimerPage';
import { NotFoundPage } from './pages/NotFound/NotFoundPage';
import { analytics } from './services/analytics';

// Auto Scroll to Top on route navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    analytics.trackPageView(pathname);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <GameProgressProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-dark-bg text-text-main">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/games" element={<AllGamesPage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/games/:slug" element={<GamePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/disclaimer" element={<DisclaimerPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <AchievementToast />
        </div>
      </GameProgressProvider>
    </BrowserRouter>
  );
};

export default App;
