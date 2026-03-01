import { useState } from 'react'
import AttendantPanel from './AttendantPanel'
import CurrentService from './CurrentService'

interface Ticket {
  number: string
  type: string
  calledAt?: Date
  finishedAt?: Date
}

function AttendantLayout() {
  const [position, setPosition] = useState<string>('01')
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)
  const [isAvailable, setIsAvailable] = useState(true)
  const [attendedTickets, setAttendedTickets] = useState<Ticket[]>([])

  const handleCallNext = () => {
    // Simular chamada de próxima senha
    const types = ['Normal', 'Prioritário', 'Atendimento']
    const randomType = types[Math.floor(Math.random() * types.length)]
    const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    
    const newTicket: Ticket = {
      number: randomNumber,
      type: randomType,
      calledAt: new Date()
    }
    
    setCurrentTicket(newTicket)
    setIsAvailable(false)
  }

  const handleFinishService = () => {
    if (currentTicket) {
      const finishedTicket = {
        ...currentTicket,
        finishedAt: new Date()
      }
      setAttendedTickets([finishedTicket, ...attendedTickets.slice(0, 4)])
      setCurrentTicket(null)
      setIsAvailable(true)
    }
  }

  const handleCancelService = () => {
    setCurrentTicket(null)
    setIsAvailable(true)
  }

  const handleToggleAvailability = () => {
    setIsAvailable(!isAvailable)
    if (isAvailable) {
      setCurrentTicket(null)
    }
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      <div className="container mx-auto px-4 py-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Painel do Atendente</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Guichê:</span>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="bg-gray-700 px-3 py-1 rounded-lg font-bold text-lg border-2 border-gray-600 focus:border-blue-500 focus:outline-none"
                >
                  {Array.from({ length: 10 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">Status:</span>
                <button
                  onClick={handleToggleAvailability}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors text-sm ${
                    isAvailable
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {isAvailable ? '🟢 Disponível' : '🔴 Pausado'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-3 gap-4 min-h-0">
          {/* Current Service */}
          <div className="col-span-2">
            <CurrentService
              ticket={currentTicket}
              position={position}
              onFinish={handleFinishService}
              onCancel={handleCancelService}
            />
          </div>

          {/* Control Panel */}
          <div>
            <AttendantPanel
              isAvailable={isAvailable}
              hasCurrentTicket={currentTicket !== null}
              onCallNext={handleCallNext}
              attendedTickets={attendedTickets}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendantLayout
