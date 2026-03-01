/// <reference types="vite/client" />

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, query, where, getDocs, updateDoc, doc, onSnapshot } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Substitua com suas credenciais do Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

// ============== TIPOS ==============
export interface TicketData {
  id?: string
  ticketId: string
  category: 'G' | 'P' | 'R'
  number: number
  counter: number
  issuedAt: Date
  calledAt?: Date
  finishedAt?: Date
  status: 'waiting' | 'called' | 'finished'
}

export interface CounterData {
  id?: string
  counterId: number
  type: 'G' | 'P' | 'R'
  isAvailable: boolean
  currentTicketId?: string
  lastUpdated: Date
}

// ============== TICKETS ==============
export async function getNextTicketNumber(category: 'G' | 'P' | 'R') {
  try {
    // Buscar todos os tickets dessa categoria
    const q = query(
      collection(db, 'tickets'),
      where('category', '==', category)
    )
    const docs = await getDocs(q)
    
    if (docs.empty) {
      return 1 // Primeira senha
    }
    
    // Encontrar o maior número
    const numbers = docs.docs.map(doc => doc.data().number as number)
    const maxNumber = Math.max(...numbers)
    return maxNumber + 1
  } catch (error) {
    console.error('Erro ao buscar próximo número:', error)
    return Math.floor(Math.random() * 1000) // Fallback para aleatório
  }
}

export async function saveTicket(ticket: TicketData) {
  try {
    const docRef = await addDoc(collection(db, 'tickets'), {
      ...ticket,
      issuedAt: new Date(),
      status: 'waiting'
    })
    return docRef.id
  } catch (error) {
    console.error('Erro ao salvar ticket:', error)
    throw error
  }
}

export async function getActiveTickets() {
  try {
    const q = query(
      collection(db, 'tickets'),
      where('status', 'in', ['waiting', 'called'])
    )
    const docs = await getDocs(q)
    const tickets = docs.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        ticketId: data.ticketId,
        category: data.category,
        number: data.number,
        counter: data.counter,
        issuedAt: data.issuedAt?.toDate ? data.issuedAt.toDate() : new Date(data.issuedAt),
        calledAt: data.calledAt?.toDate ? data.calledAt.toDate() : data.calledAt ? new Date(data.calledAt) : undefined,
        finishedAt: data.finishedAt?.toDate ? data.finishedAt.toDate() : data.finishedAt ? new Date(data.finishedAt) : undefined,
        status: data.status
      }
    }) as TicketData[]
    console.log('Tickets ativos encontrados:', tickets)
    return tickets
  } catch (error) {
    console.error('Erro ao buscar tickets ativos:', error)
    return []
  }
}

export async function getTicketHistory(limit = 100) {
  try {
    const q = query(
      collection(db, 'tickets'),
      where('status', '==', 'finished')
    )
    const docs = await getDocs(q)
    const tickets = docs.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TicketData[]
    return tickets.sort((a, b) => (b.finishedAt?.getTime() || 0) - (a.finishedAt?.getTime() || 0)).slice(0, limit)
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return []
  }
}

export async function updateTicketStatus(ticketId: string, status: 'called' | 'finished', data?: Partial<TicketData>) {
  try {
    const ticketRef = doc(db, 'tickets', ticketId)
    await updateDoc(ticketRef, {
      status,
      ...data
    })
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error)
    throw error
  }
}

export function subscribeToTickets(callback: (tickets: TicketData[]) => void) {
  const q = query(
    collection(db, 'tickets'),
    where('status', 'in', ['waiting', 'called'])
  )
  
  return onSnapshot(q, (snapshot) => {
    const tickets = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as TicketData[]
    callback(tickets)
  }, (error) => {
    console.error('Erro ao escutar tickets:', error)
  })
}

// ============== COUNTERS ==============
export async function saveCounterState(counter: CounterData) {
  try {
    const docRef = await addDoc(collection(db, 'counters'), {
      ...counter,
      lastUpdated: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error('Erro ao salvar estado do guichê:', error)
    throw error
  }
}

export async function updateCounterState(counterId: number, data: Partial<CounterData>) {
  try {
    const q = query(
      collection(db, 'counters'),
      where('counterId', '==', counterId)
    )
    const docs = await getDocs(q)
    
    if (docs.empty) {
      await saveCounterState({
        counterId,
        type: data.type || 'G',
        isAvailable: data.isAvailable ?? true,
        currentTicketId: data.currentTicketId,
        lastUpdated: new Date()
      })
    } else {
      const counterRef = doc(db, 'counters', docs.docs[0].id)
      await updateDoc(counterRef, {
        ...data,
        lastUpdated: new Date()
      })
    }
  } catch (error) {
    console.error('Erro ao atualizar guichê:', error)
    throw error
  }
}

export function subscribeToCounters(callback: (counters: CounterData[]) => void) {
  return onSnapshot(collection(db, 'counters'), (snapshot) => {
    const counters = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as CounterData[]
    callback(counters)
  }, (error) => {
    console.error('Erro ao escutar guichês:', error)
  })
}

// ============== ESTATÍSTICAS ==============
export async function getDailyStats() {
  try {
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    
    const q = query(
      collection(db, 'tickets'),
      where('status', '==', 'finished')
    )
    
    const docs = await getDocs(q)
    const tickets = docs.docs.map(doc => doc.data()) as TicketData[]
    
    const todayTickets = tickets.filter(
      t => t.finishedAt && new Date(t.finishedAt) > startOfDay
    )
    
    const stats = {
      totalTickets: todayTickets.length,
      general: todayTickets.filter(t => t.category === 'G').length,
      priority: todayTickets.filter(t => t.category === 'P').length,
      withdrawal: todayTickets.filter(t => t.category === 'R').length,
      avgWaitTime: 0 // Será calculado depois
    }
    
    return stats
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error)
    return null
  }
}
