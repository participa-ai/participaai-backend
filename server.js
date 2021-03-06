const colors = require('colors');

const setConfig = require('./src/config/config');
setConfig();

const connectDB = require('./src/config/db');
connectDB();

const app = require('./src/app');
const PORT = process.env.PORT || 5000;
const server = app.listen(
    PORT,
    console.log(
        `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
            .bold
    )
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Fatal Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
    throw err;
});
