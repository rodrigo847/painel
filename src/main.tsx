import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AppProvider } from './context/AppContext.tsx'
import './index.css'

// Adicionar logs para debug
console.log('🚀 Iniciando aplicação...')
console.log('📍 URL base:', import.meta.url)
console.log('🔥 Firebase API Key:', import.meta.env.VITE_FIREBASE_API_KEY?.slice(0, 10) + '...')

try {
  const root = document.getElementById('root')
  if (!root) {
    throw new Error('Elemento root não encontrado no HTML')
  }

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AppProvider>
        <App />
      </AppProvider>
    </React.StrictMode>,
  )
  console.log('✅ Aplicação renderizada com sucesso')
} catch (error) {
  console.error('❌ Erro ao iniciar aplicação:', error)
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; background: #111; color: white; font-family: Arial;">
      <div style="text-align: center;">
        <h1 style="font-size: 48px; margin-bottom: 20px;">❌ Erro ao Carregar</h1>
        <p style="font-size: 18px; margin-bottom: 10px;">Abra o console (F12) para mais detalhes</p>
        <p style="font-size: 14px; color: #aaa;">${error instanceof Error ? error.message : String(error)}</p>
        <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">🔄 Recarregar</button>
      </div>
    </div>
  `
}
