import { useMemo, useState } from "react";
import { compactText } from "../utils/contentUtils.js";
import { BilingualText } from "./BilingualText.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";

function titleInitials(title = "Figure") {
  return title.split(/\s+/).filter(Boolean).slice(0, 3).map((word) => word[0]?.toUpperCase()).join("") || "FIG";
}

function FigurePlaceholder({ figure, compact = false, ui }) {
  const chips = useMemo(() => {
    const fromTags = figure.tags || [];
    const fromConcepts = figure.relatedConceptIds || [];
    return [...fromTags, ...fromConcepts].slice(0, compact ? 3 : 6);
  }, [figure, compact]);

  return <div className={`figure-placeholder ${compact ? "compact" : ""}`}><div className="figure-placeholder-mark">{titleInitials(figure.title)}</div><div className="figure-placeholder-flow">{chips.length > 0 ? chips.map((chip, idx) => <span key={`${figure.id}-${chip}-${idx}`}>{String(chip).replaceAll("-", " ")}</span>) : <span>{ui("visualCue")}</span>}</div></div>;
}

export function FigureCard({ figure, compact = false }) {
  const [imgError, setImgError] = useState(false);
  const { ui } = useLanguage();
  const hasUsableImage = figure.imagePath && !imgError;

  return (
    <article className={`figure-card figure-card-v2 ${compact ? "compact" : ""}`}>
      <div className="card-topline"><div className="eyebrow">▧ {ui("figureRecognition")}</div><span className="tier">{figure.type || "diagram"}</span></div>
      <div className="figure-preview">{hasUsableImage ? <img src={figure.imagePath} alt={figure.alt || figure.title} onError={() => setImgError(true)} loading="lazy" /> : <FigurePlaceholder figure={figure} compact={compact} ui={ui} />}</div>
      <BilingualText item={figure} field="title" fallback={figure.title} as="h3" />
      {figure.alt && <BilingualText item={figure} field="alt" fallback={compact ? compactText(figure.alt, 120) : figure.alt} as="p" />}
      {figure.keyVisualCue && <div className="visual-cue-box"><strong>{ui("visualCueLabel")}</strong><BilingualText item={figure} field="keyVisualCue" fallback={figure.keyVisualCue} as="span" /></div>}
      {figure.recognitionQuestion && !compact && <div className="recognition-question-box"><strong>{ui("recognitionQuestion")}</strong><BilingualText item={figure} field="recognitionQuestion" fallback={figure.recognitionQuestion} as="span" /></div>}
      {!compact && <div className="keyword-row">{(figure.tags || []).slice(0, 6).map((tag) => <span key={`${figure.id}-${tag}`}>{tag}</span>)}</div>}
    </article>
  );
}
