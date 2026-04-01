import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  delay?: number;
}

export function KPICard({ title, value, description, icon, trend, trendValue, delay = 0 }: KPICardProps) {
  const trendColor =
    trend === "up" ? "text-emerald-500" : trend === "down" ? "text-rose-500" : "text-muted-foreground";
  const trendArrow = trend === "up" ? "↑" : trend === "down" ? "↓" : "−";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="h-full"
    >
      <Card className={cn(
        "h-full card-premium card-accent group cursor-default",
        "border-l-[3px] border-l-primary/0 hover:border-l-primary transition-all duration-200"
      )}>
        {/* Subtle hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg pointer-events-none" />
        <CardContent className="p-4 relative z-10">
          {/* Title + icon row */}
          <div className="flex items-start justify-between mb-2">
            <p className="text-xs font-medium text-muted-foreground leading-tight">{title}</p>
            <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center text-primary shrink-0 ml-2">
              {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-3.5 w-3.5" }) : icon}
            </div>
          </div>

          {/* Value */}
          <div className="kpi-card-value flex items-baseline gap-1.5">
            <span className="text-2xl font-bold tracking-tight">{value}</span>
            {trendValue && (
              <span className={cn("text-[11px] font-semibold", trendColor)}>
                {trendArrow} {trendValue}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{description}</p>

          {/* Trend indicator bar */}
          {trend && trend !== "neutral" && (
            <div className="mt-2 h-0.5 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700",
                  trend === "up" ? "bg-emerald-500 w-[70%]" : "bg-rose-500 w-[30%]"
                )}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
