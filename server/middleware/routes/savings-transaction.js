import express from "express";
import { auth } from "../auth.js";
import { connectDatabase } from "../../pool.js";

const pool = connectDatabase();
const router = express.Router();

//CREATE TRANSACTION
router.post("/", auth, async (req, res, next) => {
  console.log("Transaction - POST");

  const userUUID = req.user.uuid;
  const { category, trans_amount, id } = req.body;

  try {
    const newTransaction = await pool.query(
      `INSERT INTO savings_transaction (uuid, savings_id, category, trans_amount)
            VALUES ($1, $2, $3, $4) RETURNING *`,
      [userUUID, id, category, trans_amount]
    );
    console.log(newTransaction.rows[0]);
    res.status(201).json({ trigger: true, message: "Transaction recorded!" });
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

//DELETE TRANSACTION
router.delete("/:id", auth, async (req, res, next) => {
  console.log("Transaction - DELETE");

  try {
    await pool.query(`DELETE FROM savings_transaction WHERE id = $1`, [
      req.params.id,
    ]);
    res
      .status(201)
      .json({ trigger: true, message: "Transaction has been deleted!" });
    console.log("Transaction has been deleted!");
  } catch (err) {
    next(err);
  }
});

//GET TRANSACTION BY ID
router.get("/:id", auth, async (req, res, next) => {
  console.log("Transaction - GET");

  try {
    const transactionByID = await pool.query(
      `SELECT * FROM savings_transaction WHERE savings_id = $1`,
      [req.params.id]
    );
    res.status(201).json(transactionByID.rows);
    console.log("Transactions pulled!");
  } catch (err) {
    next(err);
  }
});

//GET ALL TRANSACTIONS
router.get("/", auth, async (req, res, next) => {
  console.log("Transaction - GET ALL");
  const userUUID = req.user.uuid;

  try {
    const allTransaction = await pool.query(
      `SELECT * FROM savings_transaction WHERE uuid = $1`,
      [userUUID]
    );
    res.status(201).json(allTransaction.rows);
    console.log("Transactions pulled!");
  } catch (err) {
    next(err);
  }
});

export default router;
