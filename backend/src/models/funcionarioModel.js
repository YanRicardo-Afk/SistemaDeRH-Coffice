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

    // Gera a próxima matrícula disponível (numérica, com 5 dígitos).
    // Ignora matrículas não-numéricas (ex.: "RH001" do seed) ao calcular o próximo número.
    async gerarProximaMatricula() {

    const [rows] = await pool.execute(`
        SELECT matricula
        FROM funcionarios
        WHERE matricula REGEXP '^[0-9]+$'
        ORDER BY CAST(matricula AS UNSIGNED) DESC
        LIMIT 1
    `);

    const proximoNumero =
        rows.length > 0 ? parseInt(rows[0].matricula, 10) + 1 : 1;

    return String(proximoNumero).padStart(5, '0');
    }

    async criar(funcionario) {

    const {
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

    // A matrícula é sempre gerada pelo servidor, nunca recebida do cliente,
    // garantindo que seja automática e que não se repita.
    // Em caso de corrida entre dois cadastros simultâneos, tenta novamente
    // com o próximo número.
    const MAX_TENTATIVAS = 5;

    for (let tentativa = 0; tentativa < MAX_TENTATIVAS; tentativa++) {

        const matricula = await this.gerarProximaMatricula();

        try {

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

            return { id: result.insertId, matricula };

        } catch (error) {

            const ehMatriculaDuplicada =
                error.code === 'ER_DUP_ENTRY' &&
                error.message.includes('matricula');

            if (ehMatriculaDuplicada && tentativa < MAX_TENTATIVAS - 1) {
                continue;
            }

            throw error;
        }
    }
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
async excluir(id) {

    const [result] = await pool.execute(
        'DELETE FROM funcionarios WHERE id = ?',
        [id]
    );

    return result.affectedRows;
}

    // Usada na troca de senha do primeiro acesso (e futuramente em "esqueci minha senha").
    // Sempre que a senha é alterada por essa via, marca primeiro_login como concluído.
    async atualizarSenha(id, senha_hash) {

    await pool.execute(`
        UPDATE funcionarios
        SET
            senha_hash = ?,
            primeiro_login = FALSE
        WHERE id = ?
    `, [senha_hash, id]);
}
}

module.exports = new FuncionarioModel();