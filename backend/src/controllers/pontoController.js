const pontoModel = require('../models/pontoModel');
const funcionarioModel = require('../models/funcionarioModel');
const { calcularSaldo, paraDataISO } = require('../utils/calculoPonto');
const { gerarComprovantePDF } = require('../services/pdfService');

// ── Funções auxiliares (fora da classe para não depender de "this",
// já que os métodos do controller são passados como referência direta
// para o Express nas rotas) ─────────────────────────────────────────

// Resolve o período do comprovante: usa dataInicio/dataFim se informados
// na query string, senão usa o mês atual como padrão.
function resolverPeriodo(query) {

    const { dataInicio, dataFim } = query;

    if (dataInicio && dataFim) {
        return { dataInicio, dataFim };
    }

    const hoje = new Date();

    const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

    return {
        dataInicio: primeiroDia.toISOString().split('T')[0],
        dataFim: ultimoDia.toISOString().split('T')[0]
    };
}

// Monta o nome do arquivo: comprovante_ponto_{NOME}_{MES_ANO}.pdf
function montarNomeArquivo(nomeCompleto, dataInicio, dataFim) {

    const nomeSanitizado = nomeCompleto
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove acentos
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');

    const [anoInicio, mesInicio] = dataInicio.split('-');
    const [anoFim, mesFim] = dataFim.split('-');

    // Se o período cair todo dentro de um único mês, usa "MM_AAAA".
    // Caso contrário (período personalizado que cruza meses), usa as
    // duas datas do intervalo.
    const periodo = (mesInicio === mesFim && anoInicio === anoFim)
        ? `${mesInicio}_${anoInicio}`
        : `${dataInicio}_a_${dataFim}`;

    return `comprovante_ponto_${nomeSanitizado}_${periodo}.pdf`;
}

