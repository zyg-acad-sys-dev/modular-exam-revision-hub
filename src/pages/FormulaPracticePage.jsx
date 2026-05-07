import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../content/ContentProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { Section } from "../components/Section.jsx";
import { FormulaRenderer } from "../components/FormulaRenderer.jsx";
import { itemMatchesTrack, matchesSearch } from "../utils/contentUtils.js";

function buildPracticeCards(formulas, ui) {
  const cards = [];
  for (const formula of formulas) {
    cards.push({ id: `${formula.id}-recall`, kind: "recall", formula, prompt: `${ui("recallFormulaFor")}: ${formula.title}`, hint: formula.examNote || ui("recallFormulaHint") });
    if (formula.variables?.length > 0) for (const variable of formula.variables.slice(0, 3)) cards.push({ id: `${formula.id}-var-${variable.symbol}`, kind: "variable", formula, variable, prompt: `${ui("whatDoesMean")} ${formula.title}?`, hint: ui("variableMeaningHint") });
    if (formula.examNote) cards.push({ id: `${formula.id}-exam-note`, kind: "exam-note", formula, prompt: `${ui("recallExamNoteFor")} ${formula.title}?`, hint: ui("examNoteHint") });
  }
  return cards;
}

function PracticeCard({ card, index, total, ui }) {
  const [revealed, setRevealed] = useState(false);
  const [selfMark, setSelfMark] = useState(null);
  return (
    <article className={`practice-card ${selfMark ? `marked-${selfMark}` : ""}`}>
      <div className="card-topline"><div className="eyebrow">{ui("formulaPracticeTitle")} {index + 1} / {total}</div><span className="tier">{card.kind}</span></div>
      <h3>{card.prompt}</h3>
      {card.hint && <p className="practice-hint">{ui("hint")}: {card.hint}</p>}
      {!revealed && <div className="recall-box"><p>{ui("recallPause")}</p></div>}
      {revealed && <div className="practice-answer-box">{card.kind === "recall" && <><div className="rendered-formula-box compact-render"><FormulaRenderer latex={card.formula.latex} /></div>{card.formula.examNote && <p className="exam-note">{card.formula.examNote}</p>}</>}{card.kind === "variable" && <div className="variable-answer"><FormulaRenderer latex={card.variable.symbol} inline /><span>{card.variable.meaning}</span></div>}{card.kind === "exam-note" && <p>{card.formula.examNote}</p>}</div>}
      <div className="quiz-actions"><button className="primary-button" type="button" onClick={() => setRevealed((v) => !v)}>{revealed ? ui("hideAnswer") : ui("revealAnswer")}</button><button className="secondary-button" type="button" onClick={() => setSelfMark("easy")}>{ui("iKnewIt")}</button><button className="secondary-button" type="button" onClick={() => setSelfMark("again")}>{ui("reviewAgain")}</button></div>
    </article>
  );
}

export function FormulaPracticePage() {
  const { formulas, tracks } = useContent();
  const { ui } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [mode, setMode] = useState("all");
  const cards = useMemo(() => {
    const selectedFormulas = formulas.filter((formula) => itemMatchesTrack(formula, category, tracks, { relationKey: "formulaIds" }) && matchesSearch(formula, query));
    return buildPracticeCards(selectedFormulas, ui).filter((card) => mode === "all" || card.kind === mode);
  }, [formulas, query, category, mode, tracks, ui]);
  return (
    <div className="page-stack formula-practice-page">
      <header className="hero-panel compact theme-purple"><div className="breadcrumb"><Link to="/formulas">{ui("formulaCards")}</Link> / {ui("practice")}</div><div className="eyebrow">{ui("formulaRecall")}</div><h1>{ui("formulaPracticeTitle")}</h1><p>{ui("formulaPracticeIntro")}</p></header>
      <Section title={ui("practiceFilters")} eyebrow={`${cards.length} ${ui("practiceCards")}`}><div className="toolbar formula-practice-toolbar"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui("searchFormulaPracticePlaceholder")} /><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">{ui("allCategories")}</option>{tracks.map((track) => <option value={track.id} key={track.id}>{track.title}</option>)}</select><select value={mode} onChange={(e) => setMode(e.target.value)}><option value="all">{ui("allPracticeTypes")}</option><option value="recall">{ui("formulaRecall")}</option><option value="variable">{ui("variableMeaning")}</option><option value="exam-note">{ui("examNoteType")}</option></select></div></Section>
      <div className="card-grid two">{cards.map((card, index) => <PracticeCard card={card} index={index} total={cards.length} key={card.id} ui={ui} />)}</div>
    </div>
  );
}
