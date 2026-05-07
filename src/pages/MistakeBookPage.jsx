import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLookups } from "../hooks/useLookups.js";
import { useStudyProgress } from "../content/StudyProgressProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { Section } from "../components/Section.jsx";
import { QuizCard } from "../components/QuizCard.jsx";
import { TrapCard } from "../components/TrapCard.jsx";
import { FormulaCard } from "../components/FormulaCard.jsx";
import { FigureCard } from "../components/FigureCard.jsx";
import { AnswerCard } from "../components/AnswerCard.jsx";

function getItem(content, type, id) {
  if (type === "quiz") return content.quizById[id];
  if (type === "trap") return content.trapById[id];
  if (type === "formula") return content.formulaById[id];
  if (type === "figure") return content.figureById[id];
  if (type === "answer") return content.answerById[id];
  return null;
}

function renderItem(type, item) {
  if (!item) return null;
  if (type === "quiz") return <QuizCard quiz={item} compact />;
  if (type === "trap") return <TrapCard trap={item} />;
  if (type === "formula") return <FormulaCard formula={item} />;
  if (type === "figure") return <FigureCard figure={item} />;
  if (type === "answer") return <AnswerCard answer={item} />;
  return null;
}

export function MistakeBookPage() {
  const content = useLookups();
  const { ui } = useLanguage();
  const { progress, resetProgress } = useStudyProgress();

  const wrongQuizzes = useMemo(() => Object.values(progress.attempts || {})
    .filter((a) => a.type === "quiz" && a.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong || new Date(b.lastSeenAt) - new Date(a.lastSeenAt)), [progress.attempts]);

  const weakReviews = useMemo(() => Object.values(progress.reviews || {})
    .filter((r) => ["again", "hard"].includes(r.rating))
    .sort((a, b) => new Date(b.lastSeenAt) - new Date(a.lastSeenAt)), [progress.reviews]);

  const bookmarks = useMemo(() => Object.values(progress.bookmarks || {}).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [progress.bookmarks]);

  return (
    <div className="page-stack">
      <header className="hero-panel compact theme-orange">
        <div className="eyebrow">{ui("mistakeBook")}</div>
        <h1>{ui("wrongAnswersWeakSaved")}</h1>
        <p>{ui("localOnlyProgress")}</p>
      </header>

      <Section title={ui("progressSummary")} eyebrow={ui("localMemory")}>
        <div className="stats-grid">
          <div className="stat-card"><span>{wrongQuizzes.length}</span><p>{ui("quizItemsWithMistakes")}</p></div>
          <div className="stat-card"><span>{weakReviews.length}</span><p>{ui("againHardReviewCards")}</p></div>
          <div className="stat-card"><span>{bookmarks.length}</span><p>{ui("savedCardsLabel")}</p></div>
        </div>
        <button className="secondary-button" type="button" onClick={resetProgress}>{ui("resetLocalProgress")}</button>
      </Section>

      <Section title={ui("wrongQuizAnswers")} eyebrow={ui("fixTheseFirst")}>
        <div className="card-grid two">
          {wrongQuizzes.map((entry) => {
            const quiz = content.quizById[entry.id];
            if (!quiz) return null;
            return (
              <article className="mistake-wrap" key={entry.id}>
                <div className="queue-meta"><span className="tier danger">{ui("wrongTimes")} {entry.wrong}</span><span className="tier">{ui("correctTimes")} {entry.correct}</span></div>
                <QuizCard quiz={quiz} compact />
              </article>
            );
          })}
        </div>
      </Section>

      <Section title={ui("againHardReviewCards")} eyebrow={ui("weakRecall")}>
        <div className="card-grid two">
          {weakReviews.map((entry) => {
            const item = getItem(content, entry.type, entry.id);
            return <article className="mistake-wrap" key={`${entry.type}:${entry.id}`}>{renderItem(entry.type, item)}</article>;
          })}
        </div>
      </Section>

      <Section title={ui("savedCardsLabel")} eyebrow={ui("manualBookmarks")}>
        <div className="search-results">
          {bookmarks.map((b) => (
            <Link className="search-result" to="/study" key={`${b.type}:${b.id}`}>
              <span>{b.type}</span><h3>{b.title}</h3><p>{b.category}</p>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
