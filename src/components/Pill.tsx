type PillProps = {
  label: string;
  active: boolean;
  onClick: () => void;
  size?: "sm" | "md";
};

export function Pill({ label, active, onClick, size = "md" }: PillProps) {
  const base = "rounded-full font-medium transition-colors cursor-pointer select-none";
  const sizeStyles = size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-1.5 text-sm";
  const colorStyles = active
    ? "bg-[#C22027] text-white"
    : "bg-surface-card text-surface-muted hover:opacity-80";

  return (
    <button type="button" className={`${base} ${sizeStyles} ${colorStyles}`} onClick={onClick}>
      {label}
    </button>
  );
}
