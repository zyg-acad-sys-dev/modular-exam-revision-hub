import { useState } from "react";
import { BilingualText } from "./BilingualText.jsx";
import { useLanguage } from "../content/LanguageProvider.jsx";

export function TrapCard({ trap, compact = false }) {
  const [open, setOpen] = useState(compact);
  const { ui } = useLanguage();

  return (
    <article className={`trap-card trap-card-v2 ${compact ? "compact" : ""} ${open ? "is-open" : "is-closed"}`.trim()}>
      <div className="semantic-card-head"><span className="semantic-icon danger-icon">⚠</span><div className="semantic-card-copy"><div className="eyebrow">{ui("commonTraps")}</div>{trap.priority && <span className="tier">{trap.priority}</span>}</div></div>
      <div className="trap-contrast">
        <div className="trap-side wrong-side"><strong>{ui("wrong")} ❌</strong><BilingualText item={trap} field="wrong" fallback={trap.wrong} as="p" /></div>
        {open && <div className="trap-side correct-side"><strong>{ui("correctLabel")} ✅</strong><BilingualText item={trap} field="correct" fallback={trap.correct} as="p" />{trap.why && <div className="why-box"><strong>{ui("why")}?</strong><BilingualText item={trap} field="why" fallback={trap.why} as="p" /></div>}</div>}
      </div>
      {!compact && <button type="button" className="secondary-button" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{open ? ui("collapse") : ui("revealAnswer")}</button>}
    </article>
  );
}
