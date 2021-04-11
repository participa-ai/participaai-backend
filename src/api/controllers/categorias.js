const Categoria = require('../../models/Categoria');
const ErrorResponse = require('../../utils/helpers/errorResponse');
const JsonResponse = require('../../utils/helpers/jsonResponse');
const asyncHandler = require('../middleware/asyncHandler');
const StatusCodes = require('http-status-codes');
const { getCategoriaDto } = require('../../utils/helpers/categoriaHelper');

class CategoriaController {
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
        const categoria = await Categoria.findById(request.params.id);
        if (!categoria) {
            return next(
                new ErrorResponse(
                    'Categoria não encontrada',
                    StatusCodes.NOT_FOUND
                )
            );
        }

        response.status(StatusCodes.OK).json(new JsonResponse(categoria));
    });

    insert = asyncHandler(async (request, response, next) => {
        const categoriaDto = getCategoriaDto(request);
        const categoria = await Categoria.create(categoriaDto);

        response.status(StatusCodes.CREATED).json(new JsonResponse(categoria));
    });

    update = asyncHandler(async (request, response, next) => {
        let categoria = await Categoria.findById(request.params.id);
        if (!categoria) {
            return next(
                new ErrorResponse(
                    'Categoria não encontrada',
                    StatusCodes.NOT_FOUND
                )
            );
        }

        const categoriaDto = getCategoriaDto(request);

        categoria = await Categoria.findByIdAndUpdate(
            request.params.id,
            categoriaDto,
            {
                new: true,
                runValidators: true,
            }
        );

        response.status(StatusCodes.OK).json(new JsonResponse(categoria));
    });

    delete = asyncHandler(async (request, response, next) => {
        let categoria = await Categoria.findById(request.params.id);
        if (!categoria) {
            return next(
                new ErrorResponse(
                    'Categoria não encontrada',
                    StatusCodes.NOT_FOUND
                )
            );
        }

        await Categoria.deleteById(request.params.id);

        response.status(StatusCodes.OK).json(new JsonResponse({}));
    });
}

module.exports = new CategoriaController();
