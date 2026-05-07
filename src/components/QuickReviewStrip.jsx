import { Link } from "react-router-dom";
import { useLanguage } from "../content/LanguageProvider.jsx";

export function QuickReviewStrip({ lecture, related }) {
  const { ui } = useLanguage();
  const previous = lecture?.buildsOn?.[0];
  const next = lecture?.leadsTo?.[0];
  return (
    <div className="quick-review-strip">
      <div>
        <span className="eyebrow">{ui("thisRoom")}</span>
        <strong>{lecture?.coreConceptIds?.length || 0} {ui("memoryUnit")} · {related?.quizzes?.length || 0} {ui("quiz")} · {related?.traps?.length || 0} {ui("traps")}</strong>
      </div>
      <div className="quick-review-actions">
        {previous && <Link className="secondary-button" to={`/module/${previous}`}>← {previous.toUpperCase()}</Link>}
        <Link className="secondary-button" to="/review">{ui("reviewHubShort")}</Link>
        {next && <Link className="primary-button" to={`/module/${next}`}>{next.toUpperCase()} →</Link>}
      </div>
    </div>
  );
}
