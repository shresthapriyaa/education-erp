"use client";

import { useState } from "react";

export function useResultFilters() {
  const [filters, setFilters] = useState<{ search?: string }>({});

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return { filters, updateFilter };
}