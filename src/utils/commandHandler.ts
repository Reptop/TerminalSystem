import { findNode, findNodeParent, getCurrentPath } from './fileSystemBuilder'
import type { RootState } from '../store/store'
import { SCENE_CONFIG } from '../router'

export type CommandResult = {
  success: boolean
  output: string[]
  clear?: boolean
  navigate?: string
  nextNodeId?: string
  panel?: 'system'
}

type CommandContext = {
  // Commands use this to read the latest Redux-backed application state.
  getState: () => RootState
}

const createCommands = (context: CommandContext) => {
  const { getState } = context

  // This is the command lookup table.
  // Example:
  // - user types `pwd`
  // - `executeCommand(...)` parses that into the command name `pwd`
  // - we then run `commands.pwd()`
  //
  // Each command returns a plain result object instead of mutating React state directly.
  // The terminal component reads that result and decides how to update the UI.
  const commands: Record<string, (args?: string) => CommandResult> = {
    help: () => ({
      success: true,
      output: [
        'Available Commands:',
        '  help       - Display this help message',
        '  fastfetch  - Display system summary',
        '  ls         - List directory contents',
        '  pwd        - Print working directory',
        '  cd <name>  - Change directory',
        '  render     - Render the current celestial body or solar system',
        '  info       - Display system information and documentation',
        '  inspect    - Display specific planet information',
        '  clear      - Clear terminal history',
      ],
    }),

    // For each command, we get the fileSystem state slice
    // Then we check if the file system is loaded and if the current node exists
    // Finally we return a formatted output based on the current node's properties
    fastfetch: () => {
      const state = getState()
      const { root, currentNodeId } = state.fileSystem

      if (!root || !currentNodeId) {
        return {
          success: false,
          output: ['Error: File system not loaded'],
        }
      }

      const currentNode = findNode(root, currentNodeId)
      const currentPath = getCurrentPath(root, currentNodeId)
      const lines = [
        ['host', 'solar-system-sim'],
        ['root', '/solar-system'],
        ['path', currentPath],
        ['node', currentNode?.name ?? 'unknown'],
        ['type', currentNode?.type ?? 'unknown'],
        ['renderable', currentNode?.renderable ? 'yes' : 'no'],
      ]
      const labelWidth = Math.max(...lines.map(([label]) => label.length))

      return {
        success: true,
        output: [
          ...lines.map(([label, value]) => `${label.padEnd(labelWidth, ' ')} : ${value}`),
        ],
      }
    },

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

    cd: (args) => {
      const state = getState()
      const { root, currentNodeId } = state.fileSystem

      if (!root || !currentNodeId) {
        return {
          success: false,
          output: ['Error: File system not loaded'],
        }
      }

      if (!args) {
        return {
          success: false,
          output: ['Usage: cd <directory>', 'Try "cd .." or "cd /"'],
        }
      }

      const currentNode = findNode(root, currentNodeId)
      if (!currentNode) {
        return {
          success: false,
          output: ['Error: Current node not found'],
        }
      }

      if (args === '/') {
        return {
          success: true,
          output: [getCurrentPath(root, root.id)],
          nextNodeId: root.id,
        }
      }

      if (args === '..') {
        const parentNode = findNodeParent(root, currentNodeId)

        if (!parentNode) {
          return {
            success: true,
            output: [getCurrentPath(root, currentNodeId)],
            nextNodeId: currentNodeId,
          }
        }

        return {
          success: true,
          output: [getCurrentPath(root, parentNode.id)],
          nextNodeId: parentNode.id,
        }
      }

      const targetNode = currentNode.children.find(
        (child) => child.name.toLowerCase() === args.toLowerCase(),
      )

      if (!targetNode) {
        return {
          success: false,
          output: [`cd: no such directory: ${args}`],
        }
      }

      return {
        success: true,
        output: [getCurrentPath(root, targetNode.id)],
        nextNodeId: targetNode.id,
      }
    },

    info: () => ({
      success: true,
      output: ['Opening system information...'],
      navigate: '/info',
    }),

    clear: () => ({
      success: true,
      output: [],
      clear: true,
    }),

    render: (args) => {
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

      // At the root, `render` opens the full solar-system panel instead of navigating
      // to a planet-specific route.
      if (currentNodeId === root.id) {
        if (args && args !== 'system') {
          return {
            success: false,
            output: ['Usage: render', 'Optional alias: render system'],
          }
        }

        return {
          success: true,
          output: ['Opening solar system render...'],
          panel: 'system',
        }
      }

      if (!currentNode.renderable) {
        return {
          success: false,
          output: ['Error: This celestial entity is not renderable'],
        }
      }

      // Non-root renders use the current directory name to decide which routed scene to open.
      const targetName = currentNode.name.toLowerCase()
      const config = SCENE_CONFIG[targetName as keyof typeof SCENE_CONFIG]

      if (!config) {
        return {
          success: false,
          output: [`Render: no renderer available for ${args}`],
        }
      }

      return {
        success: true,
        output: [`Opening ${targetName} render...`],
        navigate: `/render/${targetName}`,
      }
    },

    inspect: () => {
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

      const targetName = currentNode.name.toLowerCase()

      return {
        success: true,
        output: [`Opening inspect render regarding ${targetName}...`],
        navigate: `/inspect/${targetName}`,
      }
    }
  }

  return commands
}

export function executeCommand(
  commandInput: string,
  context: CommandContext
): CommandResult {
  // commandInput is the raw string the user typed into the terminal
  // context is where we are in the file system 
  const parts = commandInput.split(' ')
  const command = parts[0]
  const args = parts.length > 1 ? parts.slice(1).join(' ') : undefined

  // Build the command table using the provided context so each handler can call `getState()`
  // when it needs to know where the user currently is in the tree.
  const commands = createCommands(context)

  // If the parsed command exists, execute it and pass the optional argument string.
  if (command in commands)
    return commands[command]!(args)

  // Unknown commands still return a normal result object so the terminal can render
  // the error just like any other command output.
  return {
    success: false,
    output: [`Command not found: ${commandInput}`, 'Type "help" for available commands'],
  }
}
