import { useMemo } from "react";
import { useContent } from "../content/ContentProvider.jsx";
import { byId } from "../utils/contentUtils.js";

export function useLookups() {
  const content = useContent();

  return useMemo(
    () => ({
      ...content,
      lectureById: byId(content.lectures),
      conceptById: byId(content.concepts),
      quizById: byId(content.quizzes),
      trapById: byId(content.traps),
      answerById: byId(content.answers),
      formulaById: byId(content.formulas),
      figureById: byId(content.figures),
      trackById: byId(content.tracks)
    }),
    [content]
  );
}
