import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useContent } from "../content/ContentProvider.jsx";
import { useStudyProgress } from "../content/StudyProgressProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { CoverflowRail } from "../components/CoverflowRail.jsx";
import { Section } from "../components/Section.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { StudyHeatmap } from "../components/StudyHeatmap.jsx";
import { buildHeatmapCells, buildStudySummary } from "../utils/studyMetrics.js";
import { colorClass, sortLectures } from "../utils/contentUtils.js";

export function HomePage() {
  const { lectures, concepts, quizzes, traps, answers, formulas, tracks } = useContent();
  const { progress } = useStudyProgress();
  const { ui } = useLanguage();
  const summary = useMemo(() => buildStudySummary(progress), [progress]);
  const heatmapCells = useMemo(() => buildHeatmapCells(progress.dailyLog, 21), [progress.dailyLog]);
  const sortedLectures = sortLectures(lectures);

  const quickActions = [
    { to: "/study", eyebrow: ui("dueItemQueue"), title: `${summary.dueCount} ${ui("countCardsReady")}`, description: ui("dueQueueNote") },
    { to: "/mistakes", eyebrow: ui("weakSignals"), title: `${summary.wrongQuizCount} ${ui("quizSlips")}`, description: ui("mistakeBookIntro") },
    { to: "/review", eyebrow: ui("compressionPass"), title: `${answers.length} ${ui("longAnswers")}`, description: ui("reviewPageIntro") }
  ];

  return (
    <div className="page-stack home-page">
      <header className="hero-panel home-hero theme-blue">
        <div className="home-hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">{ui("homeEyebrow")}</div>
            <h1>{ui("homeTitle")}</h1>
            <p>{ui("homeIntro")}</p>
            <div className="hero-chip-row">
              <span className="hero-chip">{ui("syntheticDemoData")}</span>
              <span className="hero-chip">{ui("modularCoursePacks")}</span>
              <span className="hero-chip">{ui("learningScience")}</span>
              <span className="hero-chip">{ui("aiReadyContentModel")}</span>
            </div>
            <div className="hero-actions">
              <Link className="primary-button" to="/study">{ui("startTodaysReview")}</Link>
              <Link className="secondary-button" to="/brief">{ui("readProjectBrief")}</Link>
            </div>
          </div>

          <div className="hero-focus-card">
            <div className="panel-kicker">{ui("todaysPulse")}</div>
            <div className="hero-focus-stat"><span>{ui("dueItemQueue")}</span><strong>{summary.dueCount}</strong></div>
            <p>{ui("queueGuidance")}</p>
            <div className="hero-mini-metrics">
              <div><span>{ui("streak")}</span><strong>{summary.streak} {ui("days")}</strong></div>
              <div><span>{ui("savedCards")}</span><strong>{summary.bookmarkCount}</strong></div>
              <div><span>{ui("activeDays")}</span><strong>{summary.activeDays}</strong></div>
            </div>
            <StudyHeatmap cells={heatmapCells} compact />
          </div>
        </div>
      </header>

      <div className="stats-grid feature-stats">
        <StatCard label={ui("modules")} value={lectures.length} note={ui("replaceableCoursePacks")} tone="blue" kicker={ui("systemKicker")} />
        <StatCard label={ui("concepts")} value={concepts.length} note={ui("memoryUnitsWithLinks")} tone="purple" kicker={ui("knowledgeKicker")} />
        <StatCard label={ui("quizzes")} value={quizzes.length} note={ui("recallFirstPrompts")} tone="green" kicker={ui("recallKicker")} />
        <StatCard label={ui("traps")} value={traps.length} note={ui("fastMarkProtection")} tone="orange" kicker={ui("riskKicker")} />
        <StatCard label={ui("longAnswers")} value={answers.length} note={ui("structuredWritingPractice")} tone="pink" kicker={ui("expressionKicker")} />
        <StatCard label={ui("formulas")} value={formulas.length} note={ui("highContrastMathAnchors")} tone="gold" kicker={ui("precisionKicker")} />
      </div>

      <CoverflowRail
        items={quickActions}
        ariaLabel={ui("quickStudyActions")}
        className="dashboard-quick-actions"
        renderItem={(item) => <article className="quick-action-card coverflow-preview-card"><span>{item.eyebrow}</span><h3>{item.title}</h3><p>{item.description}</p></article>}
        renderExpandedItem={(item) => (
          <div className="coverflow-expanded-layout"><div className="coverflow-expanded-copy"><div className="coverflow-expanded-kicker">{item.eyebrow}</div><h3>{item.title}</h3><p>{item.description}</p></div><div className="coverflow-expanded-actions"><Link to={item.to} className="primary-button">{ui("openThisLane")}</Link></div></div>
        )}
      />

      <Section eyebrow={ui("moduleArchitecture")} title={ui("moduleRooms")} subtitle={ui("moduleRoomsSubtitle")} action={<Link className="section-link" to="/priority">{ui("viewStudyPressure")}</Link>}>
        <CoverflowRail
          items={sortedLectures}
          ariaLabel={ui("moduleCards")}
          className="module-explorer-grid"
          renderItem={(lecture) => (
            <article className={`study-module-card coverflow-preview-card ${colorClass(lecture.color)}`}>
              <div className="module-card-header"><span className="module-code">{lecture.id.replace("w", "M").toUpperCase()}</span><span className="module-weight">{lecture.examWeight}</span></div>
              <h3>{lecture.title}</h3><p>{lecture.subtitle}</p>
              <div className="module-signal-row"><span>{lecture.coreConceptIds?.length || 0} {ui("concepts")}</span><span>{lecture.quizIds?.length || 0} {ui("quizzes")}</span><span>{lecture.trapIds?.length || 0} {ui("traps")}</span></div>
            </article>
          )}
          renderExpandedItem={(lecture) => (
            <div className={`coverflow-expanded-layout ${colorClass(lecture.color)}`}>
              <div className="coverflow-expanded-copy"><div className="coverflow-expanded-kicker">{lecture.id.replace("w", "M").toUpperCase()}</div><h3>{lecture.title}</h3><p>{lecture.subtitle}</p></div>
              <div className="coverflow-expanded-grid">
                <div className="coverflow-expanded-stat"><span>{ui("examWeight")}</span><strong>{lecture.examWeight || ui("reviewLane")}</strong></div>
                <div className="coverflow-expanded-stat"><span>{ui("concepts")}</span><strong>{lecture.coreConceptIds?.length || 0}</strong></div>
                <div className="coverflow-expanded-stat"><span>{ui("quizzes")}</span><strong>{lecture.quizIds?.length || 0}</strong></div>
                <div className="coverflow-expanded-stat"><span>{ui("traps")}</span><strong>{lecture.trapIds?.length || 0}</strong></div>
              </div>
              <div className="coverflow-expanded-actions"><Link className="primary-button" to={`/module/${lecture.id}`}>{ui("openModuleRoom")}</Link></div>
            </div>
          )}
        />
      </Section>

      <Section eyebrow={ui("crossCuttingThemes")} title={ui("researchEngineeringTracks")} subtitle={ui("researchEngineeringSubtitle")}>
        <CoverflowRail
          items={tracks}
          ariaLabel={ui("trackCards")}
          className="track-map-grid"
          renderItem={(track) => <article className={`study-track-card coverflow-preview-card ${colorClass(track.color)}`}><div className="track-card-topline"><span>{track.id.replaceAll("-", " ")}</span></div><h3>{track.title}</h3><p>{track.subtitle}</p><div className="module-signal-row"><span>{track.coreConceptIds?.length || 0} {ui("concepts")}</span><span>{track.trapIds?.length || 0} {ui("traps")}</span><span>{track.figureIds?.length || 0} {ui("figures")}</span></div></article>}
          renderExpandedItem={(track) => (
            <div className={`coverflow-expanded-layout ${colorClass(track.color)}`}>
              <div className="coverflow-expanded-copy"><div className="coverflow-expanded-kicker">{track.id.replaceAll("-", " ")}</div><h3>{track.title}</h3><p>{track.subtitle}</p></div>
              <div className="coverflow-expanded-grid"><div className="coverflow-expanded-stat"><span>{ui("concepts")}</span><strong>{track.coreConceptIds?.length || 0}</strong></div><div className="coverflow-expanded-stat"><span>{ui("traps")}</span><strong>{track.trapIds?.length || 0}</strong></div><div className="coverflow-expanded-stat"><span>{ui("figures")}</span><strong>{track.figureIds?.length || 0}</strong></div><div className="coverflow-expanded-stat"><span>{ui("modules")}</span><strong>{track.lectureIds?.length || 0}</strong></div></div>
              <div className="coverflow-expanded-actions"><Link className="primary-button" to={`/tracks/${track.id}`}>{ui("openTrackMap")}</Link></div>
            </div>
          )}
        />
      </Section>
    </div>
  );
}
