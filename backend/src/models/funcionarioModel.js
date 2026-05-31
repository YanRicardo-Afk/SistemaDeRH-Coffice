const pool = require('../config/database');

class FuncionarioModel {

    async listar(nome, cargo) {

        let sql = `
            SELECT
                id,
                matricula,
                nome_completo,
                cargo,
                data_ferias
            FROM funcionarios
            WHERE 1=1
        `;

        const params = [];

        if (nome) {
            sql += ' AND nome_completo LIKE ?';
            params.push(`%${nome}%`);
        }

        if (cargo) {
            sql += ' AND cargo = ?';
            params.push(cargo);
        }

        sql += ' ORDER BY nome_completo';

        const [rows] = await pool.execute(sql, params);

        return rows;
    }

}

module.exports = new FuncionarioModel();