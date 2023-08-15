import React, { useState, useRef, useEffect,useCallback } from 'react'
import "./home.css"
import HomeLeftBar from './HomeLeftBar'
import HomeRightBar from './HomeRightBar'
import { useLocation, useNavigate, NavLink } from 'react-router-dom'
import Playlistapi from "./apis/playlistApi.json"
import { Howl } from 'howler'
import SignupPage from '../authentication/SignupPage'
import SinginPage from '../authentication/SigninPage'
import {SigninContext} from "../context/SigninContext"
import { decodeJwt } from 'jose'
import axios  from 'axios'
import ForgotPassword from '../authentication/ForgotPassword'
const Home = () => {
    // user details context 
    const [userName,setUserName] = React.useState("")
    const [displayProfile,setDisplayProfile] = React.useState(false);
    const [profile,setProfile]=React.useState("")
    const [isAuthenticated, setAuthenticated] = React.useState(false);


    const [isSearchVisible, setSerchVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate()
    const location = useLocation()

  const [IsLoginSuccesful, setIsLoginSuccesful] = React.useState("");

  const [isPasswordResetSuccesful,setIsPasswordResetSuccesful] = useState("")
 
    useEffect(() => {
        if (window.location.hash === '#login' && !isAuthenticated) {
            const floationEle = document.getElementById('floating-element')
            floationEle.classList.add("move-upwards")
        } else if (!isAuthenticated) {
            const floationEle = document.getElementById('floating-element')
            floationEle.classList.remove("move-upwards")
        }
    }, [location]);


    useEffect( () => {
        const credential = localStorage.getItem("profile");
        // console.log(credential)
        if(credential){
            var payload =  credential ? decodeJwt(credential) : undefined
            // console.log(payload);
            if(payload){
                // console.log(payload);
                axios.get("/protected",{
                    headers : {
                        Authorization : `Bearer ${credential}`
                    }
                }).then( response => console.log(response.data)).catch(error => console.log(error))
            }
            setUserName(payload.family_name);
            setDisplayProfile(true)
            setProfile(payload.picture)
            setAuthenticated(true)
            navigate("/")
            setIsLoading(false); 
            return ;
        }
        const checkAuthentication = async () => {
            const cookie = localStorage.getItem("token");
            if(cookie){
                const tokenObject = { token: cookie };
                try {
                    const res = await fetch("/checkuser", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(tokenObject),
                    });
                    const data = await res.json();
                    console.log(data);
                    if (data === "successful") {
                        setAuthenticated(true);
                    }
                } catch (error) {
                    console.log(error);
                }
                setIsLoading(false); 
            }
        };
        setIsLoading(false)

        checkAuthentication();
    }, []);
 



    const handelCloseBtn = () => {
        navigate(-1);
    }
    // songs playing section 
    const [pauseButton, setPauseButton] = useState(true)
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioPos, setAudioPos] = useState(0); // Track the current audio position
    const soundRef = useRef(null);
    const [songPlayingInd, setSongPlayingInd] = useState(-1);
    const [soundVolume, setSoundVolume] = useState(1.0);
    const [VolumeSpeaker, setVolumeSpeaker] = useState("highVolume") // to show which speack muted low or high
    const [durationOfSong, setDurationOfSong] = useState(0);
    // current songPlaylist index
    const [referencePlaylistInd,setReferencePlaylistInd] = useState(-1)
    // song-details in footter section of the home 
    const [imgUrl, setImgUrl] = useState("#")
    const [songName, setSongName] = useState("")
    const [songDescription, setSongDescription] = useState("")
    const [loginSongImg,setLoginSongImg] = useState("");
    

    const latestSongPlayingInd = useRef(songPlayingInd);

    const handleClick =   (ind,referenceInd) => {
        // console.log("i am in handle click in home")
        setReferencePlaylistInd(referenceInd)
        console.log(referenceInd)
        const length = Playlistapi[referenceInd].songs.length
        console.log(ind);
        if (isAuthenticated) {
            if(ind < length){
                
                        // console.log(ele)
                        const ele = Playlistapi[referenceInd].songs[ind];
                        setSongPlayingInd(ind);
                        latestSongPlayingInd.current = ind;
                        const audio = ele.audio;
                        setImgUrl(ele.url)
                        setSongName(ele.title)
                        setSongDescription(ele.singer)
                        if (soundRef.current == null) {
                            soundRef.current = audio;
                            console.log(soundRef.current)
                            setAudioPos(0);
                            soundPlay(audio,referenceInd);
                            setIsPlaying(true); // Toggle the play/pause state
                        } else {
                            soundRef.current.pause();
                            soundRef.current = audio;
                            setAudioPos(0);
                            soundPlay(audio,referenceInd);
                            setIsPlaying(true); // Toggle the play/pause state
                        }
                    // console.log("handleCllick-"+ind)
                    // console.log(songPlayingInd)
            }else{
                console.log("i am end")
                soundRef.current=null;
                setAudioPos(0);
                setIsPlaying(false)
                setReferencePlaylistInd(-1);
                setImgUrl("#");
                setSongName("")
                setSongDescription("")
                setDurationOfSong(0)
                const songPlayedId = document.getElementById('songPlayedId');
                songPlayedId.style.setProperty('--song-slider-width', "0%");
                const volumeChange = document.getElementById('volumeChange');
                volumeChange.style.setProperty('--slider-width', 100 + '%');
                setSoundVolume(1)
            }
        } else {
            window.location.href = '#login';
            setLoginSongImg(Playlistapi[referenceInd].songs[ind].url)
        }
    }


    //   if login directly loaded the account data


    //reason for using useRef if not used samesong plays repetedly for refer screeshot useRefScreenshotWhilePlaying.png
    // en we update the state using useState, such as setSongPlayingInd(nextValue), the state update is asynchronous. 
    // That means the value of songPlayingInd might not be immediately updated inside the onend callback when the audio ends. 
    // This can lead to issues when trying to play the next song since the callback might refer to the stale value of songPlayingInd.

    // If we didn't use useRef and directly accessed the state variable songPlayingInd inside the onend callback, it would likely hold the stale value,
    //  causing issues like playing the same song repeatedly or unexpected behavior in handling the next song to be played.

    const soundPlay = (src,referenceInd) => {
        // console.log("i am soundPlay in home")
        
        const sound = new Howl({
            src,
            html5: true,
            onend: () => {
                setIsPlaying(false);
                setAudioPos(0);
                // Get the latest songPlayingInd value from the ref
                const nextSongPlayingInd = latestSongPlayingInd.current + 1;
                latestSongPlayingInd.current = nextSongPlayingInd; // Update the ref with the next value
                
                handleClick(nextSongPlayingInd,referenceInd)
            },
            onload: () => {
                setDurationOfSong(sound.duration());
            },
        });
        console.log(sound)
        soundRef.current = sound;
        // console.log(soundRef.current)
        setAudioPos(0);
        sound.play();
        setIsPlaying(true);
        // console.log("songPlayingId"+songPlayingInd)
    };

    const forward = () => {
        console.log("forward")
        const length = Playlistapi[referencePlaylistInd].songs.length
        if (songPlayingInd+1 < length) {
                const ele = Playlistapi[referencePlaylistInd].songs[songPlayingInd+1];
                const ind = songPlayingInd+1;
                    const audio = ele.audio;
                    soundRef.current.pause();
                    soundRef.current = audio;
                    setAudioPos(0);
                    soundPlay(audio,referencePlaylistInd);
                    setIsPlaying(true); // Toggle the play/pause state
                    setSongPlayingInd(ind);
                    latestSongPlayingInd.current = ind;
                    setImgUrl(ele.url)
                    setSongDescription(ele.singer)
                    setSongName(ele.title)
              
        }
    }

    const rewined = () => {
        console.log("rewined");
        if (songPlayingInd > 0) {
            console.log(soundRef.current.seek())
            if (soundRef.current.seek() > 2) {
                // console.log(soundRef.current._src)
                // soundRef.current._src is the current id path 
                soundRef.current.pause();
                setAudioPos(0);
                soundPlay(soundRef.current._src,referencePlaylistInd)
                setIsPlaying(true); // Toggle the play/pause state
            } else {
                    const ele = Playlistapi[referencePlaylistInd].songs[songPlayingInd-1];
                    const ind = songPlayingInd-1;
                        const audio = ele.audio;
                        soundRef.current.pause();
                        soundRef.current = audio;
                        setAudioPos(0);
                        soundPlay(audio,referencePlaylistInd);
                        setIsPlaying(true); // Toggle the play/pause state
                        setSongPlayingInd(ind);
                        latestSongPlayingInd.current = ind;
                        setImgUrl(ele.url)
                        setSongDescription(ele.singer)
                        setSongName(ele.title)
                 
            }
        }
    }
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!e.target.tagName.toLowerCase().match(/input|textarea/)) {
              if (e.code === "Space") {
                e.preventDefault(); // Prevent default behavior of space bar
                if (soundRef.current) {
                  if (isPlaying) {
                    // Pause the audio and store the current position
                    soundRef.current.pause();
                    setAudioPos(soundRef.current.seek());
                  } else {
                    // Resume audio playback from the stored position
                    soundRef.current.seek(audioPos);
                    soundRef.current.play();
                    setPauseButton(!pauseButton);
                  }
                  // Toggle the state variables
                  setIsPlaying(!isPlaying);
                }
              }
            }
          };
          
      
        // Add the event listener when the component mounts
        window.addEventListener("keydown", handleKeyPress);
      
        // Clean up the event listener when the component unmounts
        return () => {
          window.removeEventListener("keydown", handleKeyPress);
        };
      }, [isPlaying, audioPos]); // Include isPlaying and audioPos in the dependency array
      
      
    

    const handlePause = () => {
        console.log("handlePause")
        console.log(soundRef.current)
        // console.log(isPlaying)
        if (soundRef.current && isPlaying) {
            // console.log("playing")
            soundRef.current.pause();
            setAudioPos(soundRef.current.seek()); // Save the current audio position when pausing
            setIsPlaying(false);
            setPauseButton(false)
        } else if (soundRef.current && !isPlaying) {
            // console.log("not playing")
            soundRef.current.seek(audioPos);
            soundRef.current.play();
            setIsPlaying(true)
            setPauseButton(true);
        }
        const animation = document.getElementById("pause-play-div");
        animation.classList.add("scale-animation");
        setTimeout(() => {
            animation.classList.remove("scale-animation")
        }, 300);
    };

    const handleVolumeChange = (event) => {
        console.log("handleVolumeChange") 
        // console.log(soundRef.current)
        const newVolume = parseFloat(event.target.value); //event.target.value gives the string we need to convert into string use the parseFloat because setp we taken is 0.01
        const percentage = 100 - (1 - newVolume) * 100;
        if (soundRef.current) {
            setSoundVolume(newVolume); // Update the volume state with the new value
            soundRef.current.volume(newVolume); //updating volume of the song to the newVolume 
            // setting the volume speaker length
            const volumeChange = document.getElementById('volumeChange');
            volumeChange.style.setProperty('--slider-width', percentage + '%');

            if (percentage < 1) {
                setVolumeSpeaker("muted")
            } else if (percentage < 40) {
                setVolumeSpeaker("lowVolume")
            } else {
                setVolumeSpeaker("highVolume")
            }
        }else{
            const volumeChange = document.getElementById('volumeChange');
            volumeChange.style.setProperty('--slider-width', 100 + '%');
        }
    };

    const songSlider = (event) => {
        console.log("songSlider");
        const newaudioPosition = parseFloat(event.target.value);
        if (soundRef.current) {
            soundRef.current.seek(newaudioPosition); // Seek to the new position
            setAudioPos(newaudioPosition); // Update the audioPos state if needed

        }
    };

    const latestAudioPositionOfSong = useRef(audioPos);


    useEffect(() => {
        // changing the audioPosition while playing the song
        const updateAudioPosition = () => {
            if (soundRef.current && isPlaying) {
                const newAudioPos = soundRef.current.seek();
                setAudioPos(newAudioPos);
            }
        };

        //1000 milliseconds
        const audioPositionIntervalId = setInterval(updateAudioPosition, 1000);

        // changing the slider percentage while songPlaying
        const updatePercentage = () => {
            if (soundRef.current) {
                const newAudioPos = soundRef.current.seek();
                const percentage = (newAudioPos / durationOfSong) * 100;
                const songPlayedId = document.getElementById('songPlayedId');
                songPlayedId.style.setProperty('--song-slider-width', `${percentage}%`);
            }
        };

        // Start updating the percentage continuously
        const percentageIntervalId = setInterval(updatePercentage, 50);

        // Clean up the intervals when the component unmounts
        return () => {
            clearInterval(audioPositionIntervalId);
            clearInterval(percentageIntervalId);
        };
    }, [durationOfSong, isPlaying]);




    return (
        <>
        <SigninContext.Provider value={{userName,setUserName,displayProfile,setDisplayProfile,profile,setProfile,isAuthenticated, setAuthenticated,IsLoginSuccesful,setIsLoginSuccesful,soundRef,setAudioPos,isPlaying,setIsPlaying,setPauseButton,setImgUrl,setSongName,setSongDescription,songPlayingInd,setSongPlayingInd,referencePlaylistInd,soundRef,isPasswordResetSuccesful}} >

                {isLoading && 
                    <div className="loading-container">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                }
                <div className="main-container">
                    <div className="left-and-right-body-section">
                        <HomeLeftBar setState={setSerchVisible} isAuthenticated={isAuthenticated} />
                        <HomeRightBar search={isSearchVisible} setState={setSerchVisible} handleClick={handleClick} isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} handlePause={handlePause} />
                    </div>
                    {
                        isAuthenticated ?
                            (
                                <div className="footer-song-playing flex">
                                    <div className="footer-song-and-name flex">
                                        <img className="song-img-footer" src={imgUrl} alt="" />
                                        <div className="footer-song-name-and-description">
                                            <p>{songName}</p>
                                            <p>{songDescription}</p>
                                        </div>
                                    </div>

                                    <div className="song-forward-rewined-btn flex">
                                        <div className="paly-pause-footer flex">
                                            <i class="forward-step-icon increse-size fa-solid fa-forward-step fa-rotate-180 rewined" onClick={rewined} style={{ color: '#ffffff' }}></i>
                                            <div className="pause-play-div centering increse-size " id='pause-play-div'>
                                                {isPlaying ? (<i className="fa-sharp fa-solid fa-pause" style={{ color: '#000000' }} onClick={handlePause}></i>) : (<i className="play-logo-in-footer fa-sharp fa-solid fa-play" style={{ color: '#000000' }} onClick={handlePause}></i>)}
                                            </div>
                                            <i class="increse-size fa-solid fa-forward-step forward" onClick={forward} style={{ color: '#ffffff' }}></i>
                                        </div>
                                        <div className="songPlayedDetails centering">
                                            <input
                                                type="range"
                                                id='songPlayedId'
                                                className='songPlayed-input'
                                                min="0"
                                                max={`${durationOfSong}`}
                                                step="0.01"
                                                value={audioPos}
                                                onChange={songSlider}
                                            />
                                        </div>
                                    </div>
                                    <div className="volume-setting">
                                        <div className="speaker-symbol">
                                            {VolumeSpeaker == 'muted' ? <i class=" fa-solid fa-volume-xmark" style={{ color: '#ffffff' }}></i> : ""}
                                            {VolumeSpeaker == 'lowVolume' ? <i class=" fa-solid fa-volume-low" style={{ color: '#ffffff' }}></i> : ""}
                                            {VolumeSpeaker == 'highVolume' ? <i class="fa-solid fa-volume-high" style={{ color: '#ffffff' }}></i> : ""}
                                        </div>
                                        <input
                                            type="range"
                                            id='volumeChange'
                                            className='volume-controller'
                                            min="0"
                                            max="1"
                                            step="0.01"
                                            value={soundVolume}
                                            onChange={handleVolumeChange}
                                        />

                                    </div>

                                </div>) : (
                                <>
                                    <a href="#">
                                        <div className="footer-for-signup flex">
                                            <div className="footer-for-signup-content">
                                                <span>PREVIEW OF SPOTIFY</span>
                                                <br />
                                                <span>Sign up to get unlimited songs and podcasts with occasional ads.No credit card needed</span>
                                            </div>
                                            <div className="footer-signup-button">
                                                <NavLink to="/signup">
                                                    <button className='primary-button'>
                                                        Sign up for free
                                                    </button>
                                                </NavLink>
                                            </div>
                                        </div>
                                    </a>
                                </>
                            )
                    }
                </div>
                {
                    !isAuthenticated && (
                        <>
                            <div class="floating-element centering " id='floating-element'>
                                <div className="main-floating-signup flex">
                                    <img className='image-in-floation-signup' src={`${loginSongImg}`} alt="img" />
                                    <div className="floating-content-signup flex">
                                        <h1>Start listening with a free Spotify account</h1>
                                        <NavLink to="/signup"><button className='primary-button signup-for-free-btn'>sign up for free</button></NavLink>
                                        <NavLink to="https://www.spotify.com/in-en/download/windows/"><button className='primary-button download-for-free-btn'>Download app</button></NavLink>
                                        <p>Alerady have an account? <NavLink to="/signin">Login</NavLink></p>

                                    </div>
                                </div>
                                <button className='primary-button' onClick={handelCloseBtn}>close</button>
                            </div>

                        </>
                    )
                }

                <SinginPage setAuthenticated={setAuthenticated} isAuthenticated={isAuthenticated} />
                <SignupPage />
                <ForgotPassword setIsPasswordResetSuccesful={setIsPasswordResetSuccesful}/>
        </SigninContext.Provider>

        </>
    )
}
export default Home;