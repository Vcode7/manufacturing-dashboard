import React, { useState, useEffect } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { ProductionBarChart, ProductionTrendChart } from "@/components/charts/ProductionChart";
import { MachineCard } from "@/components/MachineCard";
import { initialMachines } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Production() {
  const [machines, setMachines] = useState(initialMachines);
  const [utilization, setUtilization] = useState(87);

  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prev => prev.map(m => ({
        ...m,
        temperature: m.status === 'Running' ? m.temperature + (Math.random() * 2 - 1) : Math.max(20, m.temperature - 1),
        vibration: m.status === 'Running' ? Math.max(0, m.vibration + (Math.random() * 0.4 - 0.2)) : 0
      })));
      
      setUtilization(prev => {
        const variation = Math.random() * 2 - 1;
        return Math.min(100, Math.max(0, prev + variation));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageWrapper className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Production Floor</h1>
        <p className="text-muted-foreground">Monitor assembly lines, output metrics, and machine health.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Overall Machine Utilization</CardTitle>
            <CardDescription>Current active workload across all assembly lines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
              <div className="text-5xl font-bold text-primary">{utilization.toFixed(1)}%</div>
              <Progress value={utilization} className="w-full h-4" />
              <div className="flex justify-between w-full text-sm text-muted-foreground">
                <span>0%</span>
                <span>Target: 85%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Running Lines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{machines.filter(m => m.status === 'Running').length} / {machines.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Daily Target Deficit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">42 Units</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductionBarChart />
        <ProductionTrendChart />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Machine Status Grid</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {machines.map((machine, idx) => (
            <MachineCard key={machine.id} machine={machine} delay={0.1 + (idx * 0.05)} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
