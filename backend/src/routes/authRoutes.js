const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/login', (req, res) => {
    authController.login(req, res);
});

router.post('/trocar-senha', authMiddleware, (req, res) => {
    authController.trocarSenha(req, res);
});

module.exports = router;