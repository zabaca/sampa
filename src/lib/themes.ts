export type Theme = {
  key: string;
  label: string;
  bg: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  accent: string;
};

export const THEMES: Theme[] = [
  {
    key: "black",
    label: "Black",
    bg: "bg-zinc-950",
    surface: "bg-zinc-900",
    border: "border-zinc-800",
    text: "text-zinc-100",
    textMuted: "text-zinc-400",
    accent: "#C22027",
  },
  {
    key: "white",
    label: "White",
    bg: "bg-white",
    surface: "bg-zinc-50",
    border: "border-zinc-200",
    text: "text-zinc-900",
    textMuted: "text-zinc-500",
    accent: "#C22027",
  },
  {
    key: "blue",
    label: "Blue",
    bg: "bg-slate-950",
    surface: "bg-slate-900",
    border: "border-slate-700",
    text: "text-slate-100",
    textMuted: "text-slate-400",
    accent: "#3B82F6",
  },
  {
    key: "red",
    label: "Red",
    bg: "bg-neutral-950",
    surface: "bg-neutral-900",
    border: "border-neutral-800",
    text: "text-neutral-100",
    textMuted: "text-neutral-400",
    accent: "#C22027",
  },
];

export const DEFAULT_THEME = THEMES[0];
