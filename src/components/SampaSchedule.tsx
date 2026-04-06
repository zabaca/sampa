"use client";

import { useState, useMemo } from "react";
import type { ClassItem, Program, Day } from "@/lib/constants";
import { useClasses } from "@/hooks/useClasses";
import { ProgramTabs } from "./ProgramTabs";
import { ViewToggle } from "./ViewToggle";
import { CalendarView } from "./CalendarView";
import { ListView } from "./ListView";
import { ClassForm } from "./ClassForm";
import { ProgramNotes } from "./ProgramNotes";
import { Pill } from "./Pill";

export function SampaSchedule() {
  const [activeProgram, setActiveProgram] = useState<Program>("Adult BJJ");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [editingSiblings, setEditingSiblings] = useState<ClassItem[]>([]);
  const [classFilter, setClassFilter] = useState<string | null>(null);

  const { classes, notes, loading, createClass, updateClass, deleteClass, resetClasses } =
    useClasses(activeProgram);

  // Unique class names for filter pills
  const classNames = useMemo(
    () => [...new Set(classes.map((c) => c.name))].sort(),
    [classes]
  );

  // Filtered classes
  const filteredClasses = useMemo(
    () => (classFilter ? classes.filter((c) => c.name === classFilter) : classes),
    [classes, classFilter]
  );

  const findSiblings = (item: ClassItem): ClassItem[] => {
    return classes.filter(
      (c) =>
        c.program === item.program &&
        c.name === item.name &&
        c.time === item.time &&
        c.invite_only === item.invite_only &&
        c.age_group === item.age_group &&
        c.location === item.location
    );
  };

  const handleEdit = (item: ClassItem) => {
    const siblings = findSiblings(item);
    setEditingClass(item);
    setEditingSiblings(siblings);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteClass(id);
  };

  const handleFormSubmit = async (
    data: Omit<ClassItem, "id" | "day"> & { id?: string; days: Day[] }
  ) => {
    const { id, days, ...rest } = data;

    if (id && editingSiblings.length > 0) {
      // Editing a group of siblings
      const existingDays = new Map(editingSiblings.map((s) => [s.day, s.id]));
      const selectedDays = new Set(days);

      // Update siblings that are still selected (apply field changes)
      for (const sibling of editingSiblings) {
        if (selectedDays.has(sibling.day as Day)) {
          await updateClass(sibling.id, { ...rest, day: sibling.day });
        }
      }

      // Create classes for newly added days
      for (const day of days) {
        if (!existingDays.has(day)) {
          await createClass({ ...rest, day });
        }
      }

      // Delete classes for removed days
      for (const sibling of editingSiblings) {
        if (!selectedDays.has(sibling.day as Day)) {
          await deleteClass(sibling.id);
        }
      }
    } else {
      // Creating new: one class per selected day
      for (const day of days) {
        await createClass({ ...rest, day });
      }
    }
    setShowForm(false);
    setEditingClass(null);
    setEditingSiblings([]);
  };

  const handleDrop = async (classId: string, day: Day, time: string) => {
    await updateClass(classId, { day, time });
  };

  const handleReset = async () => {
    await resetClasses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-4xl font-bold tracking-tight text-white">
          Sampa Brazilian Jiu-Jitsu
        </h1>
        <p className="text-zinc-400 mt-1">Class Schedule</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <ProgramTabs active={activeProgram} onSelect={(p) => { setActiveProgram(p); setClassFilter(null); }} />
        <div className="flex-1" />
        <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors cursor-pointer ${
            editMode
              ? "bg-amber-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {editMode ? "Done Editing" : "Edit"}
        </button>
      </div>

      {/* Edit controls */}
      {editMode && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => {
              setEditingClass(null);
              setEditingSiblings([]);
              setShowForm(true);
            }}
            className="px-3 py-1.5 text-sm rounded-md bg-[#C22027] hover:bg-[#a81b22] text-white font-medium cursor-pointer transition-colors"
          >
            + Add Class
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-sm rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-medium cursor-pointer transition-colors"
          >
            Reset to Default
          </button>
        </div>
      )}

      {/* Class name filter */}
      {!loading && classNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          <Pill
            label="All Classes"
            active={classFilter === null}
            onClick={() => setClassFilter(null)}
            size="sm"
          />
          {classNames.map((name) => (
            <Pill
              key={name}
              label={name}
              active={classFilter === name}
              onClick={() => setClassFilter(classFilter === name ? null : name)}
              size="sm"
            />
          ))}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center text-zinc-500 py-12">Loading schedule...</div>
      ) : viewMode === "calendar" ? (
        <CalendarView
          classes={filteredClasses}
          editMode={editMode}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDrop={handleDrop}
        />
      ) : (
        <ListView
          classes={filteredClasses}
          editMode={editMode}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Program Notes */}
      <ProgramNotes notes={notes} />

      {/* Form Modal */}
      {showForm && (
        <ClassForm
          initial={editingClass}
          siblingDays={editingSiblings.map((s) => s.day as Day)}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingClass(null);
            setEditingSiblings([]);
          }}
        />
      )}
    </div>
  );
}
