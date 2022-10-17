import React from 'react';
import logo from '../assets/sk-logo.png';
import HeaderUserInfo from "./HeaderUserInfo";
import HeaderDropdown from "./HeaderDropdown";
import Badge from "react-bootstrap/Badge";
import { Link } from "react-router-dom";

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
        <nav className="navbar navbar-expand-lg navbar-light bg-primary d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between px-4">
            <div>
                <a href="http://localhost:3000/" classNameName="d-flex align-items-center">
                    <img classNameName="bi" aria-label="logo" src={logo} />
                </a>
                <Badge pill bg="primary-light">beta</Badge>
            </div>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent1" aria-controls="navbarSupportedContent1" aria-expanded="false" aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent1">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link text-white" href="/">

              </a>
            </li>
          </ul>
          <Link to="/login" className="btn btn-link text-white">Log In</Link>
        </div>
      </nav>
        </header>
    </div>

    )
};

export default HeaderDynamic;