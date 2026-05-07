import { Link } from "react-router-dom";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { Section } from "../components/Section.jsx";
import { StatCard } from "../components/StatCard.jsx";

const mvpItemKeys = ["mvpItem1", "mvpItem2", "mvpItem3", "mvpItem4"];
const roadmapItemKeys = ["roadmapItem1", "roadmapItem2", "roadmapItem3", "roadmapItem4"];

export function ProjectBriefPage() {
  const { ui } = useLanguage();
  return (
    <div className="page-stack project-brief-page">
      <header className="hero-panel theme-purple">
        <div className="hero-copy">
          <div className="eyebrow">{ui("projectBriefTitle")}</div>
          <h1>{ui("staticToAdaptiveTitle")}</h1>
          <p>{ui("projectBriefIntro")}</p>
          <div className="hero-chip-row">
            <span className="hero-chip">{ui("syntheticDemoData")}</span>
            <span className="hero-chip">React / Vite</span>
            <span className="hero-chip">{ui("learningScience")}</span>
            <span className="hero-chip">{ui("ragIngestionPath")}</span>
          </div>
          <div className="hero-actions">
            <Link className="primary-button" to="/">{ui("openPrototype")}</Link>
            <Link className="secondary-button" to="/print">{ui("viewPrintablePack")}</Link>
          </div>
        </div>
      </header>

      <div className="stats-grid feature-stats">
        <StatCard label={ui("positioning")} value={ui("prototype")} note={ui("conceptToDemoWorkflow")} tone="blue" kicker="MVP" />
        <StatCard label={ui("data")} value={ui("synthetic")} note={ui("noRealCourseMaterials")} tone="green" kicker="Privacy" />
        <StatCard label={ui("architecture")} value={ui("modular")} note={ui("replaceableCoursePacks")} tone="purple" kicker="Scale" />
        <StatCard label={ui("extension")} value={ui("aiReady")} note={ui("ragIngestionPath")} tone="gold" kicker="Roadmap" />
      </div>

      <Section eyebrow={ui("motivation")} title={ui("whyPrototypeExists")} subtitle={ui("whyPrototypeExistsSubtitle")}>
        <div className="answer-grid">
          <article className="answer-card"><h3>{ui("learningScienceLayer")}</h3><p>{ui("learningScienceLayerText")}</p></article>
          <article className="answer-card"><h3>{ui("mlReadyLayer")}</h3><p>{ui("mlReadyLayerText")}</p></article>
        </div>
      </Section>

      <Section eyebrow={ui("currentMvp")} title={ui("mvpTitle")} subtitle={ui("mvpSubtitle")}>
        <div className="checklist-card">
          {mvpItemKeys.map((key) => <div className="checklist-row" key={key}><span className="check-dot" aria-hidden="true">✓</span><span>{ui(key)}</span></div>)}
        </div>
      </Section>

      <Section eyebrow={ui("aiExtensionRoadmap")} title={ui("genuinelyInteractiveTitle")} subtitle={ui("genuinelyInteractiveSubtitle")}>
        <div className="checklist-card">
          {roadmapItemKeys.map((key) => <div className="checklist-row" key={key}><span className="check-dot" aria-hidden="true">→</span><span>{ui(key)}</span></div>)}
        </div>
      </Section>

    </div>
  );
}
