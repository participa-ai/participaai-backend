const JsonResponse = require('../../utils/helpers/jsonResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { StatusCodes } = require('http-status-codes');
const Problema = require('../../models/Problema');

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
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%d/%m/%Y',
                            date: '$dataCriacao',
                        },
                    },
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
}

module.exports = new DashboardController();
