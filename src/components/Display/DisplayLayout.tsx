import { useAppContext } from '../../context/AppContext'
import CurrentTicket from './CurrentTicket.tsx'
import RecentTickets from './RecentTickets.tsx'
import QueueCounter from './QueueCounter.tsx'
import MediaPanel from './MediaPanel.tsx'

export default function DisplayLayout() {
  const { currentTicket, recentTickets, queues } = useAppContext()

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
