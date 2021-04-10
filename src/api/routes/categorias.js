const express = require('express');
const categoriasController = require('../controllers/categorias');
const findFilter = require('../middleware/findFilter');
const Categoria = require('../../models/Categoria');
const { protect, authorize } = require('../middleware/authHandler');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(findFilter.filterByQuery(Categoria), categoriasController.list)
    .post(categoriasController.insert);

router
    .route('/:id')
    .get(categoriasController.get)
    .put(categoriasController.update)
    .delete(categoriasController.delete);

module.exports = router;
