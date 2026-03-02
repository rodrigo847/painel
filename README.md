# 📞 Painel de Chamada de Senhas

Um aplicativo para gerenciar e chamar senhas em filas de atendimento. Sistema simples e intuitivo para organizar o fluxo de clientes, com design moderno inspirado em painéis de cartórios.

## �️ Arquitetura do Sistema

O sistema é composto por 3 componentes principais:

### 1. 📱 Totem de Emissão (Tablet)

- **Hardware**: Tablet (Android/iOS/Windows)
- **Impressora**: Epson TM-T20X (impressora térmica)
- **Função**: Interface touch para cliente selecionar categoria e imprimir senha
- **Categorias disponíveis**:
  - 🔵 Atendimento Geral
  - 🔴 Prioritário
  - 🟢 Retirada

### 2. 🖥️ Painel de Exibição

- **Hardware**: TV 40 polegadas (Full HD 1920x1080)
- **Função**: Exibir senhas chamadas em tempo real
- **Visual**: Design moderno tipo cartório com cores e animações
- **Layout**: Dividido em 2 áreas (Senhas + Propaganda/Canal)

#### Layout Responsivo da TV 40"

**Proporção de Tela:**

┌─────────────────────────────────────────────────┐
│                   TELA COMPLETA                 │
│                 1920 x 1080 pixels              │
│                                                 │
│  ┌────────────────────────────┐  ┌──────────────┐  │
│  │                            │  │              │  │
│  │  SENHAS                    │  │  PROPAGANDA  │  │
│  │  CHAMADAS                  │  │  ou CANAL TV │  │
│  │                            │  │              │  │
│  │  70% da tela               │  │  30% da tela │  │
│  │  (1344px)                  │  │  (576px)     │  │
│  │                            │  │              │  │
│  └────────────────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────┘

**Área de Senhas (Lado Esquerdo - 70%):**

- Senha atual em destaque (grande e colorida)
- Guichê correspondente
- 3-4 últimas senhas chamadas
- Totalmente visível e legível
- Mais espaço para informações das senhas

**Área de Propaganda/Canal (Lado Direito - 30%):**

- Vídeos promocionais
- Canal de TV ao vivo
- Slides de informações
- Avisos importantes

**Vantagens do Layout:**

- ✅ Senhas sempre visíveis
- ✅ Conteúdo adicional sem prejudicar atendimento
- ✅ Monetização com propagandas
- ✅ Informação útil para clientes em espera

### 3. 💻 Interface de Atendente

- **Hardware**: Computador/Tablet em cada guichê
- **Função**: Sistema simples com botão "Chamar Próxima" e "Rechamar"
- **Controles**:
  - Chamar próxima senha (automático por prioridade)
  - Rechamar última senha
  - Visualizar fila em tempo real

## �🎨 Design e Interface

### Painel de Exibição (TV 40")

**Layout Split-Screen Otimizado:**

┌────────────────────────────────────────────────────────────────┐
│                        TV 40" - 1920x1080                      │
├───────────────────────────────────────────┬────────────────────┤
│  ÁREA DE SENHAS (70%)                     │  PROPAGANDA (30%) │
│  1344px largura                           │  576px largura    │
│                         │                                      │
│  ┌───────────────────┐  │  ┌──────────────────────────────┐  │
│  │   SENHA ATUAL     │  │  │                              │  │
│  │                   │  │  │                              │  │
│  │    🔴 P-015       │  │  │       VÍDEO/CANAL            │  │
│  │   GUICHÊ 3        │  │  │                              │  │
│  │                   │  │  │    OU PROPAGANDA             │  │
│  └───────────────────┘  │  │                              │  │
│                         │  │                              │  │
│  ÚLTIMAS CHAMADAS:      │  └──────────────────────────────┘  │
│  • G-014 → Guichê 1    │                                      │
│  • R-003 → Retirada    │   Conteúdo rotativo:                │
│  • P-014 → Guichê 5    │   - Vídeos institucionais           │
│  • G-013 → Guichê 2    │   - Canal de TV (opcional)          │
│                         │   - Avisos/Promoções                │
│  Aguardando:            │   - Clima/Hora                      │
│  🔵 Geral: 5            │                                      │
│  🔴 Prior: 2            │                                      │
│  🟢 Retir: 1            │                                      │
└─────────────────────────┴──────────────────────────────────────┘

**Características Visuais:**

- **Visual Moderno**: Interface limpa e profissional similar a painéis de cartórios
- **Alta Legibilidade**: Fontes grandes (senha atual: 120px+)
- **Cores Contrastantes**: Fundo escuro, texto claro, categorias coloridas
- **Animações Suaves**:

  - Fade in ao chamar nova senha
  - Pulso na senha atual
  - Transição suave no histórico
