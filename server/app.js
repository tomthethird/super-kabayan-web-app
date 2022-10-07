import express, { application, Router } from "express";
import bodyParser from "body-parser";
import { connectDatabase } from "./pool.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoute from "./middleware/routes/auth.js";
import accountRoute from "./middleware/routes/account.js";
import savingsRoute from "./middleware/routes/savings.js";
import emergencyfundRoute from "./middleware/routes/emergencyfund.js";
import transactionRoute from "./middleware/routes/savings-transaction.js";
import paymentRoute from "./middleware/routes/payment.js"
import utilsRoute from "./middleware/routes/utils.js";

dotenv.config();

const app = express();
const pool = connectDatabase();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRoute);
app.use("/account", accountRoute);
app.use("/savings", savingsRoute);
app.use("/savingsemergencyfund", emergencyfundRoute);
app.use("/savings-transaction", transactionRoute);
app.use("/utils", utilsRoute);
app.use("/payment", paymentRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

pool.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    // app.listen(PORT, () => {
    //     console.log(`Server has started on http://localhost:${PORT}`)

    const server = app.listen(PORT, () => {
      const port = server.address().port;
      console.log(`Server has started on https://superkabayan.herokuapp.com:${PORT}`);
    });
    // })
  }
});
