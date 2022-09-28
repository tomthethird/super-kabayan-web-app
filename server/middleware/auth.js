import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const auth = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    console.log("No token found!");
    return res.status(403).json({
      error: "No token found",
    });
  }
  try {
    JWT.verify(token, process.env.JWTSECRET, (err, user) => {
      if (err) return res.status(403).send(err);
      req.user = user;
      next();
    });
  } catch (err) {
    next(err);
  }
};
export { auth };
