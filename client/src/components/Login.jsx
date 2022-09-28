import React, { useState } from "react";
import logo from '../assets/sk-logo.png';
import { Link } from "react-router-dom";

const Login = ({ setAuth }) => {
  const [formValues, setInputs] = useState({
    email: "",
    userpassword: "",
  });

  //setting the inputs
  const onChange = (e) => {
    //email     : barney
    setInputs({ ...formValues, [e.target.name]: e.target.value });
  };

  const [formErrors, setFormErrors] = useState({});
  const [dbErrors, setDbErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid email";
    }
    if (!values.userpassword) {
      errors.userpassword = "Password is required";
    } else if (values.userpassword.length < 7) {
      errors.userpassword = "Password must be at least 6 characters";
    }
    return errors;
  };

  //deconstructing the email and password variable from the inputs

  const { email, userpassword } = formValues;

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    const errorLog = validate(formValues);

    try {
      const body = { email, userpassword, errorLog };

      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
       
      } else {
        setDbErrors(parseRes.status);
        setAuth(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary d-flex flex-wrap align-items-center justify-content-between justify-content-lg-between p-4">
        <div>
          <a
            href="http://localhost:3000/"
            classNameName="d-flex align-items-center"
          >
            <img classNameName="bi" aria-label="logo" src={logo} />
          </a>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent1"
          aria-controls="navbarSupportedContent1"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          {" "}
          <span className="navbar-toggler-icon"></span>{" "}
        </button>

        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarSupportedContent1"
        >
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              {" "}
              <a className="nav-link text-white" href="/">
  
              </a>{" "}
            </li>
          </ul>
        </div>
      </nav>
      <div className="container-fluid bg-light" id="background">
        <div className="container p-3">
          <div>
            <div className="row p-5 d-flex justify-content-center">
              <div className="col-xl-5 p-4">
                <div className="container bg-white rounded-5 shadow">
                  <div className="row">
                    <div className="col-xl-4"></div>
                    <div className="col-xl-4"></div>
                    <div className="d-flex col-xl-4 justify-content-end">
                      <Link to="/">
                        <button
                          type="button"
                          className="btn-close p-4 mt-3"
                          aria-label="Close"
                        />
                      </Link>
                    </div>
                  </div>

                  {Object.keys(dbErrors).length > 0 && isSubmit ? (
                    <div
                      className="alert alert-danger text-center my-3"
                      role="alert"
                    >
                      {dbErrors}
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <form onSubmit={onSubmitForm}>
                    <div className="form-outline px-5 my-4">
                      <input
                        type="email"
                        className="form-control"
                        id="emailForm"
                        placeholder="Email"
                        name="email"
                        value={formValues.email}
                        onChange={(e) => onChange(e)}
                      />

                      <p id="emailHelp1" className="form-text text-muted px-2 fw-light">
                        We'll never share your email with anyone else.
                      </p>
                      <p className="form-text text-danger">
                        {formErrors.email}
                      </p>
                      <p className="form-text text-danger">
                        {dbErrors.emailError}
                      </p>

                      <input
                        type="password"
                        className="form-control my-3"
                        id="passwordForm"
                        placeholder="Password"
                        name="userpassword"
                        value={formValues.userpassword}
                        onChange={(e) => onChange(e)}
                      />
                      <p className="form-text text-danger">
                        {formErrors.userpassword}
                      </p>
                    </div>
                    <div className="text-center pb-4">
                      <button
                        type="submit"
                        className="btn btn-primary rounded-pill px-5 my-3"
                      >
                        Log in
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
