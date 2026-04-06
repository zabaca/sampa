"use client";

import { useState, useEffect, useCallback } from "react";
import type { ClassItem } from "@/lib/constants";

export type NoteItem = {
  id: number;
  program: string;
  note: string;
  sort_order: number;
};

function tempId() {
  return "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function useClasses() {
  const [allClasses, setAllClasses] = useState<ClassItem[]>([]);
  const [allNotes, setAllNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClasses = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/classes");
    const data = await res.json();
    setAllClasses(data);
    setLoading(false);
  }, []);

  const fetchNotes = useCallback(async () => {
    const res = await fetch("/api/notes");
    const data = await res.json();
    setAllNotes(data);
  }, []);

  useEffect(() => {
    fetchClasses();
    fetchNotes();
  }, [fetchClasses, fetchNotes]);

  const createClass = async (cls: Omit<ClassItem, "id">): Promise<string> => {
    const optimisticId = tempId();
    setAllClasses((prev) => [...prev, { ...cls, id: optimisticId } as ClassItem]);

    const res = await fetch("/api/classes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cls),
    });

    if (res.ok) {
      const created = await res.json();
      setAllClasses((prev) => prev.map((c) => (c.id === optimisticId ? created : c)));
      return created.id;
    }
    setAllClasses((prev) => prev.filter((c) => c.id !== optimisticId));
    return optimisticId;
  };

  const updateClass = async (id: string, updates: Partial<ClassItem>) => {
    setAllClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );

    const res = await fetch(`/api/classes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) await fetchClasses();
  };

  const deleteClass = async (id: string) => {
    const prev = allClasses;
    setAllClasses((curr) => curr.filter((c) => c.id !== id));

    const res = await fetch(`/api/classes/${id}`, { method: "DELETE" });
    if (!res.ok) setAllClasses(prev);
  };

  const resetClasses = async () => {
    const res = await fetch("/api/classes/reset", { method: "POST" });
    if (res.ok) {
      await fetchClasses();
      await fetchNotes();
    }
  };

  const createNote = async (program: string, note: string) => {
    const optimisticId = Date.now();
    setAllNotes((prev) => [...prev, { id: optimisticId, program, note, sort_order: prev.length + 1 }]);

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ program, note }),
    });

    if (res.ok) {
      const created = await res.json();
      setAllNotes((prev) => prev.map((n) => (n.id === optimisticId ? created : n)));
    } else {
      setAllNotes((prev) => prev.filter((n) => n.id !== optimisticId));
    }
  };

  const updateNote = async (id: number, note: string) => {
    setAllNotes((prev) => prev.map((n) => (n.id === id ? { ...n, note } : n)));

    const res = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });

    if (!res.ok) await fetchNotes();
  };

  const deleteNote = async (id: number) => {
    setAllNotes((prev) => prev.filter((n) => n.id !== id));

    const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (!res.ok) await fetchNotes();
  };

  return {
    allClasses,
    allNotes,
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
