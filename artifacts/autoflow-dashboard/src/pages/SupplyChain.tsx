import React, { useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { ShipmentTable } from "@/components/ShipmentTable";
import { initialShipments } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Truck, MapPin, Navigation2, CheckCircle2 } from "lucide-react";

export default function SupplyChain() {
  const [shipments] = useState(initialShipments);
  
  const inTransit = shipments.filter(s => s.status === "In Transit").length;
  const delayed = shipments.filter(s => s.status === "Delayed").length;
  const delivered = shipments.filter(s => s.status === "Delivered").length;

  return (
    <PageWrapper className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Supply Chain Logistics</h1>
        <p className="text-muted-foreground">Track inbound raw materials and outbound vehicle shipments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Truck className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Active</p>
            <p className="text-2xl font-bold">{shipments.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <Navigation2 className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">In Transit</p>
            <p className="text-2xl font-bold">{inTransit}</p>
          </CardContent>
        </Card>
        <Card className="border-rose-200 dark:border-rose-900/50">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
              <MapPin className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-rose-500">Delayed</p>
            <p className="text-2xl font-bold text-rose-500">{delayed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Delivered Today</p>
            <p className="text-2xl font-bold">{delivered}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Global Route Map</CardTitle>
                <CardDescription>Live tracking of all major supply routes</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px] bg-muted/30 rounded-lg border border-dashed border-border flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-contain opacity-20 dark:invert"></div>
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <MapPin className="h-8 w-8 text-primary animate-bounce" />
                  <p className="text-sm font-medium text-muted-foreground">Interactive Map Integration Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Ledger</CardTitle>
              <CardDescription>Detailed manifest of all incoming and outgoing freight</CardDescription>
            </CardHeader>
            <CardContent>
              <ShipmentTable shipments={shipments} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
