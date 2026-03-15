export type CommandResult = {
  success: boolean
  output: string[]
}

// Record: Constructs an object type whose property keys are Keys and whose property values are Type.
// https://www.typescriptlang.org/docs/handbook/utility-types.html
const commands: Record<string, () => CommandResult> = {
  help: () => ({
    success: true,
    output: [
      'Available Commands:',
      '  help       - Display this help message',
      '  ls         - List directory contents',
      '  clear      - Clear terminal history',
      '',
      'Usage: Type a command and press Enter or click Run',
    ],
  }),
}

export function executeCommand(commandInput: string): CommandResult {
  const [command] = commandInput.split(' ')

  if (command in commands) {
    return commands[command]!()
  }

  return {
    success: false,
    output: [`Command not found: ${commandInput}`, 'Type "help" for available commands'],
  }
}
