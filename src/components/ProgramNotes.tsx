"use client";

import { useState } from "react";

type NoteItem = { id: number; note: string };

type ProgramNotesProps = {
  notes: NoteItem[];
  editMode: boolean;
  onAdd: (note: string) => void;
  onUpdate: (id: number, note: string) => void;
  onDelete: (id: number) => void;
};

export function ProgramNotes({ notes, editMode, onAdd, onUpdate, onDelete }: ProgramNotesProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [newNote, setNewNote] = useState("");

  const startEdit = (note: NoteItem) => {
    setEditingId(note.id);
    setEditText(note.note);
  };

  const saveEdit = () => {
    if (editingId !== null && editText.trim()) {
      onUpdate(editingId, editText.trim());
    }
    setEditingId(null);
    setEditText("");
  };

  const handleAdd = () => {
    if (newNote.trim()) {
      onAdd(newNote.trim());
      setNewNote("");
    }
  };

  if (notes.length === 0 && !editMode) return null;

  return (
    <div className="mt-6 border-t border-zinc-800 pt-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
        Notes
      </h3>
      <ul className="space-y-1">
        {notes.map((n) => (
          <li key={n.id} className="text-sm text-zinc-400 flex items-start gap-2 group">
            <span className="text-zinc-600 mt-0.5">•</span>
            {editMode && editingId === n.id ? (
              <div className="flex-1 flex gap-2">
                <input
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={saveEdit}
                  className="text-xs text-green-400 hover:text-green-300 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span className="flex-1">{n.note}</span>
                {editMode && (
                  <span className="hidden group-hover:flex gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(n)}
                      className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(n.id)}
                      className="text-xs text-red-500 hover:text-red-400 cursor-pointer"
                    >
                      Delete
                    </button>
                  </span>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
      {editMode && (
        <div className="flex gap-2 mt-2">
          <input
            className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            placeholder="Add a note..."
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newNote.trim()}
            className="px-3 py-1 text-xs rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 disabled:opacity-50 cursor-pointer transition-colors"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}
