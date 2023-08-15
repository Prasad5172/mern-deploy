import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { SigninContext } from '../context/SigninContext'
const Card = (props) => {
    const { isPlaying, referencePlaylistInd,soundRef } = useContext(SigninContext)
    return (
        <>
            <div className="card">
                <NavLink to={`playlist/${props.playlistId}`}>
                    <div className="image-container-card">
                        <div className="play-img-div" style={{ background: `url(${props.url}) no-repeat center / cover` }}>

                        </div>
                        <div className="para">
                            <p className='p1'>{props.title}</p>
                            <p className='p2'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores, soluta.</p>
                        </div>
                    </div>
                </NavLink>
                <div className={`play-symbol play-symbol-in-playlist ${isPlaying && props.identity == referencePlaylistInd ? "opacity_1" : ""}`} onClick={() => {
                    if(props.identity == referencePlaylistInd && soundRef.current != null){
                        props.handlePause()
                    }else {
                        props.handleClick(0,props.identity);
                    }
                }}>
                    <i className={`fa-sharp fa-solid ${isPlaying && props.identity == referencePlaylistInd ? "fa-pause" : "fa-play"} play-icon-in-playlist`} style={{ color: "#121212" }} />
                </div>
            </div>
        </>
    )
}
export default Card;