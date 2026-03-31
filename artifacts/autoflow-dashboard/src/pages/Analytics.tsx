import React from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { DemandForecastChart, RegionalSalesChart } from "@/components/charts/DemandChart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { TrendingUp, Users, Target, BarChart2 } from "lucide-react";

export default function Analytics() {
  return (
    <PageWrapper className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Analytics</h1>
        <p className="text-muted-foreground">Demand forecasting, sales distribution, and revenue trends.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">YoY Growth</h3>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="mt-2 text-3xl font-bold">+14.2%</div>
            <p className="text-xs text-muted-foreground mt-1">Compared to last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Market Share</h3>
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-2 text-3xl font-bold">18.5%</div>
            <p className="text-xs text-muted-foreground mt-1">Global automotive sector</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">New Customers</h3>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="mt-2 text-3xl font-bold">+2,405</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-y-0 pb-2">
              <h3 className="tracking-tight text-sm font-medium text-muted-foreground">Conversion</h3>
              <BarChart2 className="h-4 w-4 text-amber-500" />
            </div>
            <div className="mt-2 text-3xl font-bold">4.3%</div>
            <p className="text-xs text-muted-foreground mt-1">Lead to sale ratio</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <DemandForecastChart />
        </div>
        
        <RegionalSalesChart />
        
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Models</CardTitle>
            <CardDescription>Sales volume by vehicle model line</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-4">
              <div className="flex items-center">
                <div className="w-1/3 text-sm font-medium truncate">Model X-SUV</div>
                <div className="w-2/3 flex items-center gap-2">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[85%]" />
                  </div>
                  <span className="text-sm font-bold w-12 text-right">85k</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/3 text-sm font-medium truncate">EcoSedan</div>
                <div className="w-2/3 flex items-center gap-2">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[65%]" />
                  </div>
                  <span className="text-sm font-bold w-12 text-right">65k</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/3 text-sm font-medium truncate">ProTruck HD</div>
                <div className="w-2/3 flex items-center gap-2">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[45%]" />
                  </div>
                  <span className="text-sm font-bold w-12 text-right">45k</span>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-1/3 text-sm font-medium truncate">CityCompact</div>
                <div className="w-2/3 flex items-center gap-2">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-[30%]" />
                  </div>
                  <span className="text-sm font-bold w-12 text-right">30k</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
