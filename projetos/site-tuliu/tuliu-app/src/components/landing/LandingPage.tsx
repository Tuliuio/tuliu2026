import { useEffect, useState } from 'react';
import type { Landing } from '../../data/landingTypes';
import LeadFormModal from '../LeadFormModal';
import { FinalBand, LandingHero, RenderBlock } from './blocks';
import { setMeta } from '../../lib/meta';

export default function LandingPage({ landing }: { landing: Landing }) {
  const [leadOpen, setLeadOpen] = useState(false);
  const openLead = () => setLeadOpen(true);

  useEffect(() => {
    setMeta(landing.metaTitle, landing.metaDescription);
  }, [landing]);

  return (
    <div className="lp">
      <LandingHero hero={landing.hero} onCta={openLead} />
      {landing.blocks.map((b, i) => <RenderBlock key={`${landing.slug}-${i}`} b={b} onCta={openLead} />)}
      <FinalBand onCta={openLead} />
      <LeadFormModal isOpen={leadOpen} onClose={() => setLeadOpen(false)} source={`lp-${landing.slug}`} />
    </div>
  );
}
