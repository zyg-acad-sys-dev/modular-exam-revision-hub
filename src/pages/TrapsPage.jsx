import { useMemo, useState } from "react";
import { useContent } from "../content/ContentProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { Section } from "../components/Section.jsx";
import { TrapCard } from "../components/TrapCard.jsx";
import { matchesSearch } from "../utils/contentUtils.js";

export function TrapsPage() {
  const { traps, tracks } = useContent();
  const { ui } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const filtered = useMemo(() => traps.filter((trap) => (category === "all" || trap.category === category) && matchesSearch(trap, query)), [traps, query, category]);
  return (
    <div className="page-stack">
      <header className="hero-panel compact theme-pink"><div className="eyebrow">{ui("trapWall")}</div><h1>{ui("commonMistakes")}</h1><p>{ui("trapsPageIntro")}</p></header>
      <Section title={ui("filterTraps")} eyebrow={`${filtered.length} ${ui("trapsShown")}`}>
        <div className="toolbar"><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui("searchTrapsPlaceholder")} /><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">{ui("allCategories")}</option>{tracks.map((track) => <option value={track.id} key={track.id}>{track.title}</option>)}</select></div>
      </Section>
      <div className="card-grid two">{filtered.map((trap) => <TrapCard trap={trap} key={trap.id} />)}</div>
    </div>
  );
}
