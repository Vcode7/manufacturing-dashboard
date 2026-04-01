import { ChartConfig } from "./promptParser";
import { aiDataset } from "./aiDataset";

// In production (Vercel): VITE_API_BASE_URL = https://your-app.onrender.com/api
// In local dev: falls back to /api which Vite proxies to localhost:3000
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

export interface AnalyzeResponse {
  charts: ChartConfig[];
  source: "groq" | "local" | "local-fallback";
}

export async function analyzeWithGroq(prompt: string): Promise<AnalyzeResponse> {
  const response = await fetch(`${API_BASE}/ai/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      // Send a compact dataset: 30 rows is enough for the backend to aggregate
      dataset: aiDataset.slice(0, 30),
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`API error ${response.status}: ${errText}`);
  }

  const data = await response.json() as AnalyzeResponse;
  return data;
}
