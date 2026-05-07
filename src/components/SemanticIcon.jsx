const categoryIcons = {
  "basic-dl": "🧠",
  "sequence-models": "🔁",
  "cnn-gan": "🖼️",
  "attention-transformer": "🔷",
  "llm-adaptation": "💬",
  "final-review": "⭐"
};

const conceptIconRules = [
  [/gradient|descent|optimizer|learning-rate/i, "∇"],
  [/formula|mse|cross-entropy|loss/i, "ƒx"],
  [/attention|query|key|value|transformer/i, "◇"],
  [/cnn|convolution|pooling|image|fid/i, "▦"],
  [/gan|generator|discriminator/i, "⚔"],
  [/rnn|lstm|gru|seq2seq|hidden/i, "↻"],
  [/bert|gpt|token|prompt|rlhf|lora|adapter/i, "✦"],
  [/trap|wrong|mistake/i, "⚠"],
  [/quiz|question/i, "?"],
  [/figure|visual/i, "▧"]
];

export function getSemanticIcon(item = {}, fallback = "•") {
  if (item.visual?.icon) return item.visual.icon;
  const haystack = `${item.id || ""} ${item.title || ""} ${item.category || ""}`;
  const rule = conceptIconRules.find(([pattern]) => pattern.test(haystack));
  return rule?.[1] || categoryIcons[item.category] || fallback;
}

export function SemanticIcon({ item, className = "" }) {
  return <span className={`semantic-icon ${className}`.trim()}>{getSemanticIcon(item)}</span>;
}
