import { useState } from 'react'
import DisplayLayout from './components/Display/DisplayLayout'
import AttendantLayout from './components/Attendant/AttendantLayout'
import TotemLayout from './components/Totem/TotemLayout'
import PrinterStatus from './components/PrinterStatus'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState<'display' | 'attendant' | 'totem'>('display')

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
        {currentPage === 'display' && <DisplayLayout />}
        {currentPage === 'attendant' && <AttendantLayout />}
        {currentPage === 'totem' && <TotemLayout />}
      </div>

      {/* Status da Impressora */}
      <PrinterStatus />
    </div>
  )
}

export default App
