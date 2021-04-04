const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');

// TODO : Create loader to handle app uses and routers
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Development Logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.get('/', async (request, response, next) => {
    response.send('hello world!');
});

module.exports = app;
