# 🔥 Guia de Configuração Firebase

## Passo 1: Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Criar Projeto"
3. Nome do projeto: `Painel-Senha` (ou seu nome preferido)
4. Desabilite Google Analytics (opcional)
5. Clique em "Criar projeto"

## Passo 2: Registrar Web App

1. No console Firebase, clique no ícone `</>`  para registrar um app web
2. Nome: `Painel Senha Web`
3. Marque "Also set up Firebase Hosting" (opcional)
4. Clique em "Registrar app"

## Passo 3: Copiar Configuração

A página mostrará algo como:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto",
  storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcd1234..."
};
```

## Passo 4: Preencher .env

Copie os valores acima e preencha o arquivo `.env` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu-projeto
VITE_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcd1234...
```

## Passo 5: Criar Firestore Database

1. No console Firebase, vá em **Firestore Database**
2. Clique em "Criar banco de dados"
3. Selecione **Começar no modo de teste**
4. Localização: **Escolher próxims servidor (recomendado para BR: south-america-east1)**
5. Clique em "Criar"

## Passo 6: Configurar Regras de Segurança

No Firestore, vá em **Regras** e defina:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir escrita e leitura em desenvolvimento
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **Nota**: Em produção, use regras mais restritivas!

## Passo 7: Restart do Servidor

```bash
npm run dev
```

## Estrutura do Banco de Dados

O sistema criará automaticamente estas coleções:

### `tickets`
```javascript
{
  ticketId: "G-001",
  category: "G", // G, P, R
  number: 1,
  counter: 1,
  issuedAt: Date,
  calledAt: Date,
  finishedAt: Date,
  status: "waiting" // waiting, called, finished
}
```

### `counters`
```javascript
{
  counterId: 1,
  type: "G", // G, P, R
  isAvailable: true,
  currentTicketId: "G-001",
  lastUpdated: Date
}
```

## ✅ Pronto!

Agora o banco de dados Firebase está configurado e integrado ao projeto!
