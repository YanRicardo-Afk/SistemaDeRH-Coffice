class AuthController {

    login(req, res) {

        const { email, senha } = req.body;

        return res.json({
            mensagem: 'Login recebido',
            email,
            senha
        });

    }

}

module.exports = new AuthController();