- **Responsivo**: Layout adapta se propaganda for desativada (100% senhas)

**Área de Senhas (Sempre Visível - 70%):**

- Senha atual: 50% do espaço (alta prioridade visual)
- Histórico: 30% do espaço
- Contador de filas: 20% do espaço
- Maior destaque para informações de atendimento

**Área de Propaganda (Configurável - 30%):**

- Suporta vídeo HTML5
- Embed de canal de TV (iframe)
- Carrossel de imagens
- Conteúdo pode ser gerenciado remotamente
- Espaço compacto mas visível

### Guichês de Atendimento

| Guichê | Tipo | Descrição |

| **Guichê 1** | Atendimento Geral | Atendimentos diversos |
| **Guichê 2** | Atendimento Geral | Atendimentos diversos |
| **Guichê 3** | Atendimento Geral | Atendimentos diversos |
| **Guichê 4** | Atendimento Geral | Atendimentos diversos |
| **Guichê 5** | Atendimento Geral | Atendimentos diversos |
| **Balcão** | Atendimento Rápido | Informações e consultas |
| **Retirada** | Entrega de Documentos | Retirada de produtos/documentos |

### Categorias de Senha

Sistema de retirada de senhas com 3 categorias distintas:

| Categoria | Código | Cor | Descrição |

- Senhas prioritárias têm precedência sobre as normais
- Cada categoria possui fila independente
- Contador de senhas reinicia ao chegar a 100 (inicia 001, Final: 100)

### Funcionalidades do Painel de Exibição

**Área de Senhas:**

- ✅ Exibir senha atual por guichê com destaque
- ✅ Últimas 3-5 senhas chamadas em histórico
- ✅ Animações de transição suaves
- ✅ Efeitos sonoros de chamada
- ✅ Contador de filas por categoria
- ✅ Indicador de status de cada guichê

**Área de Propaganda/Canal:**

- ✅ Exibição de vídeos institucionais
- ✅ Embed de canal de TV ao vivo
- ✅ Carrossel de imagens/slides
- ✅ Avisos e informativos
- ✅ Relógio e previsão do tempo
- ✅ Gerenciamento remoto de conteúdo
- ✅ Modo tela cheia de senhas (desativa propaganda)

### Sistema de Gerenciamento

- ✅ Gerar senhas por categoria (Geral, Prioritário, Retirada)
- ✅ Sistema de prioridade automático
- ✅ Chamar próxima senha da fila respeitando prioridades
- ✅ Rechamar senha atual
- ✅ Transferir senha entre guichês
- ✅ Monitorar fila de espera em tempo real por categoria
- ✅ Pausar/retomar atendimento por guichê
- ✅ Estatísticas de atendimento por categoria
- ✅ Identificação visual por cores (Azul/Vermelho/Verde)

## 🛠️ Tecnologias

### Software

- **Runtime**: Node.js
- **Linguagem**: TypeScript
- **Frontend**: HTML5 + Tailwind CSS
- **Build Tool**: Vite
- **Banco de Dados**: Firebase (sincronização em tempo real)
- **Impressão**: Driver ESC/POS para Epson TM-T20X

### Hardware

