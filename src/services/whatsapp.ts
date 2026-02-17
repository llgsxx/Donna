import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import qrcode from 'qrcode-terminal';
import * as aiService from './ai';
import * as messageRepo from './messageRepository';

import { config } from '../config';

export async function connectToWhatsApp() {
    console.log(`🚀 Iniciando WhatsApp (Baileys)...`);
    const { state, saveCreds } = await useMultiFileAuthState(config.whatsapp.authDir);

    const sock = makeWASocket({
        printQRInTerminal: config.whatsapp.printQR,
        auth: state,
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed due to ', lastDisconnect?.error, ', reconnecting ', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('Opened connection');
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type === 'notify') {
            for (const msg of messages) {
                if (!msg.message) continue;

                const jid = msg.key.remoteJid!;
                const userMessage = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
                const isFromMe = msg.key.fromMe;

                if (!userMessage) continue;

                console.log(`📨 Mensagem de ${isFromMe ? 'MIM' : 'OUTRO'} (${jid}): ${userMessage}`);

                // --- Lógica de Comandos de Controle (Funciona para MIM e OUTROS) ---
                const command = userMessage.trim().toLowerCase();

                if (command === '#stopia') {
                    await import('./conversationRepository').then(r => r.setConversationStatus(jid, false));
                    await sock.sendMessage(jid, { text: '🛑 IA Pausada para este chat.' });
                    continue; // Para por aqui
                }

                if (command === '#startia' || command === '#staria') {
                    await import('./conversationRepository').then(r => r.setConversationStatus(jid, true));
                    await sock.sendMessage(jid, { text: '✅ IA Ativada para este chat.' });
                    continue; // Para por aqui
                }

                if (command === '#limpa') {
                    await messageRepo.clearHistory(jid);
                    await sock.sendMessage(jid, { text: '🧹 Memória limpa com sucesso!' });
                    continue;
                }

                // --- Se for mensagem MINHA (fromMe), só salva no banco e NÃO gera resposta IA ---
                if (isFromMe) {
                    await messageRepo.saveMessage(jid, 'model', userMessage); // Salva como 'model' ou 'user'? 
                    // Se EU respondo, tecnicamente eu sou o 'model' (agente humano) assumindo o controle.
                    // Mas para o histórico ficar coeso, talvez seja melhor salvar como 'assistant' se a ideia é treinar o modelo,
                    // mas aqui vamos salvar como 'model' para o histórico da IA saber o que foi respondido.
                    return;
                }

                // --- Se for mensagem de OUTRO, verifica status e gera IA ---

                // 1. Verifica se a IA está ativa
                const isActive = await import('./conversationRepository').then(r => r.getConversationStatus(jid));

                if (!isActive) {
                    console.log(`🔇 IA silenciada para ${jid}, ignorando mensagem.`);
                    await messageRepo.saveMessage(jid, 'user', userMessage); // Salva mensagem do user mesmo silenciado
                    return;
                }

                console.log(`✨ Gerando resposta IA para ${jid}...`);

                // 2. Salva msg do usuario
                await messageRepo.saveMessage(jid, 'user', userMessage);

                // 3. Busca histórico
                const history = await messageRepo.getMessageHistory(jid);

                // 4. Gera resposta
                const aiResponse = await aiService.generateResponse(userMessage, history);

                // 5. Envia
                await sock.sendMessage(jid, { text: aiResponse });

                // 6. Salva resposta da IA
                await messageRepo.saveMessage(jid, 'model', aiResponse);
            }
        }
    });
}
