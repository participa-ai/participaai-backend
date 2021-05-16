const Usuario = require('../../models/Usuario');
const JsonResponse = require('../../utils/helpers/jsonResponse');
const ErrorResponse = require('../../utils/helpers/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { StatusCodes } = require('http-status-codes');
const {
    getUsuarioDto,
    validateInsert,
    validateUpdate,
} = require('../../utils/helpers/userHelper');

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
        if (!usuario) {
            return next(
                new ErrorResponse(
                    'Usuário não encontrado',
                    StatusCodes.NOT_FOUND
                )
            );
        }

        response.status(StatusCodes.OK).json(new JsonResponse(usuario));
    });

    insert = asyncHandler(async (request, response, next) => {
        let usuarioDto = getUsuarioDto(request);
        const validationError = validateInsert(usuarioDto);

        if (validationError) {
            return next(
                new ErrorResponse(validationError, StatusCodes.BAD_REQUEST)
            );
        }

        const usuario = await Usuario.create(usuarioDto);

        response.status(StatusCodes.CREATED).json(new JsonResponse(usuario));
    });

    update = asyncHandler(async (request, response, next) => {
        let usuario = await Usuario.findById(request.params.id);
        if (!usuario) {
            return next(
                new ErrorResponse(
                    'Usuário não encontrado',
                    StatusCodes.NOT_FOUND
                )
            );
        }

        let usuarioDto = getUsuarioDto(request);

        const validationError = validateUpdate(usuarioDto, usuario);
        if (validationError) {
            return next(
                new ErrorResponse(validationError, StatusCodes.BAD_REQUEST)
            );
        }

        usuario = await Usuario.findByIdAndUpdate(
            request.params.id,
            usuarioDto,
            {
                new: true,
                runValidators: true,
            }
        );

        response.status(StatusCodes.OK).json(new JsonResponse(usuario));
    });

    delete = asyncHandler(async (request, response, next) => {
        let usuario = await Usuario.findById(request.params.id);
        if (!usuario) {
            return next(
                new ErrorResponse(
                    'Usuário não encontrado',
                    StatusCodes.NOT_FOUND
                )
            );
        }

        await Usuario.deleteById(request.params.id);

        response.status(StatusCodes.OK).json(new JsonResponse({}));
    });
}

module.exports = new UsuariosController();
