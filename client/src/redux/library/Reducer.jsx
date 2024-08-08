import { ADD_TO_LIBRARY_FAILURE, ADD_TO_LIBRARY_REQUEST, ADD_TO_LIBRARY_SUCCESS, DELETE_FROM_LIBRARY_FAILURE, DELETE_FROM_LIBRARY_REQUEST, DELETE_FROM_LIBRARY_SUCCESS, FETCH_LIBRARY_FAILURE, FETCH_LIBRARY_REQUEST, FETCH_LIBRARY_SUCCESS } from './ActionType';



const BackendLocalHost_URL = "http://localhost:8000"
// const BackendLocalHost_URL = ""
const BackendHostingSite_URL = "https://ill-shawl-lamb.cyclic.cloud"








const initialState = {
  list: [], // Store fetched library data here
  loading: false,
  error: null,
};


export const libraryReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_LIBRARY_REQUEST:
      return { ...state, loading: true, error: null }
    case FETCH_LIBRARY_SUCCESS:
      return { ...state, loading: false, error: null, list: action.payload }
    case FETCH_LIBRARY_FAILURE:
      return { ...state, loading: true, error: action.payload }
    case ADD_TO_LIBRARY_REQUEST:
      return { ...state, loading: true, error: null }
    case ADD_TO_LIBRARY_SUCCESS:
      return { ...state, loading: false, error: null,list:[ ...action.payload] }
    case ADD_TO_LIBRARY_FAILURE:
      return { ...state, loading: true, error: null }
    case DELETE_FROM_LIBRARY_REQUEST:
      return { ...state, loading: true, error: null }
    case DELETE_FROM_LIBRARY_SUCCESS:
      return {
        ...state,
        loading: false,
        list: state.list.filter(
          (item) => item.playlistId != action.payload
        )
      }
    case DELETE_FROM_LIBRARY_FAILURE:
      return { ...state, loading: true, error: null }
    default:
      return state
  }
}








