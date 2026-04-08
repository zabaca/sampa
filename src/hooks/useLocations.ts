"use client";

import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api-client";

export type LocationItem = {
  id: number;
  name: string;
  is_default: number;
};

export function useLocations() {
  const [locations, setLocations] = useState<LocationItem[]>([]);

  const fetchLocations = useCallback(async () => {
    const res = await api.locations.list();
    if (res.status === 200) setLocations(res.body);
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const createLocation = async (name: string) => {
    const optimisticId = Date.now();
    setLocations((prev) => [...prev, { id: optimisticId, name, is_default: 0 }]);

    const res = await api.locations.create({ body: { name } });

    if (res.status === 201) {
      setLocations((prev) => prev.map((l) => (l.id === optimisticId ? res.body : l)));
    } else {
      setLocations((prev) => prev.filter((l) => l.id !== optimisticId));
    }
  };

  const updateLocation = async (id: number, updates: Partial<LocationItem>) => {
    setLocations((prev) =>
      prev.map((l) => {
        if (l.id === id) return { ...l, ...updates };
        if (updates.is_default === 1) return { ...l, is_default: 0 };
        return l;
      })
    );

    const res = await api.locations.update({ params: { id: String(id) }, body: updates });
    if (res.status !== 200) await fetchLocations();
  };

  const deleteLocation = async (id: number) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));

    const res = await api.locations.delete({ params: { id: String(id) }, body: undefined });
    if (res.status !== 200) await fetchLocations();
  };

  const defaultLocation = locations.find((l) => l.is_default === 1);

  return {
    locations,
    defaultLocation,
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
  };
}
