import React, { useEffect, useState } from "react"
import axios from 'axios'
import { useSelector,shallowEqual, useDispatch } from 'react-redux';
import { isLoadingHandler, isShowCreateRoomModalHandler } from "../../redux/actions/actions";



const Map = () => {
  const [pending, setPending] = useState(true)
  const [map, setMap] = useState(null)
  const kakao = window.kakao
  const [place,setPlace] = useState('')
  const {lat,lon,region,city, add} = useSelector((state=>state.locationReducer),shallowEqual)
  const [centerPosition,setCenterPosition] = useState([lat,lon])
  const [meetingPlace,setMeetingPlace] = useState([region,city,add])
  
  /**
   * 장소 검색
   * @param keyword 검색어
   */
  const searchPlace = keyword => {
    
    setPending(true)
    const places = new kakao.maps.services.Places()
    places.keywordSearch(keyword, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const firstItem = result[0]
        const { x, y } = firstItem
        const moveLatLng = new kakao.maps.LatLng(y, x)
        console.log(map)
        map.panTo(moveLatLng)
      } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert("검색 결과가 없습니다.")
      } else {
        alert("서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.")
      }
      setPending(false)
    })
  }

  const handleSearch = e => {
    
    console.log(e.target.value)
    setPlace(e.target.value)
    // e.target.value=''
    
  }

  useEffect(() => {
    console.log("effect")
    console.log(meetingPlace)
    const container = document.getElementById("map") //지도를 담을 영역의 DOM 레퍼런스
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(centerPosition[0],centerPosition[1]), //지도의 중심좌표를 마커로 변경
      level: 3 //지도의 레벨(확대, 축소 정도)
    }

    const map = new kakao.maps.Map(container, options) //지도 생성 및 객체 리턴
    //마커가 표시될 위치입니다.
    var marker = new kakao.maps.Marker({ 
      // 지도 중심좌표에 마커를 생성합니다 
      position: map.getCenter() 
    }); 


    // var markerPosition  = new kakao.maps.LatLng(33.450701, 126.570667); 
    // // 마커를 생성합니다
    //   var marker = new kakao.maps.Marker({
    //     position: markerPosition,
    //     clickable: true // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
    // });
    // 마커가 지도 위에 표시되도록 설정합니다
    marker.setMap(map);

var iwContent = '<div style="padding:5px;">Hello World! <br><a href="https://map.kakao.com/link/map/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">큰지도보기</a> <a href="https://map.kakao.com/link/to/Hello World!,33.450701,126.570667" style="color:blue" target="_blank">길찾기</a></div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
    iwPosition = new kakao.maps.LatLng(lat,lon); //인포윈도우 표시 위치입니다
    // iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

// 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({
    position : iwPosition, 
    content : iwContent,
    // removable : iwRemoveable 
});
  
// 마커에 클릭이벤트를 등록합니다
kakao.maps.event.addListener(marker, 'click', function() {
  // 마커 위에 인포윈도우를 표시합니다
  infowindow.open(map, marker); 
  console.log('hello')
});
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    
//* infowindow 생성
infowindow.open(map, marker);  
// ? 클릭한 위도, 경도 정보를 가져옵니다 
var latlng = mouseEvent.latLng; 
console.log(latlng.La, latlng.Ma)
//?  마커 위치를 클릭한 위치로 옮깁니다
marker.setPosition(latlng);

//*?infowindow 마커위에 생성
infowindow.setPosition(latlng)
// console.log('도착')

setCenterPosition([latlng.getLat(),latlng.getLng()])

// ?  좌표를 주소로 변환 -> 버튼 클릭시 onClick이벤트를 통해 91번줄로 이동
axios.get(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${latlng.getLng()}&y=${latlng.getLat()}&input_coord=WGS84`
  ,{headers:{Authorization:`KakaoAK 0d621f08c3fcfce13829ef5a842acbdb`}}
  )
  .then(res=>res.data.documents[0].address)
  .then((address)=>{
    setMeetingPlace([address.region_1depth_name,address.region_2depth_name,address.address_name])
    
    // return false
  })
  // .then(res=>console.log(meetingPlace))
  .catch(err=>console.log(err)) 
});
    setMap(map)
    setPending(false)
}, [kakao.maps,meetingPlace])


  const sendRoomInfo = (e) => {
    // console.log(meetingPlace)
    // setCreatedRoom(true)
  }

  return (
    <div>
      <div>
        <input className = 'map-searchbar' type = 'text' value = {place} onChange = {e=>handleSearch(e)} 
        placeholder="상호명이나 지역을 입력하세요"
        onKeyUp ={e=>{if(e.key==='Enter')searchPlace(place)}}
        >
          
        </input>
        <button onClick = {()=>searchPlace(place)}>검색</button>
      </div>        
      <div id="map" ></div>
      <button className="create-room-btn" onClick = {(e)=>sendRoomInfo(e)}>모각코 만들기</button>
    </div>
  )
}

export default Map
