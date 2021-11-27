import React, { Component } from "react";
import "./css/footer.css";

class Footer extends Component {
    render() {
        return (
            <div id="footer">
                <footer>
                    <address>
                        <p className="footerText">경기도 화성시 코딩대로 456</p>
                        <p className="footerText">프론트엔드 프라자 678호</p>
                        <p className="footerText">031-123-4567</p>
                        <p className="footerText">대표 : 홍길동</p>
                        <p className="footerText">개인정보 담당 관리자 : 고길동</p>
                        <p className="footerText">웹 사이트 총괄담당 : 나개발</p>
                    </address>
                </footer>
            </div>
        )
    }
}

export default Footer;