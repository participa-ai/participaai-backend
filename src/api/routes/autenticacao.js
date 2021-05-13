const express = require('express');
const autenticacaoController = require('../controllers/autenticacao.js');
const { protect } = require('../middleware/authHandler');

const router = express.Router();

router.get('/eu', protect, autenticacaoController.getEu);
router.post('/cadastro', autenticacaoController.cadastro);
router.post('/login', autenticacaoController.login);
router.get('/logout', protect, autenticacaoController.logout);
router.post('/alterar-senha', protect, autenticacaoController.alterarSenha);
router.post('/esqueci-senha', autenticacaoController.esqueciSenha);

module.exports = router;
