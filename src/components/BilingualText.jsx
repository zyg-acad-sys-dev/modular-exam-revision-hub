import { useLanguage, getLocalizedValue } from "../content/LanguageProvider.jsx";

export function BilingualText({
  item,
  field,
  fallback,
  as: Tag = "span",
  className = "",
  zhClassName = "zh-line",
  enClassName = "en-line",
  empty = null
}) {
  const { languageMode } = useLanguage();
  const value = getLocalizedValue(item, field, languageMode, fallback);
  if (!value) return empty;
  if (typeof value === "object" && (value.zh || value.en)) {
    const zh = value.zh;
    const en = value.en;
    if (!zh || zh === en) return <Tag className={className}>{en || zh}</Tag>;
    return (
      <Tag className={`bilingual-text ${className}`.trim()}>
        <span className={zhClassName}>{zh}</span>
        <span className={enClassName}>{en}</span>
      </Tag>
    );
  }
  return <Tag className={className}>{value}</Tag>;
}

export function BilingualBlock({ item, field, fallback, label, className = "" }) {
  return (
    <div className={`bilingual-block ${className}`.trim()}>
      {label && <div className="bilingual-label">{label}</div>}
      <BilingualText item={item} field={field} fallback={fallback} as="p" />
    </div>
  );
}
