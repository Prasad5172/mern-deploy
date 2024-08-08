import { ADD_TO_LIBRARY_FAILURE, ADD_TO_LIBRARY_REQUEST, ADD_TO_LIBRARY_SUCCESS, DELETE_FROM_LIBRARY_FAILURE, DELETE_FROM_LIBRARY_REQUEST, DELETE_FROM_LIBRARY_SUCCESS, FETCH_LIBRARY_FAILURE, FETCH_LIBRARY_REQUEST, FETCH_LIBRARY_SUCCESS } from './ActionType';
import { API_BASE_URL } from '../../config/apiConfig';





export const addToDb =  (title, url, playlistId, token) => async(dispatch) => {
  dispatch({type:ADD_TO_LIBRARY_REQUEST})
  const requestBody = JSON.stringify({
    "title": title,
    "url": url,
    "playlistId": playlistId,
    "token": token,
  });
try {
// console.log(requestBody)
  const res = await fetch(`${API_BASE_URL}/addtolibrary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: requestBody
  })
  const data = await res.json();
  // console.log(data)
  dispatch({type:ADD_TO_LIBRARY_SUCCESS, payload : data})
} catch (error) {
  dispatch({type:ADD_TO_LIBRARY_FAILURE,payload:error.message})
}
}

export const deleteFromDb = (playlistId, token) =>  async (dispatch) => {
  console.log("deletefromdb")
  dispatch({type:DELETE_FROM_LIBRARY_REQUEST})
  try {
    const requestBody = JSON.stringify({
      "token": token,
      "playlistId": playlistId
    });
    const res = await fetch(`${API_BASE_URL}/removefromlibrary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody
    })
    if(res.ok){
      console.log("succesful deletion of playlist")
      dispatch({type:DELETE_FROM_LIBRARY_SUCCESS,payload:playlistId})
    }
  } catch (error) {
    dispatch({type:DELETE_FROM_LIBRARY_FAILURE,payload:error.message})
  } 
}


export const fetchLibraryData = () => async (dispatch) => {
  dispatch({type:FETCH_LIBRARY_REQUEST});
  const token = localStorage.getItem('token')
  try {
    const response = await fetch(`${API_BASE_URL}/library`, {
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
    dispatch({type:FETCH_LIBRARY_SUCCESS,payload:data});
  } catch (error) {
    dispatch({type:FETCH_LIBRARY_FAILURE,payload:error.message});
  }
};
