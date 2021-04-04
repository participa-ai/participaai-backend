const app = require('./src/app');
const setConfig = require('./src/config/config');
const connectDB = require('./src/config/db');

setConfig();
connectDB();

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
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    server.close(() => process.exit(1));
});
