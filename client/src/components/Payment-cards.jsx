import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';

const PaymentCards = ({ setAuth }) => {
  const [payment, setPayment] = useState([])

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
    getPayments();
  }, []);

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

  const getOverdue = (date) => {
    const year = Math.floor(date / 365)
    const month = Math.floor((date % 365) / 30)
    const week = Math.floor(((date % 365) % 30) / 7)
    const day = Math.floor(((date % 365) % 30) % 7)
    if (day < 1 && week < 1 && month < 1 && year < 1) {
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
    <>
      {payment.map((payment) => {
        return <div className="col-md-6 col-lg-4 col-xl-4 flex-wrap position-relative ">
          <Link to={`/payments`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="p-4 snip-card rounded-4 border-top border-5 shadow bg-white">
              <h3 className="title text-uppercase mb-0 text-info">{payment.title.slice(0, 10)}</h3>
              <h6 className="mb-0">Due: {dateString(payment.due_date.slice(0, 10))}</h6>
              <br />
              <div className="text-end mt-1">
                <div className="row">
                  <div className="col d-flex justify-content-between align-items-center">
                    <h6>AMOUNT</h6>
                    <h5 className="title-number" id={`pay${payment.org_id}`}>{comma(payment.amount)}</h5>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
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
    </>
  );
};

export default PaymentCards;