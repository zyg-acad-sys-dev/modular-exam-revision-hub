import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

function LatexFallback({ latex, inline = false, error }) {
  const Tag = inline ? "code" : "pre";
  return (
    <Tag className={inline ? "latex-inline-fallback" : "latex-fallback"}>
      {latex}
      {error ? `\nKaTeX render warning: ${error.message}` : ""}
    </Tag>
  );
}

export function FormulaRenderer({ latex, inline = false, className = "" }) {
  if (!latex) return null;

  const renderError = (error) => (
    <LatexFallback latex={latex} inline={inline} error={error} />
  );

  return (
    <span className={["formula-renderer", inline ? "inline" : "block", className].filter(Boolean).join(" ")}>
      {inline ? (
        <InlineMath math={latex} renderError={renderError} />
      ) : (
        <BlockMath math={latex} renderError={renderError} />
      )}
    </span>
  );
}
