const express = require('express');
const problemasController = require('../controllers/problemas');
const findFilter = require('../middleware/findFilter');
const Problema = require('../../models/Problema');
const { protect, authorize } = require('../middleware/authHandler');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(findFilter.filterByQuery(Problema), problemasController.list)
    .post(problemasController.insert);

router
    .route('/:id')
    .get(problemasController.get)
    .put(authorize('admin'), problemasController.update)
    .delete(authorize('admin'), problemasController.delete);

module.exports = router;
