# Servidor de Impressão - Guia de Instalação

## Pré-requisitos
- Node.js 18+ instalado
- Impressora Epson TM-T20X conectada via rede ou USB

## Instalação

1. **Navegue até a pasta do servidor:**
```powershell
cd server
```

2. **Instale as dependências:**
```powershell
npm install
```

3. **Configure a impressora:**
   - Verifique se o arquivo `.env` na raiz do projeto está configurado
   - Certifique-se que o IP da impressora está correto

## Como Executar

### Modo Produção
```powershell
npm start
```

### Modo Desenvolvimento (com auto-reload)
```powershell
npm run dev
```

O servidor irá iniciar na porta **3001** (ou a porta configurada no .env)

## Testando a Impressora

### 1. Verificar Status
```powershell
curl http://localhost:3001/status
```

### 2. Teste de Impressão
```powershell
curl -X POST http://localhost:3001/test
```

### 3. Imprimir Ticket
```powershell
curl -X POST http://localhost:3001/print -H "Content-Type: application/json" -d "{\"category\":\"Geral\",\"number\":\"001\"}"
```

## Endpoints Disponíveis

- `GET /status` - Verificar status da impressora
- `POST /print` - Imprimir ticket de senha
- `POST /test` - Imprimir ticket de teste
- `POST /reconnect` - Tentar reconectar à impressora

## Solução de Problemas

### Impressora não conecta
1. Verifique se a impressora está ligada
2. Teste ping no IP: `ping 192.168.3.38`
3. Verifique se o firewall não está bloqueando a porta 9100
4. Para impressora Windows, certifique-se que o nome está correto

### Erro "Puerto no disponible"
- Verifique se outra aplicação não está usando a porta 3001
- Altere a porta no `.env`: `PRINTER_SERVER_PORT=3002`

### Servidor não inicia
- Verifique se instalou as dependências: `npm install`
- Verifique se o Node.js está atualizado: `node --version`

## Configuração para Windows

Se sua impressora estiver configurada no Windows:

1. Abra o `.env` na raiz do projeto
2. Altere para:
```
VITE_PRINTER_INTERFACE=windows
```
3. No `server/printer-server.js`, certifique-se que o nome da impressora está correto (linha 52):
```javascript
printerName: 'TM-T20X', // Nome exato da impressora no Windows
```

Para descobrir o nome exato:
```powershell
Get-Printer | Select-Object Name
```

## Executar como Serviço (Opcional)

Para manter o servidor rodando em segundo plano, use PM2:

```powershell
npm install -g pm2
pm2 start printer-server.js --name printer-server
pm2 save
pm2 startup
```

## Log de Impressões

Todas as impressões são registradas no console do servidor para debug.
