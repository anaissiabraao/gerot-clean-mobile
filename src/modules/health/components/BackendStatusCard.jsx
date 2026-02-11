import api from '../../../api/endpoints'
import { useBackendHealth } from '../hooks/useBackendHealth'
import './BackendStatusCard.css'

export function BackendStatusCard() {
  const { loading, error, data, refresh } = useBackendHealth()
  const status = loading ? 'checando' : error ? 'offline' : 'online'

  return (
    <article className="status-card">
      <div className="status-card__header">
        <h2>Status do backend</h2>
        <span className={`status-pill status-pill--${status}`}>{status}</span>
      </div>

      <p className="status-card__description">
        Endpoint atual: <code>{api.health}</code>
      </p>

      {loading && <p className="status-card__info">Consultando servico...</p>}
      {error && <p className="status-card__error">{error}</p>}
      {!loading && !error && (
        <pre className="status-card__payload">{JSON.stringify(data.payload, null, 2)}</pre>
      )}

      <button type="button" onClick={refresh} className="status-card__button">
        Revalidar conexao
      </button>
    </article>
  )
}
