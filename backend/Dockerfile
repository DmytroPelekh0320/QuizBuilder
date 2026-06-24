FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json

RUN npm ci

COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev:backend"]
