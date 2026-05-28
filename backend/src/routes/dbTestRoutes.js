const express = require('express');
const router = express.Router();

const pool = require('../config/database');

router.get('/test-db', async (req, res) => {

    try {

        const [rows] = await pool.execute('SELECT 1');

        res.json({
            mensagem: 'Conexão com banco OK',
            resultado: rows
        });

    } catch (error) {

        res.status(500).json({
            erro: 'Erro ao conectar no banco',
            detalhe: error.message
        });

    }

});

module.exports = router;