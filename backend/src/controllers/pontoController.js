const pontoModel = require('../models/pontoModel');

class PontoController {

    async listarPorFuncionario(req, res) {

        try {

            const { id } = req.params;

            const pontos =
                await pontoModel.listarPorFuncionario(id);

            res.json(pontos);

        } catch (error) {

            console.error(error);

            res.status(500).json({
                erro: 'Erro ao buscar pontos'
            });

        }

    }
    async registrarEntrada(req, res) {

    try {

        const funcionarioId = req.user.id;

        const agora = new Date();

        const data = agora.toISOString().split('T')[0];

        const entrada = agora.toTimeString().split(' ')[0];

        const pontoAberto =
        await pontoModel.buscarPontoAberto(
        funcionarioId,
        data
    );

    if (pontoAberto) {
     return res.status(400).json({
        erro: 'Você já registrou entrada hoje'
    });
}

        const meses = [
            'Janeiro',
            'Fevereiro',
            'Março',
            'Abril',
            'Maio',
            'Junho',
            'Julho',
            'Agosto',
            'Setembro',
            'Outubro',
            'Novembro',
            'Dezembro'
        ];

        const mes = meses[agora.getMonth()];

        const id = await pontoModel.registrarEntrada(
            funcionarioId,
            mes,
            data,
            entrada
        );

        res.status(201).json({
            mensagem: 'Entrada registrada com sucesso',
            id
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao registrar entrada'
        });

    }

}
    async registrarSaida(req, res) {

    try {

        const funcionarioId = req.user.id;

        const agora = new Date();

        const data = agora.toISOString().split('T')[0];

        const saida = agora.toTimeString().split(' ')[0]; 

        
        const ponto =
            await pontoModel.buscarPontoAberto(
                funcionarioId,
                data
            );

        if (!ponto) {
            return res.status(400).json({
                erro: 'Nenhuma entrada encontrada para hoje'
            });
        }

        const entradaDate = new Date(
            `${data}T${ponto.entrada}`
        );

        const saidaDate = new Date(
            `${data}T${saida}`
        );

        const horasTrabalhadas =
            (saidaDate - entradaDate) / 1000 / 60 / 60;

        const saldoHoras = horasTrabalhadas - 8;

        const sinal = saldoHoras >= 0 ? '+' : '-';

        const horas = Math.floor(
            Math.abs(saldoHoras)
        );

        const minutos = Math.round(
            (Math.abs(saldoHoras) - horas) * 60
        );

        const saldo =
            `${sinal}${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;

        await pontoModel.registrarSaida(
            ponto.id,
            saida,
            saldo
        );

        res.json({
            mensagem: 'Saída registrada com sucesso',
            saldo
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao registrar saída'
        });

    }

}

}

module.exports = new PontoController();