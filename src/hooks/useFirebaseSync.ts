/**
 * Sincronização com Firebase
 * 
 * NOTA: A sincronização em tempo real agora é feita no AppContext.tsx
 * Este arquivo mantém hooks úteis para sincronização manual se necessário.
 */

import { useAppContext } from '../context/AppContext'

/**
 * Hook para obter status de sincronização
 * Útil para mostrar indicadores de carregamento
 */
export function useSyncStatus() {
  const { isInitialized } = useAppContext()

  return {
    isInitialized,
    isSyncing: !isInitialized
  }
}

/**
 * Hook para obter dados sincronizados do Firebase
 * Todos os dados já estão sincronizados automaticamente no AppContext
 */
export function useFirestoreData() {
  const { 
    currentTicket, 
    recentTickets,
    counters,
    callHistory,
    isInitialized 
  } = useAppContext()

  return {
    currentTicket,
    recentTickets,
    counters,
    callHistory,
    isInitialized
  }
}

export default useFirestoreData

