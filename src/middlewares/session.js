// middleware/session.js
const session = require("express-session");
const { v4 } = require('uuid')
    //const RedisStore = require("connect-redis")(session);
    //const redis = require("redis");
const RedisStore = require("connect-redis").default
const { createClient } = require("redis")

require('dotenv').config();

const redisClient = createClient();
redisClient.connect()
console.log("Connected to Redis")

const redisStore = new RedisStore({
    client: redisClient,
    prefix: ''
})

const sessionConfig = {
    store: redisStore,
    secret: process.env.SECRET,
    saveUninitialized: true,
    genid: () => v4(),
    resave: true,
    unset: 'destroy',
    rolling: true, //get a cookie
    cookie: {
        secure: false, // Set to true for HTTPS
        httpOnly: false,
        domain: 'localhost',
        maxAge: 60 * 60 * 1000 * 24, // 1 day
    },
};

module.exports = session(sessionConfig);