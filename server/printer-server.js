/**
 * Servidor de Impressão Térmica
 * API para gerenciar impressora Epson TM-T20X
 */

import express from 'express';
import cors from 'cors';
import { ThermalPrinter, PrinterTypes } from 'node-thermal-printer';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PRINTER_SERVER_PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração da impressora
let printer = null;
let isConnected = false;

/**
 * Inicializa a conexão com a impressora
 */
async function initPrinter() {
  try {
    const printerInterface = process.env.VITE_PRINTER_INTERFACE || 'tcp://192.168.3.38';
    const printerType = process.env.VITE_PRINTER_TYPE || 'EPSON';
    
    // Determinar tipo de interface
    let type, options;
    
    if (printerInterface.startsWith('tcp://')) {
      // Conexão via rede TCP/IP
      const ip = printerInterface.replace('tcp://', '');
      type = 'tcp';
      options = {
        host: ip,
        port: 9100, // Porta padrão para impressoras de rede
      };
    } else if (printerInterface === 'windows') {
      // Conexão via impressora Windows
      type = 'windows';
      options = {
        printerName: 'TM-T20X', // Nome da impressora no Windows
      };
    } else {
      throw new Error(`Interface não suportada: ${printerInterface}`);
    }

    printer = new ThermalPrinter({
      type: printerType === 'EPSON' ? PrinterTypes.EPSON : PrinterTypes.STAR,
      interface: `${type}://${options.host || options.printerName}`,
      options: options,
      width: parseInt(process.env.VITE_PRINTER_WIDTH || '48'),
      characterSet: 'PC860_PORTUGUESE',
      removeSpecialCharacters: false,
      lineCharacter: '=',
    });

    // Testar conexão
    const statusTest = await printer.isPrinterConnected();
    isConnected = statusTest;
    
    if (isConnected) {
      console.log('✅ Impressora conectada com sucesso!');
      console.log(`📡 Interface: ${printerInterface}`);
      console.log(`🖨️ Tipo: ${printerType}`);
    } else {
      console.warn('⚠️ Impressora não detectada. Verifique a conexão.');
    }
    
    return isConnected;
  } catch (error) {
    console.error('❌ Erro ao conectar impressora:', error.message);
    isConnected = false;
    return false;
  }
}

// Inicializar impressora ao subir o servidor
initPrinter();

/**
 * Endpoint: GET /status
 * Retorna o status da impressora
 */
app.get('/status', async (req, res) => {
  try {
    if (!printer) {
      return res.json({
        connected: false,
        status: 'Impressora não inicializada',
        message: 'Execute /reconnect para tentar conectar'
      });
    }

    const connected = await printer.isPrinterConnected();
    isConnected = connected;

    res.json({
      connected: isConnected,
      status: isConnected ? 'Conectada' : 'Desconectada',
      interface: process.env.VITE_PRINTER_INTERFACE,
      type: process.env.VITE_PRINTER_TYPE
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      status: 'Erro ao verificar status',
      error: error.message
    });
  }
});

/**
 * Endpoint: POST /reconnect
 * Tenta reconectar à impressora
 */
app.post('/reconnect', async (req, res) => {
  try {
    const connected = await initPrinter();
    res.json({
      success: connected,
      message: connected ? 'Impressora reconectada' : 'Falha ao conectar impressora'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Endpoint: POST /print
 * Imprime um ticket de senha
 * Body: { category, number, timestamp, guiche? }
 */
app.post('/print', async (req, res) => {
  try {
    const { category, number, timestamp, guiche } = req.body;

    if (!category || !number) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: category, number'
      });
    }

    // Verificar se impressora está conectada
    if (!printer) {
      await initPrinter();
    }

    if (!isConnected && printer) {
      const connected = await printer.isPrinterConnected();
      isConnected = connected;
    }

    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Impressora não conectada',
        message: 'Verifique a conexão com a impressora'
      });
    }

    // Preparar dados do ticket
    const date = timestamp ? new Date(timestamp) : new Date();
    const timeString = date.toLocaleTimeString('pt-BR');
    const dateString = date.toLocaleDateString('pt-BR');

    // Limpar buffer da impressora
    printer.clear();

    // Cabeçalho
    printer.alignCenter();
    printer.setTypeFontB();
    printer.println('================================');
    printer.setTextSize(1, 1);
    printer.bold(true);
    printer.println('SENHA DE ATENDIMENTO');
    printer.bold(false);
    printer.setTextNormal();
    printer.println('================================');
    printer.newLine();

    // Categoria e Número (Grande)
    printer.setTextSize(2, 2);
    printer.bold(true);
    printer.println(category === 'Atendimento Geral' ? 'GERAL' : 
                   category === 'Prioritário' ? 'PRIORITARIO' : 'RETIRADA');
    printer.newLine();
    
    printer.setTextSize(3, 3);
    printer.println(String(number).padStart(3, '0'));
    printer.bold(false);
    printer.setTextNormal();
    printer.newLine();

    // Informações
    printer.alignCenter();
    printer.setTypeFontB();
    printer.println(`Data: ${dateString}`);
    printer.println(`Hora: ${timeString}`);
    
    if (guiche) {
      printer.newLine();
      printer.bold(true);
      printer.println(`GUICHE: ${String(guiche).padStart(2, '0')}`);
      printer.bold(false);
    }

    printer.newLine();
    printer.println('================================');
    printer.drawLine();
    printer.newLine();
    
    printer.alignCenter();
    printer.println('Aguarde sua chamada!');
    printer.println('Fique atento ao painel');
    printer.newLine();
    printer.println('Obrigado pela preferencia');
    
    printer.newLine();
    printer.newLine();
    printer.newLine();

    // Corte parcial do papel
    printer.partialCut();

    // Executar impressão
    await printer.execute();
    
    console.log(`✅ Ticket impresso: ${category} - ${number}`);

    res.json({
      success: true,
      message: 'Ticket impresso com sucesso',
      data: {
        category,
        number,
        timestamp: date.toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Erro ao imprimir:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Endpoint: POST /test
 * Imprime um ticket de teste
 */
app.post('/test', async (req, res) => {
  try {
    if (!printer) {
      await initPrinter();
    }

    if (!isConnected) {
      return res.status(503).json({
        success: false,
        error: 'Impressora não conectada'
      });
    }

    printer.clear();
    printer.alignCenter();
    printer.setTextSize(1, 1);
    printer.bold(true);
    printer.println('TESTE DE IMPRESSORA');
    printer.bold(false);
    printer.newLine();
    printer.println('Sistema de Fila');
    printer.println('Painel de Senhas');
    printer.newLine();
    printer.println(new Date().toLocaleString('pt-BR'));
    printer.newLine();
    printer.println('Impressora funcionando!');
    printer.newLine();
    printer.newLine();
    printer.partialCut();

    await printer.execute();

    console.log('✅ Teste de impressão realizado');

    res.json({
      success: true,
      message: 'Teste de impressão executado'
    });
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🖨️  SERVIDOR DE IMPRESSÃO INICIADO');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 Servidor rodando na porta: ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📋 Endpoints disponíveis:');
  console.log(`   GET  /status - Status da impressora`);
  console.log(`   POST /print - Imprimir ticket`);
  console.log(`   POST /test - Teste de impressão`);
  console.log(`   POST /reconnect - Reconectar impressora`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});

// Tratamento de erros
process.on('uncaughtException', (error) => {
  console.error('❌ Erro não tratado:', error);
});

process.on('SIGINT', () => {
  console.log('\n👋 Encerrando servidor de impressão...');
  process.exit(0);
});
