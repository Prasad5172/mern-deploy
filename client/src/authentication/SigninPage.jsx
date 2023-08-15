import React, { createContext, useState, useEffect, useContext } from "react";
import { NavLink, Navigate, useLocation, useNavigate } from "react-router-dom"
import { useCookies } from "react-cookie";
import Home from "../Components/Home"
import "./SigninAndSignup.css"
import { SigninContext } from '../context/SigninContext'
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios"
import { decodeJwt } from "jose"
import blackLogo from "../black-logo.jpg"
import "./Toast.css"
import { faL } from "@fortawesome/free-solid-svg-icons";
const SinginPage = (props) => {
  const { userName, setUserName, displayProfile, setDisplayProfile, profile, setProfile, isAuthenticated, setAuthenticated, IsLoginSuccesful, setIsLoginSuccesful, isPasswordResetSuccesful } = useContext(SigninContext)
  useEffect(() => {
    if (isPasswordResetSuccesful == "resetpassword") {
      setIsLoginSuccesful(isPasswordResetSuccesful);
      statusOfLogin()

    }
  }, [isPasswordResetSuccesful])
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const inputEvent = (event) => {
    const { name, value } = event.target;
    setSignInData((preval) => ({
      ...preval,
      [name]: value
    }))
  }


  // showing signin and signup pages
  const location = useLocation();

  useEffect(() => {
    const currentUrl = location.pathname;
    if (!props.isAuthenticated) {
      const signin = document.getElementById("signin-page")
      if (currentUrl == "/signin") {
        signin.style.setProperty("top", 0 + "%")
      } else {
        signin.style.setProperty("top", 100 + "%")
        setSignInData({
          email: "",
          password: "",
        });
        setShowPassword(false)
      }
    }
  }, [location])

  const storeInLocalStorage = (user) => {
    window.localStorage.setItem("token", user.token)
    window.localStorage.setItem("name", user.name)
    window.localStorage.setItem("email", user.email)
  }
  const navigate = useNavigate()
  const handleSubmit = async (event) => {
    event.preventDefault();
    const btn = document.getElementById("sign-in-btn")
    btn.classList.add("btn-click")
    setTimeout(() => {
      btn.classList.remove("btn-click")
    }, 300);
    // console.log("hi")
    try {
      const res = await fetch("/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signInData),
      });
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setIsLoginSuccesful("succesful");
        console.log(data.token);
        storeInLocalStorage(data);
        props.setAuthenticated(true);
        navigate("/");
        // Reset the form input fields by setting signInData to its initial values
        setSignInData({
          email: "",
          password: "",
        });
      } else {
        setIsLoginSuccesful(data);
        signinBtnFailedAnimation();
        statusOfLogin();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const signinBtnFailedAnimation = () => {
    const failed = document.getElementById("sign-in-btn");
    setTimeout(() => {
      failed.classList.add("shake-button");
    }, 500);
    setTimeout(() => {
      failed.classList.remove("shake-button");
    }, 1000);
  }

  const statusOfLogin = () => {
    const toast = document.querySelector(".toast"),
      closeIcon = document.querySelector(".close"),
      progress = document.querySelector(".progress");
    let timer1, timer2;
    toast.classList.add("active");
    progress.classList.add("active");

    setTimeout(() => {
      toast.classList.remove("active");
    }, 5000); //1s = 1000 milliseconds

    setTimeout(() => {
      progress.classList.remove("active");
    }, 5300);

    closeIcon?.addEventListener("click", () => {
      toast.classList.remove("active");

      setTimeout(() => {
        progress.classList.remove("active");
      }, 300);

      clearTimeout(timer1);
      clearTimeout(timer2);
    });

  }
 
  const handlePaste = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    const pastedText = event.clipboardData.getData('text/plain');
  
    const input = event.target;
    const inputType = input.type; // Store the original input type
    input.type = 'text'; // Temporarily change input type to "text"
    console.log(name);
    var newValue = value.substring(0, input.selectionStart) + pastedText 
      if(name !== "email"){
        newValue =newValue+ value.substring(input.selectionEnd);
      }
    setSignInData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  
    // Change input type back to the original type
    input.type = inputType;
  
    // // Trigger the onChange event to update the state
    const changeEvent = new Event('input', { bubbles: true });
    input.dispatchEvent(changeEvent);
  };
  




  return (
    <>
      <SigninContext.Provider value={{ setIsLoginSuccesful }}>
        {
          !isAuthenticated && (
            <>
              <div class="outer-box" id="signin-page">
                <div class="toast" style={{ background: `${IsLoginSuccesful == "succesful" || isPasswordResetSuccesful == "resetpassword" ? "green" : "red"}` }}>
                  <div class="toast-content">
                    <i class={`fa-solid ${IsLoginSuccesful == "succesful" || isPasswordResetSuccesful == "resetpassword" ? "fa-check" : "fa-xmark"} check`} style={{ background: `${IsLoginSuccesful == "succesful" || isPasswordResetSuccesful == "resetpassword" ? "green" : "red"}`, color: "white" }}></i>
                    <div class="message">
                      <span class="text text-1">{IsLoginSuccesful == "resetpassword" ? "Succesful" : "Login failed"}</span>
                      <span class="text text-2"> {IsLoginSuccesful == "failed" ? "Invalid credentials" : ""}
                        {IsLoginSuccesful == "signup" ? "Email is not Registred" : ""}
                        {IsLoginSuccesful == "succesful" ? "Login Succesful" : ""}
                        {IsLoginSuccesful == "resetpassword" ? "Password Reset Succesful" : ""}

                      </span>
                    </div>
                  </div>
                  <i class="fa-solid fa-xmark close"></i>
                  <div class="progress "></div>
                </div>

                <div className="spotify-nav-login flex">
                  <i class="fa-solid fa-arrow-left back-arrow-in-login" style={{ color: " #ffffff" }} onClick={() => navigate(-1)}></i>
                  <img src={`${blackLogo}`} alt="Logo" className="black-logo" />
                  <h1 className="spotify-name-in-loginpage">Spotify</h1>
                </div>
                <div class="inner-box">
                  <header class="signup-header">
                    <h1>Signin</h1>
                    <p>It just take 30 seconds</p>
                  </header>
                  <main class="signup-body">
                    <form onSubmit={handleSubmit} class="form">
                      <p>
                        <label for="fname" class="field">Enter Your Email</label>
                        <input
                          type="email"
                          class="fname"
                          name="email"
                          value={signInData.email}
                          onChange={inputEvent}
                          required
                          onPaste={handlePaste} />
                      </p>
                      <p>
                        <label for="fname" class="field"  >Password</label>
                        <div>
                          <input
                            type={`${showPassword ? "text" : "password"}`}
                            class="fname"
                            name="password"
                            value={signInData.password}
                            onChange={inputEvent}
                            required
                            onPaste={handlePaste} />
                          {
                            showPassword ? <i class="fa-solid fa-eye-slash show-and-hide" onClick={() => setShowPassword(!showPassword)}></i> : <i class="fa-solid fa-eye show-and-hide" onClick={() => setShowPassword(!showPassword)}></i>
                          }

                        </div>

                      </p>
                      <p className="forgotpassword">
                        <NavLink to="/forgotpassword">Forgotpassword?</NavLink>
                      </p>
                      <p className="centering">

                        <input type="submit" id="sign-in-btn" value="Sign in" className="create-account button" />
                      </p>
                    </form>
                  </main>
                  <div className="centering">

                    <GoogleLogin
                      clientId="393706794831-fggnef4oudj1qqnu3ncbkce42epk3b0n.apps.googleusercontent.com"
                      onSuccess={async credentialResponse => {
                        // console.log(credentialResponse)
                        const { credential } = credentialResponse;

                        var payload = credential ? decodeJwt(credential) : undefined
                        // console.log(payload);
                        if (payload) {
                          console.log(payload);
                          await axios.get("/protected", {
                            headers: {
                              Authorization: `Bearer ${credential}`
                            }
                          }).then(
                            async response => {
                              // console.log(response)
                              const res = await fetch("/googleSignin", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify(payload),
                              });
                              const data = await res.json()
                              console.log(data)
                              // console.log(res)
                              if (res.ok) {
                                navigate("/")
                                props.setAuthenticated(true)
                                setUserName(payload.given_name)
                                setDisplayProfile(true);
                                setAuthenticated(true);
                                setProfile(payload.picture)
                                window.localStorage.setItem("profile", credential);
                              } else {
                                setIsLoginSuccesful(data);
                                signinBtnFailedAnimation();
                                statusOfLogin();
                              }
                            }
                          ).catch(error => console.log(error))
                        }
                      }
                      }
                      onFailure={error => {
                        console.log(error)
                        statusOfLogin();
                      }}
                    // useOneTap
                    // className="button"
                    />
                  </div>

                  <footer class="signup-footer">

                    <p>Not Register ? <NavLink to="/signup">Click here to register</NavLink></p>

                  </footer>


                </div>


              </div>
            </>
          )
        }
      </SigninContext.Provider>
    </>
  )
}

export default SinginPage;