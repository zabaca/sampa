import { useState } from "react";
import type { ClassItem, Day } from "@/lib/constants";
import { DAYS, DAY_FULL } from "@/lib/constants";
import { isMorning, sortByTime } from "@/lib/time";
import { ClassCard } from "./ClassCard";

type CalendarViewProps = {
  classes: ClassItem[];
  editMode: boolean;
  onEdit: (item: ClassItem) => void;
  onDelete: (id: string) => void;
  onDrop: (classId: string, day: Day, time: string) => void;
};

export function CalendarView({ classes, editMode, onEdit, onDelete, onDrop }: CalendarViewProps) {
  const [dragOverCell, setDragOverCell] = useState<string | null>(null);

  // In edit mode show all 7 days; otherwise only days with classes
  const activeDays = editMode
    ? [...DAYS]
    : DAYS.filter((d) => classes.some((c) => c.day === d));

  // Split into morning/evening
  const morningClasses = classes.filter((c) => isMorning(c.time));
  const eveningClasses = classes.filter((c) => !isMorning(c.time));

  // Get unique sorted times per section
  const morningTimes = [...new Set(morningClasses.map((c) => c.time))].sort(sortByTime);
  const eveningTimes = [...new Set(eveningClasses.map((c) => c.time))].sort(sortByTime);

  const handleDragStart = (e: React.DragEvent, classId: string) => {
    e.dataTransfer.setData("text/plain", classId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, cellKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCell(cellKey);
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, day: Day, time: string) => {
    e.preventDefault();
    setDragOverCell(null);
    const classId = e.dataTransfer.getData("text/plain");
    if (classId) {
      onDrop(classId, day, time);
    }
  };

  const renderSection = (label: string, times: string[], sectionClasses: ClassItem[]) => {
    if (times.length === 0) return null;

    return (
      <div className="mb-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-3 px-1">
          {label}
        </h3>
        <div className="overflow-x-auto">
          <div
            className="grid gap-px bg-zinc-800/30 rounded-lg min-w-[700px]"
            style={{
              gridTemplateColumns: `80px repeat(${activeDays.length}, 1fr)`,
            }}
          >
            {/* Header row */}
            <div className="p-2" />
            {activeDays.map((day) => (
              <div
                key={day}
                className="p-2 text-center text-xs font-semibold text-zinc-400 border-b border-zinc-800"
              >
                <span className="hidden sm:inline">{DAY_FULL[day]}</span>
                <span className="sm:hidden">{day}</span>
              </div>
            ))}

            {/* Time rows */}
            {times.map((time) => (
              <div key={`row-${time}`} className="contents">
                <div className="p-2 text-xs text-zinc-500 font-medium flex items-start pt-3">
                  {time}
                </div>
                {activeDays.map((day) => {
                  const cellKey = `${day}-${time}`;
                  const cellClasses = sectionClasses.filter(
                    (c) => c.day === day && c.time === time
                  );
                  const isDragOver = dragOverCell === cellKey;

                  return (
                    <div
                      key={cellKey}
                      className={`p-1 min-h-[60px] space-y-1 transition-colors rounded ${
                        editMode ? "cursor-default" : ""
                      } ${isDragOver ? "bg-zinc-700/50 ring-1 ring-zinc-500" : ""}`}
                      onDragOver={editMode ? (e) => handleDragOver(e, cellKey) : undefined}
                      onDragLeave={editMode ? handleDragLeave : undefined}
                      onDrop={editMode ? (e) => handleDrop(e, day, time) : undefined}
                    >
                      {cellClasses.map((cls) => (
                        <ClassCard
                          key={cls.id}
                          item={cls}
                          variant="calendar"
                          editMode={editMode}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          draggable={editMode}
                          onDragStart={(e) => handleDragStart(e, cls.id)}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (classes.length === 0) {
    return (
      <div className="text-center text-zinc-500 py-12">
        No classes scheduled for this program.
      </div>
    );
  }

  return (
    <div>
      {renderSection("Morning", morningTimes, morningClasses)}
      {renderSection("Evening", eveningTimes, eveningClasses)}
    </div>
  );
}
