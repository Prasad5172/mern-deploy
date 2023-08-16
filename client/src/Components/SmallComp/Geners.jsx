import React from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import searchapi from "../apis/searchapi.json"
import Card from '../Card';
import Playlistapi from "../apis/playlistApi.json"
function Geners(props) {
    const navigate = useNavigate()
    const { id } = useParams();
    console.log("hi")
    console.log(searchapi[0].elements);
    return (
        <div>
            <div className="right-cards-section">
                {searchapi[0].elements.map((ele, ind) => (

                    <div className="focus-cards-section">
                        <div className="focus-and-displayall flex">
                            <span className='focus-name'>
                                {ele.category}
                            </span>
                            <NavLink to={`/section/${ind}`} className='show-all-link'>Show all</NavLink>
                        </div>
                        <div className="focus-body-cards flex">
                            {ele.content.map((ele2, ind2) => {
                                return (
                                    Playlistapi.map((ele3, ind3) => {
                                        if (ele2.playlistId == ele3.playlistId) {
                                            return <Card key={ind} {...ele3} identity={ind3} {...props} />
                                        }
                                    })
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Geners