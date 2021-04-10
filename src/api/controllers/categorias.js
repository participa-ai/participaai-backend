const Categoria = require('../../models/Categoria');
const ErrorResponse = require('../../utils/helpers/errorResponse');
const JsonResponse = require('../../utils/helpers/jsonResponse');
const asyncHandler = require('../middleware/asyncHandler');
const StatusCodes = require('http-status-codes');

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

        response.status(StatusCodes.OK).json(new JsonResponse(categoria));
    });

    insert = asyncHandler(async (request, response, next) => {
        const categoria = await Categoria.create(request.body);

        response.status(StatusCodes.CREATED).json(new JsonResponse(categoria));
    });

    update = asyncHandler(async (request, response, next) => {
        const categoria = await Categoria.findByIdAndUpdate(
            request.params.id,
            request.body,
            {
                new: true,
                runValidators: true,
            }
        );

        response.status(StatusCodes.OK).json(new JsonResponse(categoria));
    });

    delete = asyncHandler(async (request, response, next) => {
        await Categoria.findByIdAndDelete(request.params.id);

        response.status(StatusCodes.OK).json(new JsonResponse({}));
    });
}

module.exports = new CategoriaController();
