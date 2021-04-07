const router = require('express').Router();

router.get('/_status', async (request, response, next) => {
    response.status(200).send('Tudo ok por aqui!');
});

router.get('/_docs', async (request, response, next) => {
    response.status(200).send('Nada aqui ainda.');
});

module.exports = router;
