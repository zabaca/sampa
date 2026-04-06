"use client";

import { useState, useEffect, useCallback } from "react";
import type { ClassItem, Program } from "@/lib/constants";

type NoteItem = {
  id: number;
  program: string;
  note: string;
  sort_order: number;
};

export function useClasses(program: Program) {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/classes?program=${encodeURIComponent(program)}`);
    const data = await res.json();
    setClasses(data);
    setLoading(false);
  }, [program]);

  const fetchNotes = useCallback(async () => {
    const res = await fetch(`/api/notes?program=${encodeURIComponent(program)}`);
    const data = await res.json();
    setNotes(data);
  }, [program]);

  useEffect(() => {
    fetchClasses();
    fetchNotes();
  }, [fetchClasses, fetchNotes]);

  const createClass = async (cls: Omit<ClassItem, "id">) => {
    const res = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cls),
    });
    if (res.ok) await fetchClasses();
  };

  const updateClass = async (id: string, updates: Partial<ClassItem>) => {
    const res = await fetch(`/api/classes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) await fetchClasses();
  };

  const deleteClass = async (id: string) => {
    const res = await fetch(`/api/classes/${id}`, {
      method: "DELETE",
    });
    if (res.ok) await fetchClasses();
  };

  const resetClasses = async () => {
    const res = await fetch("/api/classes/reset", { method: "POST" });
    if (res.ok) {
      await fetchClasses();
      await fetchNotes();
    }
  };

  return {
    classes,
    notes,
    loading,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass,
    resetClasses,
  };
}
