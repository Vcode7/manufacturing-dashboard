import { aiDataset, AiRecord } from "./aiDataset";

export type ChartType = "line" | "bar" | "area" | "pie";

export interface ChartSeries {
  key: keyof AiRecord;
  label: string;
  color: string;
}

export interface ChartConfig {
  type: ChartType;
  title: string;
  description: string;
  xKey: keyof AiRecord;
  xLabel: string;
  series: ChartSeries[];
  data: Partial<AiRecord>[];
  insight: string;
  highlightedAttributes: string[];
}

const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))"
];

const KEYWORDS: Record<string, { keys: (keyof AiRecord)[]; label: string }> = {
  production: { keys: ["units_produced"], label: "Units Produced" },
  "units produced": { keys: ["units_produced"], label: "Units Produced" },
  defect: { keys: ["defects"], label: "Defects" },
  defects: { keys: ["defects"], label: "Defects" },
  utilization: { keys: ["utilization"], label: "Utilization %" },
  downtime: { keys: ["downtime"], label: "Downtime (hrs)" },
  stock: { keys: ["stock"], label: "Stock Level" },
  inventory: { keys: ["stock", "threshold"], label: "Inventory" },
  supplier: { keys: ["lead_time"], label: "Lead Time" },
  "lead time": { keys: ["lead_time"], label: "Lead Time (days)" },
  temperature: { keys: ["temperature"], label: "Temperature (°C)" },
  temp: { keys: ["temperature"], label: "Temperature (°C)" },
  vibration: { keys: ["vibration"], label: "Vibration (g)" },
  health: { keys: ["health_score"], label: "Health Score" },
  "health score": { keys: ["health_score"], label: "Health Score" },
  shipment: { keys: ["delay_risk", "delivery_time"], label: "Shipment Metrics" },
  delay: { keys: ["delay_risk"], label: "Delay Risk %" },
  "delivery time": { keys: ["delivery_time"], label: "Delivery Time" },
  sales: { keys: ["units_sold", "forecast"], label: "Sales vs Forecast" },
  "units sold": { keys: ["units_sold"], label: "Units Sold" },
  forecast: { keys: ["units_sold", "forecast"], label: "Sales vs Forecast" },
  revenue: { keys: ["revenue"], label: "Revenue" },
  cost: { keys: ["cost"], label: "Cost" },
  profit: { keys: ["profit_margin"], label: "Profit Margin %" },
  margin: { keys: ["profit_margin"], label: "Profit Margin %" },
  financial: { keys: ["cost", "revenue", "profit_margin"], label: "Financial" },
  machine: { keys: ["temperature", "vibration", "health_score"], label: "Machine Metrics" }
};

const CHART_TYPE_HINTS: Record<string, ChartType> = {
  trend: "line",
  over: "line",
  time: "line",
  history: "line",
  timeline: "line",
  compare: "bar",
  comparison: "bar",
  comparing: "bar",
  by: "bar",
  breakdown: "pie",
  distribution: "pie",
  share: "pie",
  portion: "pie",
  area: "area",
  cumulative: "area",
  volume: "area"
};

const DIMENSION_HINTS: Record<string, keyof AiRecord> = {
  time: "date",
  date: "date",
  daily: "date",
  plant: "plant",
  plants: "plant",
  model: "model",
  models: "model",
  region: "region",
  regions: "region",
  supplier: "supplier",
  suppliers: "supplier"
};

function detectMetrics(prompt: string): { keys: (keyof AiRecord)[]; labels: string[]; attrs: string[] } {
  const lower = prompt.toLowerCase();
  const foundKeys = new Set<keyof AiRecord>();
  const foundLabels: string[] = [];
  const foundAttrs: string[] = [];

  const sortedKeywords = Object.keys(KEYWORDS).sort((a, b) => b.length - a.length);
  for (const kw of sortedKeywords) {
    if (lower.includes(kw)) {
      const entry = KEYWORDS[kw];
      let added = false;
      for (const k of entry.keys) {
        if (!foundKeys.has(k)) {
          foundKeys.add(k);
          added = true;
        }
      }
      if (added) {
        foundLabels.push(entry.label);
        foundAttrs.push(...entry.keys);
      }
    }
  }

  return {
    keys: Array.from(foundKeys),
    labels: [...new Set(foundLabels)],
    attrs: [...new Set(foundAttrs)]
  };
}

