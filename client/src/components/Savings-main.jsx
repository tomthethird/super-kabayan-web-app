import React from 'react'
import { useState, useEffect } from 'react'
import HeaderDynamic from './HeaderDynamic'
import SidebarNav from './SidebarNav'
import ProgressBar from 'react-bootstrap/ProgressBar';
import { Link } from 'react-router-dom';

const Savings = ({ setAuth }) => {

  const [savings, setSavings] = useState([]);
  const [isEFExist, setIsEFExist] = useState(false);

  const fundInitialValues = { expenseAbroad: 0, expensePersonal: 0, liabilities: 0 };
  const [fundFormValues, setFundFormValues] = useState(fundInitialValues)
  const [conversion, setConversion] = useState(0)
  const [initialTotal, setInitialTotal] = useState(0)
  const [totalFund, setTotalFund] = useState(0)

  const [monthMultiplier, setMonthMultiplier] = useState(3)
  const [multiplierError, setMultiplierError] = useState({})
  const [currency, setCurrency] = useState("")
  const [currencyValue, setCurrencyValue] = useState(0)
  const [isSubmit, setIsSubmit] = useState(false);
  const [successEF, setSuccessEF] = useState(false);

  const savingsInitialValues = { savings_name: "", category: "", savings_goal: 0 };
  const [savingsFormValues, setSavingsFormValues] = useState(savingsInitialValues)
  const [savingsCategory, setSavingsCategory] = useState([])
  const [successSavings, setSuccessSavings] = useState(false);

  const [userInfo, setUserInfo] = useState({});
  const [getCountry, setGetCountry] = useState(false);
  const [getRate, setGetRate] = useState(false)
  const [exchangeRate, setExchangeRate] = useState({});

  const onChange = (e) => {
    setFundFormValues({ ...fundFormValues, [e.target.name]: e.target.value });
    setSavingsFormValues({ ...savingsFormValues, [e.target.name]: e.target.value });
  }

  const processFundFormValues = (multiplier) => {
    setCurrency(userInfo.currency)
    setCurrencyValue(exchangeRate.PHP.toFixed(2))

    const conversionValue = fundFormValues.expenseAbroad * currencyValue;

    setConversion(comma(conversionValue));
    const total = parseFloat(conversionValue) + parseFloat(fundFormValues.expensePersonal) + parseFloat(fundFormValues.liabilities);
    setInitialTotal(parseFloat(total))
    const getTotal = total * multiplier
    setTotalFund(getTotal)

  }
  useEffect(() => {
    const timeOutId = setTimeout(() => (processFundFormValues(monthMultiplier)), 300);
    return () => clearTimeout(timeOutId);
  });

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

  const increment = (e) => {
    let month = monthMultiplier + 1
    if (month <= 6) {
      processFundFormValues(month);
      setMultiplierError({});
      return setMonthMultiplier(month);
    } else {
      setMultiplierError({ increment: "Maximum of 6 mos." })
    }
  }

  const decrement = (e) => {
    let month = monthMultiplier - 1
    if (month >= 3) {
      processFundFormValues(month);
      setMultiplierError({});
      return setMonthMultiplier(month);
    } else {
      setMultiplierError({ decrement: "Minimum of 3 mos." })
    }
  }

  const getSavings = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/savings",
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem('token')
          }
        })
      const savings = await response.json()

      setSavings(savings)
      console.log(savings)

      for (const i of savings) {
        if (i.savings_name === "Emergency Fund") {
          setIsEFExist(true)
        }
      }

    } catch (error) {
      console.log(error.message)
    }
  }

  const getPercentage = (num1, num2) => {
    const percentage = (num1 / num2) * 100;
    return percentage
  }

  const getCategory = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/utils/savingscategory",
        {
          method: "GET",
        });
      const categoryList = await response.json();
      setSavingsCategory(categoryList)
    } catch (error) {
      console.log(error.message)
    }
  };

  const getUser = async () => {
    try {
      const response = await fetch("http://localhost:8000/utils/dash", {
        method: 'GET',
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      const parseUser = await response.json();
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
    getSavings();
    getCategory();
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

  const { expenseAbroad, expensePersonal, liabilities } = fundFormValues

  const onSetGoal = async (e) => {
    e.preventDefault()
    setIsSubmit(true)

    try {
      const body = { expenseAbroad, expensePersonal, liabilities, monthMultiplier, totalFund }

      const response = await fetch(
        "http://localhost:8000/savingsemergencyfund",
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem('token'),
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        })
      const parseEmergencyFund = await response.json()
      console.log(parseEmergencyFund)

      if (parseEmergencyFund.trigger) {
        setSuccessEF(true)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const { savings_name, category, savings_goal } = savingsFormValues

  const onSetSavingsGoal = async (e) => {
    e.preventDefault()
    setIsSubmit(true)

    try {
      const body = { savings_name, category, savings_goal }

      const response = await fetch(
        "http://localhost:8000/savings",
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem('token'),
            "Content-type": "application/json"
          },
          body: JSON.stringify(body)
        })
      const parseSavings = await response.json()
      console.log(parseSavings)

      if (parseSavings.trigger) {
        setSuccessSavings(true)
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const onClose = (e) => {
    setIsSubmit(false)
    setSavingsFormValues(savingsInitialValues)
    setSuccessSavings(false)
    window.location.reload()
  }

  const handleDelete = async (deleteID) => {
    try {
      await fetch(`http://localhost:8000/savings/${deleteID}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      getSavings()
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
            <h1 className="mt-5 text-primary title">SAVINGS</h1>
            <h5>Set and track your goals.</h5>
          </div>

          <div className="col-12 flex-wrap position-relative">

            {/* if Emergency Fund exists, hide initial container */}
            {!isEFExist ? (
              <div className="p-4 snip-card rounded-5 bg-white shadow mb-4">
                <h3 className="title">EMERGENCY FUND</h3>
                <p>When you are faced with life's unexpected events, you can be ready.</p>
                <div className="mt-2 d-flex justify-content-end">
                  <button className="btn btn-outline-primary rounded-pill px-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">Start your emergency fund</button>
                </div>
              </div>) : (<></>)}


            <div className="col-12 d-flex justify-content-end">

              <div className="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">

                <div className="offcanvas-header mt-2">

                  <h5 id="offcanvasRightLabel" className="mt-4">Create Emergency Fund</h5>
                  <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" onClick={e => window.location.reload()}></button>
                </div>

                {successEF && isSubmit ? (<div className="alert alert-success text-center m-4" role="alert">Hooray! Your emergency fund was created successfully! </div>) : (
                  <div className="offcanvas-body">

                    <form onSubmit={onSetGoal}>
                      <div className="mb-3">
                        <label for="expenseAbroad" className="form-label">Personal Expenses in {userInfo.country_name}</label>
                        <input type="number" className="form-control" name="expenseAbroad" aria-describedby="inputAbroadHelp" onChange={e => onChange(e)} value={fundFormValues.expenseAbroad} />
                        <div id="inputAbroadHelp" className="form-text text-muted px-2">
                          Add up your bills in a month such as rent, electricity, water, phone bills, internet, etc.
                        </div>
                      </div>

                      <div className="mb-3">
                        <label for="expensePersonal" className="form-label">Expenses in the Philippines</label>
                        <input type="number" className="form-control" name="expensePersonal" aria-describedby="inputPHHelp" onChange={e => onChange(e)} value={fundFormValues.expensePersonal} />
                        <div id="inputPHHelp" className="form-text text-muted px-2">
                          Add up your family's bills in a month such as rent, electricity, water, phone bills, internet, etc.
                        </div>
                      </div>

                      <div className="mb-4">
                        <label for="liabilities" className="form-label">Liabilities</label>
                        <input type="number" className="form-control" name="liabilities" aria-describedby="liabilityHelp" onChange={e => onChange(e)} value={fundFormValues.liabilities} />
                        <div id="liabilityHelp" className="form-text text-muted px-2">Add up your mortgages, car loans, insurances, etc.</div>
                      </div>

                      <div className="text-center pb-3">
                        <p className="form-text text-muted">PHP {comma(initialTotal)} ~ {currency} {fundFormValues.expenseAbroad} = PHP {conversion}<br />
                          Est. conversion at {currency} 1 = PHP {currencyValue}</p>
                      </div>

                      <div className="d-flex justify-content-around align-items-start mt-2 pb-3">

                        <button className="btn btn-primary rounded-pill" type="button" onClick={(e) => decrement(e)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                          </svg></button>

                        <div className="text-center">
                          <h4>{monthMultiplier} months</h4>
                          {multiplierError.increment ? (<p>{multiplierError.increment}</p>) : (<p>{multiplierError.decrement}</p>)}
                        </div>

                        <button className="btn btn-primary rounded-pill" type="button" onClick={(e) => increment(e)}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                          </svg></button>

                      </div>

                      <div className="text-center mb-5">
                        <h2 id="totalFund" className="title-number">PHP {comma(totalFund)}</h2>
                      </div>

                      {totalFund === 0 ? (<button className="btn btn-primary col-12 align-self-end rounded-pill" disabled>Set Goal</button>) : (
                        <button type="submit" className="btn btn-primary col-12 align-self-end rounded-pill" id="efSubmit">Set Goal</button>)}

                    </form>
                  </div>
                )}

              </div>
            </div>

            {/* Contains all savings card */}
            {savings.map(savings => {
              return <div className="px-5 py-4 snip-card rounded-5 bg-white shadow mb-4">
                <div className="row">
                  <div className="d-flex flex-wrap justify-content-between mt-3">
                    <h3 className="title mb-3 text-uppercase">{savings.savings_name}</h3>
                    <div className="col-xl-1 text-end">
                      <button type="button" className="btn-close" aria-label="Close" onClick={(e) => handleDelete(savings.id)} />
                    </div>
                  </div>
                </div>

                <ProgressBar now={getPercentage(savings.current_value, savings.savings_goal)} variant="secondary" bsPrefix="progress" />

                <div className="d-flex flex-wrap justify-content-between mt-3">
                  <h5 className="title-number" id="savings1Deposit">P {comma(savings.current_value)}</h5>
                  <h5 className="title-number" id="savings1Goal">P {comma(savings.savings_goal)}</h5>
                </div>
                <div className="mt-2 d-flex justify-content-end">
                  <Link to={`/savings/${savings.id}`}>
                    <button className="btn btn-outline-primary rounded-pill px-5" type="button" >Deposit / Withdraw</button>
                  </Link>
                </div>
              </div>
            })}

            <button className="btn btn-primary p-3 snip-card mt-3 mb-5 rounded-5 col-12" type="button" data-bs-toggle="offcanvas" data-bs-target="#savingsoffcanvasRight" aria-controls="savingsoffcanvasRight">ADD SAVING GOALS +</button>

            <div className="offcanvas offcanvas-end" tabindex="-1" id="savingsoffcanvasRight" aria-labelledby="savingsoffcanvasRightLabel">

              <div className="offcanvas-header mt-2">
                <h5 id="savingsoffcanvasRightLabel">SAVING GOAL</h5>
                <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" onClick={e => onClose(e)}></button>
              </div>

              {successSavings && isSubmit ? (<div className="alert alert-success text-center m-4" role="alert">Hooray! Your saving goal was created successfully! </div>) : (
                <div className="offcanvas-body">

                  <form onSubmit={onSetSavingsGoal}>
                    <div className="mb-3">
                      <label for="savingGoalName" className="form-label">Goal Name</label>
                      <input type="input" className="form-control" name="savings_name" aria-describedby="inputAbroadHelp" placeholder="Name of saving goal" value={savingsFormValues.savings_name} onChange={e => onChange(e)} />
                    </div>

                    <label for="savingsCategory">Category</label>
                    <select className="form-control mt-1 mb-2" name="category" value={savingsFormValues.category} onChange={e => onChange(e)}>
                      <option>--Select Category--</option>
                      {savingsCategory.map((categoryList) => (
                        <option value={categoryList.category_name}> {categoryList.category_name}</option>
                      ))}
                    </select>

                    <div className="mb-3">
                      <label for="savingGoalAmount" className="form-label">Amount Goal</label>
                      <input type="number" className="form-control" name="savings_goal" aria-describedby="inputPHHelp" value={savingsFormValues.savings_goal} onChange={e => onChange(e)} />
                    </div>

                    {savingsFormValues.savings_goal === 0 || !savingsFormValues.savings_name || !savingsFormValues.category ? (<button className="btn btn-primary col-12 align-self-end rounded-pill" disabled>Set Goal</button>) : (
                      <button type="submit" className="btn btn-primary col-12 align-self-end rounded-pill" id="savingsSubmit">Set Goal</button>)}

                  </form>

                </div>
              )}

            </div>
          </div>
        </div>

      </main>
    </div>
  )
}

export default Savings