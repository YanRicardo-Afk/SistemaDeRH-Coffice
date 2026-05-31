const pool = require('../config/database');

class PontoModel {

    async listarPorFuncionario(funcionarioId) {

        const [rows] = await pool.execute(`
            SELECT
                id,
                mes,
                data,
                entrada,
                saida,
                saldo
            FROM pontos
            WHERE funcionario_id = ?
            ORDER BY data DESC
        `, [funcionarioId]);

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