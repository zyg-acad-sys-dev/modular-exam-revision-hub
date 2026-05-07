import { useLookups } from "../hooks/useLookups.js";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { FormulaRenderer } from "../components/FormulaRenderer.jsx";
import { PrintToolbar } from "../components/PrintToolbar.jsx";
import { groupByPrimaryLecture, labelForLecture, sortByWeekThenTitle } from "../utils/printUtils.js";

export function PrintableFormulaSheetPage() {
  const content = useLookups();
  const { ui } = useLanguage();
  const grouped = groupByPrimaryLecture(sortByWeekThenTitle(content.formulas));
  return (
    <div className="print-page">
      <PrintToolbar title={ui("formulaSheet")} subtitle={ui("formulaSheetDesc")} exportPath="/exports/formulas.md" />
      <div className="print-document">
        <header className="print-title-block"><p>{ui("syntheticDemoLearningScience")}</p><h1>{ui("formulaSheet")}</h1><small>{content.formulas.length} {ui("formulasGroupedByModule")}</small></header>
        {Object.entries(grouped).map(([lectureId, formulas]) => (
          <section className="print-section" key={lectureId}><h2>{labelForLecture(content, lectureId)}</h2><div className="print-grid two">{formulas.map((formula) => <article key={formula.id}><h3>{formula.title}</h3><div className="print-formula"><FormulaRenderer latex={formula.latex} /></div>{formula.variables?.length > 0 && <ul className="print-variable-list">{formula.variables.map((v) => <li key={`${formula.id}-${v.symbol}`}><code>{v.symbol}</code>: {v.meaning}</li>)}</ul>}{formula.example && <p><strong>{ui("example")}:</strong> {formula.example}</p>}{formula.examNote && <p><strong>{ui("examNote")}:</strong> {formula.examNote}</p>}</article>)}</div></section>
        ))}
      </div>
    </div>
  );
}
