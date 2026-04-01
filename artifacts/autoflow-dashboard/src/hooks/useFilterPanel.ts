import { useState, useCallback } from "react";

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  plants: string[];
  models: string[];
  regions: string[];
  metrics: string[];
}

const today = new Date().toISOString().split("T")[0];
const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

export const DEFAULT_FILTERS: FilterState = {
  dateFrom: thirtyDaysAgo,
  dateTo: today,
  plants: [],
  models: [],
  regions: [],
  metrics: [],
};

export function useFilterPanel() {
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });

  const updateFilter = useCallback(<K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleArrayFilter = useCallback((key: "plants" | "models" | "regions" | "metrics", value: string) => {
    setFilters((prev) => {
      const arr = prev[key];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ ...DEFAULT_FILTERS });
  }, []);

  const hasActiveFilters =
    filters.plants.length > 0 ||
    filters.models.length > 0 ||
    filters.regions.length > 0 ||
    filters.metrics.length > 0 ||
    filters.dateFrom !== thirtyDaysAgo ||
    filters.dateTo !== today;

  return { filters, updateFilter, toggleArrayFilter, resetFilters, hasActiveFilters };
}
