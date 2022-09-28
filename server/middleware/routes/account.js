import express from "express";
import bcrypt from "bcryptjs";
import { connectDatabase } from "../../pool.js";
import { auth } from "../auth.js";

const pool = connectDatabase();
const router = express.Router();

// GET
router.get("/", auth, async (req, res, next) => {
  console.log("Account: Profile - GET");

  const userUUID = req.user.uuid;
  const userQuery = req.user;

  try {
    const checkData = await pool.query(
      `SELECT * FROM user_info WHERE uuid = $1`,
      [userUUID]
    );

    if (checkData.rowCount > 0) {
      const userInfo = await pool.query(
        `SELECT * FROM users INNER JOIN user_info ON users.uuid = user_info.uuid 
                INNER JOIN country ON user_info.country = country.country_code
                WHERE users.uuid = $1`,
        [userUUID]
      );
      res.json(userInfo.rows[0]);
    } else {
      res.json(userQuery);
    }
  } catch (error) {
    console.error(error.message);
    next(error);
  }
});

// UPDATE ACCOUNT
router.put("/", auth, async (req, res, next) => {
  console.log("Account - PUT/UPDATE");

  const userUUID = req.user.uuid;
  const { username, email, userpassword, errorLog, tempEmail, tempUsername } = req.body;

  try {
    const existingUser = await pool.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    const existingEmail = await pool.query(
      `SELECT * FROM users WHERE email = $1`,
      [email]
    );

    // condition - compare if the current username and password are the same with the input,
    // else if- compare it with others if there is the same data,
    // else - send error

    if (Object.keys(errorLog).length != 0) {
      console.log("Form Error");
      return res.json();
    } else if(tempUsername == username && tempEmail == email){
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const bcryptPassword = await bcrypt.hash(userpassword, salt);

      const updateUser = await pool.query(
        `UPDATE users SET username = $1, email = $2, userpassword= $3
                WHERE uuid = $4 RETURNING *`,
        [username, email, bcryptPassword, userUUID]
      );
      console.log("Account has been successfully updated!");
      return res.json(updateUser);

    } else if (tempUsername != username && tempEmail == email){
        if (existingUser.rowCount != 0) {
          console.log("Username has been taken");
          return res.json({ usernameError: "Username has been taken" });
        } else {
          const saltRound = 10;
          const salt = await bcrypt.genSalt(saltRound);
          const bcryptPassword = await bcrypt.hash(userpassword, salt);
    
          const updateUser = await pool.query(
            `UPDATE users SET username = $1, email = $2, userpassword= $3
                    WHERE uuid = $4 RETURNING *`,
            [username, email, bcryptPassword, userUUID]
          );
          console.log("Account has been successfully updated!");
          return res.json(updateUser);
        }
        
    } else if (tempUsername == username && tempEmail != email){
        if (existingEmail.rowCount != 0) {
          console.log("Email has been used");
          return res.json({ emailError: "Email has been used" });
        } else {
          const saltRound = 10;
          const salt = await bcrypt.genSalt(saltRound);
          const bcryptPassword = await bcrypt.hash(userpassword, salt);
    
          const updateUser = await pool.query(
            `UPDATE users SET username = $1, email = $2, userpassword= $3
                    WHERE uuid = $4 RETURNING *`,
            [username, email, bcryptPassword, userUUID]
          );
          console.log("Account has been successfully updated!");
          return res.json(updateUser);
        }

    } else if (tempUsername != username && tempEmail != email) {
        if (existingUser.rowCount != 0 && existingEmail.rowCount != 0) {
          console.log("Username has been taken");
          return res.json({
            usernameError: "Username has been taken",
            emailError: "Email has been used",
          });
        } else if (existingUser.rowCount != 0) {
          console.log("Username has been taken");
          return res.json({ usernameError: "Username has been taken" });
        } else if (existingEmail.rowCount != 0) {
          console.log("Email has been used");
          return res.json({ emailError: "Email has been used" });
        } else if (existingUser.rowCount === 0 && existingEmail.rowCount === 0) {
          const saltRound = 10;
          const salt = await bcrypt.genSalt(saltRound);
          const bcryptPassword = await bcrypt.hash(userpassword, salt);

          const updateUser = await pool.query(
            `UPDATE users SET username = $1, email = $2, userpassword= $3
                    WHERE uuid = $4 RETURNING *`,
            [username, email, bcryptPassword, userUUID]
          );
          res.json(updateUser);
          console.log("Account has been successfully updated!");
        }
  } 
  } catch (error) {
    console.error(error.message);
    next(error);
  }
});

// UPDATE PROFILE
router.put("/profile", auth, async (req, res, next) => {
  console.log("Account: Profile - PUT/UPDATE");

  const userUUID = req.user.uuid;
  const { firstname, lastname, birthdate, country, phone } = req.body;

  try {
    const checkData = await pool.query(
      `SELECT * FROM user_info WHERE uuid = $1`,
      [userUUID]
    );
    const getCode = await pool.query(
      `SELECT * FROM country WHERE country_name= $1`,
      [country]
    );
    const code = await getCode.rows[0].country_code;

    console.log(code);
    console.log(checkData);
    console.log(getCode);

    if (checkData.rowCount === 0) {
      const newProfileData = await pool.query(
        `INSERT INTO user_info (uuid, firstname, lastname, birthdate, country, phone)
                VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [userUUID, firstname, lastname, birthdate, code, phone]
      );

      res.json(newProfileData);
      console.log("No data yet, Profile has been successfully updated!");
    } else {
      const updateProfileData = await pool.query(
        `UPDATE user_info
                SET firstname = $1, lastname= $2, birthdate= $3, country=$4, phone=$5
                WHERE uuid = $6 RETURNING *`,
        [firstname, lastname, birthdate, code, phone, userUUID]
      );

      res.json(updateProfileData);
      console.log("Data exist, Profile has been successfully updated!");
    }
  } catch (error) {
    console.error(error.message);
    next(error);
  }
});

export default router;
