FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev:frontend"]
