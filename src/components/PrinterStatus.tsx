import { usePrinter } from '../hooks/usePrinter'

/**
 * Componente que exibe o status da impressora
 * Mostra visualmente se está conectada ou não
 */
function PrinterStatus() {
  const { isConnected, status, error, reconnect, isLoading } = usePrinter()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={`px-4 py-3 rounded-lg flex items-center gap-3 font-semibold text-sm transition-all ${
          isConnected
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
        } shadow-lg`}
      >
        {/* Ícone com animação */}
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-white animate-pulse' : 'bg-red-300'
          }`}
        />

        {/* Informações */}
        <div className="flex flex-col">
          <span className="font-semibold">
            🖨️ {status}
          </span>
          {error && (
            <span className="text-xs opacity-90">{error}</span>
          )}
        </div>

        {/* Botão de reconexão */}
        {!isConnected && (
          <button
            onClick={reconnect}
            disabled={isLoading}
            className={`ml-2 px-3 py-1 rounded text-xs font-bold transition-all ${
              isLoading
                ? 'bg-red-800 opacity-50 cursor-not-allowed'
                : 'bg-red-800 hover:bg-red-900 active:scale-95'
            }`}
            title="Tentar reconectar"
          >
            {isLoading ? '⏳' : '🔄'}
          </button>
        )}
      </div>
    </div>
  )
}

export default PrinterStatus
