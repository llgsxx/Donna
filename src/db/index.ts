import { Pool } from 'pg';
import { config } from '../config';

const pool = new Pool(config.db);

export const query = (text: string, params?: any[]) => pool.query(text, params);

export const initDb = async () => {
    try {
        // Teste de conexão simples
        const client = await pool.connect();
        console.log(`✅ Banco de dados conectado em ${config.db.host}:${config.db.port}`);
        client.release();
    } catch (err) {
        console.error('❌ Erro fatal ao conectar no banco:', err);
        process.exit(1);
    }
};

export default pool;
