import { useParams } from 'react-router-dom'
import ModelPage from './ModelPage'
import { SCENE_CONFIG } from '../router'

export default function RenderPage() {
  const { planet } = useParams<{ planet?: string }>()
  const config = planet ? SCENE_CONFIG[planet as keyof typeof SCENE_CONFIG] : null

  if (!config) {
    return (
      <aside className="info-panel render-panel">
        <div className="info-content render-content">
          <h2>Not Found</h2>
          <p className="info-text">The requested render scene was not found.</p>
        </div>
      </aside>
    )
  }

  return <ModelPage assetPath={config.assetPath} label={planet!} title={config.title} description={config.description} />
}
