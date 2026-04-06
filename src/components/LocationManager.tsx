"use client";

import { useState } from "react";
import type { LocationItem } from "@/hooks/useLocations";

type LocationManagerProps = {
  locations: LocationItem[];
  onAdd: (name: string) => void;
  onUpdate: (id: number, updates: Partial<LocationItem>) => void;
  onDelete: (id: number) => void;
};

export function LocationManager({ locations, onAdd, onUpdate, onDelete }: LocationManagerProps) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const handleAdd = () => {
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName("");
    }
  };

  const startEdit = (loc: LocationItem) => {
    setEditingId(loc.id);
    setEditName(loc.name);
  };

  const saveEdit = () => {
    if (editingId !== null && editName.trim()) {
      onUpdate(editingId, { name: editName.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-zinc-300 mb-3">Locations</h3>
      <div className="space-y-2">
        {locations.map((loc) => (
          <div key={loc.id} className="flex items-center gap-2 group">
            {editingId === loc.id ? (
              <>
                <input
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
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
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-zinc-300">{loc.name}</span>
                {loc.is_default === 1 && (
                  <span className="text-[10px] bg-zinc-700 text-zinc-400 px-1.5 py-0.5 rounded">
                    Default
                  </span>
                )}
                <span className="hidden group-hover:flex gap-1">
                  {loc.is_default !== 1 && (
                    <button
                      type="button"
                      onClick={() => onUpdate(loc.id, { is_default: 1 })}
                      className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startEdit(loc)}
                    className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer"
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(loc.id)}
                    className="text-xs text-red-500 hover:text-red-400 cursor-pointer"
                  >
                    Delete
                  </button>
                </span>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-2 mt-3">
        <input
          className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
          placeholder="Add location..."
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newName.trim()}
          className="px-3 py-1 text-xs rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 disabled:opacity-50 cursor-pointer transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
