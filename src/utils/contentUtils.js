export function byId(items = []) {
  return Object.fromEntries(items.map((item) => [item.id, item]));
}

export function getByIds(items = [], ids = []) {
  const map = byId(items);
  return (ids || []).map((id) => map[id]).filter(Boolean);
}

export function weekNumber(lectureId = "") {
  const match = lectureId.match(/w(\d+)/i);
  return match ? Number(match[1]) : 999;
}

export function sortLectures(lectures = []) {
  return [...lectures].sort((a, b) => weekNumber(a.id) - weekNumber(b.id));
}

export function colorClass(color = "blue") {
  const normalized = String(color).toLowerCase();
  if (normalized.includes("green")) return "theme-green";
  if (normalized.includes("orange")) return "theme-orange";
  if (normalized.includes("purple")) return "theme-purple";
  if (normalized.includes("pink")) return "theme-pink";
  if (normalized.includes("gold")) return "theme-gold";
  return "theme-blue";
}

export function compactText(value, length = 160) {
  if (!value) return "";
  return value.length > length ? `${value.slice(0, length).trim()}…` : value;
}

export function normalizeSearch(value = "") {
  return String(value).trim().toLowerCase();
}

function hasOverlap(left = [], right = []) {
  return (left || []).some((item) => (right || []).includes(item));
}

export function itemMatchesTrack(item = {}, trackId = "all", tracks = [], { relationKey } = {}) {
  if (trackId === "all") return true;

  const track = tracks.find((candidate) => candidate.id === trackId);
  if (!track) return false;

  if (item.category === trackId) return true;
  if (relationKey && track[relationKey]?.includes(item.id)) return true;
  if (hasOverlap(item.relatedConceptIds, track.coreConceptIds)) return true;
  if (hasOverlap(item.relatedLectureIds, track.lectureIds)) return true;

  return false;
}

export function matchesSearch(item, query) {
  const q = normalizeSearch(query);
  if (!q) return true;
  const text = [
    item.id,
    item.title,
    item.question,
    item.shortDefinition,
    item.wrong,
    item.correct,
    item.explanation,
    ...(item.keywords || []),
    ...(item.tags || [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return text.includes(q);
}
