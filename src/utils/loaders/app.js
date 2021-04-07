const logger = require('./logger');
const routes = require('./routes');

module.exports = (app) => {
    logger(app);
    routes(app);
};
