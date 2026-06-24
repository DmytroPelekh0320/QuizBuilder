import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

import { createQuiz, QuestionType } from "../services/quizzes";
import styles from "../styles/CreateQuizPage.module.css";

interface OptionFormState {
  text: string;
  isCorrect: boolean;
}

interface QuestionFormState {
  type: QuestionType;
  text: string;
  correctAnswer: string;
  options: OptionFormState[];
}

const defaultQuestion = (): QuestionFormState => ({
  type: "BOOLEAN",
  text: "",
  correctAnswer: "true",
  options: [
    { text: "", isCorrect: false },
    { text: "", isCorrect: false }
  ]
});

export default function CreateQuizPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionFormState[]>([defaultQuestion()]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setError(null);
      setIsSubmitting(true);
      const quiz = await createQuiz({
        title,
        questions: questions.map((question) => ({
          type: question.type,
          text: question.text,
          correctAnswer: question.type === "CHECKBOX" ? undefined : question.correctAnswer,
          options: question.type === "CHECKBOX" ? question.options : undefined
        }))
      });

      await router.push(`/quizzes/${quiz.id}`);
    } catch {
      setError("Could not create quiz. Check required fields and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateQuestion(index: number, updates: Partial<QuestionFormState>) {
    setQuestions((currentQuestions) =>
      currentQuestions.map((question, questionIndex) =>
        questionIndex === index ? { ...question, ...updates } : question
      )
    );
  }

  function updateQuestionType(index: number, type: QuestionType) {
    updateQuestion(index, {
      type,
      correctAnswer: type === "BOOLEAN" ? "true" : "",
      options:
        type === "CHECKBOX"
          ? [
              { text: "", isCorrect: false },
              { text: "", isCorrect: false }
            ]
          : []
    });
  }

  function addQuestion() {
    setQuestions((currentQuestions) => [...currentQuestions, defaultQuestion()]);
  }

  function removeQuestion(index: number) {
    setQuestions((currentQuestions) =>
      currentQuestions.length === 1
        ? currentQuestions
        : currentQuestions.filter((_, questionIndex) => questionIndex !== index)
    );
  }

  function updateOption(
    questionIndex: number,
    optionIndex: number,
    updates: Partial<OptionFormState>
  ) {
    const question = questions[questionIndex];

    updateQuestion(questionIndex, {
      options: question.options.map((option, currentOptionIndex) =>
        currentOptionIndex === optionIndex ? { ...option, ...updates } : option
      )
    });
  }

  function addOption(questionIndex: number) {
    const question = questions[questionIndex];
    updateQuestion(questionIndex, {
      options: [...question.options, { text: "", isCorrect: false }]
    });
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    const question = questions[questionIndex];

    updateQuestion(questionIndex, {
      options:
        question.options.length <= 2
          ? question.options
          : question.options.filter((_, currentOptionIndex) => currentOptionIndex !== optionIndex)
    });
  }

  return (
    <main className={styles.page}>
      <Link href="/quizzes" className={styles.backLink}>
        <ArrowLeft size={18} aria-hidden="true" />
        <span>Back to quizzes</span>
      </Link>

      <section className={styles.header}>
        <p className={styles.eyebrow}>Quiz Builder</p>
        <h1>Create quiz</h1>
      </section>

      {error ? (
        <div className={styles.notice} role="alert">
          {error}
        </div>
      ) : null}

      <form className={styles.form} onSubmit={(event) => void handleSubmit(event)}>
        <label className={styles.field}>
          <span>Quiz title</span>
          <input
            value={title}
            required
            placeholder="JavaScript fundamentals"
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>

        <section className={styles.questions} aria-label="Questions">
          {questions.map((question, questionIndex) => (
            <article key={questionIndex} className={styles.question}>
              <div className={styles.questionHeader}>
                <h2>Question {questionIndex + 1}</h2>
                <button
                  className={styles.iconButton}
                  type="button"
                  aria-label={`Remove question ${questionIndex + 1}`}
                  title="Remove question"
                  disabled={questions.length === 1}
                  onClick={() => removeQuestion(questionIndex)}
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </div>

              <label className={styles.field}>
                <span>Question text</span>
                <input
                  value={question.text}
                  required
                  placeholder="Type your question"
                  onChange={(event) => updateQuestion(questionIndex, { text: event.target.value })}
                />
              </label>

              <label className={styles.field}>
                <span>Question type</span>
                <select
                  value={question.type}
                  onChange={(event) =>
                    updateQuestionType(questionIndex, event.target.value as QuestionType)
                  }
                >
                  <option value="BOOLEAN">True / False</option>
                  <option value="INPUT">Short input</option>
                  <option value="CHECKBOX">Checkbox</option>
                </select>
              </label>

              <QuestionFields
                question={question}
                questionIndex={questionIndex}
                updateQuestion={updateQuestion}
                updateOption={updateOption}
                addOption={addOption}
                removeOption={removeOption}
              />
            </article>
          ))}
        </section>

        <div className={styles.actions}>
          <button className={styles.secondaryButton} type="button" onClick={addQuestion}>
            <Plus size={18} aria-hidden="true" />
            <span>Add question</span>
          </button>

          <button className={styles.primaryButton} type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create quiz"}
          </button>
        </div>
      </form>
    </main>
  );
}

