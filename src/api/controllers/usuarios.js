const Usuario = require('../../models/Usuario');
const JsonResponse = require('../../utils/helpers/jsonResponse');
const ErrorResponse = require('../../utils/helpers/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const StatusCodes = require('http-status-codes');

class UsuariosController {
    list = asyncHandler(async (request, response, next) => {
        response
            .status(StatusCodes.OK)
            .json(
                new JsonResponse(
                    response.filterResults.data,
                    response.filterResults.pagination
                )
            );
    });

    get = asyncHandler(async (request, response, next) => {
        const usuario = await Usuario.findById(request.params.id);

        response.status(StatusCodes.OK).json(new JsonResponse(usuario));
    });

    insert = asyncHandler(async (request, response, next) => {
        const usuario = await Usuario.create(request.body);

        response.status(StatusCodes.CREATED).json(new JsonResponse(usuario));
    });

    update = asyncHandler(async (request, response, next) => {
        const usuario = await Usuario.findByIdAndUpdate(
            request.params.id,
            request.body,
            {
                new: true,
                runValidators: true,
            }
        );

        response.status(StatusCodes.OK).json(new JsonResponse(usuario));
    });

    delete = asyncHandler(async (request, response, next) => {
        await Usuario.deleteById(request.params.id);

        response.status(StatusCodes.OK).json(new JsonResponse({}));
    });
}

module.exports = new UsuariosController();
