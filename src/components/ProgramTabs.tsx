import { type Program } from "@/lib/constants";
import { Pill } from "./Pill";

type ProgramTabsProps = {
  programs: readonly Program[];
  active: Program;
  onSelect: (p: Program) => void;
};

export function ProgramTabs({ programs, active, onSelect }: ProgramTabsProps) {
  return (
    <div className="flex gap-2">
      {programs.map((p) => (
        <Pill key={p} label={p} active={active === p} onClick={() => onSelect(p)} />
      ))}
    </div>
  );
}
