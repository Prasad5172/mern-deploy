import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  list:[]
}

export const librarySlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    addToLibrary: (state,action) => {
      const playlist = state.list.find((item) => item.playlistId == action.payload.playlistId) 
      if(!playlist) {
        state.list.push(action.payload)
      }
    },
    removeFromLibrary: (state,action) => {
        state.list  = state.list.filter((item) => item.playlistId != action.payload.playlistId) 
        
    }
  },
})

// Action creators are generated for each case reducer function
export const { addToLibrary, removeFromLibrary, } = librarySlice.actions

export default librarySlice.reducer