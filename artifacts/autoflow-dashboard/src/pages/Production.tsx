import React, { useState, useEffect } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { ProductionBarChart, ProductionTrendChart } from "@/components/charts/ProductionChart";
import { MachineCard } from "@/components/MachineCard";
import { initialMachines } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FilterPanel } from "@/components/FilterPanel";
import { useFilterPanel } from "@/hooks/useFilterPanel";

export default function Production() {
  const [machines, setMachines] = useState(initialMachines);
  const [utilization, setUtilization] = useState(87);
  const filterProps = useFilterPanel();

  useEffect(() => {
    const interval = setInterval(() => {
      setMachines((prev) =>
        prev.map((m) => ({
          ...m,
          temperature: m.status === "Running" ? m.temperature + (Math.random() * 2 - 1) : Math.max(20, m.temperature - 1),
          vibration: m.status === "Running" ? Math.max(0, m.vibration + (Math.random() * 0.4 - 0.2)) : 0,
        }))
      );
      setUtilization((prev) => Math.min(100, Math.max(0, prev + Math.random() * 2 - 1)));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const running = machines.filter((m) => m.status === "Running").length;

  return (
    <PageWrapper className="space-y-4 p-5">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Production Floor</h1>
          <p className="text-sm text-muted-foreground">Monitor assembly lines, output metrics, and machine health.</p>
        </div>
        <FilterPanel {...filterProps} />
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="card-premium md:col-span-2">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold">Overall Machine Utilization</CardTitle>
            <CardDescription className="text-xs">Current active workload across all assembly lines</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="flex items-end gap-3 mb-2">
              <span className="text-4xl font-bold text-primary">{utilization.toFixed(1)}%</span>
              <span className="text-xs text-muted-foreground pb-1">Target: 85%</span>
            </div>
            <Progress value={utilization} className="h-2" />
            <div className="flex justify-between text-[11px] text-muted-foreground mt-1">
              <span>0%</span><span>100%</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-3">
          <Card className="card-premium">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Running Lines</p>
              <p className="text-2xl font-bold">{running} <span className="text-sm font-normal text-muted-foreground">/ {machines.length}</span></p>
            </CardContent>
          </Card>
          <Card className="card-premium">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground font-medium mb-1">Daily Target Deficit</p>
              <p className="text-2xl font-bold text-amber-500">42 Units</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ProductionBarChart />
        <ProductionTrendChart />
      </div>

      {/* Machine grid */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold tracking-tight">Machine Status Grid</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {machines.map((machine, idx) => (
            <MachineCard key={machine.id} machine={machine} delay={0.05 * idx} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
