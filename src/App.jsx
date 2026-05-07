import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { WeekPage } from "./pages/WeekPage.jsx";
import { TrackPage } from "./pages/TrackPage.jsx";
import { ReviewPage } from "./pages/ReviewPage.jsx";
import { TrapsPage } from "./pages/TrapsPage.jsx";
import { QuizPage } from "./pages/QuizPage.jsx";
import { FormulaPage } from "./pages/FormulaPage.jsx";
import { FormulaPracticePage } from "./pages/FormulaPracticePage.jsx";
import { FigurePage } from "./pages/FigurePage.jsx";
import { FigurePracticePage } from "./pages/FigurePracticePage.jsx";
import { SearchPage } from "./pages/SearchPage.jsx";
import { SpacedReviewPage } from "./pages/SpacedReviewPage.jsx";
import { MistakeBookPage } from "./pages/MistakeBookPage.jsx";
import { LastThirtyPage } from "./pages/LastThirtyPage.jsx";
import { PriorityDashboardPage } from "./pages/PriorityDashboardPage.jsx";
import { PrintHubPage } from "./pages/PrintHubPage.jsx";
import { PrintableCheatSheetPage } from "./pages/PrintableCheatSheetPage.jsx";
import { PrintableLongAnswersPage } from "./pages/PrintableLongAnswersPage.jsx";
import { PrintableTrapsPage } from "./pages/PrintableTrapsPage.jsx";
import { PrintableFormulaSheetPage } from "./pages/PrintableFormulaSheetPage.jsx";
import { PrintableQuizSheetPage } from "./pages/PrintableQuizSheetPage.jsx";
import { NotFoundPage } from "./pages/NotFoundPage.jsx";
import { ProjectBriefPage } from "./pages/ProjectBriefPage.jsx";

function LegacyWeekRedirect() {
  const { weekId } = useParams();
  return <Navigate to={weekId ? `/module/${weekId}` : "/"} replace />;
}

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/module/:weekId" element={<WeekPage />} />
        <Route path="/brief" element={<ProjectBriefPage />} />
        <Route path="/tracks/:trackId" element={<TrackPage />} />
        <Route path="/review" element={<ReviewPage />} />
        <Route path="/traps" element={<TrapsPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/formulas" element={<FormulaPage />} />
        <Route path="/formulas/practice" element={<FormulaPracticePage />} />
        <Route path="/figures" element={<FigurePage />} />
        <Route path="/figures/practice" element={<FigurePracticePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/study" element={<SpacedReviewPage />} />
        <Route path="/mistakes" element={<MistakeBookPage />} />
        <Route path="/last30" element={<LastThirtyPage />} />
        <Route path="/priority" element={<PriorityDashboardPage />} />
        <Route path="/print" element={<PrintHubPage />} />
        <Route path="/print/cheatsheet" element={<PrintableCheatSheetPage />} />
        <Route path="/print/long-answers" element={<PrintableLongAnswersPage />} />
        <Route path="/print/traps" element={<PrintableTrapsPage />} />
        <Route path="/print/formulas" element={<PrintableFormulaSheetPage />} />
        <Route path="/print/quiz" element={<PrintableQuizSheetPage />} />
        <Route path="/week/:weekId" element={<LegacyWeekRedirect />} />
        <Route path="/weeks/:weekId" element={<LegacyWeekRedirect />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
}
