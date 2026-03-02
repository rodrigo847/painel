import { useEffect, useState } from 'react'
import { connectPrinter, disconnectPrinter, getPrinterStatus, getPrinter } from '../services/printer'
import type { PrinterConfig } from '../services/printer'

/**
 * Hook para gerenciar impressora térmica
 * Conecta automaticamente ao montar o componente com configuração do .env
 */
export function usePrinter(config?: PrinterConfig) {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('Desconectada')

  // Usar configuração do .env se não passar config específica
  const printerConfig = config || {
    interface: import.meta.env.VITE_PRINTER_INTERFACE,
    type: import.meta.env.VITE_PRINTER_TYPE,
  }

  // Conectar ao montar
  useEffect(() => {
    const initializePrinter = async () => {
      setIsLoading(true)
      try {
        const connected = await connectPrinter(printerConfig)
        setIsConnected(connected)
        setStatus(getPrinterStatus())
        
        if (!connected) {
          console.warn('Advertência: Impressora não conectada')
          setError('Impressora não detectada')
        } else {
          setError(null)
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao conectar'
        setError(message)
        console.error('Erro ao inicializar impressora:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initializePrinter()

    // Desconectar ao desmontar
    return () => {
      disconnectPrinter()
    }
  }, [printerConfig])

  // Reconectar manualmente
  const reconnect = async () => {
    setIsLoading(true)
    try {
      const connected = await connectPrinter(printerConfig)
      setIsConnected(connected)
      setStatus(getPrinterStatus())
      
      if (connected) {
        setError(null)
      }
      return connected
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao reconectar'
      setError(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Obter instância da impressora
  const getPrinterInstance = () => {
    return getPrinter(printerConfig)
  }

  return {
    isConnected,
    isLoading,
    error,
    status,
    reconnect,
    getPrinterInstance
  }
}

export default usePrinter
