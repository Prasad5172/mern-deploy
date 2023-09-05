import React, { useContext, useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faMagnifyingGlass, faHouseChimney, faCircle } from '@fortawesome/free-solid-svg-icons'
import collapse from "./collapse.svg"
import { NavLink, useLocation,Link } from 'react-router-dom'
import { SigninContext } from '../context/SigninContext'
import LibraryPlaylist from './SmallComp/LibraryPlaylist'
import Logo from "../logo.png"

const HomeLeftBar = (props) => {
    const { list } = props;
    const { setSerchVisible, isAuthenticated } = useContext(SigninContext);
    const location = useLocation();
    const [isSearchActive, setSearchActive] = useState(false);
    const [isMobileLeftBarVisible, setIsMobileLeftBarVisible] = useState(false);
    const leftbarRef = useRef()

    useEffect(() => {
        const currentUrl = location.pathname;
        if (currentUrl === "/") {
            const search = document.getElementById("search-button")
            search.classList.remove("active-in-home")
            const home = document.getElementById("home-button")
            home.classList.add("active-in-home")
            setSearchActive(false)
            setSerchVisible(false)
        } else if (currentUrl === "/search") {
            const home = document.getElementById("home-button")
            home.classList.remove("active-in-home")
            const search = document.getElementById("search-button")
            search.classList.add("active-in-home")
            setSearchActive(true)
            setSerchVisible(true)
        } else {
            const search = document.getElementById("search-button")
            search.classList.remove("active-in-home")
            setSearchActive(false)
            setSerchVisible(false)
        }
        // eslint-disable-next-line
    }, [location])

    const handleMobileViewBars = (e) => {
        setIsMobileLeftBarVisible(true)
        leftbarRef.current.classList.toggle('left-0px')
    }

    const handleClickOutside = (event) => {
        console.log(event.target)
        console.log(leftbarRef?.current?.contains(event.target))
        if(event.target.id !== 'left-bar' && event.target.id != 'playlist-body' && event.target.id != 'for-collapse-in-mobile'){
            console.log(event.target)
            setIsMobileLeftBarVisible(false)
            leftbarRef.current.classList.toggle('left-0px')
        }
    };
          
        useEffect(() => {
            if (isMobileLeftBarVisible) {
              document.addEventListener('mousedown', handleClickOutside);
            } else {
              document.removeEventListener('mousedown', handleClickOutside);
            }
            return () => {
              document.removeEventListener('mousedown', handleClickOutside);
            };
          }, [isMobileLeftBarVisible]);


   

    return (
        <>
            <div className="mobile-left-bar">
                <i className="fa-solid fa-bars mobile-left-bar-bars" onClick={handleMobileViewBars}></i>
                <div className="home-and-search" >
                    <NavLink to="/">
                        <div className="home padding-class " id='home-button'>
                            <FontAwesomeIcon className="fontawesome-home" icon={faHouseChimney} style={{ color: "#fffff", }} />
                        </div>
                    </NavLink>


                    <NavLink to="/search">
                        <div className="search padding-class" id='search-button'>
                            <FontAwesomeIcon className='search-icon ' icon={faMagnifyingGlass} style={{ color: "#888787", }} />
                            {isSearchActive && <FontAwesomeIcon className='circle-in-search' icon={faCircle} style={{ color: "#ffffff", }} />}

                        </div>
                    </NavLink>
                </div>
            </div>
            <div className="left-bar" ref={leftbarRef} id='left-bar'>
                <div className="home-and-search" >
                    <div className="mobile-left-bar-visible display-none">
                        <NavLink to="/">
                        <div className="container">
                            <img src={`${Logo}`} alt="Logo" style={{"width":"25px"}} />
                            <span>Spotify</span>
                        </div>
                        </NavLink>
                    </div>
                    <NavLink to="/">
                        <div className="home padding-class " id='home-button'>
                            <FontAwesomeIcon className="fontawesome-home" icon={faHouseChimney} style={{ color: "#fffff", }} />
                            <p className='home-in-home'>Home</p>
                        </div>
                    </NavLink>


                    <NavLink to="/search">
                        <div className="search padding-class" id='search-button'>
                            <FontAwesomeIcon className='search-icon ' icon={faMagnifyingGlass} style={{ color: "#888787", }} />
                            <p className='search-in-home'>Search</p>
                            {isSearchActive && <FontAwesomeIcon className='circle-in-search' icon={faCircle} style={{ color: "#ffffff", }} />}

                        </div>
                    </NavLink>
                </div>



                <div className="library ">
                    <div className="library-main-section">
                        <div className="lib-section flex" id='for-collapse-in-mobile'>
                            <div className='collapse-logo flex' id='for-collapse-in-mobile'>
                                <img src={collapse} alt="" id='for-collapse-in-mobile' style={{ backgroundColor: "#ffff" }} />
                                <p className='your-lib' id='for-collapse-in-mobile'>Your Library</p>
                            </div>
                            
                        </div>
                        <div className="playlist-body" id='playlist-body'>


                            <div className="library-item">
                                {
                                    list?.map((item, ind) => {
                                        return <LibraryPlaylist {...item} key={item._id} songPlaylingPlaylistId={props.songPlaylingPlaylistId} />
                                    })

                                }
                            </div>

                        </div>
                    </div>
                   
                </div>
            </div>
        </>
    )
}

export default HomeLeftBar;