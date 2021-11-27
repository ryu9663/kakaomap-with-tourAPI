import React, { Component } from "react";
import "./css/banner.css";
import BannerImage from "../images/coffe-banner-1920x1080.png";

class Banner extends Component {
    render() {
        return (
            <div id="bannerWrap">
                <div className="BannerImage">
                    <img src={BannerImage} alt="BannerImage" />
                </div>
            </div>
        )
    }
}

export default Banner;