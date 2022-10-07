import React, { useEffect, useState } from "react";
import HeaderDynamic from "./HeaderDynamic"
import Avatar from "../assets/avatars/SVG/Asset9.svg"
import { Link } from "react-router-dom";

const Profile = ({ setAuth }) => {

  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("SUPER");
  const [lastname, setLastname] = useState("KABAYAN");
  const [age, setAge] = useState("99");
  const [country, setCountry] = useState("Unknown Country");
  const [email, setEmail] = useState("No email address");
  const [phone, setPhone] = useState("No phone number");
  const [savings, setSavings] = useState([]);
  const [savingsTotal, setSavingsTotal] = useState("");
  const [payment, setPayment] = useState("Not paying premiums");

  const getProfile = async () => {

    try {
      const response = await fetch(
        `https://superkabayan.herokuapp.com/account/`,
        {
          method: "GET",
          //retrieving the token and putting it in the Auth header
          headers: {
            Authorization: localStorage.getItem('token')
          },
        })

      //parsing the json back to a JS object
      const parseRes = await response.json();

      if (parseRes.name !== "JsonWebTokenError") {

        setUsername(parseRes.username);
        setEmail(parseRes.email);

        !parseRes.firstname ? setFirstname("SUPER") : setFirstname(parseRes.firstname);
        !parseRes.lastname ? setLastname("KABAYAN") : setLastname(parseRes.lastname);
        !parseRes.country_name ? setCountry("Unknown Country") : setCountry(parseRes.country_name);
        !parseRes.phone ? setPhone("No phone number") : setPhone(parseRes.phone);

        if (!parseRes.birthdate) {
          setAge("");
        } else {
          const getAge = (bdate) => {
            const dob = new Date(bdate);
            const month_diff = Date.now() - dob.getTime();
            const age_dt = new Date(month_diff);
            const year = age_dt.getUTCFullYear();
            const age = Math.abs(year - 1970);
            return age;
          }

          setAge(getAge(parseRes.birthdate));
        }
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  const getSavings = async() => {
    try {
        const response = await fetch(
          "https://superkabayan.herokuapp.com/savings",
          {
            method: "GET",
            headers: {
              Authorization: localStorage.getItem('token')
            }
          })
          const savings = await response.json()
          console.log(savings[0].current_value)

          console.log(savings)
        console.log(savings.length)
        setSavings(savings)

        const getTotal = () => {
          const array = savings
          let sum = 0
          for (let i= 0; i < array.length; i++) {
            sum += array[i].current_value
          }
          return sum
        }
        setSavingsTotal(getTotal())

    } catch (error) {
      console.log(error.message)
    }
  }

  const getPayments = async () => {
    try {
      const response = await fetch(`https://superkabayan.herokuapp.com/payment/cards`, {
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
    getProfile();
    getSavings();
    getPayments();
  }, [])

  const comma = (Num) => {
    Num += "";
    Num = Num.replace(",", "");
    Num = Num.replace(",", "");
    Num = Num.replace(",", "");
    Num = Num.replace(",", "");
    Num = Num.replace(",", "");
    Num = Num.replace(",", "");
    let x = Num.split(".");
    let x1 = x[0];
    let x2 = x.length > 1 ? "." + x[1] : "";
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1))
      // x1 = x1.replace(rgx, '$1' + ',' + '$2');
      x1 = x1.replace(rgx, `$1,$2`);
    return x1 + x2;
  };

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
                  <li className="breadcrumb-item active" aria-current="page">Profile</li>
                </ol>
              </nav>

              <div className="p-5 col-xl-12">
                <div className="container bg-light p-4 rounded-5 shadow">

                  <div className="row">

                    <div className="col-xl-4 px-5 text-center">
                      <img src={Avatar} className="rounded-circle img-fluid p-5" alt="" />
                      <h6>{username}</h6>
                    </div>

                    <div className="col-xl-4">
                      <h4 className="pt-5 pb-3"><strong>Hello, </strong><em className="text-primary">{username}</em></h4>
                      <h4>{firstname} {lastname}, {age}</h4>
                      <p className=""><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt me-2" viewBox="0 0 16 16">
                        <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A31.493 31.493 0 0 1 8 14.58a31.481 31.481 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94zM8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10z" />
                        <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                      </svg> {country}</p>
                    </div>

                    <div className="col-xl-3">
                      <h6 className="pt-5 mb-3">Contact Information:</h6>
                      <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send me-2" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                      </svg> {email}</p>
                      <p><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-phone me-2" viewBox="0 0 16 16">
                        <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z" />
                        <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                      </svg> {phone}</p>
                    </div>
                  </div>

                  <div className="row">

                    <div className="col-xl-4 px-5 text-center">
                      <Link to="/settings"><button type="button" className="btn btn-outline-primary rounded-pill px-4 mt-4">Settings</button></Link>
                    </div>

                    <div className="col-xl-4 mt-5">
                      <h5>SUMMARY</h5>
                      {savings.length>0 ? (<p>Savings Portfolio: <strong>P {comma(savingsTotal)}</strong><br /></p>) : (<p>Savings Portfolio: No savings<br /></p>)}
                      {payment.length>0 ? (<p>Premiums: <strong>{payment.length} Premiums</strong><br /></p>) : (<p>Premiums: No premiums<br /></p>)}
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
export default Profile;