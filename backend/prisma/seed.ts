import { PrismaClient, QuestionType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.quiz.create({
    data: {
      title: "JavaScript Basics",
      questions: {
        create: [
          {
            type: QuestionType.BOOLEAN,
            text: "JavaScript is a statically typed language.",
            correctAnswer: "false"
          },
          {
            type: QuestionType.INPUT,
            text: "Which keyword declares a block-scoped variable?",
            correctAnswer: "let"
          },
          {
            type: QuestionType.CHECKBOX,
            text: "Select JavaScript primitive types.",
            options: {
              create: [
                { text: "string", isCorrect: true },
                { text: "boolean", isCorrect: true },
                { text: "array", isCorrect: false },
                { text: "number", isCorrect: true }
              ]
            }
          }
        ]
      }
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
