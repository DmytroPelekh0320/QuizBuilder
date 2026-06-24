# Quiz Builder

Full-stack quiz creation app built with NestJS, Prisma, PostgreSQL, Next.js, and TypeScript.

Users can create quizzes with boolean, short input, and checkbox questions; browse all quizzes; open quiz details; and delete quizzes.

## Tech Stack

- Backend: NestJS, TypeScript, Prisma
- Database: PostgreSQL
- Frontend: Next.js, React, TypeScript, CSS Modules
- Tooling: ESLint, Prettier, Docker Compose

## Project Structure

```text
quiz-builder/
├── backend/
│   ├── prisma/
│   └── src/
├── frontend/
│   ├── pages/
│   ├── services/
│   └── styles/
├── docker-compose.yml
└── package.json
```

## Environment

Copy the example environment file for local development:

```bash
copy .env.example .env
```

Update `.env` if your local PostgreSQL credentials are different:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/quiz_builder?schema=public
PORT=4000
NEXT_PUBLIC_API_URL=http://localhost:4000
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=quiz_builder
```

`docker-compose.yml` uses `.env.example` for development defaults. The backend service overrides `DATABASE_URL` inside Docker so it can connect to the `postgres` service instead of `localhost`.

## Run With Docker

Requirements:

- Docker
- Docker Compose

Start PostgreSQL, backend, and frontend:

```bash
docker compose up --build
```

The backend container runs Prisma generate, applies migrations, seeds sample data, and starts the NestJS API.

Open:

```text
http://localhost:3000/quizzes
```

Useful URLs:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:4000
Health:   http://localhost:4000/health
```

Stop containers:

```bash
docker compose down
```

Stop containers and remove the PostgreSQL volume:

```bash
docker compose down -v
```

## Run Locally

Requirements:

- Node.js
- PostgreSQL
- A PostgreSQL database named `quiz_builder`

Install dependencies:

```bash
npm install
```

Generate Prisma Client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Add sample data:

```bash
npm run seed
```

Start backend and frontend together:

```bash
npm run dev
```

Open:

```text
http://localhost:3000/quizzes
```

## App Pages

```text
/quizzes      Quiz dashboard
/create       Quiz creation form
/quizzes/:id  Quiz details
```

## API Endpoints

```text
GET    /health
POST   /quizzes
GET    /quizzes
GET    /quizzes/:id
DELETE /quizzes/:id
```

Example create quiz payload:

```json
{
  "title": "JavaScript Basics",
  "questions": [
    {
      "type": "BOOLEAN",
      "text": "JavaScript is dynamically typed.",
      "correctAnswer": "true"
    },
    {
      "type": "INPUT",
      "text": "Which keyword declares a constant?",
      "correctAnswer": "const"
    },
    {
      "type": "CHECKBOX",
      "text": "Select primitive types.",
      "options": [
        { "text": "string", "isCorrect": true },
        { "text": "number", "isCorrect": true },
        { "text": "array", "isCorrect": false }
      ]
    }
  ]
}
```

## Quality Checks

```bash
npm run lint
npm run format:check
npm run build
```

Format files:

```bash
npm run format
```
