import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, RotateCcw, Calendar, Factory, Car, Globe, BarChart2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme";
import { FilterState } from "@/hooks/useFilterPanel";
import { cn } from "@/lib/utils";

const PLANTS = ["Detroit", "Munich", "Shanghai", "Monterrey", "Chennai"];
const MODELS = ["Sedan X1", "SUV Pro", "Truck XL", "EV Nova", "Coupe GT"];
const REGIONS = ["North America", "Europe", "Asia Pacific", "Latin America", "MEA"];
const METRICS = ["Production", "Defects", "Utilization", "Revenue", "Stock Levels", "Delay Risk"];

interface FilterPanelProps {
  filters: FilterState;
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void;
  toggleArrayFilter: (key: "plants" | "models" | "regions" | "metrics", value: string) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}

function ChipGroup({
  label,
  icon: Icon,
  items,
  selected,
  onToggle,
}: {
  label: string;
  icon: React.ElementType;
  items: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => {
          const active = selected.includes(item);
          return (
            <button
              key={item}
              onClick={() => onToggle(item)}
              className={cn(
                "inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-all duration-150 font-medium",
                active
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              )}
            >
              {active && <Check className="h-2.5 w-2.5" />}
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FilterPanel({ filters, updateFilter, toggleArrayFilter, resetFilters, hasActiveFilters }: FilterPanelProps) {
  const { filterPanelOpen, setFilterPanelOpen } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFilterPanelOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setFilterPanelOpen]);

  return (
    <>
      {/* Toggle button — shown inline in page headers */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setFilterPanelOpen(!filterPanelOpen)}
        className={cn(
          "gap-1.5 h-8 text-xs shrink-0 transition-colors duration-150",
          filterPanelOpen && "bg-primary/10 border-primary/40 text-primary",
          hasActiveFilters && !filterPanelOpen && "border-primary/60 text-primary"
        )}
        data-testid="button-toggle-filters"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filters
        {hasActiveFilters && (
          <span className="ml-0.5 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
            •
          </span>
        )}
      </Button>

      {/* Backdrop */}
      <AnimatePresence>
        {filterPanelOpen && (
          <motion.div
            key="filter-backdrop"
            className="filter-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setFilterPanelOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {filterPanelOpen && (
          <motion.div
            ref={panelRef}
            key="filter-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 380, damping: 36, mass: 0.8 }}
            className="fixed right-0 top-12 bottom-0 w-[280px] bg-card border-l border-border shadow-2xl z-50 flex flex-col"
            data-testid="filter-panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Filters</h3>
                {hasActiveFilters && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-semibold">
                    Active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground"
                    onClick={resetFilters}
                    data-testid="button-reset-filters"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setFilterPanelOpen(false)}
                  data-testid="button-close-filters"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Date Range */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Calendar className="h-3.5 w-3.5" />
                  Date Range
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground font-medium">From</label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => updateFilter("dateFrom", e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      data-testid="filter-date-from"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-muted-foreground font-medium">To</label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => updateFilter("dateTo", e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      data-testid="filter-date-to"
                    />
                  </div>
                </div>
                {/* Quick presets */}
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { label: "7D", days: 7 },
                    { label: "30D", days: 30 },
                    { label: "90D", days: 90 },
                  ].map(({ label, days }) => {
                    const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
                    const to = new Date().toISOString().split("T")[0];
                    const active = filters.dateFrom === from && filters.dateTo === to;
                    return (
                      <button
                        key={label}
                        onClick={() => { updateFilter("dateFrom", from); updateFilter("dateTo", to); }}
                        className={cn(
                          "text-[11px] px-2 py-0.5 rounded border font-medium transition-colors",
                          active ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-border" />

              <ChipGroup
                label="Plants"
                icon={Factory}
                items={PLANTS}
                selected={filters.plants}
                onToggle={(v) => toggleArrayFilter("plants", v)}
              />

              <div className="h-px bg-border" />

              <ChipGroup
                label="Models"
                icon={Car}
                items={MODELS}
                selected={filters.models}
                onToggle={(v) => toggleArrayFilter("models", v)}
              />

              <div className="h-px bg-border" />

              <ChipGroup
                label="Regions"
                icon={Globe}
                items={REGIONS}
                selected={filters.regions}
                onToggle={(v) => toggleArrayFilter("regions", v)}
              />

              <div className="h-px bg-border" />

              <ChipGroup
                label="Metrics"
                icon={BarChart2}
                items={METRICS}
                selected={filters.metrics}
                onToggle={(v) => toggleArrayFilter("metrics", v)}
              />
            </div>

            {/* Footer */}
            <div className="border-t border-border px-4 py-3 bg-muted/20">
              <Button
                className="w-full h-8 text-xs"
                onClick={() => setFilterPanelOpen(false)}
                data-testid="button-apply-filters"
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
