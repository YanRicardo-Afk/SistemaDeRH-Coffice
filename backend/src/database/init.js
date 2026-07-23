const pool = require('../config/database');

async function createTables() {

    try {

        // TABELA FUNCIONARIOS
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS funcionarios (
                id INT AUTO_INCREMENT PRIMARY KEY,
                matricula VARCHAR(20) UNIQUE NOT NULL,
                nome_completo VARCHAR(255) NOT NULL,
                status_civil VARCHAR(50),
                data_nascimento DATE,
                endereco TEXT,
                email VARCHAR(255) UNIQUE NOT NULL,
                telefone VARCHAR(20),
                cargo VARCHAR(100),
                data_admissao DATE,
                data_ferias DATE,
                perfil ENUM('rh', 'funcionario') NOT NULL,
                senha_hash TEXT NOT NULL,
                primeiro_login BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Garante a coluna primeiro_login em bancos criados antes dessa atualização.
        // (ignora o erro caso a coluna já exista)
        try {

            await pool.execute(`
                ALTER TABLE funcionarios
                ADD COLUMN primeiro_login BOOLEAN NOT NULL DEFAULT TRUE
            `);

        } catch (error) {

            if (error.code !== 'ER_DUP_FIELDNAME') {
                throw error;
            }
        }

        // TABELA HOLERITES
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS holerites (
                id INT AUTO_INCREMENT PRIMARY KEY,
                funcionario_id INT NOT NULL,
                descricao TEXT,
                inss_normal DECIMAL(10,2),
                onibus_fretado DECIMAL(10,2),
                vale_alimentacao DECIMAL(10,2),
                salario DECIMAL(10,2),
                total_vencimentos DECIMAL(10,2),
                total_descontos DECIMAL(10,2),
                total_liquido DECIMAL(10,2),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (funcionario_id)
                REFERENCES funcionarios(id)
                ON DELETE CASCADE
            )
        `);

        // TABELA PONTOS
        await pool.execute(`
            CREATE TABLE IF NOT EXISTS pontos (
                id INT AUTO_INCREMENT PRIMARY KEY,
                funcionario_id INT NOT NULL,
                mes VARCHAR(20),
                data DATE,
                entrada TIME,
                saida TIME,
                saldo VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                FOREIGN KEY (funcionario_id)
                REFERENCES funcionarios(id)
                ON DELETE CASCADE
            )
        `);

        console.log('✅ Tabelas criadas com sucesso!');

        process.exit();

    } catch (error) {

        console.error('❌ Erro ao criar tabelas:', error);

        process.exit(1);
    }
}

createTables();