function QuestionFields({
  question,
  questionIndex,
  updateQuestion,
  updateOption,
  addOption,
  removeOption
}: {
  question: QuestionFormState;
  questionIndex: number;
  updateQuestion: (index: number, updates: Partial<QuestionFormState>) => void;
  updateOption: (
    questionIndex: number,
    optionIndex: number,
    updates: Partial<OptionFormState>
  ) => void;
  addOption: (questionIndex: number) => void;
  removeOption: (questionIndex: number, optionIndex: number) => void;
}) {
  if (question.type === "BOOLEAN") {
    return (
      <fieldset className={styles.booleanGroup}>
        <legend>Correct answer</legend>
        <label>
          <input
            type="radio"
            name={`question-${questionIndex}-boolean`}
            checked={question.correctAnswer === "true"}
            onChange={() => updateQuestion(questionIndex, { correctAnswer: "true" })}
          />
          <span>True</span>
        </label>
        <label>
          <input
            type="radio"
            name={`question-${questionIndex}-boolean`}
            checked={question.correctAnswer === "false"}
            onChange={() => updateQuestion(questionIndex, { correctAnswer: "false" })}
          />
          <span>False</span>
        </label>
      </fieldset>
    );
  }

  if (question.type === "INPUT") {
    return (
      <label className={styles.field}>
        <span>Correct answer</span>
        <input
          value={question.correctAnswer}
          required
          placeholder="Expected short answer"
          onChange={(event) => updateQuestion(questionIndex, { correctAnswer: event.target.value })}
        />
      </label>
    );
  }

  return (
    <section className={styles.options} aria-label={`Options for question ${questionIndex + 1}`}>
      {question.options.map((option, optionIndex) => (
        <div key={optionIndex} className={styles.optionRow}>
          <label className={styles.checkField}>
            <input
              type="checkbox"
              checked={option.isCorrect}
              onChange={(event) =>
                updateOption(questionIndex, optionIndex, { isCorrect: event.target.checked })
              }
            />
            <span>Correct</span>
          </label>

          <input
            value={option.text}
            required
            placeholder={`Option ${optionIndex + 1}`}
            onChange={(event) =>
              updateOption(questionIndex, optionIndex, { text: event.target.value })
            }
          />

          <button
            className={styles.iconButton}
            type="button"
            aria-label={`Remove option ${optionIndex + 1}`}
            title="Remove option"
            disabled={question.options.length <= 2}
            onClick={() => removeOption(questionIndex, optionIndex)}
          >
            <Trash2 size={18} aria-hidden="true" />
          </button>
        </div>
      ))}

      <button
        className={styles.secondaryButton}
        type="button"
        onClick={() => addOption(questionIndex)}
      >
        <Plus size={18} aria-hidden="true" />
        <span>Add option</span>
      </button>
    </section>
  );
}
