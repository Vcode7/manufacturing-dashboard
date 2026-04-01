import React, { useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { ShipmentTable } from "@/components/ShipmentTable";
import { initialShipments } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Truck, MapPin, Navigation2, CheckCircle2 } from "lucide-react";
import { FilterPanel } from "@/components/FilterPanel";
import { useFilterPanel } from "@/hooks/useFilterPanel";

export default function SupplyChain() {
  const [shipments] = useState(initialShipments);
  const filterProps = useFilterPanel();

  const inTransit = shipments.filter((s) => s.status === "In Transit").length;
  const delayed = shipments.filter((s) => s.status === "Delayed").length;
  const delivered = shipments.filter((s) => s.status === "Delivered").length;

  const stats = [
    { label: "Total Active", value: shipments.length, icon: Truck, color: "text-primary", bg: "bg-primary/10" },
    { label: "In Transit", value: inTransit, icon: Navigation2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Delayed", value: delayed, icon: MapPin, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "Delivered Today", value: delivered, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <PageWrapper className="space-y-4 p-5">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Supply Chain Logistics</h1>
          <p className="text-sm text-muted-foreground">Track inbound materials and outbound vehicle shipments.</p>
        </div>
        <FilterPanel {...filterProps} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="card-premium card-accent">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-9 w-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Map */}
      <Card className="card-premium">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold">Global Route Map</CardTitle>
          <CardDescription className="text-xs">Live tracking of all major supply routes</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="w-full h-[200px] bg-muted/30 rounded-lg border border-dashed border-border flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-contain opacity-20 dark:invert" />
            <div className="relative z-10 flex flex-col items-center gap-2">
              <MapPin className="h-6 w-6 text-primary animate-bounce" />
              <p className="text-xs font-medium text-muted-foreground">Interactive Map Integration Pending</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="card-premium">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold">Shipment Ledger</CardTitle>
          <CardDescription className="text-xs">Detailed manifest of all incoming and outgoing freight</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <ShipmentTable shipments={shipments} />
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
