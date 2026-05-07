import { useState } from "react";
import { FormulaRenderer } from "./FormulaRenderer.jsx";
import { BilingualText } from "./BilingualText.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";

export function FormulaCard({ formula, compact = false }) {
  const [showDetails, setShowDetails] = useState(compact);
  const [showLatex, setShowLatex] = useState(false);
  const { ui } = useLanguage();

  return (
    <article className={`formula-card formula-card-v2 ${compact ? "compact" : ""}`}>
      <div className="semantic-card-head"><span className="semantic-icon formula-icon">∑</span><div><div className="eyebrow">{ui("formula")}</div>{formula.category && <span className="tier">{formula.category}</span>}</div></div>
      <BilingualText item={formula} field="title" fallback={formula.title} as="h3" />
      <div className="rendered-formula-box" aria-label={`${ui("renderedFormulaFor")} ${formula.title}`}><FormulaRenderer latex={formula.latex} /></div>
      {formula.examNote && <div className="exam-note bridge-note"><strong>{ui("examNote")}</strong><BilingualText item={formula} field="examNote" fallback={formula.examNote} as="p" /></div>}
      {!compact && <div className="formula-actions"><button className="secondary-button" type="button" onClick={() => setShowDetails((v) => !v)}>{showDetails ? ui("hideVariables") : ui("showVariablesExample")}</button><button className="secondary-button" type="button" onClick={() => setShowLatex((v) => !v)}>{showLatex ? ui("hideLatex") : ui("showLatex")}</button></div>}
      {showLatex && <pre className="latex-block">{formula.latex}</pre>}
      {showDetails && <div className="formula-details">{formula.variables?.length > 0 && <div className="variable-grid">{formula.variables.map((item) => <div key={`${formula.id}-${item.symbol}`}><FormulaRenderer latex={item.symbol} inline /><span>{item.meaning}</span></div>)}</div>}{formula.example && <p className="formula-example"><strong>{ui("example")}:</strong> {formula.example}</p>}</div>}
    </article>
  );
}
