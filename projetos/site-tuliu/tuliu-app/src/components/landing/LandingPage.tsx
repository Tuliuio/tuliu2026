import { useEffect } from 'react';
import type { Landing } from '../../data/landingTypes';
import { useGo } from '../../context/NavContext';
import { diagHref } from '../../lib/diag';
import { FinalBand, LandingHero, RenderBlock } from './blocks';
import { setMeta } from '../../lib/meta';

export default function LandingPage({ landing }: { landing: Landing }) {
  const go = useGo();
  const openLead = () => go(diagHref(`lp-${landing.slug}`));

  useEffect(() => {
    setMeta(landing.metaTitle, landing.metaDescription);
  }, [landing]);

  return (
    <div className="lp">
      <LandingHero hero={landing.hero} onCta={openLead} />
      {landing.blocks.map((b, i) => <RenderBlock key={`${landing.slug}-${i}`} b={b} onCta={openLead} />)}
      <FinalBand onCta={openLead} />
    </div>
  );
}
