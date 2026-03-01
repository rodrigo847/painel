import { useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import CounterCard from './CounterCard.tsx'
import CounterDetail from './CounterDetail.tsx'

function AttendantLayout() {
  const { counters, setCounterAvailability, callTicketToCounter, finishServiceAtCounter, callHistory } = useAppContext()
  const [selectedCounterId, setSelectedCounterId] = useState<number>(1)

  const selectedCounter = counters.find(c => c.id === selectedCounterId)

  const handleToggleAvailability = () => {
    if (selectedCounter) {
      setCounterAvailability(selectedCounterId, !selectedCounter.isAvailable)
    }
  }

  const handleCallNext = () => {
    if (selectedCounter && selectedCounter.isAvailable) {
      const types: Array<'G' | 'P' | 'R'> = ['G', 'P', 'R']
      const randomType = types[Math.floor(Math.random() * types.length)]
      const randomNumber = Math.floor(Math.random() * 1000)
      
      const newTicket = {
        number: randomNumber,
        type: randomType,
        id: `${randomType}-${String(randomNumber).padStart(3, '0')}`,
        category: randomType as 'G' | 'P' | 'R',
        counter: selectedCounterId,
        timestamp: new Date()
      }
      
      callTicketToCounter(selectedCounterId, newTicket)
    }
  }

  const handleFinishService = () => {
    if (selectedCounter?.currentTicket) {
      finishServiceAtCounter(selectedCounterId)
    }
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-4 h-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-3">Gerenciador de Guichês</h1>
          
          {/* Status do Guichê Selecionado */}
          {selectedCounter && (
            <div className="flex items-center gap-4 bg-gray-800 rounded-lg p-4 border-2 border-gray-700">
              <div>
                <span className="text-gray-400 text-sm">Guichê Selecionado:</span>
                <div className="text-3xl font-bold text-blue-400">{String(selectedCounter.id).padStart(2, '0')}</div>
              </div>
              <div className="ml-auto">
                <button
                  onClick={handleToggleAvailability}
                  className={`px-4 py-2 rounded-lg font-bold transition-colors text-sm ${
                    selectedCounter.isAvailable
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {selectedCounter.isAvailable ? '🟢 Disponível' : '🔴 Pausado'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-4 gap-4 min-h-0">
          {/* Lista de Guichês */}
          <div className="col-span-1 flex flex-col gap-2 overflow-y-auto">
            {counters.map(counter => (
              <CounterCard
                key={counter.id}
                counter={counter}
                isSelected={selectedCounterId === counter.id}
                onClick={() => setSelectedCounterId(counter.id)}
              />
            ))}
          </div>

          {/* Detalhe do Guichê */}
          <div className="col-span-2">
            {selectedCounter && (
              <CounterDetail
                counter={selectedCounter}
                onCallNext={handleCallNext}
                onFinish={handleFinishService}
              />
            )}
          </div>

          {/* Histórico */}
          <div className="bg-gray-800 rounded-xl p-4 border-2 border-gray-700 flex flex-col min-h-0">
            <h3 className="text-lg font-bold mb-3">📋 Atendidos</h3>
            <div className="space-y-2 flex-1 overflow-y-auto">
              {callHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-6">
                  <p className="text-sm">Nenhum atendimento</p>
                </div>
              ) : (
                callHistory.slice(0, 10).map((ticket, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 rounded-lg p-3 border border-gray-600 hover:border-gray-500 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-lg">{ticket.id}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        ticket.category === 'P'
                          ? 'bg-red-900 text-red-300'
                          : ticket.category === 'G'
                          ? 'bg-blue-900 text-blue-300'
                          : 'bg-green-900 text-green-300'
                      }`}>
                        {ticket.category === 'P' ? 'Prioritário' : ticket.category === 'G' ? 'Geral' : 'Retirada'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      Guichê {ticket.counter}
                    </div>
                    {ticket.finishedAt && (
                      <div className="text-xs text-gray-500 font-mono">
                        {ticket.finishedAt.toLocaleTimeString('pt-BR')}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendantLayout
