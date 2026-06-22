# Deploy do tuliu.io

> Caminho único e oficial de publicação: **push na `main`**.
> Não existe deploy por API da Hostinger nem por skill. Só GitHub.

## Como funciona

A cada `push` na branch `main`, o GitHub Actions (`.github/workflows/deploy-hostinger.yml`):

1. Faz checkout do código
2. Roda `npm ci` e `npm run build` em `projetos/site-tuliu/tuliu-app`
3. Envia a pasta `dist/` para a Hostinger via **FTP** (`SamKirkland/FTP-Deploy-Action`)

Tudo que está em `tuliu-app/public/` (incluindo `mira/diagnosticos/...` e o `.htaccess`) é copiado para `dist/` pelo Vite e vai ao ar.

## Como publicar

```bash
git push origin main
```

Só isso. Em ~2-5 minutos o site atualiza em https://tuliu.io.

Para acompanhar: https://github.com/Tuliuio/tuliu2026/actions

## Secrets (já configurados no GitHub)

O deploy usa segredos guardados em **GitHub Secrets** (Settings → Secrets and variables → Actions). Nunca coloque credenciais neste repositório.

| Secret | Para que serve |
|--------|----------------|
| `HOSTINGER_SERVER` | Host FTP da Hostinger |
| `HOSTINGER_USERNAME` | Usuário FTP |
| `HOSTINGER_PASSWORD` | Senha FTP |

## Publicar um diagnóstico

Ver o passo a passo completo em `DIAGNOSTICOS_WORKFLOW.md` (na raiz do repositório).
Resumo: criar o HTML em `tuliu-app/public/mira/diagnosticos/<cliente>/index.html`, commitar e dar push. URL final: `https://tuliu.io/mira/diagnosticos/<cliente>`.
