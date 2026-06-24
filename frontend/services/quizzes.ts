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

export async function deleteQuiz(id: string) {
  await request<{ id: string }>(`/quizzes/${id}`, {
    method: "DELETE"
  });
}
