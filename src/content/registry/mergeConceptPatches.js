import { deepMerge } from "./mergeItemPatches.js";

function uniqueMerge(base = [], additions = []) {
  const result = [...(base || [])];
  for (const item of additions || []) {
    if (!result.includes(item)) result.push(item);
  }
  return result;
}

export function mergeConceptPatches(concepts, conceptPatches = []) {
  const merged = structuredClone(concepts || []);

  for (const patch of conceptPatches) {
    const concept = merged.find((c) => c.id === patch.conceptId);
    if (!concept) {
      console.warn(`Unknown conceptId in conceptPatch: ${patch.conceptId}`);
      continue;
    }

    concept.relatedLectureIds = uniqueMerge(concept.relatedLectureIds, patch.addRelatedLectureIds);
    concept.relatedTrackIds = uniqueMerge(concept.relatedTrackIds, patch.addRelatedTrackIds);
    concept.relatedConceptIds = uniqueMerge(concept.relatedConceptIds, patch.addRelatedConceptIds);
    concept.trapIds = uniqueMerge(concept.trapIds, patch.addTrapIds);
    concept.quizIds = uniqueMerge(concept.quizIds, patch.addQuizIds);
    concept.answerIds = uniqueMerge(concept.answerIds, patch.addAnswerIds);
    concept.formulaIds = uniqueMerge(concept.formulaIds, patch.addFormulaIds);
    concept.figureIds = uniqueMerge(concept.figureIds, patch.addFigureIds);
    concept.sourceIds = uniqueMerge(concept.sourceIds, patch.addSourceIds);

    concept.exam = {
      ...(concept.exam || {}),
      likelyQuestions: uniqueMerge(concept.exam?.likelyQuestions, patch.addLikelyQuestions),
      keywords: uniqueMerge(concept.exam?.keywords, patch.addKeywords),
      examSignals: uniqueMerge(concept.exam?.examSignals, patch.addExamSignals)
    };

    // Allow bilingual / visual memory fields to be patched without redefining the concept.
    const mergedPatch = deepMerge(concept, patch);
    concept.i18n = mergedPatch.i18n;
    concept.visual = mergedPatch.visual;
    concept.memory = mergedPatch.memory;
  }

  return merged;
}
