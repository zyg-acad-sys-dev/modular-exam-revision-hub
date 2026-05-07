import { useState } from "react";
import { BilingualText } from "./BilingualText.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";

export function AnswerCard({ answer, compact = false }) {
  const [expanded, setExpanded] = useState(compact);
  const { ui } = useLanguage();

  return (
    <article className={`answer-card answer-card-v2 ${expanded ? "expanded" : ""} ${compact ? "compact" : ""}`}>
      <div className="eyebrow">{ui("longAnswer")}</div>
      <BilingualText item={answer} field="question" fallback={answer.question} as="h3" />
      {answer.keywords?.length > 0 && (
        <div className="keyword-row">
          {answer.keywords.slice(0, expanded ? 18 : 8).map((keyword) => <span key={keyword}>{keyword}</span>)}
        </div>
      )}
      {answer.skeleton?.length > 0 && (
        <ol className="answer-skeleton">
          {answer.skeleton.slice(0, expanded ? undefined : 5).map((step) => <li key={step}>{step}</li>)}
        </ol>
      )}
      {expanded && answer.fullAnswer && (
        <div className="full-answer-box">
          <strong>{ui("fullAnswer")}</strong>
          <BilingualText item={answer} field="fullAnswer" fallback={answer.fullAnswer} as="p" />
        </div>
      )}
      {answer.commonMistakes?.length > 0 && expanded && (
        <div className="mini-card danger"><strong>{ui("commonMistakes")}</strong><ul>{answer.commonMistakes.map((mistake) => <li key={mistake}>{mistake}</li>)}</ul></div>
      )}
      {!compact && <button className="secondary-button" type="button" onClick={() => setExpanded((v) => !v)}>{expanded ? ui("collapse") : ui("buildFullAnswer")}</button>}
    </article>
  );
}
