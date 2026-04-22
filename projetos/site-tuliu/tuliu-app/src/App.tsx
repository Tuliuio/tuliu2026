import { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Integrations from './components/Integrations';
import Pricing from './components/Pricing';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import CasesPage from './components/CasesPage';
import LearnPage from './components/LearnPage';
import './index.css';

type Page = 'home' | 'cases' | 'learn';

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [scrollToAnchor, setScrollToAnchor] = useState<string | null>(null);

  // Page navigation with history support
  const navigate = (page: Page, anchor?: string) => {
    setCurrentPage(page);
    const url = page === 'home' ? '/' : `/${page}`;
    window.history.pushState({ page }, '', url);
    if (anchor) {
      setScrollToAnchor(anchor);
    } else {
      window.scrollTo(0, 0);
    }
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const page = (event.state?.page as Page) || 'home';
      setCurrentPage(page);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Scroll to anchor after page renders
  useEffect(() => {
    if (scrollToAnchor && currentPage === 'home') {
      const element = document.getElementById(scrollToAnchor);
      if (element) {
        setTimeout(() => {
          // Make all fade-in elements in the scrolled section visible immediately
          const fadeInElements = element.querySelectorAll('.fade-in');
          fadeInElements.forEach((el) => {
            el.classList.add('visible');
          });

          element.scrollIntoView({ behavior: 'smooth' });
          setScrollToAnchor(null);
        }, 50);
      }
    }
  }, [scrollToAnchor, currentPage]);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    // Re-observe all fade-in elements when page changes
    document.querySelectorAll('.fade-in').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentPage]);

  return (
    <LanguageProvider>
      <Navbar
        onOpenLogin={() => setIsLoginOpen(true)}
        currentPage={currentPage}
        onNavigate={navigate}
      />
      <main>
        {currentPage === 'home' ? (
          <>
            <Hero />
            <Features />
            <Integrations />
            <Pricing />
            <FinalCTA />
          </>
        ) : currentPage === 'cases' ? (
          <CasesPage />
        ) : (
          <LearnPage />
        )}
      </main>
      <Footer />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </LanguageProvider>
  );
}

export default App;
