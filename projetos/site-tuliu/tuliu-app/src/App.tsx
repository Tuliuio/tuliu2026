import { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import DashboardNavbar from './components/DashboardNavbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Integrations from './components/Integrations';
import Pricing from './components/Pricing';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import CasesPage from './components/CasesPage';
import LearnPage from './components/LearnPage';
import DashboardPage from './components/dashboard/DashboardPage';
import AdminPage from './components/admin/AdminPage';
import LoadingScreen from './components/LoadingScreen';
import './index.css';

type Page = 'home' | 'cases' | 'learn' | 'dashboard' | 'admin';

function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [scrollToAnchor, setScrollToAnchor] = useState<string | null>(null);
  const { session, loading, client } = useAuth();

  // Suppress third-party script errors
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      if (e.filename?.includes('share-modal')) {
        e.preventDefault();
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Page navigation with authentication check
  const navigate = (page: Page, anchor?: string) => {
    if ((page === 'dashboard' || page === 'admin') && !session) {
      setIsAuthOpen(true);
      return;
    }
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

    const fadeInElements = document.querySelectorAll('.fade-in');
    fadeInElements.forEach((el) => {
      observer.observe(el);
    });

    // Fallback: make elements visible after 100ms if not already
    const timeout = setTimeout(() => {
      fadeInElements.forEach((el) => {
        if (!el.classList.contains('visible')) {
          el.classList.add('visible');
        }
      });
    }, 100);

    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [currentPage]);

  useEffect(() => {
    console.log('[App] Rendering with loading:', loading, 'session:', !!session, 'currentPage:', currentPage);
  }, [loading, session, currentPage]);

  // Auto-navigate based on user role when logged in and modal closes
  useEffect(() => {
    if (session && !isAuthOpen && currentPage === 'home' && client) {
      if (client.role === 'admin') {
        console.log('[App] Admin user detected, navigating to admin');
        navigate('admin');
      } else {
        console.log('[App] Client user detected, navigating to dashboard');
        navigate('dashboard');
      }
    }
  }, [session, isAuthOpen, currentPage, client]);

  if (loading) {
    return (
      <LanguageProvider>
        <ToastProvider>
          <LoadingScreen />
        </ToastProvider>
      </LanguageProvider>
    );
  }

  return (
    <LanguageProvider>
      <ToastProvider>
      {currentPage === 'dashboard' || currentPage === 'admin' ? (
        <DashboardNavbar
          currentPage={currentPage}
          onNavigate={navigate}
        />
      ) : (
        <Navbar
          onOpenLogin={() => setIsAuthOpen(true)}
          currentPage={currentPage}
          onNavigate={navigate}
        />
      )}
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
        ) : currentPage === 'learn' ? (
          <LearnPage />
        ) : currentPage === 'dashboard' ? (
          session ? <DashboardPage /> : null
        ) : currentPage === 'admin' ? (
          session ? <AdminPage /> : null
        ) : null}
      </main>
      <Footer />
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          if (session) {
            navigate('dashboard');
          }
        }}
      />
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
