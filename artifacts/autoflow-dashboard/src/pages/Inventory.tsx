import React, { useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { StockLevelsChart } from "@/components/charts/StockChart";
import { InventoryTable } from "@/components/InventoryTable";
import { initialInventory } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterPanel } from "@/components/FilterPanel";
import { useFilterPanel } from "@/hooks/useFilterPanel";

export default function Inventory() {
  const [inventory] = useState(initialInventory);
  const filterProps = useFilterPanel();

  const criticalItems = inventory.filter((i) => i.status === "Critical").length;
  const lowItems = inventory.filter((i) => i.status === "Low").length;
  const totalItems = inventory.length;

  return (
    <PageWrapper className="space-y-4 p-5">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-sm text-muted-foreground">Parts, stock levels, and automated reorder alerts.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs gap-1.5" data-testid="button-sync-inventory">
            <RefreshCw className="h-3.5 w-3.5" /> Sync ERP
          </Button>
          <FilterPanel {...filterProps} />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="card-premium card-accent">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Total Parts</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium border-amber-200 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-900/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">Low Stock</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{lowItems}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-premium border-rose-200 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-900/5">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">Critical Shortages</p>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{criticalItems}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart + table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <StockLevelsChart />
        </div>
        <div className="lg:col-span-2">
          <Card className="card-premium h-full flex flex-col">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold">Parts Directory</CardTitle>
              <CardDescription className="text-xs">All tracked parts in the warehouse.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 px-4 pb-4">
              <InventoryTable parts={inventory} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
