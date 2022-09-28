import express from "express";
import { auth } from "../auth.js";
import { connectDatabase } from "../../pool.js";

const pool = connectDatabase();
const router = express.Router();

//CREATE PAYMENT
router.post("/", auth, async (req, res, next) => {
  console.log("Payment - POST");

  const userUUID = req.user.uuid;
  const { org_id, title, amount, due_date, interval } = req.body;

  const getTitle = (num) =>{

    if(num == 0){
      let title = 'PhilHealth'
      return title
    } else if(num == 1){
      let title = 'SSS'
      return title
    } else if(num == 2){
      let title = 'Pag-IBIG Fund'
      return title
    } else if(num == 3){
      let title = 'OWWA'
      return title
    } else {
      return title
    }
}
const newTitle = getTitle(org_id);

  try {
    const newPayment = await pool.query(
      `INSERT INTO payment (uuid, org_id, title, amount, due_date, interval)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userUUID, org_id, newTitle, amount, due_date, interval]
    );
    console.log(newPayment.rows[0]);
    res.status(201).json({ trigger: true, message: "Payment recorded!" });
  } catch (err) {
    next(err);
  }
});

// //UPDATE SAVINGS
// router.put("/:id", auth, async (req, res, next) => {
//   console.log("Savings - PUT/UPDATE");

//   const { savings_name, category, savings_goal } = req.body;

//   try {
//     const updateSavings = await pool.query(
//       `UPDATE savings SET savings_name=$1, category=$2, savings_goal = $3
//             WHERE id = $4 RETURNING *`,
//       [savings_name, category, savings_goal, req.params.id]
//     );
//     console.log(updateSavings.rows[0]);
//     res.status(201).json({ trigger: true, message: "Saving goal updated!" });
//     console.log("Saving goal updated!");
//   } catch (err) {
//     next(err);
//   }
// });

//DELETE PAYMENT
router.delete("/:id", auth, async (req, res, next) => {
  console.log("Payment - DELETE");

  try {
    await pool.query(`DELETE FROM payment WHERE id = $1`, [req.params.id]);
    res
      .status(201)
      .json({ trigger: true, message: "Account has been deleted!" });
    console.log("Account has been deleted!");
  } catch (err) {
    next(err);
  }
});

//GET PAYMENT
router.get("/get/:id", auth, async (req, res, next) => {
  console.log("Savings - GET");

  try {
    const payment = await pool.query(
      `SELECT * FROM savings
            WHERE id = $1`,
      [req.params.id]
    );
    res.status(201).json(payment.rows[0]);
    console.log("Saving goal pulled!");
  } catch (err) {
    next(err);
  }
});

//GET ALL PAYMENTS
router.get("/", auth, async (req, res, next) => {
  console.log("Payment- GET ALL");
  const userUUID = req.user.uuid;

  try {
    const allPayments = await pool.query(
      `SELECT * FROM payment 
            WHERE uuid = $1
            ORDER BY due_date;`,
      [userUUID]
    );
    res.status(201).json(allPayments.rows);
    console.log("Payments pulled!");
  } catch (err) {
    next(err);
  }
});

//GET ALL PAYMENT
router.get("/cards", auth, async (req, res, next) => {
  console.log("Payment - GET ALL CARDS");
  const userUUID = req.user.uuid;

  try {
    const allPayments = await pool.query(
      `SELECT payment.org_id, payment.amount, payment.due_date, payment.title, organization.org_name
            FROM payment
            FULL JOIN organization
            ON payment.org_id = organization.id
            WHERE uuid = $1
            ORDER BY due_date;`,
      [userUUID]
    );
    res.status(201).json(allPayments.rows);
    console.log("All payments pulled!");
  } catch (err) {
    next(err);
  }
});

export default router;
