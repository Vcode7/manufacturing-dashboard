import React, { useState, useEffect } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { MachineCard } from "@/components/MachineCard";
import { initialMachines } from "@/lib/mockData";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Machines() {
  const [machines, setMachines] = useState(initialMachines);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prev => prev.map(m => ({
        ...m,
        temperature: m.status === 'Running' ? m.temperature + (Math.random() * 2 - 1) : Math.max(20, m.temperature - 1),
        vibration: m.status === 'Running' ? Math.max(0, m.vibration + (Math.random() * 0.4 - 0.2)) : 0
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = machines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <PageWrapper className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Machine Monitoring</h1>
          <p className="text-muted-foreground">Real-time telemetry and health status for all assembly lines.</p>
        </div>
      </div>

      <div className="relative w-full sm:w-96">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search machines..." 
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((machine, idx) => (
          <MachineCard key={machine.id} machine={machine} delay={0.1 + (idx * 0.05)} />
        ))}
      </div>
    </PageWrapper>
  );
}
