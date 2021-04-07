const morgan = require('morgan');

module.exports = (app) => {
    // Development Logger
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }
};
