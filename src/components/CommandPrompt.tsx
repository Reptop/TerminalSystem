import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { SubmitEventHandler, ReactNode } from 'react'
import { executeCommand, type CommandResult } from '../utils/commandHandler'
import type { RootState } from '../store/store'

// Created a new type to act as the argument type for the CommandPrompt component
type CommandPromptProps = {
  children?: ReactNode
  onExecute?: (command: string) => void
}

type TerminalEntry = {
  type: 'command' | 'output'
  content: string
  success?: boolean
}

// TODO: Wire onExecute to the backend API to execute and fetch command output
export default function CommandPrompt({ onExecute, children }: CommandPromptProps) {

  // useStates to keep track of dynamic values

  // `command` holds the current input value of the command field
  const [command, setCommand] = useState('')

  // `status` tracks whether a command has been submitted or not, which can be used to provide user feedback
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle')

  // `history` is an array that stores all previously submitted commands and their outputs
  const [history, setHistory] = useState<TerminalEntry[]>([])

  // Ref to the terminal output div for auto-scrolling
  const terminalOutputRef = useRef<HTMLDivElement>(null)

  // Get the Redux state for file system
  const fileSystemState = useSelector((state: RootState) => state.fileSystem)

  // Auto-scroll to bottom when history changes
  useEffect(() => {
    if (terminalOutputRef.current) {
      terminalOutputRef.current.scrollTop = terminalOutputRef.current.scrollHeight
    }
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

    // Add command to terminal history
    setHistory((prev) => [
      ...prev,
      {
        type: 'command' as const, // denotes TerminalEntry as a command type
        content: trimmedCommand // the contents of the trimmed command, i.e. "ls"
      },
      ...result.output.map((line) => ({ // maps the returned result from executeCommand() as TerminalEntry
        type: 'output' as const, // denotes TerminalEntry as a return type
        content: line, // the contents of the returned result, i.e "Command 'cat' not found"
        success: result.success, // whether the command was a success or a failure
      })),
    ])

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

        <div className="terminal-output" ref={terminalOutputRef}>

          {/* Command output can be rendered as children */}
          {children}

          {/* Render commands and their outputs */}
          {history.map((entry, index) => (
            entry.type === 'command' ? (
              <p key={index} className="terminal-line terminal-line-command">
                <span className="command-prefix" aria-hidden="true">
                  {'>'}
                </span>{' '}
                {entry.content}
              </p>
            ) : (
              <p key={index} className="terminal-line terminal-line-output">
                {entry.content}
              </p>
            )
          ))}
        </div>

        <form className="command-form" onSubmit={handleSubmit}>
          <label htmlFor="command-input" className="sr-only">
            Terminal command
          </label>

          <div className="command-field-wrap">

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
