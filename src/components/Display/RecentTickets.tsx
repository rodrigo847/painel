interface Ticket {
  id: string
  category: 'G' | 'P' | 'R'
  number: number
  counter: number
  timestamp: Date
}

const getCategoryEmoji = (category: 'G' | 'P' | 'R') => {
  switch (category) {
    case 'G':
      return '🔵'
    case 'P':
      return '🔴'
    case 'R':
      return '🟢'
  }
}

export default function RecentTickets({ tickets }: { tickets: Ticket[] }) {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-bold mb-3">📋 ÚLTIMAS CHAMADAS</h2>
      <div className="space-y-2">
        {tickets.map((ticket, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded text-lg">
            <span>{getCategoryEmoji(ticket.category)} {ticket.id}</span>
            <span>→ Guichê {ticket.counter}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
