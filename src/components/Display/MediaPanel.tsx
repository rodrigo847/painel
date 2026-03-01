import { useState, useEffect } from 'react'

export default function MediaPanel() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">📺 PROPAGANDA</h1>
        <div className="text-6xl font-bold mb-4">⏰</div>
        <p className="text-4xl font-mono mb-2">
          {currentTime.toLocaleTimeString('pt-BR')}
        </p>
        <p className="text-xl opacity-75">
          {currentTime.toLocaleDateString('pt-BR')}
        </p>

        <div className="mt-8 p-4 bg-gray-700 rounded">
          <p className="text-sm">Área de</p>
          <p className="text-lg font-bold">PROPAGANDA E MÍDIA</p>
          <p className="text-xs mt-2 opacity-75">Em desenvolvimento...</p>
        </div>

        {/* Versão atual */}
        <div className="mt-8 text-xs opacity-50">
          v0.0.1 | localhost
        </div>
      </div>
    </div>
  )
}
