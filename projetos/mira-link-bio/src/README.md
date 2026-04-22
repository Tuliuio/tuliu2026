# Mira Link de Bio — Código

## Estrutura

```
src/
├── index.html      — Estrutura HTML
├── style.css       — Estilos (dark mode, ouro, verde)
├── README.md       — Este arquivo
└── assets/         — Imagens, ícones, logos
```

## Design System

**Cores:**
- Dark bg: `#0f0f0f`
- Secondary: `#1a1a1a`
- Gold (principal): `#d4a574`
- Green (accent): `#6b8e6f`
- White (texto): `#ffffff`
- Gray: `#999999`

**Tipografia:**
- Display: Inter, Poppins (bold para títulos)
- Body: Inter (regular)
- Line-height: 1.6-1.7 (muito respiro)

## Como usar

1. Abrir `index.html` no navegador
2. Editar links de WhatsApp, Instagram, LinkedIn conforme necessário
3. Adicionar imagens/ícones em `assets/`
4. Deploy em servidor ou plataforma de hospedagem

## Pendências

- [ ] Adicionar imagens/ícones
- [ ] Conectar links de agendamento (Calendly, Typeform, etc)
- [ ] WhatsApp link configurado
- [ ] Testar em mobile
- [ ] Deploy

## Responsive

- Desktop: 1200px max-width
- Tablet: 768px breakpoint
- Mobile: 480px breakpoint
- Todos os elementos são responsive com clamp()

## Performance

- HTML puro (zero dependências)
- CSS puro (zero frameworks)
- Sem JavaScript (até agora)
- Carregamento rápido
- Mobile-first approach
