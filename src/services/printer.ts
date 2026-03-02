/**
 * Serviço de Impressora Térmica Epson TM-T20X
 * Gerencia a comunicação e impressão de tickets
 */

/// <reference types="vite/client" />

// Tipo para configuração da impressora
interface PrinterConfig {
  interface?: string; // 'tcp://192.168.3.38' ou 'windows' para Windows
  type?: string;
  width?: number;
  characterSet?: string;
}

// Tipo para dados do ticket
interface TicketData {
  category: string;
  number: string;
  timestamp?: Date;
  guiche?: number;
}

class EpsonPrinter {
  private printerConfig: PrinterConfig;
  private isConnected: boolean = false;

  constructor(config: PrinterConfig = {}) {
    // Usar variáveis de ambiente como padrão, com fallback para valores locais
    this.printerConfig = {
      interface: config.interface || import.meta.env.VITE_PRINTER_INTERFACE || 'windows',
      type: config.type || import.meta.env.VITE_PRINTER_TYPE || 'EPSON',
      width: config.width || parseInt(import.meta.env.VITE_PRINTER_WIDTH || '80'),
      characterSet: config.characterSet || import.meta.env.VITE_PRINTER_CHARSET || 'CP1252',
    };
  }

  /**
   * Conecta à impressora
   */
  async connect(): Promise<boolean> {
    try {
      console.log('Conectando à impressora Epson TM-T20X...');
      // Implementação da conexão será feita com a biblioteca node-thermal-printer
      this.isConnected = true;
      console.log('Impressora conectada com sucesso!');
      return true;
    } catch (error) {
      console.error('Erro ao conectar impressora:', error);
      this.isConnected = false;
      return false;
    }
  }

  /**
   * Desconecta da impressora
   */
  async disconnect(): Promise<void> {
    try {
      this.isConnected = false;
      console.log('Impressora desconectada');
    } catch (error) {
      console.error('Erro ao desconectar impressora:', error);
    }
  }

  /**
   * Imprime um ticket de senha
   */
  async printTicket(ticket: TicketData): Promise<boolean> {
    if (!this.isConnected) {
      const connected = await this.connect();
      if (!connected) {
        throw new Error('Não foi possível conectar à impressora');
      }
    }

    try {
      console.log('Imprimindo ticket:', ticket);
      
      // Simulação da impressão enquanto não instala a biblioteca
      // Implementação real será feita com node-thermal-printer
      const ticketContent = this.generateTicketContent(ticket);
      
      console.log('Conteúdo do ticket:\n', ticketContent);
      
      // TODO: Chamar printer.execute() com a biblioteca real
      
      // Reproduzir som de impressão
      this.playPrintSound();
      
      return true;
    } catch (error) {
      console.error('Erro ao imprimir ticket:', error);
      return false;
    }
  }

  /**
   * Gera o conteúdo formatado do ticket
   */
  private generateTicketContent(ticket: TicketData): string {
    const date = ticket.timestamp || new Date();
    const timeString = date.toLocaleTimeString('pt-BR');
    const dateString = date.toLocaleDateString('pt-BR');

    let content = '';
    content += '============================\n';
    content += '          SENHA\n';
    content += '============================\n\n';
    content += `Categoria: ${ticket.category}\n`;
    content += `Número: ${ticket.number}\n`;
    content += `Data: ${dateString}\n`;
    content += `Hora: ${timeString}\n`;
    
    if (ticket.guiche) {
      content += `\nGuichê: ${ticket.guiche}\n`;
    }
    
    content += '\n============================\n';
    content += 'Obrigado por aguardar!\n';
    content += '============================\n';

    return content;
  }

  /**
   * Reproduz som de impressão
   */
  private playPrintSound(): void {
    try {
      const audio = new Audio('/sounds/print.mp3');
      audio.play().catch(() => {
        console.log('Som de impressão não disponível');
      });
    } catch (error) {
      console.log('Erro ao reproduzir som:', error);
    }
  }

  /**
   * Obtém status da impressora
   */
  getStatus(): string {
    return this.isConnected ? 'Conectada' : 'Desconectada';
  }

  /**
   * Obtém configuração da impressora
   */
  getConfig(): PrinterConfig {
    return this.printerConfig;
  }

  /**
   * Define interface da impressora (USB, Ethernet, Bluetooth)
   */
  setInterface(interfaceConfig: string): void {
    this.printerConfig.interface = interfaceConfig;
    console.log(`Interface configurada para: ${interfaceConfig}`);
  }
}

// Instância global da impressora
let printerInstance: EpsonPrinter | null = null;

/**
 * Obtém ou cria instância da impressora
 */
export function getPrinter(config?: PrinterConfig): EpsonPrinter {
  if (!printerInstance) {
    printerInstance = new EpsonPrinter(config);
  }
  return printerInstance;
}

/**
 * Imprime um ticket de senha
 */
export async function printTicket(ticket: TicketData): Promise<boolean> {
  try {
    const printer = getPrinter();
    return await printer.printTicket(ticket);
  } catch (error) {
    console.error('Erro ao imprimir ticket:', error);
    return false;
  }
}

/**
 * Retorna status da impressora
 */
export function getPrinterStatus(): string {
  const printer = getPrinter();
  return printer.getStatus();
}

/**
 * Conecta à impressora
 */
export async function connectPrinter(config?: PrinterConfig): Promise<boolean> {
  const printer = getPrinter(config);
  return await printer.connect();
}

/**
 * Desconecta da impressora
 */
export async function disconnectPrinter(): Promise<void> {
  const printer = getPrinter();
  await printer.disconnect();
}

export type { TicketData, PrinterConfig };
export { EpsonPrinter };
