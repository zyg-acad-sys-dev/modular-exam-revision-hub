function routeForRelatedLecture(relatedLectureIds = [], fallback) {
  return relatedLectureIds?.[0] ? `/module/${relatedLectureIds[0]}` : fallback;
}

export function buildSearchIndex(index) {
  return [
    ...index.lectures.map((l) => ({
      type: "lecture",
      id: l.id,
      title: l.title,
      category: l.trackIds?.[0],
      route: `/module/${l.id}`,
      relatedLectureIds: [l.id],
      text: [
        l.title,
        l.subtitle,
        l.mainQuestion,
        ...(l.keywords || []),
        ...(l.examSignals || []), l.i18n?.zh?.title, l.i18n?.zh?.subtitle, l.i18n?.zh?.mainQuestion
      ].filter(Boolean).join(" ")
    })),
    ...index.concepts.map((c) => ({
      type: "concept",
      id: c.id,
      title: c.title,
      category: c.category,
      route: routeForRelatedLecture(c.relatedLectureIds, "/review"),
      relatedLectureIds: c.relatedLectureIds || [],
      text: [
        c.title,
        c.shortDefinition,
        c.overview?.definition,
        c.overview?.whyItMatters,
        c.overview?.keyIdea,
        ...(c.exam?.keywords || []),
        ...(c.exam?.examSignals || []),
        c.i18n?.zh?.title, c.i18n?.zh?.shortDefinition, c.i18n?.zh?.overview?.definition, c.i18n?.zh?.overview?.keyIdea, c.i18n?.zh?.exam?.shortAnswer, ...(c.tags || [])
      ].filter(Boolean).join(" ")
    })),
    ...index.quizzes.map((q) => ({
      type: "quiz",
      id: q.id,
      title: q.question,
      category: q.category,
      route: routeForRelatedLecture(q.relatedLectureIds, "/quiz"),
      relatedLectureIds: q.relatedLectureIds || [],
      text: [q.question, q.explanation, q.i18n?.zh?.question, q.i18n?.zh?.explanation, ...(q.options || []), ...(q.tags || [])]
        .filter(Boolean)
        .join(" ")
    })),
    ...index.traps.map((t) => ({
      type: "trap",
      id: t.id,
      title: t.wrong,
      category: t.category,
      route: routeForRelatedLecture(t.relatedLectureIds, "/traps"),
      relatedLectureIds: t.relatedLectureIds || [],
      text: [t.wrong, t.correct, t.why, t.i18n?.zh?.wrong, t.i18n?.zh?.correct, t.i18n?.zh?.why, ...(t.tags || [])]
        .filter(Boolean)
        .join(" ")
    })),
    ...index.answers.map((a) => ({
      type: "answer",
      id: a.id,
      title: a.question,
      category: a.category,
      route: routeForRelatedLecture(a.relatedLectureIds, "/review"),
      relatedLectureIds: a.relatedLectureIds || [],
      text: [a.question, a.i18n?.zh?.question, ...(a.keywords || []), ...(a.skeleton || []), a.fullAnswer, a.i18n?.zh?.fullAnswer]
        .filter(Boolean)
        .join(" ")
    })),
    ...index.formulas.map((f) => ({
      type: "formula",
      id: f.id,
      title: f.title,
      category: f.category,
      route: routeForRelatedLecture(f.relatedLectureIds, "/formulas"),
      relatedLectureIds: f.relatedLectureIds || [],
      text: [f.title, f.i18n?.zh?.title, f.latex, f.examNote, f.i18n?.zh?.examNote, f.example, ...(f.tags || [])]
        .filter(Boolean)
        .join(" ")
    })),
    ...index.figures.map((fig) => ({
      type: "figure",
      id: fig.id,
      title: fig.title,
      category: fig.category,
      route: routeForRelatedLecture(fig.relatedLectureIds, "/figures"),
      relatedLectureIds: fig.relatedLectureIds || [],
      text: [
        fig.title,
        fig.i18n?.zh?.title,
        fig.alt,
        fig.i18n?.zh?.alt,
        fig.keyVisualCue,
        fig.i18n?.zh?.keyVisualCue,
        fig.recognitionQuestion,
        ...(fig.relatedConceptIds || []),
        ...(fig.tags || [])
      ].filter(Boolean).join(" ")
    }))
  ];
}
