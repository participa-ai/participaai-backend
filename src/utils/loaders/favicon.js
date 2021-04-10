const favicon = require('express-favicon');

module.exports = (app) => {
    app.use(favicon('favicon.png'));
};
