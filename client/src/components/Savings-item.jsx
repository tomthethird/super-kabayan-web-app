import React from "react";
import { useState, useEffect } from "react";
import HeaderDynamic from "./HeaderDynamic";
import SidebarNav from "./SidebarNav";
import ProgressBar from "react-bootstrap/ProgressBar";
import Badge from "react-bootstrap/Badge";
import { Link, useParams } from "react-router-dom";

const SavingsItem = ({ setAuth }) => {
  const { id } = useParams();

  const initFormValues = { category: "", trans_amount: 0 };
  const [formValues, setformValues] = useState(initFormValues);
  const [savings, setSavings] = useState([]);
  const [allTransaction, setAllTransaction] = useState([]);
  const [transButton, setTransButton] = useState("Deposit");
  const [savingsTitle, setSavingsTitle] = useState("");
  const [isSubmit, setIsSubmit] = useState(false);
  const [successTransac, setSuccessTransac] = useState(false);
  const [transAmountTotal, setTransAmountTotal] = useState(0);
  const [successDelete, setSuccessDelete] = useState(false);

  const onChange = (e) => {
    setformValues({ ...formValues, [e.target.name]: e.target.value });
  };

  const getSavings = async () => {
    try {
      const response = await fetch(`http://localhost:8000/savings/get/${id}`, {
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      const savings = await response.json();
      setSavings(savings);
      setSavingsTitle(savings.savings_name.toUpperCase());
    } catch (error) {
      console.log(error.message);
    }
  };

  const getTransaction = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/savings-transaction/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );
      const parseTransaction = await response.json();
      setAllTransaction(parseTransaction);
      console.log(parseTransaction);

      let total = 0;
      for (var i = 0; i < parseTransaction.length; i++) {
        total = total + parseTransaction[i].trans_amount;
      }
      console.log(total);
      setTransAmountTotal(total);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getSavings();
    getTransaction();
  }, []);

  useEffect(() => {
    const timeOutId = setInterval(() => {
      updateSavingsCurrentVal();
    }, 1000);
    return () => clearTimeout(timeOutId);
  });

  let { category, trans_amount } = formValues;

  const onSubmitTransaction = async (e) => {
    e.preventDefault();
    getTransaction();
    setIsSubmit(true);
    console.log(formValues);

    if (category === "withdraw") {
      trans_amount = trans_amount * -1;
    }

    try {
      const body = { category, trans_amount, id };

      const response = await fetch(
        `http://localhost:8000/savings-transaction`,
        {
          method: "POST",
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );
      const parseTransac = await response.json();
      console.log(parseTransac);

      if (parseTransac.trigger) {
        setSuccessTransac(true);
      }
      await updateSavingsCurrentVal();
      await getSavings();

      reload(1500);
    } catch (error) {
      console.log(error.message);
    }
  };

  const reload = (num) => {
    const timeOutId = setInterval(() => window.location.reload(), num);
    return () => clearTimeout(timeOutId);
  };

  const getPercentage = (num1, num2) => {
    const percentage = (num1 / num2) * 100;
    return percentage;
  };

  const updateSavingsCurrentVal = async () => {
    try {
      const body = { transAmountTotal };
      await fetch(`http://localhost:8000/savings/currentval/${id}`, {
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete = async (deleteID) => {
    try {
      await fetch(`http://localhost:8000/savings-transaction/${deleteID}`, {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });
      getTransaction();
      setSuccessDelete(true);
    } catch (error) {
      console.log(error.message);
    }
  };

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
      <HeaderDynamic pushAuth={boolean => setAuth(boolean)} />
      <SidebarNav />
      <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
        <div className="my-1 p-5"></div>
        {/* header padding */}
        <div className="container-fluid bg-light" id="background">
          <div className="container p-3">
            <div>
              <div className="row p-5 d-flex justify-content-center">
                <div className="col-xl-5 p-4">

                  <div className="container bg-white rounded-5 shadow p-5">
                    <div className="row">
                      <div className="d-flex col-xl-8 justify-content-start align-items-center">
                        <h4>Make Transaction</h4>
                      </div>
                      <div className="d-flex col-xl-4 justify-content-end">
                        <Link to="/savings">
                          <button type="button" className="btn-close" aria-label="Close"/>
                        </Link>
                      </div>
                    </div>

                    {successTransac && isSubmit ? (
                      <div className="alert alert-success text-center mt-3" role="alert">
                        Transaction complete!
                      </div>
                    ) : (
                      <form onSubmit={onSubmitTransaction}>
                        <div class="form-check form-check-inline mt-3">
                          <input class="form-check-input" type="radio" name="category" id="deposit"
                            value="deposit" onClick={(e) => setTransButton("Deposit")} onChange={(e) => onChange(e)} />
                          <label class="form-check-label" for="deposit" value="deposit">Deposit</label>
                        </div>
                        <div class="form-check form-check-inline">
                          <input class="form-check-input" type="radio" name="category" id="withdraw"
                            value="withdraw" onClick={(e) => setTransButton("Withdraw")} onChange={(e) => onChange(e)} />
                          <label class="form-check-label" for="withdraw" value="withdraw">Withdraw</label>
                        </div>

                        <div className="my-4">
                          <label for="savingGoalName" className="form-label">Amount</label>
                          <input type="input" className="form-control" name="trans_amount" aria-describedby="inputAmountHelp"
                            value={formValues.trans_amount} onChange={(e) => onChange(e)} />
                        </div>
                        
                        {formValues.trans_amount === 0 || !formValues.category ? (
                          <button className="btn btn-outline-primary col-12 align-self-end rounded-pill" disabled>
                            {transButton}
                          </button>
                        ) : (
                          <button type="submit" className="btn btn-outline-primary col-12 align-self-end rounded-pill" id="savingsSubmit">
                            {transButton}
                          </button>
                        )}
                      </form>
                    )}

                  </div>
                </div>
                <div className="col-xl-7 p-4">
                  <div className="container bg-white rounded-5 shadow p-5">
                    <div className="row">
                      <div className="d-flex col-xl-7 justify-content-start align-items-center">
                        <h3 className="title">{savingsTitle}</h3>
                      </div>
                      <div className="d-flex col-xl-5 justify-content-end align-items-center">
                        <h5>
                          <Badge pill bg="secondary">{savings.category}</Badge>
                        </h5>
                      </div>
                    </div>

                    <div className="row mt-2">
                      <div>

                        <ProgressBar now={getPercentage( transAmountTotal, savings.savings_goal )}
                          variant="secondary"
                          bsPrefix="progress"
                        />
                      </div>
                      <div className="d-flex flex-wrap justify-content-between mt-3">
                        <h6 className="title-number" id="savings1Deposit">P {comma(transAmountTotal)}</h6>
                        <h6 className="title-number" id="savings1Goal">P {comma(savings.savings_goal)}</h6>
                      </div>
                    </div>
                  </div>
                  <div className="px-5">
                    <div className="flex-wrap flex-md-nowrap align-items-center pb-3 my-4 border-bottom">
                      <h5 className="mt-5">Transaction History</h5>
                    </div>
                    <div className="">

                      {successDelete ? (
                        <div className="alert alert-success text-center mt-3" role="alert">Transaction deleted!</div>
                      ) : (
                        <></>
                      )}

                      {allTransaction.map((trans) => {
                        return (
                          <div className="row d-flex justify-content-between">
                            <div className="col-xl-4 text-start"><p>{trans.created_at.slice(0, 10)}</p></div>
                            <div className="col-xl-3 text-center"><p>{trans.category.toUpperCase()}</p></div>
                            <div className="col-xl-3 text-end"><p>{comma(trans.trans_amount)}</p></div>
                            <div className="col-xl-2 text-end">
                              <button type="button" className="btn-close" aria-label="Close" onClick={(e) => handleDelete(trans.id)}/>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SavingsItem;
