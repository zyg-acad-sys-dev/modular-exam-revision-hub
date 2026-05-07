import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { buildContentIndex } from "../src/content/registry/buildContentIndex.js";
import { mergeConceptPatches } from "../src/content/registry/mergeConceptPatches.js";
import { buildTracks } from "../src/content/registry/mergeTrackPatches.js";
import { buildSearchIndex } from "../src/content/registry/buildSearchIndex.js";

const root = path.resolve("src/content/modules");
const outDir = path.resolve("public/exports");

function findModuleFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findModuleFiles(p));
    else if (entry.isFile() && entry.name === "index.js") out.push(p);
  }
  return out;
}

function weekNumber(lectureId = "") {
  const match = String(lectureId).match(/w(\d+)/i);
  return match ? Number(match[1]) : 999;
}

function sortByWeek(items = []) {
  return [...items].sort((a, b) => {
    const aw = Math.min(...(a.relatedLectureIds || ["w99"]).map(weekNumber));
    const bw = Math.min(...(b.relatedLectureIds || ["w99"]).map(weekNumber));
    if (aw !== bw) return aw - bw;
    return String(a.title || a.question || a.id).localeCompare(String(b.title || b.question || b.id));
  });
}

function groupByLecture(items = []) {
  const groups = new Map();
  for (const item of items) {
    const key = item.relatedLectureIds?.[0] || "other";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.entries()].sort(([a], [b]) => weekNumber(a) - weekNumber(b));
}

function groupReviewPatches(patches = []) {
  const sections = {};
  for (const patch of patches) {
    const section = sections[patch.section] || { addConceptIds: [], addAnswerIds: [], addFormulaIds: [], addTrapIds: [], addFigureIds: [], addItems: [] };
    for (const key of Object.keys(section)) section[key].push(...(patch[key] || []));
    sections[patch.section] = section;
  }
  for (const section of Object.values(sections)) {
    for (const key of Object.keys(section)) section[key] = [...new Set(section[key])];
  }
  return sections;
}

function byId(items = []) { return Object.fromEntries(items.map((item) => [item.id, item])); }
function getByIds(items = [], ids = []) { const map = byId(items); return (ids || []).map((id) => map[id]).filter(Boolean); }
function moduleLabel(index, id) {
  const l = index.lectures.find((x) => x.id === id);
  return l ? `${String(l.id).replace("w", "M").toUpperCase()} · ${l.title}` : (id === "other" ? "Other / Extensions" : id);
}
function write(name, text) { fs.writeFileSync(path.join(outDir, name), text.trim() + "\n", "utf8"); }

const files = findModuleFiles(root).sort();
const modules = [];
for (const file of files) {
  const mod = (await import(pathToFileURL(file))).default;
  if (mod && mod.enabled !== false) modules.push(mod);
}
const rawIndex = buildContentIndex(modules);
const concepts = mergeConceptPatches(rawIndex.concepts, rawIndex.conceptPatches);
const index = { ...rawIndex, concepts, tracks: buildTracks(rawIndex.trackPatches) };
const searchItems = buildSearchIndex(index);
const reviewSections = groupReviewPatches(index.reviewPatches);
const review = {
  coreConcepts: getByIds(index.concepts, reviewSections["core-topics"]?.addConceptIds),
  highAnswers: getByIds(index.answers, reviewSections["high-probability-long-answers"]?.addAnswerIds),
  formulas: getByIds(index.formulas, reviewSections["calculation-sheet"]?.addFormulaIds),
  traps: getByIds(index.traps, reviewSections["common-traps"]?.addTrapIds),
  figures: getByIds(index.figures, reviewSections["figure-recognition"]?.addFigureIds),
  lastItems: reviewSections["last-30-minute-review"]?.addItems || []
};

fs.mkdirSync(outDir, { recursive: true });

let cheat = `# Modular Revision Printable Cheat Sheet\n\nGenerated from ${modules.length} modular content packs.\n\n## System Evolution\n\nLearning science → Cognitive diagnosis → AI ingestion → Prototype engineering → Personalized review → Research extension\n\n## Last 30-Minute Lines\n`;
review.lastItems.slice(0, 60).forEach((item, i) => { cheat += `\n${i + 1}. ${item}`; });
cheat += `\n\n## Core Concepts\n`;
review.coreConcepts.filter((c) => c.priority === "high").slice(0, 50).forEach((c) => { cheat += `\n### ${c.title}\n${c.shortDefinition || c.exam?.shortAnswer || ""}\n`; });
cheat += `\n## Formula Anchors\n`;
review.formulas.slice(0, 30).forEach((f) => { cheat += `\n### ${f.title}\n\n\`${f.latex}\`\n\n${f.examNote || ""}\n`; });
cheat += `\n## Common Traps\n`;
review.traps.slice(0, 40).forEach((t) => { cheat += `\n### Wrong: ${t.wrong}\n**Correct:** ${t.correct}\n\n${t.why ? `**Why:** ${t.why}` : ""}\n`; });
write("cheat-sheet.md", cheat);

