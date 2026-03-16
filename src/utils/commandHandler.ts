import { findNode, getCurrentPath, type TreeNode } from './fileSystemBuilder'
import type { RootState } from '../store/store'

export type CommandResult = {
  success: boolean
  output: string[]
}

type CommandContext = {
  getState: () => RootState
}

const createCommands = (context: CommandContext) => {
  const { getState } = context

  const commands: Record<string, (args?: string) => CommandResult> = {
    help: () => ({
      success: true,
      output: [
        'Available Commands:',
        '  help       - Display this help message',
        '  ls         - List directory contents',
        '  pwd        - Print working directory',
        '  info       - Display system information and documentation',
      ],
    }),

    ls: () => {
      const state = getState()
      const { root, currentNodeId } = state.fileSystem

      if (!root || !currentNodeId) {
        return {
          success: false,
          output: ['Error: File system not loaded'],
        }
      }

      const currentNode = findNode(root, currentNodeId)
      if (!currentNode) {
        return {
          success: false,
          output: ['Error: Current node not found'],
        }
      }

      if (currentNode.children.length === 0) {
        return {
          success: true,
          output: ['(empty directory)'],
        }
      }

      return {
        success: true,
        output: [
          currentNode.children
            .map(child => `/${child.name}`)
            .join('       '),
        ],
      }
    },

    pwd: () => {
      const state = getState()
      const { root, currentNodeId } = state.fileSystem

      if (!root || !currentNodeId) {
        return {
          success: false,
          output: ['Error: File system not loaded'],
        }
      }

      const path = getCurrentPath(root, currentNodeId)
      return {
        success: true,
        output: [path],
      }
    },

    info: () => ({
      success: true,
      output: ['Opening system information...'],
      navigate: '/info',
    } as CommandResult & { navigate: string }),

    clear: () => ({
      success: true,
      output: ['cleared'],
    }),
  }

  return commands
}

export function executeCommand(
  commandInput: string,
  context: CommandContext
): CommandResult {
  const parts = commandInput.split(' ')
  const command = parts[0]
  const args = parts.length > 1 ? parts.slice(1).join(' ') : undefined

  const commands = createCommands(context)

  if (command in commands) {
    return commands[command]!(args)
  }

  return {
    success: false,
    output: [`Command not found: ${commandInput}`, 'Type "help" for available commands'],
  }
}
