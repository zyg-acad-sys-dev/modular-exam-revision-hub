import { useMemo, useState } from "react";
import { useContent } from "../content/ContentProvider.jsx";
import { useStudyProgress } from "../content/StudyProgressProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { Section } from "../components/Section.jsx";
import { QuizCard } from "../components/QuizCard.jsx";
import { TrapCard } from "../components/TrapCard.jsx";
import { FormulaCard } from "../components/FormulaCard.jsx";
import { FigureCard } from "../components/FigureCard.jsx";
import { AnswerCard } from "../components/AnswerCard.jsx";
import { ReviewActionBar } from "../components/ReviewActionBar.jsx";
import { compactText } from "../utils/contentUtils.js";

const typeOrder = ["quiz", "trap", "formula", "figure", "answer"];

function keyFor(type, id) {
  return `${type}:${id}`;
}

function priorityScore(item = {}) {
  if (item.priority === "high") return 0;
  if (item.priority === "medium") return 1;
  return 2;
}

function makeItems(content) {
  return [
    ...content.quizzes.map((item) => ({ type: "quiz", item })),
    ...content.traps.map((item) => ({ type: "trap", item })),
    ...content.formulas.map((item) => ({ type: "formula", item })),
    ...content.figures.map((item) => ({ type: "figure", item })),
    ...content.answers.map((item) => ({ type: "answer", item }))
  ];
}

function dueScore(entry, type, item) {
  const review = entry?.review;
  const attempt = entry?.attempt;
  if (attempt && attempt.wrong > 0 && !attempt.lastCorrect) return -20;
  if (!review) return priorityScore(item);
  const dueAt = review.dueAt ? new Date(review.dueAt).getTime() : 0;
  const now = Date.now();
  if (dueAt <= now) return -10 + priorityScore(item);
  return 20 + dueAt / 1000000000000;
}

function renderReviewCard(type, item) {
  if (type === "quiz") return <QuizCard quiz={item} compact />;
  if (type === "trap") return <TrapCard trap={item} />;
  if (type === "formula") return <FormulaCard formula={item} />;
  if (type === "figure") return <FigureCard figure={item} />;
  if (type === "answer") return <AnswerCard answer={item} />;
  return <p>{item.title || item.id}</p>;
}

export function SpacedReviewPage() {
  const content = useContent();
  const { ui } = useLanguage();
  const { progress, rateReviewItem } = useStudyProgress();
  const [typeFilter, setTypeFilter] = useState("all");
  const [limit, setLimit] = useState(20);

  const queue = useMemo(() => {
    return makeItems(content)
      .map(({ type, item }) => {
        const key = keyFor(type, item.id);
        return {
          type,
          item,
          review: progress.reviews?.[key],
          attempt: progress.attempts?.[key]
        };
      })
      .filter((entry) => typeFilter === "all" || entry.type === typeFilter)
      .sort((a, b) => {
        const score = dueScore(a, a.type, a.item) - dueScore(b, b.type, b.item);
        if (score !== 0) return score;
        return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
      })
      .slice(0, limit);
  }, [content, progress, typeFilter, limit]);

  const dueCount = useMemo(() => {
    const now = Date.now();
    return Object.values(progress.reviews || {}).filter((r) => !r.dueAt || new Date(r.dueAt).getTime() <= now).length;
  }, [progress.reviews]);

  return (
    <div className="page-stack">
      <header className="hero-panel compact theme-gold">
        <div className="eyebrow">{ui("spacedReview")}</div>
        <h1>{ui("spacedReviewTitle")}</h1>
        <p>{ui("spacedReviewIntro")}</p>
      </header>

      <Section title={ui("queueControls")} eyebrow={`${queue.length} ${ui("cardsShown")} · ${dueCount} ${ui("dueSavedReviews")}`}>
        <div className="toolbar">
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">{ui("allReviewTypes")}</option>
            <option value="quiz">{ui("quizOnly")}</option>
            <option value="trap">{ui("trapsOnly")}</option>
            <option value="formula">{ui("formulasOnly")}</option>
            <option value="figure">{ui("figuresOnly")}</option>
            <option value="answer">{ui("longAnswersOnly")}</option>
          </select>
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
            <option value={10}>10 cards</option>
            <option value={20}>20 cards</option>
            <option value={40}>40 cards</option>
            <option value={80}>80 cards</option>
          </select>
        </div>
      </Section>

      <div className="review-queue">
        {queue.map(({ type, item, review, attempt }) => (
          <article className="review-queue-item" key={`${type}:${item.id}`}>
            <div className="queue-meta">
              <span className="eyebrow">{type}</span>
              {item.priority && <span className="tier">{item.priority}</span>}
              {attempt?.wrong > 0 && <span className="tier danger">{ui("wrongTimes")} {attempt.wrong}</span>}
              {review?.rating && <span className="tier">{ui("lastRating")} {review.rating}</span>}
            </div>
            <h3>{item.title || item.question || compactText(item.wrong, 80)}</h3>
            {renderReviewCard(type, item)}
            {type !== "quiz" && <ReviewActionBar type={type} item={item} />}
            {type === "quiz" && (
              <div className="review-action-bar">
                <button type="button" className="tiny-button danger" onClick={() => rateReviewItem(type, item, "again")}>{ui("scheduleAgain")}</button>
                <button type="button" className="tiny-button success" onClick={() => rateReviewItem(type, item, "good")}>{ui("scheduleGood")}</button>
                <button type="button" className="tiny-button gold" onClick={() => rateReviewItem(type, item, "easy")}>{ui("scheduleEasy")}</button>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
