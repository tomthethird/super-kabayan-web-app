import express from "express";
import bcrypt from "bcryptjs";
import { connectDatabase } from "../../pool.js";
import { v4 as uuidv4 } from "uuid";
import { generateJWT } from "../../jwt/jwtGenerator.js";
import { auth } from "../auth.js"

const pool = connectDatabase();
const router = express.Router();

//CREATE ACCOUNT
router.post("/register", async (req, res, next) => {
  const { username, email, userpassword, errorLog } = req.body;

  try {
    const existingUser = await pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    const existingEmail = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    if (Object.keys(errorLog).length != 0) {
      console.log("Form Error");
      return res.json();
    } else if (existingUser.rowCount != 0 && existingEmail.rowCount != 0) {
      console.log("Username has been taken");
      return res.json({
        usernameError: "Username has been taken.",
        emailError: "Email has been used.",
      });
    } else if (existingUser.rowCount != 0) {
      console.log("Username has been taken");
      return res.json({ usernameError: "Username has been taken." });
    } else if (existingEmail.rowCount != 0) {
      console.log("Email has been used");
      return res.json({ emailError: "Email has been used." });
    } else if (existingUser.rowCount === 0 && existingEmail.rowCount === 0) {
      //Setup bcrypt
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(userpassword, salt);

      const newUser = await pool.query(
        `INSERT INTO users (uuid, username, email, userpassword)
                VALUES ($1, $2, $3, $4) RETURNING *`,
        [uuidv4(), username, email, bcryptPassword]
      );

      const token = generateJWT(newUser.rows[0]);
      res.json({ message: "Account has been successfully created!", token });

      console.log("Account has been successfully created!");
    }
  } catch (error) {
    console.error(error.message);
    next(err);
  }
});

// LOGIN ACCOUNT
router.post("/login", async (req, res, next) => {
  console.log("Entered Login");
  const { email, userpassword, errorLog } = req.body;

  try {
    const potentialLogin = await pool.query(
      `SELECT * FROM users WHERE email=$1`,
      [email]
    );
    if (Object.keys(errorLog).length != 0) {
      console.log("Form Error");
      return res.json();
    } else if (potentialLogin.rowCount > 0) {
      const validPassword = await bcrypt.compare(
        userpassword,
        potentialLogin.rows[0].userpassword
      );

      if (validPassword) {
        console.log("Logged in successfully!");
        const token = generateJWT(potentialLogin.rows[0]);

        const { userpassword, ...otherDetails } = potentialLogin.rows[0];
        res
          .cookie("Authorization", token, { httpOnly: true })
          .status(200)
          .json({ ...otherDetails, token });
      } else {
        res.json({ status: "Wrong username or password" });
      }
    } else {
      res.json({ status: "Wrong username or password" });
    }
  } catch (err) {
    next(err);
  }
});

//VERIFY
router.get('/verify', auth, async (req, res) => {
  try {
      res.json(req.user)
  } catch (error) {
      res.status(500).send({ message: "Unauthenticated" })
  }
})

export default router;
