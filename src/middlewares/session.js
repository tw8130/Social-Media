// middleware/session.js
const session = require("express-session");
require('dotenv').config();

const sessionConfig = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    rolling: true, //get a cookie
    cookie: {
        secure: true, // Set to true for HTTPS
        httpOnly: true,
        maxAge: 60 * 60 * 1000 * 24, // 1 day
    },
};

module.exports = session(sessionConfig);