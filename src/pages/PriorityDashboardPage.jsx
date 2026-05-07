import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useContent } from "../content/ContentProvider.jsx";
import { useStudyProgress } from "../content/StudyProgressProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { CoverflowRail } from "../components/CoverflowRail.jsx";
import { Section } from "../components/Section.jsx";
import { QuizCard } from "../components/QuizCard.jsx";
import { TrapCard } from "../components/TrapCard.jsx";
import { AnswerCard } from "../components/AnswerCard.jsx";
import { ProgressRing } from "../components/ProgressRing.jsx";
import { StudyHeatmap } from "../components/StudyHeatmap.jsx";
import { WeakAreaRadar } from "../components/WeakAreaRadar.jsx";
import { buildHeatmapCells, buildStudySummary } from "../utils/studyMetrics.js";
import { itemMatchesTrack, sortLectures } from "../utils/contentUtils.js";

function scorePriority(item = {}) {
  let score = 0;
  if (item.priority === "high") score += 10;
  if (item.examWeight?.toLowerCase?.().includes("very")) score += 8;
  if (item.examWeight?.toLowerCase?.().includes("extremely")) score += 12;
  if (item.tier === 1) score += 5;
  if ((item.tags || []).includes("long-answer")) score += 3;
  return score;
}

function overlaps(left = [], right = []) {
  return (left || []).some((item) => (right || []).includes(item));
}

const shortTrackLabels = {
  "learning-science": "LS",
  "cognitive-diagnosis": "CD",
  "ai-workflow": "AI",
  "prototype-engineering": "PE",
  "personalized-review": "PR",
  "research-extension": "RE"
};

function buildTrackRadarItems(tracks, progress) {
  const attempts = Object.values(progress.attempts || {});
  const reviews = Object.values(progress.reviews || {});

  const rawItems = tracks.map((track) => {
    let score = (track.coreConceptIds?.length || 0) * 1.8 + (track.trapIds?.length || 0) * 1.2;

    attempts.forEach((attempt) => {
      const inTrack = overlaps(attempt.relatedConceptIds, track.coreConceptIds) || overlaps(attempt.relatedLectureIds, track.lectureIds);
      if (!inTrack) return;
      score += Number(attempt.wrong || 0) * 3;
      if (attempt.lastCorrect === false) score += 2;
    });

    reviews.forEach((review) => {
      const inTrack = overlaps(review.relatedConceptIds, track.coreConceptIds) || overlaps(review.relatedLectureIds, track.lectureIds);
      if (!inTrack) return;
      if (review.rating === "again") score += 4;
      else if (review.rating === "hard") score += 3;
      else if (review.rating === "good") score += 1.5;
      else if (review.rating === "easy") score += 1;
      if (!review.dueAt || new Date(review.dueAt).getTime() <= Date.now()) score += 1.5;
    });

    return {
      id: track.id,
      label: track.title,
      shortLabel: shortTrackLabels[track.id] || track.title.slice(0, 2).toUpperCase(),
      raw: score
    };
  });

  const maxRaw = Math.max(1, ...rawItems.map((item) => item.raw));
  return rawItems.map((item) => ({
    ...item,
    value: Math.max(18, Math.round((item.raw / maxRaw) * 100))
  }));
}

