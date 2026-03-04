# 🚀 Deploy para Produção

## Código enviado para GitHub ✅

**Repositório:** https://github.com/rodrigo847/painel.git
**Branch:** main
**Último commit:** feat: Corrigir chamada de senhas e implementar servidor de impressão

---

## Opções de Deploy

### 1. Vercel (Recomendado para Frontend) 🌐

**Para o Frontend (React/Vite):**

1. Acesse [vercel.com](https://vercel.com)
2. Conecte sua conta GitHub
3. Importe o repositório: `rodrigo847/painel`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Adicione as variáveis de ambiente:
   ```
   VITE_FIREBASE_API_KEY=AIzaSyCezp2ELbQ9_bogHkpFiZMo6PcwfCkekHE
   VITE_FIREBASE_AUTH_DOMAIN=painel-7a228.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=painel-7a228
   VITE_FIREBASE_STORAGE_BUCKET=painel-7a228.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=931196087668
   VITE_FIREBASE_APP_ID=1:931196087668:web:40927637b78cb5a8805021
   VITE_PRINTER_SERVER_URL=https://seu-servidor-impressao.onrender.com
   ```

6. Deploy! 🎉

**URLs após deploy:**
- Totem: `https://seu-app.vercel.app/totem`
- Guichê: `https://seu-app.vercel.app/attendant`
- Display: `https://seu-app.vercel.app/display`

---

### 2. Render (Recomendado para Servidor de Impressão) 🖨️

**Para o Servidor de Impressão (Node.js):**

1. Acesse [render.com](https://render.com)
2. Conecte sua conta GitHub
3. Crie novo "Web Service"
4. Configure:
   - **Repository:** `rodrigo847/painel`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Node

5. Adicione as variáveis de ambiente:
   ```
   VITE_PRINTER_INTERFACE=tcp://192.168.3.38
   VITE_PRINTER_TYPE=EPSON
   VITE_PRINTER_WIDTH=80
   PRINTER_SERVER_PORT=3001
   ```

6. Deploy!

**⚠️ IMPORTANTE:** O servidor de impressão só funcionará se a impressora estiver na mesma rede que o servidor Render, o que não é viável para impressoras locais.

---

### 3. Solução Híbrida (Recomendado) ⭐

**Para impressão local com sistema na nuvem:**

**Frontend + Firebase:** Deploy na Vercel/Netlify (100% online)

**Servidor de Impressão:** Rodar localmente na máquina conectada à impressora
- Manter `npm start` rodando na pasta `server`
- Expor via ngrok ou similar para acesso externo (opcional)

**Vantagens:**
✅ Sistema acessível de qualquer lugar
✅ Impressora funciona localmente
✅ Firebase sincroniza tudo em tempo real

**Como configurar:**

1. **Deploy do Frontend na Vercel** (instruções acima)

2. **Servidor local rodando:**
   ```powershell
   cd server
   npm start
   ```

3. **Para acesso externo (opcional):**
   ```powershell
   # Instalar ngrok
   npm install -g ngrok
   
   # Expor porta 3001
   ngrok http 3001
   ```
   
   Copie a URL do ngrok (ex: `https://abc123.ngrok.io`) e configure no Vercel:
   ```
   VITE_PRINTER_SERVER_URL=https://abc123.ngrok.io
   ```

---

### 4. Railway 🚂

Similar ao Render, mas com melhor suporte para aplicações full-stack:

1. Acesse [railway.app](https://railway.app)
2. Conecte GitHub
3. Deploy o repositório
4. Configure variáveis de ambiente
5. Railway criará dois serviços automaticamente

---

## Configurações Importantes

### Firewall e Portas

Se usar servidor local:
- Liberar porta 3001 no Windows Firewall
- Configurar port forwarding no roteador (se necessário)

### CORS

O servidor de impressão já está configurado com CORS habilitado para aceitar requisições de qualquer origem.

### HTTPS

Para produção, sempre use HTTPS. A Vercel e Render fornecem isso automaticamente.

---

## Checklist de Deploy ✓

### Frontend (Vercel/Netlify)
- [ ] Repositório conectado
- [ ] Variáveis de ambiente configuradas
- [ ] Build funcionando sem erros
- [ ] URLs personalizadas configuradas (opcional)
- [ ] Domínio customizado conectado (opcional)

### Servidor de Impressão (Local ou Cloud)
- [ ] Servidor iniciando sem erros
- [ ] Impressora conectada e testada
- [ ] Endpoint /status retornando sucesso
- [ ] Endpoint /test imprimindo corretamente
- [ ] CORS configurado corretamente

### Firebase
- [ ] Regras de segurança configuradas
- [ ] Índices criados para queries
- [ ] Backup automático habilitado (opcional)

---

## URLs de Teste

Após deploy na Vercel, você terá algo como:

- **App:** https://painel-senha.vercel.app
- **Totem:** https://painel-senha.vercel.app/totem
- **Guichê:** https://painel-senha.vercel.app/attendant
- **Display:** https://painel-senha.vercel.app/display

---

## Troubleshooting

### Erro "Failed to fetch" na impressão
- Verifique se servidor de impressão está rodando
- Verifique se VITE_PRINTER_SERVER_URL está correto
- Verifique CORS no servidor

### Firebase "Permission denied"
- Configure regras de segurança no Firebase Console
- Verifique se credenciais estão corretas

### Build falha na Vercel
- Verifique se todas as dependências estão no package.json
- Rode `npm run build` localmente para testar

---

## Próximos Passos

1. ✅ Código enviado para GitHub
2. ⏳ Deploy do frontend na Vercel
3. ⏳ Configurar servidor de impressão (local ou cloud)
4. ⏳ Testar todo o fluxo online
5. ⏳ Configurar domínio customizado (opcional)

---

## Suporte

Consulte a documentação:
- [GUIA_RAPIDO.md](GUIA_RAPIDO.md) - Uso local
- [server/README.md](server/README.md) - Servidor de impressão
- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
