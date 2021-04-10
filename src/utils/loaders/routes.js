module.exports = (app) => {
    const apiRoot = `${process.env.API_PREFIX}`;

    const index = require('../../api/routes/index');
    app.use(`${apiRoot}/`, index);

    const autenticacao = require('../../api/routes/autenticacao');
    app.use(`${apiRoot}/autenticacao`, autenticacao);

    const categorias = require('../../api/routes/categorias');
    app.use(`${apiRoot}/categorias`, categorias);

    // const problemas = require('../../api/routes/problemas');
    // app.use(`${apiRoot}/problemas`, problemas);

    const usuarios = require('../../api/routes/usuarios');
    app.use(`${apiRoot}/usuarios`, usuarios);

    // const dadosDashboard = require('../../api/routes/dadosDashboard');
    // app.use(`${apiRoot}/dados-dashboard`, dadosDashboard);
};
