import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useLinkProps } from '../context/NavContext';
import { findProposal } from '../data/proposals';
import { setMeta } from '../lib/meta';

const WHATSAPP_URL = 'https://wa.me/554840426597?text=Oi!%20Recebi%20uma%20proposta%20da%20Tuliu%20e%20n%C3%A3o%20consegui%20acessar.';

// Acesso à proposta: o cliente recebe tuliu.io, clica em Entrar e chega aqui.
// Assim ele passa pelo site antes de ver a proposta.
export default function ProposalAccessPage() {
  const link = useLinkProps();
  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [digits, setDigits] = useState('');
  const [status, setStatus] = useState<'idle' | 'checking' | 'notfound' | 'opening'>('idle');

  useEffect(() => {
    setMeta('Acessar minha proposta | Tuliu', 'Recebeu uma proposta da Tuliu? Acesse com o nome da sua marca, seu nome e os 4 últimos dígitos do seu telefone.');
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('checking');
    const found = await findProposal(brand, name, digits);
    if (!found) {
      setStatus('notfound');
      return;
    }
    setStatus('opening');
    // Pequena pausa para a transição "Abrindo sua proposta" ser percebida
    window.setTimeout(() => window.location.assign(found.href), 700);
  };

  return (
    <section className="diag prop">
      <div className="container-wide diag-grid">
        <div className="diag-intro">
          <span className="lp-eyebrow">Área do cliente</span>
          <h1>Sua proposta está pronta.</h1>
          <p className="diag-lead">Para proteger o que criamos para você, o acesso é individual. Confirme três informações e abrimos a sua proposta.</p>

          <ul className="prop-points">
            <li><i className="fas fa-lock"></i><div><strong>Acesso protegido</strong><p>Cada proposta é exclusiva e só abre com os dados de quem a recebeu.</p></div></li>
            <li><i className="fas fa-wand-magic-sparkles"></i><div><strong>Feita sob medida</strong><p>Tudo o que você vai ver foi criado para o seu negócio.</p></div></li>
            <li><i className="fab fa-whatsapp"></i><div><strong>Dúvidas no WhatsApp</strong><p>Se algo não bater, fale com a gente e resolvemos na hora.</p></div></li>
          </ul>
        </div>

        <div className="diag-card">
          {status === 'opening' ? (
            <div className="diag-success">
              <div className="diag-success-icon"><i className="fas fa-unlock"></i></div>
              <h2>Abrindo sua proposta</h2>
              <p>Só um instante.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="prop-card-head">
                <span className="prop-badge"><i className="fas fa-file-signature"></i></span>
                <div>
                  <strong>Recebi uma proposta</strong>
                  <span>Preencha exatamente como combinamos com você.</span>
                </div>
              </div>

              <label className="diag-field">
                <span>Nome da sua marca</span>
                <input required value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Ex.: Minha Marca" autoComplete="organization" />
              </label>
              <label className="diag-field">
                <span>Seu primeiro nome</span>
                <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Maria" autoComplete="given-name" />
              </label>
              <label className="diag-field">
                <span>4 últimos dígitos do seu telefone</span>
                <input
                  required
                  inputMode="numeric"
                  pattern="[0-9]{4}"
                  maxLength={4}
                  value={digits}
                  onChange={(e) => setDigits(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="0000"
                  className="prop-digits"
                />
              </label>

              {status === 'notfound' && (
                <p className="diag-error">
                  <i className="fas fa-circle-exclamation"></i> Não encontramos uma proposta com esses dados. Confira a grafia da marca e os dígitos, ou{' '}
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">fale com a gente no WhatsApp</a>.
                </p>
              )}

              <button type="submit" className="pill-btn pill-dark diag-submit" disabled={status === 'checking'}>
                {status === 'checking' ? <><i className="fas fa-spinner fa-spin"></i> Verificando...</> : <>Acessar minha proposta <i className="fas fa-arrow-right"></i></>}
              </button>
              <p className="diag-foot">Ainda não recebeu uma proposta? <a {...link('/diagnostico?origem=proposta')}>Peça seu diagnóstico gratuito</a></p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
