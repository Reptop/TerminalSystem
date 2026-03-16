import { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import type { SubmitEventHandler, ReactNode } from 'react'
import { executeCommand, type CommandResult } from '../utils/commandHandler'
import { getCurrentPath } from '../utils/fileSystemBuilder'
import { navigateTo } from '../store/fileSystemSlice'
import type { RootState } from '../store/store'

// Created a new type to act as the argument type for the CommandPrompt component
type CommandPromptProps = {
  children?: ReactNode
  onExecute?: (command: string) => void
}

type CommandBlock = {
  command: string
  output: string[]
  success: boolean
}

export default function CommandPrompt({ onExecute, children }: CommandPromptProps) {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // `command` holds the current input value of the command field
  const [command, setCommand] = useState('')

  // `status` tracks whether a command has been submitted or not, which can be used to provide user feedback
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle')

  // `history` stores each command together with its output block.
  const [history, setHistory] = useState<CommandBlock[]>([])

  // Ref to the terminal output div for auto-scrolling
  const terminalOutputRef = useRef<HTMLDivElement>(null)

  // Get the Redux state for file system
  const fileSystemState = useSelector((state: RootState) => state.fileSystem)

  // Get the current path if its defined, otherwise start at the root path
  const currentPath = fileSystemState.root && fileSystemState.currentNodeId
    ? getCurrentPath(fileSystemState.root, fileSystemState.currentNodeId)
    : '/terminal-system'

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalOutputRef.current)
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight

  }, [history])

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const trimmedCommand = command.trim().toLowerCase()

    // Break out if the user does something stupid
    if (!trimmedCommand)
      return

    // Execute the command with Redux context
    const result: CommandResult = executeCommand(trimmedCommand, {
      getState: () => ({ fileSystem: fileSystemState }) as RootState
    })

    if (result.clear) {
      setHistory([])

      // Navigate back to root in case info is open
      navigate('/')
    }

    else {
      // Store the command and its output together so they can render as one section.
      setHistory((prev) => [
        ...prev,
        {
          command: trimmedCommand,
          output: result.output,
          success: result.success,
        },
      ])
    }

    // Handle info command - navigate to info page
    if (result.navigate)
      navigate(result.navigate)

    // For the cd command
    if (result.nextNodeId)
      dispatch(navigateTo(result.nextNodeId))

    onExecute?.(trimmedCommand)
    setStatus('submitted')
    setCommand('')

    // Timout if the user submits a command, we set the status back to idle after 1.2 seconds
    // This can change based on API response time
    window.setTimeout(() => {
      setStatus('idle')
    }, 1200)
  }

  return (
    <section className="command-card" aria-labelledby="command-prompt-heading">

      <div className="terminal-window" role="region" aria-label="Terminal output">
        <div className="terminal-prompt-bar">
          <div className="terminal-prompt-row">
            <span className="terminal-badge">terminal-system</span>
            <span className="terminal-prompt-label">session</span>
            <span className="terminal-prompt-value">interactive shell</span>
            <span className="terminal-prompt-separator" aria-hidden="true">
              /
            </span>
            <span className="terminal-prompt-label">mode</span>
            <span className="terminal-prompt-value terminal-prompt-value-active">
              {status === 'submitted' ? 'running' : 'ready'}
            </span>
          </div>

          <div className="terminal-path-row">
            <span className="terminal-path-glyph" aria-hidden="true">
              &gt;
            </span>
            <span className="terminal-path-copy">path</span>
            <code className="terminal-path">{currentPath}</code>
          </div>
        </div>

        <div className="terminal-output" ref={terminalOutputRef}>

          {/* Command output can be rendered as children */}
          {children}

          {/* Render each command and its output as a single grouped block. */}
          {history.map((entry, index) => (
            <div
              key={`${entry.command}-${index}`}
              className={`terminal-block ${entry.success ? 'terminal-block-success' : 'terminal-block-error'}`}
            >
              <p className="terminal-line terminal-line-command">
                <span className="command-prefix" aria-hidden="true">
                  {'>'}
                </span>{' '}
                {entry.command}
              </p>

              {entry.output.length > 0 && (
                <div className="terminal-result">
                  {entry.output.map((line, outputIndex) => (
                    <p key={`${line}-${outputIndex}`} className="terminal-line terminal-line-output">
                      {line}
                    </p>
                  ))}
                </div>
              )}

            </div>
          ))}
        </div>

        <form className="command-form" onSubmit={handleSubmit}>
          <label htmlFor="command-input" className="sr-only">
            Terminal command
          </label>

          <div className="command-field-wrap">
            <span className="command-context">{currentPath}</span>
            <span className="command-prefix" aria-hidden="true">
              {'>'}
            </span>

            <input
              id="command-input"
              name="command"
              type="text"
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              placeholder="ls"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <button type="submit">
            {status === 'submitted' ? 'queued ->' : 'run ->'}
          </button>

        </form>
      </div>
    </section>
  )
}
