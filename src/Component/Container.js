import React, { Component } from "react";
import "./css/container.css";
import "./css/banner.css";
import  Banner from "./Banner";
import CafeImage from "../images/coffee-shop-image-2-1920x1080.png";
import MapContainer from "./MapContents";
// import starbucksIcon from "../images/starbucks-icon.jpg";
// import ediyaIcon from "../images/Ediya-icon.jpg";
// import composeIcon from "../images/compose-icon.jpg";
// import megaIcon from "../images/mega-icon.jpg";


function Container () {
 
        return (
            <div id="Info">
                {/* <Banner /> */}
                <br />

                <div id="contents">
                    {/* <div className="imageWrap"> */}
                        {/* <img src={CafeImage} alt="CafeImage" /> */}
                    {/* </div> */}

                    <div className="textWrap">
                        <p className="textKOR">바쁜 일상에 지친 당신, 커피 한 잔으로 활력을 충전 해보세요!!</p>
                        <p className="textENG">If you are tired of your busy daily life, recharge your energy with a cup of coffee.!!</p>
                    </div>

                    <div className="mapsWrap">
                        <h2>인근 카페정보 찾아보기</h2>
                        <MapContainer />
                    </div>

                    
                </div>
            </div>
        )
    }


export default Container;