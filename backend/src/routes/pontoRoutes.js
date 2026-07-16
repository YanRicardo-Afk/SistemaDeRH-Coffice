const express = require('express');

const router = express.Router();

const pontoController =
    require('../controllers/pontoController');

const authMiddleware =
    require('../middlewares/authMiddleware');

const roleMiddleware =
    require('../middlewares/roleMiddleware');

router.get(
    '/funcionario/:id',
    authMiddleware,
    roleMiddleware(['rh']),
    pontoController.listarPorFuncionario
);

router.get(
    '/hoje',
    authMiddleware,
    pontoController.buscarPontoHoje
);

router.post(
    '/entrada',
    authMiddleware,
    pontoController.registrarEntrada
);
router.post(
    '/saida',
    authMiddleware,
    pontoController.registrarSaida
);

module.exports = router;