export interface Course {
  id: string;
  title: string;
  description: string;
  platform: string;
  icon: string;
  url: string;
}

export interface LearnCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  courses: Course[];
}

export const learnCategories: LearnCategory[] = [
  {
    id: "fundamentos",
    title: "Fundamentos",
    subtitle: "A base que todo empreendedor precisa para sair do mundo das ideias e entrar no mundo da realização.",
    icon: "fas fa-lightbulb",
    courses: [
      {
        id: "fundamentos-realizacao",
        title: "Fundamentos da Realização de Ideias",
        description:
          "Um curso de 1h ministrado pelo CEO da Tuliu que apresenta, de forma clara e bem fundamentada, a base teórica por trás de quem realiza muito e de quem fica preso no ciclo das ideias não executadas.",
        platform: "Tuliu",
        icon: "fas fa-rocket",
        url: "#",
      },
    ],
  },
  {
    id: "branding",
    title: "Branding",
    subtitle: "Marca é o único ativo intangível capaz de valer mais do que todos os ativos tangíveis da empresa.",
    icon: "fas fa-palette",
    courses: [
      {
        id: "branding-com-ia",
        title: "Branding com IA",
        description:
          "Um curso prático para empreendedores e empresários que querem usar IA para evoluir sua marca, e entender como o branding pode levar a empresa a ser comprada, e não apenas lutar por vendas.",
        platform: "Tuliu",
        icon: "fas fa-wand-magic-sparkles",
        url: "#",
      },
    ],
  },
  {
    id: "marketing",
    title: "Marketing",
    subtitle: "Como times enxutos realizam grandes movimentos com tecnologia e parceiros certos.",
    icon: "fas fa-chart-line",
    courses: [
      {
        id: "tech-marketing-digital",
        title: "Tech em Marketing Digital",
        description:
          "Aprenda como implementar, com a Tuliu como parceira, um verdadeiro time de marketing que atua nas mais diversas frentes, e permite que equipes enxutas realizem grandes projetos para o bem da organização.",
        platform: "Tuliu",
        icon: "fas fa-bullhorn",
        url: "#",
      },
    ],
  },
];
