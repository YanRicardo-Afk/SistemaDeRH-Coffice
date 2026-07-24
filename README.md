# Coffice

Coffice é um sistema web de Recursos Humanos desenvolvido para centralizar o gerenciamento de funcionários, controle de ponto e administração de holerites em uma única plataforma.

O projeto foi desenvolvido utilizando HTML, CSS e JavaScript no front-end, com Node.js, Express e MySQL no back-end, oferecendo uma aplicação simples, organizada e de fácil utilização.

---

## Funcionalidades

### Autenticação
- Login com autenticação utilizando JWT.
- Controle de acesso baseado em perfis de usuário.
- Proteção de rotas privadas.

### Funcionários
- Cadastro de funcionários.
- Edição de informações cadastrais.
- Listagem de colaboradores.
- Visualização de dados individuais.

### Controle de Ponto
- Registro de entrada.
- Registro de saída.
- Histórico de pontos registrados.
- Consulta de registros por funcionário.

### Holerites
- Cadastro de holerites.
- Consulta de holerites.
- Visualização individual dos documentos.

### Controle de Permissões

O sistema possui dois níveis de acesso:

**Administrador (RH)**

- Gerenciar funcionários.
- Consultar pontos de qualquer colaborador.
- Cadastrar holerites.
- Visualizar todas as informações do sistema.

**Funcionário**

- Registrar seu ponto.
- Consultar seus registros.
- Visualizar seus próprios holerites.
- Atualizar informações permitidas.

---

## Tecnologias Utilizadas

### Front-end

- HTML5
- CSS3
- JavaScript

### Back-end

- Node.js
- Express.js
- MySQL
- JWT (JSON Web Token)
- Bcrypt
- CORS
- Dotenv

---

## Estrutura do Projeto

```
SistemaDeRH-Coffice
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── database
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── server.js
│   └── package.json
│
├── frontend
│   ├── css
│   ├── js
│   ├── pages
│   └── assets
│
└── README.md
```

---

## Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
```

### 2. Entre na pasta do backend

```bash
cd backend
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure o arquivo `.env`

Exemplo:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=coffice
JWT_SECRET=sua_chave
PORT=3000
```

### 5. Criar o banco de dados

```bash
npm run db:create
```

### 6. Criar as tabelas

```bash
npm run db:init
```

### 7. Popular o banco (opcional)

```bash
npm run db:seed
```

### 8. Iniciar o servidor

```bash
npm run dev
```

O servidor ficará disponível em:

```
http://localhost:3000
```

---

## Organização do Sistema

O projeto segue uma arquitetura baseada em camadas:

- **Controllers** responsáveis pelas regras das requisições.
- **Models** responsáveis pelo acesso ao banco de dados.
- **Routes** responsáveis pelo roteamento da API.
- **Middlewares** responsáveis pela autenticação e autorização.
- **Database** responsável pela criação e inicialização do banco.
- **Frontend** responsável pela interface do usuário.

Essa organização facilita a manutenção, reutilização de código e escalabilidade da aplicação.

---

## Segurança

O sistema utiliza algumas práticas de segurança:

- Senhas criptografadas com Bcrypt.
- Autenticação utilizando JWT.
- Rotas protegidas por middleware.
- Controle de permissões por perfil de usuário.
- Variáveis sensíveis armazenadas em arquivo `.env`.

---

## Objetivo

O objetivo do Coffice é fornecer uma plataforma simples e eficiente para o gerenciamento de Recursos Humanos, permitindo o controle de funcionários, registro de ponto e gerenciamento de holerites através de uma interface web intuitiva.

---

## Desenvolvido por

Projeto desenvolvido para fins acadêmicos, aplicando conceitos de desenvolvimento web, arquitetura MVC, autenticação de usuários e integração com banco de dados MySQL.