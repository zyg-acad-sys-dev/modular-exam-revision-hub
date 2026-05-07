import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLookups } from "../hooks/useLookups.js";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { getByIds, colorClass } from "../utils/contentUtils.js";
import { Section } from "../components/Section.jsx";
import { ConceptCard } from "../components/ConceptCard.jsx";
import { ConceptDrawer } from "../components/ConceptDrawer.jsx";
import { TrapCard } from "../components/TrapCard.jsx";
import { EmptyState } from "../components/EmptyState.jsx";

export function TrackPage() {
  const { trackId } = useParams();
  const content = useLookups();
  const { ui } = useLanguage();
  const [selectedConcept, setSelectedConcept] = useState(null);
  const track = content.trackById[trackId];
  if (!track) return <EmptyState title={ui("trackNotFound")} message={`${ui("noTrackExistsFor")} ${trackId}.`} />;
  const concepts = getByIds(content.concepts, track.coreConceptIds);
  const traps = getByIds(content.traps, track.trapIds);
  const lectures = getByIds(content.lectures, track.lectureIds);
  return (
    <div className="page-stack">
      <header className={`hero-panel compact ${colorClass(track.color)}`}><div className="breadcrumb"><Link to="/">{ui("courseMap")}</Link> / {ui("track")}</div><h1>{track.title}</h1><p>{track.subtitle}</p></header>
      <Section title={ui("trackPath")} eyebrow={ui("modulesInvolved")}><div className="inline-link-grid">{lectures.map((lecture) => <Link to={`/module/${lecture.id}`} key={lecture.id}>{lecture.id.replace("w", "M").toUpperCase()} · {lecture.title}</Link>)}</div></Section>
      <Section title={ui("problemSolutionMap")} eyebrow={ui("whyEachMethodAppears")}><div className="problem-grid">{track.problemsSolutions?.map((item, index) => <article className="problem-card" key={`${item.problem}-${index}`}><strong>{ui("problem")}</strong><p>{item.problem}</p><strong>{ui("solution")}</strong><p>{item.solution}</p>{item.conceptId && <small>{item.conceptId}</small>}</article>)}</div></Section>
      <Section title={ui("coreConcepts")} eyebrow={ui("trackConcepts")}><div className="concept-grid">{concepts.map((concept) => <ConceptCard concept={concept} onOpen={setSelectedConcept} key={concept.id} />)}</div></Section>
      <Section title={ui("trackTraps")} eyebrow={ui("highValueMistakes")}><div className="card-grid two">{traps.slice(0, 12).map((trap) => <TrapCard trap={trap} key={trap.id} />)}</div></Section>
      <ConceptDrawer concept={selectedConcept} onClose={() => setSelectedConcept(null)} onOpenConcept={setSelectedConcept} concepts={content.concepts} quizzes={content.quizzes} traps={content.traps} answers={content.answers} formulas={content.formulas} figures={content.figures} />
    </div>
  );
}
