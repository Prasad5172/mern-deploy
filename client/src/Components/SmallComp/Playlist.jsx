import React, { useState, useRef, useEffect, useContext } from 'react'
import logo from "../../../src/logo.png"
import { useParams } from 'react-router-dom'
import "../home.css"
import SongInfo from './SongInfo'
import Playlistapi from "../apis/playlistApi.json"
import { SigninContext } from '../../context/SigninContext'
import { useDispatch, useSelector } from 'react-redux'
import { addToDb, fetchLibraryData } from '../../redux/library/Actions'
const Playlist = (props) => {
    var token = localStorage.getItem('token');
    // console.log(token)
    if (!token) {
        token = localStorage.getItem('profile')
    }
    // console.log(token)
    const { handleClick, handlePause, isPlaying, referencePlaylistInd, soundRef, isAuthenticated } = useContext(SigninContext)
    const dispatch = useDispatch()
    const list = useSelector(state => state.library.list)
    const { id } = useParams()

    useEffect(() => {
        dispatch(fetchLibraryData())
    },[dispatch])
    
    return (
        <>
            {
                Playlistapi.map((ele1, ind1) => {
                    if (id === ele1.playlistId) {
                        return (
                            <>
                                <div className="playlist-main-right-div" key={ele1.playlistId} >
                                    <div className="playlist-main-container">
                                        <div className="playlist-header-section flex">
                                            <img className="bts" src={`${ele1.image_url}`} alt="BTS" />
                                            <div className="playlist-header-section-content">
                                                <div className="playlist-header-section-main-header">
                                                    <p>Playlist</p>
                                                    <p className='p1'>{ele1.title}</p>
                                                </div>
                                                <div className="about-spotify-in-playlist">
                                                    <p>{ele1.description}</p>
                                                    <div className="about-playlist flex">
                                                        <img className="spotify-logo-playlist" src={logo} alt="Logo" />
                                                        <a href="/" style={{ color: "white" }} className='spotify-link'>Spotif </a>
                                                        <span>. 11111 Likes </span>
                                                        <span>. 100 songs,about 5h</span>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="play-playlist-logo-section flex">
                                        <div className="play-symbol-in-playlist" onClick={
                                            () => {

                                                if (ind1 == referencePlaylistInd && isPlaying) {
                                                    handlePause()
                                                } else {
                                                    handleClick(0, ind1, false);
                                                }
                                            }}>
                                            <i className={`fa-sharp fa-solid ${isPlaying && ind1 == referencePlaylistInd ? "fa-pause" : "fa-play"} play-icon-in-playlist`} style={{ color: "#121212" }} />
                                        </div>
                                        <i className="love   fa-regular fa-heart" onClick={
                                            () => {
                                                if (isAuthenticated) {
                                                    // console.log(list)
                                                    const playlist = list.filter((item) => item.playlistId == ele1.playlistId)
                                                    // console.log(playlist)
                                                    if (playlist.length == 0 ) {
                                                        dispatch(addToDb(ele1.title, ele1.image_url, ele1.playlistId, token))
                                                    }
                                                } else {
                                                    window.location.href = '#login';
                                                    // setLoginSongImg(Playlistapi[referenceInd].url)
                                                }
                                            }
                                        }></i>
                                        {/* <i className="dots  fa-solid fa-ellipsis"></i> */}
                                    </div>
                                    <div className="playlist-table-header">
                                        <div className="song-info header-in-playlist">
                                            <div className="num-status hash-header">
                                                <p>#</p>
                                            </div>
                                            <div className="song-image-section">
                                                <p>Title</p>
                                            </div>
                                            <div className='plays '>
                                                <p>Plays</p>
                                            </div>
                                            <div className='album '>
                                                <p>Albums</p>
                                            </div>
                                            <div className="duration">
                                                <i className="fa-solid fa-stopwatch" style={{ color: "#a7a7a7" }}></i>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className='horizontalLine' />
                                    <div className="playlist-songs-list">
                                        {
                                            ele1.songs.map((ele, ind) => {
                                                return <SongInfo {...ele} id={ind} referenceInd={ind1} handleClick={handleClick} handlePause={handlePause} />
                                            })
                                        }
                                    </div>
                                </div>
                            </>
                        )
                    }
                })
            }
        </>
    )
};

{/* Playlistapi[0].songs.map((ele, ind) => {
                            return <SongInfo {...ele} id={ind} handleClick={props.handleClick} handlePause={props.handlePause} />
                        }) */}
export default Playlist;
