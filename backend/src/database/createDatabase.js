const mysql = require('mysql2/promise');
require('dotenv').config();

async function createDatabase() {

    try {

        // Conecta SEM escolher banco
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        // Cria o banco
        await connection.execute(`
            CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}
        `);

        console.log('✅ Banco criado com sucesso!');

        await connection.end();

    } catch (error) {

        console.error('❌ Erro ao criar banco:', error);

    }
}

createDatabase();