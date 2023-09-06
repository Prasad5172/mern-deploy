import React, { useState, useEffect } from 'react'
import Card from './Card'
import { NavLink } from 'react-router-dom'
import Playlistapi from "./apis/playlistApi.json"
const HomeBeforeSignupDiv = (props) => {
    
    return (
        <>
            <div className="focus-cards-section">
                <div className="focus-and-displayall flex">
                    <span className='focus-name'>
                        {props.category}
                    </span>
                    <NavLink to={`/section/${props.id}`} className='show-all-link'>Show all</NavLink>
                </div>
                <div className="focus-body-cards flex">
                    {props.content.map((ele1, ind1) => {
                        return (
                            Playlistapi.map((ele, ind) => {
                                if (ele1.playlistId == ele.playlistId) {
                                    return <Card key={ind} {...ele} identity={ind} {...props}/>
                                }
                            })
                        )
                    })}
                </div>
            </div>
        </>
    )
}
export default HomeBeforeSignupDiv;