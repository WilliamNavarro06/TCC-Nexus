-- Tabela de conversas
CREATE TABLE IF NOT EXISTS conversations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_1_id INT NOT NULL,
  user_2_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY unique_conversation (user_1_id, user_2_id),
  FOREIGN KEY (user_1_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_2_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_1 (user_1_id),
  INDEX idx_user_2 (user_2_id)
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  conversation_id INT NOT NULL,
  sender_id INT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_conversation (conversation_id),
  INDEX idx_sender (sender_id),
  INDEX idx_created_at (created_at)
);

-- Tabela de status online
CREATE TABLE IF NOT EXISTS user_online_status (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  is_online BOOLEAN DEFAULT FALSE,
  last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Inicializar status online para todos os usuários
INSERT IGNORE INTO user_online_status (user_id, is_online) 
SELECT id, FALSE FROM users;
