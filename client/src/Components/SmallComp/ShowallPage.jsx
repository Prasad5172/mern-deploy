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
             
     {/* 
     .each-section-cards .card {
        width: 147px;    
             height: 231px;
     }
     .each-section-cards .image-container-card {
    padding: 8px;}
    .each-section-cards .play-img-div {
    width: 130px;
    height: 130px;
    }
    }
      */}
      {/*
      .each-section-cards .card {
        width: 176px;
        height: 270px;
        background-color: #12121258;
        cursor: pointer;
        border-radius: 10px;
        position: relative;
        transition: all 1s ease;
    }

    .each-section-cards .image-container-card {
        padding: 15px;
    }

    .each-section-cards .play-img-div {
        width: 150px;
        height: 150px;
        margin: 1px;
        border-radius: 5px;
        position: relative;
    }

    .each-section-cards .card .image-container-card .para .p1 {
        margin-top: 10px;
     }
       */}
       {/* 
       .each-section-cards .card {
        width: 157px;
        height: 242px;
        background-color: #12121258;
        cursor: pointer;
        border-radius: 10px;
        position: relative;
        transition: all 1s ease;
    }

    .each-section-cards .card .image-container-card .para {
        margin-top: 0px;
    }

    .each-section-cards .image-container-card {
        padding: 10px;
    }

    .each-section-cards .play-img-div {
        width: 134px;
        height: 134px;
        margin: 1px;
        border-radius: 5px;
        position: relative;
    }

    .each-section-cards .card .image-container-card .para .p1 {
        margin-top: 10px;
    }

    .each-section-cards .card .image-container-card .para .p2 {
        margin-top: 10px;
    }
        */}
    {/* 
    .each-section-cards .card {
        width: 200px;
        height: 300px;
        background-color: #12121258;
        cursor: pointer;
        border-radius: 10px;
        position: relative;
        transition: all 1s ease;
    }

    .each-section-cards .image-container-card {
        padding: 15px;
    }

    .each-section-cards .play-img-div {
        width: 170px;
        height: 170px;
        margin: 1px;
        border-radius: 5px;
        position: relative;
    }

    .each-section-cards .card .image-container-card .para .p1 {
        margin-top: 20px;
    }
     */}

        </>
    )
}
export default ShowallPage;
