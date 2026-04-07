"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

type ClassColorRow = {
  id: number;
  class_name: string;
  color_key: string;
};

export function useClassColors() {
  const [rows, setRows] = useState<ClassColorRow[]>([]);

  const fetchColors = useCallback(async () => {
    const res = await fetch("/api/class-colors");
    const data = await res.json();
    setRows(data);
  }, []);

  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  const colorMap = useMemo(
    () => new Map(rows.map((r) => [r.class_name, r.color_key])),
    [rows]
  );

  const setColor = async (className: string, colorKey: string) => {
    // Optimistic
    const existing = rows.find((r) => r.class_name === className);
    if (existing) {
      setRows((prev) =>
        prev.map((r) => (r.class_name === className ? { ...r, color_key: colorKey } : r))
      );
      await fetch(`/api/class-colors/${existing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ color_key: colorKey }),
      });
    } else {
      const optimisticId = Date.now();
      setRows((prev) => [...prev, { id: optimisticId, class_name: className, color_key: colorKey }]);
      const res = await fetch("/api/class-colors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ class_name: className, color_key: colorKey }),
      });
      if (res.ok) {
        const created = await res.json();
        setRows((prev) => prev.map((r) => (r.id === optimisticId ? created : r)));
      }
    }
  };

  return { colorMap, setColor, fetchColors };
}
