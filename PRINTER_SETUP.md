# 🖨️ Guia de Configuração - Impressora Epson TM-T20X

## Visão Geral

O serviço de impressora foi integrado ao sistema de emissão de senhas (Totem). Agora você pode imprimir tickets fisicamente na impressora térmica Epson TM-T20X.

## Instalação

A biblioteca `node-thermal-printer` já foi instalada:

```bash
npm install node-thermal-printer
```

## Configuração

### Variáveis de Ambiente (`.env`)

O arquivo `.env` controla as configurações da impressora:

```env
# Printer Configuration
VITE_PRINTER_INTERFACE=tcp://192.168.3.38
VITE_PRINTER_TYPE=EPSON
VITE_PRINTER_WIDTH=80
VITE_PRINTER_CHARSET=CP1252
```

**Altere o IP conforme necessário** para sua rede.

## Arquivos Principais

- **[src/services/printer.ts](src/services/printer.ts)** - Serviço de impressora
- **[src/components/Totem/TotemLayout.tsx](src/components/Totem/TotemLayout.tsx)** - Integração com o Totem
- **[.env](.env)** - Configurações (IP, tipo, etc.)

## Como Usar

### 1. Importar o Serviço

```typescript
import { 
  printTicket, 
  getPrinterStatus, 
  connectPrinter,
  disconnectPrinter 
} from '../../services/printer'
```

### 2. Imprimir um Ticket

```typescript
const printed = await printTicket({
  category: 'Atendimento Geral',
  number: '001',
  timestamp: new Date(),
  guiche: 3 // opcional
})

if (printed) {
  console.log('Ticket impresso com sucesso!')
} else {
  console.log('Erro ao imprimir')
}
```

### 3. Verificar Status da Impressora

```typescript
const status = getPrinterStatus() // Retorna: "Conectada" ou "Desconectada"
console.log(`Impressora: ${status}`)
```

### 4. Conectar/Desconectar

```typescript
// Conectar com configuração do .env (padrão)
await connectPrinter()

// Conectar com configuração customizada (sobrescreve .env)
await connectPrinter({
  interface: 'tcp://192.168.3.38', // Para Ethernet
  type: 'EPSON',
  width: 80
})

// Desconectar
await disconnectPrinter()
```

**Nota**: A configuração automática vem do arquivo `.env`. Para alterar o IP, edite o `.env` e reinicie o servidor de desenvolvimento.

## Configuração de Hardware

### Conexão USB (Recomendada)

1. Conectar impressora à porta USB do tablet/computador
2. Instalar drivers da Epson (se necessário)
3. A conexão funcionará automaticamente com `interface: 'windows'`

### Conexão Ethernet

1. Configurar IP fixo na impressora (ex: 192.168.3.38)
2. Conectar à mesma rede do tablet
3. Editar o arquivo `.env` com o IP correto:

```env
VITE_PRINTER_INTERFACE=tcp://192.168.3.38
```

4. Reiniciar o servidor de desenvolvimento (`npm run dev`)
5. A conexão acontecerá automaticamente

### Conexão Bluetooth

1. Parear impressora com o dispositivo
2. Usar nome do dispositivo como interface

```typescript
connectPrinter({
  interface: 'BT:PRINTER_NAME'
})
```

## Formato do Ticket

O ticket impresso tem o seguinte formato:

```
============================
          SENHA
============================

Categoria: Atendimento Geral
Número: 001
Data: 02/03/2026
Hora: 14:30:45

Guichê: 3

============================
Obrigado por aguardar!
============================
```

## Tipos de Dados

### `TicketData`

```typescript
interface TicketData {
  category: string      // Ex: "Atendimento Geral", "Prioritário"
  number: string        // Ex: "001", "042"
  timestamp?: Date      // Opcional, data/hora do ticket
  guiche?: number       // Opcional, número do guichê
}
```

### `PrinterConfig`

```typescript
interface PrinterConfig {
  interface?: string    // Tipo de conexão (default: 'windows')
  type?: string         // Tipo de impressora (default: 'EPSON')
  width?: number        // Largura do papel (default: 80)
  characterSet?: string // Conjunto de caracteres (default: 'CP1252')
}
```

## Troubleshooting

### Impressora não detectada

1. Verifique a conexão física (USB/Ethernet/Bluetooth)
2. Instale os drivers corretos da Epson
3. Verifique o status: `getPrinterStatus()`
4. Se usar Ethernet, confirme o IP está correto

### Erro ao imprimir

1. Verifique se há papel na impressora
2. Verifique se a impressora está ligada
3. Tente reconectar: `connectPrinter()`
4. Verifique os logs do console para mais detalhes

### Caracteres incorretos

Ajuste o `characterSet` nas configurações do `.env`:

```env
VITE_PRINTER_CHARSET=UTF8
```

Ou passe na configuração programática:

```typescript
connectPrinter({
  characterSet: 'UTF8' // ou outro conforme necessário
})
```

## Sons

O sistema toca um som ao imprimir (`/sounds/print.mp3`). Certifique-se de que o arquivo existe em `public/sounds/print.mp3`.

## Próximas Melhorias

- [ ] QR Code no ticket
- [ ] Logos/imagens personalizadas
- [ ] Múltiplas impressoras
- [ ] Histórico de impressão
- [ ] Reconexão automática
- [ ] Dashboard de status da impressora

## Referências


- [Node Thermal Printer Docs](https://github.com/Klemen1337/node-thermal-printer)
- [Epson TM-T20X Manual](https://epson.com.br)
- [ESC/POS Commands](https://www.epson-biz.com/files/pos/reference_en_revf.pdf)

---

**Status**: ✅ Integrado e funcionando  
**Última atualização**: 02/03/2026
