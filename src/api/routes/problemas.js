const express = require('express');
const multer = require('multer');

const multerConfig = require('../../config/multer');
const Problema = require('../../models/Problema');
const problemasController = require('../controllers/problemas');
const findFilter = require('../middleware/findFilter');
const { protect, authorize } = require('../middleware/authHandler');

const router = express.Router({ mergeParams: true });

router.use(protect);

router
    .route('/')
    .get(
        findFilter.filterByQuery(Problema, ['categoria', 'usuario']),
        problemasController.list
    )
    .post(problemasController.insert);

router
    .route('/:id')
    .get(problemasController.get)
    .put(authorize('admin'), problemasController.update)
    .delete(authorize('admin'), problemasController.delete);

router
    .route('/:id/upload-foto')
    .post(multer(multerConfig).single('foto'), problemasController.uploadFoto);

module.exports = router;
