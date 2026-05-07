function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function uniqueMerge(base = [], additions = []) {
  const result = [...(base || [])];
  for (const item of additions || []) {
    if (!result.includes(item)) result.push(item);
  }
  return result;
}

export function deepMerge(target = {}, patch = {}) {
  const out = { ...(target || {}) };
  for (const [key, value] of Object.entries(patch || {})) {
    if (key.startsWith("add") || key.endsWith("Id")) continue;
    if (Array.isArray(value)) out[key] = uniqueMerge(out[key], value);
    else if (isObject(value)) out[key] = deepMerge(out[key], value);
    else if (value !== undefined) out[key] = value;
  }
  return out;
}

export function mergeItemPatches(items = [], patches = [], targetField) {
  const merged = structuredClone(items || []);
  for (const patch of patches || []) {
    const id = patch[targetField] || patch.targetId;
    const item = merged.find((x) => x.id === id);
    if (!item) {
      console.warn(`Unknown ${targetField} in item patch: ${id}`);
      continue;
    }
    Object.assign(item, deepMerge(item, patch));
  }
  return merged;
}
