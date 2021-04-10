const JsonResponse = require('../../utils/helpers/jsonResponse');

const router = require('express').Router();

router.get('/_status', async (request, response, next) => {
    response
        .status(200)
        .json(new JsonResponse({ message: 'Tudo ok por aqui!' }));
});

module.exports = router;
