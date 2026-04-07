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
            className="ml-0.5 opacity-60 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              setShowPicker(!showPicker);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
              <path d="M13.488 2.513a1.75 1.75 0 00-2.475 0L3.05 10.476a1.75 1.75 0 00-.46.84l-.497 2.486a.75.75 0 00.882.882l2.486-.497a1.75 1.75 0 00.84-.46l7.963-7.963a1.75 1.75 0 000-2.475l-.776-.776zm-1.415 1.06a.25.25 0 01.354 0l.776.776a.25.25 0 010 .354L5.24 12.666a.25.25 0 01-.12.066l-1.567.313.313-1.567a.25.25 0 01.066-.12l7.963-7.963z" />
            </svg>
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
