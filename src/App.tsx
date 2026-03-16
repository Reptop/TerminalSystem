import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { buildTree, type Node } from './utils/fileSystemBuilder'
import { setFileSystem } from './store/fileSystemSlice'
import CommandPrompt from './components/CommandPrompt'
import './App.css'

export default function App() {
  const supabaseUrl = 'https://eewubybunnafnkzamvwp.supabase.co'
  const supabaseKey = "sb_publishable_PaF-_vrfXsey4lzkfs3VoA_qcZF0bzp"
  const supabase = createClient(supabaseUrl, supabaseKey)

  const dispatch = useDispatch()

  useEffect(() => {
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
    <main className="app-shell app-shell-root">
      <div className="terminal-container">
        <CommandPrompt>
          <p className="terminal-line">terminal-system v1.0.0</p>
          <p className="terminal-line">type a command and press run</p>
          <p className="terminal-line terminal-line-muted">status: waiting for input...</p>
        </CommandPrompt>
      </div>
      <Outlet />
    </main>
  )
}
