import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Block, Cell, Landing } from '../../data/landingTypes';
import { cases } from '../../data/cases';
import { landingBySlug } from '../../data/landings';
import { useLinkProps } from '../../context/NavContext';

type Of<T extends Block['type']> = Extract<Block, { type: T }>;

export const PRICE_FROM = 'R$97/mês';

function Header({ eyebrow, title, subtitle, dark }: { eyebrow?: string; title: string; subtitle?: string; dark?: boolean }) {
  return (
    <div className={`lp-header${dark ? ' lp-header-dark' : ''}`}>
      {eyebrow && <span className="lp-eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export function CtaButton({ label, onClick, light }: { label: string; onClick: () => void; light?: boolean }) {
  return (
    <button type="button" className={`pill-btn ${light ? 'pill-dark' : 'pill-light'}`} onClick={onClick}>
      {label} <i className="fas fa-arrow-right"></i>
    </button>
  );
}

export type MarqueeItem = string | { icon: string; label: string };

export function Marquee({ items, reverse, chip }: { items: MarqueeItem[]; reverse?: boolean; chip?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="lp-marquee" aria-hidden="true">
      <div className={`lp-marquee-track${reverse ? ' reverse' : ''}`}>
        {loop.map((item, i) => (
          <span key={i} className={chip ? 'lp-chip' : 'lp-marquee-item'}>
            {typeof item === 'string' ? item : <><i className={item.icon}></i>{item.label}</>}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- HERO ---------- */
export function LandingHero({ hero, onCta }: { hero: Landing['hero']; onCta: () => void }) {
  const link = useLinkProps();
  return (
    <section className="lp-hero">
      <div className="container-wide lp-hero-grid">
        <div className="lp-hero-copy">
          <span className="lp-hero-eyebrow"><i className="fas fa-circle"></i>{hero.eyebrow}</span>
          <h1>
            {hero.title}
            {hero.highlight && <> <span className="lp-gradient-text">{hero.highlight}</span></>}
          </h1>
          <p className="lp-hero-sub">{hero.subtitle}</p>
          <div className="lp-hero-actions">
            <CtaButton label="Quero meu diagnóstico gratuito" onClick={onCta} />
            <a className="lp-hero-price" {...link('/#precos')}>
              <strong>A partir de {PRICE_FROM}</strong>
              <span>Ver os planos</span>
            </a>
          </div>
          <p className="lp-hero-micro"><i className="fab fa-whatsapp"></i> Sem fidelidade. Tudo resolvido por WhatsApp.</p>
        </div>
        {hero.ticker && (
          <div className="lp-ticker" aria-label={hero.ticker.title}>
            <div className="lp-ticker-head">
              <span className="lp-live-dot"></span>
              {hero.ticker.title}
            </div>
            <div className="lp-ticker-meta">
              <div><span>Canais</span><strong>6</strong></div>
              <div><span>Revisão humana</span><strong>sempre</strong></div>
            </div>
            <div className="lp-ticker-label">Hoje</div>
            <div className="lp-ticker-window">
              <ul className="lp-ticker-list">
                {[...hero.ticker.items, ...hero.ticker.items].map((item, i) => (
                  <li key={i}><i className="fas fa-check"></i>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- MACHINE ---------- */
function Machine({ b }: { b: Of<'machine'> }) {
  return (
    <section className="lp-section lp-dark">
      <div className="container">
        <Header eyebrow="Como funciona" title={b.title} subtitle={b.subtitle} dark />
        <div className="lp-machine">
          <div className="lp-machine-col">
            <h3><i className="fas fa-database"></i> Fontes de dados</h3>
            <ul className="lp-sources">
              {b.sources.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
          <div className="lp-machine-col">
            <h3><i className="fas fa-magnifying-glass-chart"></i> A IA analisa</h3>
            <div className="lp-vscroll">
              <div className="lp-vscroll-track">
                {[...b.questions, ...b.questions].map((q, i) => (
                  <div key={i} className="lp-q"><strong>{q.title}</strong><span>{q.q}</span></div>
                ))}
              </div>
            </div>
          </div>
          <div className="lp-machine-col">
            <h3><i className="fas fa-wand-magic-sparkles"></i> Todo dia, a IA melhora</h3>
            <div className="lp-vscroll">
              <div className="lp-vscroll-track slow">
                {[...b.improvements, ...b.improvements].map((m, i) => (
                  <div key={i} className="lp-q lp-q-done"><strong><i className="fas fa-check"></i> {m.title}</strong><span>{m.desc}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="lp-machine-foot">
          <span><i className="fas fa-comment"></i> Seu input</span>
          <span className="lp-plus">+</span>
          <span><i className="fas fa-user-check"></i> Nosso time aprova cada mudança</span>
        </div>
      </div>
    </section>
  );
}

/* ---------- VOLUME ---------- */
function Volume({ b, onCta }: { b: Of<'volume'>; onCta: () => void }) {
  return (
    <section className="lp-section">
      <div className="container">
        <Header eyebrow="Comparativo" title={b.title} subtitle={b.subtitle} />
        <div className="lp-volume">
          {b.options.map((o) => (
            <div key={o.label} className={`lp-volume-card${o.recommended ? ' recommended' : ''}`}>
              {o.recommended && <span className="lp-reco">Recomendado</span>}
              <h3>{o.label}</h3>
              <div className="lp-meter" aria-label={`Volume de execução: ${o.level} de 5`}>
                {[1, 2, 3, 4, 5].map((n) => <span key={n} className={n <= o.level ? 'on' : ''}></span>)}
              </div>
              <span className="lp-volume-caption">execução por mês</span>
              <p className="lp-volume-price">{o.price}</p>
              <p className="lp-volume-desc">{o.desc}</p>
              {o.recommended && (
                <button type="button" className="lp-text-btn" onClick={onCta}>
                  Quero meu diagnóstico <i className="fas fa-arrow-right"></i>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- REASONS ---------- */
function Reasons({ b }: { b: Of<'reasons'> }) {
  return (
    <section className="lp-section lp-soft">
      <div className="container">
        <Header title={b.title} subtitle={b.subtitle} />
        <ol className="lp-reasons">
          {b.items.map((r, i) => (
            <li key={r.title}>
              <span className="lp-num">{String(i + 1).padStart(2, '0')}</span>
              <div><h3>{r.title}</h3><p>{r.desc}</p></div>
            </li>
          ))}
        </ol>
        {b.aside && (
          <div className="lp-aside">
            <h3>{b.aside.title}</h3>
            <p>{b.aside.text}</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------- BUNDLE ---------- */
function Bundle({ b }: { b: Of<'bundle'> }) {
  const link = useLinkProps();
  return (
    <section className="lp-section">
      <div className="container">
        <Header title={b.title} subtitle={b.subtitle} />
        <div className="lp-chips">
          {b.chips.map((c) => <span key={c} className="lp-chip">{c}</span>)}
        </div>
        <div className="lp-cards three">
          {b.cards.map((c) => (
            <div key={c.title} className="lp-card">
              <div className="lp-card-icon"><i className={c.icon}></i></div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="lp-inline-links">
          <a {...link('/#maquina')}>Ver a máquina completa <i className="fas fa-arrow-right"></i></a>
          <a {...link('/#precos')}>Quanto custa <i className="fas fa-arrow-right"></i></a>
        </div>
      </div>
    </section>
  );
}

/* ---------- PRICE BAND ---------- */
export function PriceBand({ onCta, text }: { onCta: () => void; text?: string }) {
  return (
    <div className="lp-price-band">
      <div>
        <span className="lp-price-band-label">Com a Tuliu</span>
        <p>
          {text ?? `Um valor mensal fixo, a partir de ${PRICE_FROM}. Site, SEO, conteúdo, tráfego pago e manutenção em um só lugar, com IA e especialistas fazendo o trabalho.`}
        </p>
      </div>
      <CtaButton label="Quero meu diagnóstico" onClick={onCta} />
    </div>
  );
}

/* ---------- COSTS / NEEDS ---------- */
function Costs({ b, onCta }: { b: Of<'costs'> | Of<'needs'>; onCta: () => void }) {
  return (
    <section className="lp-section lp-soft">
      <div className="container">
        <Header title={b.title} subtitle={b.subtitle} />
        <div className="lp-costs">
          {b.items.map((c) => (
            <div key={c.title} className="lp-cost">
              <span className="lp-cost-tag">{c.tag}</span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
        {b.summary && <p className="lp-summary">{b.summary}</p>}
        <PriceBand onCta={onCta} />
      </div>
    </section>
  );
}

/* ---------- TABLE ---------- */
const cellIcon: Record<Cell, string> = { yes: 'fas fa-check', partly: 'fas fa-circle-half-stroke', no: 'fas fa-xmark' };
const cellLabel: Record<Cell, string> = { yes: 'sim', partly: 'em parte', no: 'não' };

export function CompareTable({ title, subtitle, columns, rows, footer }: { title: string; subtitle: string; columns: string[]; rows: { label: string; values: Cell[] }[]; footer?: ReactNode }) {
  const tuliuIndex = columns.findIndex((c) => c.toLowerCase().startsWith('tuliu'));
  return (
    <section className="lp-section" id="comparativo">
      <div className="container">
        <Header eyebrow="Linha a linha" title={title} subtitle={subtitle} />
        <div className="lp-table-wrap">
          <table className={`lp-table${columns.length > 3 ? ' many-cols' : ''}`}>
            <thead>
              <tr>
                <th></th>
                {columns.map((c, i) => (
                  <th key={c} className={i === tuliuIndex ? 'is-tuliu' : ''}>
                    <span className="col-full">{c}</span>
                    <span className="col-short">{c.split(/[ ,+]/)[0]}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label}>
                  <th scope="row">{r.label}</th>
                  {r.values.map((v, i) => (
                    <td key={i} className={`cell-${v}${i === tuliuIndex ? ' is-tuliu' : ''}`}>
                      <i className={cellIcon[v]} aria-label={cellLabel[v]}></i>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="lp-legend">
          <span className="cell-yes"><i className="fas fa-check"></i> sim</span>
          <span className="cell-partly"><i className="fas fa-circle-half-stroke"></i> em parte</span>
          <span className="cell-no"><i className="fas fa-xmark"></i> não</span>
        </div>
        {footer}
      </div>
    </section>
  );
}

/* ---------- WHEN / PROSE ---------- */
function When({ b }: { b: Of<'when'> }) {
  const link = useLinkProps();
  return (
    <section className="lp-section lp-soft">
      <div className="container lp-narrow">
        <Header title={b.title} />
        {b.paragraphs.map((p, i) => <p key={i} className="lp-prose">{p}</p>)}
        {b.links && (
          <ul className="lp-link-list">
            {b.links.map((l) => (
              <li key={l.href}><a {...link(l.href)}>{l.label} <i className="fas fa-arrow-right"></i></a></li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function Prose({ b }: { b: Of<'prose'> }) {
  const link = useLinkProps();
  return (
    <section className="lp-section">
      <div className="container lp-narrow">
        <Header title={b.title} />
        {b.paragraphs.map((p, i) => <p key={i} className="lp-prose">{p}</p>)}
        {b.link && <a className="lp-text-link" {...link(b.link.href)}>{b.link.label} <i className="fas fa-arrow-right"></i></a>}
      </div>
    </section>
  );
}

/* ---------- STEPS ---------- */
function Steps({ b }: { b: Of<'steps'> }) {
  return (
    <section className="lp-section">
      <div className="container">
        <Header eyebrow="Passo a passo" title={b.title} />
        <div className="lp-steps">
          {b.items.map((s, i) => (
            <div key={s.title} className="lp-step">
              <span className="lp-step-num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- EXPERT ---------- */
export function Expert({ title, quote }: { title: string; quote: string }) {
  return (
    <section className="lp-section lp-dark">
      <div className="container lp-narrow">
        <Header title={title} dark />
        <figure className="lp-expert">
          <span className="lp-expert-badge"><i className="fas fa-user-check"></i> Aprova o seu marketing</span>
          <blockquote>{quote}</blockquote>
          <figcaption>
            <strong>Time de especialistas Tuliu</strong>
            <span>Estratégia, tráfego, design e tecnologia</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------- CASES ---------- */
export function CasesStrip({ title, subtitle, ids }: { title: string; subtitle: string; ids?: string[] }) {
  const link = useLinkProps();
  const list = ids ? cases.filter((c) => ids.includes(c.id)) : cases;
  return (
    <section className="lp-section lp-soft">
      <div className="container">
        <Header eyebrow="Resultados reais" title={title} subtitle={subtitle} />
        <div className="lp-cases">
          {list.map((c) => (
            <article key={c.id} className="lp-case">
              <span className="lp-case-sector"><i className={c.icon}></i> {c.sector}</span>
              <h3>{c.client}</h3>
              <ul>
                {c.metrics.slice(1).map((m) => <li key={m.label}>{m.value} {m.label}</li>)}
              </ul>
              <div className="lp-case-metric">
                <strong>{c.metrics[0].value}</strong>
                <span>{c.metrics[0].label}</span>
              </div>
              {c.testimonial && <p className="lp-case-quote">"{c.testimonial.quote}"<span> {c.testimonial.author}, {c.testimonial.role}</span></p>}
            </article>
          ))}
        </div>
        <a className="lp-text-link center" {...link('/cases')}>Ver todos os resultados <i className="fas fa-arrow-right"></i></a>
      </div>
    </section>
  );
}

/* ---------- FEATURES ---------- */
function Features({ b }: { b: Of<'features'> }) {
  return (
    <section className="lp-section">
      <div className="container">
        <Header title={b.title} subtitle={b.subtitle} />
        <div className={`lp-cards${b.items.length % 3 === 0 ? ' three' : ''}`}>
          {b.items.map((c) => (
            <div key={c.title} className="lp-card">
              <div className="lp-card-icon"><i className={c.icon}></i></div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- RELATED ---------- */
export function Related({ title, subtitle, hrefs }: { title: string; subtitle?: string; hrefs: string[] }) {
  const link = useLinkProps();
  return (
    <section className="lp-section">
      <div className="container">
        <Header title={title} subtitle={subtitle} />
        <div className="lp-related">
          {hrefs.map((slug) => {
            const l = landingBySlug[slug];
            if (!l) return null;
            return (
              <a key={slug} className="lp-related-card" {...link(`/${slug}`)}>
                <strong>{l.navLabel}</strong>
                <span>{l.navDesc}</span>
                <i className="fas fa-arrow-right"></i>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ ---------- */
export function Faq({ title, items }: { title: string; items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="lp-section lp-soft">
      <div className="container lp-narrow">
        <Header eyebrow="Perguntas" title={title} />
        <div className="lp-faq">
          {items.map((item, i) => (
            <div key={item.q} className={`lp-faq-item${open === i ? ' open' : ''}`}>
              <button type="button" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                <span>{item.q}</span>
                <i className={`fas ${open === i ? 'fa-minus' : 'fa-plus'}`} aria-hidden="true"></i>
              </button>
              {open === i && <p>{item.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- FINAL CTA ---------- */
export function FinalBand({ onCta }: { onCta: () => void }) {
  return (
    <section className="lp-final">
      <div className="container">
        <div className="lp-final-inner">
          <span className="lp-eyebrow light">Diagnóstico gratuito</span>
          <h2>Veja o que a Tuliu faria pelo seu marketing.</h2>
          <p>Conta sobre o seu negócio. Nosso time olha seu site, seus canais e seus concorrentes e te devolve no WhatsApp o que fazer primeiro, sem compromisso.</p>
          <div className="lp-final-steps">
            <div><span>01</span><strong>Você manda o site ou Instagram</strong><p>Sem proposta, sem reunião de kickoff.</p></div>
            <div><span>02</span><strong>A gente analisa</strong><p>IA e especialistas olham dados, concorrentes e oportunidades.</p></div>
            <div><span>03</span><strong>Você recebe no WhatsApp</strong><p>Um plano claro do que fazer primeiro e quanto custa.</p></div>
          </div>
          <div className="lp-final-actions">
            <CtaButton label="Quero meu diagnóstico gratuito" onClick={onCta} />
            <a className="lp-final-alt" href="https://wa.me/554840426597" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-whatsapp"></i> Prefere conversar antes? Chama no WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- DISPATCH ---------- */
export function RenderBlock({ b, onCta }: { b: Block; onCta: () => void }) {
  switch (b.type) {
    case 'machine': return <Machine b={b} />;
    case 'volume': return <Volume b={b} onCta={onCta} />;
    case 'reasons': return <Reasons b={b} />;
    case 'bundle': return <Bundle b={b} />;
    case 'costs':
    case 'needs': return <Costs b={b} onCta={onCta} />;
    case 'table': return <CompareTable {...b} />;
    case 'when': return <When b={b} />;
    case 'steps': return <Steps b={b} />;
    case 'expert': return <Expert {...b} />;
    case 'cases': return <CasesStrip {...b} />;
    case 'prose': return <Prose b={b} />;
    case 'features': return <Features b={b} />;
    case 'related': return <Related {...b} />;
    case 'faq': return <Faq {...b} />;
  }
}
