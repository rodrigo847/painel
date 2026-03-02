#!/usr/bin/env node

/**
 * Script de Teste da Impressora Epson TM-T20X
 * Testa conexão e impressão via Ethernet
 * 
 * Uso: npm run test:printer
 */

import { ThermalPrinter, PrinterTypes } from 'node-thermal-printer';

// Configuração do IP
const PRINTER_IP = process.env.VITE_PRINTER_INTERFACE || 'tcp://192.168.3.38';
const PRINTER_PORT = 9100; // Porta padrão Epson

console.log('\n🖨️  === TESTE DE IMPRESSORA EPSON TM-T20X ===\n');

async function testPrinter() {
  try {
    console.log(`📍 Conectando em: ${PRINTER_IP}:${PRINTER_PORT}`);
    console.log('⏳ Aguarde...\n');

    // Criar instância da impressora
    const printerConfig = {
      type: PrinterTypes.EPSON,
      interface: PRINTER_IP,
      options: {
        timeout: 5000, // 5 segundos de timeout
        reconnectOnTimeout: true,
      },
    };

    // Adicionar charset se estiver especificado no .env
    if (process.env.VITE_PRINTER_CHARSET) {
      printerConfig.characterSet = process.env.VITE_PRINTER_CHARSET;
    }

    const printer = new ThermalPrinter(printerConfig);

    // Testar conexão
    const isConnected = printer.isPrinterConnected();
    console.log(`🔌 Status de Conexão: ${isConnected ? '✅ Conectada' : '❌ Desconectada'}\n`);

    if (!isConnected) {
      console.error('❌ Impressora não conectada!');
      console.log('\n📋 Checklist:');
      console.log('1. Verifique se a impressora está ligada');
      console.log('2. Verifique o IP: ping 192.168.3.38');
      console.log('3. Verifique se está na mesma rede');
      console.log('4. Tente reiniciar a impressora');
      process.exit(1);
    }

    // Limpar buffer
    printer.clear();

    // Imprimir teste
    console.log('📄 Imprimindo ticket de teste...\n');

    printer.alignCenter();
    printer.setTextSize(1, 1);
    printer.println('TESTE DE IMPRESSORA');
    printer.newLine();

    printer.alignCenter();
    printer.setTextSize(2, 2);
    printer.println('FUNCIONANDO');

    printer.newLine();
    printer.alignCenter();
    printer.setTextSize(1, 1);
    printer.println('Epson TM-T20X');
    printer.println(`IP: 192.168.3.38`);
    printer.println(`Data: ${new Date().toLocaleString('pt-BR')}`);

    printer.newLine();
    printer.alignCenter();
    printer.println('='.repeat(48));
    printer.println('Sistema: Painel de Senhas');
    printer.println('Versao: 1.0.0');
    printer.println('='.repeat(48));

    printer.newLine();
    printer.alignCenter();
    printer.setTextSize(0, 0);
    printer.println('Teste realizado com sucesso!');
    printer.println('A impressora esta pronta para uso.');

    // Corte
    printer.newLine(2);
    printer.cut();

    // Executar
    await printer.execute();

    console.log('✅ Ticket impresso com sucesso!\n');
    console.log('✨ A impressora está funcionando corretamente.\n');

  } catch (error) {
    console.error('\n❌ ERRO ao testar impressora:\n');
    console.error(`Tipo: ${error.code || error.name}`);
    console.error(`Mensagem: ${error.message}\n`);

    console.log('📋 Possíveis soluções:\n');

    if (error.code === 'ECONNREFUSED') {
      console.log('🔴 Conexão recusada');
      console.log('   → Verifique se o IP está correto: 192.168.3.38');
      console.log('   → Verifique se a porta 9100 está aberta');
      console.log('   → Tente: ping 192.168.3.38\n');
    } else if (error.code === 'ENOTFOUND') {
      console.log('🔴 Host não encontrado');
      console.log('   → Verifique a conectividade de rede');
      console.log('   → Verifique o IP da impressora: 192.168.3.38\n');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('🔴 Timeout de conexão');
      console.log('   → A impressora não respondeu em 5 segundos');
      console.log('   → Verifique se a impressora está ligada\n');
    }

    console.log('📞 Configure a impressora:');
    console.log('   1. Edite o arquivo .env');
    console.log('   2. Altere: VITE_PRINTER_INTERFACE=tcp://IP_CORRETO');
    console.log('   3. Salve e reinicie\n');

    process.exit(1);
  }
}

// Executar teste
testPrinter();
