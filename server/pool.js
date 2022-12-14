import pg from "pg"
import dotenv from "dotenv";

dotenv.config();

// const prodConfig = {
//     connectionString : process.env.DATABASE_URL,
//     ssl : {
//         rejectUnauthorized: false
//     }
// }

// const connectDatabase = () => {
//     const pool = new pg.Pool(prodConfig)
//     return pool
// }

const connectDatabase = () => {
    const pool = new pg.Pool( {
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        port: process.env.DATABASE_PORT,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD
    });

    return pool;
}

export { connectDatabase }
