import { useLanguage } from "../content/LanguageProvider.jsx";

function polarToCartesian(center, radius, angle) {
  return {
    x: center + radius * Math.cos(angle),
    y: center + radius * Math.sin(angle)
  };
}

function polygonPoints(items, center, radius, useValue = false) {
  return items.map((item, index) => {
    const angle = (-Math.PI / 2) + (index * 2 * Math.PI) / items.length;
    const distance = useValue ? radius * (item.value / 100) : radius;
    return polarToCartesian(center, distance, angle);
  });
}

export function WeakAreaRadar({ items = [] }) {
  const { ui } = useLanguage();
  if (items.length === 0) return null;

  const size = 320;
  const center = size / 2;
  const radius = 98;
  const frameLevels = [0.25, 0.5, 0.75, 1];
  const framePolygons = frameLevels.map((level) =>
    polygonPoints(items, center, radius * level).map((point) => `${point.x},${point.y}`).join(" ")
  );
  const axes = polygonPoints(items, center, radius);
  const dataPolygon = polygonPoints(items, center, radius, true).map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="radar-layout">
      <svg viewBox={`0 0 ${size} ${size}`} className="radar-svg" role="img" aria-label={ui("weakAreaRadarChart")}>
        {framePolygons.map((points, index) => (
          <polygon key={points} points={points} className={`radar-web level-${index + 1}`} />
        ))}
        {axes.map((point) => (
          <line key={`${point.x}-${point.y}`} x1={center} y1={center} x2={point.x} y2={point.y} className="radar-axis" />
        ))}
        <polygon points={dataPolygon} className="radar-fill" />
        <polygon points={dataPolygon} className="radar-stroke" />
        {polygonPoints(items, center, radius, true).map((point) => (
          <circle key={`${point.x}-${point.y}`} cx={point.x} cy={point.y} r="4" className="radar-point" />
        ))}
      </svg>

      <div className="radar-legend">
        {items.map((item) => (
          <div className="radar-legend-row" key={item.id}>
            <div>
              <strong>{item.shortLabel}</strong>
              <span>{item.label}</span>
            </div>
            <div className="radar-bar">
              <i style={{ width: `${Math.max(8, item.value)}%` }} />
            </div>
            <small>{item.value}%</small>
          </div>
        ))}
      </div>
    </div>
  );
}
