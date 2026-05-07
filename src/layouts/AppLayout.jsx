import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useContent } from "../content/ContentProvider.jsx";
import { useMemoryMode } from "../content/MemoryModeProvider.jsx";
import { useStudyProgress } from "../content/StudyProgressProvider.jsx";
import { useTheme } from "../content/ThemeProvider.jsx";
import { MemoryModeBar } from "../components/MemoryModeBar.jsx";
import { LanguageToggle } from "../components/LanguageToggle.jsx";
import { ThemeToggle } from "../components/ThemeToggle.jsx";
import { buildStudySummary } from "../utils/studyMetrics.js";
import { useLanguage } from "../content/LanguageProvider.jsx";

const navGroups = (ui) => [
  {
    label: ui("coreLoop"),
    items: [
      ["/", ui("overview"), ui("overviewHint")],
      ["/brief", ui("projectBrief"), ui("projectBriefHint")],
      ["/priority", ui("priority"), ui("priorityHint")],
      ["/study", ui("spacedReview"), ui("spacedReviewHint")],
      ["/mistakes", ui("mistakeBook"), ui("mistakeBookHint")]
    ]
  },
  {
    label: ui("practice"),
    items: [
      ["/review", ui("reviewHub"), ui("reviewHubHint")],
      ["/quiz", ui("quiz"), ui("quizHint")],
      ["/traps", ui("traps"), ui("trapsHint")],
      ["/formulas", ui("formulas"), ui("formulasHint")],
      ["/figures", ui("figures"), ui("figuresHint")],
      ["/last30", ui("last30"), ui("last30Hint")]
    ]
  },
  {
    label: ui("system"),
    items: [
      ["/search", ui("search"), ui("searchHint")],
      ["/print", ui("printPack"), ui("printPackHint")]
    ]
  }
];

function NavCluster({ label, items, onNavigate }) {
  return (
    <div className="nav-cluster">
      <div className="nav-section-title">{label}</div>
      <nav className="nav-list">
        {items.map(([to, title, note]) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`.trim()}
            onClick={() => onNavigate?.(to)}
          >
            <span>{title}</span>
            <small>{note}</small>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function AppLayout({ children }) {
  const location = useLocation();
  const { siteMeta, lectures, tracks } = useContent();
  const { mode } = useMemoryMode();
  const { progress } = useStudyProgress();
  const { theme } = useTheme();
  const { ui } = useLanguage();
  const summary = buildStudySummary(progress);
  const [isMobileShell, setIsMobileShell] = useState(() => (
    typeof window !== "undefined" ? window.innerWidth <= 820 : false
  ));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(() => (
    typeof window !== "undefined" ? window.innerWidth <= 820 && location.pathname === "/" : false
  ));

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncViewport = () => {
      const mobile = window.innerWidth <= 820;
      setIsMobileShell((current) => {
        if (current !== mobile) {
          setMobileMenuOpen(mobile ? location.pathname === "/" : false);
        }
        return mobile;
      });
    };

    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, [location.pathname]);

  const closeMobileMenu = () => {
    if (isMobileShell) setMobileMenuOpen(false);
  };

  const shellClass = [
    "app-shell",
    isMobileShell ? "is-mobile-shell" : "",
    isMobileShell && mobileMenuOpen ? "mobile-menu-open" : "",
    `theme-${theme}`,
    mode.focusMode ? "focus-mode" : "",
    mode.compactCards ? "compact-cards" : "",
    mode.reduceMotion ? "low-motion" : ""
  ].filter(Boolean).join(" ");

  return (
    <div className={shellClass}>
      <div className="aurora-layer aurora-layer-a" aria-hidden="true" />
      <div className="aurora-layer aurora-layer-b" aria-hidden="true" />

      <aside className="sidebar">
        <div className="sidebar-panel">
          <div className="mobile-sidebar-head">
            <Link to="/" className="brand" onClick={() => setMobileMenuOpen(true)}>
              <span className="brand-mark">MRH</span>
              <span>
                <strong>{siteMeta?.title || "Modular Revision Hub"}</strong>
                <small>{siteMeta?.subtitle || ui("aiReadySurface")}</small>
              </span>
            </Link>
            {isMobileShell && location.pathname !== "/" && (
              <button
                type="button"
                className="secondary-button mobile-shell-button"
                onClick={() => setMobileMenuOpen(false)}
              >
                Continue
              </button>
            )}
          </div>

          <div className="sidebar-overview">
            <div className="sidebar-kpi">
              <span>{ui("dueNow")}</span>
              <strong>{summary.dueCount}</strong>
            </div>
            <div className="sidebar-kpi">
              <span>{ui("streak")}</span>
              <strong>{summary.streak}d</strong>
            </div>
            <div className="sidebar-kpi">
              <span>{ui("modules")}</span>
              <strong>{lectures.length}</strong>
            </div>
            <div className="sidebar-kpi">
              <span>{ui("tracks")}</span>
              <strong>{tracks.length}</strong>
            </div>
          </div>

          {navGroups(ui).map((group) => (
            <NavCluster
              key={group.label}
              label={group.label}
              items={group.items}
              onNavigate={closeMobileMenu}
            />
          ))}

          <div className="sidebar-controls">
            <ThemeToggle />
            <LanguageToggle />
            <MemoryModeBar />
          </div>

          <div className="sidebar-note">
            <strong>{ui("aiReadySurface")}</strong>
            <p>{ui("aiReadySurfaceNote")}</p>
          </div>
        </div>
      </aside>

      <main className="main-panel">
        <div className="main-frame">
          <div className="shell-topline">
            <div className="shell-topline-main">
              <div>
                <span className="shell-status">{ui("adaptiveReviewShell")}</span>
                <strong>{ui("shellHeadline")}</strong>
              </div>
              {isMobileShell && !mobileMenuOpen && (
                <button
                  type="button"
                  className="secondary-button mobile-shell-button"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  Menu
                </button>
              )}
            </div>
            <div className="shell-meta">
              <span>{summary.bookmarkCount} saved</span>
              <span>{summary.wrongQuizCount} weak quiz signals</span>
              <span>{theme === "light" ? ui("dayMode") : ui("nightMode")}</span>
            </div>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
