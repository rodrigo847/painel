import { useState, useEffect } from 'react'
import DisplayLayout from './components/Display/DisplayLayout'
import AttendantLayout from './components/Attendant/AttendantLayout'
import TotemLayout from './components/Totem/TotemLayout'
import PrinterStatus from './components/PrinterStatus'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState<'display' | 'attendant' | 'totem'>('display')
  const [error, setError] = useState<string | null>(null)

  // Detectar rota da URL
  useEffect(() => {
    try {
      const path = window.location.pathname
      console.log('📍 Rota atual:', path)
      
      if (path.includes('/totem')) {
        setCurrentPage('totem')
      } else if (path.includes('/attendant')) {
        setCurrentPage('attendant')
      } else if (path.includes('/display')) {
        setCurrentPage('display')
      } else {
        // Default para display
        setCurrentPage('display')
      }
    } catch (err) {
      console.error('Erro ao detectar rota:', err)
      setError('Erro ao carregar página')
    }
  }, [])

  return (
    <div className="w-full h-screen bg-gray-900">
      {/* Navigation Bar */}
      <div className="bg-gray-800 border-b-2 border-gray-700 px-6 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage('display')}
            className={`px-4 py-2 rounded font-bold transition-colors ${
              currentPage === 'display'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            📺 Painel
          </button>
          <button
            onClick={() => setCurrentPage('attendant')}
            className={`px-4 py-2 rounded font-bold transition-colors ${
              currentPage === 'attendant'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            💻 Atendente
          </button>
          <button
            onClick={() => setCurrentPage('totem')}
            className={`px-4 py-2 rounded font-bold transition-colors ${
              currentPage === 'totem'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            📱 Totem
          </button>
        </div>
      </div>

      {/* Renderizar página selecionada */}
      <div className="h-[calc(100vh-60px)] overflow-hidden">
        {error ? (
          <div className="w-full h-full flex items-center justify-center bg-red-900">
            <div className="text-center">
              <div className="text-6xl mb-4">❌</div>
              <h1 className="text-3xl font-bold text-white mb-4">Erro ao Carregar</h1>
              <p className="text-xl text-gray-200 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
              >
                🔄 Recarregar Página
              </button>
            </div>
          </div>
        ) : (
          <>
            {currentPage === 'display' && <DisplayLayout />}
            {currentPage === 'attendant' && <AttendantLayout />}
            {currentPage === 'totem' && <TotemLayout />}
          </>
        )}
      </div>

      {/* Status da Impressora */}
      <PrinterStatus />
    </div>
  )
}

export default App
