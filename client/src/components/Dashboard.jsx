import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeaderDynamic from './HeaderDynamic';
import SidebarNav from './SidebarNav';
import ClockManila from './ClockManila';
import ClockAbroad from './ClockAbroad';
import ExchangeRate from './ExchangeRate';
import PaymentCards from './Payment-cards';
import SavingsCards from './Savings-cards';
import Notification from './Notification';
import { IconContext } from "react-icons";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { IoMdPaper } from "react-icons/io";

const Dashboard = ({ setAuth }) => {
  const [savings, setSavings] = useState([]);
  const [payment, setPayment] = useState([])
  const [userInfo, setUserInfo] = useState({});
  const [getCountry, setGetCountry] = useState(false);
  const [countries, setCountry] = useState([]);
  const [formValues, setFormValues] = useState("");

  const getUser = async () => {
    try {
      const response = await fetch("http://localhost:8000/utils/dash", {
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      const parseUser = await response.json();
      console.log(parseUser);
      setUserInfo(parseUser);

      if (parseUser.country_code === "XX" || !parseUser.country_code) {
        setGetCountry(false);
      }
      else {
        setGetCountry(true);
      }
    } catch (error) {
      console.log(error.message)
    }
  };

  const onChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value })
  };

  const getcountry = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/utils/countries",
        {
          method: "GET",

        });
      const countryList = await response.json();
      setCountry(countryList)
    } catch (error) {
      console.log(error.message)
    }
  };

  const getSavings = async () => {
    try {
      const response = await fetch(`http://localhost:8000/savings/cards`, {
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      const savings = await response.json();
      console.log(savings)
      setSavings(savings);
      setAuth(true)

    } catch (error) {
      console.log(error.message);
    }
  };

  const getPayments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/payment/cards`, {
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      });
      const payment = await response.json();
      console.log(payment)
      setPayment(payment);
      setAuth(true)
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getUser();
    getcountry();
    getSavings();
    getPayments();
  }, []);

  const reload = (num) => {
    const timeOutId = setInterval(() => window.location.reload(), num);
    return () => clearTimeout(timeOutId);
  };

  const { country } = formValues

  const onSubmitProfile = async (e) => {
    e.preventDefault()
    console.log(formValues)
    try {
      const body = { country }
      const response = await fetch(
        "http://localhost:8000/account/profile",
        {
          method: "PUT",
          headers: {
            Authorization: localStorage.getItem('token'),
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        })

      const parseProfileUpdate = await response.json()

      if (parseProfileUpdate.rowCount === 1) {
        reload(1500)
      }
    } catch (error) {
      console.log(error.message)
    }
  };

  return (
    <div>
      <HeaderDynamic pushAuth={boolean => setAuth(boolean)} />
      <SidebarNav />
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="my-1 p-5"></div>
        {/* header padding */}

        <div className="container pt-4">
          <div>
            <div className="row d-flex justify-content-center">

              <div className="col-xl-7">

                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-4">
                  <div className="container" id="mainContainer">
                    <div className="row g-4">

                      {getCountry && savings.length > 0 && payment.length > 0 ? (<></>) : (
                        <div className="p-4 rounded-4 bg-primary-dull">
                          <h4 className="text-white">Mabuhay! Welcome Super Kabayan,
                            {userInfo.firstname ? (<span className="text-secondary"> {userInfo.firstname}</span>) : (<span className="text-secondary"> {userInfo.username}</span>)}
                          </h4>
                          <p className="mb-0 text-primary-wash">Here are some task to get you started.</p>
                        </div>
                      )}

                      {getCountry ? (<></>) : (
                        <div className="px-4 py-4 mt-3 rounded-4 bg-white">
                          <p className="mb-2">In which country were you based right now?</p>
                          <form onSubmit={onSubmitProfile}>
                            <div className="col-xl-12 d-flex justify-content-between align-items-center">

                              <div className="d-flex align-items-center">
                              <IconContext.Provider value={{ size: "1.8rem", className:"text-primary-light"}}><HiOutlineLocationMarker/></IconContext.Provider>
                              <h6 className="text-primary-light m-0 ps-2 pe-3"><strong>Choose country:</strong></h6>
                              <div className="col-xl-7">
                                <select className="form-control" name="country" value={formValues.country} onChange={e => onChange(e)}>
                                  <option key="XX" value="XX">--Select Country--</option>
                                  {countries.map((countryList) => (
                                    <option key={countryList.code} value={countryList.code}> {countryList.country_name}</option>
                                  ))}
                                </select>
                              </div>
                              </div>
                              <button type="submit" className="btn text-primary-light">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
                                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                  <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                                </svg>
                              </button>

                            </div>
                          </form>
                        </div>)}

                      {savings.length > 0 ? (<></>) : (
                        <div className="px-4 py-4 mt-3 bg-white rounded-4 d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                          <IconContext.Provider value={{ size: "1.8rem", className:"text-primary-light"}}><MdOutlineAttachMoney/></IconContext.Provider>
                          <h6 className="m-0 ps-2 pe-3">Set up an <strong className="text-primary-light">Emergency Fund</strong></h6>
                          </div>
                          <div>
                            <Link to="/savings">
                              <button className="btn btn-outline-primary-light rounded-pill px-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#paymentoffcanvasRight" aria-controls="offcanvasRight">Let's get started</button>
                            </Link>
                          </div>
                        </div>)}


                      {payment.length > 0 ? (<></>) : (
                        <div className="px-4 py-4 mt-3 bg-white rounded-4 d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                          <IconContext.Provider value={{ size: "1.8rem", className:"text-primary-light"}}><IoMdPaper/></IconContext.Provider>
                          <h6 className="m-0 ps-2 pe-3">Set up a <strong className="text-primary-light">Payment Account</strong></h6>
                          </div>
                          <div>
                            <Link to="/payments">
                              <button className="btn btn-outline-primary-light rounded-pill px-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#paymentoffcanvasRight" aria-controls="offcanvasRight">Let's get started</button>
                            </Link>
                          </div>
                        </div>)}

                      <SavingsCards />
                      <PaymentCards />

                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 pt-4">

                <Notification />

                {getCountry ? (
                  <div className="row g-4 mx-1 mx-xl-0">
                    <div className="col-md-6 pb-4">
                      <ClockManila />
                    </div>
                    <div className="col-md-6 pb-4">
                      <ClockAbroad />
                    </div>
                  </div>
                ) : (
                  <div className="row g-4 mx-1 mx-xl-0">
                    <div className="col-md-6 col-xl-12 pb-4">
                      <ClockManila />
                    </div>
                  </div>
                )}

                {getCountry ? (<ExchangeRate />) : (<></>)}

              </div>
            </div>
          </div>
        </div>

      </main >
    </div >
  );
};

export default Dashboard;