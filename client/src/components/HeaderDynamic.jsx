import React from 'react';
import logo from '../assets/sk-logo.png';
import HeaderUserInfo from "./HeaderUserInfo";
import HeaderDropdown from "./HeaderDropdown";
import Badge from "react-bootstrap/Badge";

const HeaderDynamic = (props) => {

    return (

    <div>
        <header className="px-4 fixed-top">
        <div className="d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between">
            <div>
                <a href="http://localhost:3000/dashboard" className="d-flex align-items-center">
                    <img className="bi" aria-label="logo" src={logo} /><Badge pill bg="primary-light">beta</Badge>
                </a>
            </div>
            <div className="d-flex align-items-center">
                <HeaderUserInfo />
                <HeaderDropdown logOut={boolean => props.pushAuth(boolean)}/>
            </div>
        </div>
        </header>
    </div>

    )
};

export default HeaderDynamic;