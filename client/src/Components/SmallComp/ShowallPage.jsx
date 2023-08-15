import React from 'react'
import { useParams } from 'react-router-dom';
import Card from "../Card"
import data from "../apis/api.json"
import Playlistapi from "../apis/playlistApi.json"
const ShowallPage = (props) => {
    const { id } = useParams();
    // console.log(id)
    return (
        <>
            <div className="each-section-cards">
                {
                    data.map((ele, ind) => {
                        if (id == ele.id) {
                            return ele.content.map((ele1, ind1) => {
                                return (
                                    Playlistapi.map((ele2, ind2) => {
                                        if (ele1.playlistId == ele2.playlistId) {
                                            return <Card key={ind} {...ele2} identity={ind2} {...props} />
                                        }
                                    })
                                )
                            })
                        }
                    })
                }
            </div>
        </>
    )
}
export default ShowallPage;