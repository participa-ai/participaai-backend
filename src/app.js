const express = require('express');
const path = require('path');

const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');

const errorHandler = require('./api/middleware/errorHandler');
const loader = require('./utils/loaders/app');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
});

const app = express()
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cors())
    .use(cookieParser())
    .use(mongoSanitize())
    .use(helmet())
    .use(xss())
    .use(hpp())
    .use(limiter)
    .use(
        '/files',
        express.static(path.resolve(__dirname, '..', 'public', 'uploads'))
    )
    .use(express.static(path.join(__dirname, 'public')));

loader(app);

app.use(errorHandler);

module.exports = app;
