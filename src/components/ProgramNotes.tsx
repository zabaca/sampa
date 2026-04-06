type ProgramNotesProps = {
  notes: { id: number; note: string }[];
};

export function ProgramNotes({ notes }: ProgramNotesProps) {
  if (notes.length === 0) return null;

  return (
    <div className="mt-6 border-t border-zinc-800 pt-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-2">
        Notes
      </h3>
      <ul className="space-y-1">
        {notes.map((n) => (
          <li key={n.id} className="text-sm text-zinc-400 flex gap-2">
            <span className="text-zinc-600">•</span>
            {n.note}
          </li>
        ))}
      </ul>
    </div>
  );
}
