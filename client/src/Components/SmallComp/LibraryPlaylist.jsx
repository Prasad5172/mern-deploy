import React, { useContext } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromLibrary } from '../../redux/cartReducer'

function LibraryPlaylist(props) {
  const { songPlaylingPlaylistId } = props
  // console.log(songPlaylingPlaylistId)
  const navigate = useNavigate();
  const dispatch = useDispatch()
  return (
    <>
      <div className="library-playlist" onClick={() => {
        navigate(`/playlist/${props.playlistId}`)
      }}>
        <img src={`${props.url}`} alt="image" className='library-image' />
        <div className='library-playlist-details'>
          <p>{props.title}</p>
          <p>Playlist</p>
        </div>
        {
          songPlaylingPlaylistId === props.playlistId && <i className="fa-solid fa-volume-high" style={{ color: "#00ff11", marginRight: "10px" }}></i>
        }

        <i className="fa-solid fa-trash" style={{ "color": "#a7a7a7" }} onClick={
          () => {
            var token = localStorage.getItem('token');
            console.log(token)
            if (!token) {
              token = localStorage.getItem('profile')
            }
            dispatch(removeFromLibrary({ ...props, "token": token }))
          }

        } key={props.playlistId}></i>
      </div>
    </>
  )
}

export default LibraryPlaylist
