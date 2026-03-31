import React, { useState } from "react";
import { PageWrapper } from "@/components/PageWrapper";
import { StockLevelsChart } from "@/components/charts/StockChart";
import { InventoryTable } from "@/components/InventoryTable";
import { initialInventory } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Package, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Inventory() {
  const [inventory] = useState(initialInventory);
  
  const criticalItems = inventory.filter(i => i.status === "Critical").length;
  const lowItems = inventory.filter(i => i.status === "Low").length;
  const totalItems = inventory.length;

  return (
    <PageWrapper className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Parts, stock levels, and automated reorder alerts.</p>
        </div>
        <Button variant="default" data-testid="button-sync-inventory">
          <RefreshCw className="mr-2 h-4 w-4" /> Sync ERP
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Parts Tracked</p>
              <p className="text-2xl font-bold">{totalItems}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-900/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-500">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-500">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-500">{lowItems}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-900/10">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-500">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-rose-600 dark:text-rose-500">Critical Shortages</p>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-500">{criticalItems}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <StockLevelsChart />
        </div>
        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Parts Directory</CardTitle>
              <CardDescription>Comprehensive list of all tracked parts in the warehouse.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <InventoryTable parts={inventory} />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
