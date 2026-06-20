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
import CasesPage from './components/CasesPage';
import LearnPage from './components/LearnPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/dashboard/DashboardPage';
import AdminPage from './components/admin/AdminPage';
import LoadingScreen from './components/LoadingScreen';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import ResetPasswordPage from './components/ResetPasswordPage';
import OnboardingPage from './components/OnboardingPage';
import './index.css';

type Page = 'home' | 'cases' | 'learn' | 'login' | 'dashboard' | 'admin' | 'reset-password' | 'onboarding';

function App() {
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
      setCurrentPage('login');
      window.history.pushState({ page: 'login' }, '', '/login');
      window.scrollTo(0, 0);
      return;
    }
    setCurrentPage(page);
    const url = page === 'home' ? '/' : `/${page === 'reset-password' ? 'reset-password' : page}`;
    window.history.pushState({ page }, '', url);
    if (anchor) {
      setScrollToAnchor(anchor);
    } else {
      window.scrollTo(0, 0);
    }
  };

  // Parse initial URL and handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const page = (event.state?.page as Page) || 'home';
      setCurrentPage(page);
    };

    // Parse initial URL on first load
    const pathname = window.location.pathname;
    if (pathname === '/dashboard') {
      setCurrentPage('dashboard');
    } else if (pathname === '/admin') {
      setCurrentPage('admin');
    } else if (pathname === '/login') {
      setCurrentPage('login');
    } else if (pathname === '/reset-password') {
      setCurrentPage('reset-password');
    } else if (pathname === '/cases') {
      setCurrentPage('cases');
    } else if (pathname === '/learn') {
      setCurrentPage('learn');
    } else {
      setCurrentPage('home');
    }

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

  // Intersection Observer for fade-in animations (mantido para compatibilidade)
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

    return () => {
      observer.disconnect();
    };
  }, [currentPage]);

  useEffect(() => {
    console.log('[App] Rendering with loading:', loading, 'session:', !!session, 'currentPage:', currentPage);
  }, [loading, session, currentPage]);

  // Auto-navigate based on user role when logged in
  useEffect(() => {
    if (session && currentPage === 'login' && client) {
      // Onboarding é exclusivo de quem comprou: o cadastro via pagamento (webhook
      // ASAAS) seta asaas_customer_id. Cadastros diretos não têm e vão direto ao painel.
      const hasPurchased = !!client.asaas_customer_id;
      if (client.role === 'admin') {
        navigate('admin');
      } else if (hasPurchased && !client.onboarding_completed) {
        navigate('onboarding');
      } else {
        navigate('dashboard');
      }
    }
  }, [session, currentPage, client]);

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
      ) : currentPage !== 'login' && currentPage !== 'reset-password' && currentPage !== 'onboarding' ? (
        <Navbar
          onOpenLogin={() => navigate('login')}
          currentPage={currentPage}
          onNavigate={navigate}
        />
      ) : null}
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
        ) : currentPage === 'login' ? (
          <LoginPage onNavigateToHome={() => navigate('home')} />
        ) : currentPage === 'reset-password' ? (
          <ResetPasswordPage onNavigateToHome={() => navigate('home')} />
        ) : currentPage === 'onboarding' ? (
          session ? <OnboardingPage onComplete={() => navigate('dashboard')} /> : null
        ) : currentPage === 'dashboard' ? (
          session ? <DashboardPage /> : null
        ) : currentPage === 'admin' ? (
          session ? <AdminPage /> : null
        ) : null}
      </main>
      {currentPage !== 'login' && currentPage !== 'reset-password' && currentPage !== 'onboarding' && <Footer />}
      <FloatingWhatsAppButton />
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
