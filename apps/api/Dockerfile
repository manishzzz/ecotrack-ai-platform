FROM node:20-alpine AS base
WORKDIR /app

COPY package.json ./
COPY apps/api/package.json ./apps/api/package.json

RUN npm install --workspace api

COPY apps/api ./apps/api

WORKDIR /app/apps/api
RUN npx prisma generate
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]
