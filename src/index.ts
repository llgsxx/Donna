import { initDb } from './db';
import { connectToWhatsApp } from './services/whatsapp';

async function main() {
    console.log('Starting WhatsApp AI Agent...');

    await initDb();

    await connectToWhatsApp();
}

main().catch(err => console.error(err));
