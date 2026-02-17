import pool from '../db';

export async function saveMessage(jid: string, role: string, content: string) {
    const query = 'INSERT INTO messages (remote_jid, role, content) VALUES ($1, $2, $3)';
    try {
        await pool.query(query, [jid, role, content]);
    } catch (err) {
        console.error('Error saving message:', err);
    }
}

export async function getMessageHistory(jid: string, limit: number = 10) {
    const query = 'SELECT role, content FROM messages WHERE remote_jid = $1 ORDER BY created_at DESC LIMIT $2';
    try {
        const result = await pool.query(query, [jid, limit]);
        // Reverse to get chronological order for the AI context
        return result.rows.reverse();
    } catch (err) {
        console.error('Error fetching message history:', err);
        return [];
    }
}

export async function clearHistory(jid: string) {
    const query = 'DELETE FROM messages WHERE remote_jid = $1';
    try {
        await pool.query(query, [jid]);
        console.log(`🧹 Histórico limpo para ${jid}`);
    } catch (err) {
        console.error('Error clearing history:', err);
    }
}
