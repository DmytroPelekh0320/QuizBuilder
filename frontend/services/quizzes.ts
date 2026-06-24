const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export interface QuizSummary {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    questions: number;
  };
}

export type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  text: string;
  correctAnswer: string | null;
  options: QuizOption[];
}

export interface QuizDetails {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  questions: QuizQuestion[];
}

export interface CreateQuizOption {
  text: string;
  isCorrect: boolean;
}

export interface CreateQuizQuestion {
  type: QuestionType;
  text: string;
  correctAnswer?: string;
  options?: CreateQuizOption[];
}

export interface CreateQuizPayload {
  title: string;
  questions: CreateQuizQuestion[];
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json() as Promise<T>;
}

export function getQuizzes() {
  return request<QuizSummary[]>("/quizzes");
}

export function getQuiz(id: string) {
  return request<QuizDetails>(`/quizzes/${id}`);
}

export function createQuiz(payload: CreateQuizPayload) {
  return request<QuizDetails>("/quizzes", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function deleteQuiz(id: string) {
  await request<{ id: string }>(`/quizzes/${id}`, {
    method: "DELETE"
  });
}
