-- Cria tabela de configurações de conversas
CREATE TABLE IF NOT EXISTS conversations (
  remote_jid VARCHAR(255) PRIMARY KEY,
  is_active BOOLEAN DEFAULT TRUE,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
