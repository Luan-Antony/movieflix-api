# Imagem base
FROM node:20

# Diretorio de trabalho
WORKDIR /app

# Copiar apenas os arquivos necessários
COPY package.json ./
COPY package-lock.json ./

RUN npm install --production

# Copiar somente a pasta dist e outros arquivos necessários para rodar
COPY dist ./dist

# Expor a porta
EXPOSE 3000

# Comando para rodar
CMD ["node", "dist/src/server.js"]