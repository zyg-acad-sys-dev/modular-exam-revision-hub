import { startTransition, useEffect, useRef, useState } from "react";
import { useLanguage } from "../content/LanguageProvider.jsx";

function clampIndex(index, length) {
  if (length <= 0) return 0;
  return Math.min(length - 1, Math.max(0, index));
}

function setPointerVars(node, clientX, clientY) {
  if (!node) return;
  const rect = node.getBoundingClientRect();
  const px = (clientX - rect.left) / rect.width;
  const py = (clientY - rect.top) / rect.height;
  const rotateY = (px - 0.5) * 10;
  const rotateX = (0.5 - py) * 10;
  node.style.setProperty("--pointer-rotate-x", `${rotateX.toFixed(2)}deg`);
  node.style.setProperty("--pointer-rotate-y", `${rotateY.toFixed(2)}deg`);
  node.style.setProperty("--pointer-glow-x", `${(px * 100).toFixed(2)}%`);
  node.style.setProperty("--pointer-glow-y", `${(py * 100).toFixed(2)}%`);
}

function resetPointerVars(node) {
  if (!node) return;
  node.style.setProperty("--pointer-rotate-x", "0deg");
  node.style.setProperty("--pointer-rotate-y", "0deg");
  node.style.setProperty("--pointer-glow-x", "50%");
  node.style.setProperty("--pointer-glow-y", "50%");
}

