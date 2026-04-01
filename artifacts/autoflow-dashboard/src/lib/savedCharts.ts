import { ChartConfig } from "./promptParser";

const STORAGE_KEY = "ai-saved-charts";

export interface SavedChartSet {
  id: string;
  prompt: string;
  timestamp: string;
  charts: ChartConfig[];
  source: "groq" | "local" | "local-fallback";
}

export function getSavedChartSets(): SavedChartSet[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function savechartSet(set: SavedChartSet): void {
  const existing = getSavedChartSets();
  const updated = [set, ...existing].slice(0, 20); // keep latest 20 sets
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function deleteChartSet(id: string): void {
  const existing = getSavedChartSets();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.filter((s) => s.id !== id)));
}

export function clearAllChartSets(): void {
  localStorage.removeItem(STORAGE_KEY);
}
