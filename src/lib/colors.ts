export type ColorOption = {
  key: string;
  label: string;
  bg: string;
  border: string;
  text: string;
};

export const COLOR_PALETTE: ColorOption[] = [
  { key: "red", label: "Red", bg: "bg-red-950/50", border: "border-red-700", text: "text-red-400" },
  { key: "blue", label: "Blue", bg: "bg-blue-950/50", border: "border-blue-700", text: "text-blue-400" },
  { key: "green", label: "Green", bg: "bg-green-950/50", border: "border-green-700", text: "text-green-400" },
  { key: "purple", label: "Purple", bg: "bg-purple-950/50", border: "border-purple-700", text: "text-purple-400" },
  { key: "amber", label: "Amber", bg: "bg-amber-950/50", border: "border-amber-700", text: "text-amber-400" },
  { key: "orange", label: "Orange", bg: "bg-orange-950/50", border: "border-orange-700", text: "text-orange-400" },
  { key: "cyan", label: "Cyan", bg: "bg-cyan-950/50", border: "border-cyan-700", text: "text-cyan-400" },
  { key: "pink", label: "Pink", bg: "bg-pink-950/50", border: "border-pink-700", text: "text-pink-400" },
  { key: "teal", label: "Teal", bg: "bg-teal-950/50", border: "border-teal-700", text: "text-teal-400" },
  { key: "rose", label: "Rose", bg: "bg-rose-950/50", border: "border-rose-700", text: "text-rose-400" },
  { key: "indigo", label: "Indigo", bg: "bg-indigo-950/50", border: "border-indigo-700", text: "text-indigo-400" },
  { key: "gray", label: "Gray", bg: "bg-zinc-800/50", border: "border-zinc-600", text: "text-zinc-300" },
];

const COLOR_MAP = Object.fromEntries(COLOR_PALETTE.map((c) => [c.key, c]));

// Default color mapping based on class name (used when no custom color is set)
function defaultColorKey(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("no-gi") || lower.includes("no gi")) return "red";
  if (lower.includes("fundamental")) return "blue";
  if (lower.includes("intro")) return "green";
  if (lower.includes("advanced")) return "purple";
  if (lower.includes("comp") || lower.includes("competition")) return "amber";
  if (lower.includes("open mat")) return "gray";
  if (lower.includes("muay thai") || lower.includes("kickboxing") || lower.includes("striking")) return "orange";
  if (lower.includes("wrestling")) return "cyan";
  if (lower.includes("little") || lower.includes("tiny")) return "pink";
  if (lower.includes("all levels") || lower.includes("all-levels")) return "teal";
  if (lower.includes("boxing")) return "rose";
  if (lower.includes("drill") || lower.includes("positional")) return "indigo";
  return "gray";
}

export function classColor(
  name: string,
  colorOverrides?: Map<string, string>
): { bg: string; border: string; text: string } {
  const key = colorOverrides?.get(name) ?? defaultColorKey(name);
  return COLOR_MAP[key] ?? COLOR_MAP["gray"];
}
