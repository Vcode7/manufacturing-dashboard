import { useState, useCallback } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { ChartConfig } from "@/lib/promptParser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Lightbulb, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const TICK_STYLE = {
  fontSize: 11,
  fill: "hsl(var(--muted-foreground))"
};

const TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: "hsl(var(--card))",
    borderColor: "hsl(var(--border))",
    borderRadius: "8px",
    fontSize: "12px"
  }
};

const GRID_STYLE = {
  strokeDasharray: "3 3",
  vertical: false,
  stroke: "hsl(var(--border))"
};

interface GeneratedChartProps {
  config: ChartConfig;
  onSave?: (config: ChartConfig) => void;
}

function formatXTick(value: string, xKey: string) {
  if (xKey === "date" && value.length === 10) {
    return value.slice(5);
  }
  return value;
}

export function GeneratedChart({ config, onSave }: GeneratedChartProps) {
  const [showInsight, setShowInsight] = useState(false);
  const { type, title, description, xKey, series, data } = config;

  const handleDownload = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `${title.replace(/\s+/g, "_")}.json`;
    a.click();
  }, [data, title]);

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 10, right: 20, left: -10, bottom: 0 }
    };

    if (type === "pie") {
      const RADIAN = Math.PI / 180;
      const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, name }: {
        cx: number; cy: number; midAngle: number;
        innerRadius: number; outerRadius: number; value: number; name: string;
      }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
          <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11}>
            {`${value}`}
          </text>
        );
      };

      const pieData = data.slice(0, 10).map((d, i) => ({
        name: String(d[xKey] ?? `Item ${i + 1}`),
        value: Number(d[series[0]?.key] ?? 0)
      }));

      return (
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              labelLine={false}
              label={renderCustomLabel}
              animationBegin={0}
              animationDuration={800}
            >
              {pieData.map((_, i) => (
                <Cell key={`cell-${i}`} fill={`hsl(var(--chart-${(i % 5) + 1}))`} />
              ))}
            </Pie>
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      );
    }

    const xKeyStr = String(xKey);

    if (type === "bar") {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <BarChart {...commonProps}>
            <CartesianGrid {...GRID_STYLE} />
            <XAxis
              dataKey={xKeyStr}
              tickFormatter={v => formatXTick(String(v), xKeyStr)}
              tick={TICK_STYLE}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {series.map((s) => (
              <Bar
                key={String(s.key)}
                dataKey={String(s.key)}
                name={s.label}
                fill={s.color}
                radius={[4, 4, 0, 0]}
                animationDuration={800}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }

    if (type === "area") {
      return (
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart {...commonProps}>
            <defs>
              {series.map((s, i) => (
                <linearGradient key={String(s.key)} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={s.color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={s.color} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid {...GRID_STYLE} />
            <XAxis
              dataKey={xKeyStr}
              tickFormatter={v => formatXTick(String(v), xKeyStr)}
              tick={TICK_STYLE}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
            <Tooltip {...TOOLTIP_STYLE} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {series.map((s, i) => (
              <Area
                key={String(s.key)}
                type="monotone"
                dataKey={String(s.key)}
                name={s.label}
                stroke={s.color}
                strokeWidth={2}
                fill={`url(#grad-${i})`}
                dot={false}
                activeDot={{ r: 5 }}
                animationDuration={900}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={320}>
        <LineChart {...commonProps}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis
            dataKey={xKeyStr}
            tickFormatter={v => formatXTick(String(v), xKeyStr)}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
          />
          <YAxis tick={TICK_STYLE} tickLine={false} axisLine={false} />
          <Tooltip {...TOOLTIP_STYLE} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {series.map((s) => (
            <Line
              key={String(s.key)}
              type="monotone"
              dataKey={String(s.key)}
              name={s.label}
              stroke={s.color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5 }}
              animationDuration={900}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn(
                  "text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full",
                  type === "line" && "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
                  type === "bar" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
                  type === "area" && "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
                  type === "pie" && "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                )}>
                  {type} chart
                </span>
              </div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription className="text-xs mt-0.5">{description}</CardDescription>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSave?.(config)}
                className="h-7 text-xs"
                data-testid="button-save-chart"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
                className="h-7 text-xs gap-1"
                data-testid="button-download-chart"
              >
                <Download className="h-3 w-3" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {renderChart()}

          <div className="mt-4 border-t border-border pt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowInsight(v => !v)}
              className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
              data-testid="button-explain-chart"
            >
              <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
              Explain this chart
              {showInsight ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </Button>

            <AnimatePresence>
              {showInsight && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 flex items-start gap-2 rounded-lg bg-amber-50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-700/30 p-3">
                    <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                      {config.insight}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
