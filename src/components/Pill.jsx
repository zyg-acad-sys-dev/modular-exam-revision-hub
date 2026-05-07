export function Pill({ children, tone = "blue" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}
