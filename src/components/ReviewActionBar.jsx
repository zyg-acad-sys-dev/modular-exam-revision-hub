import { useStudyProgress } from "../content/StudyProgressProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";

export function ReviewActionBar({ type, item }) {
  const { rateReviewItem, toggleBookmark, isBookmarked } = useStudyProgress();
  const { ui } = useLanguage();
  if (!item?.id) return null;
  const bookmarked = isBookmarked(type, item.id);

  return (
    <div className="review-action-bar">
      <button type="button" className="tiny-button danger" onClick={() => rateReviewItem(type, item, "again")}>{ui("again")}</button>
      <button type="button" className="tiny-button" onClick={() => rateReviewItem(type, item, "hard")}>{ui("hard")}</button>
      <button type="button" className="tiny-button success" onClick={() => rateReviewItem(type, item, "good")}>{ui("good")}</button>
      <button type="button" className="tiny-button gold" onClick={() => rateReviewItem(type, item, "easy")}>{ui("easy")}</button>
      <button type="button" className={`tiny-button ${bookmarked ? "active" : ""}`} onClick={() => toggleBookmark(type, item)}>{bookmarked ? ui("saved") : ui("save")}</button>
    </div>
  );
}
