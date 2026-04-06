import { PROGRAMS, type Program } from "@/lib/constants";
import { Pill } from "./Pill";

type ProgramTabsProps = {
  active: Program;
  onSelect: (p: Program) => void;
};

export function ProgramTabs({ active, onSelect }: ProgramTabsProps) {
  return (
    <div className="flex gap-2">
      {PROGRAMS.map((p) => (
        <Pill key={p} label={p} active={active === p} onClick={() => onSelect(p)} />
      ))}
    </div>
  );
}
