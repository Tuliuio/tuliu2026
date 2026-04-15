# Deploy Automático em tuliu.io via GitHub Actions

## 📋 Configuração dos Secrets

### Passo 1: Abrir Settings do Repositório

1. Acesse: https://github.com/Tuliuio/tuliu2026
2. Clique em **Settings** (engrenagem no topo)
3. Na barra esquerda, clique em **Secrets and variables** → **Actions**

### Passo 2: Adicionar os Secrets

Clique em **New repository secret** e adicione:

#### Secret 1: `HOSTINGER_API_KEY`
```
Valor: yBCOpJdCePnOV2K13YNb97BLye9NWfZXHrrdflLa351e3858
```

#### Secret 2: `HOSTINGER_EMAIL`
```
Valor: tom@somosmira.com.br
```

## 🚀 Como Fazer Deploy

### Opção 1: Automático (via Git Push)
Basta fazer push para `main` que o deploy acontece automaticamente:
```bash
git push origin main
```

### Opção 2: Manual (via GitHub Web)
1. Acesse https://github.com/Tuliuio/tuliu2026/actions
2. Selecione o workflow "Deploy para Hostinger"
3. Clique em **Run workflow**

## ✅ Verificar Deploy

Após fazer push:
1. Acesse https://github.com/Tuliuio/tuliu2026/actions
2. Veja o workflow em execução
3. Após conclusão, o site estará em https://tuliu.io

## 📊 Status do Deploy

| Etapa | Status |
|-------|--------|
| ✅ Código no GitHub | Completo |
| ✅ Workflow configurado | Completo |
| ⏳ Secrets GitHub | Aguardando configuração |
| ⏳ Deploy automático | Aguardando secrets |

## 🔗 Links Úteis

- Repositório: https://github.com/Tuliuio/tuliu2026
- Actions: https://github.com/Tuliuio/tuliu2026/actions
- Settings Secrets: https://github.com/Tuliuio/tuliu2026/settings/secrets/actions
- Site ao vivo: https://tuliu.io

## ⚠️ Notas Importantes

- Nunca compartilhe a `HOSTINGER_API_KEY` em público
- Os secrets são criptografados e seguros
- O deploy leva ~2-5 minutos por arquivo
- Após deploy, o site pode levar 1-2 minutos para atualizar (cache)
