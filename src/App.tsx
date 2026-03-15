import { useEffect } from 'react'
import './App.css'
import CommandPrompt from './components/CommandPrompt'
import { createClient } from '@supabase/supabase-js'

function App() {
  // https://supabase.com/dashboard/project/eewubybunnafnkzamvwp/integrations/data_api/docs
  // API established and set up basically
  const supabaseUrl = 'https://eewubybunnafnkzamvwp.supabase.co'
  const supabaseKey = "sb_publishable_PaF-_vrfXsey4lzkfs3VoA_qcZF0bzp"
  const supabase = createClient(supabaseUrl, supabaseKey)

  useEffect(() => {
    // Handle async operations here
    const initializeApp = async () => {
      //let { data: nodes, error } = await supabase.from('nodes').select('*')
      //console.log(nodes)
      //console.log(error)
    }
    initializeApp()
  }, [])

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
