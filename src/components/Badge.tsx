type BadgeProps = {
  label: string;
  variant?: "invite" | "age" | "location";
};

const variantStyles = {
  invite: "bg-amber-900/50 text-amber-300 border-amber-700",
  age: "bg-blue-900/50 text-blue-300 border-blue-700",
  location: "bg-green-900/50 text-green-300 border-green-700",
};

export function Badge({ label, variant = "age" }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-medium border ${variantStyles[variant]}`}
    >
      {label}
    </span>
  );
}
