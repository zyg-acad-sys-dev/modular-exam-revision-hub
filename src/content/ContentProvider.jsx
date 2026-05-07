import { createContext, useContext, useMemo } from "react";
import { loadContentModules } from "./registry/loadModules.js";
import { buildContentIndex } from "./registry/buildContentIndex.js";
import { mergeConceptPatches } from "./registry/mergeConceptPatches.js";
import { mergeItemPatches } from "./registry/mergeItemPatches.js";
import { validateContentIndex } from "./registry/validateContent.js";
import { buildTracks } from "./registry/mergeTrackPatches.js";
import { buildSearchIndex } from "./registry/buildSearchIndex.js";
import { useLanguage, localizeContentTree } from "./LanguageProvider.jsx";
import { siteMeta } from "./base/siteMeta.js";
import { categoryMeta } from "./base/categoryMeta.js";

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const { languageMode } = useLanguage();

  const content = useMemo(() => {
    const modules = loadContentModules();
    const rawIndex = buildContentIndex(modules);
    validateContentIndex(rawIndex, { strictReferences: false });

    const indexWithItemPatches = {
      ...rawIndex,
      lectures: mergeItemPatches(rawIndex.lectures, rawIndex.lecturePatches, "lectureId"),
      quizzes: mergeItemPatches(rawIndex.quizzes, rawIndex.quizPatches, "quizId"),
      traps: mergeItemPatches(rawIndex.traps, rawIndex.trapPatches, "trapId"),
      answers: mergeItemPatches(rawIndex.answers, rawIndex.answerPatches, "answerId"),
      formulas: mergeItemPatches(rawIndex.formulas, rawIndex.formulaPatches, "formulaId"),
      figures: mergeItemPatches(rawIndex.figures, rawIndex.figurePatches, "figureId")
    };

    const mergedConcepts = mergeConceptPatches(
      indexWithItemPatches.concepts,
      indexWithItemPatches.conceptPatches
    );

    const index = {
      ...indexWithItemPatches,
      concepts: mergedConcepts
    };

    const localizedIndex = localizeContentTree(index, languageMode);
    const tracks = localizeContentTree(buildTracks(index.trackPatches), languageMode);
    const searchIndex = buildSearchIndex(localizedIndex);

    return {
      ...localizedIndex,
      tracks,
      searchIndex,
      siteMeta: localizeContentTree(siteMeta, languageMode),
      categoryMeta: localizeContentTree(categoryMeta, languageMode)
    };
  }, [languageMode]);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) {
    throw new Error("useContent must be used inside ContentProvider");
  }
  return ctx;
}
