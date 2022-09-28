import JWT from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateJWT = (user) => {
    return JWT.sign( user, 
        process.env.JWTSECRET, {
        expiresIn: 3600000})
};

export { generateJWT };