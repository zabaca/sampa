"use client";

import { useState, useEffect, useCallback } from "react";
import type { ClassItem } from "@/lib/constants";
import { api } from "@/lib/api-client";

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
    const res = await api.classes.list({ query: {} });
    if (res.status === 200) setAllClasses(res.body);
    setLoading(false);
  }, []);

  const fetchNotes = useCallback(async () => {
    const res = await api.notes.list({ query: {} });
    if (res.status === 200) setAllNotes(res.body);
  }, []);

  useEffect(() => {
    fetchClasses();
    fetchNotes();
  }, [fetchClasses, fetchNotes]);

  const createClass = async (cls: Omit<ClassItem, "id">): Promise<string> => {
    const optimisticId = tempId();
    setAllClasses((prev) => [...prev, { ...cls, id: optimisticId } as ClassItem]);

    const res = await api.classes.create({ body: cls });

    if (res.status === 201) {
      setAllClasses((prev) => prev.map((c) => (c.id === optimisticId ? res.body : c)));
      return res.body.id;
    }
    setAllClasses((prev) => prev.filter((c) => c.id !== optimisticId));
    return optimisticId;
  };

  const updateClass = async (id: string, updates: Partial<ClassItem>) => {
    setAllClasses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );

    const res = await api.classes.update({ params: { id }, body: updates });
    if (res.status !== 200) await fetchClasses();
  };

  const deleteClass = async (id: string) => {
    const prev = allClasses;
    setAllClasses((curr) => curr.filter((c) => c.id !== id));

    const res = await api.classes.delete({ params: { id }, body: undefined });
    if (res.status !== 200) setAllClasses(prev);
  };

  const resetClasses = async () => {
    const res = await api.classes.reset({ body: {} });
    if (res.status === 200) {
      await fetchClasses();
      await fetchNotes();
    }
  };

  const createNote = async (program: string, note: string) => {
    const optimisticId = Date.now();
    setAllNotes((prev) => [...prev, { id: optimisticId, program, note, sort_order: prev.length + 1 }]);

    const res = await api.notes.create({ body: { program, note } });

    if (res.status === 201) {
      setAllNotes((prev) => prev.map((n) => (n.id === optimisticId ? res.body : n)));
    } else {
      setAllNotes((prev) => prev.filter((n) => n.id !== optimisticId));
    }
  };

  const updateNote = async (id: number, note: string) => {
    setAllNotes((prev) => prev.map((n) => (n.id === id ? { ...n, note } : n)));

    const res = await api.notes.update({ params: { id: String(id) }, body: { note } });
    if (res.status !== 200) await fetchNotes();
  };

  const deleteNote = async (id: number) => {
    setAllNotes((prev) => prev.filter((n) => n.id !== id));

    const res = await api.notes.delete({ params: { id: String(id) }, body: undefined });
    if (res.status !== 200) await fetchNotes();
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
