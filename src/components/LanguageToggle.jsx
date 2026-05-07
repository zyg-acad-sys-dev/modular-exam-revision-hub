import { languageModes, useLanguage } from "../content/LanguageProvider.jsx";

const modeLabelKeys = {
  zh: ["zhModeLabel", "zhModeHint"],
  mix: ["mixModeLabel", "mixModeHint"],
  en: ["enModeLabel", "enModeHint"]
};

export function LanguageToggle() {
  const { languageMode, setLanguageMode, ui } = useLanguage();
  return (
    <div className="sidebar-control-card language-toggle" aria-label={ui("languageDisplayMode")}>
      <div className="sidebar-section-title">{ui("language")}</div>
      <div className="language-toggle-grid">
        {languageModes.map((mode) => {
          const [labelKey, hintKey] = modeLabelKeys[mode.id] || [];
          return (
            <button
              key={mode.id}
              type="button"
              className={`language-button ${languageMode === mode.id ? "active" : ""}`}
              onClick={() => setLanguageMode(mode.id)}
              title={ui(hintKey)}
            >
              <strong>{ui(labelKey)}</strong>
              <small>{ui(hintKey)}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}
