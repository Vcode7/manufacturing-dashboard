import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "dashboard-layout";

export type DashboardSection = {
  id: string;
  label: string;
};

const DEFAULT_KPI_ORDER: DashboardSection[] = [
  { id: "kpi-production", label: "Total Production" },
  { id: "kpi-defect", label: "Defect Rate" },
  { id: "kpi-inventory", label: "Inventory Health" },
  { id: "kpi-shipments", label: "Active Shipments" },
  { id: "kpi-revenue", label: "Daily Revenue" },
];

const DEFAULT_PANEL_ORDER: DashboardSection[] = [
  { id: "panel-production-chart", label: "Production Trend" },
  { id: "panel-machines", label: "Critical Machinery" },
];

interface DashboardLayout {
  kpiOrder: DashboardSection[];
  panelOrder: DashboardSection[];
}

function loadLayout(): DashboardLayout {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { kpiOrder: DEFAULT_KPI_ORDER, panelOrder: DEFAULT_PANEL_ORDER };
    const parsed = JSON.parse(raw) as DashboardLayout;
    // Merge in any new items not present in saved layout
    const mergedKpi = [
      ...parsed.kpiOrder,
      ...DEFAULT_KPI_ORDER.filter((d) => !parsed.kpiOrder.some((k) => k.id === d.id)),
    ];
    const mergedPanels = [
      ...parsed.panelOrder,
      ...DEFAULT_PANEL_ORDER.filter((d) => !parsed.panelOrder.some((k) => k.id === d.id)),
    ];
    return { kpiOrder: mergedKpi, panelOrder: mergedPanels };
  } catch {
    return { kpiOrder: DEFAULT_KPI_ORDER, panelOrder: DEFAULT_PANEL_ORDER };
  }
}

export function useDashboardLayout() {
  const [kpiOrder, setKpiOrderRaw] = useState<DashboardSection[]>(() => loadLayout().kpiOrder);
  const [panelOrder, setPanelOrderRaw] = useState<DashboardSection[]>(() => loadLayout().panelOrder);

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ kpiOrder, panelOrder }));
  }, [kpiOrder, panelOrder]);

  const setKpiOrder = useCallback((order: DashboardSection[]) => {
    setKpiOrderRaw(order);
  }, []);

  const setPanelOrder = useCallback((order: DashboardSection[]) => {
    setPanelOrderRaw(order);
  }, []);

  const resetLayout = useCallback(() => {
    setKpiOrderRaw(DEFAULT_KPI_ORDER);
    setPanelOrderRaw(DEFAULT_PANEL_ORDER);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { kpiOrder, panelOrder, setKpiOrder, setPanelOrder, resetLayout };
}
