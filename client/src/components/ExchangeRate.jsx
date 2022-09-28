import React, { useState, useEffect } from "react";

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
      const response = await fetch(`https://api.fastforex.io/fetch-multi?from=${userInfo.currency}&to=PHP%2CUSD%2CEUR%2CJPY&api_key=cec7aa8493-f3ff37f8e3-rimprl`, {
        method: 'GET',
        headers: { accept: 'application/json' }
      });
      const parseExchange = await response.json();

      if (parseExchange.results) {
        setExchangeRate(parseExchange.results);
        setExchangeUpdate(parseExchange.updated)
        setGetRate(true)
      } else {
        setGetRate(false);
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
      <div className="row g-4 mx-md-1 mx-xl-0">
      <div className="col-md-12 col-lg-12 col-xl-12 flex-wrap position-relative">
        <div className="p-4 snip-card rounded-5 shadow bg-dark text-white">
          <div className="row pt-2 px-2">
            <div className="col-xl-12">
              <h4 className="title text-white mb-0 text-center">EXCHANGE RATE</h4>
              <p className="fw-lighter mt-1 text-muted text-center small">updated: {exchangeUpdate}</p>
            </div>
            <div className="row mt-2 ps-4">
              <div className="col-xl-8"><h6>{userInfo.currency_name}</h6></div>
              <div className="col-xl-4 d-flex justify-content-end"><h6>1 {userInfo.currency} =</h6></div>
            </div>
            <div className="row mt-2 ps-4">
              <div className="col-xl-8"><h6>PHP</h6></div>
              <div className="col-xl-4 d-flex justify-content-end"><h6>{exchangeRate.PHP}</h6></div>
            </div>
            <div className="row mt-2 ps-4">
              <div className="col-xl-8"><h6>USD</h6></div>
              <div className="col-xl-4 d-flex justify-content-end"><h6>{exchangeRate.USD}</h6></div>
            </div>
            <div className="row mt-2 ps-4">
              <div className="col-xl-8"><h6>EUR</h6></div>
              <div className="col-xl-4 d-flex justify-content-end"><h6>{exchangeRate.EUR}</h6></div>
            </div>
            <div className="row mt-2 ps-4">
              <div className="col-xl-8"><h6>JPY</h6></div>
              <div className="col-xl-4 d-flex justify-content-end"><h6>{exchangeRate.JPY}</h6></div>
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