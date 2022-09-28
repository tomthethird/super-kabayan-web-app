import express from "express";
import { auth } from "../auth.js";
import { connectDatabase } from "../../pool.js";

const pool = connectDatabase();
const router = express.Router();

// CREATE EMERGENCY FUND
router.post("/", auth, async (req, res, next) => {
  console.log("Savings: Emergency Fund - POST");

  const userUUID = req.user.uuid;
  const {
    expenseAbroad,
    expensePersonal,
    liabilities,
    monthMultiplier,
    totalFund,
  } = req.body;

  try {
    console.log(req.body);

    const newSavings = await pool.query(
      `INSERT INTO savings (uuid, savings_name, category, savings_goal)
            VALUES ($1, $2, $3, $4) returning *`,
      [userUUID, "Emergency Fund", "Emergency Fund", totalFund]
    );

    const newEmergencyFund = await pool.query(
      `INSERT INTO emergency_fund (savings_id, expense_abroad, expense_personal, liabilities, month, total)
            VALUES ($1,$2,$3,$4,$5,$6) returning *`,
      [
        newSavings.rows[0].id,
        expenseAbroad,
        expensePersonal,
        liabilities,
        monthMultiplier,
        totalFund,
      ]
    );
    console.log(newEmergencyFund.rows[0]);
    res
      .status(201)
      .json({ trigger: true, message: "Emergency fund recorded!" });
  } catch (error) {
    console.error(error.message);
    next(err);
  }
});

//UPDATE EMERGENCY FUND
router.put("/", auth, async (req, res, next) => {
  console.log("Savings: Emergency Fund - PUT/UPDATE");

  const userUUID = req.user.uuid;
  const {
    expenseAbroad,
    expensePersonal,
    liabilities,
    monthMultiplier,
    totalFund,
  } = req.body;

  try {
    console.log(req.body);

    const checkData = await pool.query(
      `SELECT users.uuid, emergency_fund.id FROM users
            INNER JOIN savings ON users.uuid = savings.uuid
            INNER JOIN emergency_fund ON savings.id = emergency_fund.savings_id
            WHERE users.uuid = $1`,
      [userUUID]
    );

    if (checkData.rowCount > 0) {
      console.log("Record found. Updating data ...");

      const updateSavings = await pool.query(
        `UPDATE savings SET savings_goal = $1 WHERE savings_name = $2 RETURNING *`,
        [totalFund, "Emergency Fund"]
      );
      console.log(updateSavings.rows[0]);

      await pool.query(
        `UPDATE emergency_fund SET expense_abroad=$1, expense_personal=$2, liabilities=$3, month=$4, total=$5
                WHERE savings_id= $6 RETURNING *`,
        [
          expenseAbroad,
          expensePersonal,
          liabilities,
          monthMultiplier,
          totalFund,
          updateSavings.rows[0].id,
        ]
      );
      res.status(200).json({
        trigger: true,
        message: "Emergency Fund successfully updated!",
      });
      console.log("Emergency Fund successfully updated!");
    } else {
      res
        .status(406)
        .json({ trigger: false, message: "No Emergency Fund record!" });
    }
  } catch (error) {
    console.error(error.message);
    next(err);
  }
});

//DELETE EMERGENCY FUND
router.delete("/", auth, async (req, res, next) => {
  console.log("Savings: Emergency Fund - DELETE");

  // const userUUID = req.user.uuid;

  const { userUUID } = req.body;

  try {
    const checkData = await pool.query(
      `SELECT * FROM users
            INNER JOIN savings ON users.uuid = savings.uuid
            INNER JOIN emergency_fund ON savings.id = emergency_fund.savings_id
            WHERE users.uuid = $1`,
      [userUUID]
    );

    console.log(checkData.rows[0]);

    await pool.query(`DELETE FROM emergency_fund WHERE id = $1`, [
      checkData.rows[0].id,
    ]);
    await pool.query(`DELETE FROM savings WHERE id = $1`, [
      checkData.rows[0].savings_id,
    ]);
    res
      .status(201)
      .json({ trigger: false, message: "Emergency fund has been deleted!" });
    console.log("Emergency fund has been deleted!");
  } catch (err) {
    next(err);
  }
});

//GET EMERGENCY FUND
router.get("/", auth, async (req, res, next) => {
  console.log("Savings: Emergency Fund - DELETE");

  try {
    const emergencyFund = await pool.query(
      `SELECT * FROM savings
            INNER JOIN emergency_fund ON savings.id = emergency_fund.savings_id`
    );
    res.status(201).json(emergencyFund.rows[0]);
    console.log("Emergency fund has been pulled!");
  } catch (err) {
    next(err);
  }
});

export default router;
