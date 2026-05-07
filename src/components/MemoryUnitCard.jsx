import { compactText, getByIds } from "../utils/contentUtils.js";
import { BilingualText } from "./BilingualText.jsx";
import { SemanticIcon } from "./SemanticIcon.jsx";
import { FormulaRenderer } from "./FormulaRenderer.jsx";
import { Pill } from "./Pill.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";

function MiniAnchor({ type, count, children }) {
  if (!count) return null;
  return <span className={`mini-anchor ${type}`}>{children} {count}</span>;
}

export function MemoryUnitCard({ concept, onOpen, lookups }) {
  const { ui } = useLanguage();
  const formulas = getByIds(lookups.formulas || [], concept.formulaIds || []);
  const figures = getByIds(lookups.figures || [], concept.figureIds || []);
  const traps = getByIds(lookups.traps || [], concept.trapIds || []);
  const quizzes = getByIds(lookups.quizzes || [], concept.quizIds || []);
  const primaryFormula = formulas[0];
  const primaryFigure = figures[0];
  const memoryCue = concept.visual?.memoryCue || concept.memory?.cue || concept.exam?.shortAnswer || concept.shortDefinition;

  return (
    <button className={`memory-unit-card category-${concept.category || "default"}`} type="button" onClick={() => onOpen?.(concept)}>
      <div className="memory-unit-left">
        <SemanticIcon item={concept} className="memory-unit-icon" />
        <div className="memory-unit-thread" />
      </div>
      <div className="memory-unit-main">
        <div className="memory-unit-topline">
          <Pill tone={concept.priority === "high" ? "gold" : "blue"}>{concept.priority || "normal"}</Pill>
          {concept.tier && <span className="tier">Tier {concept.tier}</span>}
          {concept.category && <span className="category-chip">{concept.category}</span>}
        </div>
        <BilingualText item={concept} field="title" as="h3" />
        <BilingualText item={concept} field="shortDefinition" fallback={compactText(concept.shortDefinition || concept.overview?.definition, 150)} as="p" className="memory-unit-definition" />
        {memoryCue && (
          <div className="memory-cue-strip">
            <span>{ui("memoryAnchor")}</span>
            <BilingualText item={concept} field="visual.memoryCue" fallback={memoryCue} as="strong" />
          </div>
        )}

        {(primaryFigure || primaryFormula) && (
          <div className="memory-bridge-preview">
            {primaryFigure && (
              <div className="bridge-preview-figure">
                <img src={primaryFigure.imagePath} alt={primaryFigure.alt || primaryFigure.title} loading="lazy" />
              </div>
            )}
            {primaryFormula && (
              <div className="bridge-preview-formula">
                <FormulaRenderer latex={primaryFormula.latex} />
              </div>
            )}
          </div>
        )}

        <div className="memory-anchor-row">
          <MiniAnchor type="formula" count={formulas.length}>∑</MiniAnchor>
          <MiniAnchor type="figure" count={figures.length}>▧</MiniAnchor>
          <MiniAnchor type="trap" count={traps.length}>⚠</MiniAnchor>
          <MiniAnchor type="quiz" count={quizzes.length}>?</MiniAnchor>
          {!formulas.length && !figures.length && !traps.length && !quizzes.length && <span className="mini-anchor">{ui("memoryUnit")}</span>}
        </div>
      </div>
    </button>
  );
}
