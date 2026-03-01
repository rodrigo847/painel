import { useState, useEffect } from 'react'
import { useAppContext } from '../../context/AppContext'
import { saveTicket, getNextTicketNumber } from '../../services/firebaseService'

type ServiceType = 'G' | 'P' | 'R'

function TotemLayout() {
  const { counters } = useAppContext()
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null)
  const [issuedTicket, setIssuedTicket] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (issuedTicket && showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
        setIssuedTicket(null)
        setSelectedService(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [issuedTicket, showSuccess])

  const serviceInfo = {
    G: {
      label: 'Atendimento Geral',
      icon: '👤',
      color: 'from-blue-600 to-blue-800',
      description: 'Para assuntos gerais'
    },
    P: {
      label: 'Atendimento Prioritário',
      icon: '⭐',
      color: 'from-red-600 to-red-800',
      description: 'Gestantes, idosos, deficientes'
    },
    R: {
      label: 'Retirada de Pedidos',
      icon: '📋',
      color: 'from-green-600 to-green-800',
      description: 'Tenha o número para facilitar a entrega'
    }
  }

  const handleIssueTicket = async (serviceType: ServiceType) => {
    // Verificar se há guichês do tipo (apenas para mostrar mensagem se não houver nenhum)
    const hasCounterType = counters.some(c => c.type === serviceType)

    if (!hasCounterType) {
      alert(`Não há guichês disponíveis para ${serviceType}`)
      return
    }

    // Salvar no Firebase (sem atribuir guichê ainda)
    try {
      // Buscar próximo número sequencial
      const nextNumber = await getNextTicketNumber(serviceType)
      const newTicketId = `${serviceType}-${String(nextNumber).padStart(3, '0')}`
      
      await saveTicket({
        ticketId: newTicketId,
        category: serviceType,
        number: nextNumber,
        counter: 0, // Sem guichê atribuído ainda
        issuedAt: new Date(),
        status: 'waiting'
      })
      
      setIssuedTicket(newTicketId)
      setShowSuccess(true)
    } catch (error) {
      console.error('Erro ao salvar ticket no Firebase:', error)
      alert('Erro ao gerar senha. Tente novamente.')
    }
  }

  if (showSuccess && issuedTicket) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-8xl mb-6 animate-bounce">✅</div>
          <h1 className="text-5xl font-bold text-white mb-4">Senha Emitida!</h1>
          <div
            className={`text-9xl font-black mb-6 ${
              issuedTicket.startsWith('G')
                ? 'text-blue-300'
                : issuedTicket.startsWith('P')
                ? 'text-red-300'
                : 'text-green-300'
            }`}
          >
            {issuedTicket}
          </div>
          <p className="text-2xl text-white mb-4">Aguarde sua chamada no painel</p>
          <div className="text-lg text-gray-200 animate-pulse">
            Retornando ao menu em alguns segundos...
          </div>
        </div>
      </div>
    )
  }

  if (selectedService) {
    const info = serviceInfo[selectedService]
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4 relative">
        <button
          onClick={() => setSelectedService(null)}
          className="absolute top-6 left-6 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-2xl transition-all transform hover:scale-110 active:scale-95 shadow-lg border-2 border-red-400"
        >
          ← VOLTAR
        </button>

        <div className="text-center max-w-2xl">
          <div className={`text-9xl mb-6`}>{info.icon}</div>
          <h1 className="text-5xl font-bold text-white mb-2">{info.label}</h1>
          <p className="text-2xl text-gray-300 mb-12">{info.description}</p>

          <button
            onClick={() => handleIssueTicket(selectedService)}
            className={`w-full py-16 rounded-3xl font-bold text-5xl transition-all transform hover:scale-105 active:scale-95 bg-gradient-to-br ${info.color} text-white border-4 border-white shadow-2xl`}
          >
            EMITIR SENHA
          </button>

          <div className="mt-12 text-gray-400">
            <p className="text-xl">Clique no botão para emitir sua senha</p>
            <p className="text-sm mt-2 opacity-50">Se errar, clique em VOLTAR no canto superior esquerdo</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-black text-white mb-2">EMISSÃO DE SENHAS</h1>
        <div className="h-1 w-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 mx-auto mt-4"></div>
      </div>

      {/* Service Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {(['G', 'P', 'R'] as ServiceType[]).map(serviceType => {
          const info = serviceInfo[serviceType]
          const availableCount = counters.filter(c => c.type === serviceType && c.isAvailable).length

          return (
            <button
              key={serviceType}
              onClick={() => setSelectedService(serviceType)}
              className={`p-8 rounded-2xl bg-gradient-to-br ${info.color} text-white font-bold transition-all transform hover:scale-105 active:scale-95 shadow-2xl border-4 border-white hover:border-gray-300`}
            >
              <div className="text-7xl mb-4">{info.icon}</div>
              <h2 className="text-3xl mb-2">{info.label}</h2>
              <p className="text-lg opacity-90 mb-4">{info.description}</p>
              <div className="bg-black/30 rounded-lg py-3 mt-4">
                <p className="text-2xl font-black">{availableCount} Guichê{availableCount !== 1 ? 's' : ''}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-gray-400 max-w-2xl">
        <p className="text-lg">
          Selecione o tipo de atendimento desejado acima e clique no botão para emitir sua senha
        </p>
        <p className="text-sm mt-4 opacity-50">v0.0.1 | Sistema de Fila</p>
      </div>
    </div>
  )
}

export default TotemLayout
