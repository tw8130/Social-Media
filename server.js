const express = require('express');
const app = express();
const mssql = require('mssql')
const session = require("./src/middlewares/session");
const RedisStore = require("connect-redis").default;
const { createClient } = require("redis")
    // const session = require('express-session');
    // const cron = require('node-cron')
    // const users = require('./data');
require('dotenv').config();

// const port = 4000;

const port = process.env.PORT || 4000

const router = require('./src/routes/user');
app.use(session);
app.use(express.json());


app.use('/', router);

// app.get('/', (req, res) => {
//         res.send('OK')
//     })
//handles undefined routes

// Database configuration
const config = require("./src/config/config");
const pool = new mssql.ConnectionPool(config);

// Connect to the database
pool.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        process.exit(1);
    }
    console.log("Connected to the database");


})

const redisClient = createClient();
redisClient.connect()
console.log("Connected to Redis")

const redisStore = new RedisStore({
    client: redisClient,
    prefix: ''
})

// Close the Redis client when the server shuts down
process.on("SIGINT", () => {
    redisClient.quit();
    process.exit();
});

app.use((req, res, next) => {
    req.pool = pool;
    next()
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})

app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: "Not found"
    })
})

// cron.schedule('* 5-7 * * * * *', () => {
//     console.log('This runs every second')
// })
// async function APP() {
//     try {
//         const pool = await sql.connect(config)
//         console.log('App connected to the database')
//         app.locals.pool
//     } catch (error) {
//         console.log()
//     }

// }




// Export the pool for use in other files
module.exports = { pool };