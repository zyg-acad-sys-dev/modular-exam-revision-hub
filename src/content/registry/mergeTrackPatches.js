import { baseTracks } from "../base/tracks.js";

function clone(value) {
  return typeof structuredClone === "function"
    ? structuredClone(value)
    : JSON.parse(JSON.stringify(value));
}

function uniquePush(target, items = []) {
  for (const item of items || []) {
    if (!target.includes(item)) target.push(item);
  }
}

export function buildTracks(trackPatches = []) {
  const tracks = clone(baseTracks).map((track) => ({
    ...track,
    lectureIds: track.lectureIds || [],
    coreConceptIds: track.coreConceptIds || [],
    trapIds: track.trapIds || [],
    quizIds: track.quizIds || [],
    answerIds: track.answerIds || [],
    formulaIds: track.formulaIds || [],
    figureIds: track.figureIds || [],
    problemsSolutions: track.problemsSolutions || [],
    comparisons: track.comparisons || []
  }));

  for (const patch of trackPatches) {
    const track = tracks.find((t) => t.id === patch.trackId);
    if (!track) {
      console.warn(`Unknown trackId: ${patch.trackId}`);
      continue;
    }

    uniquePush(track.lectureIds, patch.addLectureIds);
    uniquePush(track.coreConceptIds, patch.addConceptIds);
    uniquePush(track.trapIds, patch.addTrapIds);
    uniquePush(track.quizIds, patch.addQuizIds);
    uniquePush(track.answerIds, patch.addAnswerIds);
    uniquePush(track.formulaIds, patch.addFormulaIds);
    uniquePush(track.figureIds, patch.addFigureIds);

    track.problemsSolutions.push(...(patch.addProblemSolutions || []));
    track.comparisons.push(...(patch.addComparisons || []));
  }

  return tracks;
}
