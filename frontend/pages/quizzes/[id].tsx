import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getQuiz, QuizDetails, QuizQuestion } from "../../services/quizzes";
import styles from "../../styles/QuizDetailsPage.module.css";

export default function QuizDetailsPage() {
  const router = useRouter();
  const id = typeof router.query.id === "string" ? router.query.id : null;
  const [quiz, setQuiz] = useState<QuizDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    void loadQuiz(id);
  }, [id]);

  async function loadQuiz(quizId: string) {
    try {
      setIsLoading(true);
      setError(null);
      setQuiz(await getQuiz(quizId));
    } catch {
      setError("Could not load quiz details.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className={styles.page}>
      <Link href="/quizzes" className={styles.backLink}>
        <ArrowLeft size={18} aria-hidden="true" />
        <span>Back to quizzes</span>
      </Link>

      {error ? (
        <div className={styles.notice} role="alert">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className={styles.notice}>Loading quiz...</div>
      ) : quiz ? (
        <>
          <section className={styles.header}>
            <p className={styles.eyebrow}>Quiz details</p>
            <h1>{quiz.title}</h1>
            <p className={styles.summary}>
              {quiz.questions.length} {quiz.questions.length === 1 ? "question" : "questions"}
            </p>
          </section>

          <section className={styles.questions} aria-label="Quiz questions">
            {quiz.questions.map((question, index) => (
              <article key={question.id} className={styles.question}>
                <div className={styles.questionHeader}>
                  <span className={styles.questionNumber}>{index + 1}</span>
                  <span className={styles.questionType}>{question.type.toLowerCase()}</span>
                </div>

                <h2>{question.text}</h2>
                <QuestionAnswer question={question} />
              </article>
            ))}
          </section>
        </>
      ) : null}
    </main>
  );
}

function QuestionAnswer({ question }: { question: QuizQuestion }) {
  if (question.type === "CHECKBOX") {
    return (
      <ul className={styles.options}>
        {question.options.map((option) => (
          <li key={option.id} className={option.isCorrect ? styles.correctOption : undefined}>
            <span>{option.text}</span>
            {option.isCorrect ? <Check size={16} aria-label="Correct answer" /> : null}
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={styles.answer}>
      <span>Answer</span>
      <strong>{question.correctAnswer}</strong>
    </div>
  );
}
