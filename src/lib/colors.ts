export function classColor(name: string): {
  bg: string;
  border: string;
  text: string;
} {
  const lower = name.toLowerCase();

  if (lower.includes("no-gi") || lower.includes("no gi"))
    return { bg: "bg-red-950/50", border: "border-red-700", text: "text-red-400" };
  if (lower.includes("fundamental"))
    return { bg: "bg-blue-950/50", border: "border-blue-700", text: "text-blue-400" };
  if (lower.includes("intro"))
    return { bg: "bg-green-950/50", border: "border-green-700", text: "text-green-400" };
  if (lower.includes("advanced"))
    return { bg: "bg-purple-950/50", border: "border-purple-700", text: "text-purple-400" };
  if (lower.includes("comp") || lower.includes("competition"))
    return { bg: "bg-amber-950/50", border: "border-amber-700", text: "text-amber-400" };
  if (lower.includes("open mat"))
    return { bg: "bg-zinc-800/50", border: "border-zinc-600", text: "text-zinc-300" };
  if (lower.includes("muay thai") || lower.includes("kickboxing") || lower.includes("striking"))
    return { bg: "bg-orange-950/50", border: "border-orange-700", text: "text-orange-400" };
  if (lower.includes("wrestling"))
    return { bg: "bg-cyan-950/50", border: "border-cyan-700", text: "text-cyan-400" };
  if (lower.includes("little") || lower.includes("tiny"))
    return { bg: "bg-pink-950/50", border: "border-pink-700", text: "text-pink-400" };
  if (lower.includes("all levels") || lower.includes("all-levels"))
    return { bg: "bg-teal-950/50", border: "border-teal-700", text: "text-teal-400" };
  if (lower.includes("boxing"))
    return { bg: "bg-rose-950/50", border: "border-rose-700", text: "text-rose-400" };
  if (lower.includes("drill") || lower.includes("positional"))
    return { bg: "bg-indigo-950/50", border: "border-indigo-700", text: "text-indigo-400" };

  return { bg: "bg-zinc-800/50", border: "border-zinc-600", text: "text-zinc-400" };
}
