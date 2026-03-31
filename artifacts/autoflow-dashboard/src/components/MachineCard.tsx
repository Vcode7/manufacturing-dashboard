import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Machine } from '@/lib/mockData';
import { motion } from 'framer-motion';
import { Activity, Thermometer, Wind, Zap } from 'lucide-react';
import { MachineGauge } from './charts/MachineGauge';

export function MachineCard({ machine, delay = 0 }: { machine: Machine; delay?: number }) {
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary";
  
  if (machine.status === "Running") {
    badgeVariant = "default";
  } else if (machine.status === "Error") {
    badgeVariant = "destructive";
  } else if (machine.status === "Maintenance") {
    badgeVariant = "outline";
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="overflow-hidden hover:shadow-md transition-shadow relative h-full">
        {machine.status === "Running" && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
        )}
        {machine.status === "Error" && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-400 to-rose-600" />
        )}
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            {machine.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            {machine.status === "Running" && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            )}
            <Badge variant={badgeVariant} className={machine.status === "Running" ? "bg-emerald-500 hover:bg-emerald-600 text-white" : ""}>{machine.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Thermometer className="h-4 w-4 shrink-0" />
                <span className="truncate">Temp: {machine.temperature.toFixed(1)}°C</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wind className="h-4 w-4 shrink-0" />
                <span className="truncate">Vib: {machine.vibration.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Zap className="h-4 w-4 text-amber-500 shrink-0" />
                <span className="truncate">Up: {machine.uptime.toFixed(1)}%</span>
              </div>
            </div>
            <div className="flex items-center justify-end -mt-4">
              <MachineGauge 
                value={Math.min(100, (machine.temperature / 120) * 100)} 
                title="Load" 
                color={machine.status === "Error" ? "hsl(var(--destructive))" : "hsl(var(--primary))"} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
