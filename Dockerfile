# Define a versão do node.js
FROM node:20

# Define o diretório de trabalho do container
WORKDIR /app

# Copia o arquivo de dependências para dentro do container
COPY package.json .

# Instala as dependências do projeto
RUN npm install 

# Copia o restante dos arquivos do projeto para dentro do container
COPY . .

# Expor a porta 3000, que vai ser a porta usada pela aplicação
EXPOSE 3000

# Define o comando padrão para iniciar a aplicação
CMD ["npm", "start"]