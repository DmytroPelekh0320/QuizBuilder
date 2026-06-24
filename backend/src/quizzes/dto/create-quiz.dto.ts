export type QuestionTypeDto = "BOOLEAN" | "INPUT" | "CHECKBOX";

export interface CreateOptionDto {
  text: string;
  isCorrect: boolean;
}

export interface CreateQuestionDto {
  type: QuestionTypeDto;
  text: string;
  correctAnswer?: string;
  options?: CreateOptionDto[];
}

export interface CreateQuizDto {
  title: string;
  questions: CreateQuestionDto[];
}
