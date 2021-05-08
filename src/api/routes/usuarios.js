const express = require('express');
const usuariosController = require('../controllers/usuarios');
const findFilter = require('../middleware/findFilter');
const Usuario = require('../../models/Usuario');
const { protect, authorize } = require('../middleware/authHandler');
const problemasRouter = require('./problemas');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
    .route('/')
    .get(
        findFilter.filterByQuery(Usuario),
        authorize('admin'),
        usuariosController.list
    )
    .post(authorize('admin'), usuariosController.insert);

router
    .route('/:id')
    .get(authorize('admin'), usuariosController.get)
    .put(authorize('admin'), usuariosController.update)
    .delete(authorize('admin'), usuariosController.delete);

router.use('/eu/problemas', problemasRouter);
router.use('/:usuarioId/problemas', problemasRouter);

module.exports = router;
