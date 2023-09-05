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

