import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useLookups } from "../hooks/useLookups.js";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { getByIds } from "../utils/contentUtils.js";
import { Section } from "../components/Section.jsx";
import { AnswerCard } from "../components/AnswerCard.jsx";
import { FormulaCard } from "../components/FormulaCard.jsx";
import { TrapCard } from "../components/TrapCard.jsx";

function groupReviewPatches(patches = []) {
  const sections = {};
  for (const patch of patches) {
    const section = sections[patch.section] || { addConceptIds: [], addAnswerIds: [], addFormulaIds: [], addTrapIds: [], addFigureIds: [], addItems: [] };
    for (const key of Object.keys(section)) section[key].push(...(patch[key] || []));
    sections[patch.section] = section;
  }
  for (const section of Object.values(sections)) for (const key of Object.keys(section)) section[key] = [...new Set(section[key])];
  return sections;
}

export function ReviewPage() {
  const content = useLookups();
  const { ui } = useLanguage();
  const sections = useMemo(() => groupReviewPatches(content.reviewPatches), [content.reviewPatches]);
  const coreConcepts = getByIds(content.concepts, sections["core-topics"]?.addConceptIds).slice(0, 30);
  const highAnswers = getByIds(content.answers, sections["high-probability-long-answers"]?.addAnswerIds);
  const formulas = getByIds(content.formulas, sections["calculation-sheet"]?.addFormulaIds);
  const traps = getByIds(content.traps, sections["common-traps"]?.addTrapIds);
  const lastItems = sections["last-30-minute-review"]?.addItems || [];
  return (
    <div className="page-stack">
      <header className="hero-panel compact theme-gold"><div className="eyebrow">{ui("reviewHub")}</div><h1>{ui("revisionSynthesisPage")}</h1><p>{ui("compressedReviewBuilt")}</p></header>
      <Section title={ui("systemEvolutionMap")} eyebrow={ui("bigPicture")}><div className="visual-flow big"><span>{ui("learningScience")} <b>→</b></span><span>{ui("cognitiveDiagnosis")} <b>→</b></span><span>{ui("aiReadyContentModel")} <b>→</b></span><span>{ui("prototypeEngineering")} <b>→</b></span><span>{ui("personalizedReview")} <b>→</b></span><span>{ui("researchExtension")}</span></div></Section>
      <Section title={ui("coreTopics")} eyebrow={ui("jumpList")}><div className="inline-link-grid dense">{coreConcepts.map((concept) => <Link to="/search" key={concept.id}>{concept.title}</Link>)}</div></Section>
      <Section title={ui("last30")} eyebrow={ui("readTheseAloud")}><div className="review-list">{lastItems.slice(0, 40).map((item) => <p key={item}>{item}</p>)}</div></Section>
      <Section title={ui("highProbabilityLongAnswers")} eyebrow={ui("longFormReview")}><div className="card-grid two">{highAnswers.map((answer) => <AnswerCard answer={answer} key={answer.id} />)}</div></Section>
      <Section title={ui("calculationSheet")} eyebrow={ui("formulaAnchors")}><div className="card-grid two">{formulas.map((formula) => <FormulaCard formula={formula} key={formula.id} />)}</div></Section>
      <Section title={ui("commonTraps")} eyebrow={ui("avoidCommonDesignErrors")}><div className="card-grid two">{traps.slice(0, 20).map((trap) => <TrapCard trap={trap} key={trap.id} />)}</div></Section>
    </div>
  );
}
