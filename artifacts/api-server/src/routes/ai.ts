import { Router, type Request, type Response } from "express";
import Groq from "groq-sdk";

const router = Router();

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChartSeries {
  key: string;
  label: string;
  color: string;
}

interface ChartConfig {
  type: "line" | "bar" | "area" | "pie" | "scatter";
  title: string;
  description: string;
  xKey: string;
  xLabel: string;
  series: ChartSeries[];
  data: Record<string, unknown>[];
  insight: string;
  highlightedAttributes: string[];
}

// ─── Colors ───────────────────────────────────────────────────────────────────
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// ─── Local fallback multi-chart generator ─────────────────────────────────────
function generateLocalMultiCharts(
  prompt: string,
  dataset: Record<string, unknown>[]
): ChartConfig[] {
  if (!dataset?.length) return [];

  const lower = prompt.toLowerCase();
  const numericKeys = Object.keys(dataset[0]).filter(
    (k) => typeof dataset[0][k] === "number"
  );
  const dimKeys = ["date", "plant", "model", "region", "supplier"].filter(
    (k) => k in (dataset[0] || {})
  );

  // Detect explicitly requested chart type
  type ChartType = "line" | "bar" | "area" | "pie" | "scatter";
  let forcedType: ChartType | null = null;
  if (lower.includes("pie") || lower.includes("breakdown") || lower.includes("distribution")) forcedType = "pie";
  else if (lower.includes("bar") || lower.includes("compare") || lower.includes("comparison")) forcedType = "bar";
  else if (lower.includes("scatter")) forcedType = "scatter";
  else if (lower.includes("area") || lower.includes("cumulative")) forcedType = "area";
  else if (lower.includes("line") || lower.includes("trend") || lower.includes("over time")) forcedType = "line";

  // Determine relevant keys from prompt keywords
  const keywordMap: Record<string, string[]> = {
    production: ["units_produced", "defects"],
    defect: ["defects", "utilization"],
    inventory: ["stock", "threshold", "lead_time"],
    machine: ["temperature", "vibration", "health_score"],
    supply: ["delay_risk", "delivery_time", "lead_time"],
    revenue: ["revenue", "cost", "profit_margin"],
    sales: ["units_sold", "forecast"],
    temperature: ["temperature"],
    health: ["health_score"],
    utilization: ["utilization", "downtime"],
    financial: ["revenue", "cost", "profit_margin"],
    shipment: ["delay_risk", "delivery_time"],
  };

  let relevantKeys: string[] = [];
  for (const [kw, keys] of Object.entries(keywordMap)) {
    if (lower.includes(kw)) {
      relevantKeys.push(...keys);
    }
  }
  // dedup & filter to actual numeric keys
  relevantKeys = [...new Set(relevantKeys)].filter((k) => numericKeys.includes(k));
  if (!relevantKeys.length) relevantKeys = numericKeys.slice(0, 4);

  // Aggregate helper
  function aggregate(
    xKey: string,
    yKeys: string[],
    sliceLen = 30
  ): Record<string, unknown>[] {
    const grouped: Record<string, Record<string, number[]>> = {};
    for (const row of dataset) {
      const xVal = String(row[xKey] ?? "");
      if (!grouped[xVal]) grouped[xVal] = {};
      for (const k of yKeys) {
        if (!grouped[xVal][k]) grouped[xVal][k] = [];
        if (typeof row[k] === "number") grouped[xVal][k].push(row[k] as number);
      }
    }
    return Object.entries(grouped)
      .map(([xVal, yCols]) => {
        const entry: Record<string, unknown> = { [xKey]: xVal };
        for (const [k, vals] of Object.entries(yCols)) {
          entry[k] = vals.length
            ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))
            : 0;
        }
        return entry;
      })
      .slice(0, sliceLen);
  }

  const timeDim = dimKeys.includes("date") ? "date" : dimKeys[0] || "date";
  const catDim = dimKeys.find((k) => k !== "date") || "plant";

  function insight(yKey: string, data: Record<string, unknown>[]): string {
    const vals = data.map((d) => Number(d[yKey] ?? 0)).filter((v) => !isNaN(v));
    if (!vals.length) return "No data.";
    const avg = (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
    const max = Math.max(...vals);
    const pct = vals[0] !== 0 ? (((vals[vals.length - 1] - vals[0]) / vals[0]) * 100).toFixed(1) : "0";
    return `Average ${yKey.replace(/_/g, " ")}: ${avg}. Peak: ${max.toLocaleString()}. ${Number(pct) >= 0 ? "↑" : "↓"} ${Math.abs(Number(pct))}% over the period.`;
  }

  const charts: ChartConfig[] = [];

  // Chart 1: Line/Area chart — primary metrics over time
  const chart1Type = forcedType ?? "line";
  const c1Keys = relevantKeys.slice(0, 2);
  const c1Data = aggregate(timeDim, c1Keys, 30);
  charts.push({
    type: chart1Type === "pie" ? "area" : chart1Type,
    title: c1Keys.map((k) => k.replace(/_/g, " ")).join(" & ") + " over time",
    description: `Trend of ${c1Keys.map((k) => k.replace(/_/g, " ")).join(" and ")} by ${timeDim}`,
    xKey: timeDim,
    xLabel: "Date",
    series: c1Keys.map((k, i) => ({
      key: k,
      label: k.replace(/_/g, " "),
      color: CHART_COLORS[i % CHART_COLORS.length],
    })),
    data: c1Data,
    insight: insight(c1Keys[0], c1Data),
    highlightedAttributes: c1Keys,
  });

  // Chart 2: Bar chart — comparison by category
  const c2Keys = relevantKeys.slice(0, 2);
  const c2Data = aggregate(catDim, c2Keys, 10);
  charts.push({
    type: forcedType === "bar" ? "bar" : "bar",
    title: c2Keys.map((k) => k.replace(/_/g, " ")).join(" & ") + ` by ${catDim}`,
    description: `Comparative breakdown by ${catDim}`,
    xKey: catDim,
    xLabel: catDim.charAt(0).toUpperCase() + catDim.slice(1),
    series: c2Keys.map((k, i) => ({
      key: k,
      label: k.replace(/_/g, " "),
      color: CHART_COLORS[i % CHART_COLORS.length],
    })),
    data: c2Data,
    insight: insight(c2Keys[0], c2Data),
    highlightedAttributes: c2Keys,
  });

  // Chart 3: Pie — distribution of first key by category
  const c3Key = relevantKeys[0];
  const c3Data = aggregate(catDim, [c3Key], 8);
  charts.push({
    type: forcedType === "line" || forcedType === "area" || forcedType === "scatter" ? "area" : "pie",
    title: `${c3Key.replace(/_/g, " ")} distribution by ${catDim}`,
    description: `Share of ${c3Key.replace(/_/g, " ")} across ${catDim}s`,
    xKey: catDim,
    xLabel: catDim.charAt(0).toUpperCase() + catDim.slice(1),
    series: [{ key: c3Key, label: c3Key.replace(/_/g, " "), color: CHART_COLORS[0] }],
    data: c3Data,
    insight: insight(c3Key, c3Data),
    highlightedAttributes: [c3Key],
  });

  // Chart 4: Area chart — all relevant keys stacked view
  const c4Keys = relevantKeys.slice(0, 3);
  const c4Data = aggregate(timeDim, c4Keys, 30);
  charts.push({
    type: forcedType === "pie" ? "pie" : "area",
    title: "Multi-metric overview",
    description: `${c4Keys.map((k) => k.replace(/_/g, " ")).join(", ")} over time`,
    xKey: timeDim,
    xLabel: "Date",
    series: c4Keys.map((k, i) => ({
      key: k,
      label: k.replace(/_/g, " "),
      color: CHART_COLORS[i % CHART_COLORS.length],
    })),
    data: c4Data,
    insight: insight(c4Keys[0], c4Data),
    highlightedAttributes: c4Keys,
  });

  return charts;
}