- **Totem**: Tablet (recomendado 10" ou maior)
- **Impressora**: Epson TM-T20X (térmica 80mm)
- **Painel**: TV/Monitor Full HD ou 4K
- **Atendentes**: Computador/Tablet por guichê

### Bibliotecas Necessárias

- `escpos` ou `node-thermal-printer` - Comunicação com impressora
- `firebase/firestore` - Sincronização em tempo real
- `react-query` - Gerenciamento de estado

## 📦 Instalação

```bash
# Clonar repositório
git clone <seu-repositorio>

# Entrar no diretório
cd Painel_senha

# Instalar dependências
npm install

# Instalar Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Instalar bibliotecas para impressora
npm install node-thermal-printer

# Instalar Firebase
npm install firebase
```

## 🚀 Como Usar

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📂 Estrutura do Projeto

```plaintext
Painel_senha/
├── README.md
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.tsx
│   ├── index.css
│   ├── App.tsx
│   ├── components/
│   │   ├── Totem/            # Interface do tablet (emissão)
│   │   │   ├── CategorySelector.tsx
│   │   │   └── TicketConfirmation.tsx
│   │   ├── Display/          # Painel de exibição (TV 40")
│   │   │   ├── DisplayLayout.tsx        # Layout split-screen
│   │   │   ├── TicketPanel.tsx          # Área esquerda (senhas)
│   │   │   ├── MediaPanel.tsx           # Área direita (propaganda)
│   │   │   ├── CurrentTicket.tsx        # Senha atual destaque
│   │   │   ├── RecentTickets.tsx        # Histórico
│   │   │   └── QueueCounter.tsx         # Contador de filas
│   │   ├── Media/            # Componentes de propaganda
│   │   │   ├── VideoPlayer.tsx          # Player de vídeo
│   │   │   ├── TVEmbed.tsx              # Embed de canal TV
│   │   │   ├── ImageCarousel.tsx        # Carrossel de imagens
│   │   │   └── WeatherClock.tsx         # Relógio/clima
│   │   ├── Attendant/        # Interface do atendente
│   │   │   ├── CallButton.tsx
│   │   │   └── QueueStatus.tsx
│   │   └── Admin/            # Configurações e relatórios
│   │       └── MediaManager.tsx         # Gerenciar conteúdo
│   ├── types/                # Tipos TypeScript
│   ├── utils/                # Funções auxiliares
│   ├── services/
│   │   ├── firebase.ts       # Configuração Firebase
│   │   ├── printer.ts        # Driver Epson TM-T20X
│   │   ├── queue.ts          # Lógica de filas
│   │   └── media.ts          # Gerenciamento de mídia
│   └── hooks/                # Custom hooks React
├── public/
│   ├── index.html
│   ├── sounds/
│   │   ├── call.mp3          # Som de chamada
│   │   └── print.mp3         # Som de impressão
│   └── media/                # Arquivos de mídia
│       ├── videos/           # Vídeos promocionais
│       └── images/           # Imagens para carrossel
└── dist/


## ⚙️ Configuração Inicial

### TypeScript

- Configurado com `tsconfig.json` para suportar JSX e módulos ES6

### Tailwind CSS

- Pré-processador: PostCSS
- Configuração: `tailwind.config.js` para customizar temas
- Classes personalizadas para layout split-screen

### Vite

- Build tool rápido e moderno
- Hot Module Replacement (HMR) para desenvolvimento

### Layout Responsivo (TV 40")

**Configuração Tailwind para Split-Screen:**

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .display-container {
    @apply w-screen h-screen flex overflow-hidden bg-gray-900;
  }
  
  .ticket-panel {
    @apply h-full p-8 flex flex-col justify-between;
    width: 70%; /* 70% para área de senhas */
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  }
  
  .media-panel {
    @apply h-full relative overflow-hidden;
    width: 30%; /* 30% para área de propaganda */
  }
  
  .current-ticket {
    @apply text-center py-12 rounded-2xl shadow-2xl;
  }
  
  .ticket-number {
    @apply text-8xl font-bold tracking-wider animate-pulse;
  }
}
```

**Exemplo de Componente DisplayLayout:**

```typescript
// src/components/Display/DisplayLayout.tsx
export default function DisplayLayout() {
  return (
    <div className="display-container">
      {/* Área de Senhas - 70% */}
      <div className="ticket-panel">
        <CurrentTicket />
        <RecentTickets />
        <QueueCounter />
      </div>
      
      {/* Área de Propaganda - 30% */}
      <div className="media-panel">
        <MediaPanel />
      </div>
    </div>
  );
}
```

## 📺 Opções de Conteúdo para Área de Propaganda (30%)

### 1. Vídeos Institucionais

```typescript
// Formato suportado: MP4, WebM
// Reprodução automática em loop
<VideoPlayer src="/media/videos/institucional.mp4" autoplay loop />
```

### 2. Canal de TV ao Vivo

```typescript
// Embed de canal via YouTube ou serviço de streaming
<TVEmbed 
  src="https://www.youtube.com/embed/live_stream" 
  muted={true} 
/>
```

### 3. Carrossel de Imagens

```typescript
// Slides automáticos (5-10 segundos cada)
<ImageCarousel 
  images={[
    '/media/images/promo1.jpg',
    '/media/images/promo2.jpg',
    '/media/images/aviso.jpg'
  ]} 
  interval={7000} 
/>
```

### 4. Conteúdo Misto

```typescript
// Rotação: Vídeo → Imagens → Canal TV
<MediaPanel mode="rotation" />
```

### 5. Informações Úteis

- Relógio digital
- Previsão do tempo
- Notícias RSS
- Avisos importantes

**Gerenciamento:**

- Upload via painel administrativo
- Agendamento por horário/dia
- Priorização de conteúdo
- Estatísticas de exibição

## 🎭 Fluxo de Funcionamento

### 1️⃣ Cliente no Totem (Tablet)

┌─────────────────────────────┐
│  SELECIONE O ATENDIMENTO    │
├─────────────────────────────┤
│                             │
│  🔵 [ATENDIMENTO GERAL]     │
│                             │
│  🔴 [PRIORITÁRIO]           │
│                             │
│  🟢 [RETIRADA]              │
│                             │
└─────────────────────────────┘

**Processo:**

1. Cliente toca na categoria desejada
2. Sistema gera senha sequencial (G-001, P-001, R-001)
3. Impressora Epson TM-T20X imprime ticket térmico
4. Senha entra na fila no Firebase
5. Tela mostra confirmação e posição na fila

### 2️⃣ Atendente no Guichê

**Interface Simples:**

┌────────────────────────────┐
│   GUICHÊ 3                 │
├────────────────────────────┤
│   Fila: 8 pessoas          │
│   Última: G-015            │
├────────────────────────────┤
│                            │
│   [CHAMAR PRÓXIMA]         │
│                            │
│   [RECHAMAR]               │
│                            │
└────────────────────────────┘

**Processo:**

1. Atendente clica "Chamar Próxima"
2. Sistema busca próxima senha (prioriza P > G > R)
3. Senha aparece no painel de exibição
4. Som de chamada toca (bip)
5. Atendente realiza atendimento

### 3️⃣ Painel de Exibição (TV)

**Layout Cartório:**

┌──────────────────────────────────────────┐
│          SENHA ATUAL                     │
│                                          │
│         🔴 P-005                         │
│         GUICHÊ 3                         │
│                                          │
├──────────────────────────────────────────┤
│  ÚLTIMAS CHAMADAS                        │
│  G-014 → Guichê 1                        │
│  R-003 → Retirada                        │
│  P-004 → Guichê 5                        │
└──────────────────────────────────────────┘

## 🚧 Roadmap

### Fase 1: MVP (Mínimo Viável)

- [ ] Configurar projeto Vite + TypeScript + Tailwind
- [ ] Implementar interface do totem (tablet) com 3 botões
- [ ] Integrar driver Epson TM-T20X para impressão
- [ ] Criar sistema de filas no Firebase (Geral, Prioritário, Retirada)
- [ ] Desenvolver interface simples do atendente (Chamar/Rechamar)
- [ ] Implementar painel de exibição básico com layout split-screen
- [ ] Área de senhas (70%) funcionando

### Fase 2: Melhorias e Mídia

- [ ] Adicionar efeitos sonoros de chamada
- [ ] Implementar lógica de prioridade automática
- [ ] **Área de propaganda (30%)** - Player de vídeo
- [ ] **Carrossel de imagens** para avisos/promoções
- [ ] **Embed de canal de TV** ao vivo (opcional)
- [ ] Layout avançado do painel (estilo cartório)
- [ ] Sistema de autenticação para atendentes
- [ ] Painel administrativo (relatórios, configurações)

### Fase 3: Recursos Avançados de Mídia

- [ ] **Sistema de gerenciamento de conteúdo** (upload vídeos/imagens)
- [ ] **Agendamento de conteúdo** (horários específicos)
- [ ] **Relógio e clima** na área de propaganda
- [ ] Estatísticas em tempo real
- [ ] Impressão com QR Code no ticket
- [ ] Notificações push para clientes (opcional)
- [ ] Modo offline com sincronização
- [ ] Multi-idioma (PT/EN/ES)
- [ ] **Modo tela cheia** (desativa propaganda quando necessário)

## � Configuração da Impressora Epson TM-T20X

### Conexão

- **USB**: Plug and play (recomendado para estabilidade)
- **Ethernet**: Configurar IP fixo na rede
- **Bluetooth**: Pareamento com tablet (wireless)

### Driver

```bash
npm install node-thermal-printer
```

### Exemplo de Código

Use o serviço wrapper que já está integrado:

```typescript
import { printTicket, getPrinterStatus } from './services/printer';

// Simplesmente chame:
const success = await printTicket({
  category: 'Atendimento Geral',
  number: '001',
  timestamp: new Date()
});

console.log(`Status: ${getPrinterStatus()}`);
```

**Configuração do IP**: Edite o arquivo `.env`:
```env
VITE_PRINTER_INTERFACE=tcp://192.168.3.38
```

## 📝 Notas Finais

- Projeto em desenvolvimento
- Sistema otimizado para tablets e impressoras térmicas
- **TV 40"** com layout split-screen (senhas + propaganda/canal)
- **Layout responsivo**: 70% senhas | 30% conteúdo de mídia
- Firebase garante sincronização em tempo real
- Interface simples focada em usabilidade
- Design inspirado em painéis de cartórios modernos
- **Área de propaganda configurável**: vídeos, canal TV, imagens
- Possibilidade de monetização com propagandas
- Modo tela cheia disponível quando necessário

## 📄 Licença

MIT
