import React from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, Target, BarChart2 } from "lucide-react";
import { DemandForecastChart, RegionalSalesChart } from "@/components/charts/DemandChart";
import { FilterPanel } from "@/components/FilterPanel";
import { useFilterPanel } from "@/hooks/useFilterPanel";

const stats = [
  { label: "YoY Growth", value: "+14.2%", sub: "vs. last year", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { label: "Market Share", value: "18.5%", sub: "Global automotive", icon: Target, color: "text-primary", bg: "bg-primary/10" },
  { label: "New Customers", value: "+2,405", sub: "Last 30 days", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Conversion", value: "4.3%", sub: "Lead to sale ratio", icon: BarChart2, color: "text-amber-500", bg: "bg-amber-500/10" },
];

const models = [
  { name: "Model X-SUV", units: "85k", pct: 85 },
  { name: "EcoSedan",    units: "65k", pct: 65 },
  { name: "ProTruck HD", units: "45k", pct: 45 },
  { name: "CityCompact", units: "30k", pct: 30 },
];

export default function Analytics() {
  const filterProps = useFilterPanel();

  return (
    <PageWrapper className="space-y-4 p-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Business Analytics</h1>
          <p className="text-sm text-muted-foreground">Demand forecasting, sales distribution, and revenue trends.</p>
        </div>
        <FilterPanel {...filterProps} />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="card-premium card-accent">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <div className={`h-7 w-7 rounded-lg ${s.bg} flex items-center justify-center`}>
                  <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-2">
          <DemandForecastChart />
        </div>
        <RegionalSalesChart />

        {/* Top Models */}
        <Card className="card-premium">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold">Top Performing Models</CardTitle>
            <CardDescription className="text-xs">Sales volume by vehicle model line</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-3">
            {models.map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <span className="text-xs font-medium text-muted-foreground w-24 shrink-0 truncate">{m.name}</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${m.pct}%` }}
                  />
                </div>
                <span className="text-xs font-bold w-8 text-right">{m.units}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
