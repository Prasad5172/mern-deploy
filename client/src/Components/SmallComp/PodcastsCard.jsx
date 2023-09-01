import React from 'react'
import podcastApi from "../apis/searchapi.json"
import { Navigate, useNavigate } from 'react-router-dom'
const PodcastsCard = () => {
    const navigate = useNavigate()
    return (
        <>
            {podcastApi.map((ele, ind) => {
                return (
                    <>
                        <div className="box-on-search" onClick={() => navigate(`/geners/${ind}`)}>
                            <h2>{ele.type}</h2>
                            <img src={`${ele.url}`} alt="" />
                        </div>
                    </>
                )
            })}

        </>
    )
}
export default PodcastsCard;

// .box-on-search{
//     flex: 1 1 18%; /* Initial size of the card, adjust as needed */
//     max-width: 18%; /* Ensures the card doesn't exceed 30% of the screen width */
//     min-width: 150px;
//     aspect-ratio: 1 / 1; /* Maintain a square aspect ratio for the card */
//     background-color: aqua;
//     border-radius: 5px;
//     overflow: hidden;
//     transition: flex-basis 0.3s ease;
//     position: relative;
// }