import React from 'react';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MetricsSection from './components/MetricsSection';
import FeatureGrid from './components/FeatureGrid';
import PricingSection from './components/PricingSection';
import Footer from './components/Footer';
import AiConsultant from './components/AiConsultant';

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#030014] text-white selection:bg-brand-cyan selection:text-black font-sans">
        <Navbar />
        
        <main>
          <Hero />
          <MetricsSection />
          <FeatureGrid />
          <PricingSection />
        </main>
        
        <Footer />
        <AiConsultant />
      </div>
    </LanguageProvider>
  );
};

export default App;