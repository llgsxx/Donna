import { query } from './db';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
    console.log('🔄 Verificando migrações de banco de dados...');

    const migrationFile = path.resolve(__dirname, 'db/migrations/002_create_conversations.sql');
    if (fs.existsSync(migrationFile)) {
        const sql = fs.readFileSync(migrationFile, 'utf-8');
        try {
            await query(sql);
            console.log('✅ Migração 002 (Conversations) aplicada com sucesso.');
        } catch (error) {
            console.error('⚠️ Erro ao aplicar migração 002:', error);
        }
    }
}

// Executar migração antes de iniciar
runMigrations().then(() => {
    // Código principal aqui, ou apenas deixar o script rodar e sair, 
    // já que o nodemon vai reiniciar o index.ts quando ele for salvo.
});
