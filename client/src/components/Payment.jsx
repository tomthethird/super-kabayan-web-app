import React from 'react'
import { useState, useEffect } from 'react'
import HeaderDynamic from './HeaderDynamic'
import SidebarNav from './SidebarNav'
import Badge from "react-bootstrap/Badge";

const Payment = ({ setAuth }) => {
  const [isPaymentExist, setIsPaymentExist] = useState(false);
  const [payments, setPayments] = useState([]);
  const [formValues, setFormValues] = useState({});
  // const [intervalType, setIntervalType] = useState([]);
  const [organization, setOrganization] = useState([]);
  const [success, setSuccess] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)
  const [hideInput, setHideInput] = useState(0)

  const onChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  }

  const comma = (Num) => {
    Num += '';
    Num = Num.replace(',', ''); Num = Num.replace(',', ''); Num = Num.replace(',', '');
    Num = Num.replace(',', ''); Num = Num.replace(',', ''); Num = Num.replace(',', '');
    let x = Num.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1))
      // x1 = x1.replace(rgx, '$1' + ',' + '$2');
      x1 = x1.replace(rgx, `$1,$2`);
    return x1 + x2;
  }
  const getPayments = async () => {
    try {
      const response = await fetch(
        "https://superkabayan.herokuapp.com/payment",
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
      const payments = await response.json()
      setPayments(payments)
      console.log(payments)
      if (payments.length > 0) {
        setIsPaymentExist(true)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  // const getCategory = async () => {
  //   try {
  //     const response = await fetch(
  //       "https://superkabayan.herokuapp.com/utils/interval",
  //       {
  //         method: "GET",
  //       });
  //     const intervalType = await response.json();
  //     setIntervalType(intervalType)
  //   } catch (error) {
  //     console.log(error.message)
  //   }
  // };

  const getOrgs = async () => {
    try {
      const response = await fetch(
        "https://superkabayan.herokuapp.com/utils/organizations",
        {
          method: "GET",
        });
      const orgType = await response.json();
      setOrganization(orgType)
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
  }

  const getOverdue = (date) =>{
    const year = Math.floor(date / 365)
    const month = Math.floor((date % 365) / 30)
    const week = Math.floor(((date % 365) % 30) / 7)
    const day = Math.floor(((date % 365) % 30) % 7)
    if (day<1 && week<1 && month<1 && year<1){
      return true
    }
  }

  const dateString = (date) => {
    const dueDate = new Date(date);
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const str = `${dueDate.getDate()} ${month[dueDate.getMonth()]} ${dueDate.getFullYear()}`;
    return str
  }

  const onClose = () => {
    setIsSubmit(false)
    setFormValues({})
    setSuccess(false)
    window.location.reload()
  }
  useEffect(() => {
    getPayments()
    // getCategory()
    getOrgs()
  }, []);

  const { org_id, title, amount, due_date, interval } = formValues

  const onSubmitAccount = async (e) => {
    e.preventDefault()
    setIsSubmit(true)

    try {
      const body = { org_id, title, amount, due_date, interval }

      const response = await fetch(
        "https://superkabayan.herokuapp.com/payment",
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem('token'),
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        })
      const parsePayment = await response.json()
      console.log(parsePayment)

      if (parsePayment.trigger) {
        setSuccess(true)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const newItem = (time) => {
    const now = new Date().getTime()
    const created = new Date(time).getTime()
    const addMinutes = created + (6000 * 4)
    const newTime = new Date(addMinutes)

    if (now > newTime) {
      return false
    } else {
      return true
    }
  }

  const handleDelete = async (deleteID) => {
    try {
      await fetch(`https://superkabayan.herokuapp.com/payment/${deleteID}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      getPayments()
    } catch (error) {
      console.log(error.message);
    }
  };


  
  return (
    <div>
      <HeaderDynamic pushAuth={boolean => setAuth(boolean)} />
      <SidebarNav />
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 mt-5">
        <div className="container" id="headerContainer">

          <div className="my-4 p-2"></div>{/* header padding */}

          <div className="flex-wrap flex-md-nowrap align-items-center pb-4 my-4 border-bottom">
            <h1 className="mt-5 text-primary title">PAYMENTS</h1>
            <h5>Never miss your dues.</h5>
          </div>

          <div className="col-12 flex-wrap position-relative">

            {/* if Emergency Fund exists, hide initial container */}
            {!isPaymentExist ? (
              <div className="p-4 mb-5 snip-card rounded-5 bg-white shadow">
                <h3 className="title">NEVER MISS YOUR DUES AGAIN</h3>
                <p>Setup your accounts and get reminders when you need to pay your dues.</p>
                <div className="mt-2 d-flex justify-content-end">
                  <button className="btn btn-outline-primary rounded-pill px-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#paymentoffcanvasRight" aria-controls="offcanvasRight">Let's get started</button>
                </div>
              </div>) : (<></>)}

            <div className="row justify-content-start">

              {/* Contains all savings card */}
              {payments.map(payment => {
                return <div className="col-xl-5 px-5 py-4 snip-card rounded-5 bg-white shadow mb-4 mx-3">
                  <div className="row">
                    <div className="col d-flex justify-content-between align-items-center">
                      {newItem(payment.created_at) ? <h3 className="title text-uppercase text-secondary">{payment.title}</h3> : 
                        getOverdue(calculateDays(payment.due_date)) ? <h3 className="title text-uppercase text-danger">{payment.title}</h3> :
                          <h3 className="title text-uppercase">{payment.title}</h3>}
                      <div className="col-xl-1 text-end">
                        <button type="button" className="btn-close" aria-label="Close" onClick={(e) => handleDelete(payment.id)} />
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 text-end">
                    <div className="row">
                      <h6 className="mb-0 text-secondary">Amount Due</h6>
                      <h2 className="title-number pb-2">P {comma(payment.amount)}</h2>
                    </div>
                    <div className="row mt-2">
                      <div className="col d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Due Date</h6>
                        <h5 className="text-uppercase">{dateString(payment.due_date.slice(0, 10))}</h5>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mt-4">
                    <div className="col d-flex justify-content-start">
                    {newItem(payment.created_at) ? <h5 className="mt-0 pt-0 pe-3"><Badge pill bg="secondary">new</Badge></h5> : <></>}
                    {getOverdue(calculateDays(payment.due_date)) ? <h5 className="mt-0 pt-0"><Badge pill bg="danger">overdue</Badge></h5> : 
                      <h6 className="small text-start">Next payment in <br /><strong>{countDays(calculateDays(payment.due_date))}</strong></h6>
                      }
                    </div>
                  </div>
                </div>
              })}

              <button className="btn btn-primary p-3 snip-card mt-3 mb-5 rounded-5 col-12" type="button" data-bs-toggle="offcanvas" data-bs-target="#paymentoffcanvasRight" aria-controls="offcanvasRight">
                ADD ACCOUNT +</button>

            </div>
            <div className="offcanvas offcanvas-end" tabindex="-1" id="paymentoffcanvasRight" aria-labelledby="paymentoffcanvasRightLabel">

              <div className="offcanvas-header mt-2">

                <h5 id="offcanvasRightLabel" className="mt-4">Add Account</h5>
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" onClick={e => onClose(e)}></button>
              </div>

              {success || isSubmit ? (<div className="alert alert-success text-center m-4" role="alert">Hooray! Your payment account was created successfully! </div>) : (
                <div className="offcanvas-body">

                  <form onSubmit={onSubmitAccount}>

                    <label for="org_id">Organization/ Category</label>
                    <select className="form-control mt-2 mb-3" name="org_id" value={formValues.org_id} onChange={e => onChange(e)} onClick={e => setHideInput(org_id)}>
                      <option>--Select Ognization/ Category--</option>
                      {organization.map((org) => (
                        <option value={org.id}> {org.org_name}</option>
                      ))}
                    </select>
                    
                    {hideInput > 3 ? (<div className="mb-3">
                      <label for="title" className="form-label">Account Title</label>
                      <input type="input" className="form-control" name="title" aria-describedby="titleHelp" placeholder="Title of Account" value={formValues.title} onChange={e => onChange(e)} />
                    </div>) :
                     (<div></div>)}

                    <div className="mb-3">
                      <label for="amount" className="form-label">Amount Due</label>
                      <input type="number" className="form-control" name="amount" aria-describedby="amountHelp" value={formValues.amount} onChange={e => onChange(e)} />
                    </div>

                    <div className="mb-3">
                      <label for="due_date">Next Due Date</label>
                      <input type="date" className="form-control mt-1 mb-2" name="due_date" value={formValues.due_date} onChange={e => onChange(e)} required />
                    </div>
                     

                    {/* <label for="interval">Payment Interval</label>
                    <select className="form-control mt-2 mb-3" name="interval" value={formValues.interval} onChange={e => onChange(e)}>
                      <option>--Select Payment Interval--</option>
                      {intervalType.map((interval) => (
                        <option value={interval.type}> {interval.type}</option>
                      ))}
                    </select> */}

                    {!formValues.org_id || !formValues.due_date ? (<button className="btn btn-primary col-12 align-self-end rounded-pill mt-5" disabled>Set Account</button>) : (
                      <button type="submit" className="btn btn-primary col-12 align-self-end rounded-pill mt-5" id="savingsSubmit">Set Account</button>)}

                  </form>

                </div>
              )}

            </div>
          </div >
        </div >

      </main >
    </div >
  )
}

export default Payment