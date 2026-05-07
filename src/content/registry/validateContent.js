function validateUniqueIds(items, label, issues) {
  const seen = new Set();
  for (const item of items || []) {
    if (!item?.id) {
      issues.errors.push(`[${label}] missing id`);
      continue;
    }
    if (seen.has(item.id)) issues.errors.push(`[${label}] duplicate id: ${item.id}`);
    seen.add(item.id);
  }
}

function addMissingReferences({ items, sourceLabel, field, targetIds, issues, severity = "warn" }) {
  for (const item of items || []) {
    for (const ref of item?.[field] || []) {
      if (!targetIds.has(ref)) {
        issues[severity === "error" ? "errors" : "warnings"].push(
          `[${sourceLabel}] ${item.id || item.title || "unknown"}.${field} references missing id: ${ref}`
        );
      }
    }
  }
}

export function validateContentIndex(index, { strictReferences = false } = {}) {
  const issues = { errors: [], warnings: [] };

  validateUniqueIds(index.lectures, "lectures", issues);
  validateUniqueIds(index.concepts, "concepts", issues);
  validateUniqueIds(index.quizzes, "quizzes", issues);
  validateUniqueIds(index.traps, "traps", issues);
  validateUniqueIds(index.answers, "answers", issues);
  validateUniqueIds(index.formulas, "formulas", issues);
  validateUniqueIds(index.figures, "figures", issues);

  const lectureIds = new Set(index.lectures.map((x) => x.id));
  const conceptIds = new Set(index.concepts.map((x) => x.id));
  const quizIds = new Set(index.quizzes.map((x) => x.id));
  const trapIds = new Set(index.traps.map((x) => x.id));
  const answerIds = new Set(index.answers.map((x) => x.id));
  const formulaIds = new Set(index.formulas.map((x) => x.id));
  const figureIds = new Set(index.figures.map((x) => x.id));

  const severity = strictReferences ? "error" : "warn";
  addMissingReferences({ items: index.concepts, sourceLabel: "concepts", field: "relatedConceptIds", targetIds: conceptIds, issues, severity });
  addMissingReferences({ items: index.concepts, sourceLabel: "concepts", field: "relatedLectureIds", targetIds: lectureIds, issues, severity });
  addMissingReferences({ items: index.concepts, sourceLabel: "concepts", field: "quizIds", targetIds: quizIds, issues, severity });
  addMissingReferences({ items: index.concepts, sourceLabel: "concepts", field: "trapIds", targetIds: trapIds, issues, severity });
  addMissingReferences({ items: index.concepts, sourceLabel: "concepts", field: "answerIds", targetIds: answerIds, issues, severity });
  addMissingReferences({ items: index.concepts, sourceLabel: "concepts", field: "formulaIds", targetIds: formulaIds, issues, severity });
  addMissingReferences({ items: index.concepts, sourceLabel: "concepts", field: "figureIds", targetIds: figureIds, issues, severity });

  addMissingReferences({ items: index.quizzes, sourceLabel: "quizzes", field: "relatedConceptIds", targetIds: conceptIds, issues, severity });
  addMissingReferences({ items: index.traps, sourceLabel: "traps", field: "relatedConceptIds", targetIds: conceptIds, issues, severity });
  addMissingReferences({ items: index.answers, sourceLabel: "answers", field: "relatedConceptIds", targetIds: conceptIds, issues, severity });
  addMissingReferences({ items: index.formulas, sourceLabel: "formulas", field: "relatedConceptIds", targetIds: conceptIds, issues, severity });
  addMissingReferences({ items: index.figures, sourceLabel: "figures", field: "relatedConceptIds", targetIds: conceptIds, issues, severity });

  for (const patch of index.conceptPatches || []) {
    if (!conceptIds.has(patch.conceptId)) {
      issues[severity === "error" ? "errors" : "warnings"].push(
        `[conceptPatches] target conceptId not found: ${patch.conceptId}`
      );
    }
  }

  if (issues.errors.length > 0) {
    const message = issues.errors.join("\n");
    throw new Error(`Content validation failed:\n${message}`);
  }

  return issues;
}
