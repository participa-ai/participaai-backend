class FindFilter {
    filterByQuery = (model, populate) => async (request, response, next) => {
        let requestQuery = { ...request.query };

        const paramsToRemove = ['select', 'sort', 'page', 'limit', 'senha'];
        paramsToRemove.forEach((param) => delete requestQuery[param]);

        requestQuery.deleted = false;

        let queryString = JSON.stringify(requestQuery);
        queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

        // Finding resources
        let query = model.find(JSON.parse(queryString));

        // Selecting
        if (request.query.select) {
            const fields = request.query.select
                .replace(',senha,', '')
                .replace('senha,', '')
                .replace(',senha', '')
                .replace('senha', '')
                .split(',')
                .join(' ');
            query = query.select(fields);
        }

        // Sorting
        if (request.query.sort) {
            const sortBy = request.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(request.query.page, 10) || 1;
        const limit = parseInt(request.query.limit, 10);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await model.countDocuments({ deleted: false });

        if (request.query.limit) {
            query = query.skip(startIndex).limit(limit);
        }

        if (populate) {
            query = query.populate(populate);
        }

        // Query execution
        const results = await query;

        // Pagination result
        let pagination = null;

        if (request.query.limit) {
            pagination = {};

            pagination.current = page;

            if (endIndex < total) {
                pagination.next = page + 1;
            }

            if (startIndex > 0) {
                pagination.previous = page - 1;
            }

            pagination.limit = limit;
            pagination.total = total;
        }

        response.filterResults = {
            data: results,
            pagination,
        };

        next();
    };
}

module.exports = new FindFilter();
