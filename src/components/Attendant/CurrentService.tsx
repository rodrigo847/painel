interface Ticket {
  number: string
  type: string
  calledAt?: Date
}

interface CurrentServiceProps {
  ticket: Ticket | null
  position: string
  onFinish: () => void
  onCancel: () => void
}

function CurrentService({ ticket, position, onFinish, onCancel }: CurrentServiceProps) {
  if (!ticket) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 h-full border-2 border-gray-700 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-3">⌛</div>
          <h3 className="text-xl text-gray-400">Nenhum atendimento em andamento</h3>
          <p className="text-gray-500 mt-2 text-sm">Clique em "Chamar Próxima" para iniciar</p>
        </div>
      </div>
    )
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'prioritário':
        return 'text-yellow-400 border-yellow-400'
      case 'normal':
        return 'text-blue-400 border-blue-400'
      default:
        return 'text-green-400 border-green-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'prioritário':
        return '⭐'
      case 'normal':
        return '👤'
      default:
        return '📋'
    }
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 h-full border-2 border-gray-700 flex flex-col">
      <h2 className="text-xl font-bold mb-4">Atendimento Atual</h2>
      
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        {/* Senha */}
        <div className={`border-4 rounded-2xl px-8 py-4 mb-4 ${getTypeColor(ticket.type)}`}>
          <div className="text-center">
            <div className="text-4xl mb-1">{getTypeIcon(ticket.type)}</div>
            <div className="text-xs uppercase font-bold mb-1 opacity-80">{ticket.type}</div>
            <div className="text-6xl font-black tracking-wider">{ticket.number}</div>
          </div>
        </div>

        {/* Info */}
        <div className="text-center mb-4">
          <div className="text-gray-400 mb-1 text-sm">Guichê</div>
          <div className="text-4xl font-black text-blue-400">{position}</div>
        </div>

        {/* Tempo */}
        {ticket.calledAt && (
          <div className="text-center text-gray-400">
            <div className="text-xs">Chamado às</div>
            <div className="text-base font-mono">
              {ticket.calledAt.toLocaleTimeString('pt-BR')}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mt-4">
        <button
          onClick={onCancel}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg font-bold text-base transition-colors border-2 border-gray-600"
        >
          ❌ Cancelar
        </button>
        <button
          onClick={onFinish}
          className="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg font-bold text-base transition-colors border-2 border-green-500"
        >
          ✅ Finalizar
        </button>
      </div>
    </div>
  )
}

export default CurrentService
