import React, { useEffect, useState } from "react"
import axios from 'axios'
import { useSelector,shallowEqual, useDispatch } from 'react-redux';
import { changePlaceList } from "../../redux/actions/actions";
import dotenv from 'dotenv'
import notImageYet from '../../images/not-image-yet.png'
dotenv.config()


const MapTwo = () => {
  const [count,setCount] = useState(0)//1번만시작하게함
  const placeList = useSelector((state=>state.changePlaceListReducer))
  
  const [pending, setPending] = useState(true)
  const [map, setMap] = useState(null)
  const kakao = window.kakao
  const [place,setPlace] = useState('')
  const {lat,lon,region,city, add} = useSelector((state=>state.locationReducer),shallowEqual)
  const [centerPosition,setCenterPosition] = useState([lat,lon])
  const [meetingPlace,setMeetingPlace] = useState([region,city,add])
  const dispatch = useDispatch()

  //클릭한 좌표중심 업데이트하여 새로운 좌표 중심반경 10km 재검색해야함 => 클릭하면 그 지점으로 좌표중심 업데이트
  const [pickPoint,setPickPoint] = useState([lat,lon])

  /**
   * 장소 검색
   * @param keyword 검색어
   */
  const searchPlace = keyword => {
    setCount(0)
    setPending(true)
    const places = new kakao.maps.services.Places()
    //검색
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
    
    // console.log(e.target.value)
    setPlace(e.target.value)
    // e.target.value=''
    
  }


  useEffect(() => {// * 지도의 한 점 클릭시 그 클릭한 점의 좌표 반경 10km의 관광지들의 좌표 전송
    

// !이건 내 좌표 반경 10km에 있는 관광지 좌표따오는거



    //!파라미터
    //! areaCode : 서울1,인천2,대전3,대구4,광주5,부산6,울산7,세종8,경기31,강원32,충북33,충남34,경북35,경남36,전북37,전남38,제주40
    //! sigunguCode : 제천:7
    //! cat1(대분류): 
    //! cat2(중분류):
    //! cat3(소분류)
    //! areaBased : 
    // if(count===0){
      setCount(count+1)
axios.get(`http://api.visitkorea.or.kr/openapi/service/rest/KorService/locationBasedList?ServiceKey=${process.env.REACT_APP_TOUR_API_KEY}`,
    {
      params:{
      MobileOS:'ETC',
      MobileApp:'TourAPI3.0_Guide',
      numOfRows: 50,
      // areaCode:33,
      // sigunguCode:7,
      //! contentTypeId : 12:관광지,14:문화시설,15:행사,25:여행코스,28:레포츠,32:숙박,38:쇼핑,39:식당, 
      contentTypeId:12,
      // * 대분류 : 인문
      // cat1:'A02',
      //* 중분류 : 역사지구
      // cat2:'A0201',
      //*좌표,반경
      mapX:pickPoint[1],
      mapY:pickPoint[0],
      //! 반경 몇m??
      radius:10000,
      //* 
      arrange:'A',
      listYN:'Y',
      }
    }
    ,{'content-type': 'application/json'}).then(res=>{
      // console.log(res.data.response.header)
      console.log(res.data.response.body.items.item)
      let list = (res.data.response.body.items.item)
      list=list.map(el=>{
        return [Number(el.mapy),Number(el.mapx),el.title,el.firstimage,el.addr1]
        
      })
      
      dispatch(changePlaceList(list))
      
    })
    .catch(err=>console.log(err))
  // }
},[pickPoint])
// ?
  
// !
useEffect(()=>{ // * 위의 useEffect에서 받아온 좌표들을 지도에 노란색 마커로 표시
  
    console.log("effect")
    
    const container = document.getElementById("map") //지도를 담을 영역의 DOM 레퍼런스
    const options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new kakao.maps.LatLng(pickPoint[0],pickPoint[1]), //지도의 중심좌표를 마커로 변경
      level: 9 //지도의 레벨(확대, 축소 정도)
    }
    const map = new kakao.maps.Map(container, options) //지도 생성 및 객체 리턴
    //마커가 표시될 위치입니다.
    let markerCenter = new kakao.maps.Marker({ 
      // 지도 중심좌표에 마커를 생성합니다 
      position: map.getCenter(),
      map: map,
    });
    // !마커 여러개찍기
    let positions = []
    for(let i = 0;i<placeList.length;i++){
      positions.push(
      {   
          addr:placeList[i][4],
          img:placeList[i][3],
          content:placeList[i][2],
          latlng: new kakao.maps.LatLng(placeList[i][0], placeList[i][1])
      })
    }
    
  //   let positions = [
  //     {
  //         latlng: new kakao.maps.LatLng(37.9841931357, 126.9042297694)
  //     },
  //     {
  //         latlng: new kakao.maps.LatLng(37.9841931357, 126.9042297694)
  //     },
  //     {
  //         latlng: new kakao.maps.LatLng(37.6196823854,127.4915450327)
  //     },
  //     {
  //         latlng: new kakao.maps.LatLng(37.8299471303,127.5074902248)
  //     }
  // ];
    const imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"; 
    for (let i = 0; i < positions.length; i ++) {
      
      // 마커 이미지의 이미지 크기 입니다
      const imageSize = new kakao.maps.Size(24, 35); 
      
      // 마커 이미지를 생성합니다    
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize); 
      // console.log(positions[i].latlng)
      // 마커를 생성합니다
      let marker = new kakao.maps.Marker({
          map: map, // 마커를 표시할 지도
          position: positions[i].latlng, 
          image : markerImage // 마커 이미지 
        })// 마커를 표시할 위치
      
      //관광지마커의 infowindow(마우스 올렸을때만)
      let iwContent = `<div style="padding:5px;">${positions[i].content}<br></div>`,
      iwPosition = new kakao.maps.LatLng(positions[i][0],positions[i][1]);
      let infowindow = new kakao.maps.InfoWindow({
        position : iwPosition, 
        content : iwContent,
        // removable : iwRemoveable 
      });
      kakao.maps.event.addListener(marker, 'mouseover', function(){
        infowindow.open(map,marker)
      })
      kakao.maps.event.addListener(marker, 'mouseout', function(){
        infowindow.close();
      })
      //관광지 마커 클릭하면 정보나오기
      // ! 여기 홈페이지 주소도 넣어줘야함. 백엔드에 요구하기. 위치기반url에는 홈페이지 응답으로 안준다.
      let onClickContent = 
      `<div class="wrap"> 
                 <div class="info"> 
                     <div class="title"> 
                     ${positions[i].content} 
                         
                     </div> 
                     <div class="body"> 
                         <div class="img">
                             <img src=${positions[i].img||notImageYet} width="73" height="70">
                        </div> 
                         <div class="desc"> 
                             <div class="ellipsis">${positions[i].addr}</div>               
                         </div> 
                     </div> 
                 </div>    
            </div>`,iwRemoveable = true;
      let infowindowOnClick = new kakao.maps.InfoWindow({
        position : iwPosition, 
        content : onClickContent,
        removable : iwRemoveable 
      });

      kakao.maps.event.addListener(marker, 'click', function(){
        infowindowOnClick.open(map,marker)
      })

  }
  // 커스텀 오버레이를 닫기 위해 호출되는 함수입니다 
  

  //내위치 마커의 infowindow
  let iwContentCenter = '<div style="padding:5px;">내 위치 <br></div>', // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
  iwPositionCenter = new kakao.maps.LatLng(lat,lon),iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다; //인포윈도우 표시 위치입니다
  // 인포윈도우를 생성합니다
  let infowindowCenter = new kakao.maps.InfoWindow({
    position : iwPositionCenter, 
    content : iwContentCenter,
    removable : iwRemoveable 
  });
  
        
    // marker.setMap(map);




// 중심좌표 마커에 클릭이벤트를 등록합니다
kakao.maps.event.addListener(markerCenter, 'click', function() {
  // 마커 위에 인포윈도우를 표시합니다
  infowindowCenter.open(map, markerCenter); 
  
});
kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
    
//* 내위치마커에 infowindow 생성
infowindowCenter.open(map, markerCenter);  
// ? 클릭한 위도, 경도 정보를 가져옵니다 
let latlng = mouseEvent.latLng; 
console.log(latlng.Ma, latlng.La)
setPickPoint([latlng.Ma, latlng.La])
//?  마커 위치를 클릭한 위치로 옮깁니다
markerCenter.setPosition(latlng);

//*?infowindow 마커위에 생성
infowindowCenter.setPosition(latlng)

console.log('도착')

// setCenterPosition([latlng.getLat(),latlng.getLng()])

// ?  좌표를 주소로 변환 -> 버튼 클릭시 onClick이벤트를 통해 91번줄로 이동
axios.get(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${latlng.getLng()}&y=${latlng.getLat()}&input_coord=WGS84`
  ,{headers:{Authorization:`KakaoAK ${process.env.REACT_APP_REST_API}`}}
  )
  .then(res=>res.data.documents[0].address)
  .then((address)=>{
    // console.log(address)
    setMeetingPlace([address.region_1depth_name,address.region_2depth_name,address.address_name])
  })
  // .then(res=>console.log(meetingPlace))
  .catch(err=>console.log(err)) 
});
    setMap(map)
    setPending(false)
}, [kakao.maps,placeList,pickPoint])

  return (
    <div className="map-box">
       
      <div id="map" ></div>
      <div className = 'map-rightbar'>
        <input className = 'map-searchbar' type = 'text' value = {place} onChange = {e=>handleSearch(e)} 
        placeholder="상호명이나 지역을 입력하세요"
        onKeyUp ={e=>{if(e.key==='Enter')searchPlace(place)}}
        ></input>
        <button onClick = {()=>searchPlace(place)}>검색</button>
      </div> 
    </div>
  )
}

export default MapTwo
