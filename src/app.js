const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const errorHandler = require('./api/middleware/errorHandler');
const loader = require('./utils/loaders/app');

const app = express()
    .use(express.json())
    .use(cors())
    .use(cookieParser())
    .use(express.static(path.join(__dirname, 'public')));

loader(app);

app.use(errorHandler);

module.exports = app;
