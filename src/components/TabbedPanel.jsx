export function TabbedPanel({ tabs, activeTab, onChange, ariaLabel = "Content tabs" }) {
  const current = tabs.find((tab) => tab.id === activeTab) || tabs[0];

  return (
    <div className="tabbed-panel">
      <div className="tab-list" role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-button ${current.id === tab.id ? "active" : ""}`}
            role="tab"
            aria-selected={current.id === tab.id}
            onClick={() => onChange(tab.id)}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && <small>{tab.count}</small>}
          </button>
        ))}
      </div>
      <div className="tab-content" role="tabpanel">
        {current.render()}
      </div>
    </div>
  );
}
