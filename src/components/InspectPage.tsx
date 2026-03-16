import type { TreeNode } from '../utils/fileSystemBuilder'

export type NodeDetails = {
  id: string
  node_id: string
  description: string | null
  stats: Record<string, unknown> | null
  facts: Record<string, unknown> | null
  created_at: string | null
}

type InspectPageProps = {
  node: TreeNode
  details: NodeDetails | null
  loading: boolean
  error: string | null
}

export default function InspectPage({ node, details, loading, error }: InspectPageProps) {
  const hasStats = details?.stats && Object.keys(details.stats).length > 0
  const hasFacts = details?.facts && Object.keys(details.facts).length > 0

  return (
    <aside className="info-panel render-panel">
      <div className="info-content render-content">
        <h2>{node.name}</h2>

        <div className="inspect-badges">
          <span className="inspect-badge">{node.type}</span>
          {node.renderable && <span className="inspect-badge inspect-badge-renderable">renderable</span>}
        </div>

        {loading && <p className="info-text">Loading details...</p>}

        {error && <p className="info-text">Failed to load details: {error}</p>}

        {!loading && !error && (
          <>
            {details?.description && (
              <section className="info-section">
                <h3>Description</h3>
                <p className="info-text">{details.description}</p>
              </section>
            )}

            {hasStats && (
              <section className="info-section">
                <h3>Statistics</h3>
                <div className="inspect-stats-grid">
                  {Object.entries(details!.stats!).map(([key, value]) => (
                    <div key={key} className="inspect-stat-row">
                      <span className="inspect-stat-label">{key}</span>
                      <span className="inspect-stat-value">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {hasFacts && (
              <section className="info-section">
                <h3>Facts</h3>
                <ul className="inspect-facts-list">
                  {Object.entries(details!.facts!).map(([key, value]) => (
                    <li key={key} className="inspect-fact-item">
                      <span className="inspect-fact-key">{key}</span>
                      <span className="inspect-fact-value">{String(value)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {!details?.description && !hasStats && !hasFacts && !loading && (
              <p className="info-text">No data available for this celestial body.</p>
            )}
          </>
        )}
      </div>
    </aside>
  )
}
