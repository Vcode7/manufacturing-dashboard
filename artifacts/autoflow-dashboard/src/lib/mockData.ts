export interface Part {
  id: string;
  name: string;
  category: string;
  stockLevel: number;
  minStock: number;
  maxStock: number;
  status: "OK" | "Low" | "Critical";
}

export interface Shipment {
  id: string;
  origin: string;
  destination: string;
  status: "In Transit" | "Delayed" | "Delivered" | "Processing";
  eta: string;
  weight: number;
  value: number;
}

export interface Machine {
  id: string;
  name: string;
  status: "Running" | "Idle" | "Maintenance" | "Error";
  temperature: number;
  vibration: number;
  uptime: number;
}

export interface Alert {
  id: string;
  timestamp: string;
  type: string;
  description: string;
  location: string;
  severity: "Critical" | "Warning" | "Info";
}

// Generate Inventory
const categories = ["Engine", "Transmission", "Brakes", "Electrical", "Body", "Interior", "Suspension"];
const partNames = ["Engine Block", "Piston Ring", "Timing Belt", "Gearbox Assembly", "Clutch Plate", "Brake Pad", "Brake Rotor", "Alternator", "Starter Motor", "Battery", "Headlight Assembly", "Door Panel", "Windshield", "Dashboard Frame", "Seat Assembly", "Shock Absorber", "Coil Spring"];

export const initialInventory: Part[] = Array.from({ length: 60 }).map((_, i) => {
  const stockLevel = Math.floor(Math.random() * 1000) + 10;
  const minStock = Math.floor(Math.random() * 200) + 50;
  const maxStock = minStock * 5;
  const status = stockLevel < minStock ? "Critical" : stockLevel < minStock * 1.5 ? "Low" : "OK";
  
  return {
    id: `PRT-${10000 + i}`,
    name: partNames[i % partNames.length] + ` Variant ${String.fromCharCode(65 + (i % 5))}`,
    category: categories[i % categories.length],
    stockLevel,
    minStock,
    maxStock,
    status
  };
});

// Generate Shipments
const origins = ["Bosch GmbH - Stuttgart", "Denso - Tokyo", "Continental - Hannover", "Magna - Regensburg", "Aisin - Aurora", "ZF - Kariya", "Lear Corp - Southfield"];
const destinations = ["Plant A - Detroit", "Plant B - Munich", "Plant C - Shanghai", "Plant D - Monterrey"];
const statuses: Shipment["status"][] = ["In Transit", "Delayed", "Delivered", "Processing"];

export const initialShipments: Shipment[] = Array.from({ length: 45 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + Math.floor(Math.random() * 14) - 2);
  return {
    id: `SHP-${80000 + i}`,
    origin: origins[i % origins.length],
    destination: destinations[i % destinations.length],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    eta: d.toISOString().split("T")[0],
    weight: Math.floor(Math.random() * 5000) + 500,
    value: Math.floor(Math.random() * 250000) + 10000
  };
});

// Generate Machines
export const initialMachines: Machine[] = Array.from({ length: 12 }).map((_, i) => {
  const statusRnd = Math.random();
  const status = statusRnd > 0.8 ? "Idle" : statusRnd > 0.9 ? "Maintenance" : statusRnd > 0.95 ? "Error" : "Running";
  
  return {
    id: `MAC-${i + 1}`,
    name: `Assembly Line ${String.fromCharCode(65 + i)}`,
    status,
    temperature: 60 + Math.floor(Math.random() * 35),
    vibration: 0.1 + Math.random() * 2.5,
    uptime: 85 + Math.random() * 14.9
  };
});

// Generate Alerts
const alertTypes = ["Temperature High", "Vibration Anomaly", "Low Stock", "Shipment Delay", "Sensor Error"];
export const initialAlerts: Alert[] = Array.from({ length: 25 }).map((_, i) => {
  const severityRnd = Math.random();
  const severity = severityRnd > 0.8 ? "Critical" : severityRnd > 0.5 ? "Warning" : "Info";
  const d = new Date();
  d.setMinutes(d.getMinutes() - Math.floor(Math.random() * 600));
  
  return {
    id: `ALT-${1000 + i}`,
    timestamp: d.toISOString(),
    type: alertTypes[i % alertTypes.length],
    description: `Automated alert triggered for ${alertTypes[i % alertTypes.length].toLowerCase()} conditions.`,
    location: `Zone ${Math.floor(Math.random() * 5) + 1}`,
    severity
  };
});

// Charts data
export const productionVsTarget = Array.from({ length: 30 }).map((_, i) => ({
  day: `Day ${i + 1}`,
  production: 400 + Math.floor(Math.random() * 150),
  target: 500
}));

export const dailyProductionTrend = Array.from({ length: 90 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - 90 + i);
  return {
    date: d.toISOString().split("T")[0],
    count: 350 + Math.floor(Math.random() * 200) + (i * 0.5)
  };
});

export const demandForecast = Array.from({ length: 12 }).map((_, i) => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return {
    month: months[i],
    projected: 5000 + (i * 200) + Math.floor(Math.random() * 500),
    actual: i < 6 ? 4800 + (i * 210) + Math.floor(Math.random() * 600) : null
  };
});

export const regionalSales = [
  { region: "North America", sales: 45000 },
  { region: "Europe", sales: 38000 },
  { region: "Asia Pacific", sales: 52000 },
  { region: "Latin America", sales: 15000 },
  { region: "MEA", sales: 12000 }
];
