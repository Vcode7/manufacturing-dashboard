import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Info, AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert } from "@/lib/mockData";

export function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <Card className="h-[400px] flex flex-col">
      <CardHeader className="py-4 border-b">
        <CardTitle className="text-base flex items-center justify-between">
          <span>Active Alerts</span>
          <Badge variant="secondary">{alerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {alerts.map((alert) => {
            const date = new Date(alert.timestamp);
            const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            let Icon = Info;
            let iconClass = "text-blue-500";
            let bgClass = "bg-blue-50 dark:bg-blue-900/20";
            
            if (alert.severity === "Critical") {
              Icon = AlertTriangle;
              iconClass = "text-rose-500";
              bgClass = "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800";
            } else if (alert.severity === "Warning") {
              Icon = AlertCircle;
              iconClass = "text-amber-500";
              bgClass = "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
            }

            return (
              <div key={alert.id} className={`p-3 rounded-lg border ${bgClass} flex gap-3`} data-testid={`alert-${alert.id}`}>
                <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${iconClass}`} />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${iconClass}`}>{alert.type}</p>
                    <span className="text-xs text-muted-foreground">{timeStr}</span>
                  </div>
                  <p className="text-xs text-foreground/80">{alert.description}</p>
                  <p className="text-xs font-mono text-muted-foreground">{alert.location}</p>
                </div>
              </div>
            );
          })}
          {alerts.length === 0 && (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              <p className="text-sm">No active alerts</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
