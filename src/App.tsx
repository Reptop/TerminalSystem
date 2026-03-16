import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import './App.css'
import CommandPrompt from './components/CommandPrompt'
import { createClient } from '@supabase/supabase-js'
import { buildTree, type Node } from './utils/fileSystemBuilder'
import { setFileSystem } from './store/fileSystemSlice'

function App() {
  // https://supabase.com/dashboard/project/eewubybunnafnkzamvwp/integrations/data_api/docs
  // API established and set up basically
  const supabaseUrl = 'https://eewubybunnafnkzamvwp.supabase.co'
  const supabaseKey = "sb_publishable_PaF-_vrfXsey4lzkfs3VoA_qcZF0bzp"
  const supabase = createClient(supabaseUrl, supabaseKey)

  const dispatch = useDispatch()

  useEffect(() => {
    // Handle async operations here
    const initializeApp = async () => {
      const { data: nodes, error } = await supabase.from('nodes').select('*')

      if (error) {
        console.error('Error fetching nodes:', error)
        return
      }

      if (nodes && nodes.length > 0) {
        const tree = buildTree(nodes as Node[])
        dispatch(setFileSystem(tree))
        console.log('File system tree built:', tree)
      }
    }
    initializeApp()
  }, [dispatch])

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
