import React ,{useEffect,useState}from 'react'
import Navbar from './NavBar';
import HomeBeforeSignup from './HomeBeforeSignup'
import { Routes, Route } from "react-router-dom";
import ShowallPage from './SmallComp/ShowallPage';
import SearchDiv from './SmallComp/SearchDiv';
import Playlist from './SmallComp/Playlist.jsx';
import Geners from './SmallComp/Geners';


const HomeRightBar = (props) => { 
    return (
        <>
            <div className='right-bar'>
                <Navbar {...props} />
                <Routes>
                    <Route exact path="/" element={<HomeBeforeSignup {...props}/>}/>
                    <Route exact path='/section/:id' element={<ShowallPage {...props}/>}/>
                    <Route exact path='/search' element={<SearchDiv/>}/>
                    <Route exact path='/playlist/:id' element={<Playlist {...props}/>}/>
                    <Route exact path='/geners/:id' element={<Geners {...props}/>}/>
                </Routes>
            </div>
        </>
    )
}
export default HomeRightBar;