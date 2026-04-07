"use client";

import { useState, useRef, useEffect } from "react";
import { MORNING_SLOTS, EVENING_SLOTS } from "@/lib/time";

const ALL_SLOTS = [...MORNING_SLOTS, ...EVENING_SLOTS];

type TimeInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export function TimeInput({ value, onChange, className }: TimeInputProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState(value);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    setFilter(value);
  }, [value]);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const filtered = ALL_SLOTS.filter((s) =>
    s.toLowerCase().replace(/\s/g, "").includes(filter.toLowerCase().replace(/\s/g, ""))
  );

  // Reset highlight when filtered list changes
  useEffect(() => {
    setHighlightIndex(-1);
  }, [filter]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightIndex < 0 || !listRef.current) return;
    const items = listRef.current.children;
    if (items[highlightIndex]) {
      (items[highlightIndex] as HTMLElement).scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex]);

  const handleSelect = (slot: string) => {
    onChange(slot);
    setFilter(slot);
    setOpen(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || filtered.length === 0) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < filtered.length) {
          handleSelect(filtered[highlightIndex]);
        }
        break;
      case "Escape":
        setOpen(false);
        setHighlightIndex(-1);
        break;
    }
  };

  return (
    <div ref={ref} className="relative">
      <input
        className={className}
        value={filter}
        onChange={(e) => {
          setFilter(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="e.g. 5:15 AM"
        required
      />
      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute top-full left-0 right-0 mt-1 z-50 bg-surface-card border border-surface-border rounded-md shadow-xl max-h-48 overflow-y-auto"
        >
          {filtered.map((slot, i) => (
            <li key={slot}>
              <button
                type="button"
                className={`w-full text-left px-3 py-1.5 text-sm cursor-pointer ${
                  i === highlightIndex
                    ? "bg-surface-border text-white"
                    : slot === value
                      ? "bg-surface-border text-white"
                      : "text-surface-text hover:bg-surface-border"
                }`}
                onClick={() => handleSelect(slot)}
                onMouseEnter={() => setHighlightIndex(i)}
              >
                {slot}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
