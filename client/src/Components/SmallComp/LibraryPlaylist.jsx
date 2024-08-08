import React, { useState,useEffect } from 'react'
import {  useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { deleteFromDb } from '../../redux/library/Actions';

function LibraryPlaylist(props) {
  const { songPlaylingPlaylistId } = props
  // console.log(songPlaylingPlaylistId)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function TextWithEllipsis({ text, maxLength }) {
    const [truncatedText, setTruncatedText] = useState(text);
  
    useEffect(() => {
      if (text.length > maxLength) {
        setTruncatedText(text.slice(0, maxLength) + '...');
      } else {
        setTruncatedText(text);
      }
    }, [text, maxLength]);
  
    return <p>{truncatedText}</p>;
  }

  return (
    <>
      <div className="library-playlist" >
        <img src={`${props.image_url}`} alt="image" className='library-image' onClick={() => {
        navigate(`/playlist/${props.playlistId}`)
      }}/>
        <div className='library-playlist-details'onClick={() => {
        navigate(`/playlist/${props.playlistId}`)
      }}>
        <TextWithEllipsis  text={`${props.title}`} maxLength={6} />
          <p>Playlist</p>
        </div>
        {
          songPlaylingPlaylistId === props.playlistId && <i className="fa-solid fa-volume-high" style={{ color: "#00ff11", marginRight: "10px" }}></i>
        }
      <i className="fa-solid fa-trash" style={{ "color": "#a7a7a7" }} onClick={
          () => {
            var token = localStorage.getItem('token');
            if (!token) {
              token = localStorage.getItem('profile')
            }
            dispatch(deleteFromDb(props.playlistId,token))
          }
        } key={props.playlistId}></i>
      </div>
    </>
  )
}

export default LibraryPlaylist
