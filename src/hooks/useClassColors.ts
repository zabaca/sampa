"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/lib/api-client";

type ClassColorRow = {
  id: number;
  class_name: string;
  color_key: string;
};

export function useClassColors() {
  const [rows, setRows] = useState<ClassColorRow[]>([]);

  const fetchColors = useCallback(async () => {
    const res = await api.classColors.list();
    if (res.status === 200) setRows(res.body);
  }, []);

  useEffect(() => {
    fetchColors();
  }, [fetchColors]);

  const colorMap = useMemo(
    () => new Map(rows.map((r) => [r.class_name, r.color_key])),
    [rows]
  );

  const setColor = async (className: string, colorKey: string) => {
    const existing = rows.find((r) => r.class_name === className);
    if (existing) {
      setRows((prev) =>
        prev.map((r) => (r.class_name === className ? { ...r, color_key: colorKey } : r))
      );
      await api.classColors.update({
        params: { id: String(existing.id) },
        body: { color_key: colorKey },
      });
    } else {
      const optimisticId = Date.now();
      setRows((prev) => [...prev, { id: optimisticId, class_name: className, color_key: colorKey }]);
      const res = await api.classColors.upsert({
        body: { class_name: className, color_key: colorKey },
      });
      if (res.status === 201) {
        setRows((prev) => prev.map((r) => (r.id === optimisticId ? res.body : r)));
      }
    }
  };

  return { colorMap, setColor, fetchColors };
}
