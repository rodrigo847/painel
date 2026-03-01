import { CounterState } from '../../context/AppContext'

interface CounterDetailProps {
  counter: CounterState
  onCallNext: () => void
  onFinish: () => void
}

function CounterDetail({ counter, onCallNext, onFinish }: CounterDetailProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'P':
        return 'border-red-400 text-red-400'
      case 'G':
        return 'border-blue-400 text-blue-400'
      case 'R':
        return 'border-green-400 text-green-400'
      default:
        return 'border-gray-400 text-gray-400'
    }
  }

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'P':
        return '⭐'
      case 'G':
        return '👤'
      case 'R':
        return '📋'
      default:
        return '📝'
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 h-full border-2 border-gray-700 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Atendimento Atual</h2>
      
      {!counter.currentTicket ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-3">⏳</div>
            <h3 className="text-xl text-gray-400">Nenhum atendimento</h3>
            <p className="text-gray-500 mt-2 text-sm">Clique em "Chamar Próxima"</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* Senha */}
          <div className={`border-4 rounded-2xl px-8 py-6 mb-4 ${getCategoryColor(counter.currentTicket.category)}`}>
            <div className="text-center">
              <div className="text-4xl mb-2">{getCategoryEmoji(counter.currentTicket.category)}</div>
              <div className="text-6xl font-black tracking-wider text-white">{counter.currentTicket.id}</div>
            </div>
          </div>

          {/* Info */}
          <div className="text-center mb-4">
            <div className="text-gray-400 mb-1 text-sm">Guichê</div>
            <div className="text-4xl font-black text-blue-400">{String(counter.id).padStart(2, '0')}</div>
          </div>

          {/* Tempo */}
          {counter.currentTicket.timestamp && (
            <div className="text-center text-gray-400">
              <div className="text-xs">Chamado às</div>
              <div className="text-base font-mono">
                {counter.currentTicket.timestamp.toLocaleTimeString('pt-BR')}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={onCallNext}
          disabled={!counter.isAvailable || counter.currentTicket !== null}
          className={`px-4 py-3 rounded-lg font-bold text-base transition-colors border-2 ${
            !counter.isAvailable || counter.currentTicket
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-600'
              : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-500'
          }`}
        >
          📢 Chamar
        </button>
        <button
          onClick={onFinish}
          disabled={!counter.currentTicket}
          className={`px-4 py-3 rounded-lg font-bold text-base transition-colors border-2 ${
            !counter.currentTicket
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed border-gray-600'
              : 'bg-green-600 hover:bg-green-700 text-white border-green-500'
          }`}
        >
          ✅ Finalizar
        </button>
      </div>
    </div>
  )
}

export default CounterDetail
