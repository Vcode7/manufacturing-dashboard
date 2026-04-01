import React, { useState, useEffect } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { MachineCard } from "@/components/MachineCard";
import { initialMachines } from "@/lib/mockData";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { FilterPanel } from "@/components/FilterPanel";
import { useFilterPanel } from "@/hooks/useFilterPanel";

export default function Machines() {
  const [machines, setMachines] = useState(initialMachines);
  const [search, setSearch] = useState("");
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
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = machines.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase())
  );

  const running = machines.filter((m) => m.status === "Running").length;
  const maintenance = machines.filter((m) => m.status === "Maintenance" || m.status === "Idle").length;
  const error = machines.filter((m) => m.status === "Error").length;

  return (
    <PageWrapper className="space-y-4 p-5">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Machine Monitoring</h1>
          <p className="text-sm text-muted-foreground">Real-time telemetry and health status for all assembly lines.</p>
        </div>
        <FilterPanel {...filterProps} />
      </div>

      {/* Quick stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Running", value: running, color: "text-emerald-500", dot: "bg-emerald-500" },
          { label: "Idle / Maint.", value: maintenance, color: "text-amber-500", dot: "bg-amber-500" },
          { label: "Error", value: error, color: "text-rose-500", dot: "bg-rose-500" },
        ].map((s) => (
          <Card key={s.label} className="card-premium">
            <CardContent className="p-3 flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${s.dot} animate-pulse`} />
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
              <span className={`text-lg font-bold ml-auto ${s.color}`}>{s.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-72">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
        <Input
          placeholder="Search machines..."
          className="pl-8 h-8 text-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Machine cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((machine, idx) => (
          <MachineCard key={machine.id} machine={machine} delay={0.05 * idx} />
        ))}
      </div>
    </PageWrapper>
  );
}
