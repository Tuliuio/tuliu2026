# Deploy Instructions — Agro Aplicação

## Status

✅ Arquivo pronto: `angela_agro_deploy.zip` (1.1 MB)  
⏳ Próximo passo: Upload no Hostinger

---

## Como fazer upload no Hostinger

### 1. Acesse o painel do Hostinger
- Vá para https://dashboard.hostinger.com/
- Faça login com sua conta

### 2. Crie o subdomínio (se não existir)
1. Vá em **Domains** (ou Domínios)
2. Clique no domínio `tuliu.io`
3. Vá em **Subdomains** e crie `agroaplicacao`
4. Aponte para a pasta `/public_html/agroaplicacao/`

### 3. Upload dos arquivos
#### Opção A: Via File Manager (mais fácil)
1. No painel do Hostinger, vá em **File Manager**
2. Navegue até `/public_html/agroaplicacao/`
3. Faça upload de `angela_agro_deploy.zip`
4. Clique direito → **Extract** (extrair)
5. Pronto! Os arquivos estarão no lugar

#### Opção B: Via FTP
1. Abra seu cliente FTP (Filezilla, Cyberduck, etc)
2. Conecte com as credenciais FTP do Hostinger
3. Navegue até `/public_html/agroaplicacao/`
4. Faça upload de `angela_agro_deploy.zip`
5. Extraia no servidor

### 4. Ativar SSL/HTTPS
1. No painel do Hostinger, vá em **Security** (ou Segurança)
2. Vá em **SSL Certificate**
3. Clique em "Manage SSL" para o subdomínio
4. Selecione **Free SSL from Let's Encrypt**
5. Clique em **Install**
6. Espere até 24h para a ativação completa

### 5. Forçar HTTPS
1. No **File Manager**, vá até a raiz do subdomínio (`/public_html/agroaplicacao/`)
2. Procure ou crie um arquivo `.htaccess`
3. Adicione estas linhas:

```htaccess
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
```

4. Salve o arquivo

---

## Teste após upload

Abra seu navegador e acesse:
```
https://agroaplicacao.tuliu.io
```

### Checklist de validação
- [ ] Página carrega sem erros
- [ ] Logo aparece (e está redonda)
- [ ] Texto está legível
- [ ] Cores são verde limão + verde escuro
- [ ] Botões estão funcionando
- [ ] ResponsIvo no mobile
- [ ] HTTPS está ativo (cadeado verde na barra)
- [ ] WhatsApp CTA abre conversa

---

## Próximos passos

1. **Atualizar dados da Angela**
   - [ ] Número de WhatsApp real
   - [ ] Email real
   - [ ] Link de calendário (Calendly, etc)

2. **Integração com ebook**
   - [ ] Criar formulário de captura (Zapier, Make, etc)
   - [ ] Conectar com email da Angela

3. **Analytics**
   - [ ] Adicionar Google Analytics
   - [ ] Rastrear cliques nos CTAs

4. **Próxima venda**
   - [ ] Domínio personalizado (agro-aplicacao.com.br)
   - [ ] Site completo com mais conteúdo
   - [ ] Automações (WhatsApp, email, agendamento)

---

## Suporte

Se algo der errado:
1. Verifique o arquivo `.zip` — deve ter `index.html` + `assets/`
2. Verifique se extraiu corretamente no servidor
3. Verifique permissões de arquivo (755 para pastas, 644 para arquivos)
4. Limpe o cache do navegador (Ctrl+Shift+Delete)
5. Aguarde até 24h para SSL ativar completamente

**Dúvidas?** Entre em contato com o suporte do Hostinger ou tente novamente o deploy.
