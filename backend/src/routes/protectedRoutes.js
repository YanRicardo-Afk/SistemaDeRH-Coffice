const express = require('express');

const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');


// ROTA QUE QUALQUER LOGADO PODE ACESSAR
const pool = require('../config/database');

router.get('/perfil', authMiddleware, async (req, res) => {

    try {

        const [rows] = await pool.execute(
            'SELECT id, nome_completo, perfil, email FROM funcionarios WHERE id = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                erro: 'Usuário não encontrado'
            });
        }

        res.json(rows[0]);

    } catch (error) {

        return res.status(500).json({
            erro: 'Erro interno'
        });

    }

});


// ROTA SOMENTE RH
router.get('/admin', authMiddleware, roleMiddleware(['rh']), (req, res) => {

    res.json({
        mensagem: 'Área do RH'
    });

});

module.exports = router;