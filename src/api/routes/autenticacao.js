const express = require('express');
const autenticacaoController = require('../controllers/autenticacao.js');
const { protect } = require('../middleware/authHandler');

const router = express.Router();

router.get('/eu', protect, autenticacaoController.getEu);
router.post('/cadastro', autenticacaoController.cadastro);
router.post('/login', autenticacaoController.login);
router.get('/logout', autenticacaoController.logout);

module.exports = router;
