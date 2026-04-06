"use client";

import { useState } from "react";
import { PROGRAMS, DAYS, type ClassItem } from "@/lib/constants";

type ClassFormProps = {
  initial: ClassItem | null;
  onSubmit: (data: Omit<ClassItem, "id"> & { id?: string }) => void;
  onCancel: () => void;
};

export function ClassForm({ initial, onSubmit, onCancel }: ClassFormProps) {
  const [program, setProgram] = useState(initial?.program ?? PROGRAMS[0]);
  const [day, setDay] = useState(initial?.day ?? DAYS[0]);
  const [time, setTime] = useState(initial?.time ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [inviteOnly, setInviteOnly] = useState(initial?.invite_only === 1);
  const [ageGroup, setAgeGroup] = useState(initial?.age_group ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...(initial ? { id: initial.id } : {}),
      program,
      day,
      time,
      name,
      invite_only: inviteOnly ? 1 : 0,
      age_group: ageGroup || null,
      location: location || null,
    });
  };

  const inputClass =
    "w-full rounded-md bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500";
  const labelClass = "block text-xs font-medium text-zinc-400 mb-1";

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-lg font-semibold text-zinc-100">
          {initial ? "Edit Class" : "Add Class"}
        </h2>

        <div className="grid grid-cols-2 gap-3">
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
            <label className={labelClass}>Day</label>
            <select
              className={inputClass}
              value={day}
              onChange={(e) => setDay(e.target.value as ClassItem["day"])}
            >
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Time</label>
            <input
              className={inputClass}
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 5:15 AM"
              required
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
            <input
              className={inputClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Room B"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
          <input
            type="checkbox"
            checked={inviteOnly}
            onChange={(e) => setInviteOnly(e.target.checked)}
            className="rounded border-zinc-600"
          />
          Invite Only
        </label>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            className="flex-1 bg-[#C22027] hover:bg-[#a81b22] text-white font-medium py-2 rounded-md text-sm cursor-pointer transition-colors"
          >
            {initial ? "Save Changes" : "Add Class"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium py-2 rounded-md text-sm cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
