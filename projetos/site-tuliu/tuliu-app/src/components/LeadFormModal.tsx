import { useState } from 'react';
import type { FormEvent } from 'react';
import { useLanguage } from '../context/LanguageContext';

const SUPABASE_URL = 'https://dojjedejwpwzvqoomtsj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvamplZGVqd3B3enZxb29tdHNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxMDc4ODMsImV4cCI6MjA1ODY4Mzg4M30.oewMMwFCBBX-5OcSTADnj5wlMwvNFiMLFovDcT5UMYA';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: string;
  planInterest?: string | null;
  planLabel?: string | null;
}

const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#333', marginBottom: '6px' };
const inputStyle = { width: '100%', padding: '11px 14px', borderRadius: '10px', border: '1px solid #e0e0e0', fontSize: '14px', fontFamily: 'Inter, sans-serif', color: '#111', boxSizing: 'border-box' as const };

export default function LeadFormModal({ isOpen, onClose, source, planInterest = null, planLabel = null }: LeadFormModalProps) {
  const { t, language } = useLanguage();
  const f = t.leadForm;

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [challenge, setChallenge] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const resetAndClose = () => {
    setName('');
    setWhatsapp('');
    setHandle('');
    setEmail('');
    setChallenge('');
    setError('');
    setSuccess(false);
    onClose();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
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
          main_challenge: challenge,
          plan_interest: planInterest,
          source,
          language,
        }),
      });
      if (!res.ok) throw new Error(f.errorFallback);
      setSuccess(true);
    } catch (err: unknown) {
      setError((err as Error).message || f.errorFallback);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '24px',
      }}
      onClick={(e) => e.target === e.currentTarget && resetAndClose()}
    >
      <div style={{
        background: 'white', borderRadius: '20px', padding: '40px',
        maxWidth: '460px', width: '100%', position: 'relative',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        fontFamily: 'Inter, sans-serif', maxHeight: '90vh', overflowY: 'auto',
      }}>
        <button onClick={resetAndClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '20px', color: '#999',
        }}>
          <i className="fas fa-times"></i>
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: '#f5f5f7', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 24px',
            }}>
              <i className="fas fa-check" style={{ fontSize: '24px', color: '#111' }}></i>
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>
              {f.successTitle}
            </h2>
            <p style={{ color: '#666', fontSize: '15px', lineHeight: 1.7 }}>
              {f.successDesc}
            </p>
          </div>
        ) : (
          <>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: '#f5f5f7', display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: '20px',
            }}>
              <i className="fas fa-compass" style={{ fontSize: '22px', color: '#111' }}></i>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#111', marginBottom: '8px' }}>
              {f.title}
            </h2>
            <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, marginBottom: planLabel ? '14px' : '24px' }}>
              {f.subtitle}
            </p>

            {planLabel && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                background: '#F3F3F3', color: '#555', fontSize: '12px', fontWeight: 500,
                padding: '5px 12px', borderRadius: '100px', marginBottom: '20px',
              }}>
                {f.planLabel}: {planLabel}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>{f.nameLabel}</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} placeholder={f.namePlaceholder} />
              </div>
              <div>
                <label style={labelStyle}>{f.whatsappLabel}</label>
                <input required type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} style={inputStyle} placeholder={f.whatsappPlaceholder} />
              </div>
              <div>
                <label style={labelStyle}>{f.handleLabel}</label>
                <input required value={handle} onChange={(e) => setHandle(e.target.value)} style={inputStyle} placeholder={f.handlePlaceholder} />
              </div>
              <div>
                <label style={labelStyle}>{f.emailLabel}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder={f.emailPlaceholder} />
              </div>
              <div>
                <label style={labelStyle}>{f.challengeLabel}</label>
                <select required value={challenge} onChange={(e) => setChallenge(e.target.value)} style={inputStyle}>
                  <option value="" disabled>{f.challengePlaceholder}</option>
                  {f.challengeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              {error && (
                <p style={{ color: '#e53e3e', fontSize: '13px', margin: 0 }}>
                  <i className="fas fa-circle-exclamation" style={{ marginRight: '6px' }}></i>
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                  background: '#111', color: 'white', fontSize: '15px', fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: '8px', marginTop: '4px',
                }}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '14px' }}></i>
                    {f.btnLoading}
                  </>
                ) : (
                  <>
                    {f.btnSubmit}
                    <i className="fas fa-arrow-right" style={{ fontSize: '13px' }}></i>
                  </>
                )}
              </button>
            </form>

            <p style={{ margin: '14px 0 0', fontSize: '12px', color: '#aaa', textAlign: 'center' }}>
              <i className="fas fa-shield-halved" style={{ marginRight: '4px' }}></i>
              {f.footer}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
