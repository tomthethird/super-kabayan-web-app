import React from 'react';
import Register from './Register';
import logo from '../assets/sk-logo.png';
import { Link } from "react-router-dom";
import Badge from "react-bootstrap/Badge";

const Home = ({ setAuth }) => {
    
    return (
        <div>
        <nav className="navbar navbar-expand-lg navbar-light bg-primary d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between px-4">
            <div>
                <a href="http://localhost:3000/" classNameName="d-flex align-items-center">
                    <img classNameName="bi" aria-label="logo" src={logo} />
                </a>
                <Badge pill bg="primary-light">beta</Badge>
            </div>
        <div>
          <ul className="navbar-nav mr-auto">
            <li className="nav-item"><Link to="/login" className="nav-link text-white">Log In</Link></li>
          </ul>
        </div>
      </nav>

    <div className="container-fluid">
      <div className="container">
        <div>
            <div className="row p-sm-1 p-xl-5 d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between">
            <div className="p-4 col-xl-7">
				<h1 className="text-left display-2 pt-xl-5 fw-normal"><strong>Keep your goals and dreams on track</strong></h1>
				<p className="text-left pt-3 fs-xl-4">Discover the platform that gives you an easy tool to keep your finances, dreams, and goals on track.</p>
			  </div>
            <div className="col-xl-5 p-xl-4 p-sm-3">
				<Register pushAuth={boolean => setAuth(boolean)}/>
            </div>
            </div>
        </div>
        </div>
      </div>
    </div>

    )
}

export default Home;