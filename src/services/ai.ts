import { Groq } from "groq-sdk";
import fs from 'fs';
import { config } from '../config';

const groq = new Groq({
    apiKey: config.ai.groqKey
});

export interface IChatMessage {
    role: 'user' | 'model';
    content: string;
}

// Carrega o prompt do sistema apenas uma vez na inicialização ou a cada req? 
// Melhor carregar a cada req para permitir hot-reload do arquivo sem reiniciar o server
function getSystemPrompt(): string {
    try {
        return fs.readFileSync(config.ai.systemPromptPath, 'utf-8');
    } catch (error) {
        console.error("⚠️ Erro ao ler system.txt, usando fallback.", error);
        return "Você é um assistente útil.";
    }
}

export async function generateResponse(
    userQuery: string,
    history: IChatMessage[]
): Promise<string> {

    // Mapeamento correto para ChatCompletionMessageParam
    const messages: any[] = [
        { role: 'system', content: getSystemPrompt() }
    ];

    history.forEach(msg => {
        messages.push({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.content
        });
    });

    messages.push({ role: 'user', content: userQuery });

    try {
        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: config.ai.model,
            temperature: config.ai.temperature,
            max_tokens: config.ai.maxTokens,
        });

        return chatCompletion.choices[0]?.message?.content || "";
    } catch (error: any) {
        console.error("❌ Error generating AI response with Groq:", error);
        if (error?.error?.message) {
            console.error("   Groq API Message:", error.error.message);
        }
        return "Desculpe, estou com dificuldades temporárias. Tente novamente em instantes.";
    }
}
