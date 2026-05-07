import { useMemo, useState } from "react";
import { useContent } from "../content/ContentProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { Section } from "../components/Section.jsx";
import { QuizCard } from "../components/QuizCard.jsx";
import { matchesSearch } from "../utils/contentUtils.js";

export function QuizPage() {
  const { quizzes, tracks } = useContent();
  const { ui } = useLanguage();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return quizzes.filter((quiz) => {
      const categoryOk = category === "all" || quiz.category === category;
      return categoryOk && matchesSearch(quiz, query);
    });
  }, [quizzes, query, category]);

  return (
    <div className="page-stack">
      <header className="hero-panel compact theme-blue">
        <div className="eyebrow">{ui("quiz")}</div>
        <h1>{ui("quizPracticeTitle")}</h1>
        <p>{ui("quizPracticeIntro")}</p>
      </header>

      <Section title={ui("filterQuiz")} eyebrow={`${filtered.length} ${ui("questionsShown")}`}>
        <div className="toolbar">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={ui("searchQuestionsPlaceholder")} />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">{ui("allCategories")}</option>
            {tracks.map((track) => <option value={track.id} key={track.id}>{track.title}</option>)}
          </select>
        </div>
      </Section>

      <div className="card-grid two">
        {filtered.map((quiz) => <QuizCard quiz={quiz} key={quiz.id} />)}
      </div>
    </div>
  );
}
