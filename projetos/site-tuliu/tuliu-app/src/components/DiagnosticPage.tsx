import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useLinkProps } from '../context/NavContext';
import { setMeta } from '../lib/meta';

const SUPABASE_URL = 'https://dojjedejwpwzvqoomtsj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvamplZGVqd3B3enZxb29tdHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMDc4ODMsImV4cCI6MjA1ODY4Mzg4M30.oewMMwFCBBX-5OcSTADnj5wlMwvNFiMLFovDcT5UMYA';
const WHATSAPP_URL = 'https://wa.me/554840426597';

const PLAN_LABELS: Record<string, string> = { starter: 'Plano Starter', business: 'Plano Business' };

// Página de diagnóstico gratuito (substitui o antigo pop-up de lead).
// Origem e plano chegam pela URL: /diagnostico?origem=hero&plano=business
export default function DiagnosticPage() {
  const { t, language } = useLanguage();
  const f = t.leadForm;
  const link = useLinkProps();

  const params = new URLSearchParams(window.location.search);
  const source = params.get('origem') || 'direto';
  const plan = params.get('plano');
  const planLabel = plan ? PLAN_LABELS[plan] ?? null : null;

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [challenges, setChallenges] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMeta('Diagnóstico gratuito | Tuliu', 'Conte sobre o seu negócio e receba no WhatsApp um diagnóstico gratuito do seu marketing, sem compromisso.');
  }, []);

  const toggle = (opt: string) =>
    setChallenges((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (challenges.length === 0 && !note.trim()) {
      setError(f.challengeRequired);
      return;
    }
    setLoading(true);
    setError('');
    const mainChallenge = [challenges.join('; '), note.trim()].filter(Boolean).join(' | ');
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          name,
          whatsapp,
          business_handle: handle,
          email: email || null,
          main_challenge: mainChallenge,
          plan_interest: plan,
          source,
          language,
        }),
      });
      if (!res.ok) throw new Error(f.errorFallback);
      setSuccess(true);
      window.scrollTo(0, 0);
    } catch (err: unknown) {
      setError((err as Error).message || f.errorFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="diag">
      <div className="container-wide diag-grid">
        <div className="diag-intro">
          <span className="lp-eyebrow">Diagnóstico gratuito</span>
          <h1>{f.title}</h1>
          <p className="diag-lead">{f.subtitle}</p>

          <ol className="diag-steps">
            <li><span>01</span><div><strong>Você conta sobre o negócio</strong><p>Leva menos de 2 minutos. Sem reunião, sem proposta genérica.</p></div></li>
            <li><span>02</span><div><strong>A gente analisa de perto</strong><p>IA e especialistas olham seu site, seus canais e seus concorrentes.</p></div></li>
            <li><span>03</span><div><strong>Você recebe no WhatsApp</strong><p>Um plano claro do que fazer primeiro e quanto custa.</p></div></li>
          </ol>

          <ul className="diag-trust">
            <li><i className="fas fa-shield-halved"></i> Sem compromisso</li>
            <li><i className="fas fa-clock"></i> Resposta em até 1 dia útil</li>
            <li><i className="fab fa-whatsapp"></i> Direto no WhatsApp</li>
          </ul>
        </div>

        <div className="diag-card">
          {success ? (
            <div className="diag-success">
              <div className="diag-success-icon"><i className="fas fa-check"></i></div>
              <h2>{f.successTitle}</h2>
              <p>{f.successDesc}</p>
              <a className="pill-btn pill-dark" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <i className="fab fa-whatsapp"></i> Falar agora no WhatsApp
              </a>
              <a className="diag-back" {...link('/')}>Voltar para o site</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate={false}>
              {planLabel && <span className="diag-plan"><i className="fas fa-tag"></i> {f.planLabel}: {planLabel}</span>}

              <div className="diag-row">
                <label className="diag-field">
                  <span>{f.nameLabel}</span>
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder={f.namePlaceholder} autoComplete="name" />
                </label>
                <label className="diag-field">
                  <span>{f.whatsappLabel}</span>
                  <input required type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder={f.whatsappPlaceholder} autoComplete="tel" />
                </label>
              </div>

              <div className="diag-row">
                <label className="diag-field">
                  <span>{f.handleLabel}</span>
                  <input value={handle} onChange={(e) => setHandle(e.target.value)} placeholder={f.handlePlaceholder} />
                </label>
                <label className="diag-field">
                  <span>{f.emailLabel}</span>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={f.emailPlaceholder} autoComplete="email" />
                </label>
              </div>

              <fieldset className="diag-field">
                <legend>{f.challengeLabel} <em>{f.challengeHint}</em></legend>
                <div className="diag-chips">
                  {f.challengeOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      className={`diag-chip${challenges.includes(opt) ? ' on' : ''}`}
                      aria-pressed={challenges.includes(opt)}
                      onClick={() => toggle(opt)}
                    >
                      <i className={`fas ${challenges.includes(opt) ? 'fa-check' : 'fa-plus'}`}></i> {opt}
                    </button>
                  ))}
                </div>
              </fieldset>

              <label className="diag-field">
                <span>{f.noteLabel}</span>
                <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder={f.notePlaceholder} />
              </label>

              {error && <p className="diag-error"><i className="fas fa-circle-exclamation"></i> {error}</p>}

              <button type="submit" className="pill-btn pill-dark diag-submit" disabled={loading}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> {f.btnLoading}</> : <>{f.btnSubmit} <i className="fas fa-arrow-right"></i></>}
              </button>
              <p className="diag-foot">{f.footer}</p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
