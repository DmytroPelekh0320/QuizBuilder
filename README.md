# Quiz Builder

Full-stack quiz creation app built with NestJS, Prisma, PostgreSQL, Next.js, and TypeScript.

Users can create quizzes, list all available quizzes, open quiz details, and delete quizzes.

## Tech Stack

- Backend: NestJS, TypeScript, Prisma
- Database: PostgreSQL
- Frontend: Next.js, React, TypeScript, CSS Modules
- Tooling: ESLint, Prettier

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
└── package.json
```

## Environment

Copy the example environment file:

```bash
copy .env.example .env
```

Update `.env` if your local PostgreSQL credentials are different:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/quiz_builder?schema=public"
PORT=4000
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## Database Setup

Create a PostgreSQL database named:

```text
quiz_builder
```

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

## Run Locally

Start backend and frontend together:

```bash
npm run dev
```

Backend runs on:

```text
http://localhost:4000
```

Frontend runs on:

```text
http://localhost:3000
```

Useful pages:

```text
http://localhost:3000/quizzes
http://localhost:3000/create
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
