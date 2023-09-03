import { createSlice } from '@reduxjs/toolkit'
import {
  FETCH_LIBRARY_REQUEST,
  FETCH_LIBRARY_SUCCESS,
  FETCH_LIBRARY_FAILURE
} from "./actions/libraryActions"




// const BackendLocalHost_URL = "http://localhost:8000"
const BackendLocalHost_URL = ""
const BackendHostingSite_URL = "https://ill-shawl-lamb.cyclic.cloud"





const addToDb = async (title, url, playlistId,token) => {
  const requestBody = JSON.stringify({
    "title": title,
    "url": url,
    "playlistId": playlistId,
    "token": token,
  });

  console.log(requestBody);

  const res = await fetch(`${BackendLocalHost_URL}/addtolibrary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody
  })
  const data = await res.json();
  console.log(data)
}

const deleteFromDb = async (playlistId,token) => {
  const requestBody = JSON.stringify({
    "token": token,
    "playlistId": playlistId
  });
  console.log(requestBody);

  const res = await fetch(`${BackendLocalHost_URL}/removefromlibrary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody
  })
  const data = await res.json();
  console.log(data)
}


export const fetchLibraryData = () => async (dispatch,getState) => {
  dispatch(startLibraryDataLoading());
  const token = localStorage.getItem('token')
  try {
    const response = await fetch(`${BackendLocalHost_URL}/library`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch library data');
    }

    const data = await response.json();
    dispatch(setLibraryData(data));
  } catch (error) {
    console.error('Error fetching library data:', error);
    dispatch(setError(error.message));
  }
};




const initialState = {
  list: [], // Store fetched library data here
  loading: false,
  error: null,
};

export const librarySlice = createSlice({
  name: 'library',
  initialState,
  reducers: {
    addToLibrary: (state, action) => {
      const playlist = state.list.find((item) => item.playlistId == action.payload.playlistId)
      if (!playlist) {
        state.list.push(action.payload)
        const { title, url, playlistId, token } = action.payload
        addToDb(title, url, playlistId,token)
      }
    },
    removeFromLibrary: (state, action) => {
      state.list = state.list.filter((item) => item.playlistId != action.payload.playlistId)
      const { token, playlistId } = action.payload;
      console.log(token, playlistId)
      deleteFromDb(playlistId,token)
    },
    setLibraryData: (state, action) => {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    startLibraryDataLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { 
  addToLibrary, 
  removeFromLibrary,
   setLibraryData,
  startLibraryDataLoading,
  setError } = librarySlice.actions

export default librarySlice.reducer