export interface Metric {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  client: string;
  sector: string;
  icon: string;
  challenge: string;
  solution: string;
  metrics: Metric[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
}

export const cases: CaseStudy[] = [
  {
    id: "mira-brand-studio",
    client: "Mira Brand Studio",
    sector: "Branding",
    icon: "fas fa-palette",
    challenge:
      "A Mira acredita que uma marca forte precisa, além de uma essência bem definida, de expressão visual e presença digital alinhadas. Para isso, ela precisava de um parceiro de tecnologia que configurasse domínios, CMSs e toda a infraestrutura digital, para que o trabalho criativo fosse entregue com estratégia e posicionamento real.",
    solution:
      "Desde 2020, a Tuliu cuida de toda a infraestrutura digital dos projetos da Mira. Em mais de 100 projetos entregues juntos, a combinação de branding e tecnologia gerou marcas premiadas internacionalmente, empresas que captaram investimento e negócios familiares que passaram a operar com tecnologia e identidade de forma unificada.",
    metrics: [
      { value: "+100", label: "projetos entregues em parceria desde 2020" },
      { value: "5+", label: "marcas premiadas internacionalmente" },
      { value: "100%", label: "dos projetos com infraestrutura digital ativa no lançamento" },
    ],
    testimonial: {
      quote:
        "A Tuliu é a parte técnica que faltava para entregar uma marca completa. Com eles, a gente fecha o projeto sabendo que o digital vai funcionar do jeito certo.",
      author: "Renata",
      role: "CEO, Mira Brand Studio",
    },
  },
  {
    id: "oralrad",
    client: "OralRad",
    sector: "Saúde",
    icon: "fas fa-tooth",
    challenge:
      "A OralRad, clínica de radiologia odontológica com unidades em Ijuí e Passo Fundo/RS, operava com um processo de requisição de exames totalmente manual e em papel. Dentistas precisavam fazer tudo à mão, pacientes tinham que se deslocar presencialmente para orçar e agendar exames, gerando lentidão, retrabalho e fricção em toda a cadeia do tratamento odontológico.",
    solution:
      "A Tuliu desenvolveu e implementou um sistema de requisição online em formato de micro software, movendo todo o processo para a web. Em menos de 3 dias o sistema estava no ar e funcional. Hoje os dentistas parceiros crescem em volume de pacientes, e a OralRad consolida sua presença como referência em tecnologia e suporte ao consultório odontológico.",
    metrics: [
      { value: "3 dias", label: "da contratação ao sistema no ar e funcional" },
      { value: "2 unid.", label: "Ijuí e Passo Fundo integradas na plataforma" },
      { value: "100% digital", label: "processo de requisição de exames sem papel" },
    ],
    testimonial: {
      quote:
        "A Tuliu entregou em dias o que a gente imaginava que levaria meses. O sistema transformou a relação com os dentistas parceiros, hoje somos referência em facilitar a vida do consultório.",
      author: "Ricardo",
      role: "Sócio Proprietário, OralRad",
    },
  },
  {
    id: "vita-brasil",
    client: "Vita Brasil",
    sector: "Saúde",
    icon: "fas fa-flask",
    challenge:
      "O laboratório de análises clínicas Vita Brasil, de Pelotas/RS, enfrentava o desafio comum a muitas empresas: conciliar as demandas do dia a dia com as exigências do marketing moderno, criação de conteúdo, tráfego pago, estratégia digital, sem ter time ou estrutura dedicada para isso.",
    solution:
      "A Tuliu implementou uma orquestração de agentes de IA que hoje fazem toda a curadoria, pesquisa e sugestão de pautas, elaboração de carrosséis, criação e edição de vídeos, além de agentes capazes de subir, gerenciar e otimizar campanhas no Google Ads e Meta Ads, tudo com suporte de um time humano de sucesso do cliente.",
    metrics: [
      { value: "4 agentes", label: "de IA operando em paralelo no marketing do laboratório" },
      { value: "2 canais", label: "Google Ads e Meta Ads gerenciados automaticamente" },
      { value: "100% integrado", label: "IA generativa com supervisão humana" },
    ],
    testimonial: {
      quote:
        "A Tuliu nos mostrou que é possível ter um marketing de alto nível sem montar um time grande. Os agentes trabalham enquanto a gente foca no que sabe fazer: cuidar da saúde das pessoas.",
      author: "Marco Salleh",
      role: "Sócio Fundador, Vita Brasil",
    },
  },
];
