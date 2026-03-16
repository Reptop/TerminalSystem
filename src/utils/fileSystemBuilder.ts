export type Node = {
  id: string
  name: string
  type: string
  parent_id?: string
  description?: string
  stats?: Record<string, any>
  facts?: Record<string, any>
  renderable?: boolean
  created_at?: string
}

export type TreeNode = {
  id: string
  name: string
  type: string
  description?: string
  stats?: Record<string, any>
  facts?: Record<string, any>
  renderable?: boolean
  children: TreeNode[]
}

export function buildTree(nodes: Node[]): TreeNode {
  const nodeMap = new Map(
    nodes.map(n => [n.id, { ...n, children: [] as TreeNode[] } as TreeNode])
  )

  for (const [id, node] of nodeMap.entries()) {
    if (node.parent_id) {
      const parent = nodeMap.get(node.parent_id)

      if (parent)
        parent.children.push(node)
    }
  }

  // Find and return root node (the one with no parent)
  const rootNode = Array.from(nodeMap.values()).find(n => !n.parent_id)
  if (!rootNode)
    throw new Error('No root node found')
  return rootNode
}

// Find the node using DFS tree traversal
export function findNode(root: TreeNode, id: string): TreeNode | null {
  // if root is the node, return the root
  if (root.id === id)
    return root

  // check within children of root for node
  for (const child of root.children) {
    const found = findNode(child, id)

    // if node is found, return the node
    if (found)
      return found
  }
  return null
}

// Traverse upwards through the tree, looking for node's parent
export function findNodeParent(root: TreeNode, id: string): TreeNode | null {
  const queue = [root]

  while (queue.length > 0) {
    const node = queue.shift()!

    if (node.children.some(c => c.id === id))
      return node

    queue.push(...node.children)
  }
  return null
}

export function getCurrentPath(fileSystem: TreeNode, currentNodeId: string): string {
  const path: string[] = []
  let current: TreeNode | null = findNode(fileSystem, currentNodeId)

  // while a node is not null, search for parent
  while (current) {
    path.unshift(current.name)
    current = findNodeParent(fileSystem, current.id)
  }

  return '/' + path.join('/')
}
