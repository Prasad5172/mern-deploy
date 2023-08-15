import React, { useContext } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { SigninContext } from '../../context/SigninContext';
const SongInfo = (props) => {
  const { isPlaying, songPlayingInd,referencePlaylistInd } = useContext(SigninContext);
  const handleClickInSongInfo = () => {
    // console.log("i am in handleClickInSongInfo")
    props.handleClick(props.id,props.referenceInd)
  }

  return (
    <>
      <div className="song-info" >
        {(songPlayingInd == props.id && props.referenceInd == referencePlaylistInd ? (
          isPlaying ? <>
          <div class="bars-container ">
            <div class="bar hover-remove"></div>
            <div class="bar hover-remove"></div>
            <div class="bar hover-remove"></div>
            <div class="bar hover-remove"></div>
            {(isPlaying ? <i class="hover-change fa-sharp fa-solid fa-pause" style={{ color: "#ffffff" }}  onClick={() => props.handlePause()}></i> : <i className="hover-change fa-sharp fa-solid fa-play" style={{ color: '#ffffff' }}  onClick={() => props.handlePause()}></i>)}
          </div>
          </> : <><div className="num-status">
            <span className={`num-and-dot ${songPlayingInd == props.id && props.referenceInd == referencePlaylistInd ? "green-color" : ""}`}>{props.id + 1}</span>
            <span className="num-and-dot">
              <i className="song-status fa-solid fa-circle fa-2xs" style={{ color: '#00a6ff', transform: 'scale(0.80)' }}></i>
            </span>
            {
              (songPlayingInd == props.id && props.referenceInd == referencePlaylistInd ? (isPlaying ? <i class="hover-change fa-sharp fa-solid fa-pause" style={{ color: "#ffffff" }}  onClick={() => props.handlePause()}></i> : <i className="hover-change fa-sharp fa-solid fa-play" style={{ color: '#ffffff' }} onClick={() => props.handlePause()}></i>) : <i className="hover-change fa-sharp fa-solid fa-play" style={{ color: '#ffffff' }} onClick={() => props.handlePause()}></i>) 
            }
          </div></>
         
          
        ) : (
        <div className="num-status">
          <span className={`num-and-dot`}>{props.id + 1}</span>
          <span className="num-and-dot">
            <i className="song-status fa-solid fa-circle fa-2xs" style={{ color: '#00a6ff', transform: 'scale(0.80)' }}></i>
          </span>
          <i className="hover-change fa-sharp fa-solid fa-play" style={{ color: '#ffffff' }} onClick={handleClickInSongInfo}></i>
        </div>
        ))
      }
        <div className="song-image-section">
          <img className="song-logo" src={`${props.url}`} alt="img" />
          <div className="title-img">
            <p className={`song-lyrics ${songPlayingInd == props.id && props.referenceInd == referencePlaylistInd ? "green-color" : ""}`}>{props.title}</p>
            <div className="singers-div">
              <div className="e">E</div>
              <div className="singers-names">
                {props.singer} , {props.lady}
              </div>

            </div>
          </div>

        </div>

        <audio id="audioPlayer" controls style={{ display: 'none' }}>
          <source src={props.audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>

        <div className="plays ">
          <p className="plays-para">{props.plays}</p>
        </div>
        <div className="album ">
          <p>{props.album}</p>
        </div>
        <div className="duration">
          <i className="icon fa-regular fa-heart"></i>
          <p>{props.duration}</p>
          <i className="icon fa-solid fa-ellipsis"></i>
        </div>
      </div>
    </>
  );
};

export default SongInfo;
