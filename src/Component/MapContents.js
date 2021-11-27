import React, { useEffect,useState } from "react";
import "./css/mapContainer.css";
import { useSelector,shallowEqual, useDispatch } from 'react-redux';
import axios from "axios";
const { kakao } = window;

const MapContainer = ({ kakaoMaps }) => {

  const [map, setMap] = useState(null)
const {lat,lon,region,city, add} = useSelector((state=>state.locationReducer),shallowEqual)
const [centerPosition,setCenterPosition] = useState([lat,lon])
const [meetingPlace,setMeetingPlace] = useState([region,city,add])
const [place,setPlace] = useState('')
const [pending, setPending] = useState(true)


const searchPlace = keyword => {
    
  setPending(true)
  const places = new kakao.maps.services.Places()
  places.keywordSearch(keyword, (result, status) => {
    if (status === kakao.maps.services.Status.OK) {
      const firstItem = result[0]
      const { x, y } = firstItem
      const moveLatLng = new kakao.maps.LatLng(y, x)
      map.panTo(moveLatLng)
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 없습니다.")
    } else {
      alert("서비스에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.")
    }
    setPending(false)
  })
}


    useEffect(() => {
      // 지도를 브라우저 상에 표시할 div Element를 설정
      var container = document.getElementById('mapContents');
      
      // 지도의 좌표 값 및 확대 레벨을 설정
      var options = {
        center: new kakao.maps.LatLng(37.207599011582865, 127.06427285444649),
        level: 3,
      }
  
      // 특정 마커를 클릭시 해당 카페 위치의 상세정보를 지도 상에 띄울 커스텀 오버레이
      var placeOverlay = new kakao.maps.CustomOverlay({zIndex:1}),
        // 커스텀 오버레이의 Contents Elemnet를 생성
        contentNode = document.createElement('div'),
  
        // 마커를 저장할 배열을 생성
        markers = [],
  
        // 현재 선택된 카테고리를 품고 있을 변수
        currCategory = "";
  
      // 지도를 브라우저 상에 표시할 div Element와 지도 옵션을 로드
      var map = new kakao.maps.Map(container, options, container);
  
      // 주소-좌표 변환 객체를 생성합니다
      var geocoder = new kakao.maps.services.Geocoder();
  
      var marker = new kakao.maps.Marker(), // 클릭한 위치를 표시할 마커
        infowindow = new kakao.maps.InfoWindow({zindex:1}); // 클릭한 위치에 대한 주소를 표시할 인포윈도우
  
      // 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시
      searchAddrFromCoords(map.getCenter(), displayCenterInfo);
  
      // 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록
      kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
          searchDetailAddrFromCoords(mouseEvent.latLng, function(result, status) {
              if (status === kakao.maps.services.Status.OK) {
                  var detailAddr = !!result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '';
                  detailAddr += '<div>지번 주소 : ' + result[0].address.address_name + '</div>';
                  
                  var content = '<div class="bAddr">' +
                                  '<span class="title">법정동 주소정보</span>' + 
                                  detailAddr + 
                              '</div>';
      
                  // 마커를 클릭한 위치에 표시합니다 
                  var latlng = mouseEvent.latLng; 
                  marker.setPosition(latlng);
                  console.log(latlng.La, latlng.Ma)
                  marker.setMap(map);
      
                  // 인포윈도우에 클릭한 위치에 대한 법정동 상세 주소정보를 표시합니다
                  infowindow.setContent(content);
                  // console.log([latlng.getLat(),latlng.getLng()])
                  // infowindow.open(map, marker);
                  axios.get(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${latlng.getLng()}&y=${latlng.getLat()}&input_coord=WGS84`
                  ,{headers:{Authorization:`KakaoAK 0d621f08c3fcfce13829ef5a842acbdb`}}
                  )
                  .then(res=>res.data.documents[0].address)
                  .then((address)=>{
                    console.log([address.region_1depth_name,address.region_2depth_name,address.address_name])
                    setMeetingPlace([address.region_1depth_name,address.region_2depth_name,address.address_name])
                    
                    // return false
                  })
              }   
          });
      });
      
      // 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
      kakao.maps.event.addListener(map, 'idle', function() {
          searchAddrFromCoords(map.getCenter(), displayCenterInfo);
      });
      
      function searchAddrFromCoords(coords, callback) {
          // 좌표로 행정동 주소 정보를 요청합니다
          geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);         
      }
      
      function searchDetailAddrFromCoords(coords, callback) {
          // 좌표로 법정동 상세 주소 정보를 요청합니다
          geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
      }
      
      // 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
      function displayCenterInfo(result, status) {
          if (status === kakao.maps.services.Status.OK) {
              var infoDiv = document.getElementById('centerAddr');
      
              for(var i = 0; i < result.length; i++) {
                  // 행정동의 region_type 값은 'H' 이므로
                  if (result[i].region_type === 'H') {
                      infoDiv.innerHTML = result[i].address_name;
                      break;
                  }
              }
          }    
      }
  
      // 장소 검색 객체를 생성
      var ps = new kakao.maps.services.Places(map); 
  
      // 지도 상에 idle Event 추가
      kakao.maps.event.addListener(map, 'idle', searchPlaces);
  
      // 커스텀 오버레이의 Cotents Node에 css Class를 추가
      contentNode.className = "placeinfo_wrap";
  
      /* 커스텀 오버레이의 Cotents Node에 mousedown, touchstart Event가 발생했을 때,
      지도 객체에 이벤트가 전달 되는 것을 방지하는 차원에서 이벤트 핸들러로 
      kakao.maps.event.preventMap 메소드를 등록 */
      addEventHandle(contentNode, "mousedown", kakao.maps.event.preventMap);
      addEventHandle(contentNode, "tochstart", kakao.maps.event.preventMap);
  
      // 커스텀 오버레이 컨텐츠를 설정
      placeOverlay.setContent(contentNode);  
  
      // 각 카테고리에 클릭 이벤트를 등록
      addCategoryClickEvent();
  
      // Element에 이벤트 핸들러를 등록하는 함수
      function addEventHandle(target, type, callback) {
          if (target.addEventListener) {
              target.addEventListener(type, callback);
          } else {
              target.attachEvent('on' + type, callback);
          }
      }
  
      // 카테고리 검색을 요청하는 함수
      function searchPlaces() {
          if (!currCategory) {
              return;
          }
          
          // 커스텀 오버레이를 감춤 
          placeOverlay.setMap(null);
  
          // 지도에 표시되고 있는 마커를 삭제
          removeMarker();
          
          ps.categorySearch(currCategory, placesSearchCB, {useMapBounds:true}); 
      }
  
      // 장소검색이 완료됐을 때 호출되는 CallBack 함수
      function placesSearchCB(data, status, pagination) {
          if (status === kakao.maps.services.Status.OK) {
  
              // 정상적으로 검색이 완료됐으면 지도에 마커를 표시
              displayPlaces(data);
          } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
              alert("주변 지역에 검색되는 카페 정보가 존재하지 않습니다.");
          } else if (status === kakao.maps.services.Status.ERROR) {
              // 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요
              alert("지도 서비스 이용 도중 예기치 않은 에러가 발생했습니다.");
          }
      }
  
      // 지도에 마커를 표출하는 함수
      function displayPlaces(places) {
  
          // 몇번째 카테고리가 선택되어 있는지 체크
          var order = document.getElementById(currCategory).getAttribute('data-order');
  
          for ( var i=0; i<places.length; i++ ) {
            // 마커를 생성하고 지도에 표시합니다
            var marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);
  
            /* 마커와 검색결과 항목을 클릭 했을 때
            장소정보를 표출하도록 클릭 이벤트를 등록 */
            (function(marker, place) {
                kakao.maps.event.addListener(marker, 'click', function() {
                    displayPlaceInfo(place);
                });
            })(marker, places[i]);
          }
      }
  
      // 마커를 생성하고 지도 위에 마커를 표시하는 함수
      function addMarker(position, order) {
          var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
            imageSize = new kakao.maps.Size(27, 28),  // 마커 이미지의 크기
            imgOptions =  {
              spriteSize : new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
              spriteOrigin : new kakao.maps.Point(46, (order*36)), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
              offset: new kakao.maps.Point(11, 28) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
            },
  
            markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
              marker = new kakao.maps.Marker({
              position: position, // 마커의 위치
              image: markerImage 
            });
  
          marker.setMap(map); // 지도 위에 마커를 표출
          markers.push(marker);  // 배열에 생성된 마커를 추가
  
          return marker;
      }
  
      // 지도 위에 표시되고 있는 마커를 모두 제거
      function removeMarker() {
        for ( var i = 0; i < markers.length; i++ ) {
            markers[i].setMap(null);
        }   
        markers = [];
      }
  
      // 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수
      function displayPlaceInfo (place) {
          var content = '<div class="placeinfo">' +
            '   <a class="title" href="' + place.place_url + '" target="_blank" title="' + place.place_name + '">' + place.place_name + '</a>';   
  
          if (place.road_address_name) {
            content += '    <span title="' + place.road_address_name + '">' + place.road_address_name + '</span>' +
              '  <span class="jibun" title="' + place.address_name + '">(지번 : ' + place.address_name + ')</span>';
          }  else {
            content += '    <span title="' + place.address_name + '">' + place.address_name + '</span>';
          }                
        
          content += '    <span class="tel">' + place.phone + '</span>' + 
            '</div>' + 
            '<div class="after"></div>';
  
          contentNode.innerHTML = content;
            placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
            placeOverlay.setMap(map);  
      }
  
  
      // 각 카테고리에 클릭 이벤트를 등록
      function addCategoryClickEvent() {
          var category = document.getElementById('category'),
            children = category.children;
  
          for (var i=0; i<children.length; i++) {
            children[i].onclick = onClickCategory;
          }
      }
  
      // 카테고리를 클릭했을 때 호출되는 함수
      function onClickCategory() {
          var id = this.id,
              className = this.className;
  
          placeOverlay.setMap(null);
  
          if (className === 'on') {
            currCategory = '';
              changeCategoryClass();
              removeMarker();
          } else {
            currCategory = id;
              changeCategoryClass(this);
              searchPlaces();
          }
      }
  
      // 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수
      function changeCategoryClass(el) {
          var category = document.getElementById('category'),
            children = category.children,
            i;
  
          for ( i=0; i<children.length; i++ ) {
            children[i].className = '';
          }
  
          if (el) {
            el.className = 'on';
          } 
      }
      
      // 일반 지도와 스카이뷰 지도 타입을 전환 시키는 지도 타입 변환 컨트롤러 생성
      var mapTypeControl = new kakao.maps.MapTypeControl();
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
      
      // 지도의 확대 및 축소를 제어하는 줌 컨트롤을 생성
      var zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        setMap(map)
    }, [kakaoMaps]);

    const handleSearch = e => {
    
      console.log(e.target.value)
      setPlace(e.target.value)
      // e.target.value=''
      
    }


    return (
      <>
      <div>
      <input className = 'map-searchbar' type = 'text' value = {place} onChange = {e=>handleSearch(e)} 
      placeholder="상호명이나 지역을 입력하세요"
      onKeyUp ={e=>{if(e.key==='Enter')searchPlace(place)}}
      >
        
      </input>
      <button onClick = {()=>searchPlace(place)}>검색</button>
    </div> 
      <div id="mapContents">
  


        <div className="hAddr">
            <span className="title">지도중심 기준 주소</span>
            <span id="centerAddr"></span>

            <ul id="category">
                <li id="AT4" className="cafeIcon" data-order="4">
                    <span className="category_bg cafe"></span>
                    <p className="categoryText">관광명소</p>
                </li>
            </ul>
        </div>
      </div>
      </>
    )
}

export default MapContainer;