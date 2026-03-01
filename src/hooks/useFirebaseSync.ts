import { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { 
  saveTicket, 
  updateTicketStatus, 
  subscribeToTickets,
  updateCounterState,
  subscribeToCounters
} from '../services/firebaseService'

export function useFirebaseSync() {
  const { 
    currentTicket, 
    counters, 
    callHistory 
  } = useAppContext()

  // Sincronizar senhas com Firebase
  useEffect(() => {
    if (!currentTicket) return

    const syncTicket = async () => {
      try {
        // Salvar nova senha
        await saveTicket({
          ticketId: currentTicket.id,
          category: currentTicket.category,
          number: currentTicket.number,
          counter: currentTicket.counter,
          issuedAt: currentTicket.timestamp,
          status: 'called'
        })
      } catch (error) {
        console.error('Erro ao sincronizar senha:', error)
      }
    }

    syncTicket()
  }, [currentTicket])

  // Sincronizar histórico com Firebase
  useEffect(() => {
    if (callHistory.length === 0) return

    const lastTicket = callHistory[0]
    const syncHistory = async () => {
      try {
        // Atualizar status para finished
        const ticketRef = lastTicket.id || `${lastTicket.category}-${lastTicket.number}`
        await updateTicketStatus(ticketRef, 'finished', {
          finishedAt: lastTicket.finishedAt
        })
      } catch (error) {
        console.error('Erro ao sincronizar histórico:', error)
      }
    }

    if (lastTicket.finishedAt) {
      syncHistory()
    }
  }, [callHistory])

  // Sincronizar estado dos guichês
  useEffect(() => {
    const syncCounters = async () => {
      try {
        for (const counter of counters) {
          await updateCounterState(counter.id, {
            counterId: counter.id,
            type: counter.type as 'G' | 'P' | 'R',
            isAvailable: counter.isAvailable,
            currentTicketId: counter.currentTicket?.id
          })
        }
      } catch (error) {
        console.error('Erro ao sincronizar guichês:', error)
      }
    }

    const timer = setTimeout(syncCounters, 1000) // Sincronizar a cada 1 segundo
    return () => clearTimeout(timer)
  }, [counters])
}

// Hook para escutar atualizações do Firebase em tempo real
export function useFirestoreListener() {
  const { setCurrentTicket } = useAppContext()

  useEffect(() => {
    const unsubscribeTickets = subscribeToTickets((tickets) => {
      // Encontrar a senha mais recente com status 'called'
      const calledTicket = tickets
        .filter(t => t.status === 'called')
        .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())[0]

      if (calledTicket) {
        setCurrentTicket({
          id: calledTicket.ticketId,
          category: calledTicket.category,
          number: calledTicket.number,
          counter: calledTicket.counter,
          timestamp: new Date(calledTicket.issuedAt)
        })
      }
    })

    const unsubscribeCounters = subscribeToCounters(() => {
      // Atualizar estado dos contadores conforme necessário
    })

    return () => {
      unsubscribeTickets()
      unsubscribeCounters()
    }
  }, [setCurrentTicket])
}
