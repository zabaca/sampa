"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { ClassItem, Program, Day } from "@/lib/constants";
import { PROGRAMS } from "@/lib/constants";
import { useClasses } from "@/hooks/useClasses";
import { useLocations } from "@/hooks/useLocations";
import { useClassColors } from "@/hooks/useClassColors";
import { COLOR_PALETTE } from "@/lib/colors";
import { ProgramTabs } from "./ProgramTabs";
import { ViewToggle } from "./ViewToggle";
import { CalendarView } from "./CalendarView";
import { ListView } from "./ListView";
import { ClassForm } from "./ClassForm";
import { ProgramNotes } from "./ProgramNotes";
import { LocationManager } from "./LocationManager";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Pill } from "./Pill";
import { ClassFilterPill } from "./ClassFilterPill";
import type { Theme } from "@/lib/themes";

export function SampaSchedule() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeProgram, setActiveProgram] = useState<Program>("Adult BJJ");
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [editMode, setEditMode] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [editingSiblings, setEditingSiblings] = useState<ClassItem[]>([]);
  const [classFilters, setClassFilters] = useState<Set<string>>(new Set());
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [locationInitialized, setLocationInitialized] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("sampa-theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  });

  const handleThemeChange = (t: Theme) => {
    setTheme(t);
    localStorage.setItem("sampa-theme", t);
  };

  const {
    allClasses, allNotes, loading,
    createClass, updateClass, deleteClass, resetClasses,
    createNote, updateNote, deleteNote,
  } = useClasses();

  const {
    locations, defaultLocation,
    createLocation, updateLocation, deleteLocation,
  } = useLocations();

  const { colorMap, setColor: setClassColor } = useClassColors();

  // Initialize location filter from URL param or default location
  useEffect(() => {
    if (locationInitialized || locations.length === 0) return;

    const paramLoc = searchParams.get("location");
    if (paramLoc && locations.some((l) => l.name === paramLoc)) {
      setLocationFilter(paramLoc);
    }
    // Default to null (all locations)
    setLocationInitialized(true);
  }, [locations, defaultLocation, searchParams, locationInitialized]);

  // Classes at the selected location
  const locationClasses = useMemo(() => {
    if (!locationFilter) return allClasses;
    return allClasses.filter((c) =>
      c.location === locationFilter || (c.location === null && defaultLocation?.name === locationFilter)
    );
  }, [allClasses, locationFilter, defaultLocation]);

  // Programs available at the selected location (preserve PROGRAMS order)
  const availablePrograms = useMemo(() => {
    const programsAtLocation = new Set(locationClasses.map((c) => c.program));
    return PROGRAMS.filter((p) => programsAtLocation.has(p));
  }, [locationClasses]);

  // Auto-select first available program when location changes
  useEffect(() => {
    if (availablePrograms.length > 0 && !availablePrograms.includes(activeProgram)) {
      setActiveProgram(availablePrograms[0]);
      setClassFilters(new Set());
    }
  }, [availablePrograms, activeProgram]);

  // Classes filtered by program
  const programClasses = useMemo(
    () => locationClasses.filter((c) => c.program === activeProgram),
    [locationClasses, activeProgram]
  );

  // Notes for active program
  const notes = useMemo(
    () => allNotes.filter((n) => n.program === activeProgram),
    [allNotes, activeProgram]
  );

  // Unique class names for filter pills
  const classNames = useMemo(
    () => [...new Set(programClasses.map((c) => c.name))].sort(),
    [programClasses]
  );

  // Final filtered classes
  const filteredClasses = useMemo(() => {
    if (classFilters.size > 0) return programClasses.filter((c) => classFilters.has(c.name));
    return programClasses;
  }, [programClasses, classFilters]);

  // Sync location filter to URL
  const setLocationAndParam = (loc: string | null) => {
    setLocationFilter(loc);
    setClassFilters(new Set());
    const params = new URLSearchParams(searchParams.toString());
    if (loc) {
      params.set("location", loc);
    } else {
      params.delete("location");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const findSiblings = (item: ClassItem): ClassItem[] => {
    return programClasses.filter(
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
      const existingDays = new Map(editingSiblings.map((s) => [s.day, s.id]));
      const selectedDays = new Set(days);

      for (const sibling of editingSiblings) {
        if (selectedDays.has(sibling.day as Day)) {
          await updateClass(sibling.id, { ...rest, day: sibling.day });
        }
      }

      for (const day of days) {
        if (!existingDays.has(day)) {
          await createClass({ ...rest, day });
        }
      }

      for (const sibling of editingSiblings) {
        if (!selectedDays.has(sibling.day as Day)) {
          await deleteClass(sibling.id);
        }
      }
    } else {
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
    <div data-theme={theme} className="min-h-screen bg-surface-bg text-surface-text transition-colors">
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <h1 className="font-heading text-4xl font-bold tracking-tight">
            Sampa Brazilian Jiu-Jitsu
          </h1>
          {locations.length > 1 && (
            <select
              value={locationFilter ?? ""}
              onChange={(e) => setLocationAndParam(e.target.value || null)}
              className="bg-surface-card border border-surface-border rounded-md px-3 py-1.5 text-sm text-surface-muted focus:outline-none cursor-pointer"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-surface-muted">Class Schedule</p>
          <ThemeSwitcher current={theme} onChange={handleThemeChange} />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <ProgramTabs
          programs={availablePrograms}
          active={activeProgram}
          onSelect={(p) => { setActiveProgram(p); setClassFilters(new Set()); }}
        />
        <div className="flex-1" />
        <ViewToggle viewMode={viewMode} onToggle={setViewMode} />
        <button
          onClick={() => setEditMode(!editMode)}
          className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors cursor-pointer ${
            editMode
              ? "bg-amber-600 text-white"
              : "bg-surface-card text-surface-muted hover:text-surface-text"
          }`}
        >
          {editMode ? "Done Editing" : "Edit"}
        </button>
      </div>

      {/* Edit controls */}
      {editMode && (
        <div className="flex flex-wrap gap-2 mb-4">
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
            className="px-3 py-1.5 text-sm rounded-md bg-surface-card hover:opacity-80 text-surface-muted font-medium cursor-pointer transition-colors"
          >
            Reset to Default
          </button>
        </div>
      )}

      {/* Class name filter */}
      {!loading && classNames.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4 items-center">
          <Pill
            label="All Classes"
            active={classFilters.size === 0}
            onClick={() => setClassFilters(new Set())}
            size="sm"
          />
          {classNames.map((name) => (
            <ClassFilterPill
              key={name}
              name={name}
              active={classFilters.has(name)}
              colorMap={colorMap}
              editMode={editMode}
              theme={theme}
              onToggle={() => {
                setClassFilters((prev) => {
                  const next = new Set(prev);
                  if (next.has(name)) next.delete(name);
                  else next.add(name);
                  return next;
                });
              }}
              onColorChange={(colorKey) => setClassColor(name, colorKey)}
            />
          ))}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center text-surface-muted py-12">Loading schedule...</div>
      ) : viewMode === "calendar" ? (
        <CalendarView
          classes={filteredClasses}
          editMode={editMode}
          colorMap={colorMap}
          theme={theme}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDrop={handleDrop}
        />
      ) : (
        <ListView
          classes={filteredClasses}
          editMode={editMode}
          colorMap={colorMap}
          theme={theme}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Location Manager (edit mode) */}
      {editMode && (
        <div className="mt-6">
          <LocationManager
            locations={locations}
            onAdd={createLocation}
            onUpdate={updateLocation}
            onDelete={deleteLocation}
          />
        </div>
      )}

      {/* Program Notes */}
      <ProgramNotes
        notes={notes}
        editMode={editMode}
        onAdd={(note) => createNote(activeProgram, note)}
        onUpdate={updateNote}
        onDelete={deleteNote}
      />

      {/* Form Modal */}
      {showForm && (
        <ClassForm
          initial={editingClass}
          siblingDays={editingSiblings.map((s) => s.day as Day)}
          locations={locations}
          defaultLocation={defaultLocation?.name}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setShowForm(false);
            setEditingClass(null);
            setEditingSiblings([]);
          }}
        />
      )}
    </div>
    </div>
  );
}
