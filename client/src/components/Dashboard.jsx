import React from 'react';
import { useState, useEffect } from 'react';
import HeaderDynamic from './HeaderDynamic';
import SidebarNav from './SidebarNav';
import ExchangeRate from './ExchangeRate';
import Badge from 'react-bootstrap/Badge';
import { Link } from 'react-router-dom';
import ClockManila from './ClockManila';
import ClockAbroad from './ClockAbroad';

const Dashboard = ({ setAuth }) => {

  const [savings, setSavings] = useState([]);
  const [payment, setPayment] = useState([])
  const [userInfo, setUserInfo] = useState({});
  const [getCountry, setGetCountry] = useState(false);
  const [countries, setCountry] = useState([]);
  const [formValues, setFormValues] = useState("");
  const [notif, setNotif] = useState([]);

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

  const getNotif = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/utils/overdue", {
          method: 'GET',
          headers: {
            Authorization: localStorage.getItem('token'),
          },
        });
        const parseNotif = await response.json();
        setNotif(parseNotif)
    } catch (error) {
      console.log(error.message)
    }
  }

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
    getNotif();
  }, []);

  const reload = (num) => {
    const timeOutId = setInterval(() => window.location.reload(), num);
    return () => clearTimeout(timeOutId);
  };

  const getPercentage = (num1, num2) => {
    const percentage = (num1 / num2) * 100;
    return percentage;
  };
  const stringCategory = (category) => {
    const text = category;
    const result = text.replace(' ', '-');
    return result;
  };

  const comma = (Num) => {
    Num += '';
    Num = Num.replace(',', '');
    Num = Num.replace(',', '');
    Num = Num.replace(',', '');
    Num = Num.replace(',', '');
    Num = Num.replace(',', '');
    Num = Num.replace(',', '');
    let x = Num.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1))
      // x1 = x1.replace(rgx, '$1' + ',' + '$2');
      x1 = x1.replace(rgx, `$1,$2`);
    return x1 + x2;
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

  const calculateDays = (date) => {
    const now = new Date();
    const dueDate = new Date(date)
    const time = dueDate.getTime() - now.getTime()
    const days = time / (1000 * 3600 * 24)
    return Math.floor(days)
  }

  const countDays = (date) => {
    let day = 0
    let week = 0
    let month = 0
    let year = 0
    let dayUnit = ""
    let weekUnit = ""
    let monthUnit = ""
    let yearUnit = ""

    year = Math.floor(date / 365)
    month = Math.floor((date % 365) / 30)
    week = Math.floor(((date % 365) % 30) / 7)
    day = Math.floor(((date % 365) % 30) % 7)

    year === 1 ? yearUnit = "year" : yearUnit = "years"
    month === 1 ? monthUnit = "month" : monthUnit = "months"
    week === 1 ? weekUnit = "week" : weekUnit = "weeks"
    day === 1 ? dayUnit = "day" : dayUnit = "days"

    const yearStr = year === 0 ? "" : `${year} ${yearUnit} `
    const monthStr = month === 0 ? "" : `${month} ${monthUnit} `
    const weekStr = week === 0 ? "" : `${week} ${weekUnit} `
    const dayStr = day === 0 ? "" : `${day} ${dayUnit}`

    const str = `${yearStr}${monthStr}${weekStr}${dayStr}`

    return str
  };

  const getOverdue = (date) =>{
    const year = Math.floor(date / 365)
    const month = Math.floor((date % 365) / 30)
    const week = Math.floor(((date % 365) % 30) / 7)
    const day = Math.floor(((date % 365) % 30) % 7)
    if (day<1 && week<1 && month<1 && year<1){
      return true
    }
  };

  const dateString = (date) => {
    const dueDate = new Date(date);
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const str = `${dueDate.getDate()} ${month[dueDate.getMonth()]} ${dueDate.getFullYear()}`;
    return str
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

              <div className="col-xl-8 pt-4">

                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-4">
                  <div className="container" id="mainContainer">
                    <div className="row g-4">

                        {getCountry && savings.length>0 && payment.length>0 ? (<></>) : (
                        <div className="p-4 snip-card rounded-5 shadow">
                          <h4 className="pb-0"><strong>Welcome Super Kabayan,</strong>
                            {userInfo.firstname ? (<em className="text-primary"> {userInfo.firstname}</em>) : (<em className="text-primary"> {userInfo.username}</em>)}
                          </h4>
                          <p>Here are some task to get you started.</p>
                        </div>
                        )}
                       
                        {getCountry ? (<></>) : (
                          <div className="px-4 py-4 mt-3 snip-card rounded-5 shadow">
                            <p>In which country were you based right now?</p>
                            <form onSubmit={onSubmitProfile}>
                              <div className="col-xl-12 d-flex justify-content-start align-items-center">
                                <h6><strong><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-geo-alt me-2" viewBox="0 0 16 16">
                                  <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                                  <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                </svg>Choose country:</strong></h6>

                                <div className="col-xl-5 ps-3">

                                  <select className="form-control mt-1 mb-2" name="country" value={formValues.country} onChange={e => onChange(e)}>
                                    <option key="XX" value="XX">--Select Country--</option>
                                    {countries.map((countryList) => (
                                      <option key={countryList.code} value={countryList.code}> {countryList.country_name}</option>
                                    ))}
                                  </select>
                                </div>

                                <button type="submit" className="btn btn-outline-primary rounded-pill ms-3">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                    <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                                  </svg></button>

                              </div>
                            </form>
                          </div>)}

                          {savings.length>0 ? (<></>) : (
                          <div className="px-4 py-4 mt-3 snip-card rounded-5 shadow d-flex justify-content-between align-items-center">
                            <h6><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-coin me-2" viewBox="0 0 16 16">
                              <path d="M5.5 9.511c.076.954.83 1.697 2.182 1.785V12h.6v-.709c1.4-.098 2.218-.846 2.218-1.932 0-.987-.626-1.496-1.745-1.76l-.473-.112V5.57c.6.068.982.396 1.074.85h1.052c-.076-.919-.864-1.638-2.126-1.716V4h-.6v.719c-1.195.117-2.01.836-2.01 1.853 0 .9.606 1.472 1.613 1.707l.397.098v2.034c-.615-.093-1.022-.43-1.114-.9H5.5zm2.177-2.166c-.59-.137-.91-.416-.91-.836 0-.47.345-.822.915-.925v1.76h-.005zm.692 1.193c.717.166 1.048.435 1.048.91 0 .542-.412.914-1.135.982V8.518l.087.02z" />
                              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                              <path d="M8 13.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11zm0 .5A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                            </svg>Set up an <strong>Emergency Fund</strong></h6>
                            <div>
                              <Link to="/savings">
                                <button className="btn btn-outline-primary rounded-pill px-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#paymentoffcanvasRight" aria-controls="offcanvasRight">Let's get started</button>
                              </Link>
                            </div>
                          </div>) }


                        {payment.length>0 ? (<></>) : (
                          <div className="px-4 py-4 mt-3 snip-card rounded-5 shadow d-flex justify-content-between align-items-center">
                            <h6><svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="currentColor" class="bi bi-receipt me-2" viewBox="0 0 16 16">
                              <path d="M1.92.506a.5.5 0 0 1 .434.14L3 1.293l.646-.647a.5.5 0 0 1 .708 0L5 1.293l.646-.647a.5.5 0 0 1 .708 0L7 1.293l.646-.647a.5.5 0 0 1 .708 0L9 1.293l.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .801.13l.5 1A.5.5 0 0 1 15 2v12a.5.5 0 0 1-.053.224l-.5 1a.5.5 0 0 1-.8.13L13 14.707l-.646.647a.5.5 0 0 1-.708 0L11 14.707l-.646.647a.5.5 0 0 1-.708 0L9 14.707l-.646.647a.5.5 0 0 1-.708 0L7 14.707l-.646.647a.5.5 0 0 1-.708 0L5 14.707l-.646.647a.5.5 0 0 1-.708 0L3 14.707l-.646.647a.5.5 0 0 1-.801-.13l-.5-1A.5.5 0 0 1 1 14V2a.5.5 0 0 1 .053-.224l.5-1a.5.5 0 0 1 .367-.27zm.217 1.338L2 2.118v11.764l.137.274.51-.51a.5.5 0 0 1 .707 0l.646.647.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.646.646.646-.646a.5.5 0 0 1 .708 0l.509.509.137-.274V2.118l-.137-.274-.51.51a.5.5 0 0 1-.707 0L12 1.707l-.646.647a.5.5 0 0 1-.708 0L10 1.707l-.646.647a.5.5 0 0 1-.708 0L8 1.707l-.646.647a.5.5 0 0 1-.708 0L6 1.707l-.646.647a.5.5 0 0 1-.708 0L4 1.707l-.646.647a.5.5 0 0 1-.708 0l-.509-.51z" />
                              <path d="M3 4.5a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 1 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm8-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm0 2a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                            </svg>Set up a <strong>Payment Account</strong></h6>
                            <div>
                              <Link to="/payments">
                                <button className="btn btn-outline-primary rounded-pill px-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#paymentoffcanvasRight" aria-controls="offcanvasRight">Let's get started</button>
                              </Link>
                            </div>
                          </div>)}

                      

                      {savings.map((savings) => {
                        if (savings.category === "Emergency Fund") {
                          return <div className="col-md-6 col-lg-4 col-xl-4 flex-wrap position-relative ">
                            <Link to={`/savings/${savings.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              <div className="p-4 snip-card rounded-5 shadow" id={stringCategory(savings.category)}>
                                <h4 className="title text-white mb-0"> EMERGENCY </h4>
                                <h5 className="title text-white mb-0">FUND</h5>
                                <br />
                                <div className="d-flex fw-normal justify-content-between py-1">
                                  <h6 className="title">GOAL</h6>
                                  <br />
                                  <h6 className="title-number text-white" id="efGoal"> {comma(savings.savings_goal)}</h6>
                                </div>
                                <div className="d-flex fw-normal justify-content-between pt-1 align-items-center">
                                  <h6 className="title">{savings.month} mos.</h6>
                                  <h1 className="fw-bold text-end title-number" id="efPercent">{Math.round(getPercentage(savings.current_value, savings.savings_goal))}%</h1>
                                </div>
                              </div>
                            </Link>
                          </div>

                        } else {
                          return <div className="col-md-6 col-lg-4 col-xl-4 flex-wrap position-relative ">
                            <Link to={`/savings/${savings.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              <div className="p-4 snip-card rounded-5 shadow bg-gradient" id={stringCategory(savings.category)}>
                                <h3 className="title text-white mb-0"> SAVINGS </h3>
                                <h6 className="mb-0"> {savings.savings_name.toUpperCase()}</h6>
                                <br />
                                <div className="d-flex fw-normal justify-content-between py-2">
                                  <h6 className="title">GOAL</h6>
                                  <br />
                                  <h6 className="title-number text-white" id="efGoal"> {comma(savings.savings_goal)}</h6>
                                </div>
                                <h1 className="fw-bold text-end title-number" id="efPercent">{Math.round(getPercentage(savings.current_value, savings.savings_goal))}%</h1>
                              </div>
                            </Link>
                          </div>

                        }
                      })}

                      {payment.map((payment) => {
                          return <div className="col-md-6 col-lg-4 col-xl-4 flex-wrap position-relative ">
                            <Link to={`/payments`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              <div className="p-4 snip-card rounded-5 shadow bg-gradient" id={`pay${payment.org_id}`}>
                              <h3 className="title text-uppercase mb-0 text-white">{payment.title.slice(0, 10)}</h3>
                                <h6 className="mb-0">Due: {dateString(payment.due_date.slice(0, 10))}</h6>
                                <br />
                                <div className="text-end mt-1">
                                  <div className="row">
                                    <div className="col d-flex justify-content-between align-items-center">
                                    <h6 className="title">AMOUNT</h6>
                                    <h6 className="title-number text-white">{comma(payment.amount)}</h6>
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex justify-content-end mt-4">
                                <div className="col d-flex justify-content-start">
                                {getOverdue(calculateDays(payment.due_date)) ? <h5 className="mt-1 pt-0"><Badge pill bg="danger">overdue</Badge></h5> : 
                                  <h6 className="text-start text-dark">Pay in <br /><strong>{countDays(calculateDays(payment.due_date))}</strong></h6>
                                  }
                                </div>
                              </div>
                              </div>
                              </Link>
                          </div>
                      })}

                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-4 pt-4">

              {notif.length>0 ? (
                  <div className="row g-4 mx-1 mx-xl-0">
                    <div className="col-md-6 col-xl-12 pb-4">
                    <div className="col p-3 snip-card rounded-5 shadow bg-danger bg-gradient text-white pb-2">
                      {notif.map((payment) => {
                        return <h5 className="pb-1"><Badge pill bg="white" text="danger">overdue</Badge> {payment.title} : <strong>P{comma(payment.amount)}</strong></h5>
                      })}
                    </div>
                    </div>
                  </div> ) : (<></> )}
                

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