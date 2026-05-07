import { useLookups } from "../hooks/useLookups.js";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { PrintToolbar } from "../components/PrintToolbar.jsx";
import { groupByPrimaryLecture, labelForLecture, sortByWeekThenTitle } from "../utils/printUtils.js";

export function PrintableLongAnswersPage() {
  const content = useLookups();
  const { ui } = useLanguage();
  const grouped = groupByPrimaryLecture(sortByWeekThenTitle(content.answers));
  return (
    <div className="print-page">
      <PrintToolbar title={ui("longAnswerSheet")} subtitle={ui("longAnswerSheetDesc")} exportPath="/exports/long-answers.md" />
      <div className="print-document">
        <header className="print-title-block"><p>{ui("syntheticDemoLearningScience")}</p><h1>{ui("longAnswerSheet")}</h1><small>{content.answers.length} {ui("answersGroupedByModule")}</small></header>
        {Object.entries(grouped).map(([lectureId, answers]) => (
          <section className="print-section" key={lectureId}>
            <h2>{labelForLecture(content, lectureId)}</h2>
            {answers.map((answer) => (
              <article className="print-answer-block" key={answer.id}>
                <h3>{answer.question}</h3>
                {answer.keywords?.length > 0 && <p><strong>{ui("keywords")}:</strong> {answer.keywords.join(" · ")}</p>}
                {answer.skeleton?.length > 0 && <ol>{answer.skeleton.map((step) => <li key={step}>{step}</li>)}</ol>}
                {answer.fullAnswer && <p className="print-full-answer">{answer.fullAnswer}</p>}
                {answer.commonMistakes?.length > 0 && <p><strong>{ui("commonMistakes")}:</strong> {answer.commonMistakes.join(" | ")}</p>}
              </article>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
