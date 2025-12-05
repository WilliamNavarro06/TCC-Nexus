-- Adicionar coluna role à tabela users se não existir
ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('student', 'teacher') DEFAULT 'student';

-- Adicionar coluna username se não existir (para compatibilidade)
ALTER TABLE users MODIFY COLUMN username VARCHAR(50) NULL;

-- Adicionar índice para role
ALTER TABLE users ADD INDEX idx_role (role);

-- Garantir que email seja obrigatório e único
ALTER TABLE users MODIFY COLUMN email VARCHAR(100) NOT NULL UNIQUE;

-- Atualizar any existing records to have a valid role if needed
UPDATE users SET role = 'student' WHERE role IS NULL;
