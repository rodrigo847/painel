import React, { createContext, useState, useContext, useEffect } from 'react'
import { 
  subscribeToTickets, 
  subscribeToCounters,
  updateTicketStatus,
  updateCounterState,
  getTicketHistory
} from '../services/firebaseService'
import type { TicketData, CounterData } from '../services/firebaseService'

export interface Ticket extends TicketData {
  id?: string
}

export interface CounterState extends CounterData {
  id?: string
  currentTicket?: Ticket | null
}

interface AppContextType {
  // Display data
  currentTicket: Ticket | null
  setCurrentTicket: (ticket: Ticket | null) => void
  recentTickets: Ticket[]
  
  // Counters
  counters: CounterState[]
  setCounterAvailability: (counterId: number, available: boolean) => Promise<void>
  callTicketToCounter: (counterId: number, ticket: Ticket) => Promise<void>
  finishServiceAtCounter: (counterId: number) => Promise<void>
  
  // History
  callHistory: Ticket[]
  isInitialized: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null)
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([])
  const [callHistory, setCallHistory] = useState<Ticket[]>([])
  const [counters, setCounters] = useState<CounterState[]>([
    { counterId: 1, type: 'G', isAvailable: true, lastUpdated: new Date() },
    { counterId: 2, type: 'G', isAvailable: true, lastUpdated: new Date() },
    { counterId: 3, type: 'P', isAvailable: true, lastUpdated: new Date() },
    { counterId: 4, type: 'P', isAvailable: true, lastUpdated: new Date() },
    { counterId: 5, type: 'R', isAvailable: true, lastUpdated: new Date() },
  ])
  const [isInitialized, setIsInitialized] = useState(false)

  // Sincronizar tickets em tempo real
  useEffect(() => {
    const unsubscribeTickets = subscribeToTickets((tickets) => {
      // Ordenar por status (called > waiting) e por timestamp
      const sortedTickets = tickets.sort((a, b) => {
        if (a.status === 'called' && b.status !== 'called') return -1
        if (a.status !== 'called' && b.status === 'called') return 1
        return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
      })

      setRecentTickets(sortedTickets.slice(0, 10))

      // Se não há ticket current, pega o primeiro chamado
      if (!currentTicket && sortedTickets.some(t => t.status === 'called')) {
        const calledTicket = sortedTickets.find(t => t.status === 'called')
        if (calledTicket) {
          setCurrentTicket(calledTicket as Ticket)
        }
      }
    })

    return () => unsubscribeTickets()
  }, [currentTicket])

  // Sincronizar guichês em tempo real
  useEffect(() => {
    const unsubscribeCounters = subscribeToCounters((firebaseCounters) => {
      setCounters(prev => {
        // Mesclar dados do Firebase com configuração local
        const counterMap = new Map(prev.map(c => [c.counterId, c]))

        firebaseCounters.forEach(fc => {
          const existing = counterMap.get(fc.counterId)
          if (existing) {
            counterMap.set(fc.counterId, {
              ...existing,
              ...fc,
              isAvailable: fc.isAvailable,
              lastUpdated: fc.lastUpdated instanceof Date ? fc.lastUpdated : new Date(fc.lastUpdated)
            })
          }
        })

        return Array.from(counterMap.values())
      })
    })

    return () => unsubscribeCounters()
  }, [])

  // Carregar histórico de chamadas finalizadas
  useEffect(() => {
    const loadHistory = async () => {
      const history = await getTicketHistory(5)
      setCallHistory(history as Ticket[])
      setIsInitialized(true)
    }
    loadHistory()
  }, [])

  const setCounterAvailability = async (counterId: number, available: boolean) => {
    // Atualizar localmente
    setCounters(prev =>
      prev.map(counter =>
        counter.counterId === counterId
          ? { ...counter, isAvailable: available, currentTicket: available ? null : counter.currentTicket }
          : counter
      )
    )

    // Atualizar no Firebase
    try {
      await updateCounterState(counterId, { isAvailable: available })
    } catch (error) {
      console.error('Erro ao atualizar disponibilidade do guichê:', error)
    }
  }

  const callTicketToCounter = async (counterId: number, ticket: Ticket) => {
    const updatedTicket: Ticket = {
      ...ticket,
      counter: counterId,
      status: 'called',
      calledAt: new Date()
    }

    // Atualizar localmente
    setCounters(prev =>
      prev.map(counter =>
        counter.counterId === counterId
          ? { ...counter, currentTicket: updatedTicket, isAvailable: false }
          : counter
      )
    )

    setCurrentTicket(updatedTicket)
    setRecentTickets(prev => [updatedTicket, ...prev.slice(0, 9)])

    // Atualizar no Firebase
    try {
      if (ticket.id) {
        await updateTicketStatus(ticket.id, 'called', {
          counter: counterId,
          calledAt: new Date()
        })
      }
      await updateCounterState(counterId, {
        currentTicketId: ticket.id,
        isAvailable: false
      })
    } catch (error) {
      console.error('Erro ao chamar ticket para guichê:', error)
    }
  }

  const finishServiceAtCounter = async (counterId: number) => {
    setCounters(prev =>
      prev.map(counter => {
        if (counter.counterId === counterId && counter.currentTicket) {
          return { ...counter, currentTicket: null, isAvailable: true }
        }
        return counter
      })
    )

    // Atualizar no Firebase
    try {
      const counter = counters.find(c => c.counterId === counterId)
      if (counter?.currentTicket?.id) {
        await updateTicketStatus(counter.currentTicket.id, 'finished', {
          finishedAt: new Date()
        })
      }
      await updateCounterState(counterId, {
        currentTicketId: undefined,
        isAvailable: true
      })
    } catch (error) {
      console.error('Erro ao finalizar serviço:', error)
    }
  }

  return (
    <AppContext.Provider value={{
      currentTicket,
      setCurrentTicket,
      recentTickets,
      counters,
      setCounterAvailability,
      callTicketToCounter,
      finishServiceAtCounter,
      callHistory,
      isInitialized
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
