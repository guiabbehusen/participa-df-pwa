import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getManifestationStatus } from '../../manifestation/api/manifestationApi'
import type { ManifestationStatusResponse } from '../../manifestation/types/manifestation'

export function ProtocolDetailsPage() {
  const { protocol } = useParams()
  const [data, setData] = useState<ManifestationStatusResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!protocol) return

    setLoading(true)
    setError(null)

    getManifestationStatus(protocol)
      .then((res) => setData(res))
      .catch(() => setError('Protocolo não encontrado (mock) ou erro de conexão.'))
      .finally(() => setLoading(false))
  }, [protocol])

  return (
    <section className="page">
      <h1>Detalhes do protocolo</h1>

      {loading && <p className="muted">Carregando…</p>}
      {error && <p className="error">{error}</p>}

      {data && (
        <div className="review">
          <p>
            <strong>Protocolo:</strong> {data.protocol}
          </p>
          <p>
            <strong>Status:</strong> {data.status}
          </p>
          <p>
            <strong>Data:</strong> {new Date(data.createdAt).toLocaleString('pt-BR')}
          </p>
          {data.subject && (
            <p>
              <strong>Assunto:</strong> {data.subject}
            </p>
          )}
        </div>
      )}

      <div className="form-actions">
        <Link to="/manifestacoes/nova" className="button-link">
          Registrar nova manifestação
        </Link>
        <Link to="/protocolos" className="button-link secondary">
          Voltar para consulta
        </Link>
      </div>
    </section>
  )
}
