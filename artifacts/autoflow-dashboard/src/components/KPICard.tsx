import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="h-full"
    >
      <Card className="h-full border-none shadow-sm bg-card hover:shadow-md transition-shadow relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <div className="text-3xl font-bold">{value}</div>
            {trendValue && (
              <span className={`text-sm font-medium ${
                trend === "up" ? "text-emerald-500" : trend === "down" ? "text-rose-500" : "text-muted-foreground"
              }`}>
                {trend === "up" ? "↑" : trend === "down" ? "↓" : "−"} {trendValue}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
