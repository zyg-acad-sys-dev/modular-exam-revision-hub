export function StatCard({ label, value, note, tone = "blue", kicker }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      {kicker && <div className="stat-kicker">{kicker}</div>}
      <strong>{value}</strong>
      <span>{label}</span>
      {note && <small>{note}</small>}
    </div>
  );
}
