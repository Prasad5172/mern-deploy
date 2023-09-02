import React, { useContext, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faPlus, faMagnifyingGlass, faHouseChimney, faCircle, faL } from '@fortawesome/free-solid-svg-icons'
import collapse from "./collapse.svg"
import { NavLink, useLocation } from 'react-router-dom'
import { SigninContext } from '../context/SigninContext'
import LibraryPlaylist from './SmallComp/LibraryPlaylist'

const HomeLeftBar = (props) => {
    const {list} = props;
    console.log(list)
    const { setSerchVisible, isAuthenticated } = useContext(SigninContext);
    const location = useLocation();
    const [isSearchActive, setSearchActive] = useState(false);

    useEffect(() => {
        const currentUrl = location.pathname;
        if (currentUrl == "/") {
            const search = document.getElementById("search-button")
            search.classList.remove("active-in-home")
            const home = document.getElementById("home-button")
            home.classList.add("active-in-home")
            setSearchActive(false)
            setSerchVisible(false)
        } else if (currentUrl == "/search") {
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
    }, [location])




    return (
        <>
            <div className="left-bar">
                <div className="home-and-search" >
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
                        <div className="lib-section flex">
                            <div className='collapse-logo flex'>
                                <img src={collapse} alt="" style={{ backgroundColor: "#ffff" }} />
                                <p className='your-lib'>Your Library</p>
                            </div>
                            {/* <div className="your-section">
                                        <a href="#" title='Crearete playlist or folder'><FontAwesomeIcon  className="faplus" icon={faPlus} style={{color: "#a7a7a7",}} /></a>
                                    </div>   */}
                        </div>
                        <div className="playlist-body">
                            {/* <div className="create-playlist">
                                        <p className='p1'>Create your first playlist</p>
                                        <p className='p2'>it's easy, we'll help you</p>
                                        <button className='secondary-button'>Create playlist</button>
                                    </div> */}
                            {/* <div className="podcasts">
                                        <p className='p1'>Let's find some podcasts to follow</p>
                                        <p className='p2'>we'll keep ypu updated on new episodes</p>
                                        <button className='secondary-button'>Browse podcasts</button>
                                    </div> */}

                            <div className="library-item">
                                {
                                    list?.map((item ,ind) => {
                                        return <LibraryPlaylist {...item} key={item._id}/>
                                    })
                                   
                                }
                            </div>
                           
                        </div>
                    </div>
                    {
                        !isAuthenticated && (
                            <div className='cookies-section'>
                                <p><a href="#">Cookies</a></p>
                                <button className='tertiary-button'> <FontAwesomeIcon icon={faGlobe} style={{ color: "#a7a7a7" }} /> English</button>
                            </div>
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default HomeLeftBar;