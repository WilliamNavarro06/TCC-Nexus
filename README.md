# Nexus - Rede Social Educacional

Uma plataforma híbrida de rede social, Teams e GitHub para colaboração entre professores e alunos.

## Visão Geral

Nexus é uma rede social educacional moderna com estética roxa e cinza escuro, permitindo que professores e alunos:
- Compartilhem conhecimento através de posts com fotos
- Comentem e interajam em tempo real
- Gerenciem projetos e tarefas (Kanban)
- Organizem eventos em calendário
- Colaborem em equipes

## Demonstração

Acesse a plataforma em: https://vercel.com/marias-projects-3bf0cb79/v0-nexus-db

## Tecnologias Utilizadas

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: API Routes do Next.js
- **Banco de Dados**: MySQL
- **UI Components**: shadcn/ui
- **Gerenciamento de Estado**: React Hooks

---

# GUIA DE INSTALAÇÃO PASSO A PASSO

## Prerequisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download](https://nodejs.org/)
- **MySQL** (versão 8.0 ou superior) - [Download](https://dev.mysql.com/downloads/mysql/)
- **Git** - [Download](https://git-scm.com/)

### Verificar Instalação

Abra o terminal/prompt de comando e execute:

\`\`\`bash
node --version
npm --version
mysql --version
git --version
\`\`\`

---

## PASSO 1: Clonar o Repositório

\`\`\`bash
# Navegue até a pasta onde deseja clonar o projeto
cd Documents

# Clone o repositório
git clone https://github.com/WilliamNavarro06/v0-social-network-nexus.git

# Entre na pasta do projeto
cd v0-social-network-nexus
\`\`\`

---

## PASSO 2: Instalar Dependências Node.js

\`\`\`bash
# Instale todas as dependências do projeto
npm install

# Aguarde até que a instalação seja concluída (pode levar alguns minutos)
\`\`\`

---

## PASSO 3: Configurar o Banco de Dados MySQL

### 3.1 - Iniciar o MySQL

**Windows:**
- Abra "MySQL Command Line Client" (procure no Menu Iniciar)
- Digite sua senha de root

**macOS:**
\`\`\`bash
mysql -u root -p
\`\`\`

**Linux:**
\`\`\`bash
sudo mysql -u root -p
\`\`\`

### 3.2 - Criar o Banco de Dados

No MySQL CLI, execute:

\`\`\`sql
-- Criar o banco de dados
CREATE DATABASE nexus_db DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Selecionar o banco
USE nexus_db;
\`\`\`

### 3.3 - Executar os Scripts SQL

Existem duas formas de executar os scripts:

**Opção 1: Direto no MySQL CLI**

\`\`\`bash
# No terminal, estando na pasta do projeto
mysql -u root -p nexus_db < scripts/01-create-tables.sql
\`\`\`

**Opção 2: Manualmente no MySQL CLI**

1. Copie o conteúdo do arquivo `scripts/01-create-tables.sql`
2. Cole no MySQL CLI
3. Pressione Enter

---

## PASSO 4: Configurar Variáveis de Ambiente

### 4.1 - Criar arquivo .env.local

Na raiz do projeto, crie um arquivo chamado `.env.local`:

\`\`\`bash
# Windows
type nul > .env.local

# macOS/Linux
touch .env.local
\`\`\`

### 4.2 - Preencher as Variáveis

Abra o arquivo `.env.local` e adicione:

\`\`\`env
# Configurações do Banco de Dados MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql_aqui
DB_NAME=nexus_db

# Configuração do Servidor
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

**Importante**: Substitua `sua_senha_mysql_aqui` pela senha que você configurou no MySQL.

---

## PASSO 5: Iniciar o Servidor de Desenvolvimento

\`\`\`bash
# Na pasta do projeto, execute:
npm run dev
\`\`\`

Você verá uma mensagem como:

\`\`\`
> dev
> next dev

  ▲ Next.js 16.0.7
  - Local:        http://localhost:3000
\`\`\`

---

## PASSO 6: Acessar a Aplicação

Abra seu navegador e acesse:

\`\`\`
http://localhost:3000
\`\`\`

Você verá a landing page do Nexus com dois botões: **Login** e **Cadastro**.

---

## Como Usar

### Primeiro Acesso - Criar Conta

1. Clique em **"Cadastro"**
2. Preencha o formulário com:
   - Nome de usuário
   - Email
   - Senha
   - Selecione seu role: **Professor** ou **Aluno**
3. Clique em **"Cadastrar"**

### Login

1. Clique em **"Login"**
2. Use suas credenciais (email e senha)
3. Acesse a plataforma

### Menu Diferenciado por Role

**Se você é um ALUNO, verá:**
- Explorar (Feed)
- Amigos
- Projetos
- Kanban
- Calendário
- Salvos
- Atividades
- Configurações
- Ajuda

**Se você é um PROFESSOR, verá:**
- Explorar (Feed)
- Turmas (em vez de Amigos)
- Projetos
- Kanban
- Calendário
- Salvos
- Atividades
- Configurações
- Ajuda

### Funcionalidades Principais

**Feed - Explorar**
- Veja posts de outros usuários
- Clique em uma foto para ver o post completo
- Curta posts clicando no coração
- Comente nos posts

**Perfil**
- Clique no seu avatar/nome no menu
- Edite suas informações
- Atualize sua bio e foto de perfil

**Postagem de Fotos**
- Clique em "Novo Post" no Feed
- Selecione uma imagem
- Adicione uma descrição
- Clique em "Postar"

---

## Solução de Problemas

### Erro: "Não consigo conectar ao banco de dados"

1. Verifique se MySQL está rodando:
   - **Windows**: Procure "Serviços" e procure por "MySQL"
   - **macOS/Linux**: Execute `mysql -u root -p`

2. Verifique `.env.local`:
   - As credenciais estão corretas?
   - O banco de dados `nexus_db` foi criado?

3. Teste a conexão MySQL:
\`\`\`bash
mysql -u root -p -h localhost nexus_db
\`\`\`

### Erro: "Port 3000 já está em uso"

\`\`\`bash
# macOS/Linux - Liberar porta
kill -9 $(lsof -ti:3000)

# Windows - Abra o prompt como Admin
netstat -ano | findstr :3000
taskkill /PID <PID> /F
\`\`\`

### Erro: "npm command not found"

Node.js não está instalado ou não está no PATH. Instale do https://nodejs.org/

### Erro: "mysql command not found"

MySQL não está instalado. Instale do https://dev.mysql.com/downloads/mysql/

---

## Estrutura de Pastas

\`\`\`
v0-social-network-nexus/
├── app/
│   ├── api/              # API Routes
│   ├── landing/          # Landing Page
│   ├── auth/             # Páginas de Login/Cadastro
│   ├── feed/             # Feed principal
│   ├── perfil/           # Perfil de usuário
│   └── ...
├── components/           # Componentes React reutilizáveis
├── lib/
│   ├── db.ts            # Conexão com MySQL
│   └── db-utils.ts      # Funções utilitárias
├── public/               # Arquivos estáticos
├── scripts/
│   └── 01-create-tables.sql  # Script para criar tabelas
├── .env.local            # Variáveis de ambiente
├── package.json          # Dependências do projeto
└── README.md             # Este arquivo
\`\`\`

---

## Desenvolvendo Localmente

### Estrutura de Componentes

\`\`\`bash
# Criar um novo componente
# Salve em: components/seu-componente.tsx
\`\`\`

### Criar Nova Página

\`\`\`bash
# Criar em: app/sua-pagina/page.tsx
\`\`\`

### Criar API Route

\`\`\`bash
# Criar em: app/api/seu-endpoint/route.ts
\`\`\`

---

## Build para Produção

\`\`\`bash
# Compilar o projeto
npm run build

# Iniciar em modo produção
npm start
\`\`\`

---

## Deployment

O projeto está configurado para fazer deploy automático no Vercel quando você fizer push para a branch `main`.

Para fazer deploy manualmente:

1. Crie uma conta em https://vercel.com
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente em "Settings"
4. Clique em "Deploy"

---

## Suporte

Se encontrar problemas:

1. Verifique se seguiu todos os passos
2. Confira a seção "Solução de Problemas"
3. Consulte a documentação do [Next.js](https://nextjs.org/docs)
4. Abra uma issue no repositório

---

## Licença

Este projeto é de código aberto e disponível sob a licença MIT.

---

## Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## Autor

Criado com por [William Navarro](https://github.com/WilliamNavarro06)

---

**Última atualização**: Dezembro 2024
