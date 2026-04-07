export type Theme = "dark" | "light";

export const themeClasses = {
  dark: {
    bg: "bg-zinc-950",
    surface: "bg-zinc-900",
    border: "border-zinc-800",
    text: "text-zinc-100",
    textMuted: "text-zinc-400",
    textHeading: "text-white",
    input: "bg-zinc-800 border-zinc-700 text-zinc-100",
    pill: "bg-zinc-800 text-zinc-400",
    pillHover: "hover:bg-zinc-700 hover:text-zinc-200",
  },
  light: {
    bg: "bg-white",
    surface: "bg-zinc-50",
    border: "border-zinc-200",
    text: "text-zinc-900",
    textMuted: "text-zinc-500",
    textHeading: "text-zinc-900",
    input: "bg-white border-zinc-300 text-zinc-900",
    pill: "bg-zinc-100 text-zinc-600",
    pillHover: "hover:bg-zinc-200 hover:text-zinc-800",
  },
} as const;
