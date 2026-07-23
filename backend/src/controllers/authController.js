const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const funcionarioModel = require('../models/funcionarioModel');

class AuthController {

    async login(req, res) {

        try {

            const { email, senha } = req.body;

            // busca usuário no banco
            const [rows] = await pool.execute(
                'SELECT * FROM funcionarios WHERE email = ?',
                [email]
            );

            if (rows.length === 0) {
                return res.status(401).json({
                    erro: 'Usuário não encontrado'
                });
            }

            const usuario = rows[0];

            // compara senha
            const senhaValida = await bcrypt.compare(
                senha,
                usuario.senha_hash
            );

            if (!senhaValida) {
                return res.status(401).json({
                    erro: 'Senha inválida'
                });
            }

            // gera token
            const token = jwt.sign(
                {
                    id: usuario.id,
                    perfil: usuario.perfil
                },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            return res.json({
                mensagem: 'Login realizado com sucesso',
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome_completo,
                    email: usuario.email,
                    perfil: usuario.perfil,
                    primeiro_login: !!usuario.primeiro_login
                }
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                erro: 'Erro interno'
            });

        }
    }

    // Troca de senha do primeiro acesso (também serve para trocar a senha em qualquer momento).
    // Exige token válido (authMiddleware) e marca primeiro_login como concluído.
    async trocarSenha(req, res) {

        try {

            const { novaSenha, confirmarSenha } = req.body;

            const usuarioId = req.user.id;

            if (!novaSenha || !confirmarSenha) {
                return res.status(400).json({
                    erro: 'Informe a nova senha e a confirmação'
                });
            }

            if (novaSenha.length < 6) {
                return res.status(400).json({
                    erro: 'A senha deve possuir no mínimo 6 caracteres'
                });
            }

            if (novaSenha !== confirmarSenha) {
                return res.status(400).json({
                    erro: 'As senhas não coincidem'
                });
            }

            const senha_hash = await bcrypt.hash(novaSenha, 10);

            await funcionarioModel.atualizarSenha(usuarioId, senha_hash);

            return res.json({
                mensagem: 'Senha alterada com sucesso'
            });

        } catch (error) {

            console.error(error);

            return res.status(500).json({
                erro: 'Erro interno'
            });

        }
    }
}

module.exports = new AuthController();