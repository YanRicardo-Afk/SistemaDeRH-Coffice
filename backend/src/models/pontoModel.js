const pool = require('../config/database');

class PontoModel {

    async listarPorFuncionario(funcionarioId) {

        // Traz os valores "efetivos" de cada ponto: se o RH já tiver feito
        // algum ajuste, usa o valor mais recente do ajuste; caso contrário,
        // usa o valor original registrado pelo funcionário. O registro
        // original em `pontos` nunca é sobrescrito (fica preservado para
        // auditoria) — ver tabela `ponto_ajustes`.
        const [rows] = await pool.execute(`
            SELECT
                p.id,
                p.mes,
                p.data,
                COALESCE(ua.entrada_ajustada, p.entrada) AS entrada,
                COALESCE(ua.saida_ajustada, p.saida) AS saida,
                COALESCE(ua.saldo_ajustado, p.saldo) AS saldo,
                (ua.id IS NOT NULL) AS ajustado
            FROM pontos p
            LEFT JOIN (
                SELECT x.*
                FROM (
                    SELECT
                        pa.*,
                        ROW_NUMBER() OVER (
                            PARTITION BY pa.ponto_id
                            ORDER BY pa.editado_em DESC, pa.id DESC
                        ) AS rn
                    FROM ponto_ajustes pa
                ) x
                WHERE x.rn = 1
            ) ua ON ua.ponto_id = p.id
            WHERE p.funcionario_id = ?
            ORDER BY p.data DESC
        `, [funcionarioId]);

        return rows;
    }

    // Mesma lógica de valores efetivos acima, mas filtrando por período
    // (usado na geração do comprovante em PDF).
    async listarParaComprovante(funcionarioId, dataInicio, dataFim) {

        const [rows] = await pool.execute(`
            SELECT
                p.data,
                COALESCE(ua.entrada_ajustada, p.entrada) AS entrada,
                COALESCE(ua.saida_ajustada, p.saida) AS saida,
                COALESCE(ua.saldo_ajustado, p.saldo) AS saldo,
                (ua.id IS NOT NULL) AS ajustado
            FROM pontos p
            LEFT JOIN (
                SELECT x.*
                FROM (
                    SELECT
                        pa.*,
                        ROW_NUMBER() OVER (
                            PARTITION BY pa.ponto_id
                            ORDER BY pa.editado_em DESC, pa.id DESC
                        ) AS rn
                    FROM ponto_ajustes pa
                ) x
                WHERE x.rn = 1
            ) ua ON ua.ponto_id = p.id
            WHERE p.funcionario_id = ?
              AND p.data BETWEEN ? AND ?
            ORDER BY p.data ASC
        `, [funcionarioId, dataInicio, dataFim]);

        return rows;
    }

    // Busca o registro ORIGINAL (imutável) de um ponto pelo id.
    async buscarPontoPorId(id) {

        const [rows] = await pool.execute(`
            SELECT
                id,
                funcionario_id,
                mes,
                data,
                entrada,
                saida,
                saldo
            FROM pontos
            WHERE id = ?
        `, [id]);

        return rows[0];
    }

    // Busca o valor efetivo atual de um ponto (o ajuste mais recente),
    // ou null se o ponto nunca foi ajustado.
    async buscarUltimoAjuste(pontoId) {

        const [rows] = await pool.execute(`
            SELECT
                entrada_ajustada AS entrada,
                saida_ajustada AS saida,
                saldo_ajustado AS saldo
            FROM ponto_ajustes
            WHERE ponto_id = ?
            ORDER BY editado_em DESC, id DESC
            LIMIT 1
        `, [pontoId]);

        return rows[0] || null;
    }

    // Registra um novo ajuste de ponto feito pelo RH. NUNCA atualiza o
    // registro original — apenas insere uma nova linha de auditoria.
    async criarAjuste(ajuste) {

        const {
            ponto_id,
            funcionario_id,
            editado_por,
            entrada_anterior,
            saida_anterior,
            saldo_anterior,
            entrada_ajustada,
            saida_ajustada,
            saldo_ajustado
        } = ajuste;

        const [result] = await pool.execute(`
            INSERT INTO ponto_ajustes (
                ponto_id,
                funcionario_id,
                editado_por,
                entrada_anterior,
                saida_anterior,
                saldo_anterior,
                entrada_ajustada,
                saida_ajustada,
                saldo_ajustado
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            ponto_id,
            funcionario_id,
            editado_por,
            entrada_anterior,
            saida_anterior,
            saldo_anterior,
            entrada_ajustada,
            saida_ajustada,
            saldo_ajustado
        ]);

        return result.insertId;
    }

    // Lista o histórico completo de ajustes de um ponto específico
    // (usado na tela de auditoria / comprovante de ajuste do RH).
    async listarAuditoria(pontoId) {

        const [rows] = await pool.execute(`
            SELECT
                pa.id,
                pa.entrada_anterior,
                pa.saida_anterior,
                pa.saldo_anterior,
                pa.entrada_ajustada,
                pa.saida_ajustada,
                pa.saldo_ajustado,
                pa.editado_em,
                f.nome_completo AS editado_por_nome,
                f.matricula AS editado_por_matricula
            FROM ponto_ajustes pa
            INNER JOIN funcionarios f ON f.id = pa.editado_por
            WHERE pa.ponto_id = ?
            ORDER BY pa.editado_em DESC
        `, [pontoId]);

        return rows;
    }
    async registrarEntrada(funcionarioId, mes, data, entrada) {

    const [result] = await pool.execute(`
        INSERT INTO pontos (
            funcionario_id,
            mes,
            data,
            entrada
        )
        VALUES (?, ?, ?, ?)
    `, [
        funcionarioId,
        mes,
        data,
        entrada
    ]);

    return result.insertId;
}
    async buscarPontoAberto(funcionarioId, data) {

    const [rows] = await pool.execute(`
        SELECT *
        FROM pontos
        WHERE funcionario_id = ?
        AND data = ?
        AND saida IS NULL
        LIMIT 1
    `, [funcionarioId, data]);

    return rows[0];
}
async buscarPontoHoje(funcionarioId, data) {

    const [rows] = await pool.execute(`
        SELECT
            entrada,
            saida
        FROM pontos
        WHERE funcionario_id = ?
        AND data = ?
        LIMIT 1
    `, [
        funcionarioId,
        data
    ]);

    return rows[0];

}

    async registrarSaida(id, saida, saldo) {

    await pool.execute(`
        UPDATE pontos
        SET
            saida = ?,
            saldo = ?
        WHERE id = ?
    `, [
        saida,
        saldo,
        id
    ]);
}
}

module.exports = new PontoModel();