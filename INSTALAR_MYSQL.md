# Guia Completo de Instalação do MySQL

## Para Windows

### Passo 1: Download
1. Acesse [mysql.com/downloads](https://www.mysql.com/downloads/)
2. Clique em "MySQL Community Downloads"
3. Selecione "MySQL Community Server"
4. Escolha a versão mais recente (ex: 8.0.x)
5. Clique em "Go to Download Page"
6. Selecione o instalador para Windows (recomendado: o segundo link, o maior)
7. Clique em "Download" e escolha "No thanks, just start my download"

### Passo 2: Executar Instalador
1. Abra o arquivo `.msi` que foi baixado
2. Na tela inicial, clique em "Next"

### Passo 3: Escolher Tipo de Setup
1. Selecione **"Developer Default"** (isso inclui MySQL Workbench)
2. Clique em "Next"

### Passo 4: Check Requirements
1. O sistema verificará se todas as dependências estão instaladas
2. Se alguma estiver faltando, ele oferecerá para instalar
3. Clique em "Next" para continuar

### Passo 5: Installation
1. Revise os produtos que serão instalados
2. Clique em "Execute" para instalar
3. Aguarde a conclusão (pode levar alguns minutos)
4. Clique em "Next"

### Passo 6: Product Configuration
1. Clique em "Next" para configurar MySQL Server
2. **Type and Networking:**
   - Mantenha **"Development Computer"** selecionado
   - Porta padrão: **3306**
   - Clique em "Next"

3. **MySQL Server File System:**
   - Mantenha os caminhos padrão
   - Clique em "Next"

4. **Authentication Method:**
   - Selecione **"Use Legacy Authentication Method"** (compatível com Node.js)
   - Clique em "Next"

5. **Accounts and Roles:**
   - Root account password: **defina uma senha segura** (ex: `senha123`)
   - Anote essa senha!
   - Mantenha "Add User" como está
   - Clique em "Next"

6. **Windows Service:**
   - Marque **"Configure MySQL Server as a Windows Service"**
   - Mantenha "MySQL80" como nome do serviço
   - Marque **"Start the MySQL Server at System Startup"**
   - Clique em "Next"

7. **Server File Permissions:**
   - Clique em "Next"

### Passo 7: Conclusão
1. Clique em "Finish"
2. O MySQL Workbench será aberto automaticamente

### Passo 8: Verificar Instalação
1. Abra "MySQL Workbench"
2. Clique em "Local instance MySQL80"
3. Digite a senha que você definiu
4. Você deveria ver uma tela com a conexão ativa

---

## Para macOS

### Passo 1: Usando Homebrew (Recomendado)

\`\`\`bash
# Se não tiver Homebrew, instale primeiro:
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Instale MySQL
brew install mysql

# Inicie o MySQL
brew services start mysql

# Verifique a instalação
mysql --version
\`\`\`

### Passo 2: Configurar Usuário Root
\`\`\`bash
# Execute o script de segurança
mysql_secure_installation

# Responda as perguntas:
# - VALIDATE PASSWORD PLUGIN: y
# - Password validation level: 0
# - New password: [defina sua senha]
# - Re-enter password: [confirme]
# - Remove anonymous users: y
# - Disable root login remotely: y
# - Remove test database: y
# - Reload privilege tables: y
\`\`\`

### Passo 3: Verificar Conexão
\`\`\`bash
mysql -u root -p
# Digite sua senha quando solicitado
# Você verá: mysql>
# Digite: exit
\`\`\`

---

## Para Linux (Ubuntu/Debian)

### Passo 1: Atualizar Repositórios
\`\`\`bash
sudo apt update
sudo apt upgrade
\`\`\`

### Passo 2: Instalar MySQL
\`\`\`bash
sudo apt install mysql-server mysql-client
\`\`\`

### Passo 3: Configurar Segurança
\`\`\`bash
sudo mysql_secure_installation

# Responda as perguntas:
# - VALIDATE PASSWORD: y
# - Password validation level: 0
# - New password: [defina sua senha]
# - Re-enter password: [confirme]
# - Remove anonymous users: y
# - Disable root login remotely: y
# - Remove test database: y
# - Reload privilege tables: y
\`\`\`

### Passo 4: Iniciar Serviço
\`\`\`bash
sudo systemctl start mysql
sudo systemctl enable mysql
\`\`\`

### Passo 5: Verificar Status
\`\`\`bash
sudo systemctl status mysql
\`\`\`

---

## Próximo: Criar Banco de Dados para Nexus

Após instalar o MySQL, execute estes comandos para criar o banco:

### No Windows/macOS (usando MySQL Workbench):
1. Abra MySQL Workbench
2. Clique em "Local instance MySQL80"
3. Digite sua senha root
4. Vá para File > New Query Tab
5. Cole os comandos abaixo

### No Linux (usando terminal):
\`\`\`bash
mysql -u root -p
# Digite sua senha
\`\`\`

### Comandos SQL (igual para todos os SO):
\`\`\`sql
-- Criar banco de dados
CREATE DATABASE nexus_db;

-- Verificar se foi criado
SHOW DATABASES;

-- Usar o banco
USE nexus_db;

-- Criar usuário para a aplicação (mais seguro que usar root)
CREATE USER 'nexus_user'@'localhost' IDENTIFIED BY 'senha_nexus_123';

-- Dar permissões ao usuário
GRANT ALL PRIVILEGES ON nexus_db.* TO 'nexus_user'@'localhost';

-- Aplicar as permissões
FLUSH PRIVILEGES;
\`\`\`

---

## Importar as Tabelas do Projeto Nexus

Após criar o banco, importe as tabelas:

### Windows/macOS (MySQL Workbench):
1. Vá para Server > Data Import
2. Selecione "Import from Self-Contained File"
3. Procure pelo arquivo `scripts/01-create-tables.sql` no seu projeto
4. Clique em "Start Import"

### Linux (Terminal):
\`\`\`bash
mysql -u nexus_user -p nexus_db < /caminho/do/projeto/scripts/01-create-tables.sql
# Digite a senha: senha_nexus_123
\`\`\`

---

## Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do seu projeto com:

\`\`\`
DATABASE_HOST=localhost
DATABASE_USER=nexus_user
DATABASE_PASSWORD=senha_nexus_123
DATABASE_NAME=nexus_db
DATABASE_PORT=3306
\`\`\`

---

## Verificar Conexão (Teste Final)

No seu projeto, abra um terminal e execute:

\`\`\`bash
npm run dev
\`\`\`

Acesse http://localhost:3000

Se aparecer a página de landing da Nexus, tudo está funcionando!

---

## Erros Comuns

### "Access denied for user 'root'@'localhost'"
- Você digitou a senha incorreta
- Tente novamente e lembre-se que a senha é sensível a maiúsculas

### "Can't connect to MySQL server on 'localhost'"
- O MySQL não está rodando
- Windows: Procure por "Services" e inicie "MySQL80"
- macOS: Execute `brew services start mysql`
- Linux: Execute `sudo systemctl start mysql`

### "Database 'nexus_db' doesn't exist"
- Você não executou os comandos SQL acima
- Abra novamente o MySQL Workbench e execute os comandos

### "Unknown authentication plugin 'caching_sha2_password'"
- Na instalação do MySQL, selecione "Use Legacy Authentication Method"
- Ou configure a variável no `.env.local`

---

## Dicas Importantes

1. **Senha segura**: Use senhas fortes, não use "123456" ou "password"
2. **Porta 3306**: Por padrão MySQL usa a porta 3306. Se mudar, atualize no `.env.local`
3. **Backup**: Faça backup regular do seu banco de dados
4. **Não use root**: Para aplicações, sempre crie um usuário específico (como fiz acima)

Se tiver problemas, abra um terminal e execute:

\`\`\`bash
mysql -u root -p -e "SELECT VERSION();"
# Isso mostra a versão do MySQL instalada
\`\`\`

Sucesso na instalação!
