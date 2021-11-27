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