let answers = `# Modular Revision Long-Answer Sheet\n\n${index.answers.length} answer templates grouped by module.\n`;
for (const [lectureId, items] of groupByLecture(sortByWeek(index.answers))) {
  answers += `\n## ${moduleLabel(index, lectureId)}\n`;
  items.forEach((a) => {
    answers += `\n### ${a.question}\n\n`;
    if (a.keywords?.length) answers += `**Keywords:** ${a.keywords.join(" · ")}\n\n`;
    if (a.skeleton?.length) answers += a.skeleton.map((s, i) => `${i + 1}. ${s}`).join("\n") + "\n\n";
    if (a.fullAnswer) answers += `**Full answer:** ${a.fullAnswer}\n\n`;
    if (a.commonMistakes?.length) answers += `**Common mistakes:** ${a.commonMistakes.join(" | ")}\n\n`;
  });
}
write("long-answers.md", answers);

let traps = `# Modular Revision Trap Sheet\n\nWrong → Correct → Why. ${index.traps.length} traps grouped by module.\n`;
for (const [lectureId, items] of groupByLecture(sortByWeek(index.traps))) {
  traps += `\n## ${moduleLabel(index, lectureId)}\n`;
  items.forEach((t) => { traps += `\n### Wrong: ${t.wrong}\n**Correct:** ${t.correct}\n\n${t.why ? `**Why:** ${t.why}\n` : ""}`; });
}
write("traps.md", traps);

let formulas = `# Modular Revision Formula Sheet\n\n${index.formulas.length} formulas grouped by module.\n`;
for (const [lectureId, items] of groupByLecture(sortByWeek(index.formulas))) {
  formulas += `\n## ${moduleLabel(index, lectureId)}\n`;
  items.forEach((f) => {
    formulas += `\n### ${f.title}\n\n\`${f.latex}\`\n\n`;
    if (f.variables?.length) formulas += `**Variables:**\n${f.variables.map((v) => `- ${v.symbol}: ${v.meaning}`).join("\n")}\n\n`;
    if (f.example) formulas += `**Example:** ${f.example}\n\n`;
    if (f.examNote) formulas += `**Exam note:** ${f.examNote}\n\n`;
  });
}
write("formulas.md", formulas);

let quiz = `# Modular Revision Offline Quiz Sheet\n\n${index.quizzes.length} quiz items. Try questions first, then check answer key.\n`;
for (const [lectureId, items] of groupByLecture(sortByWeek(index.quizzes))) {
  quiz += `\n## ${moduleLabel(index, lectureId)}\n`;
  items.forEach((q, i) => {
    quiz += `\n${i + 1}. ${q.question}\n`;
    if (q.options?.length) quiz += q.options.map((o, idx) => `   ${String.fromCharCode(65 + idx)}. ${o}`).join("\n") + "\n";
  });
}
quiz += `\n# Answer Key\n`;
for (const [lectureId, items] of groupByLecture(sortByWeek(index.quizzes))) {
  quiz += `\n## ${moduleLabel(index, lectureId)}\n`;
  items.forEach((q, i) => {
    const answer = q.correctAnswers ? q.correctAnswers.join("; ") : q.correctAnswer;
    quiz += `\n${i + 1}. **${answer || "See explanation"}**${q.explanation ? ` — ${q.explanation}` : ""}`;
  });
  quiz += "\n";
}
write("quiz-sheet.md", quiz);

write("manifest.json", JSON.stringify({
  generatedAt: new Date().toISOString(),
  modules: modules.length,
  counts: {
    lectures: index.lectures.length,
    concepts: index.concepts.length,
    quizzes: index.quizzes.length,
    traps: index.traps.length,
    answers: index.answers.length,
    formulas: index.formulas.length,
    figures: index.figures.length,
    searchItems: searchItems.length
  },
  files: ["cheat-sheet.md", "long-answers.md", "traps.md", "formulas.md", "quiz-sheet.md"]
}, null, 2));

console.log(JSON.stringify({ ok: true, outDir, files: fs.readdirSync(outDir).sort() }, null, 2));
