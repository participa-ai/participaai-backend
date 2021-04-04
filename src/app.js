const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const colors = require('colors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./api/middleware/errorHandler');

// /////////////////////////////////////////////////////
// TODO : Create loader to handle app uses and routers
// /////////////////////////////////////////////////////
const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Development Logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.get('/_status', async (request, response, next) => {
    response.status(200).send('Tudo ok por aqui!');
});

app.get('/_docs', async (request, response, next) => {
    response.status(200).send('Nada aqui ainda.');
});

// Routes
const apiRoot = `${process.env.API_PREFIX}`;

const autenticacao = require('./api/routes/autenticacao');
app.use(`${apiRoot}/autenticacao`, autenticacao);

// const categorias = require('./api/routes/categorias');
// app.use(`${apiRoot}/categorias`, categorias);

// const problemas = require('./api/routes/problemas');
// app.use(`${apiRoot}/problemas`, problemas);

// const usuarios = require('./api/routes/usuarios');
// app.use(`${apiRoot}/usuarios`, usuarios);

// const dadosDashboard = require('./api/routes/dadosDashboard');
// app.use(`${apiRoot}/dados-dashboard`, dadosDashboard);

// Basic Default Error Handler
app.use(errorHandler);

module.exports = app;
