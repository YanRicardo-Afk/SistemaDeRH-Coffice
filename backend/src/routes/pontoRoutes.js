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
    '/meus',
    authMiddleware,
    pontoController.listarMeusPontos
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

// ── Comprovante em PDF ──────────────────────────────────────────────
// Importante: a rota "/comprovante/:funcionarioId" precisa vir depois
// de "/comprovante", senão o Express tentaria casar "/comprovante" com
// ":funcionarioId" também (mas como os paths são diferentes aqui, a
// ordem abaixo já funciona corretamente).

// Funcionário logado gera o próprio comprovante
router.get(
    '/comprovante',
    authMiddleware,
    pontoController.gerarComprovanteProprio
);

// RH gera o comprovante de um funcionário específico
router.get(
    '/comprovante/:funcionarioId',
    authMiddleware,
    roleMiddleware(['rh']),
    pontoController.gerarComprovanteFuncionario
);

// ── Edição de ponto pelo RH (gera ajuste, não sobrescreve o original) ──
router.put(
    '/:id/ajustar',
    authMiddleware,
    roleMiddleware(['rh']),
    pontoController.ajustarPonto
);

// Histórico de auditoria de um ponto (somente RH)
router.get(
    '/:id/auditoria',
    authMiddleware,
    roleMiddleware(['rh']),
    pontoController.listarAuditoriaPonto
);

module.exports = router;