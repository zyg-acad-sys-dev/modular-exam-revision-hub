import { useMemo, useState } from "react";
import { useStudyProgress } from "../content/StudyProgressProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { BilingualText } from "./BilingualText.jsx";

function getOptions(quiz, ui) {
  if (quiz.options?.length > 0) return quiz.options;
  if (quiz.type === "true-false") return [ui("true"), ui("false")];
  return [];
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function QuizCard({ quiz, onAnswered, compact = false }) {
  const [selected, setSelected] = useState([]);
  const [textAnswer, setTextAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const { recordQuizAttempt, toggleBookmark, isBookmarked } = useStudyProgress();
  const { ui } = useLanguage();

  const options = getOptions(quiz, ui);
  const correctAnswers = useMemo(
    () => (quiz.correctAnswers || [quiz.correctAnswer]).filter(Boolean),
    [quiz]
  );
  const isMultiple = quiz.type === "multiple" || correctAnswers.length > 1;
  const isText = options.length === 0;
  const bookmarked = isBookmarked("quiz", quiz.id);

  const isCorrect = useMemo(() => {
    if (isText) return normalize(textAnswer) === normalize(correctAnswers[0]);
    const selectedSet = new Set(selected);
    const correctSet = new Set(correctAnswers);
    return selectedSet.size === correctSet.size && [...correctSet].every((x) => selectedSet.has(x));
  }, [isText, textAnswer, selected, correctAnswers]);

  function toggleOption(option) {
    setChecked(false);
    if (isMultiple) setSelected((prev) => prev.includes(option) ? prev.filter((x) => x !== option) : [...prev, option]);
    else setSelected([option]);
  }

  function checkAnswer() {
    setChecked(true);
    recordQuizAttempt(quiz, isCorrect);
    onAnswered?.(quiz, isCorrect);
  }

  function reset() {
    setSelected([]); setTextAnswer(""); setChecked(false);
  }

  return (
    <article className={`quiz-card quiz-card-v2 ${compact ? "compact" : ""} ${checked ? (isCorrect ? "answered-correct" : "answered-wrong") : ""}`}>
      <div className="card-topline">
        <span className="eyebrow">? {quiz.type || ui("questionTypeQuiz")}</span>
        {quiz.priority && <span className="tier">{quiz.priority}</span>}
      </div>
      <div className="card-title-row">
        <BilingualText item={quiz} field="question" fallback={quiz.question} as="h3" />
        <button className={`icon-button ${bookmarked ? "active" : ""}`} type="button" onClick={() => toggleBookmark("quiz", quiz)} aria-label={ui("bookmarkQuiz")}>★</button>
      </div>

      {options.length > 0 && (
        <div className="option-list">
          {options.map((option) => {
            const correct = correctAnswers.includes(option);
            const chosen = selected.includes(option);
            return (
              <button key={option} type="button" className={`option-button ${chosen ? "selected" : ""} ${checked && correct ? "correct" : ""} ${checked && chosen && !correct ? "wrong" : ""}`} onClick={() => toggleOption(option)}>
                <span>{option}</span>
                {checked && correct && <b>✓</b>}
                {checked && chosen && !correct && <b>×</b>}
              </button>
            );
          })}
        </div>
      )}

      {isText && (
        <div className="calculation-answer">
          <label>{ui("yourAnswer")}<input value={textAnswer} onChange={(e) => { setTextAnswer(e.target.value); setChecked(false); }} placeholder={ui("typeShortAnswer")} /></label>
        </div>
      )}

      <div className="quiz-actions">
        <button className="primary-button" type="button" onClick={checkAnswer} disabled={!isText && selected.length === 0}>{ui("check")}</button>
        {!compact && <button className="secondary-button" type="button" onClick={reset}>{ui("reset")}</button>}
      </div>

      {checked && (
        <div className={`reveal-box ${isCorrect ? "success" : "danger"}`}>
          <p><strong>{isCorrect ? ui("correct") : ui("notYet")}</strong> {ui("answer")}: {correctAnswers.join(", ")}</p>
          {quiz.explanation && <BilingualText item={quiz} field="explanation" fallback={quiz.explanation} as="p" />}
        </div>
      )}
    </article>
  );
}
