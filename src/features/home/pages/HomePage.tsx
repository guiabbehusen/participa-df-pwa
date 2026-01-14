import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <section className="page">
      <h1>Ouvidoria — Participa DF (PWA)</h1>
      <p className="muted">
        Registre sua manifestação por texto ou áudio e anexe evidências (imagem/vídeo). O sistema gera um
        protocolo automaticamente e permite envio anônimo.
      </p>

      <div className="card-grid">
        <Link className="card" to="/manifestacoes/nova">
          <h2>Registrar manifestação</h2>
          <p>Fluxo simples em 3 passos. Multicanal e acessível.</p>
        </Link>

        <Link className="card" to="/protocolos">
          <h2>Acompanhar protocolo</h2>
          <p>Consulte o status do seu registro.</p>
        </Link>

        <a className="card" href="tel:162">
          <h2>Ligar 162</h2>
          <p>Atalho para canal telefônico (quando aplicável).</p>
        </a>
      </div>

      <hr />

      <p className="muted">
        Dica: use o menu “Acessibilidade” no topo para alto contraste e texto grande.
      </p>
    </section>
  )
}
