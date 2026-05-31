const holeriteModel =
    require('../models/holeriteModel');

class HoleriteController {

    async criar(req, res) {

        try {

            const id =
                await holeriteModel.criar(req.body);

            res.status(201).json({
                mensagem: 'Holerite cadastrado com sucesso',
                id
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                erro: 'Erro ao cadastrar holerite'
            });

        }

    }
    async listarMeus(req, res) {

    try {

        const funcionarioId = req.user.id;

        const holerites =
            await holeriteModel.listarPorFuncionario(
                funcionarioId
            );

        res.json(holerites);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao buscar holerites'
        });

    }

}
async listarPorFuncionario(req, res) {

    try {

        const { id } = req.params;

        const holerites =
            await holeriteModel.listarPorFuncionario(id);

        res.json(holerites);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao buscar holerites'
        });

    }

}

}

module.exports = new HoleriteController();