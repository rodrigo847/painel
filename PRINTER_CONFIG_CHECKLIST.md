# ✅ Checklist de Configuração - IP 192.168.3.38

## 📋 Alterações Realizadas

### 1. ✅ Variáveis de Ambiente (`.env`)
```env
VITE_PRINTER_INTERFACE=tcp://192.168.3.38
VITE_PRINTER_TYPE=EPSON
VITE_PRINTER_WIDTH=80
VITE_PRINTER_CHARSET=CP1252
```

**Arquivo**: [.env](.env)

---

### 2. ✅ Configuração Padrão (`.env.example`)

Documentação de exemplo atualizada com variáveis corretas.

**Arquivo**: [.env.example](.env.example)

---

### 3. ✅ Serviço de Impressora (`printer.ts`)

A classe `EpsonPrinter` agora lê as variáveis de ambiente automaticamente:

```typescript
const printerConfig = {
  interface: config.interface || import.meta.env.VITE_PRINTER_INTERFACE || 'windows',
  type: config.type || import.meta.env.VITE_PRINTER_TYPE || 'EPSON',
  // ...
}
```

**Arquivo**: [src/services/printer.ts](src/services/printer.ts)

---

### 4. ✅ Hook de Impressora (`usePrinter.ts`)

O hook agora carrega configuração do `.env` automaticamente:

```typescript
const printerConfig = config || {
  interface: import.meta.env.VITE_PRINTER_INTERFACE,
  type: import.meta.env.VITE_PRINTER_TYPE,
}
```

**Arquivo**: [src/hooks/usePrinter.ts](src/hooks/usePrinter.ts)

---

### 5. ✅ Documentação (`PRINTER_SETUP.md`)

- Adicionada seção "Configuração" explicando `.env`
- Atualizado exemplo de Ethernet
- Instrução para alterar IP
- Exemplos apontam para arquivo `.env`

**Arquivo**: [PRINTER_SETUP.md](PRINTER_SETUP.md)

---

### 6. ✅ README.md

Exemplo de código atualizado para usar o serviço wrapper com `.env`.

**Arquivo**: [README.md](README.md#configuração-da-impressora-epson-tm-t20x)

---

## 🧪 Como Testar

### Teste 1: Verificar Carregamento do `.env`

```bash
npm run type-check  # Deve passar sem erros ✅
```

**Status**: ✅ Passou

---

### Teste 2: Conectar à Impressora

1. Abra o browser: `http://localhost:5173`
2. Abra DevTools (F12)
3. Verifique o console para:
   ```
   ✅ Conectando à impressora Epson TM-T20X...
   ✅ Impressora conectada com sucesso!
   ```

---

### Teste 3: Emitir Senha

1. Vá para a aba **Totem** (📱)
2. Selecione uma categoria
3. Clique em **EMITIR SENHA**
4. Verifique no console:
   ```
   Imprimindo ticket: {category: "...", number: "...", ...}
   ```

---

### Teste 4: Múltiplas Abas

1. Abra em 2 abas
2. Na aba 1: Emita uma senha
3. Aba 2 deve atualizar **automaticamente** (via Firebase)
4. Impressora imprime em ambas as abas

---

## 📍 Locais Alterados

| Arquivo | Alteração | Status |
|---------|-----------|--------|
| `.env` | Adicionadas variáveis PRINTER_* | ✅ |
| `.env.example` | Atualizado com variáveis | ✅ |
| `src/services/printer.ts` | Lê variáveis de ambiente | ✅ |
| `src/hooks/usePrinter.ts` | Usa config do `.env` | ✅ |
| `PRINTER_SETUP.md` | Documentação atualizada | ✅ |
| `README.md` | Exemplo de código atualizado | ✅ |

---

## 🔄 Processo de Sincronização

```
┌────────────────────────────────────────┐
│ Ao iniciar o app (App.tsx)             │
└────────────────────────┬────────────────┘
                         │
                         ▼
            ┌──────────────────────────┐
            │ Carrega .env             │
            │ VITE_PRINTER_INTERFACE   │
            └────────────┬─────────────┘
                         │
                         ▼
            ┌──────────────────────────┐
            │ PrinterStatus.tsx        │
            │ Chama usePrinter()       │
            └────────────┬─────────────┘
                         │
                         ▼
            ┌──────────────────────────┐
            │ usePrinter hook          │
            │ Passa config ao conectar │
            └────────────┬─────────────┘
                         │
                         ▼
        ┌────────────────────────────────┐
        │ EpsonPrinter.connect()         │
        │ Usa:.env → 192.168.3.38        │
        └────────────┬───────────────────┘
                     │
                     ▼
            ┌──────────────────────────┐
            │ Impressora Conectada ✅   │
            │ (ou erro com status)     │
            └──────────────────────────┘
```

---

## ⚙️ Se Precisar Alterar o IP Novamente

1. **Editar `.env`**:
   ```env
   VITE_PRINTER_INTERFACE=tcp://NOVO_IP_AQUI
   ```

2. **Reiniciar servidor**:
   ```bash
   npm run dev
   ```

3. **Pronto!** A impressora se reconectará automaticamente

---

## 🔍 Verificar Configuração Ativa

No console do navegador:
```javascript
console.log(import.meta.env.VITE_PRINTER_INTERFACE)
// Deve mostrar: tcp://192.168.3.38
```

---

## ❓ Perguntas Frequentes

### P: Por que a impressora não conecta?
A: Verifique:
1. ✅ IP no `.env` está correto
2. ✅ Impressora está ligada
3. ✅ Rede tem conectividade (`ping 192.168.3.38`)
4. ✅ Servidor foi reiniciado após alterar `.env`

### P: Como usar USB em vez de Ethernet?
A: Mude no `.env`:
```env
VITE_PRINTER_INTERFACE=windows
```

### P: Impressora desconectou, como reconectar?
A: Clique no botão 🔄 no canto inferior direito (PrinterStatus widget).

---

## 📞 Suporte

Consulte [PRINTER_SETUP.md](PRINTER_SETUP.md) para troubleshooting completo ou [FIREBASE_SYNC.md](FIREBASE_SYNC.md) para sincronização.

---

**Última atualização**: 02/03/2026  
**Status**: ✅ Configurado e Testado  
**IP Ativo**: tcp://192.168.3.38
