import { FormulaCard } from "./FormulaCard.jsx";
import { FigureCard } from "./FigureCard.jsx";
import { TrapCard } from "./TrapCard.jsx";
import { BilingualText } from "./BilingualText.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";

export function ConceptVisualBridge({ concept, figures = [], formulas = [], traps = [] }) {
  const primaryFigure = figures[0];
  const primaryFormula = formulas[0];
  const primaryTrap = traps[0];
  const { ui } = useLanguage();

  if (!primaryFigure && !primaryFormula && !primaryTrap && !concept?.visual?.memoryCue) return null;

  return (
    <div className="concept-visual-bridge">
      <div className="bridge-title-row">
        <span className="semantic-icon">⌁</span>
        <div>
          <h3>{ui("visualMemoryBridge")}</h3>
          {concept.visual?.memoryCue && <BilingualText item={concept} field="visual.memoryCue" fallback={concept.visual.memoryCue} as="p" />}
        </div>
      </div>
      <div className="bridge-triad">
        {primaryFigure && (
          <div className="bridge-cell figure-cell">
            <div className="bridge-label">{ui("figure")}</div>
            <FigureCard figure={primaryFigure} compact />
          </div>
        )}
        {primaryFormula && (
          <div className="bridge-cell formula-cell">
            <div className="bridge-label">{ui("formula")}</div>
            <FormulaCard formula={primaryFormula} compact />
          </div>
        )}
        {primaryTrap && (
          <div className="bridge-cell trap-cell">
            <div className="bridge-label">{ui("trap")}</div>
            <TrapCard trap={primaryTrap} compact />
          </div>
        )}
      </div>
    </div>
  );
}
