const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = 3000
const Pool = require('pg').Pool

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true, }))


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'cats',
    password: '458691',
    port: 5432
});

app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/cats', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users');
        res.json(users.rows)
        console.log(req.protocol)     // "https"
        console.log(req.hostname)     // ""
        console.log(req.path)         // "/"
    } catch (error) {
        console.log(error)
    }
})

app.get('/data', (req, res) => {
    const data = {
        firstname: 'John',
        lastname: 'Doe',
        suffix: 'III'
    }
    res.json(data)
})

app.post('/cats', async (req, res) => {
    try {
        const { name, breed } = req.body
        const users = await pool.query(
            `INSERT INTO users (name, breed)
            VALUES ($1, $2) RETURNING *`, [name, breed]
        );
            res.json(users.rows)
    } catch (error) {
        console.log(error)
    }
})

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
})