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

module.exports = router;