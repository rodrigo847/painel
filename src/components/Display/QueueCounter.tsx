interface QueueStats {
  geral: number
  prioritario: number
  retirada: number
}

export default function QueueCounter({ queues }: { queues: QueueStats }) {
  return (
    <div>
      <h2 className="text-white text-base md:text-lg lg:text-xl font-bold mb-2 md:mb-3">⏳ EM ESPERA</h2>
      <div className="ticket-counter">
        <div className="counter-item">
          <p className="text-blue-400 text-xs md:text-sm font-bold">GERAL</p>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white mt-1">🔵 {queues.geral}</p>
        </div>
        <div className="counter-item">
          <p className="text-red-400 text-xs md:text-sm font-bold">PRIORITÁRIO</p>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white mt-1">🔴 {queues.prioritario}</p>
        </div>
        <div className="counter-item">
          <p className="text-green-400 text-xs md:text-sm font-bold">RETIRADA</p>
          <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white mt-1">🟢 {queues.retirada}</p>
        </div>
      </div>
    </div>
  )
}
