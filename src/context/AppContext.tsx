import React, { createContext, useState, useContext } from 'react'

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
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)

  const [recentTickets, setRecentTickets] = useState<Ticket[]>([])

  const [queues] = useState({
    geral: 0,
    prioritario: 0,
    retirada: 0,
  })

  const [counters, setCounters] = useState<CounterState[]>([
    { id: 1, type: 'G', currentTicket: null, isAvailable: true },
    { id: 2, type: 'G', currentTicket: null, isAvailable: true },
    { id: 3, type: 'P', currentTicket: null, isAvailable: true },
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
