import React,{useEffect,useState} from "react"
import './css/reset.css';
import {  useDispatch, useSelector, shallowEqual } from 'react-redux';



import Map from './components/map/Map';
import MapTwo from './components/map/MapTwo';
import { changeLat,changeLon, isLoadingHandler} from "./redux/actions/actions";
import Loading from './Component/Loading';
import PlaceList from './components/PlaceList';




function App() {
  const dispatch = useDispatch()
  const {lat,lon,region,city, add} = useSelector((state=>state.locationReducer),shallowEqual)
  const isLoading = useSelector(state => state.isLoadingReducer.isLoading)
  //좌표얻기
  const getPosition = async () => {
    navigator.geolocation.getCurrentPosition(async (position)=>{
      const lat = await position.coords.latitude;
      const lon = await position.coords.longitude;
      dispatch(changeLon(lon))
      dispatch(changeLat(lat))
      dispatch(isLoadingHandler(false))
    },(err)=>alert('위치권한을 허용해주세요'))}

  useEffect(()=>{
    getPosition()
    
    console.log(lat,lon)
  },[lat,lon])


  return (
    
      <div className="App">
        {isLoading ? <Loading /> : <MapTwo />}
        <hr />
        <PlaceList />
      </div>
    
  )
}

export default App
