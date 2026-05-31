const pool = require('../config/database');

class HoleriteModel {

    async criar(holerite) {

        const {
            funcionario_id,
            descricao,
            inss_normal,
            onibus_fretado,
            vale_alimentacao,
            salario,
            total_vencimentos,
            total_descontos,
            total_liquido
        } = holerite;

        const [result] = await pool.execute(`
            INSERT INTO holerites (
                funcionario_id,
                descricao,
                inss_normal,
                onibus_fretado,
                vale_alimentacao,
                salario,
                total_vencimentos,
                total_descontos,
                total_liquido
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            funcionario_id,
            descricao || null,
            inss_normal || 0,
            onibus_fretado || 0,
            vale_alimentacao || 0,
            salario,
            total_vencimentos,
            total_descontos,
            total_liquido
        ]);

        return result.insertId;
    }
    async listarPorFuncionario(funcionarioId) {

    const [rows] = await pool.execute(`
        SELECT *
        FROM holerites
        WHERE funcionario_id = ?
        ORDER BY created_at DESC
    `, [funcionarioId]);

    return rows;
}

}

module.exports = new HoleriteModel();