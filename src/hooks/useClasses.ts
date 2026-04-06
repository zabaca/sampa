"use client";

import { useState, useEffect, useCallback } from "react";
import type { ClassItem, Program } from "@/lib/constants";

type NoteItem = {
  id: number;
  program: string;
  note: string;
  sort_order: number;
};

function tempId() {
  return "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

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

  const createClass = async (cls: Omit<ClassItem, "id">): Promise<string> => {
    const optimisticId = tempId();
    // Optimistic: add immediately
    setClasses((prev) => [...prev, { ...cls, id: optimisticId } as ClassItem]);

    const res = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cls),
    });

    if (res.ok) {
      const created = await res.json();
      // Replace optimistic entry with real one
      setClasses((prev) =>
        prev.map((c) => (c.id === optimisticId ? created : c))
      );
      return created.id;
    }
    // Rollback on failure
    setClasses((prev) => prev.filter((c) => c.id !== optimisticId));
    return optimisticId;
  };

  const updateClass = async (id: string, updates: Partial<ClassItem>) => {
    // Optimistic: apply update immediately
    setClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );

    const res = await fetch(`/api/classes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      // Rollback: re-fetch on failure
      await fetchClasses();
    }
  };

  const deleteClass = async (id: string) => {
    // Optimistic: remove immediately
    const prev = classes;
    setClasses((curr) => curr.filter((c) => c.id !== id));

    const res = await fetch(`/api/classes/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      // Rollback
      setClasses(prev);
    }
  };

  const resetClasses = async () => {
    const res = await fetch("/api/classes/reset", { method: "POST" });
    if (res.ok) {
      await fetchClasses();
      await fetchNotes();
    }
  };

  const createNote = async (note: string) => {
    const optimisticId = Date.now();
    setNotes((prev) => [...prev, { id: optimisticId, program, note, sort_order: prev.length + 1 }]);

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ program, note }),
    });

    if (res.ok) {
      const created = await res.json();
      setNotes((prev) => prev.map((n) => (n.id === optimisticId ? created : n)));
    } else {
      setNotes((prev) => prev.filter((n) => n.id !== optimisticId));
    }
  };

  const updateNote = async (id: number, note: string) => {
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, note } : n)));

    const res = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });

    if (!res.ok) await fetchNotes();
  };

  const deleteNote = async (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));

    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (!res.ok) await fetchNotes();
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
    createNote,
    updateNote,
    deleteNote,
  };
}
