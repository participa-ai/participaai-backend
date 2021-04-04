const ErrorResponse = require('../../utils/errorResponse');

const errorHandler = (error, request, response, next) => {
    let handledError = { ...error };

    handledError.message = error.message;

    // Log to console for dev
    console.log(error);

    // Mongoose bad ObjectId
    if (error.name === 'CastError') {
        const message = `Recurso não encontrado`;
        handledError = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (error.code === 11000) {
        const message = 'Valor duplicado encontrado';
        handledError = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const message = Object.values(error.errors).map((val) => val.message);
        handledError = new ErrorResponse(message, 400);
    }

    response.status(handledError.statusCode || 500).json({
        success: false,
        handledError: handledError.message || `Erro Interno`,
    });
};

module.exports = errorHandler;
