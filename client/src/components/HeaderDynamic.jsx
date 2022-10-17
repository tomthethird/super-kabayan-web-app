import React from 'react';
import logo from '../assets/sk-logo.png';
import HeaderUserInfo from "./HeaderUserInfo";
import HeaderDropdown from "./HeaderDropdown";
import Badge from "react-bootstrap/Badge";

const HeaderDynamic = (props) => {

    return (

        <div>
            <header className="fixed-top bg-primary text-light">
                <nav className="bg-primary d-flex flex-wrap align-items-center justify-content-lg-between px-4 py-2">
                    <div>
                        <a href="http://localhost:3000/dashboard" classNameName="d-flex align-items-center">
                            <img classNameName="bi" aria-label="logo" src={logo} />
                        </a>
                        <Badge pill bg="primary-light">beta</Badge>
                    </div>
                    <div className="d-flex align-items-center">
                        <HeaderUserInfo />
                        <HeaderDropdown logOut={boolean => props.pushAuth(boolean)} />
                    </div>
                </nav>
            </header>
        </div>

    )
};

export default HeaderDynamic;