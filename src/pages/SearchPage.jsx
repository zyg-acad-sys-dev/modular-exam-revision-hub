import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../content/ContentProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { Section } from "../components/Section.jsx";

function routeFor(result) { return result.route || "/review"; }

export function SearchPage() {
  const { searchIndex } = useContent();
  const { ui } = useLanguage();
  const [query, setQuery] = useState("");
  const results = useMemo(() => { const q = query.trim().toLowerCase(); if (!q) return searchIndex.slice(0, 30); return searchIndex.filter((item) => item.text.toLowerCase().includes(q)).slice(0, 80); }, [searchIndex, query]);
  return (
    <div className="page-stack">
      <header className="hero-panel compact theme-green"><div className="eyebrow">{ui("globalSearch")}</div><h1>{ui("globalSearchTitle")}</h1><p>{ui("globalSearchIntro")}</p></header>
      <Section title={ui("searchContent")} eyebrow={`${results.length} ${ui("results")}`}><div className="toolbar single"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui("searchContentPlaceholder")} autoFocus /></div></Section>
      <div className="search-results">{results.map((result) => <Link className="search-result" to={routeFor(result)} key={`${result.type}-${result.id}`}><span>{result.type}</span><h3>{result.title}</h3><small>{result.category} · {result.id}</small></Link>)}</div>
    </div>
  );
}
