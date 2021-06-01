const JsonResponse = require('../../utils/helpers/jsonResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { StatusCodes } = require('http-status-codes');
const Problema = require('../../models/Problema');
var parse = require('date-fns/parse');

class DashboardController {
    get = asyncHandler(async (request, response, next) => {
        const dashboardData = {
            totalDeProblemas: await this.getCountProblems(),
            problemasRespondidos: await this.getCountSolvedProblems(),
            problemasPorCategoria: await this.getCountProblemsByCategory(),
            problemasPorDia: await this.getCountProblemsByDate(),
        };

        response.status(StatusCodes.OK).json(new JsonResponse(dashboardData));
    });

    getCountProblems = async () => {
        const count = await Problema.countDocuments();
        return count;
    };

    getCountSolvedProblems = async () => {
        const count = await Problema.countDocuments({ status: 'finalizado' });
        return count;
    };

    getCountProblemsByCategory = async () => {
        const aggregate = [
            {
                $lookup: {
                    from: 'categorias',
                    localField: 'categoria',
                    foreignField: '_id',
                    as: 'categoria',
                },
            },
            { $unwind: '$categoria' },
            {
                $group: {
                    _id: '$categoria.nome',
                    quantidade: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ];

        const count = await Problema.aggregate(aggregate);
        return count;
    };

    getCountProblemsByDate = async () => {
        const aggregate = [
            {
                $match: {
                    dataCriacao: {
                        $gt: new Date(
                            new Date().getTime() - 30 * 24 * 60 * 60 * 1000
                        ),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%d/%m/%Y',
                            date: '$dataCriacao',
                            timezone: process.env.TZ || 'America/Sao_Paulo',
                        },
                    },
                    quantidade: { $sum: 1 },
                },
            },
            {
                $addFields: {
                    date: {
                        $dateFromString: {
                            dateString: '$_id',
                            format: '%d/%m/%Y',
                            timezone: process.env.TZ || 'America/Sao_Paulo',
                        },
                    },
                },
            },
            {
                $sort: { date: 1 },
            },
        ];

        const count = await Problema.aggregate(aggregate);
        return count;
    };
}

module.exports = new DashboardController();
