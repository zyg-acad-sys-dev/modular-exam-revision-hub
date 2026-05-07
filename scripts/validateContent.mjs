import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { buildContentIndex } from "../src/content/registry/buildContentIndex.js";
import { mergeConceptPatches } from "../src/content/registry/mergeConceptPatches.js";
import { mergeItemPatches } from "../src/content/registry/mergeItemPatches.js";
import { validateContentIndex } from "../src/content/registry/validateContent.js";
import { buildTracks } from "../src/content/registry/mergeTrackPatches.js";
import { buildSearchIndex } from "../src/content/registry/buildSearchIndex.js";

const root = path.resolve("src/content/modules");

function findModuleFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findModuleFiles(p));
    else if (entry.isFile() && entry.name === "index.js") out.push(p);
  }
  return out;
}

const files = findModuleFiles(root).sort();
const modules = [];
for (const file of files) {
  const mod = (await import(pathToFileURL(file))).default;
  if (mod && mod.enabled !== false) modules.push(mod);
}

const rawIndex = buildContentIndex(modules);
const warningsBeforeMerge = validateContentIndex(rawIndex, { strictReferences: false }).warnings;
const patchedIndex = {
  ...rawIndex,
  lectures: mergeItemPatches(rawIndex.lectures, rawIndex.lecturePatches, "lectureId"),
  quizzes: mergeItemPatches(rawIndex.quizzes, rawIndex.quizPatches, "quizId"),
  traps: mergeItemPatches(rawIndex.traps, rawIndex.trapPatches, "trapId"),
  answers: mergeItemPatches(rawIndex.answers, rawIndex.answerPatches, "answerId"),
  formulas: mergeItemPatches(rawIndex.formulas, rawIndex.formulaPatches, "formulaId"),
  figures: mergeItemPatches(rawIndex.figures, rawIndex.figurePatches, "figureId")
};
const concepts = mergeConceptPatches(patchedIndex.concepts, patchedIndex.conceptPatches);
const index = { ...patchedIndex, concepts };
const warningsAfterMerge = validateContentIndex(index, { strictReferences: false }).warnings;
const tracks = buildTracks(index.trackPatches);
const searchIndex = buildSearchIndex(index);

console.log(JSON.stringify({
  modules: modules.length,
  counts: {
    lectures: index.lectures.length,
    concepts: index.concepts.length,
    conceptPatches: index.conceptPatches.length,
    quizzes: index.quizzes.length,
    traps: index.traps.length,
    answers: index.answers.length,
    formulas: index.formulas.length,
    figures: index.figures.length,
    trackPatches: index.trackPatches.length,
    reviewPatches: index.reviewPatches.length,
    tracks: tracks.length,
    searchItems: searchIndex.length
  },
  warningsBeforeMerge: warningsBeforeMerge.length,
  warningsAfterMerge: warningsAfterMerge.length,
  sampleWarnings: warningsAfterMerge.slice(0, 20)
}, null, 2));
