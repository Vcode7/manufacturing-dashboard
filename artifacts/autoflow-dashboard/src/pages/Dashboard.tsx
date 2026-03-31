import React, { useEffect, useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { KPICard } from "@/components/KPICard";
import { Factory, PackageSearch, Truck, DollarSign, AlertTriangle } from "lucide-react";
import { ProductionTrendChart } from "@/components/charts/ProductionChart";
import { AlertsPanel } from "@/components/AlertsPanel";
import { initialAlerts, initialMachines } from "@/lib/mockData";
import { MachineCard } from "@/components/MachineCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [alerts, setAlerts] = useState(initialAlerts.slice(0, 5));
  const [machines, setMachines] = useState(initialMachines.slice(0, 4));

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setAlerts(prev => {
        const newAlert = { ...initialAlerts[Math.floor(Math.random() * initialAlerts.length)], id: `ALT-${Date.now()}`, timestamp: new Date().toISOString() };
        return [newAlert, ...prev.slice(0, 4)];
      });
      setMachines(prev => prev.map(m => ({
        ...m,
        temperature: m.temperature + (Math.random() * 2 - 1),
        vibration: Math.max(0, m.vibration + (Math.random() * 0.2 - 0.1))
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <PageWrapper className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Command center overview of plant operations.</p>
        </div>
        <Button variant="outline" data-testid="button-export-report">Export Report</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard 
          title="Total Production" 
          value="1,248" 
          description="Units assembled today" 
          icon={<Factory />} 
          trend="up" 
          trendValue="12%" 
          delay={0.1}
        />
        <KPICard 
          title="Defect Rate" 
          value="0.8%" 
          description="Below 1% target" 
          icon={<AlertTriangle />} 
          trend="down" 
          trendValue="0.2%" 
          delay={0.2}
        />
        <KPICard 
          title="Inventory Health" 
          value="94%" 
          description="Stock levels nominal" 
          icon={<PackageSearch />} 
          trend="up" 
          trendValue="3%" 
          delay={0.3}
        />
        <KPICard 
          title="Active Shipments" 
          value="45" 
          description="In transit" 
          icon={<Truck />} 
          trend="neutral" 
          delay={0.4}
        />
        <KPICard 
          title="Daily Revenue" 
          value="$2.4M" 
          description="Estimated gross" 
          icon={<DollarSign />} 
          trend="up" 
          trendValue="8%" 
          delay={0.5}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProductionTrendChart />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Critical Machinery</h2>
              <Button variant="link" size="sm">View All</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {machines.map((machine, idx) => (
                <MachineCard key={machine.id} machine={machine} delay={0.2 + (idx * 0.1)} />
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <AlertsPanel alerts={alerts} />
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Shift Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Morning Shift</span>
                    <span className="font-medium">100%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-full" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Afternoon Shift</span>
                    <span className="font-medium">85%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Night Shift</span>
                    <span className="font-medium">0%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-muted w-0" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
