import React, { Component } from "react";
import "./css/header.css";

class Header extends Component {
    render() {
        return (
            <div id="Home">
                <header>
                    <h1 id="logo">Cafe Apps</h1>
                    
                    <nav className="navGroup">
                        <ul className="navbar">
                            <li className="Home">
                                <button type="button" className="btn btn-outline-danger">
                                    <a href="#Home">Home</a>
                                </button>
                            </li>

                            <li className="Info">
                                <button type="button" className="btn btn-outline-danger">
                                    <a href="#contents">Info</a>
                                </button>
                            </li>

                            <li className="Maps">
                                <button type="button" className="btn btn-outline-danger">
                                    <a href="#mapContents">Maps</a>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
        )
    }
}

export default Header;