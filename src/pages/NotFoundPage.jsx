import { Link } from "react-router-dom";
import { useLanguage } from "../content/LanguageProvider.jsx";

export function NotFoundPage() {
  const { ui } = useLanguage();
  return (
    <div className="page-stack">
      <header className="hero-panel compact theme-blue">
        <div className="eyebrow">404</div>
        <h1>{ui("pageNotFoundTitle")}</h1>
        <p>{ui("pageNotFoundBody")}</p>
        <div className="hero-actions"><Link className="primary-button" to="/">{ui("backToOverview")}</Link></div>
      </header>
    </div>
  );
}
