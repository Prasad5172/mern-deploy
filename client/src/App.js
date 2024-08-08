import React, { useState, useContext, useEffect } from 'react'
import Home from './Components/Home';
import { Routes, Route, useNavigate } from "react-router-dom"
import HomeBeforeSignup from './Components/HomeBeforeSignup'
import ShowallPage from './Components/SmallComp/ShowallPage';
import SearchDiv from './Components/SmallComp/SearchDiv';
import Playlist from './Components/SmallComp/Playlist.jsx';
import Geners from './Components/SmallComp/Geners';
import HomeRightBar from './Components/HomeRightBar';
import { SigninContext } from './context/SigninContext';
import SignupPage from './authentication/SignupPage';
import SinginPage from './authentication/SigninPage';
import ErrorPage from "./Components/ErrorPage"
import ForgotPassword from "./authentication/ForgotPassword"
import { decodeJwt } from 'jose'
import axios from 'axios'
// import Loading from './Components/SmallComp/Loading';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  // AsyncStorage.removeItem('persist:root'); 
  const navigate = useNavigate()
  const BackendUrl = "http://localhost:8000"
  // const BackendUrl = ""
  const { handleClick, handlePause } = useContext(SigninContext)
  const [isAuthenticated, setAuthenticated] = React.useState(false);
  const [userName, setUserName] = React.useState("")
  const [displayProfile, setDisplayProfile] = React.useState(false);
  const [profile, setProfile] = React.useState("")
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchVisible, setSerchVisible] = useState(false);
  const [IsLoginSuccesful, setIsLoginSuccesful] = React.useState("");
  const [isPasswordResetSuccesful, setIsPasswordResetSuccesful] = React.useState("")
  const [token,setToken] = React.useState("")

  useEffect(() => {
    const credential = localStorage.getItem("profile");
     setToken(credential);
    if (credential) {
      var payload = credential ? decodeJwt(credential) : undefined;
  
      if (payload) {
        axios
          .get(`${BackendUrl}/protected`, {  
            headers: {
              Authorization: `Bearer ${credential}`,
            },
          })
          .then((response) => console.log(response.data))
          .catch((error) => console.log(error));
      }
      setUserName(payload.family_name);
      setDisplayProfile(true);
      setProfile(payload.picture);
      setAuthenticated(true);
      navigate("/");
      setIsLoading(false);
      return;
    }
  
    const checkAuthentication = async () => {
      const cookie = localStorage.getItem("token");
      setToken(cookie)
      if (cookie) {
        const tokenObject = { token: cookie };
        try {
          const res = await fetch(`${BackendUrl}/checkuser`, {
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
    setIsLoading(false);
    checkAuthentication();
    console.log("token   ---- " + token)
  },[]);



  return (
    <>
        {/* { isLoading && <Loading/> } */}
      <SigninContext.Provider value={{ isAuthenticated, setAuthenticated, setIsLoginSuccesful, IsLoginSuccesful, isPasswordResetSuccesful, setIsPasswordResetSuccesful, isSearchVisible, setSerchVisible, userName, setUserName, displayProfile, setDisplayProfile, profile, setProfile, isLoading, setIsLoading }}>
        <Routes>
          <Route exact path='/' element={<Home />}>
            <Route exact path='/' element={<HomeRightBar />}>
              <Route exact path="/" element={<HomeBeforeSignup search={isSearchVisible} setState={setSerchVisible} handleClick={handleClick} isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} handlePause={handlePause} />} />
              <Route exact path='/section/:id' element={<ShowallPage search={isSearchVisible} setState={setSerchVisible} handleClick={handleClick} isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} handlePause={handlePause} />} />
              <Route exact path='/search' element={<SearchDiv />} />
              <Route exact path='/playlist/:id' element={<Playlist search={isSearchVisible} setState={setSerchVisible} handleClick={handleClick} isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} handlePause={handlePause} />} />
              <Route exact path='/geners/:id' element={<Geners search={isSearchVisible} setState={setSerchVisible} handleClick={handleClick} isAuthenticated={isAuthenticated} setAuthenticated={setAuthenticated} handlePause={handlePause} />} />
            </Route>
          </Route>
          <Route exact path='/signup' element={!isAuthenticated ? <SignupPage isLoading={isLoading} /> : <ErrorPage />} />
          <Route exact path='/signin' element={!isAuthenticated ? <SinginPage isLoading={isLoading} setAuthenticated={setAuthenticated} isAuthenticated={isAuthenticated} /> : <ErrorPage />} />
          <Route exact path='/forgotpassword' element={!isAuthenticated ? <ForgotPassword isLoading={isLoading} setIsPasswordResetSuccesful={setIsPasswordResetSuccesful} /> : <ErrorPage />} />
          <Route exact path='*' element={<ErrorPage />} />
        </Routes>

      </SigninContext.Provider>
    </>
  )
}
export default App;
