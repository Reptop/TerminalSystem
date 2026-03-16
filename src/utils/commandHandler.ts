import { findNode, findNodeParent, getCurrentPath } from './fileSystemBuilder'
import type { RootState } from '../store/store'

export type CommandResult = {
  success: boolean
  output: string[]
  clear?: boolean
  navigate?: string
  nextNodeId?: string
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
        '  fastfetch  - Display system summary',
        '  ls         - List directory contents',
        '  pwd        - Print working directory',
        '  cd <name>  - Change directory',
        '  render <x> - Render the current celestial body',
        '  info       - Display system information and documentation',
        '  clear      - Clear terminal history',
      ],
    }),

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

      if (!args) {
        return {
          success: false,
          output: ['Usage: render <object>', 'Example: render sun'],
        }
      }

      const currentNode = findNode(root, currentNodeId)
      if (!currentNode) {
        return {
          success: false,
          output: ['Error: Current node not found'],
        }
      }

      const targetName = args.toLowerCase()
      const renderAssets: Record<string, string> = {
        sun: '/sun/scene.gltf',
        mercury: '/mercury/scene.gltf',
        venus: '/venus/scene.gltf',
        earth: '/earth.glb',
        mars: '/mars.glb',
        jupiter: '/jupiter/scene.gltf',
        moon: '/moon/scene.gltf',
        saturn: '/saturn_planet.glb',
        uranus: '/uranus/scene.gltf',
        neptune: '/neptune/scene.gltf',
      }

      const assetPath = renderAssets[targetName]
      if (!assetPath) {
        return {
          success: false,
          output: [`render: no renderer available for ${args}`],
        }
      }

      if (currentNode.name.toLowerCase() !== targetName) {
        return {
          success: false,
          output: [`render: navigate to /${targetName} before rendering it`],
        }
      }

      return {
        success: true,
        output: [`Opening ${targetName} render...`],
        navigate: `/${targetName}`,
      }
    }, 
    
    inspect: (args) => {
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
          output: ['Usage: inpsect <object>', 'Example: inspect sun'],
        }
      }

      return {
        success: true,
        output: [`Opening inspect render...`],
        navigate: `/inspect`,
      } 
    }
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

  if (command in commands)
    return commands[command]!(args)

  return {
    success: false,
    output: [`Command not found: ${commandInput}`, 'Type "help" for available commands'],
  }
}
