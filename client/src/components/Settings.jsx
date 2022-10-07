import React, { useEffect, useState } from "react";
import HeaderDynamic from "./HeaderDynamic"
import Avatar from "../assets/avatars/SVG/Asset9.svg"
// import UploadPhoto from "./Upload";
import { Link } from "react-router-dom";

const Settings = ({ setAuth }) => {
  const [countries, setCountry] = useState([]);
  const [formValues, setFormValues] = useState("");
  const [formErrors, setFormErrors]= useState({});
  const [dbErrors, setDbErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [updatedAccount, setAccountUpdate] = useState(false);
  const [updatedProfile, setProfileUpdate] = useState(false);
  const [tempUsername, setTempUsername] = useState("");
  const [tempEmail, setTempEmail] = useState("")

  const getInitialValue = async () => {
    try {
      const response = await fetch(
        "https://superkabayan.herokuapp.com/account",
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem('token')
          },
        })
      const parseRes = await response.json();

      if (parseRes.name !== "JsonWebTokenError") {
        const initFirstname = !parseRes.firstname ? "" : parseRes.firstname;
        const initLastname = !parseRes.lastname ? "" : parseRes.lastname;
        const initBirthdate = !parseRes.birthdate ? "" : parseRes.birthdate;
        const initCountry = !parseRes.country_name ? "" : parseRes.country_name;
        const initPhone = !parseRes.phone ? "" : parseRes.phone;
        setTempEmail(parseRes.email)
        setTempUsername(parseRes.username)

        const values = {
          uuid: parseRes.uuid,
          username: parseRes.username,
          email: parseRes.email,
          firstname: initFirstname,
          lastname: initLastname,
          birthdate: initBirthdate,
          country: initCountry,
          phone: initPhone,
          userpassword: "",
          passoword2: ""
        }
        setFormValues(values);
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const getcountry = async () => {
    try {
      const response = await fetch(
        "https://superkabayan.herokuapp.com/utils/countries",
        {
          method: "GET",
        });
      const countryList = await response.json();
      setCountry(countryList)
    } catch (error) {
      console.log(error.message)
    }
  };

  useEffect(() => {
    getcountry();
    getInitialValue();
  }, [])

  const onChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  }

  const validate = (values) => {
    const errors = {}
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.username) {
        errors.username = "Username is required";
    }
    if (!values.email) {
        errors.email = "Email is required";
    } else if (!regex.test(values.email)){
        errors.email = "Invalid email";
    }
    if (!values.userpassword) {
        errors.userpassword = "Password is required";
    } else if (values.userpassword.length < 7){
        errors.userpassword = "Password must be at least 6 characters";
    } else if (values.userpassword !== values.password2){
        errors.password2 = "Password must be the same";
    }
    return errors;
} 

const { username, email, userpassword, firstname, lastname, birthdate, country, phone } = formValues

const onSubmitAccount = async (e) => {
    e.preventDefault()
    setFormErrors(validate(formValues))
    setIsSubmit(true)
    const errorLog = validate(formValues)

    try {
        const body = { username, email, userpassword, errorLog, tempEmail, tempUsername }

        const response = await fetch(
            "https://superkabayan.herokuapp.com/account",
            {
                method: "PUT",
                headers: {
                  Authorization: localStorage.getItem('token'),
                  "Content-type": "application/json"},
                body: JSON.stringify(body)
            })

        const parseAccountUpdate = await response.json()
        console.log(parseAccountUpdate)

        if(parseAccountUpdate.rowCount === 1) {
          setAccountUpdate(true)
      } else{ 
          setDbErrors(parseAccountUpdate)
      }
        
    } catch (error) { 
        console.log(error.message)
    }
}

const onSubmitProfile = async (e) => {
  e.preventDefault()
  setIsSubmit(true)
  console.log(formValues)
  try {
    
      const body = { firstname, lastname, birthdate, country, phone }

      const response = await fetch(
          "https://superkabayan.herokuapp.com/account/profile",
          {
              method: "PUT",
              headers: {
                Authorization: localStorage.getItem('token'),
                "Content-type": "application/json"},
              body: JSON.stringify(body)
          })

      const parseProfileUpdate = await response.json()

      if(parseProfileUpdate.rowCount === 1) {
        setProfileUpdate(true)
      }
  } catch (error) { 
      console.log(error.message)
  }
}

  return (

    <div>
      <HeaderDynamic pushAuth={boolean => setAuth(!boolean)} />
      <div className="container-fluid">       
        <div className="container">
       
          <div>
            <div className="row p-5 ">
            <div className="mt-5"><br /><br /></div>{/* header padding */}
            <nav aria-label="breadcrumb">
                <ol className="breadcrumb ps-5">
                  <li className="breadcrumb-item"><Link to="/dashboard">Dashboard</Link></li>
                  <li className="breadcrumb-item"><Link to="/profile">Profile</Link></li>
                  <li className="breadcrumb-item active" aria-current="page">Settings</li>
                </ol>
              </nav>

              <div className="p-5 col-xl-12">
                <div className="container bg-light p-4 rounded-5 shadow">

                  <div className="row">

                    <div className="col-xl-4 px-5 text-center">
                      <img src={Avatar} className="rounded-circle img-fluid p-5" alt="" />
                      {/* <div><UploadPhoto /></div> */}
                    </div>

                    <div className="col-xl-7">

                      <form onSubmit={onSubmitAccount} className="mb-5">
                        <div className="d-flex justify-content-between align-items-center pt-4">
                          <h4>Account Settings</h4>
                          <button type="submit" className="btn btn-outline-primary rounded-pill px-4 my-4">Submit Account</button>
                        </div>

                        {updatedAccount && isSubmit ? ( <div className="alert alert-success text-center my-3" role="alert">Account updated!</div>) : (
                          <div></div> )}

                        <div className="form-group">

                          <label for="userName" required>Username</label>
                          <input type="text" className="form-control mt-1 mb-2" name="username" value={formValues.username} onChange={e => onChange(e)} />
                          <p className="form-text text-danger">{ formErrors.username }</p>
                          <p className="form-text text-danger">{ dbErrors.usernameError }</p>

                          <label for="email">Email</label>
                          <input type="email" className="form-control mt-1 mb-2" name="email" value={formValues.email} onChange={e => onChange(e)} />
                          <p className="form-text text-danger">{ formErrors.email }</p>
                          <p className="form-text text-danger">{ dbErrors.emailError }</p>

                          <label for="newPassword1">Password</label>
                          <input type="password" className="form-control mt-1 mb-2" name="userpassword" value={formValues.userpassword} placeholder="Enter password" onChange={e => onChange(e)} />
                          <p id="passwordHelp" className="form-text text-muted px-2">Password is required. Enter your current or new password.</p>
                          <p className="form-text text-danger">{ formErrors.userpassword }</p>

                          <label for="newPassword2">Confirm Password</label>
                          <input type="password" className="form-control mt-1" name="password2" value={formValues.password2} placeholder="Re-enter password" onChange={e => onChange(e)} />
                          <p className="form-text text-danger">{ formErrors.password2 }</p>
                        </div>

                      </form>
                      <hr />

                      <form onSubmit={onSubmitProfile}>
                        <div className="d-flex justify-content-between align-items-center">
                          <h4>Profile Settings</h4>
                          <button type="submit" className="btn btn-outline-primary rounded-pill px-4 my-4">Submit Profile</button>
                        </div>

                        {updatedProfile && isSubmit ? ( <div className="alert alert-success text-center my-3" role="alert">Profile updated!</div>) : (
                          <div></div> )}

                        <div class="form-group">
                          <label for="firstName">First Name</label>
                          <input type="text" className="form-control mt-1 mb-2" name="firstname" value={formValues.firstname} placeholder="Enter first name" onChange={e => onChange(e)} />
                          <label for="lastName">Last Name</label>
                          <input type="text" className="form-control mt-1 mb-2" name="lastname" value={formValues.lastname} placeholder="Enter last name" onChange={e => onChange(e)} />
                          
                          <label for="birthdate">Birthday</label>
                          <input type="date" className="form-control mt-1 mb-2" name="birthdate" value={formValues.birthdate} onChange={e => onChange(e)} />

                          <label for="country">Current Country</label>
                          <select className="form-control mt-1 mb-2" name="country" value={formValues.country} onChange={e => onChange(e)}>
                            <option key="XX" value="XX">--Select Country--</option>
                            {countries.map((countryList) => (
                              <option key={countryList.code} value={countryList.code}> {countryList.country_name}</option>
                            ))}
                          </select>

                          <label for="phoneNumber">Phone Number</label>
                          <input type="number" className="form-control mt-1 mb-5" name="phone" value={formValues.phone} placeholder="Enter phone number" onChange={e => onChange(e)} />
                        </div>
                      </form>

                    </div>

                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
export default Settings;