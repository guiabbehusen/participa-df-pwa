import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function TrackProtocolPage() {
  const [protocol, setProtocol] = useState('')
  const navigate = useNavigate()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const p = protocol.trim()
    if (!p) return
    navigate(`/protocolos/${encodeURIComponent(p)}`)
  }

  return (
    <section className="page">
      <h1>Acompanhar protocolo</h1>
      <p className="muted">Digite o protocolo para consultar o status.</p>

      <form className="form" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="protocol">Protocolo</label>
          <input
            id="protocol"
            type="text"
            value={protocol}
            onChange={(e) => setProtocol(e.target.value)}
            placeholder="Ex.: DF-2026-000123"
          />
        </div>

        <div className="form-actions">
          <button type="submit">Consultar</button>
        </div>
      </form>
    </section>
  )
}
