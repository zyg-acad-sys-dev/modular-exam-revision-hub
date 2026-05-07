import { useMemo, useState } from "react";
import { getByIds } from "../utils/contentUtils.js";
import { Pill } from "./Pill.jsx";
import { BilingualText, BilingualBlock } from "./BilingualText.jsx";
import { SemanticIcon } from "./SemanticIcon.jsx";
import { FormulaCard } from "./FormulaCard.jsx";
import { FigureCard } from "./FigureCard.jsx";
import { TrapCard } from "./TrapCard.jsx";
import { QuizCard } from "./QuizCard.jsx";
import { AnswerCard } from "./AnswerCard.jsx";
import { ConceptVisualBridge } from "./ConceptVisualBridge.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";


export function ConceptDrawer({
  concept,
  onClose,
  onOpenConcept,
  concepts = [],
  quizzes = [],
  traps = [],
  answers = [],
  formulas = [],
  figures = []
}) {
  const [activeTab, setActiveTab] = useState("memory");
  const { ui } = useLanguage();
  const drawerTabs = [["memory", ui("memoryUnit")], ["exam", ui("exam")], ["practice", ui("practice")], ["links", ui("links")]];

  const related = useMemo(() => {
    if (!concept) return null;
    return {
      traps: getByIds(traps, concept.trapIds || []),
      quizzes: getByIds(quizzes, concept.quizIds || []),
      answers: getByIds(answers, concept.answerIds || []),
      formulas: getByIds(formulas, concept.formulaIds || []),
      figures: getByIds(figures, concept.figureIds || []),
      concepts: getByIds(concepts, concept.relatedConceptIds || [])
    };
  }, [concept, concepts, quizzes, traps, answers, formulas, figures]);

  if (!concept) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside className={`concept-drawer memory-unit-drawer category-${concept.category || "default"}`} onClick={(e) => e.stopPropagation()}>
        <button className="icon-button drawer-close" onClick={onClose} aria-label={ui("closeDrawer")}>×</button>

        <div className="concept-hero">
          <SemanticIcon item={concept} className="hero-icon" />
          <div>
            <div className="eyebrow">{ui("memoryUnit")}</div>
            <BilingualText item={concept} field="title" as="h2" />
            <BilingualText item={concept} field="shortDefinition" fallback={concept.shortDefinition} as="p" className="lead" />
            <div className="pill-row">
              <Pill>{concept.category}</Pill>
              {concept.priority && <Pill tone="gold">{concept.priority}</Pill>}
              {concept.tier && <Pill tone="purple">{`Tier ${concept.tier}`}</Pill>}
            </div>
          </div>
        </div>

        <div className="drawer-tabs" role="tablist" aria-label={ui("contentTabs")}>
          {drawerTabs.map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={activeTab === id} className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)}>{label}</button>
          ))}
        </div>

        {activeTab === "memory" && (
          <div className="drawer-tab-panel">
            <div className="memory-unit-grid">
              {concept.overview && (
                <div className="drawer-block memory-core-block">
                  <h3>{`1. ${ui("coreIdea")}`}</h3>
                  {concept.overview.definition && <BilingualBlock item={concept} field="overview.definition" label={ui("definition")} />}
                  {concept.overview.whyItMatters && <BilingualBlock item={concept} field="overview.whyItMatters" label={ui("whyItMatters")} />}
                  {concept.overview.keyIdea && <BilingualBlock item={concept} field="overview.keyIdea" label={ui("memoryAnchor")} />}
                </div>
              )}

              <ConceptVisualBridge
                concept={concept}
                figures={related.figures}
                formulas={related.formulas}
                traps={related.traps}
              />

              {related.traps.length > 0 && (
                <div className="drawer-block">
                  <h3>{`3. ${ui("trapContrast")}`}</h3>
                  <div className="drawer-mini-stack">
                    {related.traps.slice(0, 3).map((trap) => <TrapCard trap={trap} key={trap.id} compact />)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "exam" && (
          <div className="drawer-tab-panel">
            {concept.exam && (
              <div className="drawer-block accent-block">
                <h3>{ui("examExpression")}</h3>
                {concept.exam.shortAnswer && <BilingualBlock item={concept} field="exam.shortAnswer" label={ui("shortAnswer")} />}
                {concept.exam.examSignals?.length > 0 && (
                  <>
                    <h4>{ui("examSignals")}</h4>
                    <ul>{concept.exam.examSignals.map((signal) => <li key={signal}>{signal}</li>)}</ul>
                  </>
                )}
                {concept.exam.likelyQuestions?.length > 0 && (
                  <>
                    <h4>{ui("likelyQuestions")}</h4>
                    <ul>{concept.exam.likelyQuestions.slice(0, 6).map((q) => <li key={q}>{q}</li>)}</ul>
                  </>
                )}
              </div>
            )}
            {concept.exam?.keywords?.length > 0 && (
              <div className="keyword-row drawer-keywords">{concept.exam.keywords.map((kw) => <span key={kw}>{kw}</span>)}</div>
            )}
          </div>
        )}

        {activeTab === "practice" && (
          <div className="drawer-tab-panel">
            {related.quizzes.length > 0 && (
              <div className="drawer-block">
                <h3>{ui("relatedQuiz")}</h3>
                <div className="drawer-mini-stack">{related.quizzes.slice(0, 3).map((quiz) => <QuizCard quiz={quiz} key={quiz.id} compact />)}</div>
              </div>
            )}
            {related.answers.length > 0 && (
              <div className="drawer-block">
                <h3>{ui("longAnswerBuilder")}</h3>
                <div className="drawer-mini-stack">{related.answers.slice(0, 2).map((answer) => <AnswerCard answer={answer} key={answer.id} compact />)}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === "links" && (
          <div className="drawer-tab-panel">
            <div className="drawer-block">
              <h3>{ui("relatedConcepts")}</h3>
              {related.concepts.length > 0 ? (
                <div className="concept-link-list">
                  {related.concepts.map((item) => (
                    <button key={item.id} type="button" className="concept-link-button" onClick={() => onOpenConcept?.(item)}>
                      <BilingualText item={item} field="title" as="strong" />
                      <BilingualText item={item} field="shortDefinition" fallback={item.shortDefinition} as="span" />
                    </button>
                  ))}
                </div>
              ) : <p>{ui("noLinkedConcepts")}</p>}
            </div>
            {concept.tags?.length > 0 && (
              <div className="drawer-block"><h3>{ui("tags")}</h3><div className="keyword-row">{concept.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
}
