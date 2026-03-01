import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { getActiveTickets } from '../../services/firebaseService'
import CurrentTicket from './CurrentTicket.tsx'
import RecentTickets from './RecentTickets.tsx'
import QueueCounter from './QueueCounter.tsx'
import MediaPanel from './MediaPanel.tsx'

export default function DisplayLayout() {
  const { currentTicket, recentTickets } = useAppContext()
  const [queues, setQueues] = useState({
    geral: 0,
    prioritario: 0,
    retirada: 0,
  })

  // Buscar fila de espera em tempo real do Firebase
  useEffect(() => {
    const fetchQueues = async () => {
      try {
        const activeTickets = await getActiveTickets()
        const queueCounts = { geral: 0, prioritario: 0, retirada: 0 }
        
        activeTickets.forEach(ticket => {
          if (ticket.status === 'waiting') {
            if (ticket.category === 'G') queueCounts.geral++
            else if (ticket.category === 'P') queueCounts.prioritario++
            else if (ticket.category === 'R') queueCounts.retirada++
          }
        })
        
        setQueues(queueCounts)
      } catch (error) {
        console.error('Erro ao buscar filas:', error)
      }
    }

    fetchQueues()
    // Buscar a cada 2 segundos
    const interval = setInterval(fetchQueues, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="display-container">
      {/* Área de Senhas - 70% */}
      <div className="ticket-panel">
        {currentTicket && <CurrentTicket ticket={currentTicket} />}
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
