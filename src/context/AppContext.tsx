import React, { createContext, useState, useContext, useEffect } from 'react'

export interface Ticket {
  id: string
  category: 'G' | 'P' | 'R'
  number: number
  counter: number
  timestamp: Date
}

export interface CounterState {
  id: number
  type: 'G' | 'P' | 'R' | 'Balcão'
  currentTicket: Ticket | null
  isAvailable: boolean
}

interface CallHistoryItem extends Ticket {
  finishedAt?: Date
}

interface AppContextType {
  // Display data
  currentTicket: Ticket | null
  setCurrentTicket: (ticket: Ticket) => void
  recentTickets: Ticket[]
  queues: {
    geral: number
    prioritario: number
    retirada: number
  }
  
  // Counters
  counters: CounterState[]
  setCounterAvailability: (counterId: number, available: boolean) => void
  callTicketToCounter: (counterId: number, ticket: Ticket) => void
  finishServiceAtCounter: (counterId: number) => void
  
  // History
  callHistory: CallHistoryItem[]
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
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

  const [counters, setCounters] = useState<CounterState[]>([
    { id: 1, type: 'G', currentTicket: { id: 'G-014', category: 'G', number: 14, counter: 1, timestamp: new Date(Date.now() - 30000) }, isAvailable: false },
    { id: 2, type: 'G', currentTicket: null, isAvailable: true },
    { id: 3, type: 'P', currentTicket: { id: 'P-015', category: 'P', number: 15, counter: 3, timestamp: new Date() }, isAvailable: false },
    { id: 4, type: 'P', currentTicket: null, isAvailable: true },
    { id: 5, type: 'R', currentTicket: null, isAvailable: true },
  ])

  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([])

  const setCounterAvailability = (counterId: number, available: boolean) => {
    setCounters(prev =>
      prev.map(counter =>
        counter.id === counterId
          ? { ...counter, isAvailable: available, currentTicket: available ? null : counter.currentTicket }
          : counter
      )
    )
  }

  const callTicketToCounter = (counterId: number, ticket: Ticket) => {
    const updatedTicket = { ...ticket, counter: counterId, timestamp: new Date() }
    
    setCounters(prev =>
      prev.map(counter =>
        counter.id === counterId
          ? { ...counter, currentTicket: updatedTicket, isAvailable: false }
          : counter
      )
    )
    
    setCurrentTicket(updatedTicket)
    setRecentTickets(prev => [updatedTicket, ...prev.slice(0, 3)])
  }

  const finishServiceAtCounter = (counterId: number) => {
    setCounters(prev =>
      prev.map(counter => {
        if (counter.id === counterId && counter.currentTicket) {
          const finishedTicket: CallHistoryItem = {
            ...counter.currentTicket,
            finishedAt: new Date()
          }
          setCallHistory(prev => [finishedTicket, ...prev])
          return { ...counter, currentTicket: null, isAvailable: true }
        }
        return counter
      })
    )
  }

  // Simulação de chamada de senha a cada 15 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      const categories: Array<'G' | 'P' | 'R'> = ['G', 'P', 'R']
      const randomCategory = categories[Math.floor(Math.random() * categories.length)]
      const randomNumber = Math.floor(Math.random() * 100) + 1
      
      // Encontrar um balcão disponível do tipo apropriado
      const availableCounter = counters.find(
        c => c.type === randomCategory && c.isAvailable
      )
      
      if (availableCounter) {
        const newTicket: Ticket = {
          id: `${randomCategory}-${String(randomNumber).padStart(3, '0')}`,
          category: randomCategory,
          number: randomNumber,
          counter: availableCounter.id,
          timestamp: new Date(),
        }
        
        callTicketToCounter(availableCounter.id, newTicket)
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [counters])

  return (
    <AppContext.Provider value={{
      currentTicket,
      setCurrentTicket,
      recentTickets,
      queues,
      counters,
      setCounterAvailability,
      callTicketToCounter,
      finishServiceAtCounter,
      callHistory
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de AppProvider')
  }
  return context
}
