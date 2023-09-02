import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleChevronLeft, faCircleChevronRight, faMinus, faMagnifyingGlass, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { SigninContext } from '../context/SigninContext';
import Tooltip from '@mui/material/Tooltip';
import { googleLogout } from '@react-oauth/google';
import { all } from 'axios';



const Navbar = () => {
    const BackendUrl = "http://localhost:8000"
    // using context
    const { userName,setUserName,displayProfile,setDisplayProfile,profile,setIsLoginSuccesful,soundRef,setAudioPos,setIsPlaying,setPauseButton,setImgUrl,setSongName,setSongDescription,setSongPlayingInd,isSearchVisible,setSerchVisible,isAuthenticated,setAuthenticated} = useContext(SigninContext);
    const [num, setNum] = useState(-1)
    const [button, setButton] = useState(true);
    const [click, setClick] = useState(false);
    const [isAccountDetailsVisible, setAccountDeteilsVisible] = useState(false)
    useEffect(() => {
        if (isSearchVisible) {
            const inputField = document.getElementById('middle');
            inputField.focus();
        }
    }, [isSearchVisible])

    const handelClick = () => {
        navigate(-1)  //by using this i am able to go back to previous page
        setSerchVisible(false)
    }
    const navigate = useNavigate()

    const showButton = () => {
        if (window.innerWidth <= 960) {
            setButton(false)
            setClick(true)
        } else {
            setButton(true);
        }
    }
    window.addEventListener("resize", showButton)


    const handelClickBars = () => {
        setClick(!click)


    }
    const handelClickAccount = () => {
        setAccountDeteilsVisible(!isAccountDetailsVisible)
    }

    const logoutFunction =async (e) => {
        if(soundRef.current !==null){
            soundRef.current.pause();
            setAudioPos(0);
            soundRef.current=null;
            setIsPlaying(false)
            setPauseButton(false)
            setSongDescription("")
            setSongName("")
            setImgUrl("")
            setSongPlayingInd(-1);
        }
        if(localStorage.getItem("profile")){
            googleLogout();
            localStorage.clear()
            setAuthenticated(false)
            setAccountDeteilsVisible(false)
            setDisplayProfile(false)
        }else{
            const token = localStorage.getItem("token");
            try {
                const res = await fetch(`${BackendUrl}/logout`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({"token":token})
                })
                const data = await res.json();
                console.log(data);
                if (res.ok) {
                    localStorage.removeItem("token")
                    localStorage.removeItem("name")
                    localStorage.removeItem("email")
                    setAuthenticated(false)
                    setAccountDeteilsVisible(false)
                    setDisplayProfile(false)
                    navigate("/")
                }
                function deleteCookies() {
                    var allCookies = document.cookie.split(';');
                    console.log(allCookies)
                    for (var i = 0; i < allCookies.length; i++){
                        document.cookie = allCookies[i] + "=;expires="
                        + new Date(0).toUTCString();
                    }
                }
                deleteCookies();
              } catch (error) {
                console.log(error);
              }
        }
        window.location.reload();
        setIsLoginSuccesful("");
    }

    return (
        <>
            <div className={`nav-bar  flex ${isAuthenticated ? "background-transparent" : ""}`} id='nav-bar' >
                <div className="arrow-main-container flex">
                    <div className="arrow-container">
                        <FontAwesomeIcon className="left-icon-in-nav icon-in-nav" id='left-icon' icon={faChevronRight} onClick={handelClick} />
                    </div>
                    <div className="arrow-container">
                        <FontAwesomeIcon className="right-icon-in-nav icon-in-nav" id='right-icon' icon={faChevronRight} onClick={() => {
                            navigate(1)
                        }} />
                    </div>
                </div>
                <div className="input-flex-grow">
                    {
                        isSearchVisible && (
                            <NavLink to="/search">
                                <div className="input-field " id='input-in-nav'>
                                    <FontAwesomeIcon className='search-icon' icon={faMagnifyingGlass} style={{ color: "#a7a7a7", }} />
                                    <input type="text" className='middle' id='middle' placeholder='What do you want to listen to?' />
                                </div>
                            </NavLink>
                        )
                    }
                </div>
                {
                    !isAuthenticated && (
                        <>

                            {
                                button && (
                                    <><a href="https://www.spotify.com/in-en/premium/?ref=web_loggedout_premium_button" target='_blank' className='a1'>Premium</a>
                                        <a href="https://support.spotify.com/in-en/" target="_blank" className='a2'>Support</a>
                                        <a href="https://www.spotify.com/in-en/download/windows/" target='_blank' className='a3'>Download</a><FontAwesomeIcon icon={faMinus} className="faminus" rotation={90} /></>
                                )
                            }
                            {
                                !button && !click && (
                                    <>
                                        <div className="drop-down-menu-nav-before-signup " id='drop-down-menu-nav-before-signup'>
                                            <div className="drop-down flex">
                                                <div>Premium</div>
                                                <a href="https://www.spotify.com/premium/" target='_blank' ><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                                            </div>
                                            <div className="drop-down flex">
                                                <div>Support</div>
                                                <a href="https://support.spotify.com/" target='_blank'><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                                            </div>
                                            <div className="drop-down flex">
                                                <div>Download</div>
                                                <a href="https://spotify.com/download" target='_blank'><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                                            </div>
                                        </div>
                                    </>
                                )
                            }

                            <div className="nav-buttons flex">
                                <NavLink to="/signup"><p className='sign-up-nav'>Sign up</p></NavLink>
                                <NavLink to="/signin"><button className='primary-button'>Log in</button></NavLink>
                            </div>
                            {!button && (click ? <i className="fa-solid fa-bars" onClick={handelClickBars}></i> : <i className="fa-solid fa-xmark" onClick={handelClickBars}></i>)}
                        </>
                    )
                }


                {
                    isAccountDetailsVisible && isAuthenticated && (
                        <>
                            <div className="drop-down-menu-nav-before-signup " id='drop-down-menu-nav-account'>
                                <div className="drop-down flex">
                                    <div>Account</div>
                                    <a href="#" target='_blank' ><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                                </div>
                                <div className="drop-down flex">
                                    <div>Profile</div>

                                </div>
                                <div className="drop-down flex">
                                    <div>Upgrade to Premium</div>
                                    <a href="https://www.spotify.com/premium/?ref=web_loggedin_upgrade_menu" target='_blank'><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                                </div>
                                <div className="drop-down flex">
                                    <div>Support</div>
                                    <a href="https://support.spotify.com/" target='_blank'><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                                </div>
                                <div className="drop-down flex">
                                    <div>Download</div>
                                    <a href="https://spotify.com/download" target='_blank'><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                                </div>
                                <div className="drop-down flex">
                                    <div>Settings</div>
                                </div>
                                <hr />
                                <div className="drop-down flex" onClick={logoutFunction}>
                                    <a href="#" ><p>Logout</p></a>
                                </div>



                            </div>
                        </>
                    )
                }
                {
                    isAuthenticated && (
                        <>
                            {/* <button className='secondary-button explore-premium'>Explore Premium</button> */}
                            {/* <button className='tertiary-button install-app'><i className="fa-regular fa-circle-down" style={{ color: "#ffffff" }}></i> Install App</button> */}
                            {
                                displayProfile ? (
                                    <Tooltip title={userName} placement="top">
                                        < img src={`${profile}`} alt="Profile" onClick={handelClickAccount} className="google-profile-image"/> 
                                    </Tooltip>

                                ) : <i className="fa-solid fa-user" style={{ color: "#ffffff" }} onClick={handelClickAccount}></i>
                                    }


                        </>
                    )
                }






            </div>
        </>
    )
}
export default Navbar;