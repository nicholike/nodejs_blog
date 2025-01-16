require('dotenv').config();

const express = require('express');
const helmet = require('helmet'); // Import đúng cách
const morgan = require('morgan');
const compression = require('compression');
const app = express();

// init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


//init DB
require('./dbs/init.mongodb')
// const { countConnect, checkOver Load } = require('./helpers/check.connect');
// checkOverLoad()

// init routes

app.use('/', require('./routers'));


// handle errors

app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        // error: error.stack,
        message: error.message || 'Internal Server Error',
    })
})

module.exports = app;
