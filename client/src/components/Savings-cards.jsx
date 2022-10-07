import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SavingsCards = ({ setAuth }) => {
  const [savings, setSavings] = useState([]);

  const getSavings = async () => {
    try {
      const response = await fetch(`https://superkabayan.herokuapp.com/savings/cards`, {
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

  return (
    <>

      {savings.map((savings) => {
        if (savings.category === "Emergency Fund") {
          return <div className="col-md-6 col-lg-4 col-xl-4 flex-wrap position-relative ">
            <Link to={`/savings/${savings.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="ps-3 p-4 snip-card rounded-4 border-top border-5 shadow bg-white" id={stringCategory(savings.category)}>
                <h3 className="title text-white mb-0"> EMERGENCY </h3>
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
              <div className="p-4 snip-card rounded-4 border-top border-5 shadow bg-white" id={stringCategory(savings.category)}>
                <h3 className="title mb-0 text-info"> SAVINGS </h3>
                <h6 className="mb-0"> {savings.savings_name.toUpperCase()}</h6>
                <br />
                <div className="d-flex fw-normal justify-content-between py-2">
                  <h6 className="title">GOAL</h6>
                  <br />
                  <h6 className="title-number"> {comma(savings.savings_goal)}</h6>
                </div>
                <h1 className="fw-bold text-end title-number" id={`title${stringCategory(savings.category)}`}>{Math.round(getPercentage(savings.current_value, savings.savings_goal))}%</h1>
              </div>
            </Link>
          </div>

        }
      })}
    </>
  );
};

export default SavingsCards;