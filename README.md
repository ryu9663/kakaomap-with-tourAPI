```javascript
axios.get(`http://api.visitkorea.or.kr/openapi/service/rest/KorService/locationBasedList?ServiceKey=${process.env.REACT_APP_TOUR_API_KEY}`,
    {
      params:{
      MobileOS:'ETC',
      MobileApp:'TourAPI3.0_Guide',
      numOfRows:30,

      //! contentTypeId : 12:관광지,14:문화시설,15:행사,25:여행코스,28:레포츠,32:숙박,38:쇼핑,39:식당, 
      contentTypeId:12,
      
      mapX:pickPoint[1],
      mapY:pickPoint[0],
      
      //! 반경 몇m??
      radius:10000,
      //* 
      arrange:'A',
      listYN:'Y',
      }
    }
```

## 로딩화면
![tourAPI+kakaomap 로딩](https://user-images.githubusercontent.com/66232436/143688513-b3ae6832-4ff9-48c7-850d-393e46667ee5.gif)


## 클릭시 반경 10km 관광지들 표시, 및 관광지 마커에 mouseover,mouserout eventhandler 등록

![tourAPI+kakaomap](https://user-images.githubusercontent.com/66232436/143688577-73257236-7a1b-4082-a2e8-30082d7af526.gif)
