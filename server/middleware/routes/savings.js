import express from "express";
import { auth } from "../auth.js";
import { connectDatabase } from "../../pool.js";

const pool = connectDatabase();
const router = express.Router();

//CREATE SAVINGS
router.post("/", auth, async (req, res, next) => {
  console.log("Savings - POST");

  const userUUID = req.user.uuid;
  const { savings_name, category, savings_goal } = req.body;

  try {
    const newSavings = await pool.query(
      `INSERT INTO savings (uuid, savings_name, category, savings_goal)
            VALUES ($1, $2, $3, $4) RETURNING *`,
      [userUUID, savings_name, category, savings_goal]
    );
    console.log(newSavings.rows[0]);
    res.status(201).json({ trigger: true, message: "Saving goal recorded!" });
  } catch (err) {
    next(err);
  }
});

//UPDATE SAVINGS
router.put("/:id", auth, async (req, res, next) => {
  console.log("Savings - PUT/UPDATE");

  const { savings_name, category, savings_goal } = req.body;

  try {
    const updateSavings = await pool.query(
      `UPDATE savings SET savings_name=$1, category=$2, savings_goal = $3
            WHERE id = $4 RETURNING *`,
      [savings_name, category, savings_goal, req.params.id]
    );
    console.log(updateSavings.rows[0]);
    res.status(201).json({ trigger: true, message: "Saving goal updated!" });
    console.log("Saving goal updated!");
  } catch (err) {
    next(err);
  }
});

//UPDATE CURRENT VALUE
router.put("/currentval/:id", auth, async (req, res, next) => {
  console.log("Savings - PUT/UPDATE");

  const { transAmountTotal } = req.body;

  try {
    const updateSavings = await pool.query(
      `UPDATE savings SET current_value=$1
            WHERE id = $2 RETURNING *`,
      [transAmountTotal, req.params.id]
    );
    console.log(updateSavings.rows[0].current_value);
    res.status(201).json({ trigger: true, message: "Saving goal updated!" });
    console.log("Saving goal updated!");
  } catch (err) {
    next(err);
  }
});

//DELETE SAVINGS
router.delete("/:id", auth, async (req, res, next) => {
  console.log("Savings - DELETE");

  try {
    await pool.query(`DELETE FROM savings_transaction WHERE savings_id = $1`, [req.params.id])
    await pool.query(`DELETE FROM emergency_fund WHERE savings_id = $1`, [req.params.id])
    await pool.query(`DELETE FROM savings WHERE id = $1`, [req.params.id]);
    res
      .status(201)
      .json({ trigger: true, message: "Saving goal has been deleted!" });
    console.log("Saving goal has been deleted!");
  } catch (err) {
    next(err);
  }
});

//GET ALL SAVINGS
router.get("/get/:id", auth, async (req, res, next) => {
  console.log("Savings - GET");

  try {
    const allSavings = await pool.query(
      `SELECT * FROM savings
            WHERE id = $1`,
      [req.params.id]
    );
    res.status(201).json(allSavings.rows[0]);
    console.log("Saving goal pulled!");
  } catch (err) {
    next(err);
  }
});

//GET ALL SAVINGS
router.get("/", auth, async (req, res, next) => {
  console.log("Savings - GET ALL");
  const userUUID = req.user.uuid;

  try {
    const allSavings = await pool.query(
      `SELECT * FROM savings
            WHERE uuid = $1
            ORDER BY CASE WHEN category = 'Emergency Fund' THEN 1
            END;`,
      [userUUID]
    );
    res.status(201).json(allSavings.rows);
    console.log("Saving goal pulled!");
  } catch (err) {
    next(err);
  }
});

//GET ALL SAVINGS
router.get("/cards", auth, async (req, res, next) => {
  console.log("Savings - GET ALL");
  const userUUID = req.user.uuid;

  try {
    const allSavings = await pool.query(
      `SELECT savings.savings_name, savings.savings_goal,
      savings.id, savings.current_value, savings.category, emergency_fund.month 
            FROM savings
            FULL JOIN emergency_fund
            ON emergency_fund.savings_id = savings.id
            WHERE uuid = $1
            ORDER BY CASE WHEN category = 'Emergency Fund' THEN 1
            END;`,
      [userUUID]
    );
    res.status(201).json(allSavings.rows);
    console.log("Saving goal pulled!");
  } catch (err) {
    next(err);
  }
});

export default router;
