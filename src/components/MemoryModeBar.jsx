import { useMemoryMode } from "../content/MemoryModeProvider.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";

export function MemoryModeBar() {
  const { mode, toggleModeKey } = useMemoryMode();
  const { ui } = useLanguage();
  const controls = [
    { key: "focusMode", title: ui("focusMode"), hint: ui("focusModeHint") },
    { key: "compactCards", title: ui("compactCards"), hint: ui("compactCardsHint") },
    { key: "reduceMotion", title: ui("lowMotion"), hint: ui("lowMotionHint") }
  ];

  return (
    <div className="sidebar-control-card" aria-label={ui("memoryModeControls")}>
      <div className="sidebar-section-title">{ui("studyModifiers")}</div>
      <div className="memory-mode-bar">
        {controls.map((control) => (
          <button
            key={control.key}
            className={`mode-chip ${mode[control.key] ? "active" : ""}`}
            onClick={() => toggleModeKey(control.key)}
            type="button"
            title={control.hint}
          >
            <span>{control.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
