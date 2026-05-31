const express = require('express');

const router = express.Router();

const funcionarioController =
    require('../controllers/funcionarioController');

const authMiddleware =
    require('../middlewares/authMiddleware');

const roleMiddleware =
    require('../middlewares/roleMiddleware');

router.get(
    '/',
    authMiddleware,
    roleMiddleware(['rh']),
    funcionarioController.listar
);

router.get(
    '/:id',
    authMiddleware,
    roleMiddleware(['rh']),
    funcionarioController.buscarPorId
);

router.post(
    '/',
    authMiddleware,
    roleMiddleware(['rh']),
    funcionarioController.criar
);

router.put(
    '/:id',
    authMiddleware,
    roleMiddleware(['rh']),
    funcionarioController.atualizar
);
router.delete(
    '/:id',
    authMiddleware,
    roleMiddleware(['rh']),
    funcionarioController.excluir
);

module.exports = router;