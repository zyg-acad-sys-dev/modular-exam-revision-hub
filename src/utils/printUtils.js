import { getByIds, weekNumber } from "./contentUtils.js";

export function groupReviewPatches(patches = []) {
  const sections = {};
  for (const patch of patches) {
    const section = sections[patch.section] || {
      addConceptIds: [],
      addAnswerIds: [],
      addFormulaIds: [],
      addTrapIds: [],
      addFigureIds: [],
      addItems: []
    };
    for (const key of Object.keys(section)) {
      section[key].push(...(patch[key] || []));
    }
    sections[patch.section] = section;
  }
  for (const section of Object.values(sections)) {
    for (const key of Object.keys(section)) section[key] = [...new Set(section[key])];
  }
  return sections;
}

export function buildReviewCollections(content) {
  const sections = groupReviewPatches(content.reviewPatches);
  return {
    sections,
    coreConcepts: getByIds(content.concepts, sections["core-topics"]?.addConceptIds),
    highAnswers: getByIds(content.answers, sections["high-probability-long-answers"]?.addAnswerIds),
    formulas: getByIds(content.formulas, sections["calculation-sheet"]?.addFormulaIds),
    traps: getByIds(content.traps, sections["common-traps"]?.addTrapIds),
    figures: getByIds(content.figures, sections["figure-recognition"]?.addFigureIds),
    lastItems: sections["last-30-minute-review"]?.addItems || []
  };
}

export function sortByWeekThenTitle(items = []) {
  return [...items].sort((a, b) => {
    const aw = Math.min(...(a.relatedLectureIds || ["w99"]).map(weekNumber));
    const bw = Math.min(...(b.relatedLectureIds || ["w99"]).map(weekNumber));
    if (aw !== bw) return aw - bw;
    return String(a.title || a.question || a.id).localeCompare(String(b.title || b.question || b.id));
  });
}

export function groupByPrimaryLecture(items = []) {
  const grouped = {};
  for (const item of items) {
    const lectureId = item.relatedLectureIds?.[0] || "other";
    grouped[lectureId] ||= [];
    grouped[lectureId].push(item);
  }
  return Object.fromEntries(
    Object.entries(grouped).sort(([a], [b]) => weekNumber(a) - weekNumber(b))
  );
}

export function labelForLecture(content, lectureId) {
  const lecture = content.lectureById?.[lectureId] || content.lectures?.find((l) => l.id === lectureId);
  if (!lecture) return lectureId === "other" ? "Other / Extensions" : lectureId;
  return `${String(lecture.id).replace("w", "M").toUpperCase()} · ${lecture.title}`;
}

export function printNow() {
  if (typeof window !== "undefined") window.print();
}
