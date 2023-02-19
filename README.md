# ⚽ Projeto TFC ⚽

O projeto Futebol clube é uma API de Futebol que foi desenvolvida utilizando typescript, orientação a objetos, nodejs, express, sequelize e mySQL, na qual pode-se realizar login e buscar informações sobre a classificação e partidas de um campeonato.

Utilizei TDD durante todo o desenvolvimento, sendo os testes de integração feitos usando Mocha, Chai e Sinon.

Existe validação de usuário usando JWT (JSON Web Token). (É necessário um token pra criar novas partidas).

Um Front-end também está disponível (Disponibilizado pela trybe).

# Tecnologias usadas

TypeScript, Express, Sequelize, MySQL, BCryptJS, JWT, Mocha, Chai, Sinon, Docker...

# Como usar

<details>
  <summary><strong>Clonando o repositório e instalando as dependências</strong></summary>

- `git clone git@github.com:joao-pasip/tfc-project.git`
- `cd tfc-project`
- `npm install`

</details>

<details>
  <summary><strong>Rodando os aplicativos</strong></summary>

- `npm run compose:up:dev`
  - pra começar a aplicação, (front e back) usando docker compose.
- Copiar as informações do arquivo .env.example e criar um .env na pasta de backend
- O Front-end pode ser acessado aqui: http://localhost:3000

</details>

<details>
  <summary><strong>Logando</strong></summary>

- Credenciais de login com poderes de admin (para propósitos de teste).
  - email: `admin@admin.com`
  - senha: `secret_admin`

</details>

<details>
  <summary><strong>Rodando testes E2E</strong></summary>

- Entrar na pasta de backend: `cd app && cd backend`
  - para rodar os testes de integração do Back-end
  - `npm test`

</details>