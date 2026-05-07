import { useLanguage } from "../content/LanguageProvider.jsx";

export function StudyHeatmap({ cells = [], compact = false }) {
  const { ui } = useLanguage();
  return (
    <div className={`heatmap-shell ${compact ? "compact" : ""}`}>
      <div className="heatmap-grid" aria-label={ui("studyHeatmap")}>
        {cells.map((cell) => (
          <div key={cell.key} className={`heatmap-cell level-${cell.level} ${cell.isToday ? "is-today" : ""}`} title={`${cell.label}: ${cell.total}`}><span>{compact ? cell.dayLabel : cell.dayNumber}</span></div>
        ))}
      </div>
      {!compact && <div className="heatmap-legend"><span>{ui("lower")}</span><div className="heatmap-legend-scale">{[0, 1, 2, 3, 4].map((level) => <i key={level} className={`heatmap-cell level-${level}`} aria-hidden="true" />)}</div><span>{ui("higher")}</span></div>}
    </div>
  );
}
