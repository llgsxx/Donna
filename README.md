# 🤖 WhatsApp AI Agent

Um assistente inteligente para WhatsApp construído com **Node.js**, **Baileys**, **Groq AI (Llama 3)** e **PostgreSQL**.

Este projeto permite transformar seu WhatsApp em um bot capaz de responder mensagens automaticamente com contexto, salvar histórico de conversas e obedecer comandos de controle. Inclui também um **painel web** para monitorar os logs em tempo real.

## ✨ Funcionalidades

- 🧠 **IA Conversacional**: Usa o modelo `llama-3.3-70b` (via Groq) para respostas rápidas e inteligentes.
- 💾 **Memória Persistente**: Histórico de conversas salvo no PostgreSQL para contexto contínuo.
- 🎮 **Comandos de Controle**:
  - `#stopIA`: Pausa a IA para o chat atual.
  - `#startIA`: Reativa a IA.
  - `#limpa`: Apaga a memória (histórico) do chat atual.
- 📊 **Dashboard de Logs**: Interface web em Next.js para ver as mensagens chegando em tempo real.
- 🔒 **Privacidade**: As mensagens enviadas por VOCÊ (`fromMe`) não geram resposta da IA, mas são salvas para manter o contexto.

## 🛠️ Tecnologias

- **Backend**: Node.js, TypeScript
- **WhatsApp**: @whiskeysockets/baileys (Web API simulation)
- **AI**: Groq SDK
- **Database**: PostgreSQL (Docker)
- **Dashboard**: Next.js, TailwindCSS

## 🚀 Como Instalar e Rodar

### Pré-requisitos
- Node.js (v18+)
- Docker e Docker Compose (recomendado para o banco de dados)
- Uma chave de API da [Groq](https://console.groq.com/)

### Passo a Passo

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/whatsapp-ai-agent.git
   cd whatsapp-ai-agent
   ```

2. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto (copie o `.env.example` se houver) e preencha:
   ```env
   GROQ_API_KEY=sua_chave_gsk_aqui
   POSTGRES_USER=user
   POSTGRES_PASSWORD=password
   POSTGRES_DB=whatsapp_agent
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5433
   ```

3. **Inicie o Banco de Dados**
   Se estiver usando Docker, basta rodar:
   ```bash
   docker-compose up -d
   ```
   *Isso subirá um container PostgreSQL na porta 5433.*

4. **Instale as Dependências**
   ```bash
   npm install
   # Entra na pasta do dashboard e instala também
   cd dashboard && npm install && cd ..
   ```

5. **Inicie o Agente**
   ```bash
   npm start
   ```
   *Um **QR Code** aparecerá no terminal. Escaneie-o com seu WhatsApp (Menu > Aparelhos Conectados > Conectar Aparelho).*

6. **Inicie o Dashboard (Opcional)**
   Em outro terminal, rode:
   ```bash
   cd dashboard
   npm run dev
   ```
   Acesse `http://localhost:3000`.

## 🧠 Personalização

- **Personalidade da IA**: Edite o arquivo `src/prompts/system.txt` para mudar como o bot se comporta.
- **Modelo de IA**: Altere `src/config/index.ts` se quiser usar outro modelo da Groq.

## 🤝 Contribuição

Sinta-se livre para abrir Issues ou PRs!
