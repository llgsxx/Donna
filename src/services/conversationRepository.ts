import { query } from '../db';

export async function getConversationStatus(jid: string): Promise<boolean> {
    try {
        const res = await query('SELECT is_active FROM conversations WHERE remote_jid = $1', [jid]);
        if (res.rows.length === 0) {
            // Se não existe registro, assumimos que está ATIVO por padrão
            // Opcional: Criar o registro automaticamente
            await setConversationStatus(jid, true);
            return true;
        }
        return res.rows[0].is_active;
    } catch (error) {
        console.error('Error fetching conversation status:', error);
        return true; // Fallback: ativo
    }
}

export async function setConversationStatus(jid: string, isActive: boolean): Promise<void> {
    try {
        await query(
            `INSERT INTO conversations (remote_jid, is_active, last_updated)
             VALUES ($1, $2, CURRENT_TIMESTAMP)
             ON CONFLICT (remote_jid) 
             DO UPDATE SET is_active = $2, last_updated = CURRENT_TIMESTAMP`,
            [jid, isActive]
        );
        console.log(`✅ Status da conversa ${jid} atualizado para: ${isActive ? 'ATIVO' : 'PAUSADO'}`);
    } catch (error) {
        console.error('Error setting conversation status:', error);
    }
}
