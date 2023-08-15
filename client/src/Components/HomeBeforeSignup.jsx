import React,{useState,useEffect} from 'react'
import Card from "./Card"
import data from './apis/api.json'
import Playlist from "./apis/playlistApi.json"
import HomeBeforeSignupDiv from './HomeBeforeSignupDiv'
// const ScrollNavbar = () => {
//     const [addsc, setAddsc] = useState(false);
  
    // // Function to add or remove the 'scrolled' class based on the scroll position
    // function updateNavbarBackground() {
    //   const scrollY = window.scrollY;
    //   console.log(scrollY);
  
    //   if (scrollY > 0) {
    //     setAddsc(true);
    //   } else {
    //     setAddsc(false);
    //   }
    // }
  
  //   useEffect(() => {
  //     updateNavbarBackground();
  
  //     // Add the 'scroll' event listener inside the useEffect hook
  //     window.addEventListener('scroll', updateNavbarBackground);
  
  //     // Clean up the event listener when the component is unmounted
  //     return () => {
  //       window.removeEventListener('scroll', updateNavbarBackground);
  //     };
  //   }, []); // Empty dependency array, so the effect runs only once when the component mounts
  
  //   return (
  //     <nav className={`navbar ${addsc ? 'scrolled' : ''}`}>
  //       {/* Your navbar content here */}
  //     </nav>
  //   );
  // };
  
 const HomeBeforeSignup = (props) => {
    
    return (
        <>
            <div className="right-cards-section">   
                {
                    data.map((ele,ind) =>{
                        return (
                            <HomeBeforeSignupDiv key={ind} {...ele} {...props}/>
                        )
                    })
                }
            </div>              
        </>
    )
 }

 export default HomeBeforeSignup;