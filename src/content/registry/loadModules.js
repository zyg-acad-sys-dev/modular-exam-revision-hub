export function loadContentModules() {
  const moduleFiles = import.meta.glob("../modules/**/index.js", {
    eager: true
  });

  return Object.values(moduleFiles)
    .map((m) => m.default)
    .filter(Boolean)
    .filter((m) => m.enabled !== false);
}
