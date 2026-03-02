import { CounterState } from '../../context/AppContext'

interface CounterCardProps {
  counter: CounterState
  isSelected: boolean
  onClick: () => void
}

function CounterCard({ counter, isSelected, onClick }: CounterCardProps) {
  const typeLabel = {
    'G': 'Geral',
    'P': 'Prioritário',
    'R': 'Retirada',
    'Balcão': 'Balcão'
  }[counter.type]

  const typeColor = {
    'G': 'border-blue-500 bg-blue-900/20',
    'P': 'border-red-500 bg-red-900/20',
    'R': 'border-green-500 bg-green-900/20',
    'Balcão': 'border-yellow-500 bg-yellow-900/20'
  }[counter.type]

  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-lg border-2 transition-all text-left ${
        isSelected
          ? 'border-blue-600 bg-blue-900/30 ring-2 ring-blue-500'
          : `${typeColor} hover:opacity-80`
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-lg font-bold">#{String(counter.counterId).padStart(2, '0')}</div>
        <div className={`text-xs px-2 py-1 rounded font-bold ${
          counter.isAvailable
            ? 'bg-green-600/50 text-green-300'
            : 'bg-yellow-600/50 text-yellow-300'
        }`}>
          {counter.isAvailable ? '✓' : '◐'}
        </div>
      </div>
      
      <div className="text-xs text-gray-400 mb-2">{typeLabel}</div>
      
      {counter.currentTicket ? (
        <div className="text-base font-bold text-white">
          {counter.currentTicket.id}
        </div>
      ) : (
        <div className="text-xs text-gray-500">Aguardando...</div>
      )}
    </button>
  )
}

export default CounterCard
