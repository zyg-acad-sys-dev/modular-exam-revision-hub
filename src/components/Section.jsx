export function Section({ eyebrow, title, subtitle, children, action, className = "" }) {
  return (
    <section className={`section glass-section ${className}`.trim()}>
      <div className="section-header">
        <div className="section-copy">
          {eyebrow && <div className="eyebrow">{eyebrow}</div>}
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action && <div className="section-action">{action}</div>}
      </div>
      {children}
    </section>
  );
}
