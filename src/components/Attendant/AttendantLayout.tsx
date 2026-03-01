import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { getActiveTickets, updateTicketStatus, deleteTicket } from '../../services/firebaseService'
import CounterCard from './CounterCard.tsx'
import CounterDetail from './CounterDetail.tsx'

type ServiceType = 'G' | 'P' | 'R'

function AttendantLayout() {
  const { counters, setCounterAvailability, callTicketToCounter, finishServiceAtCounter, callHistory } = useAppContext()
  const [selectedCounterId, setSelectedCounterId] = useState<number>(1)
  const [selectedServiceType, setSelectedServiceType] = useState<ServiceType>('G')
  const [waitingQueues, setWaitingQueues] = useState<{ G: number; P: number; R: number }>({ G: 0, P: 0, R: 0 })

  // Buscar fila de espera em tempo real
  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const activeTickets = await getActiveTickets()
        const queues = { G: 0, P: 0, R: 0 }
        
        activeTickets.forEach(ticket => {
          if (ticket.status === 'waiting') {
            queues[ticket.category]++
          }
        })
        
        setWaitingQueues(queues)
      } catch (error) {
        console.error('Erro ao buscar filas:', error)
      }
    }

    fetchQueues()
    // Buscar a cada 2 segundos
    const interval = setInterval(fetchQueues, 2000)
    return () => clearInterval(interval)
  }, [])

  const selectedCounter = counters.find(c => c.id === selectedCounterId)

  const handleCallNext = async () => {
    if (!selectedCounter || !selectedCounter.isAvailable || selectedCounter.currentTicket) {
      return
    }

    // Apenas guichê 5 pode chamar Retirada
    if (selectedServiceType === 'R' && selectedCounterId !== 5) {
      alert('Apenas o Guichê 5 pode chamar senhas de Retirada')
      return
    }

    try {
      // Buscar tickets em espera do tipo escolhido
      const activeTickets = await getActiveTickets()
      
      const waitingTickets = activeTickets.filter(
        t => t.status === 'waiting' && t.category === selectedServiceType
      )

      if (waitingTickets.length === 0) {
        alert('Não há senhas em espera para este tipo de atendimento')
        return
      }

      // Pegar o primeiro da fila (mais antigo)
      const nextTicket = waitingTickets.sort((a, b) => 
        a.issuedAt.getTime() - b.issuedAt.getTime()
      )[0]

      // Atualizar no Firebase
      await updateTicketStatus(nextTicket.id!, 'called', {
        counter: selectedCounterId,
        calledAt: new Date()
      })

      // Atualizar no AppContext
      const ticket = {
        id: nextTicket.ticketId,
        category: nextTicket.category,
        number: nextTicket.number,
        counter: selectedCounterId,
        timestamp: new Date()
      }
      callTicketToCounter(selectedCounterId, ticket)
      
    } catch (error) {
      console.error('Erro ao chamar próxima senha:', error)
      alert('Erro ao chamar próxima senha')
    }
  }

  const handleToggleAvailability = () => {
    if (selectedCounter) {
      setCounterAvailability(selectedCounterId, !selectedCounter.isAvailable)
    }
  }

  const handleFinishService = async () => {
    if (!selectedCounter?.currentTicket) {
      return
    }

    try {
      // Buscar o ticket no Firebase pelo ticketId para pegar o documento ID
      const activeTickets = await getActiveTickets()
      const firebaseTicket = activeTickets.find(
        t => t.ticketId === selectedCounter.currentTicket!.id
      )

      if (firebaseTicket && firebaseTicket.id) {
        // Deletar do Firebase
        await deleteTicket(firebaseTicket.id)
      }

      // Atualizar estado local
      finishServiceAtCounter(selectedCounterId)
      
    } catch (error) {
      console.error('Erro ao finalizar atendimento:', error)
      // Mesmo com erro, finaliza localmente
      finishServiceAtCounter(selectedCounterId)
    }
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-4 h-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-3">Gerenciador de Guichês</h1>
          
          {/* Fila de Espera */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {/* Geral */}
            <div className="bg-blue-900 rounded-lg p-3 border-2 border-blue-600">
              <div className="text-sm text-blue-300 mb-1">👤 Geral</div>
              <div className="text-3xl font-bold text-white">{waitingQueues.G}</div>
              <div className="text-xs text-blue-400">em espera</div>
            </div>
            
            {/* Prioritário */}
            <div className="bg-red-900 rounded-lg p-3 border-2 border-red-600">
              <div className="text-sm text-red-300 mb-1">⭐ Prioritário</div>
              <div className="text-3xl font-bold text-white">{waitingQueues.P}</div>
              <div className="text-xs text-red-400">em espera</div>
            </div>
            
            {/* Retirada */}
            <div className="bg-green-900 rounded-lg p-3 border-2 border-green-600">
              <div className="text-sm text-green-300 mb-1">📋 Retirada</div>
              <div className="text-3xl font-bold text-white">{waitingQueues.R}</div>
              <div className="text-xs text-green-400">em espera</div>
            </div>
          </div>
          
          {/* Status do Guichê Selecionado */}
          {selectedCounter && (
            <div className="bg-gray-800 rounded-lg p-4 border-2 border-gray-700 mb-4">
              <div className="flex items-center gap-4 mb-4">
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

              {/* Seletor de Tipo de Atendimento */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedServiceType('G')}
                  className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                    selectedServiceType === 'G'
                      ? 'bg-blue-600 text-white border-2 border-blue-400'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-gray-600'
                  }`}
                >
                  👤 Geral
                </button>
                <button
                  onClick={() => setSelectedServiceType('P')}
                  className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                    selectedServiceType === 'P'
                      ? 'bg-red-600 text-white border-2 border-red-400'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-gray-600'
                  }`}
                >
                  ⭐ Prioritário
                </button>
                <button
                  onClick={() => {
                    if (selectedCounterId === 5) {
                      setSelectedServiceType('R')
                    } else {
                      alert('Apenas Guichê 5 pode atender Retirada')
                    }
                  }}
                  disabled={selectedCounterId !== 5}
                  className={`flex-1 py-2 rounded-lg font-bold transition-colors ${
                    selectedCounterId !== 5
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed border-2 border-gray-600'
                      : selectedServiceType === 'R'
                      ? 'bg-green-600 text-white border-2 border-green-400'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-gray-600'
                  }`}
                >
                  📋 Retirada
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
