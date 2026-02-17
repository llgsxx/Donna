import dotenv from 'dotenv';
import path from 'path';

// Carrega .env da raiz
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
    whatsapp: {
        authDir: 'auth_info_baileys',
        printQR: true,
    },
    ai: {
        groqKey: process.env.GROQ_API_KEY,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        maxTokens: 1024,
        systemPromptPath: path.resolve(__dirname, '../prompts/system.txt'),
    },
    db: {
        user: process.env.POSTGRES_USER || 'user',
        host: process.env.POSTGRES_HOST || 'localhost',
        database: process.env.POSTGRES_DB || 'whatsapp_agent',
        password: process.env.POSTGRES_PASSWORD || 'password',
        port: parseInt(process.env.POSTGRES_PORT || '5433'),
    },
}