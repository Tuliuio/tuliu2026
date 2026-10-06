import { useState, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { useAuth } from './context/AuthContext';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import DashboardNavbar from './components/DashboardNavbar';
import Hero from './components/Hero';
import Included from './components/Included';
import Pricing from './components/Pricing';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import CasesPage from './components/CasesPage';
import LearnPage from './components/LearnPage';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/dashboard/DashboardPage';
import AdminPage from './components/admin/AdminPage';
import LoadingScreen from './components/LoadingScreen';
import FloatingWhatsAppButton from './components/FloatingWhatsAppButton';
import FloatingCta from './components/FloatingCta';
import ResetPasswordPage from './components/ResetPasswordPage';
import OnboardingPage from './components/OnboardingPage';
import LandingPage from './components/landing/LandingPage';
import { setMeta } from './lib/meta';
import LeadFormModal from './components/LeadFormModal';
import { FinalBand, Related } from './components/landing/blocks';
import { ServicesMarquee, DuoCards, HomeMachine, BehindTheScenes, HomeCases, HomeCompare } from './components/HomeSections';
import { landingBySlug } from './data/landings';
import { NavContext } from './context/NavContext';
import './index.css';

type Page = 'home' | 'cases' | 'learn' | 'login' | 'dashboard' | 'admin' | 'reset-password' | 'onboarding' | 'landing';

const HOME_TITLE = 'Tuliu | Seu time de marketing completo, feito com IA e especialistas';
const HOME_DESCRIPTION = 'Site, SEO, conteúdo, vídeos, tráfego pago, agentes de IA e automações em uma só operação. IA executa, especialistas aprovam. A partir de R$97/mês.';

const slugFromPath = (pathname: string) => pathname.replace(/^\/+|\/+$/g, '');

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [scrollToAnchor, setScrollToAnchor] = useState<string | null>(null);
  const [landingSlug, setLandingSlug] = useState<string | null>(() => {
    const slug = slugFromPath(window.location.pathname);
    return landingBySlug[slug] ? slug : null;
  });
  const [homeLeadOpen, setHomeLeadOpen] = useState(false);
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

  // Navegação por caminho, usada pelas landing pages, menu e rodapé
  const go = (href: string) => {
    const [path, hash] = href.split('#');
    const slug = slugFromPath(path);
    if (landingBySlug[slug]) {
      setLandingSlug(slug);
      setCurrentPage('landing');
      window.history.pushState({ page: 'landing' }, '', `/${slug}`);
      window.scrollTo(0, 0);
    } else if (slug === '') {
      navigate('home', hash || undefined);
    } else if (slug === 'cases' || slug === 'learn' || slug === 'login') {
      navigate(slug);
    } else {
      window.location.href = href;
    }
  };

  // Título e descrição da home (landing pages definem os próprios)
  useEffect(() => {
    if (currentPage === 'home') setMeta(HOME_TITLE, HOME_DESCRIPTION);
  }, [currentPage]);

  // Parse initial URL and handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const page = (event.state?.page as Page) || 'home';
      const slug = slugFromPath(window.location.pathname);
      if (landingBySlug[slug]) {
        setLandingSlug(slug);
        setCurrentPage('landing');
        return;
      }
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
    } else if (landingBySlug[slugFromPath(pathname)]) {
      setCurrentPage('landing');
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
      <NavContext.Provider value={go}>
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
            <ServicesMarquee />
            <DuoCards />
            <HomeMachine />
            <BehindTheScenes />
            <HomeCases />
            <HomeCompare />
            <Pricing />
            <Included />
            <Related
              title="Marketing feito para o seu tipo de negócio."
              subtitle="Cada mercado compra de um jeito. A máquina é a mesma, a estratégia muda."
              hrefs={['marketing-para-pequenas-empresas', 'marketing-para-b2b', 'marketing-para-saude', 'marketing-para-prestadores-de-servico']}
            />
            <FAQ />
            <FinalBand onCta={() => setHomeLeadOpen(true)} />
            <LeadFormModal isOpen={homeLeadOpen} onClose={() => setHomeLeadOpen(false)} source="home-final" />
          </>
        ) : currentPage === 'landing' && landingSlug && landingBySlug[landingSlug] ? (
          <LandingPage landing={landingBySlug[landingSlug]} />
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
      {(currentPage === 'home' || currentPage === 'landing') && <FloatingCta key={landingSlug ?? currentPage} source={currentPage === 'landing' ? landingSlug ?? 'landing' : 'home'} />}
      <FloatingWhatsAppButton />
      </NavContext.Provider>
      </ToastProvider>
    </LanguageProvider>
  );
}

export default App;
