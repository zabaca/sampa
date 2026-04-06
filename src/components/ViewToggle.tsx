type ViewToggleProps = {
  viewMode: "calendar" | "list";
  onToggle: (mode: "calendar" | "list") => void;
};

export function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  const btn = (mode: "calendar" | "list", label: string) => (
    <button
      className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors cursor-pointer ${
        viewMode === mode
          ? "bg-zinc-700 text-white"
          : "text-zinc-400 hover:text-zinc-200"
      }`}
      onClick={() => onToggle(mode)}
    >
      {label}
    </button>
  );

  return (
    <div className="flex bg-zinc-800/50 rounded-lg p-1 gap-1">
      {btn("calendar", "Calendar")}
      {btn("list", "List")}
    </div>
  );
}
