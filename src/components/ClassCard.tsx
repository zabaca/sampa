import type { ClassItem } from "@/lib/constants";
import { classColor } from "@/lib/colors";
import { Badge } from "./Badge";
import { usePostHog } from "posthog-js/react";
import type { Theme } from "@/lib/themes";

type ClassCardProps = {
  item: ClassItem;
  variant: "calendar" | "list";
  editMode: boolean;
  colorMap?: Map<string, string>;
  theme?: Theme;
  onEdit: (item: ClassItem) => void;
  onDelete: (id: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
};

export function ClassCard({ item, variant, editMode, colorMap, theme = "dark", onEdit, onDelete, draggable, onDragStart }: ClassCardProps) {
  const colors = classColor(item.name, colorMap, theme);
  const posthog = usePostHog();

  const trackClick = () => {
    if (editMode) return;
    posthog?.capture("class_clicked", {
      class_name: item.name,
      program: item.program,
      day: item.day,
      time: item.time,
      location: item.location,
      invite_only: item.invite_only === 1,
      age_group: item.age_group,
      variant,
    });
  };

  if (variant === "calendar") {
    return (
      <div
        className={`group relative rounded-md border-l-2 ${colors.border} ${colors.bg} px-2 py-1.5 text-xs ${draggable ? "cursor-grab active:cursor-grabbing" : ""}`}
        draggable={draggable}
        onDragStart={onDragStart}
        onClick={trackClick}
      >
        <div className={`font-semibold ${colors.text} leading-tight`}>{item.name}</div>
        <div className="text-surface-muted mt-0.5">{item.time}</div>
        <div className="flex gap-1 mt-1 flex-wrap">
          {item.invite_only === 1 && <Badge label="Invite Only" variant="invite" />}
          {item.age_group && <Badge label={item.age_group} variant="age" />}
          {item.location && <Badge label={item.location} variant="location" />}
        </div>
        {editMode && (
          <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
            <button
              onClick={() => onEdit(item)}
              className="w-5 h-5 rounded bg-surface-card hover:opacity-80 text-surface-muted flex items-center justify-center text-[10px] cursor-pointer"
            >
              ✎
            </button>
            <button
              onClick={() => onDelete(item.id)}
              className="w-5 h-5 rounded btn-delete flex items-center justify-center text-[10px] cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    );
  }

  // List variant
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border ${colors.border} ${colors.bg} px-4 py-3`}
      onClick={trackClick}
    >
      <div className="min-w-[70px] text-sm text-surface-muted font-medium">{item.time}</div>
      <div className="flex-1">
        <div className={`font-semibold ${colors.text}`}>{item.name}</div>
        <div className="flex gap-1.5 mt-1 flex-wrap">
          {item.invite_only === 1 && <Badge label="Invite Only" variant="invite" />}
          {item.age_group && <Badge label={item.age_group} variant="age" />}
          {item.location && <Badge label={item.location} variant="location" />}
        </div>
      </div>
      <div className="text-xs text-surface-muted">{item.day}</div>
      {editMode && (
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(item)}
            className="px-2 py-1 rounded bg-surface-card hover:opacity-80 text-surface-muted text-xs cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="px-2 py-1 rounded btn-delete text-xs cursor-pointer"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
