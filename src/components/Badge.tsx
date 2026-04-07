type BadgeProps = {
  label: string;
  variant?: "invite" | "age" | "location";
};

const variantStyles = {
  invite: "badge-invite",
  age: "badge-age",
  location: "badge-location",
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
