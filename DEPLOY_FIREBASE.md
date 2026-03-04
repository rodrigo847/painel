# 🔥 Deploy no Firebase Hosting

## Por que Firebase Hosting?

✅ **Já usa Firebase Firestore** - tudo integrado  
✅ **Deploy simples** - um comando  
✅ **CDN global** - rápido em qualquer lugar  
✅ **SSL grátis** - HTTPS automático  
✅ **Sem custos extras** - plano gratuito generoso

---

## 🚀 Deploy em 3 Passos

### 1. Instalar Firebase CLI

```powershell
npm install -g firebase-tools
```

### 2. Fazer Login

```powershell
firebase login
```

### 3. Build e Deploy

```powershell
# Build do projeto
npm run build

# Deploy
firebase deploy --only hosting
```

**Pronto!** ✨

---

## 📦 Configuração Completa (Primeira vez)

Se ainda não configurou o Firebase Hosting:

```powershell
# 1. Instalar CLI
npm install -g firebase-tools

# 2. Login
firebase login

# 3. Inicializar projeto
firebase init hosting

# Escolher:
# - Use existing project: painel-7a228
# - Public directory: dist
# - Single-page app: Yes
# - Automatic builds with GitHub: No (opcional)
# - Overwrite index.html: No

# 4. Build
npm run build

# 5. Deploy
firebase deploy --only hosting
```

---

## 🌐 URLs Após Deploy

Após deploy, você terá:

- **App:** `https://painel-7a228.web.app`
- **Totem:** `https://painel-7a228.web.app/painel/totem`
- **Guichê:** `https://painel-7a228.web.app/painel/attendant`
- **Display:** `https://painel-7a228.web.app/painel/display`

Ou com domínio customizado:
- `https://painel-7a228.firebaseapp.com`

---

## 🔄 Re-deploy (Próximas vezes)

Sempre que atualizar o código:

```powershell
npm run build
firebase deploy --only hosting
```

Ou criar script no `package.json`:

```json
{
  "scripts": {
    "deploy": "npm run build && firebase deploy --only hosting"
  }
}
```

Depois só rodar:
```powershell
npm run deploy
```

---

## 🖨️ Servidor de Impressão

**Importante:** O servidor de impressão precisa rodar localmente na máquina conectada à impressora.

```powershell
cd server
npm start
```

Se quiser acesso externo:
```powershell
npm install -g ngrok
ngrok http 3001
```

Atualize a variável no código (ou crie `.env.production`):
```env
VITE_PRINTER_SERVER_URL=https://abc123.ngrok.io
```

E faça rebuild + redeploy.

---

## 🆚 Firebase vs Vercel

| Recurso | Firebase Hosting | Vercel |
|---------|-----------------|--------|
| **Integração** | ✅ Já usa Firebase | ⚠️ Serviço separado |
| **CDN Global** | ✅ Sim | ✅ Sim |
| **SSL** | ✅ Grátis | ✅ Grátis |
| **Deploy** | `firebase deploy` | Push no GitHub |
| **Preço** | Gratuito (15GB/mês) | Gratuito (100GB/mês) |
| **CI/CD** | Manual ou GitHub Action | Automático |
| **Edge Functions** | ❌ Não | ✅ Sim |

**Conclusão:** Para seu caso, **Firebase Hosting é mais simples e integrado**! 🔥

---

## ✅ Checklist de Deploy

- [ ] Instalar Firebase CLI
- [ ] Fazer login: `firebase login`
- [ ] Inicializar: `firebase init hosting`
- [ ] Build: `npm run build`
- [ ] Deploy: `firebase deploy --only hosting`
- [ ] Testar URLs online
- [ ] Configurar servidor de impressão local
- [ ] Atualizar `VITE_PRINTER_SERVER_URL` se necessário

---

## 🐛 Troubleshooting

### "Firebase command not found"
```powershell
npm install -g firebase-tools
```

### Erro de permissão
```powershell
firebase login --reauth
```

### Build falha
```powershell
# Limpar e rebuildar
rm -rf dist node_modules
npm install
npm run build
```

### "Project not found"
Verifique se está no projeto correto:
```powershell
firebase projects:list
firebase use painel-7a228
```

---

## 🔗 Links Úteis

- [Firebase Console](https://console.firebase.google.com/project/painel-7a228)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

---

## 💡 Dica Final

Para deploy automático via GitHub Actions, crie arquivo `.github/workflows/deploy.yml` - posso ajudar com isso se quiser! 🚀
