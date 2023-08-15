import React from 'react'

import PodcastsCard from './PodcastsCard';
import { NavLink } from 'react-router-dom';
const SearchDiv = () => {
    
    return (
        <>
        <NavLink to="/playlist">
            <div className="search-page-container flex">
                <div className="browse-all">
                    <p>Browse all</p>
                </div>
                <div className="box-on-search-body">
                    <PodcastsCard/>
                </div>
            </div>
        </NavLink>
        </>
    )
}
export default SearchDiv;