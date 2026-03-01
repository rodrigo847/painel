interface Ticket {
  id: string
  category: 'G' | 'P' | 'R'
  number: number
  counter: number
  timestamp: Date
}

const getCategoryColor = (category: 'G' | 'P' | 'R') => {
  switch (category) {
    case 'G':
      return 'from-blue-600 to-blue-800'
    case 'P':
      return 'from-red-600 to-red-800'
    case 'R':
      return 'from-green-600 to-green-800'
  }
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

const getCategoryName = (category: 'G' | 'P' | 'R') => {
  switch (category) {
    case 'G':
      return 'Atendimento Geral'
    case 'P':
      return 'Prioritário'
    case 'R':
      return 'Retirada'
  }
}

export default function CurrentTicket({ ticket }: { ticket: Ticket }) {
  return (
    <div className={`current-ticket bg-gradient-to-br ${getCategoryColor(ticket.category)}`}>
      <div className="text-white">
        <p className="text-lg md:text-2xl lg:text-3xl mb-2">{getCategoryEmoji(ticket.category)} SENHA ATUAL</p>
        <div className="ticket-number my-3 md:my-4 lg:my-6">{ticket.id}</div>
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">GUICHÊ {ticket.counter}</p>
        <p className="text-lg md:text-xl lg:text-2xl opacity-90">{getCategoryName(ticket.category)}</p>
      </div>
    </div>
  )
}
