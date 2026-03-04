# 🚀 GUIA RÁPIDO DE USO

## Problemas Corrigidos ✅

1. **Guichês não chamavam senhas** - CORRIGIDO
   - Removida duplicação de chamadas ao Firebase
   - Corrigido fluxo de atualização de tickets

2. **Impressora não funcionava** - CORRIGIDO  
   - Criado servidor Node.js para gerenciar impressão
   - Serviço de impressora agora chama API via HTTP

3. **Display não mostrava ticket correto** - CORRIGIDO
   - Corrigido para exibir `ticketId` ao invés de `id`

## Como Iniciar o Sistema

### Opção 1: Automático (Windows)
```powershell
.\start.bat
```
Isso irá abrir 2 janelas:
- Servidor de Impressão (porta 3001)
- Frontend do Sistema (porta 5173)

### Opção 2: Manual

**Terminal 1 - Servidor de Impressão:**
```powershell
cd server
npm start
```

**Terminal 2 - Frontend:**
```powershell
npm run dev
```

## Acessar o Sistema

Após iniciar, abra no navegador:

- **Totem (Emissão de Senhas):** http://localhost:5173/totem
- **Guichê (Atendente):** http://localhost:5173/attendant
- **Display (Painel):** http://localhost:5173/display

## Testar a Impressora

### Verificar Status
```powershell
curl http://localhost:3001/status
```

### Imprimir Teste
```powershell
curl -X POST http://localhost:3001/test
```

## Fluxo do Sistema

1. **Totem**: Cliente seleciona tipo de atendimento e emite senha
   - Sistema salva no Firebase
   - Tenta imprimir o ticket

2. **Guichê**: Atendente seleciona tipo e chama próxima senha
   - Sistema busca primeira senha em espera
   - Atualiza status para "chamada"
   - Atribui ao guichê

3. **Display**: Mostra senha atual sendo chamada
   - Atualização em tempo real via Firebase
   - Histórico de últimas senhas

## Configuração da Impressora

### Rede (TCP/IP) - Recomendado
No arquivo `.env`:
```env
VITE_PRINTER_INTERFACE=tcp://192.168.3.38
```

### Windows (USB)
No arquivo `.env`:
```env
VITE_PRINTER_INTERFACE=windows
```

E no arquivo `server/printer-server.js` (linha 52):
```javascript
printerName: 'TM-T20X', // Nome exato da impressora
```

Para descobrir o nome:
```powershell
Get-Printer | Select-Object Name
```

## Problemas Comuns

### 🔴 Servidor de impressão não conecta
- Verifique se a impressora está ligada
- Teste: `ping 192.168.3.38`
- Verifique firewall na porta 9100

### 🔴 Senhas não aparecem no display
- Verifique se o Firebase está configurado corretamente
- Abra console do navegador (F12) para ver erros

### 🔴 Guichê não chama senhas
- Certifique-se que há senhas em espera no Firebase
- Verifique se o tipo de atendimento corresponde às senhas na fila
- Veja console do navegador para erros

### 🔴 Erro "Failed to fetch" na impressão
- Servidor de impressão não está rodando
- Inicie com: `cd server && npm start`

## Estrutura de Dados

### Ticket (Senha)
```typescript
{
  id: string,              // ID do documento Firebase
  ticketId: string,        // Ex: "G-001", "P-002"
  category: 'G'|'P'|'R',  // Geral, Prioritário, Retirada
  number: number,          // Número sequencial
  status: 'waiting'|'called'|'finished',
  counter: number,         // Guichê (0 = sem guichê)
  issuedAt: Date,
  calledAt?: Date,
  finishedAt?: Date
}
```

## Comandos Úteis

### Limpar console dos terminais
```powershell
Clear-Host
```

### Ver logs do servidor
Os logs aparecem automaticamente no terminal do servidor

### Reiniciar tudo
1. Feche todos os terminais (Ctrl+C)
2. Execute: `.\start.bat`

## Próximos Passos (Opcional)

- [ ] Adicionar sons de chamada no display
- [ ] Implementar estatísticas do dia
- [ ] Adicionar autenticação para atendentes
- [ ] Configurar temas/cores personalizadas
- [ ] Deploy em produção

## Suporte

Consulte os arquivos:
- `server/README.md` - Documentação completa do servidor
- `FIREBASE_SETUP.md` - Configuração do Firebase
- `PRINTER_SETUP.md` - Configuração da impressora
