import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../content/ContentProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { Section } from "../components/Section.jsx";
import { FormulaCard } from "../components/FormulaCard.jsx";
import { itemMatchesTrack, matchesSearch } from "../utils/contentUtils.js";

export function FormulaPage() {
  const { formulas, tracks } = useContent();
  const { ui } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => formulas.filter((formula) => {
    const categoryOk = itemMatchesTrack(formula, category, tracks, { relationKey: "formulaIds" });
    return categoryOk && matchesSearch(formula, query);
  }), [formulas, query, category, tracks]);

  return (
    <div className="page-stack">
      <header className="hero-panel compact theme-purple">
        <div className="eyebrow">{ui("formulaCards")}</div>
        <h1>{ui("formulaPageTitle")}</h1>
        <p>{ui("formulaPageIntro")}</p>
        <div className="hero-actions"><Link className="primary-button" to="/formulas/practice">{ui("startFormulaPractice")}</Link></div>
      </header>
      <Section title={ui("filterFormulas")} eyebrow={`${filtered.length} ${ui("formulasShown")}`}>
        <div className="toolbar"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui("searchFormulasPlaceholder")} /><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">{ui("allCategories")}</option>{tracks.map((track) => <option value={track.id} key={track.id}>{track.title}</option>)}</select></div>
      </Section>
      <div className="card-grid two">{filtered.map((formula) => <FormulaCard formula={formula} key={formula.id} />)}</div>
    </div>
  );
}
