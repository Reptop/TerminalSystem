import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { TreeNode } from '../utils/fileSystemBuilder'

type FileSystemState = {
  root: TreeNode | null
  currentNodeId: string | null
}

const initialState: FileSystemState = {
  root: null,
  currentNodeId: null,
}

export const fileSystemSlice = createSlice({
  name: 'fileSystem',
  initialState,
  reducers: {
    setFileSystem: (state, action: PayloadAction<TreeNode>) => {
      state.root = action.payload
      state.currentNodeId = action.payload.id
    },

    navigateTo: (state, action: PayloadAction<string>) => {
      state.currentNodeId = action.payload
    },

    navigateToRoot: (state) => {
      if (state.root)
        state.currentNodeId = state.root.id
    },
  },
})

export const { setFileSystem, navigateTo, navigateToRoot } = fileSystemSlice.actions
export default fileSystemSlice.reducer
