"use client";

import { useState } from "react";
import { PROGRAMS, DAYS, type ClassItem, type Day } from "@/lib/constants";
import { Pill } from "./Pill";
import { TimeInput } from "./TimeInput";
import type { LocationItem } from "@/hooks/useLocations";

type ClassFormData = Omit<ClassItem, "id" | "day"> & { id?: string; days: Day[] };

type ClassFormProps = {
  initial: ClassItem | null;
  siblingDays?: Day[];
  locations: LocationItem[];
  defaultLocation?: string;
  onSubmit: (data: ClassFormData) => void | Promise<void>;
  onCancel: () => void;
};

export function ClassForm({ initial, siblingDays, locations, defaultLocation, onSubmit, onCancel }: ClassFormProps) {
  const [program, setProgram] = useState(initial?.program ?? PROGRAMS[0]);
  const [selectedDays, setSelectedDays] = useState<Day[]>(
    siblingDays && siblingDays.length > 0 ? siblingDays : initial ? [initial.day as Day] : []
  );
  const [time, setTime] = useState(initial?.time ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [inviteOnly, setInviteOnly] = useState(initial?.invite_only === 1);
  const [ageGroup, setAgeGroup] = useState(initial?.age_group ?? "");
  const [location, setLocation] = useState(initial?.location ?? defaultLocation ?? "");

  const toggleDay = (day: Day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDays.length === 0 || saving) return;
    setSaving(true);
    await onSubmit({
      ...(initial ? { id: initial.id } : {}),
      program,
      days: selectedDays,
      time,
      name,
      invite_only: inviteOnly ? 1 : 0,
      age_group: ageGroup || null,
      location: location || null,
    });
    setSaving(false);
  };

  const inputClass =
    "w-full rounded-md bg-surface-card border border-surface-border px-3 py-2 text-sm text-surface-text focus:outline-none focus:border-surface-muted";
  const labelClass = "block text-xs font-medium text-surface-muted mb-1";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-surface-card border border-surface-border rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-lg font-semibold text-surface-text">
          {initial ? "Edit Class" : "Add Class"}
        </h2>

        <div>
          <label className={labelClass}>Program</label>
          <select
            className={inputClass}
            value={program}
            onChange={(e) => setProgram(e.target.value as ClassItem["program"])}
          >
            {PROGRAMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Days</label>
          <div className="flex flex-wrap gap-1.5">
            {DAYS.map((d) => (
              <Pill
                key={d}
                label={d}
                active={selectedDays.includes(d)}
                onClick={() => toggleDay(d)}
                size="sm"
              />
            ))}
          </div>
          {selectedDays.length === 0 && (
            <p className="text-xs text-red-400 mt-1">Select at least one day</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Time</label>
            <TimeInput
              className={inputClass}
              value={time}
              onChange={setTime}
            />
          </div>
          <div>
            <label className={labelClass}>Class Name</label>
            <input
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fundamental"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Age Group</label>
            <input
              className={inputClass}
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              placeholder="e.g. Ages 8-12"
            />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <select
              className={inputClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">None</option>
              {locations.map((l) => (
                <option key={l.id} value={l.name}>
                  {l.name}{l.is_default === 1 ? " (Default)" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-surface-text cursor-pointer">
          <input
            type="checkbox"
            checked={inviteOnly}
            onChange={(e) => setInviteOnly(e.target.checked)}
            className="rounded border-surface-border"
          />
          Invite Only
        </label>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={selectedDays.length === 0 || saving}
            className="flex-1 bg-[#C22027] hover:bg-[#a81b22] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2 rounded-md text-sm cursor-pointer transition-colors"
          >
            {saving ? "Saving..." : initial ? "Save Changes" : `Add Class${selectedDays.length > 1 ? ` (${selectedDays.length} days)` : ""}`}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-surface-card hover:bg-surface-border text-surface-text font-medium py-2 rounded-md text-sm cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
