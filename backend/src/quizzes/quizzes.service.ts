import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../prisma/prisma.service";
import { CreateQuizDto, CreateQuestionDto } from "./dto/create-quiz.dto";

@Injectable()
export class QuizzesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async create(createQuizDto: CreateQuizDto) {
    this.validateCreateQuizDto(createQuizDto);

    return this.prisma.quiz.create({
      data: {
        title: createQuizDto.title.trim(),
        questions: {
          create: createQuizDto.questions.map((question) => ({
            type: question.type,
            text: question.text.trim(),
            correctAnswer: question.correctAnswer?.trim(),
            options: {
              create:
                question.type === "CHECKBOX"
                  ? question.options?.map((option) => ({
                      text: option.text.trim(),
                      isCorrect: option.isCorrect
                    }))
                  : []
            }
          }))
        }
      },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });
  }

  findAll() {
    return this.prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            questions: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    if (!quiz) {
      throw new NotFoundException("Quiz not found");
    }

    return quiz;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.quiz.delete({
      where: { id }
    });

    return { id };
  }

  private validateCreateQuizDto(createQuizDto: CreateQuizDto) {
    if (!createQuizDto || typeof createQuizDto.title !== "string" || !createQuizDto.title.trim()) {
      throw new BadRequestException("Quiz title is required");
    }

    if (!Array.isArray(createQuizDto.questions) || createQuizDto.questions.length === 0) {
      throw new BadRequestException("Quiz must contain at least one question");
    }

    createQuizDto.questions.forEach((question, index) => {
      this.validateQuestion(question, index);
    });
  }

  private validateQuestion(question: CreateQuestionDto, index: number) {
    if (!question || typeof question.text !== "string" || !question.text.trim()) {
      throw new BadRequestException(`Question ${index + 1} text is required`);
    }

    if (!["BOOLEAN", "INPUT", "CHECKBOX"].includes(question.type)) {
      throw new BadRequestException(`Question ${index + 1} has an unsupported type`);
    }

    if (question.type === "BOOLEAN" && !["true", "false"].includes(question.correctAnswer ?? "")) {
      throw new BadRequestException(`Question ${index + 1} boolean answer must be true or false`);
    }

    if (question.type === "INPUT" && !question.correctAnswer?.trim()) {
      throw new BadRequestException(`Question ${index + 1} input answer is required`);
    }

    if (question.type === "CHECKBOX") {
      this.validateCheckboxQuestion(question, index);
    }
  }

  private validateCheckboxQuestion(question: CreateQuestionDto, index: number) {
    if (!Array.isArray(question.options) || question.options.length < 2) {
      throw new BadRequestException(`Question ${index + 1} must contain at least two options`);
    }

    const hasCorrectOption = question.options.some((option) => option.isCorrect);

    if (!hasCorrectOption) {
      throw new BadRequestException(
        `Question ${index + 1} must contain at least one correct option`
      );
    }

    question.options.forEach((option, optionIndex) => {
      if (!option || typeof option.text !== "string" || !option.text.trim()) {
        throw new BadRequestException(
          `Question ${index + 1}, option ${optionIndex + 1} text is required`
        );
      }

      if (typeof option.isCorrect !== "boolean") {
        throw new BadRequestException(
          `Question ${index + 1}, option ${optionIndex + 1} correctness must be boolean`
        );
      }
    });
  }
}
