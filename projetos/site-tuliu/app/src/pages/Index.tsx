import { Instagram, CheckCircle2, MapPin, Monitor, User } from "lucide-react";
import doctorPortrait from "@/assets/doctor-portrait.png";
import logoCandida from "@/assets/logo-candida.png";
import womanReading from "@/assets/woman-reading.jpg";
import handsSupport from "@/assets/hands-support.jpg";
import heartHands from "@/assets/heart-hands.jpg";
import doctorAbout from "@/assets/doctor-about.png";
import leafRight from "@/assets/leaf-right.png";
import leafLeft from "@/assets/leaf-left.png";
import ScrollReveal from "@/components/ScrollReveal";
import ParallaxLeaf from "@/components/ParallaxLeaf";

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-['Poppins',sans-serif] scroll-smooth">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary min-h-screen flex flex-col">
        <div className="absolute top-[40%] right-[18%] -translate-y-1/2 w-[550px] h-[550px] rounded-full border border-primary/[0.08] pointer-events-none hidden md:block" />
        <div className="absolute top-[40%] right-[18%] -translate-y-1/2 w-[380px] h-[380px] rounded-full border border-primary/[0.05] pointer-events-none hidden md:block" />

        <header className="relative z-10 w-full pt-8 max-w-7xl mx-auto px-8 md:px-16 lg:px-20 flex items-start justify-between">
          <div className="flex flex-col items-start">
            <img src={logoCandida} alt="Cândida Lüdtke" className="h-20 md:h-24 w-auto" />
          </div>
          <div className="flex items-center gap-3 mt-2">
            <a href="#agendar" className="hidden sm:inline-flex border-2 border-primary text-primary px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300">
              Agendar avaliação
            </a>
            <a href="#" className="bg-primary text-primary-foreground p-3 rounded-xl hover:bg-primary/90 transition-all duration-300 hover:scale-105">
              <Instagram size={22} />
            </a>
          </div>
        </header>

        <div className="relative z-10 flex-1 max-w-7xl mx-auto px-8 md:px-16 lg:px-20 w-full">
          <div className="grid md:grid-cols-2 gap-0 items-end h-full">
            <div className="pb-16 md:pb-28 pt-8 flex flex-col justify-end">
              <ScrollReveal>
                <h1 className="text-4xl md:text-5xl lg:text-[54px] font-semibold text-primary leading-[1.12] tracking-tight">
                  Cuidar da saúde{" "}
                  <br className="hidden md:block" />
                  mental é o começo{" "}
                  <br className="hidden md:block" />
                  de uma{" "}
                  <span className="font-bold">vida com{" "}
                  <br className="hidden md:block" />
                  mais equilíbrio.</span>
                </h1>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <a href="#agendar" className="inline-block mt-10 bg-[hsl(168,42%,55%)] text-primary-foreground px-10 py-4 rounded-full text-base font-medium hover:bg-[hsl(168,42%,48%)] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 w-fit">
                  Agendar avaliação
                </a>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={200}>
              <div className="flex justify-center md:justify-end items-end">
                <img src={doctorPortrait} alt="Dra. Cândida Lüdtke" className="w-[85%] md:w-[90%] max-w-[480px] object-contain" width={600} height={750} />
              </div>
            </ScrollReveal>
          </div>
        </div>

        <ScrollReveal delay={500}>
          <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 lg:px-20 pb-12 pt-6 w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-20">
              <div>
                <p className="text-primary font-bold text-base">Dra. Cândida Lüdtke</p>
                <p className="text-muted-foreground text-sm">Psiquiatra</p>
                <p className="text-muted-foreground text-xs mt-2 flex items-center gap-1.5">
                  <MapPin size={12} className="text-primary" />
                  Atendimento presencial e online
                </p>
              </div>
              <div className="max-w-md">
                <span className="text-primary text-3xl font-bold leading-none block mb-1">❝</span>
                <p className="text-muted-foreground text-sm italic leading-relaxed">
                  A psiquiatria pode, sim, ser um espaço de escuta e compreensão, construindo caminhos para lidar com o sofrimento emocional.
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Section: Nem sempre é fácil */}
      <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28 bg-secondary relative overflow-hidden">
        <ParallaxLeaf src={leafRight} className="absolute -top-4 -right-4 w-36 md:w-52" speed={0.04} swayAmount={8} />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
          <ScrollReveal>
            <div className="relative">
              <img src={womanReading} alt="Mulher em momento de reflexão" className="w-full max-w-lg rounded-2xl object-cover shadow-xl aspect-[4/5]" loading="lazy" width={600} height={700} />
              <ParallaxLeaf src={leafLeft} className="absolute -bottom-6 -left-8 w-28 md:w-44 z-10" speed={0.05} swayAmount={6} />
            </div>
          </ScrollReveal>
          <div>
            <ScrollReveal delay={150}>
              <h2 className="text-3xl md:text-4xl lg:text-[42px] font-semibold text-primary leading-[1.15] mb-8">
                Nem sempre é fácil perceber quando a mente está{" "}
                <span className="font-bold">pedindo ajuda.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <p className="text-muted-foreground text-[15px] leading-[1.8] mb-5">
                Alguns sinais aparecem de forma silenciosa no cotidiano: dificuldade para dormir, irritação frequente, taquicardia, sensação de sobrecarga ou perda de interesse pelas coisas que antes faziam sentido.
              </p>
              <p className="text-muted-foreground text-[15px] leading-[1.8]">
                Essas experiências são mais comuns do que imaginamos e, muitas vezes, indicam que algo merece ser olhado com mais atenção.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Section: Queixas mais frequentes */}
      <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28 bg-[#104b57] text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl lg:text-[34px] font-semibold mb-12 leading-tight">
              Entre as <span className="font-bold italic">queixas</span> mais frequentes no consultório estão:
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
              {[
                { label: "Ansiedade" },
                { label: "Insônia" },
                { label: "Estresse" },
                { label: "Irritabilidade" },
                { label: "Depressão", sub: "(tristeza persistente, desânimo ou baixa energia)" },
                { label: "Bipolaridade" },
                { label: "TDAH", sub: "(dificuldade de concentração ou organização)" },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-2.5 bg-primary-foreground/10 border border-primary-foreground/30 backdrop-blur-sm rounded-full px-5 py-3 text-sm font-medium transition-colors hover:bg-primary-foreground/20">
                  <CheckCircle2 size={16} className="text-check shrink-0" />
                  <span>
                    {item.label}
                    {item.sub && <span className="font-light text-xs ml-1 opacity-80">{item.sub}</span>}
                  </span>
                </span>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <div className="mt-8">
              <p className="font-semibold text-base">Cada pessoa vive esses sintomas de forma diferente.</p>
              <p className="text-sm opacity-75 mt-2 font-light max-w-lg mx-auto leading-relaxed">
                Por isso, compreender o contexto de vida e a história de cada paciente é parte essencial do cuidado psiquiátrico.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section: Mais do que tratar sintomas */}
      <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28 bg-secondary relative overflow-hidden">
        <ParallaxLeaf src={leafRight} className="absolute -top-4 -right-4 w-36 md:w-52 opacity-30" speed={0.04} swayAmount={7} />
        <ParallaxLeaf src={leafLeft} className="absolute -bottom-4 -left-4 w-28 md:w-40 opacity-30" speed={0.05} swayAmount={6} />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
          <ScrollReveal>
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-[40px] font-semibold text-primary leading-[1.15] mb-6">
                Mais do que tratar sintomas isolados,{" "}
                <br className="hidden md:block" />
                o cuidado psiquiátrico{" "}
                <span className="font-bold">investiga o que está{" "}
                <br className="hidden md:block" />
                por trás do sofrimento{" "}
                <br className="hidden md:block" />
                emocional.</span>
              </h2>
              <p className="text-muted-foreground text-[15px] leading-[1.8] font-light max-w-md">
                Cada plano de cuidado é construído de forma individualizada, respeitando o momento de vida de cada paciente.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="bg-[#104b57] rounded-2xl px-8 py-8 md:px-10 md:py-10">
              <p className="text-primary-foreground text-[15px] mb-6 font-light leading-relaxed">
                Juntos, encontramos caminhos para restaurar equilíbrio e qualidade de vida através de diversas ferramentas possíveis:
              </p>
              <ul className="space-y-3">
                {[
                  "Avaliação clínica cuidadosa",
                  "Escuta e acolhimento",
                  "Compreensão da história pessoal e familiar",
                  "Discussão das possibilidades de tratamento",
                  "Exames laboratoriais",
                  "Intervenção medicamentosa",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3.5 bg-primary-foreground/95 text-primary rounded-full px-6 py-3.5 text-[15px] font-medium">
                    <CheckCircle2 size={20} className="shrink-0 text-check" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section: Nosso primeiro encontro */}
      <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28 bg-secondary relative overflow-hidden">
        <ParallaxLeaf src={leafRight} className="absolute top-0 right-0 w-32 md:w-44 opacity-40" speed={0.04} swayAmount={7} />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
          <ScrollReveal>
            <div className="relative">
              <img src={handsSupport} alt="Acolhimento no consultório" className="w-full max-w-lg rounded-2xl object-cover shadow-xl aspect-[4/3]" loading="lazy" width={600} height={512} />
            </div>
          </ScrollReveal>
          <div>
            <ScrollReveal delay={150}>
              <h2 className="text-2xl md:text-3xl lg:text-[34px] text-primary leading-[1.2] mb-6">
                <span className="font-bold">Nosso primeiro encontro:</span>{" "}
                <span className="font-light">um momento de avaliação aprofundada.</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <p className="text-muted-foreground text-[15px] leading-[1.8] mb-5">
                Os atendimentos iniciam com uma consulta de avaliação onde são explorados diferentes aspectos da saúde e da história do paciente, como: sintomas atuais, histórico médico e emocional, hábitos de vida e contexto familiar e profissional.
              </p>
              <p className="text-muted-foreground text-[15px] leading-[1.8]">
                Somente a partir disso é que podemos traçar as estratégias e caminhos a serem seguidos com apoio da medicina psiquiátrica, sempre prezando pela autonomia, bem-estar e segurança do paciente.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Section: Conheça a Dra */}
      <section className="relative overflow-hidden bg-[#104b57] text-primary-foreground">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-stretch relative z-10">
          <div className="px-6 md:px-12 lg:px-16 py-20 md:py-28 flex flex-col justify-center">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl lg:text-[34px] font-bold leading-[1.2] mb-8">
                Conheça um pouco sobre a Dra. Cândida Lüdtke:
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="text-[15px] leading-[1.8] opacity-85 mb-5 font-light">
                Médica formada há XX anos pela Universidade XXXXXXX, Cândida passou a dedicar sua prática ao atendimento clínico em consultório, com foco em acompanhamento psicoterapêutico e construção de vínculo com seus pacientes.
              </p>
              <p className="text-[15px] leading-[1.8] opacity-85 mb-5 font-light">
                Seu trabalho parte de um entendimento essencial: o cuidado em saúde mental acontece no tempo da escuta, da reflexão e do acompanhamento contínuo.
              </p>
              <p className="text-[15px] leading-[1.8] opacity-85 font-light">
                Por isso, seu atendimento é voltado principalmente para adultos e jovens em quadros leves a moderados, que buscam compreender melhor seus sintomas e desenvolver autonomia no processo de cuidado.
              </p>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={300}>
            <div className="relative h-full min-h-[400px] md:min-h-0 flex items-end justify-center">
              <img src={doctorAbout} alt="Dra. Cândida Lüdtke" className="w-full max-w-[600px] object-contain object-bottom" loading="lazy" width={600} height={600} />
              {/* Decorative circles */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-primary-foreground/10 pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full border border-primary-foreground/[0.06] pointer-events-none" />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section: Buscar ajuda */}
      <section className="px-6 md:px-12 lg:px-20 py-20 md:py-28 bg-secondary relative overflow-hidden">
        <ParallaxLeaf src={leafLeft} className="absolute -bottom-6 -left-6 w-24 md:w-36 opacity-50" speed={0.06} swayAmount={7} />

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-center relative z-10">
          <ScrollReveal>
            <div className="flex justify-center">
              <img src={heartHands} alt="Gesto de cuidado" className="w-full max-w-md rounded-2xl object-cover shadow-xl aspect-[4/3]" loading="lazy" width={600} height={512} />
            </div>
          </ScrollReveal>
          <div>
            <ScrollReveal delay={150}>
              <h2 className="text-2xl md:text-3xl lg:text-[34px] font-bold text-primary leading-[1.2] mb-5">
                Buscar ajuda é também um gesto de cuidado consigo mesmo.
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <p className="text-muted-foreground text-[15px] leading-[1.8] mb-8">
                Muitas vezes, conversar com um profissional é o primeiro passo para compreender melhor o que está acontecendo e encontrar novas formas de lidar com as próprias emoções.{" "}
                <strong className="text-primary">Se você sente que algo não está bem, agende uma avaliação.</strong>
              </p>
            </ScrollReveal>
            <ScrollReveal delay={450}>
              <a href="#agendar" id="agendar" className="inline-block bg-[hsl(168,42%,55%)] text-primary-foreground px-10 py-4 rounded-full text-base font-medium hover:bg-[hsl(168,42%,48%)] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Agendar avaliação
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <ScrollReveal>
        <footer className="px-6 md:px-12 lg:px-20 py-14 bg-background border-t border-border relative overflow-hidden">
          <ParallaxLeaf src={leafLeft} className="absolute -bottom-6 -left-6 w-28 md:w-40 opacity-60" speed={0.06} swayAmount={6} />
          <ParallaxLeaf src={leafRight} className="absolute -bottom-4 -right-4 w-32 md:w-48 opacity-60" speed={0.04} swayAmount={8} />

          <div className="max-w-4xl mx-auto flex flex-col items-center gap-8 relative z-10">
            <div className="flex flex-col items-center">
              <img src={logoCandida} alt="Cândida Lüdtke" className="h-20 w-auto opacity-80" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="#" className="flex items-center gap-2.5 border-2 border-primary text-primary rounded-full px-6 py-3 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <User size={16} />
                Atendimento presencial em Porto Alegre/RS
              </a>
              <a href="#" className="flex items-center gap-2.5 border-2 border-primary text-primary rounded-full px-6 py-3 text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                <Monitor size={16} />
                Atendimento online
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Dra. Cândida Lüdtke – CRM XXX / RQE XXX
            </p>
          </div>
        </footer>
      </ScrollReveal>
    </div>
  );
};

export default Index;
