import { compactText } from "../utils/contentUtils.js";
import { Pill } from "./Pill.jsx";
import { BilingualText } from "./BilingualText.jsx";
import { SemanticIcon } from "./SemanticIcon.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";

export function ConceptCard({ concept, onOpen }) {
  const { ui } = useLanguage();
  const signalCount = (concept.formulaIds?.length || 0) + (concept.figureIds?.length || 0) + (concept.trapIds?.length || 0) + (concept.quizIds?.length || 0);
  return (
    <button className={`concept-card semantic-card concept-card-v2 category-${concept.category || "default"}`} onClick={() => onOpen?.(concept)}>
      <div className="card-type-ribbon" />
      <div className="semantic-card-head">
        <SemanticIcon item={concept} />
        <div className="card-topline compact">
          <Pill tone={concept.priority === "high" ? "gold" : "blue"}>{concept.priority || "normal"}</Pill>
          {concept.tier && <span className="tier">Tier {concept.tier}</span>}
        </div>
      </div>
      <BilingualText item={concept} field="title" as="h3" />
      <BilingualText item={concept} field="shortDefinition" fallback={compactText(concept.shortDefinition || concept.overview?.definition, 140)} as="p" />
      <div className="concept-signal-row" aria-label={ui("relatedMemoryAnchors")}>
        {concept.formulaIds?.length > 0 && <span>∑ {concept.formulaIds.length}</span>}
        {concept.figureIds?.length > 0 && <span>▧ {concept.figureIds.length}</span>}
        {concept.trapIds?.length > 0 && <span>⚠ {concept.trapIds.length}</span>}
        {concept.quizIds?.length > 0 && <span>? {concept.quizIds.length}</span>}
        {signalCount === 0 && <span>{ui("memoryUnitFallback")}</span>}
      </div>
    </button>
  );
}
