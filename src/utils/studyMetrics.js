function dayKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function shiftDays(baseDate, offset) {
  const out = new Date(baseDate);
  out.setDate(out.getDate() + offset);
  return out;
}

export function getActivityScore(entry = {}) {
  return Number(entry.quizAttempts || 0) + Number(entry.reviews || 0);
}

export function buildStudySummary(progress = {}) {
  const attempts = Object.values(progress.attempts || {});
  const reviews = Object.values(progress.reviews || {});
  const bookmarks = Object.values(progress.bookmarks || {});
  const dailyLog = progress.dailyLog || {};
  const today = new Date();
  const todayEntry = dailyLog[dayKey(today)] || { quizAttempts: 0, correct: 0, reviews: 0 };

  let streak = 0;
  for (let index = 0; index < 365; index += 1) {
    const key = dayKey(shiftDays(today, -index));
    if (getActivityScore(dailyLog[key]) > 0) streak += 1;
    else break;
  }

  const activeDays = Object.values(dailyLog).filter((entry) => getActivityScore(entry) > 0).length;
  const activeLast14 = Array.from({ length: 14 }, (_, index) => dayKey(shiftDays(today, -index)))
    .filter((key) => getActivityScore(dailyLog[key]) > 0)
    .length;
  const correctAnswers = attempts.reduce((sum, attempt) => sum + Number(attempt.correct || 0), 0);
  const totalAttempts = attempts.reduce((sum, attempt) => sum + Number(attempt.total || 0), 0);
  const dueCount = reviews.filter((review) => !review.dueAt || new Date(review.dueAt).getTime() <= Date.now()).length;
  const weakCount = reviews.filter((review) => ["again", "hard"].includes(review.rating)).length;
  const reviewWins = reviews.filter((review) => ["good", "easy"].includes(review.rating)).length;

  return {
    attempts,
    reviews,
    bookmarks,
    todayEntry,
    streak,
    activeDays,
    activeLast14,
    totalAttempts,
    correctAnswers,
    dueCount,
    weakCount,
    bookmarkCount: bookmarks.length,
    wrongQuizCount: attempts.filter((attempt) => attempt.type === "quiz" && Number(attempt.wrong || 0) > 0).length,
    totalReviews: reviews.length,
    reviewWins
  };
}

export function buildHeatmapCells(dailyLog = {}, days = 28) {
  const today = new Date();
  const cells = Array.from({ length: days }, (_, index) => {
    const date = shiftDays(today, -(days - index - 1));
    const key = dayKey(date);
    const total = getActivityScore(dailyLog[key]);
    return {
      key,
      total,
      dayLabel: date.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 1),
      dayNumber: String(date.getDate()),
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      }),
      isToday: key === dayKey(today)
    };
  });

  const maxTotal = Math.max(1, ...cells.map((cell) => cell.total));

  return cells.map((cell) => ({
    ...cell,
    level: cell.total === 0 ? 0 : Math.min(4, Math.max(1, Math.ceil((cell.total / maxTotal) * 4)))
  }));
}
