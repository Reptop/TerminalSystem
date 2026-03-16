import TerminalModelPreview from './TerminalModelPreview'

type ModelPageProps = {
  assetPath: string
  label: string
  title: string
  description: string
}

export default function ModelPage({ assetPath, label, title, description }: ModelPageProps) {
  return (
    <aside className="info-panel render-panel">
      <div className="info-content render-content">
        <h2>{title}</h2>
        <p className="info-text">{description}</p>

        <div className="render-preview-card">
          <TerminalModelPreview assetPath={assetPath} label={label} />
        </div>
      </div>
    </aside>
  )
}
