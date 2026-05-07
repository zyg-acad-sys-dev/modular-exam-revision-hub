import { useLookups } from "../hooks/useLookups.js";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { PrintToolbar } from "../components/PrintToolbar.jsx";
import { groupByPrimaryLecture, labelForLecture, sortByWeekThenTitle } from "../utils/printUtils.js";

function answerText(quiz, ui) {
  if (quiz.correctAnswers) return quiz.correctAnswers.join("; ");
  return quiz.correctAnswer || ui("seeExplanation");
}

export function PrintableQuizSheetPage() {
  const content = useLookups();
  const { ui } = useLanguage();
  const grouped = groupByPrimaryLecture(sortByWeekThenTitle(content.quizzes));
  return (
    <div className="print-page">
      <PrintToolbar title={ui("offlineQuizSheet")} subtitle={ui("questionPagesFirst")} exportPath="/exports/quiz-sheet.md" />
      <div className="print-document">
        <header className="print-title-block"><p>{ui("syntheticDemoLearningScience")}</p><h1>{ui("offlineQuizSheet")}</h1><small>{content.quizzes.length} {ui("quizGroupedByModule")}</small></header>
        {Object.entries(grouped).map(([lectureId, quizzes]) => (
          <section className="print-section" key={lectureId}>
            <h2>{labelForLecture(content, lectureId)}</h2>
            {quizzes.map((quiz, idx) => (
              <article className="print-quiz-block" key={quiz.id}>
                <h3>{idx + 1}. {quiz.question}</h3>
                {quiz.options?.length > 0 && <ol type="A">{quiz.options.map((option) => <li key={option}>{option}</li>)}</ol>}
                <div className="print-answer-space" />
              </article>
            ))}
          </section>
        ))}
        <section className="print-section page-break-before">
          <h2>{ui("answerKey")}</h2>
          {Object.entries(grouped).map(([lectureId, quizzes]) => (
            <div key={`${lectureId}-answers`}><h3>{labelForLecture(content, lectureId)}</h3><ol>{quizzes.map((quiz) => <li key={`${quiz.id}-answer`}><strong>{answerText(quiz, ui)}</strong>{quiz.explanation && <span> — {quiz.explanation}</span>}</li>)}</ol></div>
          ))}
        </section>
      </div>
    </div>
  );
}
