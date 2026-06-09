import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import logo from '../assets/logo.svg';

export default function OnboardingPage({ onComplete }: { onComplete: () => void }) {
  const { client } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: client?.name || '',
    company: client?.company || '',
    segment: '',
    objective: '',
    hasDomain: '',
    domain: '',
    assets: [] as string[],
  });

  const assetOptions = [
    { value: 'website', label: 'Site' },
    { value: 'webapp', label: 'Web App' },
    { value: 'email', label: 'E-mails corporativos' },
    { value: 'automation', label: 'Automações' },
    { value: 'ai_agent', label: 'Agente de IA' },
  ];

  const toggleAsset = (value: string) => {
    setForm((f) => ({
      ...f,
      assets: f.assets.includes(value)
        ? f.assets.filter((a) => a !== value)
        : [...f.assets, value],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await supabase
        .from('clients')
        .update({
          name: form.name,
          company: form.company,
          onboarding_completed: true,
          onboarding_data: {
            segment: form.segment,
            objective: form.objective,
            hasDomain: form.hasDomain,
            domain: form.domain,
            assets: form.assets,
          },
        })
        .eq('id', client?.id);

      onComplete();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f7',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      fontFamily: 'Inter, sans-serif',
    }}>
      <img src={logo} alt="Tuliu" style={{ height: '36px', marginBottom: '40px' }} />

      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '48px',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
      }}>
        {/* Progresso */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              background: s <= step ? '#111' : '#E5E7EB',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {step === 1 && (
          <>
            <h1 style={{ fontSize: '26px', fontWeight: 700, marginBottom: '8px', color: '#111' }}>
              Bem-vindo à Tuliu!
            </h1>
            <p style={{ color: '#666', marginBottom: '32px', fontSize: '15px', lineHeight: 1.6 }}>
              Conta pra gente um pouco sobre você. Isso nos ajuda a preparar tudo antes do primeiro contato.
            </p>

            <label style={labelStyle}>Seu nome completo</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="João Silva"
            />

            <label style={labelStyle}>Nome da empresa</label>
            <input
              style={inputStyle}
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Empresa Ltda."
            />

            <label style={labelStyle}>Segmento / tipo de negócio</label>
            <input
              style={inputStyle}
              value={form.segment}
              onChange={(e) => setForm({ ...form, segment: e.target.value })}
              placeholder="Ex: E-commerce, clínica, agência..."
            />

            <button
              style={btnStyle(!!form.name && !!form.company && !!form.segment)}
              disabled={!form.name || !form.company || !form.segment}
              onClick={() => setStep(2)}
            >
              Continuar <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', color: '#111' }}>
              Qual é o seu objetivo?
            </h2>
            <p style={{ color: '#666', marginBottom: '28px', fontSize: '15px' }}>
              O que você quer resolver com a Tuliu?
            </p>

            <label style={labelStyle}>Conte com suas palavras</label>
            <textarea
              style={{ ...inputStyle, height: '100px', resize: 'none' }}
              value={form.objective}
              onChange={(e) => setForm({ ...form, objective: e.target.value })}
              placeholder="Ex: Quero ter um site profissional, centralizar meus e-mails e automatizar o atendimento..."
            />

            <label style={{ ...labelStyle, marginTop: '20px' }}>Quais ativos você quer hospedar?</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px' }}>
              {assetOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => toggleAsset(opt.value)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1.5px solid',
                    borderColor: form.assets.includes(opt.value) ? '#111' : '#E5E7EB',
                    background: form.assets.includes(opt.value) ? '#111' : 'white',
                    color: form.assets.includes(opt.value) ? 'white' : '#444',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(1)} style={backBtnStyle}>
                <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Voltar
              </button>
              <button
                style={{ ...btnStyle(!!form.objective), flex: 1 }}
                disabled={!form.objective}
                onClick={() => setStep(3)}
              >
                Continuar <i className="fas fa-arrow-right" style={{ marginLeft: '8px' }}></i>
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px', color: '#111' }}>
              Você já tem um domínio?
            </h2>
            <p style={{ color: '#666', marginBottom: '28px', fontSize: '15px' }}>
              Ex: suaempresa.com.br
            </p>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              {['yes', 'no'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setForm({ ...form, hasDomain: opt })}
                  style={{
                    flex: 1,
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1.5px solid',
                    borderColor: form.hasDomain === opt ? '#111' : '#E5E7EB',
                    background: form.hasDomain === opt ? '#111' : 'white',
                    color: form.hasDomain === opt ? 'white' : '#444',
                    fontSize: '15px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'all 0.2s',
                  }}
                >
                  {opt === 'yes' ? 'Sim, já tenho' : 'Não tenho ainda'}
                </button>
              ))}
            </div>

            {form.hasDomain === 'yes' && (
              <>
                <label style={labelStyle}>Qual é o domínio?</label>
                <input
                  style={inputStyle}
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  placeholder="suaempresa.com.br"
                />
              </>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={() => setStep(2)} style={backBtnStyle}>
                <i className="fas fa-arrow-left" style={{ marginRight: '8px' }}></i> Voltar
              </button>
              <button
                style={{ ...btnStyle(!!form.hasDomain), flex: 1 }}
                disabled={!form.hasDomain || loading}
                onClick={handleSubmit}
              >
                {loading ? 'Enviando...' : 'Enviar e acessar o painel'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: '#444',
  marginBottom: '8px',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1.5px solid #E5E7EB',
  fontSize: '15px',
  color: '#111',
  outline: 'none',
  marginBottom: '20px',
  boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif',
};

const btnStyle = (enabled: boolean): React.CSSProperties => ({
  width: '100%',
  padding: '14px',
  borderRadius: '12px',
  border: 'none',
  background: enabled ? '#111' : '#E5E7EB',
  color: enabled ? 'white' : '#999',
  fontSize: '15px',
  fontWeight: 600,
  cursor: enabled ? 'pointer' : 'not-allowed',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const backBtnStyle: React.CSSProperties = {
  padding: '14px 20px',
  borderRadius: '12px',
  border: '1.5px solid #E5E7EB',
  background: 'white',
  color: '#444',
  fontSize: '15px',
  cursor: 'pointer',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
};
