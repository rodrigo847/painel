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
    <div className="flex flex-col items-center justify-center h-full p-2 md:p-4 text-white">
      <div className="text-center">
        <h1 className="text-lg md:text-xl lg:text-2xl font-bold mb-3 md:mb-4">📺 PROPAGANDA</h1>
        <div className="text-4xl md:text-5xl lg:text-6xl mb-2 md:mb-4">⏰</div>
        <p className="text-2xl md:text-3xl lg:text-4xl font-mono mb-2">
          {currentTime.toLocaleTimeString('pt-BR')}
        </p>
        <p className="text-base md:text-lg lg:text-xl opacity-75">
          {currentTime.toLocaleDateString('pt-BR')}
        </p>

        <div className="mt-4 md:mt-6 lg:mt-8 p-3 md:p-4 bg-gray-700 rounded">
          <p className="text-xs md:text-sm">Área de</p>
          <p className="text-sm md:text-base lg:text-lg font-bold">PROPAGANDA E MÍDIA</p>
          <p className="text-xs mt-2 opacity-75">Em desenvolvimento...</p>
        </div>

        {/* Versão atual */}
        <div className="mt-4 md:mt-6 text-xs opacity-50">
          v0.0.1 | localhost
        </div>
      </div>
    </div>
  )
}
