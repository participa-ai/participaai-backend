const StatusCodes = require('http-status-codes');
const parse = require('date-fns/parse');
const endOfDay = require('date-fns/endOfDay');
const startOfDay = require('date-fns/startOfDay');

const Problema = require('../../models/Problema');
const ErrorResponse = require('../../utils/helpers/errorResponse');
const JsonResponse = require('../../utils/helpers/jsonResponse');
const asyncHandler = require('../middleware/asyncHandler');
const {
    getProblemaDto,
    getProblemaDtoForInsert,
} = require('../../utils/helpers/problemaHelper');

class ProblemaController {
    list = asyncHandler(async (request, response, next) => {
        let usuarioId;

        if (request.params.usuarioId) usuarioId = request.params.usuarioId;
        else if (request.baseUrl.includes('usuarios/eu'))
            usuarioId = request.usuario.id;

        if (usuarioId) {
            let query = Problema.find({
                usuario: usuarioId,
            });

            query = query.populate('categoria');
            query = query.populate('usuario');

            const problemas = await query;

            return response
                .status(StatusCodes.OK)
                .json(new JsonResponse(problemas));
        } else {
            return response
                .status(StatusCodes.OK)
                .json(
                    new JsonResponse(
                        response.filterResults.data,
                        response.filterResults.pagination
                    )
                );
        }
    });

    get = asyncHandler(async (request, response, next) => {
        let query = Problema.findById(request.params.id);
        query = query.populate('categoria');
        query = query.populate('usuario');

        const problema = await query;
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
        let problemaDto = getProblemaDtoForInsert(request);

        const problema = await Problema.create(problemaDto);

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

    filtrar = asyncHandler(async (request, response, next) => {
        const filter = request.body;

        if (filter.dataCriacao) {
            try {
                let dataFiltro = parse(
                    filter.dataCriacao,
                    'dd-MM-yyyy',
                    new Date(1, 1, 1)
                );
                filter.dataCriacao = {
                    $gte: startOfDay(dataFiltro),
                    $lte: endOfDay(dataFiltro),
                };
            } catch (error) {
                delete filter.dataCriacao;
            }
        }

        let query = Problema.find({
            ...filter,
        });

        const problemas = await query;

        return response
            .status(StatusCodes.OK)
            .json(new JsonResponse(problemas));
    });

    uploadFoto = asyncHandler(async (request, response, next) => {
        let problema = await Problema.findById(request.params.id);
        if (!problema) {
            return next(
                new ErrorResponse(
                    'Problema não encontrada',
                    StatusCodes.NOT_FOUND
                )
            );
        }

        let problemaDto = {};

        if (request.file) {
            const { nome, uri } = this.getFileInfo(request.file);

            problemaDto.foto = {
                nome,
                uri,
            };
        }

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

    getFileInfo = (file) => {
        const storageType = process.env.FILE_STORAGE_TYPE ?? 'local';
        let fileInfo = { nome: '', uri: '' };

        if (storageType === 'local') {
            fileInfo.nome = file.filename;
            fileInfo.uri = file.destination;
        }

        if (storageType === 's3') {
            fileInfo.nome = file.originalname;
            fileInfo.uri = file.location;
        }

        return fileInfo;
    };
}

module.exports = new ProblemaController();
