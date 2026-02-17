import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER || 'user',
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DB || 'whatsapp_agent',
    password: process.env.POSTGRES_PASSWORD || 'password',
    port: parseInt(process.env.POSTGRES_PORT || '5433'),
});

async function checkConnection() {
    try {
        console.log(`🔌 Tentando conectar em ${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}...`);
        const client = await pool.connect();
        console.log('✅ Conexão bem-sucedida!');

        const res = await client.query('SELECT NOW() as now, current_database() as db');
        console.log('📊 Resultado do teste:', res.rows[0]);
        console.log(`🗄️  Banco de dados atual: ${res.rows[0].db}`);

        // Verificar se a tabela existe e tem dados
        const tableRes = await client.query("SELECT count(*) FROM messages");
        console.log(`📝 Total de mensagens na tabela 'messages': ${tableRes.rows[0].count}`);

        client.release();
    } catch (err) {
        console.error('❌ Erro ao conectar:', err);
    } finally {
        await pool.end();
    }
}

checkConnection();
