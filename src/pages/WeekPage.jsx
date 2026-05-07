import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLookups } from "../hooks/useLookups.js";
import { useMemoryMode } from "../content/MemoryModeProvider.jsx";
import { getByIds, colorClass } from "../utils/contentUtils.js";
import { Section } from "../components/Section.jsx";
import { ConceptCard } from "../components/ConceptCard.jsx";
import { MemoryUnitCard } from "../components/MemoryUnitCard.jsx";
import { HighYieldPanel } from "../components/HighYieldPanel.jsx";
import { ConceptDrawer } from "../components/ConceptDrawer.jsx";
import { TrapCard } from "../components/TrapCard.jsx";
import { QuizCard } from "../components/QuizCard.jsx";
import { FormulaCard } from "../components/FormulaCard.jsx";
import { FigureCard } from "../components/FigureCard.jsx";
import { AnswerCard } from "../components/AnswerCard.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { TabbedPanel } from "../components/TabbedPanel.jsx";
import { VisualConceptMap } from "../components/VisualConceptMap.jsx";
import { QuickReviewStrip } from "../components/QuickReviewStrip.jsx";
import { BilingualText } from "../components/BilingualText.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";

export function WeekPage() {
  const { weekId } = useParams();
  const content = useLookups();
  const { mode, setModeKey } = useMemoryMode();
  const { ui } = useLanguage();
  const [selectedConcept, setSelectedConcept] = useState(null);

  const lecture = content.lectureById[weekId];

  const related = useMemo(() => {
    if (!lecture) return null;
    return {
      concepts: getByIds(content.concepts, lecture.coreConceptIds),
      traps: getByIds(content.traps, lecture.trapIds),
      quizzes: getByIds(content.quizzes, lecture.quizIds),
      answers: getByIds(content.answers, lecture.answerIds),
      formulas: getByIds(content.formulas, lecture.formulaIds),
      figures: getByIds(content.figures, lecture.figureIds)
    };
  }, [lecture, content]);

  const conceptsById = useMemo(() => {
    const result = {};
    for (const concept of content.concepts) result[concept.id] = concept;
    return result;
  }, [content.concepts]);

  if (!lecture) {
    return <EmptyState title={ui("moduleNotFound")} message={`${ui("noModuleExists")} ${weekId}.`} />;
  }

  const tabs = [
    {
      id: "concepts",
      label: ui("memoryUnit"),
      count: related.concepts.length,
      render: () => (
        <Section title={ui("conceptMemoryUnits")} eyebrow={ui("conceptMemoryUnitsEyebrow")} subtitle={ui("conceptMemoryUnitsSubtitle")}>
          <div className="memory-unit-list">
            {related.concepts.map((concept) => (
              <MemoryUnitCard concept={concept} onOpen={setSelectedConcept} lookups={content} key={concept.id} />
            ))}
          </div>
        </Section>
      )
    },
    {
      id: "quiz",
      label: ui("quiz"),
      count: related.quizzes.length,
      render: () => (
        <Section title={ui("miniQuiz")} eyebrow={ui("activeRecall")} subtitle={ui("miniQuizSubtitle")}>
          <div className="card-grid two">
            {related.quizzes.map((quiz) => <QuizCard quiz={quiz} key={quiz.id} />)}
          </div>
        </Section>
      )
    },
    {
      id: "traps",
      label: ui("traps"),
      count: related.traps.length,
      render: () => (
        <Section title={ui("commonTraps")} eyebrow={ui("doNotFall")} subtitle={ui("commonTrapsSubtitle")}>
          <div className="card-grid two">
            {related.traps.map((trap) => <TrapCard trap={trap} key={trap.id} />)}
          </div>
        </Section>
      )
    },
    {
      id: "figures",
      label: ui("figures"),
      count: related.figures.length,
      render: () => (
        <Section title={ui("figureRecognition")} eyebrow={ui("visualRecall")} subtitle={ui("figureRecognitionSubtitle")}>
          <div className="card-grid two figure-grid">
            {related.figures.length > 0 ? related.figures.map((figure) => <FigureCard figure={figure} key={figure.id} />) : <EmptyState message={ui("noFiguresModule")} />}
          </div>
        </Section>
      )
    },
    {
      id: "formulas",
      label: ui("formulas"),
      count: related.formulas.length,
      render: () => (
        <Section title={ui("formulaCards")} eyebrow={ui("mathAnchors")} subtitle={ui("formulaCardsSubtitle")}>
          <div className="card-grid two">
            {related.formulas.length > 0 ? related.formulas.map((formula) => <FormulaCard formula={formula} key={formula.id} />) : <EmptyState message={ui("noFormulasModule")} />}
          </div>
        </Section>
      )
    },
    {
      id: "answers",
      label: ui("answer"),
      count: related.answers.length,
      render: () => (
        <Section title={ui("longAnswerBuilder")} eyebrow={ui("longFormReviewPrep")} subtitle={ui("longAnswerSubtitle")}>
          <div className="card-grid two">
            {related.answers.map((answer) => <AnswerCard answer={answer} key={answer.id} />)}
          </div>
        </Section>
      )
    }
  ];

  const activeTab = tabs.some((tab) => tab.id === mode.activeWeekTab) ? mode.activeWeekTab : "concepts";

  return (
    <div className="page-stack week-study-page">
      <header className={`hero-panel compact ${colorClass(lecture.color)}`}>
        <div className="breadcrumb"><Link to="/">{ui("courseMap")}</Link> / {lecture.id.replace("w", "M").toUpperCase()}</div>
        <BilingualText item={lecture} field="title" as="h1" />
        <BilingualText item={lecture} field="subtitle" as="p" />
        {lecture.mainQuestion && <BilingualText item={lecture} field="mainQuestion" as="p" className="hero-question" />}
      </header>

      <div className="week-synthesis-grid">
        <Section
          title={lecture.visualMap?.title || ui("visualMemoryMap")}
          eyebrow={ui("structuredOverview")}
          subtitle={lecture.visualMap?.note}
          className="visual-overview-section"
        >
          <VisualConceptMap
            visualMap={lecture.visualMap}
            conceptsById={conceptsById}
            onOpenConcept={setSelectedConcept}
          />
          <QuickReviewStrip lecture={lecture} related={related} />
        </Section>
        <HighYieldPanel lecture={lecture} related={related} onOpenConcept={setSelectedConcept} />
      </div>

      <div className="week-tab-shell">
        <TabbedPanel
          tabs={tabs}
          activeTab={activeTab}
          onChange={(tabId) => setModeKey("activeWeekTab", tabId)}
          ariaLabel={`${lecture.id} study tabs`}
        />
      </div>

      <ConceptDrawer
        concept={selectedConcept}
        onClose={() => setSelectedConcept(null)}
        onOpenConcept={setSelectedConcept}
        concepts={content.concepts}
        quizzes={content.quizzes}
        traps={content.traps}
        answers={content.answers}
        formulas={content.formulas}
        figures={content.figures}
      />
    </div>
  );
}
