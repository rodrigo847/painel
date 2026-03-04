# 🚀 DEPLOY RÁPIDO - VERCEL

## Status: Código no GitHub ✅

**Repositório:** https://github.com/rodrigo847/painel
**Branch:** main
**Status:** Pronto para deploy

---

## Deploy em 5 Minutos na Vercel

### Passo 1: Acesse a Vercel
1. Vá para: https://vercel.com
2. Clique em **"Sign Up"** ou **"Login"**
3. Escolha **"Continue with GitHub"**

### Passo 2: Importe o Repositório
1. No dashboard, clique em **"Add New Project"**
2. Busque por **"rodrigo847/painel"**
3. Clique em **"Import"**

### Passo 3: Configure o Projeto
**Configurações automáticas:**
- ✅ Framework: Vite (detectado automaticamente)
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Install Command: `npm install`

**Não precisa alterar nada!**

### Passo 4: Adicione Variáveis de Ambiente
Clique em **"Environment Variables"** e adicione:

```
VITE_FIREBASE_API_KEY=AIzaSyCezp2ELbQ9_bogHkpFiZMo6PcwfCkekHE
VITE_FIREBASE_AUTH_DOMAIN=painel-7a228.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=painel-7a228
VITE_FIREBASE_STORAGE_BUCKET=painel-7a228.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=931196087668
VITE_FIREBASE_APP_ID=1:931196087668:web:40927637b78cb5a8805021
VITE_PRINTER_SERVER_URL=http://localhost:3001
```

**⚠️ Importante:** 
- Adicione cada variável separadamente (Name + Value)
- O `VITE_PRINTER_SERVER_URL` aponta para localhost porque a impressora roda local
- Se quiser impressão remota, veja instruções no DEPLOY.md

### Passo 5: Deploy! 🎉
1. Clique em **"Deploy"**
2. Aguarde 1-2 minutos
3. Pronto! Seu app está online

---

## URLs Após Deploy

A Vercel vai gerar URLs como:

- **App:** https://painel-rodrigo847.vercel.app
- **Totem:** https://painel-rodrigo847.vercel.app/painel/totem
- **Guichê:** https://painel-rodrigo847.vercel.app/painel/attendant
- **Display:** https://painel-rodrigo847.vercel.app/painel/display

**💡 Dica:** Você pode customizar o domínio nas configurações do projeto!

---

## Para Servidor de Impressão Local

**Se quiser impressão funcionando:**

1. No computador conectado à impressora, execute:
   ```powershell
   cd server
   npm start
   ```

2. A impressora funcionará para quem acessar de computadores na mesma rede

3. **Para acesso externo (opcional):**
   ```powershell
   npm install -g ngrok
   ngrok http 3001
   ```
   
   Copie a URL do ngrok e atualize a variável de ambiente na Vercel:
   ```
   VITE_PRINTER_SERVER_URL=https://abc123.ngrok.io
   ```

---

## Testando Online

Após deploy:

1. ✅ Acesse o Totem e emita uma senha
2. ✅ Verifique se aparece no Firebase
3. ✅ Acesse o Guichê e chame a senha
4. ✅ Verifique se aparece no Display
5. ⚠️ Impressão só funciona se servidor local estiver rodando

---

## Problemas Comuns

### Build falha na Vercel
- Verifique se todas as variáveis de ambiente foram adicionadas
- Rode `npm run build` localmente para testar
- Veja os logs de erro no dashboard da Vercel

### Display não atualiza
- Verifique se as credenciais do Firebase estão corretas
- Abra o console do navegador (F12) para ver erros
- Verifique as regras de segurança do Firebase

### Impressão não funciona
- Normal! A impressão só funciona com servidor local rodando
- Veja instruções de impressão acima

---

## Próximos Passos

Após deploy bem-sucedido:

1. ✅ Configure domínio customizado (opcional)
2. ✅ Configure servidor de impressão local
3. ✅ Teste todo o fluxo online
4. ✅ Configure regras de segurança do Firebase
5. ✅ Treine a equipe no uso do sistema

---

## Links Úteis

- 📚 [Documentação Completa de Deploy](DEPLOY.md)
- 📖 [Guia Rápido de Uso](GUIA_RAPIDO.md)
- 🖨️ [Servidor de Impressão](server/README.md)
- 🔥 [Firebase Console](https://console.firebase.google.com)
- ☁️ [Vercel Dashboard](https://vercel.com/dashboard)

---

## Suporte

Se encontrar problemas:
1. Verifique os logs na Vercel
2. Consulte DEPLOY.md
3. Abra um issue no GitHub
