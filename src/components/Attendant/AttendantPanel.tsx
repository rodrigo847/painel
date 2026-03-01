interface Ticket {
  number: string
  type: string
  finishedAt?: Date
}

interface AttendantPanelProps {
  isAvailable: boolean
  hasCurrentTicket: boolean
  onCallNext: () => void
  attendedTickets: Ticket[]
}

function AttendantPanel({ isAvailable, hasCurrentTicket, onCallNext, attendedTickets }: AttendantPanelProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Call Next Button */}
      <div className="bg-gray-800 rounded-xl p-4 border-2 border-gray-700">
        <button
          onClick={onCallNext}
          disabled={!isAvailable || hasCurrentTicket}
          className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
            !isAvailable || hasCurrentTicket
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 active:scale-95'
          }`}
        >
          📢 Chamar Próxima
        </button>
        {!isAvailable && (
          <p className="text-center text-yellow-400 mt-2 text-xs">
            ⚠️ Status pausado - Ative para chamar
          </p>
        )}
        {hasCurrentTicket && isAvailable && (
          <p className="text-center text-yellow-400 mt-2 text-xs">
            ⚠️ Finalize o atendimento atual primeiro
          </p>
        )}
      </div>

      {/* Attended History */}
      <div className="bg-gray-800 rounded-xl p-4 border-2 border-gray-700 flex-1 flex flex-col min-h-0">
        <h3 className="text-lg font-bold mb-3">📋 Últimos Atendidos</h3>
        
        <div className="space-y-2 flex-1 overflow-y-auto">
          {attendedTickets.length === 0 ? (
            <div className="text-center text-gray-500 py-6">
              <div className="text-3xl mb-2">📝</div>
              <p className="text-sm">Nenhum atendimento realizado</p>
            </div>
          ) : (
            attendedTickets.map((ticket, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-colors"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xl">{ticket.number}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    ticket.type === 'Prioritário'
                      ? 'bg-yellow-900 text-yellow-300'
                      : ticket.type === 'Normal'
                      ? 'bg-blue-900 text-blue-300'
                      : 'bg-green-900 text-green-300'
                  }`}>
                    {ticket.type}
                  </span>
                </div>
                {ticket.finishedAt && (
                  <div className="text-xs text-gray-400 font-mono">
                    {ticket.finishedAt.toLocaleTimeString('pt-BR')}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-800 rounded-xl p-4 border-2 border-gray-700">
        <h3 className="text-base font-bold mb-2">📊 Estatísticas</h3>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-400">{attendedTickets.length}</div>
            <div className="text-xs text-gray-400 mt-1">Atendidos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">
              {attendedTickets.filter(t => t.type === 'Prioritário').length}
            </div>
            <div className="text-xs text-gray-400 mt-1">Prioritários</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendantPanel
