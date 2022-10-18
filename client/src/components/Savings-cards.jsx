import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IconContext } from "react-icons";
import { ImInfo } from "react-icons/im";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const SavingsCards = ({ setAuth }) => {
  const [savings, setSavings] = useState([]);

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

  useEffect(() => {
    getSavings();
  }, []);

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

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      <h6>Composition</h6>
      <ul><li>Expenses Abroad: CAD</li></ul>
    </Tooltip>
  );

  return (
    <>
      {savings.map((savings) => {
        if (savings.category === "Emergency Fund") {
          return <div className="col-md-6 col-lg-4 col-xl-4 flex-wrap position-relative ">
            <Link to={`/savings/${savings.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="p-4 snip-card rounded-4 bg-primary-dull">
                <div className="d-flex justify-content-between align-items-start">
                  <h5 className="mb-0 text-capitalize text-white">Emergency Fund</h5>
                  <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                  >
                    <button type="button" className="btn btn-icon" data-bs-toggle="tooltip">
                      <IconContext.Provider value={{ size: "1.2rem", className: "text-primary-wash" }}><ImInfo /></IconContext.Provider></button>
                  </OverlayTrigger>
                </div>
                <p className="mb-0 text-primary-wash small fw-bold ">Savings</p>
                <br />
                <div className="d-flex fw-normal justify-content-between py-1">
                  <h6 className="fw-normal text-primary-wash">goal</h6>
                  <br />
                  <h5 className="fw-bold text-secondary">{comma(savings.savings_goal)}</h5>
                </div>
                <div className="d-flex fw-normal justify-content-between pt-1 align-items-center">
                  <h6 className="fw-normal text-white">{savings.month} mos.</h6>
                  <h1 className="fw-bold text-end text-white m-0">{Math.round(getPercentage(savings.current_value, savings.savings_goal))}%</h1>
                </div>
              </div>
            </Link>
          </div>

        } else {
          return <div className="col-md-6 col-lg-4 col-xl-4 flex-wrap position-relative ">
            <Link to={`/savings/${savings.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="p-4 snip-card rounded-4 bg-white">
                <h5 className="mb-0 text-capitalize">{savings.savings_name}</h5>
                <p className="mb-0 text-primary-light small fw-bold ">Savings</p>
                <br />
                <div className="d-flex fw-normal justify-content-between py-2">
                  <h6 className="fw-normal">goal</h6>
                  <br />
                  <h5 className="fw-bold"> {comma(savings.savings_goal)}</h5>
                </div>
                <h1 className="fw-bold text-end text-primary m-0">{Math.round(getPercentage(savings.current_value, savings.savings_goal))}%</h1>
              </div>
            </Link>
          </div>

        }
      })}
    </>
  );
};

export default SavingsCards;