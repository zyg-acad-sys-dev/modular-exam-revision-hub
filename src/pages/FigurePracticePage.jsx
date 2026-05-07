import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../content/ContentProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { Section } from "../components/Section.jsx";
import { FigureCard } from "../components/FigureCard.jsx";
import { itemMatchesTrack, matchesSearch } from "../utils/contentUtils.js";

function buildFigurePracticeCards(figures, ui) {
  const cards = [];
  for (const figure of figures) {
    cards.push({ id: `${figure.id}-identify`, kind: "identify", figure, prompt: ui("identifyFigure"), revealTitle: figure.title, revealBody: figure.alt || figure.keyVisualCue || ui("explainConceptShown") });
    if (figure.keyVisualCue) cards.push({ id: `${figure.id}-cue`, kind: "visual-cue", figure, prompt: `${ui("visualCue")}: ${figure.title}?`, revealTitle: ui("visualCue"), revealBody: figure.keyVisualCue });
    if (figure.recognitionQuestion) cards.push({ id: `${figure.id}-question`, kind: "question", figure, prompt: figure.recognitionQuestion, revealTitle: ui("expectedRecallDirection"), revealBody: figure.keyVisualCue || figure.alt || ui("explainConceptShown") });
  }
  return cards;
}

function FigurePracticeCard({ card, index, total, ui }) {
  const [revealed, setRevealed] = useState(false);
  const [selfMark, setSelfMark] = useState(null);
  return (
    <article className={`practice-card figure-practice-card ${selfMark ? `marked-${selfMark}` : ""}`}>
      <div className="card-topline"><div className="eyebrow">{ui("figurePracticeTitle")} {index + 1} / {total}</div><span className="tier">{card.kind}</span></div>
      <h3>{card.prompt}</h3><div className="figure-blind-preview"><FigureCard figure={card.figure} compact /></div>
      {!revealed && <div className="recall-box"><p>{ui("coverTitleMentally")}</p></div>}
      {revealed && <div className="practice-answer-box"><strong>{card.revealTitle}</strong><p>{card.revealBody}</p>{card.figure.relatedConceptIds?.length > 0 && <div className="keyword-row">{card.figure.relatedConceptIds.slice(0, 6).map((id) => <span key={id}>{id}</span>)}</div>}</div>}
      <div className="quiz-actions"><button className="primary-button" type="button" onClick={() => setRevealed((v) => !v)}>{revealed ? ui("hideAnswer") : ui("revealAnswer")}</button><button className="secondary-button" type="button" onClick={() => setSelfMark("easy")}>{ui("iRecognizedIt")}</button><button className="secondary-button" type="button" onClick={() => setSelfMark("again")}>{ui("reviewAgain")}</button></div>
    </article>
  );
}

export function FigurePracticePage() {
  const { figures, tracks, lectures } = useContent();
  const { ui } = useLanguage();
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("all"); const [week, setWeek] = useState("all"); const [mode, setMode] = useState("all");
  const cards = useMemo(() => { const selectedFigures = figures.filter((figure) => itemMatchesTrack(figure, category, tracks, { relationKey: "figureIds" }) && (week === "all" || figure.relatedLectureIds?.includes(week)) && matchesSearch(figure, query)); return buildFigurePracticeCards(selectedFigures, ui).filter((card) => mode === "all" || card.kind === mode); }, [figures, query, category, week, mode, tracks, ui]);
  return (
    <div className="page-stack figure-practice-page">
      <header className="hero-panel compact theme-purple"><div className="breadcrumb"><Link to="/figures">{ui("figurePageTitle")}</Link> / {ui("practice")}</div><div className="eyebrow">{ui("visualRecall")}</div><h1>{ui("figurePracticeTitle")}</h1><p>{ui("figurePracticeIntro")}</p></header>
      <Section title={ui("practiceFilters")} eyebrow={`${cards.length} ${ui("practiceCards")}`}><div className="toolbar four"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui("searchFigurePracticePlaceholder")} /><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">{ui("allCategories")}</option>{tracks.map((track) => <option value={track.id} key={track.id}>{track.title}</option>)}</select><select value={week} onChange={(e) => setWeek(e.target.value)}><option value="all">{ui("allModules")}</option>{lectures.map((lecture) => <option value={lecture.id} key={lecture.id}>{lecture.id.replace("w", "M").toUpperCase()}</option>)}</select><select value={mode} onChange={(e) => setMode(e.target.value)}><option value="all">{ui("allModes")}</option><option value="identify">{ui("identifyFigure")}</option><option value="visual-cue">{ui("visualCueRecall")}</option><option value="question">{ui("recognitionQuestion")}</option></select></div></Section>
      <div className="card-grid two">{cards.map((card, index) => <FigurePracticeCard card={card} index={index} total={cards.length} key={card.id} ui={ui} />)}</div>
    </div>
  );
}
