module.exports = (app) => {
    const index = require('../../api/routes/index');
    app.use(`/api/`, index);

    const autenticacao = require('../../api/routes/autenticacao');
    app.use(`/api/autenticacao`, autenticacao);

    const categorias = require('../../api/routes/categorias');
    app.use(`/api/categorias`, categorias);

    const problemas = require('../../api/routes/problemas');
    app.use(`/api/problemas`, problemas);

    const usuarios = require('../../api/routes/usuarios');
    app.use(`/api/usuarios`, usuarios);

    const dadosDashboard = require('../../api/routes/dashboard');
    app.use(`/api/dados-dashboard`, dadosDashboard);
};
