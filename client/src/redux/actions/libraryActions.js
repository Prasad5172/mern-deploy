// actions/libraryActions.js
import { fetchLibraryData } from '../cartReducer'; // Import your API function

// Action types
export const FETCH_LIBRARY_REQUEST = 'FETCH_LIBRARY_REQUEST';
export const FETCH_LIBRARY_SUCCESS = 'FETCH_LIBRARY_SUCCESS';
export const FETCH_LIBRARY_FAILURE = 'FETCH_LIBRARY_FAILURE';

export const fetchLibrary = () => async (dispatch) => {
  dispatch({ type: FETCH_LIBRARY_REQUEST });

  try {
    const data = await fetchLibraryData(); // Use your API function to fetch data
    dispatch({ type: FETCH_LIBRARY_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: FETCH_LIBRARY_FAILURE, payload: error });
  }
};
