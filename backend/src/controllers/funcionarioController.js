const funcionarioModel = require('../models/funcionarioModel');

class FuncionarioController {

    async listar(req, res) {

    try {

        const { nome, cargo } = req.query;

        const funcionarios =
            await funcionarioModel.listar(nome, cargo);

        res.json(funcionarios);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao listar funcionários'
        });

    }

}

}

module.exports = new FuncionarioController();