type ViewToggleProps = {
  viewMode: "calendar" | "list";
  onToggle: (mode: "calendar" | "list") => void;
};

export function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  const btn = (mode: "calendar" | "list", label: string) => (
    <button
      className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors cursor-pointer ${
        viewMode === mode
          ? "bg-surface-border text-surface-text"
          : "text-surface-muted hover:text-surface-text"
      }`}
      onClick={() => onToggle(mode)}
    >
      {label}
    </button>
  );

  return (
    <div className="flex bg-surface-card rounded-lg p-1 gap-1">
      {btn("calendar", "Calendar")}
      {btn("list", "List")}
    </div>
  );
}
