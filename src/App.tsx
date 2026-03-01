import { useState } from 'react'
import DisplayLayout from './components/Display/DisplayLayout'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState<'display' | 'attendant' | 'totem'>('display')

  return (
    <div className="w-full h-screen">
      {/* Toggle para testar diferentes telas */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <button
          onClick={() => setCurrentPage('display')}
          className={`px-4 py-2 rounded font-bold ${
            currentPage === 'display'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          📺 Painel
        </button>
        <button
          onClick={() => setCurrentPage('attendant')}
          className={`px-4 py-2 rounded font-bold ${
            currentPage === 'attendant'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          💻 Atendente
        </button>
        <button
          onClick={() => setCurrentPage('totem')}
          className={`px-4 py-2 rounded font-bold ${
            currentPage === 'totem'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          📱 Totem
        </button>
      </div>

      {/* Renderizar página selecionada */}
      {currentPage === 'display' && <DisplayLayout />}
      {currentPage === 'attendant' && (
        <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">👷 Interface do Atendente</h1>
            <p className="text-2xl">Em desenvolvimento...</p>
          </div>
        </div>
      )}
      {currentPage === 'totem' && (
        <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">📱 Totem de Emissão</h1>
            <p className="text-2xl">Em desenvolvimento...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
