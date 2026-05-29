const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


// ROTA QUE QUALQUER LOGADO PODE ACESSAR
router.get('/perfil', authMiddleware, (req, res) => {

    res.json({
        mensagem: 'Rota protegida',
        usuario: req.user
    });

});


// ROTA SOMENTE RH
router.get('/admin', authMiddleware, roleMiddleware(['rh']), (req, res) => {

    res.json({
        mensagem: 'Área do RH'
    });

});

module.exports = router;