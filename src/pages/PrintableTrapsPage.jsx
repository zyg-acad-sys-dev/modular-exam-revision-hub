import { useLookups } from "../hooks/useLookups.js";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { PrintToolbar } from "../components/PrintToolbar.jsx";
import { groupByPrimaryLecture, labelForLecture, sortByWeekThenTitle } from "../utils/printUtils.js";

export function PrintableTrapsPage() {
  const content = useLookups();
  const { ui } = useLanguage();
  const grouped = groupByPrimaryLecture(sortByWeekThenTitle(content.traps));
  return (
    <div className="print-page">
      <PrintToolbar title={ui("trapSheet")} subtitle={ui("wrongCorrectionWhy")} exportPath="/exports/traps.md" />
      <div className="print-document">
        <header className="print-title-block"><p>{ui("syntheticDemoLearningScience")}</p><h1>{ui("trapSheet")}</h1><small>{content.traps.length} {ui("trapsGroupedByModule")}</small></header>
        {Object.entries(grouped).map(([lectureId, traps]) => (
          <section className="print-section" key={lectureId}>
            <h2>{labelForLecture(content, lectureId)}</h2>
            <div className="print-grid two dense-print-grid">
              {traps.map((trap) => <article key={trap.id}><h3>{ui("wrong")}: {trap.wrong}</h3><p><strong>{ui("correctLabel")}:</strong> {trap.correct}</p>{trap.why && <p><strong>{ui("why")}:</strong> {trap.why}</p>}</article>)}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