export function CoverflowRail({
  items,
  renderItem,
  renderExpandedItem,
  getKey = (item, index) => item?.id || index,
  ariaLabel,
  className = "",
  stageHeight
}) {
  const { ui } = useLanguage();
  const shellRef = useRef(null);
  const itemRefs = useRef([]);
  const trackRef = useRef(null);
  const expandedSurfaceRef = useRef(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(() => clampIndex(Math.floor((items.length - 1) / 2), items.length));
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isPointerInside, setIsPointerInside] = useState(false);

  activeIndexRef.current = activeIndex;

  useEffect(() => {
    const nextIndex = clampIndex(activeIndexRef.current, items.length);
    itemRefs.current = itemRefs.current.slice(0, items.length);
    if (nextIndex !== activeIndexRef.current) {
      setActiveIndex(nextIndex);
    }
    if (expandedIndex != null && nextIndex !== expandedIndex) {
      setExpandedIndex(items.length ? nextIndex : null);
    }
  }, [expandedIndex, items.length]);

  useEffect(() => {
    if (expandedIndex == null) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setExpandedIndex(null);
      } else if (event.key === "ArrowLeft") {
        moveToIndex(activeIndexRef.current - 1);
      } else if (event.key === "ArrowRight") {
        moveToIndex(activeIndexRef.current + 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [expandedIndex]);

  useEffect(() => {
    const onWheel = (event) => {
      const track = trackRef.current;
      const expandedBody = expandedSurfaceRef.current?.querySelector(".coverflow-expanded-body");
      const target = event.target;

      if (expandedIndex == null) {
        if (!track || !track.contains(target)) return;
        const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
        if (Math.abs(delta) < 1) return;
        event.preventDefault();
        track.scrollBy({
          left: delta * 1.12,
          behavior: "auto"
        });
        return;
      }

      if (!expandedBody || !expandedBody.contains(target)) return;
      event.preventDefault();
      expandedBody.scrollBy({
        top: event.deltaY,
        left: event.deltaX,
        behavior: "auto"
      });
    };

    window.addEventListener("wheel", onWheel, { capture: true, passive: false });
    return () => window.removeEventListener("wheel", onWheel, { capture: true });
  }, [expandedIndex]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || items.length <= 1 || expandedIndex != null) return undefined;

    let frame = 0;
    const syncActiveCard = () => {
      frame = 0;
      const railBox = track.getBoundingClientRect();
      const railCenter = railBox.left + railBox.width / 2;
      let bestIndex = activeIndexRef.current;
      let bestDistance = Number.POSITIVE_INFINITY;

      itemRefs.current.forEach((node, index) => {
        if (!node) return;
        const cardBox = node.getBoundingClientRect();
        const cardCenter = cardBox.left + cardBox.width / 2;
        const distance = Math.abs(railCenter - cardCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      if (bestIndex !== activeIndexRef.current) {
        startTransition(() => setActiveIndex(bestIndex));
      }
    };

    const queueSync = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(syncActiveCard);
    };

    const resizeObserver = new ResizeObserver(queueSync);
    resizeObserver.observe(track);
    itemRefs.current.forEach((node) => {
      if (node) resizeObserver.observe(node);
    });

    track.addEventListener("scroll", queueSync, { passive: true });
    queueSync();

    return () => {
      track.removeEventListener("scroll", queueSync);
      resizeObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [expandedIndex, items.length]);

  const scrollTrackToIndex = (index, smooth = true) => {
    const track = trackRef.current;
    const node = itemRefs.current[index];
    if (!track || !node) return;

    const trackRect = track.getBoundingClientRect();
    const nodeRect = node.getBoundingClientRect();
    const nodeCenter = nodeRect.left - trackRect.left + track.scrollLeft + nodeRect.width / 2;
    const targetLeft = Math.max(0, nodeCenter - track.clientWidth / 2);

    track.scrollTo({
      left: targetLeft,
      behavior: smooth ? "smooth" : "auto"
    });
  };

  const moveToIndex = (nextIndex) => {
    const boundedIndex = clampIndex(nextIndex, items.length);
    startTransition(() => {
      setActiveIndex(boundedIndex);
      if (expandedIndex != null) setExpandedIndex(boundedIndex);
    });
    if (expandedIndex == null) {
      scrollTrackToIndex(boundedIndex, true);
    }
  };

  const handleWheel = (event) => {
    if (expandedIndex != null) return;
    const track = trackRef.current;
    if (!track) return;
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    if (Math.abs(delta) < 4) return;
    event.preventDefault();
    track.scrollBy({
      left: delta * 1.12,
      behavior: "smooth"
    });
  };

  const openExpanded = (index) => {
    startTransition(() => {
      setActiveIndex(index);
      setExpandedIndex(index);
    });
  };

  const currentIndex = expandedIndex ?? activeIndex;
  const currentItem = items[currentIndex];
  const isExpanded = expandedIndex != null;

  return (
    <div
      className={`coverflow-shell ${isExpanded ? "is-expanded" : ""} ${className}`.trim()}
      style={stageHeight ? { "--coverflow-stage-height": stageHeight } : undefined}
    >
      <div
        ref={shellRef}
        className={`coverflow-stage ${isExpanded ? "is-expanded" : ""}`.trim()}
        onPointerEnter={() => setIsPointerInside(true)}
        onPointerLeave={() => setIsPointerInside(false)}
      >
        {items.length > 1 && !isExpanded && (
          <button
            type="button"
            className="coverflow-nav coverflow-nav-prev"
            onClick={() => moveToIndex(currentIndex - 1)}
            aria-label={ui("showPreviousCard")}
          >
            {"<"}
          </button>
        )}

        <div
          className="coverflow-track"
          ref={trackRef}
          role="list"
          aria-label={ariaLabel}
          aria-hidden={isExpanded}
        >
          {items.map((item, index) => {
            const offset = index - activeIndex;
            const isActive = index === activeIndex;
            return (
              <div
                key={getKey(item, index)}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                role="listitem"
                className={`coverflow-card-slot ${isActive ? "is-active" : ""}`.trim()}
                style={{
                  "--cover-offset": offset,
                  "--cover-depth": Math.abs(offset)
                }}
              >
                <div
                  className={`coverflow-card-hit ${isActive ? "is-active" : ""}`.trim()}
                  tabIndex={isExpanded ? -1 : 0}
                  role="button"
                  aria-label={`${ariaLabel || ui("coverFlow")} item ${index + 1}`}
                  onClick={() => {
                    if (isExpanded) return;
                    if (!isActive) {
                      moveToIndex(index);
                    } else {
                      openExpanded(index);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (isExpanded) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      if (!isActive) moveToIndex(index);
                      else openExpanded(index);
                    }
                  }}
                  onMouseEnter={() => {
                    if (!isExpanded) setActiveIndex(index);
                  }}
                  onFocus={() => {
                    if (!isExpanded) {
                      setActiveIndex(index);
                      scrollTrackToIndex(index, true);
                    }
                  }}
                  onPointerMove={(event) => setPointerVars(event.currentTarget, event.clientX, event.clientY)}
                  onPointerLeave={(event) => resetPointerVars(event.currentTarget)}
                >
                  {renderItem(item, index, { isActive, activeIndex, expanded: false })}
                </div>
              </div>
            );
          })}
        </div>

        {isExpanded && (
          <div className="coverflow-expanded-overlay">
            <div className="coverflow-expanded-frame">
              <button
                type="button"
                className="coverflow-back"
                onClick={() => setExpandedIndex(null)}
                aria-label={ui("backToCoverFlow")}
              >
                {"<"} {ui("backToCoverFlow")}
              </button>
              <div
                className="coverflow-expanded-view"
                ref={expandedSurfaceRef}
                onPointerMove={(event) => setPointerVars(event.currentTarget, event.clientX, event.clientY)}
                onPointerLeave={(event) => resetPointerVars(event.currentTarget)}
              >
                <div className="coverflow-expanded-body">
                  {currentItem && (renderExpandedItem
                    ? renderExpandedItem(currentItem, currentIndex, {
                      closeExpanded: () => setExpandedIndex(null),
                      moveNext: () => moveToIndex(currentIndex + 1),
                      movePrev: () => moveToIndex(currentIndex - 1)
                    })
                    : renderItem(currentItem, currentIndex, { isActive: true, expanded: true, activeIndex }))}
                </div>
              </div>
            </div>
          </div>
        )}

        {items.length > 1 && !isExpanded && (
          <button
            type="button"
            className="coverflow-nav coverflow-nav-next"
            onClick={() => moveToIndex(currentIndex + 1)}
            aria-label={ui("showNextCard")}
          >
            {">"}
          </button>
        )}
      </div>

      {items.length > 1 && !isExpanded && (
        <div className="coverflow-meta">
          <span>{expandedIndex == null ? ui("coverflowBrowseHint") : ui("coverflowBackHint")}</span>
          <strong>{currentIndex + 1} / {items.length}</strong>
        </div>
      )}
    </div>
  );
}
