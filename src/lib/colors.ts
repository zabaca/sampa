import type { Theme } from "./themes";

export type ColorOption = {
  key: string;
  label: string;
  dark: { bg: string; border: string; text: string };
  light: { bg: string; border: string; text: string };
};

export const COLOR_PALETTE: ColorOption[] = [
  { key: "red", label: "Red", dark: { bg: "bg-red-950/50", border: "border-red-700", text: "text-red-400" }, light: { bg: "bg-red-50", border: "border-red-300", text: "text-red-700" } },
  { key: "blue", label: "Blue", dark: { bg: "bg-blue-950/50", border: "border-blue-700", text: "text-blue-400" }, light: { bg: "bg-blue-50", border: "border-blue-300", text: "text-blue-700" } },
  { key: "green", label: "Green", dark: { bg: "bg-green-950/50", border: "border-green-700", text: "text-green-400" }, light: { bg: "bg-green-50", border: "border-green-300", text: "text-green-700" } },
  { key: "purple", label: "Purple", dark: { bg: "bg-purple-950/50", border: "border-purple-700", text: "text-purple-400" }, light: { bg: "bg-purple-50", border: "border-purple-300", text: "text-purple-700" } },
  { key: "amber", label: "Amber", dark: { bg: "bg-amber-950/50", border: "border-amber-700", text: "text-amber-400" }, light: { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700" } },
  { key: "orange", label: "Orange", dark: { bg: "bg-orange-950/50", border: "border-orange-700", text: "text-orange-400" }, light: { bg: "bg-orange-50", border: "border-orange-300", text: "text-orange-700" } },
  { key: "cyan", label: "Cyan", dark: { bg: "bg-cyan-950/50", border: "border-cyan-700", text: "text-cyan-400" }, light: { bg: "bg-cyan-50", border: "border-cyan-300", text: "text-cyan-700" } },
  { key: "pink", label: "Pink", dark: { bg: "bg-pink-950/50", border: "border-pink-700", text: "text-pink-400" }, light: { bg: "bg-pink-50", border: "border-pink-300", text: "text-pink-700" } },
  { key: "teal", label: "Teal", dark: { bg: "bg-teal-950/50", border: "border-teal-700", text: "text-teal-400" }, light: { bg: "bg-teal-50", border: "border-teal-300", text: "text-teal-700" } },
  { key: "rose", label: "Rose", dark: { bg: "bg-rose-950/50", border: "border-rose-700", text: "text-rose-400" }, light: { bg: "bg-rose-50", border: "border-rose-300", text: "text-rose-700" } },
  { key: "indigo", label: "Indigo", dark: { bg: "bg-indigo-950/50", border: "border-indigo-700", text: "text-indigo-400" }, light: { bg: "bg-indigo-50", border: "border-indigo-300", text: "text-indigo-700" } },
  { key: "gray", label: "Gray", dark: { bg: "bg-zinc-800/50", border: "border-zinc-600", text: "text-zinc-300" }, light: { bg: "bg-zinc-100", border: "border-zinc-300", text: "text-zinc-600" } },
];

const COLOR_MAP = Object.fromEntries(COLOR_PALETTE.map((c) => [c.key, c]));

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
  colorOverrides?: Map<string, string>,
  theme: Theme = "dark"
): { bg: string; border: string; text: string } {
  const key = colorOverrides?.get(name) ?? defaultColorKey(name);
  const color = COLOR_MAP[key] ?? COLOR_MAP["gray"];
  return color[theme];
}
