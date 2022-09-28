import express from "express";
import { connectDatabase } from "../../pool.js";
import multer from "multer";
import { auth } from "../auth.js";

const pool = connectDatabase();
const router = express.Router();

router.get("/countries", async (req, res, next) => {
  try {
    const countryList = await pool.query(`SELECT country_name FROM country ORDER BY id;`)
    res.json(countryList.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/dash", auth, async (req, res, next) => {
  const userUUID = req.user.uuid;

  try {
    const countryList = await pool.query(
      `SELECT * FROM users
            FULL OUTER JOIN user_info ON users.uuid = user_info.uuid
            FULL OUTER JOIN country ON user_info.country = country.country_code
            WHERE users.uuid = $1`,
            [userUUID]
            );
    res.json(countryList.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get("/savingscategory", async (req, res, next) => {
  try {
    const categoryList = await pool.query(
      `SELECT category_name FROM savings_category OFFSET 1;`
    );
    res.json(categoryList.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/transcategory", async (req, res, next) => {
  try {
    const categoryList = await pool.query(`SELECT name FROM trans_category;`);
    res.json(categoryList.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/countries", async (req, res, next) => {
  try {
    const countryList = await pool.query(`SELECT country_name FROM country ORDER BY id;`)
    res.json(countryList.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/interval", async (req, res, next) => {
  try {
    const interval = await pool.query(`SELECT type FROM payment_interval;`)
    res.json(interval.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/organizations", async (req, res, next) => {
  try {
    const orgList = await pool.query(`SELECT id, org_name FROM organization ORDER BY id;`)
    res.json(orgList.rows);
  } catch (error) {
    next(error);
  }
});

router.get("/overdue", auth, async (req, res, next) => {
  const userUUID = req.user.uuid;
  try {
    const overdue = await pool.query(
      `SELECT org_id, due_date, title, amount from payment
      INNER JOIN users on users.uuid = payment.uuid
      WHERE users.uuid = $1 AND due_date < NOW()
      ORDER BY due_date;`, [userUUID])
    res.json(overdue.rows);
  } catch (error) {
    next(error);
  }
});


//static route
router.use("/img", express.static("public/uploads"));

//multer storage
// saan ilalagay and then yung filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },

  filename: (req, file, cb) => {
    const uniquePrefix = Date.now();
    cb(null, uniquePrefix + file.fieldname + ".png");
  },
});

const logger = (req, res, next) => {
  console.log(`Visited ${req.url} at ${new Date()}`);
  next();
};

// const upload = multer( {storage: storage})

// router.post('/upload', upload.single('my-image'), async (req, res) => {
//     const { filename } = req.file

//     console.log(filename)

//     const newPicture = await pool.query(`
//     INSERT INTO pictures VALUES
//     (default, $1)`, [filename])

//     res.send('Image uploaded')
// })

// multer middleware

const upload = multer({ storage: storage });

router.post("/upload", upload.single("my-image"), async (req, res) => {
  const { filename } = req.file;

  const newPicture = await pool.query(
    `
    INSERT INTO pictures VALUES
    (default, $1)
    `,
    [filename]
  );

  res.json({ msg: "Image uploaded" });
});

router.get("/photos", async (req, res) => {
  try {
    const response = await pool.query(`
        SELECT * FROM pictures
        `);

    res.json(response.rows);
  } catch (error) {
    console.log(error.message);
  }
});

export default router;
