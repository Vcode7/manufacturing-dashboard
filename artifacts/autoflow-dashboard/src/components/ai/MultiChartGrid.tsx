import { motion, AnimatePresence } from "framer-motion";
import { ChartConfig } from "@/lib/promptParser";
import { GeneratedChart } from "./GeneratedChart";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, Trash2, Zap } from "lucide-react";

interface MultiChartGridProps {
  charts: ChartConfig[];
  source?: "groq" | "local" | "local-fallback";
  prompt: string;
  onSaveAll: () => void;
  onDismiss: () => void;
}

const sourceLabels: Record<string, string> = {
  groq: "Groq AI",
  local: "Local Engine",
  "local-fallback": "Local Fallback",
};

export function MultiChartGrid({ charts, source, prompt, onSaveAll, onDismiss }: MultiChartGridProps) {
  if (!charts.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col gap-4"
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {charts.length} charts generated
          </span>
          {source && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {sourceLabels[source] ?? source}
            </span>
          )}
          <span className="text-xs text-muted-foreground truncate max-w-[300px]">
            "{prompt}"
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveAll}
            className="h-7 text-xs gap-1.5"
            data-testid="button-save-all-charts"
          >
            <BookmarkPlus className="h-3.5 w-3.5" />
            Save All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-7 text-xs text-muted-foreground hover:text-destructive"
            data-testid="button-dismiss-charts"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Charts grid — 2 columns on large screens */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <AnimatePresence>
          {charts.map((chart, i) => (
            <motion.div
              key={`${chart.type}-${chart.title}-${i}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
            >
              <GeneratedChart config={chart} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
