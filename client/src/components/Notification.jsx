import React, { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';

const Notification = ({ setAuth }) => {
  const [notif, setNotif] = useState([]);

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

  useEffect(() => {
    getNotif();
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

  return (
    <>
      {notif.length > 0 ? (
        <div className="row g-4 mx-1 mx-xl-0">
          <div className="col-md-6 col-xl-12 pb-4">
            <div className="col p-3 snip-card rounded-5 shadow bg-danger bg-gradient text-white pb-2">
              {notif.map((payment) => {
                return <h5 className="pb-1"><Badge pill bg="white" text="danger">overdue</Badge> {payment.title} : <strong>P{comma(payment.amount)}</strong></h5>
              })}
            </div>
          </div>
        </div>) : (<></>)}
    </>
  );
};

export default Notification;