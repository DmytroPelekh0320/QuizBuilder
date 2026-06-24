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
  const [serverError, setServerError] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const validationError = hasSubmitted ? getValidationError() : null;
  const visibleError = validationError ?? serverError;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasSubmitted(true);

    try {
      setServerError(null);
      const nextValidationError = getValidationError();

      if (nextValidationError) {
        return;
      }

      setIsSubmitting(true);
      await createQuiz({
        title,
        questions: questions.map((question) => ({
          type: question.type,
          text: question.text,
          correctAnswer: question.type === "CHECKBOX" ? undefined : question.correctAnswer,
          options: question.type === "CHECKBOX" ? question.options : undefined
        }))
      });

      await router.push("/quizzes");
    } catch (error) {
      setServerError(error instanceof Error ? error.message : "Could not create quiz.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateQuestion(index: number, updates: Partial<QuestionFormState>) {
    setServerError(null);
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

  function getValidationError() {
    if (!title.trim()) {
      return "Quiz title is required.";
    }

    const emptyQuestionTextIndex = questions.findIndex((question) => !question.text.trim());

    if (emptyQuestionTextIndex !== -1) {
      return `Question ${emptyQuestionTextIndex + 1} text is required.`;
    }

    const emptyInputAnswerIndex = questions.findIndex(
      (question) => question.type === "INPUT" && !question.correctAnswer.trim()
    );

    if (emptyInputAnswerIndex !== -1) {
      return `Question ${emptyInputAnswerIndex + 1} answer is required.`;
    }

    const checkboxWithoutCorrectOptionIndex = questions.findIndex((question) => {
      if (question.type !== "CHECKBOX") {
        return false;
      }

      return !question.options.some((option) => option.isCorrect);
    });

    if (checkboxWithoutCorrectOptionIndex !== -1) {
      return `Question ${checkboxWithoutCorrectOptionIndex + 1} must have at least one correct option.`;
    }

    const checkboxWithEmptyOptionIndex = questions.findIndex(
      (question) =>
        question.type === "CHECKBOX" && question.options.some((option) => !option.text.trim())
    );

    if (checkboxWithEmptyOptionIndex !== -1) {
      return `Question ${checkboxWithEmptyOptionIndex + 1} options must not be empty.`;
    }

    return null;
  }

  function isTitleInvalid() {
    return hasSubmitted && !title.trim();
  }

  function isQuestionTextInvalid(question: QuestionFormState) {
    return hasSubmitted && !question.text.trim();
  }

  function isInputAnswerInvalid(question: QuestionFormState) {
    return hasSubmitted && question.type === "INPUT" && !question.correctAnswer.trim();
  }

  function isCheckboxCorrectAnswerInvalid(question: QuestionFormState) {
    return (
      hasSubmitted &&
      question.type === "CHECKBOX" &&
      !question.options.some((option) => option.isCorrect)
    );
  }

  function addQuestion() {
    setServerError(null);
    setQuestions((currentQuestions) => [...currentQuestions, defaultQuestion()]);
  }

  function removeQuestion(index: number) {
    setServerError(null);
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
    setServerError(null);
    updateQuestion(questionIndex, {
      options: [...question.options, { text: "", isCorrect: false }]
    });
  }

  function removeOption(questionIndex: number, optionIndex: number) {
    const question = questions[questionIndex];
    setServerError(null);

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

      {visibleError ? (
        <div className={styles.notice} role="alert">
          {visibleError}
        </div>
      ) : null}

      <form className={styles.form} noValidate onSubmit={(event) => void handleSubmit(event)}>
        <label className={styles.field}>
          <span>Quiz title</span>
          <input
            className={isTitleInvalid() ? styles.invalidControl : undefined}
            value={title}
            placeholder="JavaScript fundamentals"
            aria-invalid={isTitleInvalid()}
            onChange={(event) => {
              setServerError(null);
              setTitle(event.target.value);
            }}
          />
        </label>

        <section className={styles.questions} aria-label="Questions">
          {questions.map((question, questionIndex) => (
            <article
              key={questionIndex}
              className={
                isQuestionTextInvalid(question) ||
                isInputAnswerInvalid(question) ||
                isCheckboxCorrectAnswerInvalid(question)
                  ? `${styles.question} ${styles.invalidQuestion}`
                  : styles.question
              }
            >
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
                  className={isQuestionTextInvalid(question) ? styles.invalidControl : undefined}
                  value={question.text}
                  placeholder="Type your question"
                  aria-invalid={isQuestionTextInvalid(question)}
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
                hasSubmitted={hasSubmitted}
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
  removeOption,
  hasSubmitted
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
  hasSubmitted: boolean;
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
          className={
            hasSubmitted && question.type === "INPUT" && !question.correctAnswer.trim()
              ? styles.invalidControl
              : undefined
          }
          value={question.correctAnswer}
          placeholder="Expected short answer"
          aria-invalid={hasSubmitted && question.type === "INPUT" && !question.correctAnswer.trim()}
          onChange={(event) => updateQuestion(questionIndex, { correctAnswer: event.target.value })}
        />
      </label>
    );
  }

  return (
    <section
      className={
        hasSubmitted &&
        (question.options.some((option) => !option.text.trim()) ||
          !question.options.some((option) => option.isCorrect))
          ? `${styles.options} ${styles.invalidOptions}`
          : styles.options
      }
      aria-label={`Options for question ${questionIndex + 1}`}
    >
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
            className={hasSubmitted && !option.text.trim() ? styles.invalidControl : undefined}
            placeholder={`Option ${optionIndex + 1}`}
            aria-invalid={hasSubmitted && !option.text.trim()}
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
