export interface Course {
  id: string;
  title: string;
  description: string;
  platform: string;
  icon: string;
  url: string;
}

export const courses: Course[] = [
  {
    id: "fundamentos-realizacao",
    title: "Fundamentos da Realização de Ideias",
    description:
      "Um curso de 1h ministrado pelo CEO da Tuliu que apresenta, de forma clara e bem fundamentada, a base teórica por trás de quem realiza muito e de quem fica preso no ciclo das ideias não executadas.",
    platform: "Tuliu",
    icon: "fas fa-rocket",
    url: "#",
  },
  {
    id: "branding-com-ia",
    title: "Branding com IA",
    description:
      "Um curso prático para empreendedores e empresários que querem usar IA para evoluir sua marca, e entender como o branding pode levar a empresa a ser comprada, e não apenas lutar por vendas.",
    platform: "Tuliu",
    icon: "fas fa-wand-magic-sparkles",
    url: "#",
  },
  {
    id: "tech-marketing-digital",
    title: "Tech em Marketing Digital",
    description:
      "Aprenda como implementar, com a Tuliu como parceira, um verdadeiro time de marketing que atua nas mais diversas frentes, e permite que equipes enxutas realizem grandes projetos para o bem da organização.",
    platform: "Tuliu",
    icon: "fas fa-bullhorn",
    url: "#",
  },
];
