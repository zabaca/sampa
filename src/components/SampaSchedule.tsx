"use client";

import { useState } from "react";
import type { ClassItem, Program } from "@/lib/constants";
import { useClasses } from "@/hooks/useClasses";
import { ProgramTabs } from "./ProgramTabs";
import { ViewToggle } from "./ViewToggle";
import { CalendarView } from "./CalendarView";
import { ListView } from "./ListView";
import { ClassForm } from "./ClassForm";
import { ProgramNotes } from "./ProgramNotes";

export function SampaSchedule() {
  const [activeProgram, setActiveProgram] = useState<Program>("Adult BJJ");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);

  const { classes, notes, loading, createClass, updateClass, deleteClass, resetClasses } =
    useClasses(activeProgram);

  const handleEdit = (item: ClassItem) => {
    setEditingClass(item);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    await deleteClass(id);
  };

  const handleFormSubmit = async (data: Omit<ClassItem, "id"> & { id?: string }) => {
    if (data.id) {
      const { id, ...updates } = data;
      await updateClass(id, updates);
    } else {
      await createClass(data);
    }
    setShowForm(false);
    setEditingClass(null);
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
        <ProgramTabs active={activeProgram} onSelect={setActiveProgram} />
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

      {/* Loading */}
      {loading ? (
        <div className="text-center text-zinc-500 py-12">Loading schedule...</div>
      ) : viewMode === "calendar" ? (
        <CalendarView
          classes={classes}
          editMode={editMode}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <ListView
          classes={classes}
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
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingClass(null);
          }}
        />
      )}
    </div>
  );
}
