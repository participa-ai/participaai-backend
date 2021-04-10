const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../../utils/helpers/errorResponse');
const StatusCodes = require('http-status-codes');
const Usuario = require('../../models/Usuario');

exports.protect = asyncHandler(async (request, response, next) => {
    let token;

    if (
        request.headers.authorization &&
        request.headers.authorization.startsWith('Bearer')
    ) {
        token = request.headers.authorization.split(' ')[1];
    } else if (request.cookies.token) {
        token = request.cookies.token;
    }

    if (!token) {
        return next(
            new ErrorResponse(
                'Não autorizado a acessar esse recurso',
                StatusCodes.UNAUTHORIZED
            )
        );
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        request.usuario = await Usuario.findById(decoded.id);

        next();
    } catch (error) {
        return next(
            new ErrorResponse(
                'Não autorizado a acessar esse recurso',
                StatusCodes.UNAUTHORIZED
            )
        );
    }
});

exports.authorize = (...tipos) => {
    return (request, response, next) => {
        if (!tipos.includes(request.usuario.tipo)) {
            return next(
                new ErrorResponse(
                    `Usuario do tipo ${request.usuario.role} não autorizado a acessar esse recurso`,
                    StatusCodes.FORBIDDEN
                )
            );
        }
        next();
    };
};
