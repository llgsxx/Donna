CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  remote_jid TEXT NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('user', 'model')),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
