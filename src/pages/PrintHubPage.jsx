import { Link } from "react-router-dom";
import { useContent } from "../content/ContentProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";
import { Section } from "../components/Section.jsx";
import { StatCard } from "../components/StatCard.jsx";

const printLinks = [
  ["/print/cheatsheet", "printableCheatSheet", "printableCheatSheetDesc"],
  ["/print/long-answers", "longAnswerSheet", "longAnswerSheetDesc"],
  ["/print/traps", "trapSheet", "trapSheetDesc"],
  ["/print/formulas", "formulaSheet", "formulaSheetDesc"],
  ["/print/quiz", "offlineQuizSheet", "offlineQuizSheetDesc"]
];

const exportLinks = [
  ["/exports/cheat-sheet.md", "cheat-sheet.md"],
  ["/exports/long-answers.md", "long-answers.md"],
  ["/exports/traps.md", "traps.md"],
  ["/exports/formulas.md", "formulas.md"],
  ["/exports/quiz-sheet.md", "quiz-sheet.md"]
];

export function PrintHubPage() {
  const content = useContent();
  const { ui } = useLanguage();
  return (
    <div className="page-stack">
      <header className="hero-panel compact theme-gold">
        <div className="eyebrow">{ui("exportPrintMode")}</div>
        <h1>{ui("printableRevisionPack")}</h1>
        <p>{ui("printHubMainIntro")}</p>
      </header>

      <div className="stat-grid">
        <StatCard label={ui("longAnswers")} value={content.answers.length} />
        <StatCard label={ui("traps")} value={content.traps.length} />
        <StatCard label={ui("formulas")} value={content.formulas.length} />
        <StatCard label={ui("quizItems")} value={content.quizzes.length} />
      </div>

      <Section title={ui("printPages")} eyebrow={ui("browserPrintPdf")}>
        <div className="print-link-grid">
          {printLinks.map(([to, titleKey, descKey]) => (
            <Link to={to} className="print-link-card" key={to}>
              <span>{ui("printable")}</span>
              <h3>{ui(titleKey)}</h3>
              <p>{ui(descKey)}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section title={ui("staticMarkdownExports")} eyebrow={ui("offlineCopy")}>
        <div className="inline-link-grid dense">
          {exportLinks.map(([href, label]) => <a key={href} href={href} download>{label}</a>)}
        </div>
      </Section>
    </div>
  );
}