export function PriorityDashboardPage() {
  const content = useContent();
  const { ui } = useLanguage();
  const { progress } = useStudyProgress();
  const [trackId, setTrackId] = useState("all");
  const summary = useMemo(() => buildStudySummary(progress), [progress]);
  const heatmapCells = useMemo(() => buildHeatmapCells(progress.dailyLog, 28), [progress.dailyLog]);
  const lectures = useMemo(() => sortLectures(content.lectures), [content.lectures]);
  const radarItems = useMemo(() => buildTrackRadarItems(content.tracks, progress), [content.tracks, progress]);

  const accuracyRate = summary.totalAttempts > 0
    ? Math.round((summary.correctAnswers / summary.totalAttempts) * 100)
    : 0;
  const reviewStability = summary.totalReviews > 0
    ? Math.round((summary.reviewWins / summary.totalReviews) * 100)
    : 0;
  const consistencyRate = Math.round((summary.activeLast14 / 14) * 100);

  const highConcepts = useMemo(() => {
    return content.concepts
      .filter((concept) => itemMatchesTrack(concept, trackId, content.tracks, { relationKey: "coreConceptIds" }) && (concept.priority === "high" || concept.tier === 1))
      .sort((a, b) => scorePriority(b) - scorePriority(a))
      .slice(0, 24);
  }, [content.concepts, content.tracks, trackId]);

  const highQuizzes = useMemo(
    () => content.quizzes
      .filter((quiz) => itemMatchesTrack(quiz, trackId, content.tracks, { relationKey: "quizIds" }) && quiz.priority === "high")
      .slice(0, 6),
    [content.quizzes, content.tracks, trackId]
  );

  const highTraps = useMemo(
    () => content.traps
      .filter((trap) => itemMatchesTrack(trap, trackId, content.tracks, { relationKey: "trapIds" }) && trap.priority === "high")
      .slice(0, 6),
    [content.traps, content.tracks, trackId]
  );

  const highAnswers = useMemo(
    () => content.answers
      .filter((answer) => itemMatchesTrack(answer, trackId, content.tracks, { relationKey: "answerIds" }) && answer.priority === "high")
      .slice(0, 4),
    [content.answers, content.tracks, trackId]
  );

  return (
    <div className="page-stack priority-dashboard-page">
      <header className="hero-panel compact theme-pink dashboard-masthead">
        <div className="eyebrow">{ui("priorityDashboardTitle")}</div>
        <h1>{ui("priorityDashboardHeadline")}</h1>
        <p>{ui("priorityDashboardIntro")}</p>
        <div className="hero-actions">
          <Link className="primary-button" to="/study">{ui("openDueQueue")}</Link>
          <Link className="secondary-button" to="/mistakes">{ui("inspectWeakItems")}</Link>
        </div>
      </header>

      <div className="dashboard-grid">
        <section className="dashboard-panel wide">
          <div className="dashboard-panel-head">
            <div>
              <div className="eyebrow">{ui("learningStatus")}</div>
              <h2>{ui("todaysStudyPulse")}</h2>
            </div>
            <p>{ui("pulseIntro")}</p>
          </div>
          <div className="progress-ring-grid">
            <ProgressRing value={accuracyRate} label={ui("quizAccuracy")} note={ui("quizAccuracyNote")} tone="green" />
            <ProgressRing value={reviewStability} label={ui("reviewStability")} note={ui("reviewStabilityNote")} tone="purple" />
            <ProgressRing value={consistencyRate} label={ui("fourteenDayRhythm")} note={ui("fourteenDayRhythmNote")} tone="gold" />
          </div>
        </section>

        <aside className="dashboard-panel queue-panel">
          <div className="panel-kicker">{ui("dueItemQueue")}</div>
          <div className="dashboard-highlight">{summary.dueCount}</div>
          <p className="dashboard-note">{ui("dueQueueNote")}</p>
          <div className="queue-signal-list">
            <div className="queue-signal-item">
              <span>{ui("againHardItems")}</span>
              <strong>{summary.weakCount}</strong>
            </div>
            <div className="queue-signal-item">
              <span>{ui("quizSlips")}</span>
              <strong>{summary.wrongQuizCount}</strong>
            </div>
            <div className="queue-signal-item">
              <span>{ui("savedReferences")}</span>
              <strong>{summary.bookmarkCount}</strong>
            </div>
          </div>
          <div className="queue-actions">
            <Link className="primary-button" to="/study">{ui("startRecallLoop")}</Link>
            <Link className="secondary-button" to="/last30">{ui("thirtyMinutePass")}</Link>
          </div>
        </aside>

        <section className="dashboard-panel wide">
          <div className="dashboard-panel-head">
            <div>
              <div className="eyebrow">{ui("consistency")}</div>
              <h2>{ui("studyHeatmapTitle")}</h2>
            </div>
            <p>{ui("heatmapIntro")}</p>
          </div>
          <StudyHeatmap cells={heatmapCells} />
        </section>

        <section className="dashboard-panel wide">
          <div className="dashboard-panel-head">
            <div>
              <div className="eyebrow">{ui("weakAreaReflection")}</div>
              <h2>{ui("pressureByTrack")}</h2>
            </div>
            <p>{ui("radarIntro")}</p>
          </div>
          <WeakAreaRadar items={radarItems} />
        </section>
      </div>

      <Section
        eyebrow={ui("moduleSequence")}
        title={ui("modulePressureMap")}
        subtitle={ui("modulePressureSubtitle")}
      >
        <CoverflowRail
          items={lectures}
          ariaLabel={ui("priorityModules")}
          className="priority-module-grid"
          renderItem={(lecture) => (
            <article className="priority-week coverflow-preview-card">
              <span>{lecture.id.replace("w", "M").toUpperCase()}</span>
              <strong>{lecture.title}</strong>
              <small>{lecture.examWeight || ui("reviewHub")}</small>
            </article>
          )}
          renderExpandedItem={(lecture) => (
            <div className="coverflow-expanded-layout">
              <div className="coverflow-expanded-copy">
                <div className="coverflow-expanded-kicker">{ui("modulePressure")}</div>
                <h3>{lecture.title}</h3>
                <p>{ui("moduleLaneIntro")}</p>
              </div>
              <div className="coverflow-expanded-grid">
                <div className="coverflow-expanded-stat">
                  <span>{ui("moduleCode")}</span>
                  <strong>{lecture.id.replace("w", "M").toUpperCase()}</strong>
                </div>
                <div className="coverflow-expanded-stat">
                  <span>{ui("examWeight")}</span>
                  <strong>{lecture.examWeight || ui("reviewHub")}</strong>
                </div>
                <div className="coverflow-expanded-stat">
                  <span>{ui("concepts")}</span>
                  <strong>{lecture.coreConceptIds?.length || 0}</strong>
                </div>
                <div className="coverflow-expanded-stat">
                  <span>{ui("quizzes")}</span>
                  <strong>{lecture.quizIds?.length || 0}</strong>
                </div>
              </div>
              <div className="coverflow-expanded-actions">
                <Link className="primary-button" to={`/module/${lecture.id}`}>{ui("openModuleRoom")}</Link>
              </div>
            </div>
          )}
        />
      </Section>

      <Section
        eyebrow={`${highConcepts.length} ${ui("highYieldConcepts")}`}
        title={ui("conceptPriorityLayer")}
        subtitle={ui("conceptPrioritySubtitle")}
        action={(
          <div className="priority-track-filter">
            <select value={trackId} onChange={(event) => setTrackId(event.target.value)}>
              <option value="all">{ui("allTracks")}</option>
              {content.tracks.map((track) => <option key={track.id} value={track.id}>{track.title}</option>)}
            </select>
          </div>
        )}
      >
        <div className="concept-priority-grid">
          {highConcepts.map((concept) => (
            <Link
              to={concept.relatedLectureIds?.[0] ? `/module/${concept.relatedLectureIds[0]}` : "/review"}
              className="priority-concept"
              key={concept.id}
            >
              <span>{concept.category}</span>
              <h3>{concept.title}</h3>
              <p>{concept.shortDefinition}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow={ui("activeRecall")} title={ui("highPriorityQuizCards")}>
        <div className="card-grid two">
          {highQuizzes.map((quiz) => <QuizCard quiz={quiz} key={quiz.id} compact />)}
        </div>
      </Section>

      <Section eyebrow={ui("fastScoreProtection")} title={ui("highPriorityTraps")}>
        <div className="card-grid two">
          {highTraps.map((trap) => <TrapCard trap={trap} key={trap.id} />)}
        </div>
      </Section>

      <Section eyebrow={ui("longFormReview")} title={ui("highPriorityLongAnswers")}>
        <div className="card-grid two">
          {highAnswers.map((answer) => <AnswerCard answer={answer} key={answer.id} />)}
        </div>
      </Section>
    </div>
  );
}
