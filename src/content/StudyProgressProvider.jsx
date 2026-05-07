import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

const StudyProgressContext = createContext(null);

const defaultProgress = {
  attempts: {},
  reviews: {},
  bookmarks: {},
  dailyLog: {}
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(date, days) {
  const out = new Date(date);
  out.setDate(out.getDate() + days);
  return out.toISOString();
}

function getNextIntervalDays(rating, previous = {}) {
  const current = Number(previous.intervalDays || 0);
  if (rating === "again") return 0;
  if (rating === "hard") return current <= 0 ? 1 : Math.max(1, Math.ceil(current * 1.4));
  if (rating === "good") return current <= 0 ? 2 : Math.max(2, Math.ceil(current * 2.2));
  if (rating === "easy") return current <= 0 ? 4 : Math.max(4, Math.ceil(current * 3.2));
  return 1;
}

function itemKey(type, id) {
  return `${type}:${id}`;
}

export function StudyProgressProvider({ children }) {
  const [progress, setProgress] = useLocalStorage("modular-exam-revision-progress-v1", defaultProgress);

  const api = useMemo(() => {
    const safeProgress = { ...defaultProgress, ...(progress || {}) };

    function write(updater) {
      setProgress((prev) => updater({ ...defaultProgress, ...(prev || {}) }));
    }

    function recordQuizAttempt(quiz, isCorrect) {
      if (!quiz?.id) return;
      const key = itemKey("quiz", quiz.id);
      write((prev) => {
        const old = prev.attempts[key] || {
          type: "quiz",
          id: quiz.id,
          total: 0,
          correct: 0,
          wrong: 0,
          firstSeenAt: new Date().toISOString()
        };
        const next = {
          ...old,
          title: quiz.question,
          category: quiz.category,
          relatedLectureIds: quiz.relatedLectureIds || [],
          relatedConceptIds: quiz.relatedConceptIds || [],
          total: old.total + 1,
          correct: old.correct + (isCorrect ? 1 : 0),
          wrong: old.wrong + (isCorrect ? 0 : 1),
          lastCorrect: Boolean(isCorrect),
          lastSeenAt: new Date().toISOString()
        };
        const day = todayKey();
        const dayLog = prev.dailyLog[day] || { quizAttempts: 0, correct: 0, reviews: 0 };
        return {
          ...prev,
          attempts: { ...prev.attempts, [key]: next },
          dailyLog: {
            ...prev.dailyLog,
            [day]: {
              ...dayLog,
              quizAttempts: dayLog.quizAttempts + 1,
              correct: dayLog.correct + (isCorrect ? 1 : 0)
            }
          }
        };
      });
    }

    function rateReviewItem(type, item, rating) {
      if (!item?.id) return;
      const key = itemKey(type, item.id);
      write((prev) => {
        const old = prev.reviews[key] || {
          type,
          id: item.id,
          total: 0,
          firstSeenAt: new Date().toISOString()
        };
        const intervalDays = getNextIntervalDays(rating, old);
        const now = new Date().toISOString();
        const next = {
          ...old,
          title: item.title || item.question || item.wrong || item.id,
          category: item.category,
          relatedLectureIds: item.relatedLectureIds || [],
          relatedConceptIds: item.relatedConceptIds || [],
          total: old.total + 1,
          rating,
          intervalDays,
          lastSeenAt: now,
          dueAt: addDays(now, intervalDays)
        };
        const day = todayKey();
        const dayLog = prev.dailyLog[day] || { quizAttempts: 0, correct: 0, reviews: 0 };
        return {
          ...prev,
          reviews: { ...prev.reviews, [key]: next },
          dailyLog: {
            ...prev.dailyLog,
            [day]: { ...dayLog, reviews: dayLog.reviews + 1 }
          }
        };
      });
    }

    function toggleBookmark(type, item) {
      if (!item?.id) return;
      const key = itemKey(type, item.id);
      write((prev) => {
        const bookmarks = { ...prev.bookmarks };
        if (bookmarks[key]) delete bookmarks[key];
        else {
          bookmarks[key] = {
            type,
            id: item.id,
            title: item.title || item.question || item.wrong || item.id,
            category: item.category,
            relatedLectureIds: item.relatedLectureIds || [],
            relatedConceptIds: item.relatedConceptIds || [],
            createdAt: new Date().toISOString()
          };
        }
        return { ...prev, bookmarks };
      });
    }

    function resetProgress() {
      setProgress(defaultProgress);
    }

    function isBookmarked(type, id) {
      return Boolean(safeProgress.bookmarks?.[itemKey(type, id)]);
    }

    return {
      progress: safeProgress,
      recordQuizAttempt,
      rateReviewItem,
      toggleBookmark,
      isBookmarked,
      resetProgress
    };
  }, [progress, setProgress]);

  return (
    <StudyProgressContext.Provider value={api}>
      {children}
    </StudyProgressContext.Provider>
  );
}

export function useStudyProgress() {
  const ctx = useContext(StudyProgressContext);
  if (!ctx) throw new Error("useStudyProgress must be used inside StudyProgressProvider");
  return ctx;
}
