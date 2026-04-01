import React, { useEffect, useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  arrayMove,
  rectSortingStrategy,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PageWrapper } from "@/components/PageWrapper";
import { KPICard } from "@/components/KPICard";
import { DraggableCard, DraggableOverlay } from "@/components/DraggableCard";
import { Factory, PackageSearch, Truck, DollarSign, AlertTriangle, RotateCcw } from "lucide-react";
import { ProductionTrendChart } from "@/components/charts/ProductionChart";
import { AlertsPanel } from "@/components/AlertsPanel";
import { initialAlerts, initialMachines } from "@/lib/mockData";
import { MachineCard } from "@/components/MachineCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDashboardLayout } from "@/hooks/useDashboardLayout";
import { FilterPanel } from "@/components/FilterPanel";
import { useFilterPanel } from "@/hooks/useFilterPanel";

const KPI_CARDS: Record<string, React.ReactNode> = {
  "kpi-production": (
    <KPICard title="Total Production" value="1,248" description="Units assembled today" icon={<Factory />} trend="up" trendValue="12%" />
  ),
  "kpi-defect": (
    <KPICard title="Defect Rate" value="0.8%" description="Below 1% target" icon={<AlertTriangle />} trend="down" trendValue="0.2%" />
  ),
  "kpi-inventory": (
    <KPICard title="Inventory Health" value="94%" description="Stock levels nominal" icon={<PackageSearch />} trend="up" trendValue="3%" />
  ),
  "kpi-shipments": (
    <KPICard title="Active Shipments" value="45" description="In transit" icon={<Truck />} trend="neutral" />
  ),
  "kpi-revenue": (
    <KPICard title="Daily Revenue" value="$2.4M" description="Estimated gross" icon={<DollarSign />} trend="up" trendValue="8%" />
  ),
};

export default function Dashboard() {
  const [alerts, setAlerts] = useState(initialAlerts.slice(0, 5));
  const [machines, setMachines] = useState(initialMachines.slice(0, 4));
  const [activeId, setActiveId] = useState<string | null>(null);
  const filterProps = useFilterPanel();
  const { kpiOrder, panelOrder, setKpiOrder, setPanelOrder, resetLayout } = useDashboardLayout();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prev) => {
        const newAlert = {
          ...initialAlerts[Math.floor(Math.random() * initialAlerts.length)],
          id: `ALT-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        return [newAlert, ...prev.slice(0, 4)];
      });
      setMachines((prev) =>
        prev.map((m) => ({
          ...m,
          temperature: m.temperature + (Math.random() * 2 - 1),
          vibration: Math.max(0, m.vibration + (Math.random() * 0.2 - 0.1)),
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleKpiDragStart = useCallback((e: DragStartEvent) => setActiveId(String(e.active.id)), []);
  const handleKpiDragEnd = useCallback(
    (e: DragEndEvent) => {
      setActiveId(null);
      if (e.over && e.active.id !== e.over.id) {
        const oi = kpiOrder.findIndex((k) => k.id === e.active.id);
        const ni = kpiOrder.findIndex((k) => k.id === e.over!.id);
        setKpiOrder(arrayMove(kpiOrder, oi, ni));
      }
    },
    [kpiOrder, setKpiOrder]
  );
  const handlePanelDragEnd = useCallback(
    (e: DragEndEvent) => {
      if (e.over && e.active.id !== e.over.id) {
        const oi = panelOrder.findIndex((k) => k.id === e.active.id);
        const ni = panelOrder.findIndex((k) => k.id === e.over!.id);
        setPanelOrder(arrayMove(panelOrder, oi, ni));
      }
    },
    [panelOrder, setPanelOrder]
  );

  const renderPanel = (id: string) => {
    if (id === "panel-production-chart") return <ProductionTrendChart />;
    if (id === "panel-machines") {
      return (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Critical Machinery</h2>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs">View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {machines.map((machine, idx) => (
              <MachineCard key={machine.id} machine={machine} delay={0.1 * idx} />
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <PageWrapper className="space-y-4 p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Command center overview.{" "}
            <span className="text-xs text-muted-foreground/60">Drag cards to rearrange.</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetLayout}
            className="gap-1.5 h-8 text-xs text-muted-foreground hover:text-foreground"
            data-testid="button-reset-layout"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs" data-testid="button-export-report">
            Export
          </Button>
          <FilterPanel {...filterProps} />
        </div>
      </div>

      {/* KPI cards — drag & drop */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleKpiDragStart} onDragEnd={handleKpiDragEnd}>
        <SortableContext items={kpiOrder.map((k) => k.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {kpiOrder.map((kpi) => (
              <DraggableCard key={kpi.id} id={kpi.id} className="h-full">
                {KPI_CARDS[kpi.id]}
              </DraggableCard>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && KPI_CARDS[activeId] ? (
            <DraggableOverlay>{KPI_CARDS[activeId]}</DraggableOverlay>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Content panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handlePanelDragEnd}>
            <SortableContext items={panelOrder.map((p) => p.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {panelOrder.map((panel) => (
                  <DraggableCard key={panel.id} id={panel.id}>
                    {renderPanel(panel.id)}
                  </DraggableCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <AlertsPanel alerts={alerts} />

          <Card className="card-premium">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Shift Performance</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
              {[
                { label: "Morning Shift", pct: 100 },
                { label: "Afternoon Shift", pct: 85 },
                { label: "Night Shift", pct: 0 },
              ].map(({ label, pct }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-semibold">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
