import { useState } from 'react'
import type { SubmitEventHandler, ReactNode } from 'react'

// Created a new type to act as the argument type for the CommandPrompt component
type CommandPromptProps = {
  children?: ReactNode
  onExecute?: (command: string) => void
}

// TODO: Wire onExecute to the backend API to execute and fetch command output
export default function CommandPrompt({ onExecute, children }: CommandPromptProps) {

  // useStates to keep track of dynamic values

  // `command` holds the current input value of the command field
  const [command, setCommand] = useState('')

  // `status` tracks whether a command has been submitted or not, which can be used to provide user feedback
  const [status, setStatus] = useState<'idle' | 'submitted'>('idle')

  // `history` is an array that stores all previously submitted commands. Thiis is optional tbh
  const [history, setHistory] = useState<string[]>([])

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()

    const trimmed = command.trim()

    // Break out if the user does something stupid
    if (!trimmed)
      return

    // Setting the useStates here 
    setHistory((prev) => [...prev, trimmed])
    onExecute?.(trimmed)
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
      <h2 id="command-prompt-heading">terminalsystem</h2>
      <p className="prompt-copy">enter terminal commands and view output below</p>

      <div className="terminal-window" role="region" aria-label="Terminal output">

        <div className="terminal-output">

          {/* Command output can be rendered as children */}
          {children}

          {/* Simple array mapping to a p-tag */}
          {history.map((item, index) => (
            <p key={`${item}-${index}`} className="terminal-line terminal-line-command">
              <span className="command-prefix" aria-hidden="true">
                {'>'}
              </span>{' '}
              {item}
            </p>
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
