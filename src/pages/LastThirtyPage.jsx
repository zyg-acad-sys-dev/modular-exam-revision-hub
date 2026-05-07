import { useMemo } from "react";
import { useLookups } from "../hooks/useLookups.js";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { getByIds } from "../utils/contentUtils.js";
import { Section } from "../components/Section.jsx";
import { TrapCard } from "../components/TrapCard.jsx";
import { FormulaCard } from "../components/FormulaCard.jsx";
import { AnswerCard } from "../components/AnswerCard.jsx";
import { FigureCard } from "../components/FigureCard.jsx";

function groupReviewPatches(patches = []) {
  const sections = {};
  for (const patch of patches) {
    const section = sections[patch.section] || {
      addConceptIds: [], addAnswerIds: [], addFormulaIds: [], addTrapIds: [], addFigureIds: [], addItems: []
    };
    for (const key of Object.keys(section)) section[key].push(...(patch[key] || []));
    sections[patch.section] = section;
  }
  for (const section of Object.values(sections)) for (const key of Object.keys(section)) section[key] = [...new Set(section[key])];
  return sections;
}

export function LastThirtyPage() {
  const content = useLookups();
  const { ui } = useLanguage();
  const sections = useMemo(() => groupReviewPatches(content.reviewPatches), [content.reviewPatches]);
  const lastItems = sections["last-30-minute-review"]?.addItems || [];
  const traps = getByIds(content.traps, sections["common-traps"]?.addTrapIds).slice(0, 12);
  const formulas = getByIds(content.formulas, sections["calculation-sheet"]?.addFormulaIds).slice(0, 10);
  const answers = getByIds(content.answers, sections["high-probability-long-answers"]?.addAnswerIds).slice(0, 8);
  const figures = getByIds(content.figures, sections["figure-recognition"]?.addFigureIds).slice(0, 8);

  return (
    <div className="page-stack">
      <header className="hero-panel compact theme-gold">
        <div className="eyebrow">{ui("last30")}</div>
        <h1>{ui("readRecallStop")}</h1>
        <p>{ui("lastThirtyCompressedIntro")}</p>
      </header>

      <Section title={ui("readTheseAloud")} eyebrow={ui("coreMemoryLines")}>
        <div className="last30-list">
          {lastItems.slice(0, 50).map((item, idx) => (
            <div className="last30-item" key={`${idx}-${item}`}><b>{idx + 1}</b><p>{item}</p></div>
          ))}
        </div>
      </Section>

      <Section title={ui("noFreeMarkTraps")} eyebrow={ui("doNotConfuseThese")}>
        <div className="card-grid two">{traps.map((trap) => <TrapCard trap={trap} key={trap.id} />)}</div>
      </Section>

      <Section title={ui("formulaAnchors")} eyebrow={ui("oneGlanceRecall")}>
        <div className="card-grid two">{formulas.map((formula) => <FormulaCard formula={formula} key={formula.id} />)}</div>
      </Section>

      <Section title={ui("figureRecognitionAnchors")} eyebrow={ui("visualQuestions")}>
        <div className="card-grid two">{figures.map((figure) => <FigureCard figure={figure} key={figure.id} />)}</div>
      </Section>

      <Section title={ui("longAnswerSkeletons")} eyebrow={ui("longFormReview")}>
        <div className="card-grid two">{answers.map((answer) => <AnswerCard answer={answer} key={answer.id} />)}</div>
      </Section>
    </div>
  );
}
