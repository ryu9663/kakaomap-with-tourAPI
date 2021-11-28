import React from 'react'
import { useSelector,useDispatch,shallowEqual } from 'react-redux';
import styled from "styled-components";
import PlaceCards from './PlaceCards';

function PlaceList() {
    
    const dispatch = useDispatch()
    const placeList = useSelector((state=>state.changePlaceListReducer))

    const PlaceList = styled.div`
        display:flex;
    `

    return (
        <PlaceList>
            
            {placeList.map((place,idx)=>{
                
            return(
            <div key = {idx}>
                <PlaceCards title = {place[2]} img={place[3]} addr1={place[4].split(' ')[0]}/>        
            </div>
            )
            })}
        </PlaceList>
    )
}

export default PlaceList
