import { useState, useEffect } from 'react'
import CurrentTicket from './CurrentTicket.tsx'
import RecentTickets from './RecentTickets.tsx'
import QueueCounter from './QueueCounter.tsx'
import MediaPanel from './MediaPanel.tsx'

interface Ticket {
  id: string
  category: 'G' | 'P' | 'R'
  number: number
  counter: number
  timestamp: Date
}

export default function DisplayLayout() {
  const [currentTicket, setCurrentTicket] = useState<Ticket>({
    id: 'P-015',
    category: 'P',
    number: 15,
    counter: 3,
    timestamp: new Date(),
  })

  const [recentTickets, setRecentTickets] = useState<Ticket[]>([
    { id: 'G-014', category: 'G', number: 14, counter: 1, timestamp: new Date(Date.now() - 30000) },
    { id: 'R-003', category: 'R', number: 3, counter: 7, timestamp: new Date(Date.now() - 60000) },
    { id: 'P-014', category: 'P', number: 14, counter: 5, timestamp: new Date(Date.now() - 90000) },
  ])

  const [queues] = useState({
    geral: 5,
    prioritario: 2,
    retirada: 1,
  })

  // Simulação de chamada de senha a cada 15 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const categories: Array<'G' | 'P' | 'R'> = ['G', 'P', 'R']
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      const randomNumber = Math.floor(Math.random() * 100) + 1
      const randomCounter = Math.floor(Math.random() * 7) + 1

      const newTicket: Ticket = {
        id: `${randomCategory}-${String(randomNumber).padStart(3, '0')}`,
        category: randomCategory,
        number: randomNumber,
        counter: randomCounter,
        timestamp: new Date(),
      }

      setCurrentTicket(newTicket)
      setRecentTickets(prev => [newTicket, ...prev.slice(0, 3)])
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="display-container">
      {/* Área de Senhas - 70% */}
      <div className="ticket-panel">
        <CurrentTicket ticket={currentTicket} />
        <RecentTickets tickets={recentTickets} />
        <QueueCounter queues={queues} />
      </div>

      {/* Área de Propaganda - 30% */}
      <div className="media-panel">
        <MediaPanel />
      </div>
    </div>
  )
}
