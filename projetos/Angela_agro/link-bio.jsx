import React from 'react';
import { MessageCircle, Mail, Calendar } from 'lucide-react';

export default function AgroAplicacaoLinkBio() {
  const whatsappLink = 'https://wa.me/5511999999999?text=Olá%20Angela!%20Vi%20seu%20perfil%20e%20gostaria%20de%20saber%20mais%20sobre%20aplicação%20de%20defensivo%20agrícola.';
  const emailLink = 'mailto:contato@agroaplicacao.com.br?subject=Consultoria%20em%20Aplicação%20Agrícola';
  const calendarLink = '#'; // Será preenchido com integração (Calendly, etc)

  const services = [
    'Simulação de calda',
    'Ordem de mistura',
    'Ajuste de pH',
    'Adjuvantes',
    'Dimensionamento de bico',
    'Descontaminação de maquinário',
    'Formulação de produtos'
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-center">
          <div className="rounded-full bg-white p-3 shadow-sm">
            <img
              src="/assets/logo_AA.png"
              alt="Angela Agro"
              className="h-12 object-contain"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-8">

        {/* Hero Section */}
        <section className="space-y-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              Aplicação correta de defensivo agrícola
            </h1>
            <p className="text-lg text-gray-600 mt-2 font-medium">
              Sem desperdício. Com máxima eficiência.
            </p>
          </div>

          <p className="text-gray-700 leading-relaxed">
            Explico como fazer a aplicação certa, reduzindo custos, contaminação e perdas. Rendimento operacional com maior performance da sua aplicação.
          </p>
        </section>

        {/* Diferencial */}
        <section className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
          <h2 className="font-bold text-gray-900 text-lg">
            🎯 Atendimento personalizado
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            Aqui é direcionado, prático e sem enrolação.
          </p>
          <p className="text-gray-700 text-sm font-medium">
            Não é só uma aula. É um acompanhamento direcionado pra quem quer fazer certo.
          </p>
        </section>

        {/* Ebook Destaque */}
        <section className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-800 to-emerald-900 text-white space-y-4">
          <div className="inline-block">
            <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-lime-400/20 text-lime-300">
              📖 Em breve
            </span>
          </div>

          <h3 className="text-2xl font-bold leading-tight">
            Guia completo de aplicação
          </h3>

          <p className="text-white text-sm opacity-90 leading-relaxed">
            Tudo que você precisa saber sobre defensivo agrícola em um só lugar. Acesse quando estiver disponível.
          </p>

          <button
            onClick={() => alert('Ebook em breve! Deixe seu email pra ser notificado.')}
            className="w-full px-4 py-3 font-semibold rounded-lg bg-lime-400 text-emerald-900 hover:bg-lime-300 transition-colors"
          >
            Notificar quando lançar
          </button>
        </section>

        {/* Serviços */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">
            O que você aprende
          </h2>

          <div className="grid grid-cols-1 gap-3">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition"
              >
                <div className="w-2 h-2 rounded-full bg-lime-400 mt-2 flex-shrink-0" />
                <span className="text-gray-800 font-medium text-sm">
                  {service}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="space-y-3 pb-8">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wide text-center">
            Vamos conversar
          </p>

          {/* WhatsApp CTA - Primary */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-lime-400 text-emerald-900 font-semibold rounded-xl hover:shadow-lg transition-shadow"
          >
            <MessageCircle size={20} />
            Conversar no WhatsApp
          </a>

          {/* Secondary CTAs */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={emailLink}
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 text-gray-900 font-semibold rounded-xl hover:border-gray-400 transition"
            >
              <Mail size={18} />
              Email
            </a>

            <button
              onClick={() => alert('Agenda em breve')}
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 text-gray-900 font-semibold rounded-xl hover:border-gray-400 transition"
            >
              <Calendar size={18} />
              Agendar
            </button>
          </div>
        </section>

        {/* Footer Info */}
        <footer className="text-center text-xs text-gray-500 pb-4 border-t border-gray-100 pt-4">
          <p>
            Consultoria em aplicação de defensivo agrícola
          </p>
        </footer>
      </main>
    </div>
  );
}
