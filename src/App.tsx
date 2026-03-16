import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet, useLocation } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'
import { buildTree, type Node } from './utils/fileSystemBuilder'
import { setFileSystem } from './store/fileSystemSlice'
import CommandPrompt from './components/CommandPrompt'
import BackgroundStars from './components/BackgroundStars'
import SolarSystemPage from './components/SolarSystemPage'
import type { CommandResult } from './utils/commandHandler'
import './App.css'

export default function App() {
  const supabaseUrl = 'https://eewubybunnafnkzamvwp.supabase.co'
  const supabaseKey = "sb_publishable_PaF-_vrfXsey4lzkfs3VoA_qcZF0bzp"
  const supabase = createClient(supabaseUrl, supabaseKey)

  const dispatch = useDispatch()
  const location = useLocation()
  const [rootPanel, setRootPanel] = useState<'system' | null>(null)
  const showBackgroundStars = true
  const hasRouteSidebar = location.pathname !== '/'
  const hasSidebar = hasRouteSidebar || rootPanel !== null

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

  useEffect(() => {
    if (location.pathname !== '/')
      setRootPanel(null)
  }, [location.pathname])

  const handleCommandExecute = (_command: string, result: CommandResult) => {
    if (result.clear) {
      setRootPanel(null)
      return
    }

    if (result.panel)
      setRootPanel(result.panel)
  }

  return (
    <div className="app-stage">
      {showBackgroundStars && <BackgroundStars />}

      <main className={`app-shell app-shell-root ${hasSidebar ? 'app-shell-with-sidebar' : 'app-shell-centered'}`}>
        <div className="terminal-shell">
          <div className="terminal-container">
            <CommandPrompt onExecute={handleCommandExecute}>
              <p className="terminal-line">terminal-system v1.0.0</p>
              <p className="terminal-line">type a command and press run</p>
            </CommandPrompt>
          </div>
        </div>
        <div className={`sidebar-shell ${hasSidebar ? 'sidebar-shell-visible' : 'sidebar-shell-hidden'}`}>
          {location.pathname === '/' ? rootPanel === 'system' ? <SolarSystemPage /> : null : <Outlet />}
        </div>
      </main>
    </div>
  )
}
