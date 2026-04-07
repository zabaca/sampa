"use client";

import { useState, useRef, useEffect } from "react";
import { classColor, COLOR_PALETTE } from "@/lib/colors";

type ClassFilterPillProps = {
  name: string;
  active: boolean;
  colorMap: Map<string, string>;
  editMode: boolean;
  onToggle: () => void;
  onColorChange: (colorKey: string) => void;
};

export function ClassFilterPill({
  name,
  active,
  colorMap,
  editMode,
  onToggle,
  onColorChange,
}: ClassFilterPillProps) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);
  const colors = classColor(name, colorMap);

  useEffect(() => {
    if (!showPicker) return;
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showPicker]);

  return (
    <div className="relative" ref={pickerRef}>
      <button
        type="button"
        className={`rounded-full font-medium transition-colors cursor-pointer select-none px-3 py-1 text-xs flex items-center gap-1.5 ${
          active
            ? "bg-[#C22027] text-white"
            : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
        }`}
        onClick={onToggle}
      >
        <span className={`inline-block w-2 h-2 rounded-full ${colors.border} border`} />
        {name}
        {editMode && (
          <span
            className="ml-1 text-[10px] opacity-60 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              setShowPicker(!showPicker);
            }}
          >
            ●
          </span>
        )}
      </button>
      {showPicker && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-zinc-900 border border-zinc-700 rounded-lg p-2 shadow-xl grid grid-cols-4 gap-1.5 min-w-[140px]">
          {COLOR_PALETTE.map((c) => (
            <button
              key={c.key}
              type="button"
              title={c.label}
              className={`w-7 h-7 rounded-full border-2 cursor-pointer transition-transform hover:scale-110 ${c.border} ${c.bg} ${
                colorMap.get(name) === c.key || (!colorMap.has(name) && classColor(name).border === c.border)
                  ? "ring-2 ring-white ring-offset-1 ring-offset-zinc-900"
                  : ""
              }`}
              onClick={() => {
                onColorChange(c.key);
                setShowPicker(false);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
