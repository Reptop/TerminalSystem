import './App.css'
import CommandPrompt from './components/CommandPrompt'

function App() {
  return (
    <main className="app-shell">
      <CommandPrompt>
        <p className="terminal-line">terminal-system v1.0.0</p>
        <p className="terminal-line">type a command and press run</p>
        <p className="terminal-line terminal-line-muted">status: waiting for input...</p>
      </CommandPrompt>
    </main>
  )
}

export default App
