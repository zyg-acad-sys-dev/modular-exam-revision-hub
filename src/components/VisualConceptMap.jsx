import { useLanguage } from "../content/LanguageProvider.jsx";

export function VisualConceptMap({ visualMap, conceptsById = {}, onOpenConcept }) {
  const { ui } = useLanguage();
  if (!visualMap) return null;

  const nodes = visualMap.nodes || [];
  const edges = visualMap.edges || [];

  return (
    <div className="memory-map" aria-label={visualMap.title || ui("visualMemoryMap")}>
      <div className="memory-map-canvas">
        {nodes.map((nodeId, index) => {
          const concept = conceptsById[nodeId];
          const label = concept?.title || nodeId.replaceAll("-", " ");
          const clickable = Boolean(concept && onOpenConcept);
          return (
            <div className="map-node-wrap" key={nodeId}>
              <button
                type="button"
                className={`map-node shape-${index % 5} ${clickable ? "clickable" : ""}`}
                onClick={() => clickable && onOpenConcept(concept)}
                disabled={!clickable}
              >
                <strong>{label}</strong>
                {concept?.shortDefinition && <span>{concept.shortDefinition}</span>}
              </button>
              {index < nodes.length - 1 && <div className="map-arrow">→</div>}
            </div>
          );
        })}
      </div>
      {edges.length > 0 && (
        <details className="map-details">
          <summary>{ui("showMapLinks")}</summary>
          <div className="map-edge-list">
            {edges.map(([from, to]) => (
              <span key={`${from}-${to}`}>{from.replaceAll("-", " ")} → {to.replaceAll("-", " ")}</span>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
