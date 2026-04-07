import { useState } from "react";
import type { ClassItem } from "@/lib/constants";
import { DAYS, DAY_FULL } from "@/lib/constants";
import { getTimePeriod, sortByTime } from "@/lib/time";
import { ClassCard } from "./ClassCard";
import { Pill } from "./Pill";

type ListViewProps = {
  classes: ClassItem[];
  editMode: boolean;
  colorMap: Map<string, string>;
  onEdit: (item: ClassItem) => void;
  onDelete: (id: string) => void;
};

export function ListView({ classes, editMode, colorMap, onEdit, onDelete }: ListViewProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<"Morning" | "Evening" | null>(null);

  // Filter
  let filtered = classes;
  if (selectedDay) {
    filtered = filtered.filter((c) => c.day === selectedDay);
  }
  if (selectedPeriod) {
    filtered = filtered.filter((c) => getTimePeriod(c.time) === selectedPeriod);
  }

  // Sort by day order, then time
  const dayOrder = Object.fromEntries(DAYS.map((d, i) => [d, i]));
  filtered.sort((a, b) => {
    const dayDiff = (dayOrder[a.day] ?? 0) - (dayOrder[b.day] ?? 0);
    if (dayDiff !== 0) return dayDiff;
    return sortByTime(a.time, b.time);
  });

  // Group by day
  const grouped = new Map<string, ClassItem[]>();
  for (const c of filtered) {
    const list = grouped.get(c.day) ?? [];
    list.push(c);
    grouped.set(c.day, list);
  }

  const activeDays = DAYS.filter((d) => classes.some((c) => c.day === d));

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Pill
          label="All Days"
          active={selectedDay === null}
          onClick={() => setSelectedDay(null)}
          size="sm"
        />
        {activeDays.map((d) => (
          <Pill
            key={d}
            label={d}
            active={selectedDay === d}
            onClick={() => setSelectedDay(selectedDay === d ? null : d)}
            size="sm"
          />
        ))}
      </div>
      <div className="flex gap-2 mb-6">
        <Pill
          label="All Times"
          active={selectedPeriod === null}
          onClick={() => setSelectedPeriod(null)}
          size="sm"
        />
        <Pill
          label="Morning"
          active={selectedPeriod === "Morning"}
          onClick={() => setSelectedPeriod(selectedPeriod === "Morning" ? null : "Morning")}
          size="sm"
        />
        <Pill
          label="Evening"
          active={selectedPeriod === "Evening"}
          onClick={() => setSelectedPeriod(selectedPeriod === "Evening" ? null : "Evening")}
          size="sm"
        />
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center text-zinc-500 py-12">
          No classes match the selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          {Array.from(grouped.entries()).map(([day, items]) => (
            <div key={day}>
              <h3 className="text-sm font-semibold text-zinc-400 mb-2">
                {DAY_FULL[day as keyof typeof DAY_FULL] ?? day}
              </h3>
              <div className="space-y-2">
                {items.map((item) => (
                  <ClassCard
                    key={item.id}
                    item={item}
                    variant="list"
                    editMode={editMode}
                    colorMap={colorMap}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
