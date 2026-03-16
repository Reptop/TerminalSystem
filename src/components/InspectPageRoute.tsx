import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import InspectPage from './InspectPage'
import type { RootState } from '../store/store'
import { supabase } from '../utils/supabase'
import type { NodeDetails } from './InspectPage'

export default function InspectPageRoute() {
  const { planet } = useParams<{ planet?: string }>()
  const root = useSelector((state: RootState) => state.fileSystem.root)

  const [details, setDetails] = useState<NodeDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const node = useMemo(() => {
    if (!root || !planet) return null
    // BFS search by name
    const queue = [root]
    while (queue.length > 0) {
      const current = queue.shift()!
      if (current.name.toLowerCase() === planet.toLowerCase()) return current
      queue.push(...current.children)
    }
    return null
  }, [root, planet])

  useEffect(() => {
    if (!node) return

    let cancelled = false
    setDetails(null)
    setLoading(true)
    setError(null)

    supabase
      .from('node_details')
      .select('*')
      .eq('node_id', node.id)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setError(error.message)
        else setDetails(data as NodeDetails)
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [node?.id])

  if (!node) {
    return (
      <aside className="info-panel render-panel">
        <div className="info-content render-content">
          <h2>Not Found</h2>
          <p className="info-text">The requested celestial body was not found.</p>
        </div>
      </aside>
    )
  }

  return <InspectPage node={node} details={details} loading={loading} error={error} />
}
