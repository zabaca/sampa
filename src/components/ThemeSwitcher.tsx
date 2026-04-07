"use client";

import { THEMES, type Theme } from "@/lib/themes";

type ThemeSwitcherProps = {
  current: Theme;
  onChange: (theme: Theme) => void;
};

const previewColors: Record<string, string> = {
  black: "bg-zinc-900 border-zinc-600",
  white: "bg-white border-zinc-300",
  blue: "bg-slate-900 border-slate-600",
  red: "bg-neutral-900 border-red-700",
};

export function ThemeSwitcher({ current, onChange }: ThemeSwitcherProps) {
  return (
    <div className="flex gap-1.5">
      {THEMES.map((theme) => (
        <button
          key={theme.key}
          type="button"
          title={theme.label}
          onClick={() => onChange(theme)}
          className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${
            previewColors[theme.key] ?? "bg-zinc-800 border-zinc-600"
          } ${
            current.key === theme.key ? "ring-2 ring-offset-1 ring-offset-zinc-950 ring-white" : ""
          }`}
        />
      ))}
    </div>
  );
}
