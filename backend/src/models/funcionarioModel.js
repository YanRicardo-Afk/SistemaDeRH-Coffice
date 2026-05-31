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
    async buscarPorEmail(email) {

    const [rows] = await pool.execute(
        'SELECT id FROM funcionarios WHERE email = ?',
        [email]
    );

    return rows[0];
    }
    async criar(funcionario) {

    const {
        matricula,
        nome_completo,
        status_civil = null,
        data_nascimento = null,
        endereco = null,
        email,
        telefone = null,
        cargo,
        data_admissao,
        data_ferias = null,
        perfil,
        senha_hash
    } = funcionario;

    const [result] = await pool.execute(`
        INSERT INTO funcionarios (
            matricula,
            nome_completo,
            status_civil,
            data_nascimento,
            endereco,
            email,
            telefone,
            cargo,
            data_admissao,
            data_ferias,
            perfil,
            senha_hash
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        matricula,
        nome_completo,
        status_civil,
        data_nascimento,
        endereco,
        email,
        telefone,
        cargo,
        data_admissao,
        data_ferias,
        perfil,
        senha_hash
    ]);

    return result.insertId;
}
    async buscarPorId(id) {

    const [rows] = await pool.execute(`
        SELECT
            id,
            matricula,
            nome_completo,
            status_civil,
            data_nascimento,
            endereco,
            email,
            telefone,
            cargo,
            data_admissao,
            data_ferias,
            perfil
        FROM funcionarios
        WHERE id = ?
    `, [id]);

    return rows[0];
}
    async atualizar(id, funcionario) {

    const {
        matricula,
        nome_completo,
        status_civil,
        data_nascimento,
        endereco,
        email,
        telefone,
        cargo,
        data_admissao,
        data_ferias,
        perfil
    } = funcionario;

    await pool.execute(`
        UPDATE funcionarios
        SET
            matricula = ?,
            nome_completo = ?,
            status_civil = ?,
            data_nascimento = ?,
            endereco = ?,
            email = ?,
            telefone = ?,
            cargo = ?,
            data_admissao = ?,
            data_ferias = ?,
            perfil = ?
        WHERE id = ?
    `, [
        matricula,
        nome_completo,
        status_civil || null,
        data_nascimento || null,
        endereco || null,
        email,
        telefone || null,
        cargo,
        data_admissao,
        data_ferias || null,
        perfil,
        id
    ]);
}
}

module.exports = new FuncionarioModel();