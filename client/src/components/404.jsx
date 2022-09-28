import React from 'react'
import logo from '../sk-logo.png';
import { Link } from 'react-router-dom';

const MissingPage = () => {

    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-primary d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between p-4"> 
            <div>
                    <a href="http://localhost:3000/" classNameName="d-flex align-items-center">
                        <img classNameName="bi" aria-label="logo" src={logo} />
                    </a>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent1" aria-controls="navbarSupportedContent1" aria-expanded="false" aria-label="Toggle navigation"> <span className="navbar-toggler-icon"></span> </button>

                <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent1">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active"> <a className="nav-link text-white" href="/" disabled>About</a> </li>
                </ul>
                <Link to="/login" className="btn btn-link text-white">Log In</Link>
                </div>
        </nav>
            <div className="container-fluid bg-light" id="background">
                <div className="container p-3">
                    <div>
                        <div className="row p-5 d-flex justify-content-center">
                            <div className="col-xl-10 p-4">
                                <div className="container bg-white rounded shadow pb-5">

                                        <div className="d-flex col-xl-12 justify-content-end"><Link to="/"><button type="button" className="btn-close p-4 mt-3" aria-label="Close" /></Link></div>
                                        <h1 className="text-left display-3 px-5 fw-light"><strong>404, :(</strong></h1>
                                        <h4 className="text-left display-3 p-5 fw-light">The page you are looking<br/>was not found.</h4>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

    )
}

export default MissingPage