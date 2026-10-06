import { useLinkProps } from '../context/NavContext';
import { machine } from '../data/landings';
import { CasesStrip, CompareTable, Expert, Marquee, RenderBlock } from './landing/blocks';

const SERVICES_A = ['Site sob medida', 'SEO', 'SEO para IA', 'Landing pages', 'Copywriting', 'Carrosséis', 'Edição de vídeos', 'Google Ads', 'Meta Ads'];
const SERVICES_B = ['Agentes de IA', 'Automações', 'Integrações de pagamento', 'Testes A/B', 'Domínio, hospedagem e SSL', 'E-mail profissional', 'Relatórios', 'Revisão humana'];

export function ServicesMarquee() {
  return (
    <section className="lp-services-band" aria-label="Tudo que a Tuliu faz">
      <Marquee items={SERVICES_A} chip />
      <Marquee items={SERVICES_B} chip reverse />
    </section>
  );
}

export function HomeMachine() {
  return (
    <div id="maquina">
      <RenderBlock
        onCta={() => {}}
        b={machine(
          'Uma máquina de marketing que aprende sozinha.',
          'A IA junta todas as suas fontes de dados e faz perguntas que ninguém conseguiria responder na mão. Depois ajusta seu site, seu conteúdo e seus anúncios, guiada por você e pelos nossos especialistas.',
        )}
      />
    </div>
  );
}

const ROLES = [
  { icon: 'fas fa-chess', title: 'Estratégia e growth', desc: 'Define o plano e aprova o que vai pro ar' },
  { icon: 'fas fa-bullseye', title: 'Tráfego pago', desc: 'Google Ads e Meta Ads' },
  { icon: 'fas fa-pen-nib', title: 'Copy e conteúdo', desc: 'Textos, roteiros e pautas' },
  { icon: 'fas fa-palette', title: 'Design', desc: 'Site, criativos e identidade' },
  { icon: 'fas fa-code', title: 'Tecnologia', desc: 'Integrações, agentes e automações' },
];

export function BehindTheScenes() {
  return (
    <>
      <Expert
        title="A IA faz o trabalho. O time mantém afiado."
        quote="Toda mudança que a IA propõe passa antes por especialistas em marketing e tecnologia. Só depois vai pro ar. Você ganha a velocidade da IA com um humano cuidando da qualidade."
      />
      <section className="lp-roles-band">
        <div className="container">
          <div className="lp-roles">
            {ROLES.map((r) => (
              <div key={r.title} className="lp-role">
                <i className={r.icon}></i>
                <strong>{r.title}</strong>
                <span>{r.desc}</span>
                <em><span className="lp-live-dot"></span> ativo</em>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export function HomeCases() {
  return <CasesStrip title="Você também pode crescer." subtitle="Negócios reais operando com a Tuliu. Ao vivo, todos os dias." />;
}

export function HomeCompare() {
  const link = useLinkProps();
  return (
    <>
      <CompareTable
        title="O trabalho de uma agência. O preço e a velocidade da IA."
        subtitle="Agências fazem trabalho bom, mas custam tempo e dinheiro. Ferramentas são rápidas e baratas, mas te deixam sozinho. A Tuliu entrega os dois ao mesmo tempo."
        columns={['Tuliu', 'Agência de marketing', 'Wix, Squarespace', 'Lovable, Framer', 'Canva + você']}
        rows={[
          { label: 'Preço de entrada baixo', values: ['yes', 'no', 'yes', 'yes', 'yes'] },
          { label: 'Site com design sob medida', values: ['yes', 'yes', 'partly', 'yes', 'no'] },
          { label: 'SEO, conteúdo e anúncios', values: ['yes', 'yes', 'no', 'no', 'partly'] },
          { label: 'Feito 100% por você', values: ['yes', 'yes', 'no', 'no', 'no'] },
          { label: 'Otimizado toda semana', values: ['yes', 'partly', 'no', 'no', 'no'] },
          { label: 'No ar rápido, sem orçamento', values: ['yes', 'no', 'partly', 'yes', 'yes'] },
          { label: 'Agentes de IA e automações', values: ['yes', 'partly', 'no', 'partly', 'no'] },
          { label: 'Insights cruzando todos os dados', values: ['yes', 'partly', 'no', 'no', 'no'] },
        ]}
      />
      <div className="container lp-compare-links">
        <a {...link('/alternativa-agencia-de-marketing')}>vs agência</a>
        <a {...link('/alternativa-lovable')}>vs Lovable</a>
        <a {...link('/alternativa-framer')}>vs Framer</a>
        <a {...link('/alternativa-wix')}>vs Wix e Squarespace</a>
        <a {...link('/alternativa-wordpress')}>vs WordPress</a>
        <a {...link('/alternativa-canva')}>vs Canva</a>
      </div>
    </>
  );
}