// Lógica compartilhada pelos dois endpoints de comprovante
// (o do próprio funcionário e o que o RH gera para um funcionário específico).
async function gerarComprovante(funcionarioId, query, res) {

    try {

        const { dataInicio, dataFim } = resolverPeriodo(query);

        const funcionario = await funcionarioModel.buscarPorId(funcionarioId);

        if (!funcionario) {
            return res.status(404).json({ erro: 'Funcionário não encontrado' });
        }

        const pontos = await pontoModel.listarParaComprovante(
            funcionarioId,
            dataInicio,
            dataFim
        );

        const pdfBuffer = await gerarComprovantePDF({
            funcionario,
            pontos,
            dataInicio,
            dataFim
        });

        const nomeArquivo = montarNomeArquivo(
            funcionario.nome_completo,
            dataInicio,
            dataFim
        );

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${nomeArquivo}"`
        );

        res.send(pdfBuffer);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            erro: 'Erro ao gerar comprovante de ponto'
        });
    }
}

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
    async listarMeusPontos(req, res) {
    try {

        const funcionarioId = req.user.id;

        const pontos = await pontoModel.listarPorFuncionario(funcionarioId);

        res.status(200).json(pontos);

    } catch (erro) {

        console.error("Erro ao listar meus pontos:", erro);

        res.status(500).json({
            erro: "Erro ao buscar pontos."
        });

    }
}

    async buscarPontoHoje(req, res) {

    try {

        const funcionarioId = req.user.id;

        const agora = new Date();

        const data = agora.toISOString().split("T")[0];

        const ponto =
            await pontoModel.buscarPontoHoje(
                funcionarioId,
                data
            );

        if (!ponto) {

            return res.json({
                entrada: null,
                saida: null
            });

        }

        res.json(ponto);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({
            erro: "Erro ao buscar ponto de hoje"
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

        const saldo = calcularSaldo(ponto.entrada, saida, data);

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

    // PUT /pontos/:id/ajustar  (somente RH)
    //
    // Cria um novo registro de AJUSTE para o ponto (não altera o original).
    // Regras da Portaria 671/2021 aplicadas aqui:
    //  - o registro feito pelo funcionário (tabela `pontos`) nunca é tocado;
    //  - cada edição vira uma nova linha em `ponto_ajustes`, guardando valor
    //    antigo, valor novo, quem editou e quando (auditoria);
    //  - a jornada de 8h é mantida no cálculo do novo saldo.
    async ajustarPonto(req, res) {

        try {

            const { id } = req.params;
            const { entrada, saida } = req.body;

            if (!entrada && !saida) {
                return res.status(400).json({
                    erro: 'Informe ao menos um horário (entrada ou saída) para ajustar'
                });
            }

            const ponto = await pontoModel.buscarPontoPorId(id);

            if (!ponto) {
                return res.status(404).json({
                    erro: 'Registro de ponto não encontrado'
                });
            }

            // Busca o valor efetivo ATUAL (considerando ajustes anteriores,
            // se houver) para preservar corretamente a cadeia de auditoria.
            const efetivoAtual = await pontoModel.buscarUltimoAjuste(ponto.id);

            const entradaAnterior = efetivoAtual ? efetivoAtual.entrada : ponto.entrada;
            const saidaAnterior = efetivoAtual ? efetivoAtual.saida : ponto.saida;
            const saldoAnterior = efetivoAtual ? efetivoAtual.saldo : ponto.saldo;

            const novaEntrada = entrada || entradaAnterior;
            const novaSaida = saida || saidaAnterior;

            const dataIso = paraDataISO(ponto.data);

            const novoSaldo = calcularSaldo(novaEntrada, novaSaida, dataIso);

            const ajusteId = await pontoModel.criarAjuste({
                ponto_id: ponto.id,
                funcionario_id: ponto.funcionario_id,
                editado_por: req.user.id,
                entrada_anterior: entradaAnterior,
                saida_anterior: saidaAnterior,
                saldo_anterior: saldoAnterior,
                entrada_ajustada: novaEntrada,
                saida_ajustada: novaSaida,
                saldo_ajustado: novoSaldo
            });

            const rh = await funcionarioModel.buscarPorId(req.user.id);

            // Comprovante digital do ajuste, devolvido na hora para o RH conferir.
            // Observação: o sistema ainda não tem campo de CPF cadastrado para
            // os funcionários, então usamos nome + matrícula como identificação
            // de quem alterou. Se o CPF for cadastrado futuramente, ele deve
            // ser incluído aqui para atender integralmente à Portaria 671/2021.
            res.status(201).json({
                mensagem: 'Ponto ajustado com sucesso',
                comprovanteAjuste: {
                    id: ajusteId,
                    registroOriginalId: ponto.id,
                    funcionarioId: ponto.funcionario_id,
                    data: ponto.data,
                    alteradoPor: {
                        nome: rh.nome_completo,
                        matricula: rh.matricula
                    },
                    dataHoraAjuste: new Date(),
                    valoresAnteriores: {
                        entrada: entradaAnterior,
                        saida: saidaAnterior,
                        saldo: saldoAnterior
                    },
                    valoresNovos: {
                        entrada: novaEntrada,
                        saida: novaSaida,
                        saldo: novoSaldo
                    }
                }
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                erro: 'Erro ao ajustar ponto'
            });
        }
    }

    // GET /pontos/:id/auditoria  (somente RH)
    // Retorna o registro original + todo o histórico de ajustes de um ponto.
    async listarAuditoriaPonto(req, res) {

        try {

            const { id } = req.params;

            const ponto = await pontoModel.buscarPontoPorId(id);

            if (!ponto) {
                return res.status(404).json({
                    erro: 'Registro de ponto não encontrado'
                });
            }

            const ajustes = await pontoModel.listarAuditoria(id);

            res.json({
                registroOriginal: {
                    data: ponto.data,
                    entrada: ponto.entrada,
                    saida: ponto.saida,
                    saldo: ponto.saldo
                },
                ajustes
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                erro: 'Erro ao buscar auditoria do ponto'
            });
        }
    }

    // GET /pontos/comprovante  (funcionário autenticado, para si mesmo)
    // Query params opcionais: ?dataInicio=YYYY-MM-DD&dataFim=YYYY-MM-DD
    // (padrão: mês atual)
    async gerarComprovanteProprio(req, res) {
        await gerarComprovante(req.user.id, req.query, res);
    }

    // GET /pontos/comprovante/:funcionarioId  (somente RH)
    async gerarComprovanteFuncionario(req, res) {
        const { funcionarioId } = req.params;
        await gerarComprovante(funcionarioId, req.query, res);
    }

}

module.exports = new PontoController();