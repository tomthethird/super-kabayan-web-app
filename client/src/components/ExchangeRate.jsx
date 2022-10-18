import React, { useState, useEffect } from "react";
import { IconContext } from "react-icons";
import { ImInfo } from "react-icons/im";
import { SlOptionsVertical } from "react-icons/sl";

const ExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState({});
  const [exchangeUpdate, setExchangeUpdate] = useState("")
  const [userInfo, setUserInfo] = useState({});
  const [getCountry, setGetCountry] = useState(false);
  const [getRate, setGetRate] = useState(false)

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
  }

  const getExchange = async () => {
    try {
      const response = await fetch(`https://open.er-api.com/v6/latest/${userInfo.currency}`, {
        method: 'GET',
        headers: { accept: 'application/json' }
      });
      const parseExchange = await response.json();

      if (parseExchange.rates) {
        setExchangeRate(parseExchange.rates);
        setExchangeUpdate(parseExchange.time_last_update_utc)
        setGetRate(true)
      } else {
        setGetRate(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (!getCountry || getCountry.country_code === "XX") {
      console.log("Unknown Country")
      setGetCountry(false)
    } else {
      const timeOutId = setInterval(() => {
        getExchange();
      }, 1000);
      return () => clearTimeout(timeOutId);
    }
  });

  return (
    <>
    {getCountry ? (
      <div className="row mx-md-1 mx-xl-0">
      <div className="col-md-12 col-lg-12 col-xl-12 flex-wrap position-relative">
        <div className="p-4 rounded-4 text-white exchangerate-card">
          <div className="row d-flex justify-content-between align-items-center m-0">
            <div className="col-xl-10">
              <h4 className="text-white mb-0">Exchange Rate 
              <button type="button" className="btn btn-icon" data-bs-toggle="tooltip" data-bs-placement="left" data-bs-html="true" title={`Last updated: ${exchangeUpdate}`}>
                <IconContext.Provider value={{ size: "1rem", className:"text-muted"}}><ImInfo/></IconContext.Provider></button></h4>
            </div>
            {/* <div className="col-xl-2 d-flex justify-content-end ">
            <button type="button" className="btn"><IconContext.Provider value={{ size: "1rem", className:"text-muted"}}><SlOptionsVertical/></IconContext.Provider></button>
            </div> */}
            <div className="row mt-3 m-0 p-0">
              <div className="col-xl-8"><h6>{userInfo.currency_name}</h6></div>
              <div className="col-xl-4 d-flex justify-content-end"><h6>1 {userInfo.currency} =</h6></div>
            </div>
            <div className="row mt-2 m-0 p-0">
              <div className="col-xl-8">PHP</div>
              <div className="col-xl-4 d-flex justify-content-end">{exchangeRate.PHP}</div>
            </div>
            <div className="row mt-2 m-0 p-0">
              <div className="col-xl-8">USD</div>
              <div className="col-xl-4 d-flex justify-content-end">{exchangeRate.USD}</div>
            </div>
            <div className="row mt-2 m-0 p-0">
              <div className="col-xl-8">EUR</div>
              <div className="col-xl-4 d-flex justify-content-end">{exchangeRate.EUR}</div>
            </div>
            <div className="row mt-2 m-0 p-0">
              <div className="col-xl-8">JPY</div>
              <div className="col-xl-4 d-flex justify-content-end">{exchangeRate.JPY}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    ) : (
      <></>)}

      {/* <div className="row g-4 mx-md-1 mx-xl-0">
      <div className="col-md-12 col-lg-12 col-xl-12 flex-wrap position-relative">
        <div className="p-4 snip-card rounded-5 shadow bg-dark text-white">
          <div className="row pt-2 px-2">
            <div className="col-xl-12">
              <h4 className="title text-white mb-0 text-center">EXCHANGE RATE</h4>
            </div>
            <div className="row mt-2 ps-4 text-center fw-lighter">
              <p className="pt-3">Currency conversion for</p>
              <h6>{userInfo.currency_name} ({userInfo.currency})</h6>
              <p className="pt-1">is unavailable.</p>
            </div>
          </div>
        </div>
      </div>
    </div> */}

    </>
  )
}

export default ExchangeRate