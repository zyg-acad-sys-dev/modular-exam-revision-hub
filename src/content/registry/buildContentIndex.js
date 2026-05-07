export function buildContentIndex(modules) {
  const index = {
    modules,
    lectures: [],
    lecturePatches: [],
    concepts: [],
    conceptPatches: [],
    quizzes: [],
    quizPatches: [],
    traps: [],
    trapPatches: [],
    answers: [],
    answerPatches: [],
    formulas: [],
    formulaPatches: [],
    figures: [],
    figurePatches: [],
    trackPatches: [],
    reviewPatches: []
  };

  for (const mod of modules) {
    index.lectures.push(...(mod.lectures || []));
    index.lecturePatches.push(...(mod.lecturePatches || []));
    index.concepts.push(...(mod.concepts || []));
    index.conceptPatches.push(...(mod.conceptPatches || []));
    index.quizzes.push(...(mod.quizzes || []));
    index.quizPatches.push(...(mod.quizPatches || []));
    index.traps.push(...(mod.traps || []));
    index.trapPatches.push(...(mod.trapPatches || []));
    index.answers.push(...(mod.answers || []));
    index.answerPatches.push(...(mod.answerPatches || []));
    index.formulas.push(...(mod.formulas || []));
    index.formulaPatches.push(...(mod.formulaPatches || []));
    index.figures.push(...(mod.figures || []));
    index.figurePatches.push(...(mod.figurePatches || []));
    index.trackPatches.push(...(mod.trackPatches || []));
    index.reviewPatches.push(...(mod.reviewPatches || []));
  }

  return index;
}
