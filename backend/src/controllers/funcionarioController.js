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

// GET /funcionarios/gerar-matricula
// Retorna a próxima matrícula disponível, para exibir como sugestão/preview no formulário.
// A matrícula definitiva é sempre calculada de novo (e de forma segura) no momento do cadastro.
async gerarMatricula(req, res) {

    try {

        const matricula =
            await funcionarioModel.gerarProximaMatricula();

        res.json({ matricula });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao gerar matrícula'
        });

    }

}

// GET /funcionarios/verificar-email?email=...
// Permite ao formulário avisar em tempo real se o e-mail já está em uso.
async verificarEmail(req, res) {

    try {

        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                erro: 'Informe o e-mail'
            });
        }

        const existe = await funcionarioModel.buscarPorEmail(email);

        res.json({ disponivel: !existe });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao verificar e-mail'
        });

    }

}

async criar(req, res) {

    try {

        const {
            nome_completo,
            email,
            cargo,
            data_nascimento,
            data_admissao,
            perfil,
            senha,
            telefone
        } = req.body;


        // ── Validação dos campos obrigatórios ───────────────────────

        if (
            !nome_completo ||
            !email ||
            !cargo ||
            !data_nascimento ||
            !data_admissao ||
            !perfil ||
            !senha ||
            !telefone
        ) {

            return res.status(400).json({
                erro: 'Preencha todos os campos obrigatórios'
            });

        }


        // ── Validação do nome ───────────────────────────────────────

        const nomeValido =
            /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(
                nome_completo.trim()
            );

        if (!nomeValido) {

            return res.status(400).json({
                erro: 'O nome deve conter somente letras e espaços'
            });

        }


        // ── Validação do telefone ───────────────────────────────────

        if (!/^\d{10,11}$/.test(telefone)) {

            return res.status(400).json({
                erro: 'O telefone deve conter somente números e ter 10 ou 11 dígitos'
            });

        }


        // ── Validação da data de nascimento ─────────────────────────

        const nascimento =
            new Date(`${data_nascimento}T00:00:00`);

        const hoje =
            new Date();

        // Verifica se a data realmente é válida.
        if (isNaN(nascimento.getTime())) {

            return res.status(400).json({
                erro: 'Data de nascimento inválida'
            });

        }

        // Não permite data de nascimento no futuro.
        if (nascimento > hoje) {

            return res.status(400).json({
                erro: 'A data de nascimento não pode ser futura'
            });

        }


        // ── Calcula idade ───────────────────────────────────────────

        let idade =
            hoje.getFullYear() -
            nascimento.getFullYear();

        const mesAtual =
            hoje.getMonth();

        const mesNascimento =
            nascimento.getMonth();

        if (
            mesAtual < mesNascimento ||
            (
                mesAtual === mesNascimento &&
                hoje.getDate() < nascimento.getDate()
            )
        ) {

            idade--;

        }


        // ── Idade mínima ────────────────────────────────────────────

        if (idade < 14) {

            return res.status(400).json({
                erro: 'O funcionário deve ter pelo menos 14 anos de idade'
            });

        }


        // ── Validação da senha ──────────────────────────────────────

        if (senha.length < 6) {

            return res.status(400).json({
                erro: 'A senha deve possuir no mínimo 6 caracteres'
            });

        }


        // ── Verificação de e-mail duplicado ─────────────────────────

        const existe =
            await funcionarioModel.buscarPorEmail(email);

        if (existe) {

            return res.status(400).json({
                erro: 'Email já cadastrado'
            });

        }


        // ── Criptografa a senha ─────────────────────────────────────

        const senha_hash =
            await bcrypt.hash(senha, 10);


        // ── Cria o funcionário ──────────────────────────────────────

        const {
            id,
            matricula
        } = await funcionarioModel.criar({

            ...req.body,

            senha_hash

        });


        // ── Resposta de sucesso ─────────────────────────────────────

        res.status(201).json({

            mensagem:
                'Funcionário cadastrado com sucesso',

            id,

            matricula

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            erro:
                'Erro ao cadastrar funcionário'

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