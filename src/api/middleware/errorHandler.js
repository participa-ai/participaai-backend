const ErrorResponse = require('../../utils/errorResponse');
const StatusCodes = require('http-status-codes');

const errorHandler = (error, request, response, next) => {
    let handledError = { ...error };

    handledError.message = error.message;

    // Log to console for dev
    console.log(error);

    // Mongoose bad ObjectId
    if (error.name === 'CastError') {
        const message = `Recurso não encontrado`;
        handledError = new ErrorResponse(message, StatusCodes.NOT_FOUND);
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
        const message = 'Valor duplicado encontrado';
        handledError = new ErrorResponse(message, StatusCodes.BAD_REQUEST);
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const message = Object.values(error.errors).map((val) => val.message);
        handledError = new ErrorResponse(message, StatusCodes.BAD_REQUEST);
    }

    response
        .status(handledError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
        .json({
            success: false,
            handledError: handledError.message || `Erro Interno`,
        });
};

module.exports = errorHandler;
