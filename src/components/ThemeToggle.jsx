import { themeModes, useTheme } from "../content/ThemeProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { ui } = useLanguage();
  const labels = {
    night: [ui("nightTheme"), ui("nightThemeHint")],
    day: [ui("dayTheme"), ui("dayThemeHint")]
  };

  return (
    <div className="sidebar-control-card theme-toggle" aria-label={ui("themeMode")}>
      <div className="sidebar-section-title">{ui("theme")}</div>
      <div className="theme-toggle-grid">
        {themeModes.map((mode) => {
          const [label, hint] = labels[mode.id] || [mode.label, mode.hint];
          return (
            <button key={mode.id} type="button" className={`theme-button ${theme === mode.id ? "active" : ""}`} onClick={() => setTheme(mode.id)} title={hint}>
              <strong>{label}</strong><small>{hint}</small>
            </button>
          );
        })}
      </div>
    </div>
  );
}
