const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {

    res.json({
        mensagem: 'API do Coffice funcionando'
    });

});

module.exports = router;