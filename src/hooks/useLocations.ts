"use client";

import { useState, useEffect, useCallback } from "react";

export type LocationItem = {
  id: number;
  name: string;
  is_default: number;
};

export function useLocations() {
  const [locations, setLocations] = useState<LocationItem[]>([]);

  const fetchLocations = useCallback(async () => {
    const res = await fetch("/api/locations");
    const data = await res.json();
    setLocations(data);
  }, []);

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  const createLocation = async (name: string) => {
    const optimisticId = Date.now();
    setLocations((prev) => [...prev, { id: optimisticId, name, is_default: 0 }]);

    const res = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      const created = await res.json();
      setLocations((prev) => prev.map((l) => (l.id === optimisticId ? created : l)));
    } else {
      setLocations((prev) => prev.filter((l) => l.id !== optimisticId));
    }
  };

  const updateLocation = async (id: number, updates: Partial<LocationItem>) => {
    setLocations((prev) =>
      prev.map((l) => {
        if (l.id === id) return { ...l, ...updates };
        // If setting a new default, unset others
        if (updates.is_default === 1) return { ...l, is_default: 0 };
        return l;
      })
    );

    const res = await fetch(`/api/locations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!res.ok) await fetchLocations();
  };

  const deleteLocation = async (id: number) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));

    const res = await fetch(`/api/locations/${id}`, { method: "DELETE" });
    if (!res.ok) await fetchLocations();
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