function detectChartType(prompt: string, keys: (keyof AiRecord)[]): ChartType {
  const lower = prompt.toLowerCase();
  for (const [hint, type] of Object.entries(CHART_TYPE_HINTS)) {
    if (lower.includes(hint)) return type;
  }
  if (keys.length === 1 && (keys[0] === "region" || keys[0] === "plant" || keys[0] === "model")) {
    return "pie";
  }
  return "line";
}

function detectDimension(prompt: string): keyof AiRecord {
  const lower = prompt.toLowerCase();
  for (const [hint, dim] of Object.entries(DIMENSION_HINTS)) {
    if (lower.includes(hint)) return dim;
  }
  return "date";
}

function aggregateByDimension(
  data: AiRecord[],
  xKey: keyof AiRecord,
  yKeys: (keyof AiRecord)[]
): Record<string, Record<string, number>>[] {
  const grouped: Record<string, Record<string, number[]>> = {};
  for (const row of data) {
    const xVal = String(row[xKey]);
    if (!grouped[xVal]) grouped[xVal] = {};
    for (const k of yKeys) {
      if (!grouped[xVal][k]) grouped[xVal][k] = [];
      const v = row[k];
      if (typeof v === "number") grouped[xVal][k].push(v);
    }
  }
  return Object.entries(grouped)
    .map(([xVal, yCols]) => {
      const entry: Record<string, unknown> = { [xKey]: xVal };
      for (const [k, vals] of Object.entries(yCols)) {
        entry[k] = parseFloat((vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1));
      }
      return entry as Record<string, number>;
    })
    .slice(0, 30);
}

function generateInsight(config: ChartConfig): string {
  const { series, data, type } = config;
  if (!data.length || !series.length) return "No data available for this query.";
  const mainKey = series[0].key;
  const values = data.map(d => Number(d[mainKey] ?? 0)).filter(v => !isNaN(v));
  if (!values.length) return "Insufficient data to generate insight.";
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const last = values[values.length - 1];
  const first = values[0];
  const pctChange = first !== 0 ? (((last - first) / first) * 100).toFixed(1) : "0";
  const trend = Number(pctChange) > 0 ? "increased" : "decreased";

  if (type === "pie") {
    return `${series[0].label} shows regional/categorical spread with the highest value at ${max.toLocaleString()} and lowest at ${min.toLocaleString()}.`;
  }
  return `${series[0].label} ${trend} by ${Math.abs(Number(pctChange))}% over the selected period. Average: ${avg.toFixed(1)}, Peak: ${max.toLocaleString()}, Trough: ${min.toLocaleString()}.`;
}

export function parsePrompt(prompt: string): ChartConfig | null {
  const trimmed = prompt.trim();
  if (!trimmed) return null;

  const { keys, labels, attrs } = detectMetrics(trimmed);
  if (!keys.length) return null;

  const chartType = detectChartType(trimmed, keys);
  const xKey = detectDimension(trimmed);

  const numericKeys = keys.filter(k => {
    const sample = aiDataset[0][k];
    return typeof sample === "number";
  });

  if (!numericKeys.length) return null;

  const aggregated = aggregateByDimension(aiDataset, xKey, numericKeys);

  const series: ChartSeries[] = numericKeys.map((k, i) => ({
    key: k,
    label: KEYWORDS[k as string]?.label ?? String(k).replace(/_/g, " "),
    color: CHART_COLORS[i % CHART_COLORS.length]
  }));

  const title = labels.join(" vs ");
  const description = `${title} ${xKey === "date" ? "over time" : `by ${xKey}`}`;

  const config: ChartConfig = {
    type: chartType,
    title,
    description,
    xKey,
    xLabel: xKey === "date" ? "Date" : String(xKey).charAt(0).toUpperCase() + String(xKey).slice(1),
    series,
    data: aggregated as Partial<AiRecord>[],
    insight: "",
    highlightedAttributes: attrs
  };

  config.insight = generateInsight(config);
  return config;
}

export function suggestChartType(keys: (keyof AiRecord)[]): ChartType {
  if (keys.length >= 3) return "area";
  if (keys.length === 1) return "bar";
  return "line";
}
