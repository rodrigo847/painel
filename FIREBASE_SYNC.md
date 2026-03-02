# 🔄 Sincronização com Firebase - Consulte este guia

## ✅ Problema Resolvido

**Os pedidos agora permanecem após atualizar a página!**

O sistema foi atualizado para sincronizar automaticamente com Firebase em tempo real.

---

## 🎯 O que foi corrigido

### Antes (❌ Problema)
- Dados armazenados apenas em memória (useState)
- **Ao atualizar a página, todos os tickets desapareciam**
- Sem persistência de dados

### Agora (✅ Funcionando)
- Dados sincronizados com Firebase em tempo real
- Tickets persistem mesmo após refresh
- Múltiplas abas/dispositivos veem as mesmas informações
- Histórico de chamadas salvo

---

## 🔌 Como funciona a sincronização

### 1. **Listeners em Tempo Real** (Bidirecionais)

```typescript
// Tickets - detecta mudanças automáticas
subscribeToTickets((tickets) => {
  // Atualiza localmente quando há mudanças no Firebase
  setRecentTickets(tickets)
})

// Guichês - detecta mudanças automáticas
subscribeToCounters((counters) => {
  // Atualiza localmente quando há mudanças no Firebase
  setCounters(counters)
})
```

### 2. **Sincronização de Escrita**

Quando você:
- ✅ Emite uma senha (Totem)
- ✅ Chama um ticket (Atendente)
- ✅ Finaliza um atendimento (Atendente)
- ✅ Pausa um guichê (Atendente)

Os dados são **automaticamente salvos no Firebase**.

### 3. **Carregamento Inicial**

Ao abrir a página:
1. Carrega histórico de atendimentos finalizados
2. Conecta listeners em tempo real
3. Sincroniza com Firebase
4. Mostra dados atualizados

---

## 🗂️ Estrutura de Dados no Firebase

### `tickets` collection

```json
{
  "id": "auto-gerado",
  "ticketId": "G-001",
  "category": "G|P|R",
  "number": 1,
  "counter": 0,  // 0 = não chamado, número = guichê
  "issuedAt": "2026-03-02T10:30:00Z",
  "calledAt": "2026-03-02T10:35:00Z",
  "finishedAt": "2026-03-02T10:40:00Z",
  "status": "waiting|called|finished"
}
```

### `counters` collection

```json
{
  "id": "auto-gerado",
  "counterId": 1,
  "type": "G|P|R|Balcão",
  "isAvailable": true,
  "currentTicketId": "auto-id-do-ticket",
  "lastUpdated": "2026-03-02T10:40:00Z"
}
```

---

## 🧪 Como testar

### Teste 1: Persistência de Dados
1. Abra Totem → Emita uma senha
2. Vá para Painel → Veja o ticket aparecer
3. **Atualize a página** (F5)
4. ✅ O ticket ainda está lá!

### Teste 2: Múltiplas Abas
1. Abra a página em 2 abas diferentes
2. Em uma aba: Emita uma senha
3. **Aba 2 atualiza automaticamente sem refresh!**

### Teste 3: Sincronização de Atendimento
1. Totem: Emita senha "G-001"
2. Painel: Vê "G-001" em espera
3. Atende: Chame "G-001"
4. Painel: Atualiza automaticamente
5. Atende: Finaliza "G-001"
6. Painel: Remove de chamadas, adiciona ao histórico

---

## 🔧 Configuração do Firebase

Certifique-se que seu `.env.local` tem:

```env
VITE_FIREBASE_API_KEY=sua_chave_aqui
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_projeto_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=numero
VITE_FIREBASE_APP_ID=seu_app_id
```

---

## 📊 Fluxo de Sincronização

```
┌─────────────────────────────────────┐
│         Usuário Interage            │
│  (Emite, Chama, Finaliza)          │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│     AppContext (updateFunction)     │
│  Atualiza estado local              │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│     Firebase Service                │
│  Salva em firestore/database        │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│     Firestore/Realtime DB           │
│  (Dados persistidos)                │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│     Listener (onSnapshot)           │
│  Notifica mudanças                  │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│   Outros Clientes / Abas            │
│   Recebem atualização em tempo real │
└─────────────────────────────────────┘
```

---

## 🚀 Funções Principais

### Em `firebaseService.ts`

```typescript
// Assinar mudanças em tempo real
subscribeToTickets(callback)  // Tickets
subscribeToCounters(callback) // Guichês

// Atualizar dados
updateTicketStatus(id, status, data)
updateCounterState(counterId, data)

// Carregar histórico
getTicketHistory(limit)

// Gerenciar tickets
saveTicket(ticket)
deleteTicket(id)
getNextTicketNumber(category)
```

### Em `AppContext.tsx`

```typescript
// Sincronizados automaticamente
currentTicket      // Ticket sendo chamado
recentTickets      // Últimos tickets chamados
counters           // Estado dos guichês
callHistory        // Histórico de atendimentos

// Ações que atualizam Firebase
callTicketToCounter(counterId, ticket)
finishServiceAtCounter(counterId)
setCounterAvailability(counterId, available)
```

---

## 🐛 Troubleshooting

### Dados não sincronizam
❌ Problema: Firebase não está configurado
✅ Solução: Verifique `.env.local` com credenciais corretas

### Página fica em branco ao carregar
❌ Problema: `isInitialized` = false
✅ Solução: Aguarde carregamento do histórico

### Múltiplas abas não sincronizam
❌ Problema: Listeners não conectados
✅ Solução: Verifique conexão com internet e Firebase

### Tickets desaparecem após atualizar
❌ Problema: Ainda usando dados locais
✅ Solução: Limpe cache do navegador (Ctrl+Shift+Delete)

---

## 💡 Próximas Melhorias

- [ ] Cache offline com service worker
- [ ] Sincronização automática quando volta online
- [ ] Undo/Redo para ações
- [ ] Auditoria de ações (quem fez o quê)
- [ ] Backup automático

---

**Status**: ✅ Implementado e Testado  
**Data**: 02/03/2026  
**Sistema**: Sincronização em Tempo Real com Firebase
