FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY package-lock.json ./

RUN npm install

COPY . .


RUN npx prisma generate

RUN npm run build


FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/src/generated ./dist/generated
COPY --from=build /app/swagger.json ./swagger.json

CMD ["node", "dist/server.js"]