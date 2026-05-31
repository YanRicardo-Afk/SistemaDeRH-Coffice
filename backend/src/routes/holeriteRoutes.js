const express = require('express');

const router = express.Router();

const holeriteController =
    require('../controllers/holeriteController');

const authMiddleware =
    require('../middlewares/authMiddleware');

const roleMiddleware =
    require('../middlewares/roleMiddleware');

router.post(
    '/',
    authMiddleware,
    roleMiddleware(['rh']),
    holeriteController.criar
);
router.get(
    '/me',
    authMiddleware,
    holeriteController.listarMeus
);
router.get(
    '/funcionario/:id',
    authMiddleware,
    roleMiddleware(['rh']),
    holeriteController.listarPorFuncionario
);
module.exports = router;