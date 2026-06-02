const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
                    perfil: usuario.perfil
                }
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