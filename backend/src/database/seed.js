// esse seed vai servir para o primeiro acesso para que crie essa conta

const bcrypt = require('bcrypt');
const pool = require('../config/database');

async function seedAdmin() {

    try {

        // senha padrão
        const senha = '123456';

        // gera hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        await pool.execute(`
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
                perfil,
                senha_hash
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            'RH001',
            'Administrador RH',
            'Solteiro',
            '2000-01-01',
            'Empresa',
            'rh@coffice.com',
            '(00)00000-0000',
            'RH',
            new Date(),
            'rh',
            senhaHash
        ]);

        console.log('✅ Usuário RH criado com sucesso!');

        process.exit();

    } catch (error) {

        // evita erro se já existir
        if (error.code === 'ER_DUP_ENTRY') {
            console.log('⚠️ Usuário RH já existe');
        } else {
            console.error('❌ Erro ao criar seed:', error);
        }

        process.exit();
    }
}

seedAdmin();