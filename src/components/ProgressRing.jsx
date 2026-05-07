const toneClass = {
  blue: "tone-blue",
  green: "tone-green",
  gold: "tone-gold",
  pink: "tone-pink",
  purple: "tone-purple",
  orange: "tone-orange"
};

export function ProgressRing({ value = 0, label, note, tone = "blue" }) {
  const safeValue = Math.max(0, Math.min(100, Number(value || 0)));
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (safeValue / 100) * circumference;

  return (
    <div className={`progress-ring ${toneClass[tone] || toneClass.blue}`}>
      <div className="progress-ring-visual">
        <svg viewBox="0 0 120 120" className="ring-svg" aria-hidden="true">
          <circle className="ring-track" cx="60" cy="60" r={radius} />
          <circle
            className="ring-fill"
            cx="60"
            cy="60"
            r={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeOffset
            }}
          />
        </svg>
        <div className="ring-center">
          <strong>{Math.round(safeValue)}%</strong>
          <span>{label}</span>
        </div>
      </div>
      {note && <p>{note}</p>}
    </div>
  );
}
