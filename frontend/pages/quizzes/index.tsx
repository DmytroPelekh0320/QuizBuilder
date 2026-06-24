import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { deleteQuiz, getQuizzes, QuizSummary } from "../../services/quizzes";
import styles from "../../styles/QuizzesPage.module.css";

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteQuiz, setPendingDeleteQuiz] = useState<QuizSummary | null>(null);

  useEffect(() => {
    void loadQuizzes();
  }, []);

  async function loadQuizzes() {
    try {
      setIsLoading(true);
      setError(null);
      setQuizzes(await getQuizzes());
    } catch {
      setError("Could not load quizzes.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!pendingDeleteQuiz) {
      return;
    }

    try {
      setDeletingId(pendingDeleteQuiz.id);
      await deleteQuiz(pendingDeleteQuiz.id);
      setQuizzes((currentQuizzes) =>
        currentQuizzes.filter((quiz) => quiz.id !== pendingDeleteQuiz.id)
      );
      setPendingDeleteQuiz(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not delete quiz.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Quiz Builder</p>
          <h1>Quizzes</h1>
        </div>

        <Link href="/create" className={styles.createButton}>
          <Plus size={18} aria-hidden="true" />
          <span>Create quiz</span>
        </Link>
      </section>

      {error ? (
        <div className={styles.notice} role="alert">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className={styles.notice}>Loading quizzes...</div>
      ) : quizzes.length === 0 ? (
        <div className={styles.emptyState}>No quizzes yet.</div>
      ) : (
        <section className={styles.list} aria-label="Quiz list">
          {quizzes.map((quiz) => (
            <article key={quiz.id} className={styles.quizItem}>
              <Link href={`/quizzes/${quiz.id}`} className={styles.quizLink}>
                <span className={styles.quizTitle}>{quiz.title}</span>
                <span className={styles.quizMeta}>
                  {quiz._count.questions} {quiz._count.questions === 1 ? "question" : "questions"}
                </span>
              </Link>

              <button
                className={styles.deleteButton}
                type="button"
                aria-label={`Delete ${quiz.title}`}
                title="Delete quiz"
                disabled={deletingId === quiz.id}
                onClick={() => setPendingDeleteQuiz(quiz)}
              >
                <Trash2 size={18} aria-hidden="true" />
              </button>
            </article>
          ))}
        </section>
      )}

      {pendingDeleteQuiz ? (
        <div className={styles.modalOverlay} role="presentation">
          <section
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
          >
            <h2 id="delete-title">Delete quiz</h2>
            <p>
              Are you sure you want to delete <strong>{pendingDeleteQuiz.title}</strong>?
            </p>

            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                type="button"
                disabled={deletingId === pendingDeleteQuiz.id}
                onClick={() => setPendingDeleteQuiz(null)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                type="button"
                disabled={deletingId === pendingDeleteQuiz.id}
                onClick={() => void handleDelete()}
              >
                {deletingId === pendingDeleteQuiz.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
