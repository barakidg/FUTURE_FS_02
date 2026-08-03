const LABEL_PALETTE = [
  { bg: "bg-lime-100", text: "text-lime-800", border: "border-lime-200", dark: "dark:bg-lime-500/15 dark:text-lime-300 dark:border-lime-500/30" },
  { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200", dark: "dark:bg-blue-500/15 dark:text-blue-300 dark:border-blue-500/30" },
  { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-200", dark: "dark:bg-orange-500/15 dark:text-orange-300 dark:border-orange-500/30" },
  { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-200", dark: "dark:bg-purple-500/15 dark:text-purple-300 dark:border-purple-500/30" },
  { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-200", dark: "dark:bg-pink-500/15 dark:text-pink-300 dark:border-pink-500/30" },
  { bg: "bg-teal-100", text: "text-teal-800", border: "border-teal-200", dark: "dark:bg-teal-500/15 dark:text-teal-300 dark:border-teal-500/30" },
  { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-200", dark: "dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-500/30" },
  { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-200", dark: "dark:bg-indigo-500/15 dark:text-indigo-300 dark:border-indigo-500/30" },
];

export function getLabelColorClasses(label: string): string {
  let hash = 0;
  for (let i = 0; i < label.length; i++) {
    hash = (hash << 5) - hash + label.charCodeAt(i);
    hash |= 0;
  }
  const swatch = LABEL_PALETTE[Math.abs(hash) % LABEL_PALETTE.length];
  return `${swatch.bg} ${swatch.text} ${swatch.border} ${swatch.dark}`;
}