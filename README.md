# 🎬 API de Filmes

Uma API RESTful para gerenciamento de filmes, desenvolvida com Node.js, Express, Prisma e Docker.
Oferece funcionalidades completas para adicionar, remover, atualizar, listar e filtrar filmes.

## 🚀 Tecnologias Utilizadas

Node.js – Ambiente de execução JavaScript no servidor.

Express – Framework para criação de rotas e middlewares.

Prisma – ORM para comunicação com banco de dados.

Docker – Containerização da aplicação para fácil deploy e portabilidade.

PostgreSQL – Banco de dados relacional utilizado pelo Prisma.


## 📌 Funcionalidades

➕ Adicionar filmes

✏ Atualizar informações de filmes

🗑 Remover filmes

📜 Listar todos os filmes

🔍 Filtrar filmes por atributos (ex: título, gênero, ano, etc.)

✅ Validações de dados para garantir integridade

<br>


# 🛠 Instalação e Uso

## 1️⃣ Clonar o repositório
git clone https://github.com/seu-usuario/api-filmes.git
cd api-filmes

<br>

## 2️⃣ Configurar variáveis de ambiente

Crie um arquivo .env na raiz com:
DATABASE_URL="postgresql://postgres:elefante@localhost:5432/movieflix?schema=public"
PORT=3000

<br>

## 3️⃣ Rodar com Docker
docker-compose up --build

<br>  

## 4️⃣ Rodar localmente (sem Docker)
npm install
npx prisma migrate dev
npm run dev

<br>

## 📌 Rotas da API
GET  - http://localhost:3000/movies |	Lista todos os filmes

GET	 - http://localhost:3000/movies/genero | Filtrar por genero

POST - http://localhost:3000/movies |	Adiciona um novo filme

PUT	 - http://localhost:3000/movies/id	Atualiza um filme

DELETE  - http://localhost:3000/movies/id	| Remove um filme
