export interface AiRecord {
  date: string;
  plant: string;
  model: string;
  units_produced: number;
  defects: number;
  utilization: number;
  downtime: number;
  stock: number;
  threshold: number;
  supplier: string;
  lead_time: number;
  temperature: number;
  vibration: number;
  health_score: number;
  shipment_status: "On Time" | "Delayed" | "Delivered";
  delay_risk: number;
  delivery_time: number;
  units_sold: number;
  forecast: number;
  region: string;
  cost: number;
  revenue: number;
  profit_margin: number;
}

const plants = ["Detroit", "Munich", "Shanghai", "Monterrey", "Chennai"];
const models = ["Sedan X1", "SUV Pro", "Truck XL", "EV Nova", "Coupe GT"];
const suppliers = ["Bosch", "Denso", "Continental", "Magna", "Aisin", "ZF", "Lear Corp"];
const regions = ["North America", "Europe", "Asia Pacific", "Latin America", "MEA"];
const shipStatuses: AiRecord["shipment_status"][] = ["On Time", "Delayed", "Delivered"];

const seed = (n: number) => Math.abs(Math.sin(n * 9301 + 49297) * 233280) % 1;

export const aiDataset: AiRecord[] = Array.from({ length: 120 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - 119 + i);
  const dateStr = d.toISOString().split("T")[0];
  const s = (offset = 0) => seed(i + offset);

  const units_produced = Math.floor(350 + s(0) * 250 + i * 0.4);
  const defects = Math.floor(units_produced * (0.005 + s(1) * 0.025));
  const utilization = 70 + s(2) * 28;
  const downtime = Math.floor(s(3) * 4);
  const stock = Math.floor(100 + s(4) * 900);
  const threshold = 150;
  const temperature = 60 + s(5) * 40;
  const vibration = parseFloat((0.1 + s(6) * 2.5).toFixed(2));
  const health_score = parseFloat((60 + s(7) * 38).toFixed(1));
  const lead_time = Math.floor(3 + s(8) * 10);
  const delay_risk = parseFloat((s(9) * 100).toFixed(1));
  const delivery_time = Math.floor(2 + s(10) * 8);
  const units_sold = Math.floor(units_produced * (0.8 + s(11) * 0.18));
  const forecast = Math.floor(380 + i * 0.5 + s(12) * 100);
  const cost = Math.floor(50000 + s(13) * 30000);
  const revenue = Math.floor(cost * (1.15 + s(14) * 0.35));
  const profit_margin = parseFloat(((revenue - cost) / revenue * 100).toFixed(1));

  return {
    date: dateStr,
    plant: plants[i % plants.length],
    model: models[i % models.length],
    units_produced,
    defects,
    utilization: parseFloat(utilization.toFixed(1)),
    downtime,
    stock,
    threshold,
    supplier: suppliers[i % suppliers.length],
    lead_time,
    temperature: parseFloat(temperature.toFixed(1)),
    vibration,
    health_score,
    shipment_status: shipStatuses[i % shipStatuses.length],
    delay_risk,
    delivery_time,
    units_sold,
    forecast,
    region: regions[i % regions.length],
    cost,
    revenue,
    profit_margin
  };
});

export const ATTRIBUTE_GROUPS = {
  Production: [
    { key: "units_produced", label: "Units Produced" },
    { key: "defects", label: "Defects" },
    { key: "utilization", label: "Utilization %" },
    { key: "downtime", label: "Downtime (hrs)" }
  ],
  Inventory: [
    { key: "stock", label: "Stock Level" },
    { key: "threshold", label: "Min Threshold" },
    { key: "supplier", label: "Supplier" },
    { key: "lead_time", label: "Lead Time (days)" }
  ],
  Machines: [
    { key: "temperature", label: "Temperature (°C)" },
    { key: "vibration", label: "Vibration (g)" },
    { key: "health_score", label: "Health Score" }
  ],
  "Supply Chain": [
    { key: "shipment_status", label: "Shipment Status" },
    { key: "delay_risk", label: "Delay Risk %" },
    { key: "delivery_time", label: "Delivery Time (days)" }
  ],
  Sales: [
    { key: "units_sold", label: "Units Sold" },
    { key: "forecast", label: "Forecast" },
    { key: "region", label: "Region" }
  ],
  Financial: [
    { key: "cost", label: "Cost ($)" },
    { key: "revenue", label: "Revenue ($)" },
    { key: "profit_margin", label: "Profit Margin %" }
  ]
} as const;

export type AttributeKey = string;
