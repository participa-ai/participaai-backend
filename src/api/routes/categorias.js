const express = require('express');
const categoriasController = require('../controllers/categorias');
const findFilter = require('../middleware/findFilter');
const Categoria = require('../../models/Categoria');
const { protect, authorize } = require('../middleware/authHandler');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .get(findFilter.filterByQuery(Categoria), categoriasController.list)
    .post(authorize('admin'), categoriasController.insert);

router
    .route('/:id')
    .get(categoriasController.get)
    .put(authorize('admin'), categoriasController.update)
    .delete(authorize('admin'), categoriasController.delete);

module.exports = router;
