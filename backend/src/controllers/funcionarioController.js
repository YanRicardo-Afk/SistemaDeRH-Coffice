const bcrypt = require('bcrypt');
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
async criar(req, res) {

    try {

        const {
            matricula,
            nome_completo,
            email,
            cargo,
            data_admissao,
            perfil,
            senha
        } = req.body;

        // validação dos obrigatórios
        if (
            !matricula ||
            !nome_completo ||
            !email ||
            !cargo ||
            !data_admissao ||
            !perfil ||
            !senha
        ) {
            return res.status(400).json({
                erro: 'Preencha todos os campos obrigatórios'
            });
        }

        const existe = await funcionarioModel.buscarPorEmail(email);

        if (existe) {
            return res.status(400).json({
                erro: 'Email já cadastrado'
            });
        }

        const senha_hash = await bcrypt.hash(senha, 10);

        const id = await funcionarioModel.criar({
            ...req.body,
            senha_hash
        });

        res.status(201).json({
            mensagem: 'Funcionário cadastrado com sucesso',
            id
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao cadastrar funcionário'
        });

    }

}
async buscarPorId(req, res) {

    try {

        const { id } = req.params;

        const funcionario =
            await funcionarioModel.buscarPorId(id);

        if (!funcionario) {
            return res.status(404).json({
                erro: 'Funcionário não encontrado'
            });
        }

        res.json(funcionario);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao buscar funcionário'
        });

    }
}   
    async atualizar(req, res) {

    try {

        const { id } = req.params;

        const funcionario =
            await funcionarioModel.buscarPorId(id);

        if (!funcionario) {
            return res.status(404).json({
                erro: 'Funcionário não encontrado'
            });
        }

        await funcionarioModel.atualizar(
            id,
            req.body
        );

        res.json({
            mensagem: 'Funcionário atualizado com sucesso'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao atualizar funcionário'
        });

    }

}
async excluir(req, res) {

    try {

        const { id } = req.params;

        const removidos =
            await funcionarioModel.excluir(id);

        if (!removidos) {
            return res.status(404).json({
                erro: 'Funcionário não encontrado'
            });
        }

        res.json({
            mensagem: 'Funcionário removido com sucesso'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao remover funcionário'
        });

    }

}
}

module.exports = new FuncionarioController();