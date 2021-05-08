const Problema = require('../../models/Problema');
const ErrorResponse = require('../../utils/helpers/errorResponse');
const JsonResponse = require('../../utils/helpers/jsonResponse');
const asyncHandler = require('../middleware/asyncHandler');
const StatusCodes = require('http-status-codes');
const {
    getProblemaDto,
    getProblemaDtoForInsert,
} = require('../../utils/helpers/problemaHelper');

class ProblemaController {
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
        const problema = await Problema.findById(request.params.id);
        if (!problema) {
            return next(
                new ErrorResponse(
                    'Problema não encontrado',
                    StatusCodes.NOT_FOUND
                )
            );
        }

        response.status(StatusCodes.OK).json(new JsonResponse(problema));
    });

    insert = asyncHandler(async (request, response, next) => {
        const problemaDto = getProblemaDtoForInsert(request);
        const problema = await Problema.create(problemaDto);

        // TODO : ENVIAR IMAGEM E GUARDAR A URL

        response.status(StatusCodes.CREATED).json(new JsonResponse(problema));
    });

    update = asyncHandler(async (request, response, next) => {
        let problema = await Problema.findById(request.params.id);
        if (!problema) {
            return next(
                new ErrorResponse(
                    'Problema não encontrada',
                    StatusCodes.NOT_FOUND
                )
            );
        }

        // TODO : Se veio uma imagem, mudar a imagem

        const problemaDto = getProblemaDto(request);

        problema = await Problema.findByIdAndUpdate(
            request.params.id,
            problemaDto,
            {
                new: true,
                runValidators: true,
            }
        );

        response.status(StatusCodes.OK).json(new JsonResponse(problema));
    });

    delete = asyncHandler(async (request, response, next) => {
        let problema = await Problema.findById(request.params.id);
        if (!problema) {
            return next(
                new ErrorResponse(
                    'Problema não encontrada',
                    StatusCodes.NOT_FOUND
                )
            );
        }

        await Problema.deleteById(request.params.id);

        response.status(StatusCodes.OK).json(new JsonResponse({}));
    });
}

module.exports = new ProblemaController();
