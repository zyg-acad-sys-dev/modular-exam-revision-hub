import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../content/ContentProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { Section } from "../components/Section.jsx";
import { FigureCard } from "../components/FigureCard.jsx";
import { EmptyState } from "../components/EmptyState.jsx";
import { itemMatchesTrack, matchesSearch } from "../utils/contentUtils.js";

export function FigurePage() {
  const { figures, lectures, tracks } = useContent();
  const { ui } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [week, setWeek] = useState("all");

  const filteredFigures = useMemo(() => figures.filter((figure) => {
    const categoryOk = itemMatchesTrack(figure, category, tracks, { relationKey: "figureIds" });
    const weekOk = week === "all" || figure.relatedLectureIds?.includes(week);
    return categoryOk && weekOk && matchesSearch(figure, query);
  }), [figures, query, category, week, tracks]);

  return (
    <div className="page-stack figure-page">
      <header className="hero-panel compact theme-purple">
        <div className="breadcrumb"><Link to="/">{ui("courseMap")}</Link> / {ui("figures")}</div>
        <div className="eyebrow">{ui("visualRecall")}</div>
        <h1>{ui("figurePageTitle")}</h1>
        <p>{ui("figurePageIntro")}</p>
      </header>
      <Section title={ui("figureFilters")} eyebrow={`${filteredFigures.length} / ${figures.length} ${ui("figuresShown")}`}>
        <div className="toolbar three">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui("searchFiguresPlaceholder")} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">{ui("allCategories")}</option>{tracks.map((track) => <option value={track.id} key={track.id}>{track.title}</option>)}</select>
          <select value={week} onChange={(e) => setWeek(e.target.value)}><option value="all">{ui("allModules")}</option>{lectures.map((lecture) => <option value={lecture.id} key={lecture.id}>{lecture.id.replace("w", "M").toUpperCase()} — {lecture.title}</option>)}</select>
        </div>
      </Section>
      <Section title={ui("visualDeck")} eyebrow={ui("recognitionBeforeExplanation")} subtitle={ui("visualDeckSubtitle")}>
        {filteredFigures.length > 0 ? <div className="card-grid two figure-grid">{filteredFigures.map((figure) => <FigureCard figure={figure} key={figure.id} />)}</div> : <EmptyState title={ui("noMatchingFigures")} message={ui("broaderSearchReset")} />}
      </Section>
    </div>
  );
}
