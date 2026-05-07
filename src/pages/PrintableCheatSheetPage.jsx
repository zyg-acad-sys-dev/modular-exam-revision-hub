import { useLookups } from "../hooks/useLookups.js";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { PrintToolbar } from "../components/PrintToolbar.jsx";
import { FormulaRenderer } from "../components/FormulaRenderer.jsx";
import { sortLectures } from "../utils/contentUtils.js";
import { buildReviewCollections } from "../utils/printUtils.js";

export function PrintableCheatSheetPage() {
  const content = useLookups();
  const { ui } = useLanguage();
  const review = buildReviewCollections(content);
  const lectures = sortLectures(content.lectures);
  const moduleRange = lectures.length > 0 ? `${lectures[0].id}-${lectures[lectures.length - 1].id}` : ui("modules");
  const highConcepts = review.coreConcepts.filter((c) => c.priority === "high").slice(0, 36);
  const topAnswers = review.highAnswers.slice(0, 16);
  const topTraps = review.traps.slice(0, 28);
  const topFormulas = review.formulas.slice(0, 18);

  return (
    <div className="print-page">
      <PrintToolbar title={ui("printableCheatSheetTitle")} subtitle={ui("printableCheatSheetSubtitle")} exportPath="/exports/cheat-sheet.md" />
      <div className="print-document">
        <header className="print-title-block"><p>{ui("syntheticDemoLearningScience")}</p><h1>{ui("printableCheatSheet")}</h1><small>{ui("generatedFromModules")} {moduleRange}.</small></header>
        <section className="print-section"><h2>{ui("courseEvolution")}</h2><div className="print-flow">{ui("learningScience")} {"->"} {ui("cognitiveDiagnosis")} {"->"} {ui("aiReadyContentModel")} {"->"} {ui("prototypeEngineering")} {"->"} {ui("personalizedReview")} {"->"} {ui("researchExtension")}</div></section>
        <section className="print-section"><h2>{ui("lastThirtyLines")}</h2><ol className="print-columns two">{review.lastItems.slice(0, 42).map((item) => <li key={item}>{item}</li>)}</ol></section>
        <section className="print-section page-break-avoid"><h2>{ui("coreConcepts")}</h2><div className="print-grid three">{highConcepts.map((concept) => <article key={concept.id}><h3>{concept.title}</h3><p>{concept.shortDefinition || concept.exam?.shortAnswer}</p></article>)}</div></section>
        <section className="print-section"><h2>{ui("formulaAnchors")}</h2><div className="print-grid two">{topFormulas.map((formula) => <article key={formula.id}><h3>{formula.title}</h3><div className="print-formula"><FormulaRenderer latex={formula.latex} /></div>{formula.examNote && <p>{formula.examNote}</p>}</article>)}</div></section>
        <section className="print-section"><h2>{ui("commonTraps")}</h2><div className="print-grid two dense-print-grid">{topTraps.map((trap) => <article key={trap.id}><h3>{ui("wrong")}: {trap.wrong}</h3><p><strong>{ui("correctLabel")}:</strong> {trap.correct}</p>{trap.why && <p><strong>{ui("why")}:</strong> {trap.why}</p>}</article>)}</div></section>
        <section className="print-section"><h2>{ui("highProbabilityLongAnswers")}</h2><div className="print-grid two">{topAnswers.map((answer) => <article key={answer.id}><h3>{answer.question}</h3><ol>{answer.skeleton?.slice(0, 6).map((step) => <li key={step}>{step}</li>)}</ol></article>)}</div></section>
      </div>
    </div>
  );
}
