import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = (props) => {
  const initialValues = { username: "", email: "", userpassword: "" };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [dbErrors, setDbErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const onChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    setDbErrors({});
    setIsSubmit(false)
  };

  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.username) {
      errors.username = "Username is required";
    }
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

  const { username, email, userpassword } = formValues;

  const onSubmitForm = async (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
    const errorLog = validate(formValues);

    try {
      const body = { username, email, userpassword, errorLog };

      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        reload(1800)
        // props.pushAuth(true);
      } else {
        setDbErrors(parseRes);
        props.pushAuth(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const reload = (num) => {
    const timeOutId = setInterval(() => props.pushAuth(true), num);
    return () => clearTimeout(timeOutId);
  };

  // useEffect(() => {
  //     console.log(formErrors)
  //     if(Object.keys(formErrors).length === 0 && isSubmit) {
  //         console.log(formValues)
  //     }
  // })
  // console.log(Object.keys(dbErrors).length);
  // console.log(Object.keys(formErrors).length);
  // console.log(isSubmit);

  return (
    <div className="container rounded-4 bg-white">
      <h4 className="pt-5 text-center">
        <strong>Activate your powers now!</strong>
      </h4>

      {Object.keys(formErrors).length === 0 && Object.keys(dbErrors).length === 0 &&
      isSubmit ? (<div className="d-flex justify-content-center text-center">
        <div className="alert alert-success my-3 w-75" role="alert">
          Account successfully created!
        </div> </div>
      ) : (
        <h3 className="mb-4 text-center fw-light">Create an account</h3>
      )}

      <form onSubmit={onSubmitForm}>
        <div className="form-outline px-5">
          <input type="text" className="form-control my-3" id="usernameForm" placeholder="Username" name="username" value={formValues.username} onChange={(e) => onChange(e)}
          />
          <p className="form-text text-danger">{formErrors.username}</p>
          <p className="form-text text-danger">{dbErrors.usernameError}</p>

          <input type="email" className="form-control" id="emailForm" placeholder="Email" name="email" value={formValues.email} onChange={(e) => onChange(e)}
          />

          <p id="emailHelp1" className="form-text text-muted px-2">
            We'll never share your email with anyone else.
          </p>
          <p className="form-text text-danger">{formErrors.email}</p>
          <p className="form-text text-danger">{dbErrors.emailError}</p>

          <input type="password" className="form-control my-3" id="passwordForm" placeholder="Password" name="userpassword" value={formValues.userpassword} onChange={(e) => onChange(e)}
          />
          <p className="form-text text-danger">{formErrors.userpassword}</p>
        </div>
        <div className="text-center">
          <button type="submit"
            className="btn btn-primary rounded-pill px-4 my-3">
            Sign Up
          </button>
        </div>
      </form>
      <p className="mb-3 text-center">
        Already have an account? <Link to="/login">Log In</Link>
      </p>
      <p className="form-text text-muted pb-5 text-center px-3">
        By signing up, you agree to our <a href="/">Terms and Use</a> and to
        receive updates and acknowledge you've read our{" "}
        <a href="/">Privacy Policy</a>
      </p>
    </div>
  );
};

export default Register;