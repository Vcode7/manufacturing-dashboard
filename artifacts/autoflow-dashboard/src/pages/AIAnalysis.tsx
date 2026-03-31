import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle, BrainCircuit, Filter } from "lucide-react";
import { DataExplorer } from "@/components/ai/DataExplorer";
import { PromptInput } from "@/components/ai/PromptInput";
import { GeneratedChart } from "@/components/ai/GeneratedChart";
import { QueryHistory, HistoryEntry } from "@/components/ai/QueryHistory";
import { parsePrompt, ChartConfig } from "@/lib/promptParser";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SUGGESTIONS_FOR_UNCLEAR = [
  "Show production vs defects over time",
  "Compare inventory levels by plant",
  "Plot temperature and vibration trends",
  "Revenue vs cost over the last quarter"
];

export default function AIAnalysis() {
  const [selectedAttrs, setSelectedAttrs] = useState<string[]>([]);
  const [currentConfig, setCurrentConfig] = useState<ChartConfig | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const [savedCharts, setSavedCharts] = useState<ChartConfig[]>([]);
  const [filterPlant, setFilterPlant] = useState("all");
  const [filterModel, setFilterModel] = useState("all");

  const handleToggleAttr = useCallback((key: string) => {
    setSelectedAttrs(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }, []);

  const handleSubmit = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setLastPrompt(prompt);

    await new Promise(r => setTimeout(r, 600));

    const config = parsePrompt(prompt);
    setIsLoading(false);

    if (!config) {
      setError("unclear");
      setCurrentConfig(null);
      return;
    }

    setCurrentConfig(config);
    setError(null);

    const entry: HistoryEntry = {
      id: Date.now().toString(),
      prompt,
      config,
      timestamp: new Date()
    };
    setHistory(prev => [entry, ...prev].slice(0, 10));
  }, []);

  const handleRestore = useCallback((entry: HistoryEntry) => {
    setCurrentConfig(entry.config);
    setLastPrompt(entry.prompt);
    setError(null);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setHistory(prev => prev.filter(e => e.id !== id));
  }, []);

  const handleSave = useCallback((config: ChartConfig) => {
    setSavedCharts(prev => {
      const already = prev.some(c => c.title === config.title && c.type === config.type);
      if (already) return prev;
      return [...prev, config];
    });
  }, []);

  const interpretedQuery = currentConfig
    ? `${currentConfig.title} ${currentConfig.xKey === "date" ? "over time" : `by ${currentConfig.xKey}`}`
    : null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">AI Analysis</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Ask questions about your manufacturing data and instantly get visual insights.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <Select value={filterPlant} onValueChange={setFilterPlant}>
            <SelectTrigger className="h-8 text-xs w-36" data-testid="select-filter-plant">
              <SelectValue placeholder="All Plants" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plants</SelectItem>
              {["Detroit", "Munich", "Shanghai", "Monterrey", "Chennai"].map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterModel} onValueChange={setFilterModel}>
            <SelectTrigger className="h-8 text-xs w-36" data-testid="select-filter-model">
              <SelectValue placeholder="All Models" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Models</SelectItem>
              {["Sedan X1", "SUV Pro", "Truck XL", "EV Nova", "Coupe GT"].map(m => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm min-h-[500px]">
          <DataExplorer selected={selectedAttrs} onToggle={handleToggleAttr} />
        </div>

        <div className="flex flex-col gap-5">
          <PromptInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
            selectedAttributes={selectedAttrs}
          />

          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Card>
                  <CardContent className="flex items-center gap-3 py-8">
                    <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Analyzing your query...</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Parsing metrics and generating chart</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!isLoading && error === "unclear" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-amber-300 dark:border-amber-700">
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">Could not interpret your query</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          The prompt <span className="font-medium text-foreground">&ldquo;{lastPrompt}&rdquo;</span> doesn&apos;t match any known metrics. Try being more specific.
                        </p>
                        <div className="mt-3">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Try one of these instead:</p>
                          <div className="flex flex-wrap gap-2">
                            {SUGGESTIONS_FOR_UNCLEAR.map(s => (
                              <button
                                key={s}
                                onClick={() => handleSubmit(s)}
                                className="text-xs px-2.5 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary border border-border transition-colors"
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!isLoading && currentConfig && !error && (
              <motion.div
                key="chart"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-3"
              >
                {interpretedQuery && (
                  <div className="flex items-center gap-2 px-1">
                    <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Interpreted as: <span className="font-medium text-foreground">{interpretedQuery}</span>
                    </p>
                    {currentConfig.highlightedAttributes.length > 0 && (
                      <div className="flex gap-1">
                        {currentConfig.highlightedAttributes.slice(0, 4).map(a => (
                          <span
                            key={a}
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium",
                              selectedAttrs.includes(a) && "ring-1 ring-primary"
                            )}
                          >
                            {a.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <GeneratedChart config={currentConfig} onSave={handleSave} />
              </motion.div>
            )}
          </AnimatePresence>

          {savedCharts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Saved Charts ({savedCharts.length})</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-muted-foreground hover:text-destructive"
                  onClick={() => setSavedCharts([])}
                  data-testid="button-clear-saved"
                >
                  Clear all
                </Button>
              </div>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {savedCharts.map((c, i) => (
                  <GeneratedChart key={`saved-${i}`} config={c} />
                ))}
              </div>
            </div>
          )}

          <QueryHistory history={history} onRestore={handleRestore} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}
