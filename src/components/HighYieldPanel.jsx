import { BilingualText } from "./BilingualText.jsx";
import { FormulaRenderer } from "./FormulaRenderer.jsx";
import { SemanticIcon } from "./SemanticIcon.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";

function PanelList({ title, items, renderItem, empty }) {
  return <div className="yield-block"><h3>{title}</h3>{items.length > 0 ? <div className="yield-list">{items.map(renderItem)}</div> : <p className="muted-text">{empty}</p>}</div>;
}

export function HighYieldPanel({ lecture, related, onOpenConcept }) {
  const { ui } = useLanguage();
  const highConcepts = related.concepts.filter((c) => c.priority === "high").slice(0, 6);
  const firstTraps = related.traps.slice(0, 4);
  const firstFormulas = related.formulas.slice(0, 3);
  const firstFigures = related.figures.slice(0, 3);
  const empty = ui("noItems") || "";

  return (
    <aside className="high-yield-panel">
      <div className="yield-header"><span className="semantic-icon">★</span><div><div className="eyebrow">{ui("highYieldPanel")}</div><h2>{ui("grabThisPageFirst")}</h2></div></div>
      <PanelList title={ui("mustKnow")} items={highConcepts} empty={empty} renderItem={(concept) => <button key={concept.id} className="yield-concept" type="button" onClick={() => onOpenConcept?.(concept)}><SemanticIcon item={concept} /><span><BilingualText item={concept} field="title" as="strong" /></span></button>} />
      <PanelList title={ui("trapFocus")} items={firstTraps} empty={empty} renderItem={(trap) => <div key={trap.id} className="yield-trap"><span>⚠</span><BilingualText item={trap} field="wrong" fallback={trap.wrong} as="strong" /></div>} />
      <PanelList title={ui("formulaFocus")} items={firstFormulas} empty={empty} renderItem={(formula) => <div key={formula.id} className="yield-formula"><FormulaRenderer latex={formula.latex} /></div>} />
      <PanelList title={ui("figureFocus")} items={firstFigures} empty={empty} renderItem={(figure) => <div key={figure.id} className="yield-figure"><img src={figure.imagePath} alt={figure.alt || figure.title} loading="lazy" /><BilingualText item={figure} field="title" fallback={figure.title} as="span" /></div>} />
      {lecture.examSignals?.length > 0 && <div className="yield-block"><h3>{ui("examSignals")}</h3><ul className="yield-bullets">{lecture.examSignals.slice(0, 5).map((signal) => <li key={signal}>{signal}</li>)}</ul></div>}
    </aside>
  );
}
