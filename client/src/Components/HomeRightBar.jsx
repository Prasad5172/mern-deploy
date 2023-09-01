import React ,{useEffect,useState}from 'react'
import Navbar from './NavBar';
import HomeBeforeSignup from './HomeBeforeSignup'
import { Routes, Route, Outlet } from "react-router-dom";
import ShowallPage from './SmallComp/ShowallPage';
import SearchDiv from './SmallComp/SearchDiv';
import Playlist from './SmallComp/Playlist.jsx';
import Geners from './SmallComp/Geners';


const HomeRightBar = (props) => { 
    return (
        <>
            <div className='right-bar'>
                <Navbar  />
                <Outlet/>
            </div>
        </>
    )
}
export default HomeRightBar;