// ─── Groq-powered chart generation ────────────────────────────────────────────
async function generateWithGroq(
  prompt: string,
  dataset: Record<string, unknown>[]
): Promise<ChartConfig[]> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not set");

  const groq = new Groq({ apiKey });

  // Build a slim sample for context (don't send 120 rows)
  const sample = dataset.slice(0, 5);
  const numericKeys = Object.keys(dataset[0] || {}).filter(
    (k) => typeof dataset[0][k] === "number"
  );
  const catKeys = Object.keys(dataset[0] || {}).filter(
    (k) => typeof dataset[0][k] === "string"
  );

  const systemPrompt = `You are a data visualization expert for an automobile manufacturing supply chain dashboard.
The dataset has these numeric fields: ${numericKeys.join(", ")}.
The dataset has these categorical/dimension fields: ${catKeys.join(", ")}.
Dates are available in the "date" field (YYYY-MM-DD).

Your task: given a user's analysis prompt, return EXACTLY 4 chart configurations as a JSON array.
Use diverse chart types: "line", "bar", "area", "pie". 
If the user specifies a chart type in their prompt, use that type for at least one chart.
Each chart must have:
- type: "line"|"bar"|"area"|"pie"
- title: descriptive string
- description: 1 sentence
- xKey: field name (use "date" for time-series, or a categorical field for comparisons)
- xLabel: human label for x axis
- series: array of { key: fieldName, label: string, color: "hsl(var(--chart-1))" through "--chart-5" }
- insight: 1 sentence insight about this data
- highlightedAttributes: array of field names used

Return ONLY valid JSON array with no markdown fences. No explanation.`;

  const userMsg = `Prompt: "${prompt}"\n\nData sample (first 5 rows):\n${JSON.stringify(sample, null, 2)}`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMsg },
    ],
    temperature: 0.3,
    max_tokens: 2048,
  });

  const raw = completion.choices[0]?.message?.content ?? "[]";
  let parsed: Omit<ChartConfig, "data">[];
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Try to extract JSON array from markdown fences
    const match = raw.match(/\[[\s\S]*\]/);
    parsed = match ? JSON.parse(match[0]) : [];
  }

  // Now hydrate each config with real aggregated data
  return parsed.slice(0, 4).map((cfg) => {
    const yKeys = (cfg.series || []).map((s: ChartSeries) => s.key);
    const xKey = cfg.xKey || "date";

    const grouped: Record<string, Record<string, number[]>> = {};
    for (const row of dataset) {
      const xVal = String(row[xKey] ?? "");
      if (!grouped[xVal]) grouped[xVal] = {};
      for (const k of yKeys) {
        if (!grouped[xVal][k]) grouped[xVal][k] = [];
        if (typeof row[k] === "number") grouped[xVal][k].push(row[k] as number);
      }
    }
    const data = Object.entries(grouped)
      .map(([xVal, yCols]) => {
        const entry: Record<string, unknown> = { [xKey]: xVal };
        for (const [k, vals] of Object.entries(yCols)) {
          entry[k] = vals.length
            ? parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1))
            : 0;
        }
        return entry;
      })
      .slice(0, 30);

    const coloredSeries = (cfg.series || []).map((s: ChartSeries, i: number) => ({
      ...s,
      color: CHART_COLORS[i % CHART_COLORS.length],
    }));

    return { ...cfg, series: coloredSeries, data, highlightedAttributes: yKeys };
  });
}

// ─── Route ────────────────────────────────────────────────────────────────────
router.post("/analyze", async (req: Request, res: Response) => {
  const { prompt, dataset } = req.body as {
    prompt: string;
    dataset: Record<string, unknown>[];
  };

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "prompt is required" });
    return;
  }

  if (!Array.isArray(dataset) || !dataset.length) {
    res.status(400).json({ error: "dataset array is required" });
    return;
  }

  try {
    let charts: ChartConfig[];
    if (process.env.GROQ_API_KEY) {
      charts = await generateWithGroq(prompt, dataset);
    } else {
      // Local deterministic multi-chart fallback
      charts = generateLocalMultiCharts(prompt, dataset);
    }
    res.json({ charts, source: process.env.GROQ_API_KEY ? "groq" : "local" });
  } catch (err) {
    console.error("AI analyze error:", err);
    // Always fall back to local generation on any error
    const charts = generateLocalMultiCharts(prompt, dataset);
    res.json({ charts, source: "local-fallback" });
  }
});

export default router;
