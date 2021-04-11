const express = require('express');
const usuariosController = require('../controllers/usuarios');
const findFilter = require('../middleware/findFilter');
const Usuario = require('../../models/Usuario');
const { protect, authorize } = require('../middleware/authHandler');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router
    .route('/')
    .get(findFilter.filterByQuery(Usuario), usuariosController.list)
    .post(usuariosController.insert);

router
    .route('/:id')
    .get(usuariosController.get)
    .put(usuariosController.update)
    .delete(usuariosController.delete);

router.route('/:id/alterar-senha').post(usuariosController.alterarSenha);

module.exports = router;
