import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, AlertCircle, BrainCircuit, Filter,
  BookmarkCheck, Trash2, Clock, ChevronDown, ChevronUp
} from "lucide-react";
import { DataExplorer } from "@/components/ai/DataExplorer";
import { PromptInput } from "@/components/ai/PromptInput";
import { GeneratedChart } from "@/components/ai/GeneratedChart";
import { MultiChartGrid } from "@/components/ai/MultiChartGrid";
import { QueryHistory, HistoryEntry } from "@/components/ai/QueryHistory";
import { ChartConfig } from "@/lib/promptParser";
import { analyzeWithGroq } from "@/lib/groqClient";
import { getSavedChartSets, savechartSet, deleteChartSet, clearAllChartSets, SavedChartSet } from "@/lib/savedCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SUGGESTIONS_FOR_UNCLEAR = [
  "Show production vs defects over time",
  "Compare inventory levels by plant",
  "Plot temperature and vibration trends",
  "Revenue vs cost over the last quarter",
];

export default function AIAnalysis() {
  const [selectedAttrs, setSelectedAttrs] = useState<string[]>([]);
  const [currentCharts, setCurrentCharts] = useState<ChartConfig[]>([]);
  const [currentSource, setCurrentSource] = useState<"groq" | "local" | "local-fallback">("local");
  const [lastPrompt, setLastPrompt] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterPlant, setFilterPlant] = useState("all");
  const [filterModel, setFilterModel] = useState("all");
  const [savedSets, setSavedSets] = useState<SavedChartSet[]>([]);
  const [showSaved, setShowSaved] = useState(true);

  // Load persisted saved chart sets on mount
  useEffect(() => {
    setSavedSets(getSavedChartSets());
  }, []);

  const handleToggleAttr = useCallback((key: string) => {
    setSelectedAttrs((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }, []);

  const handleSubmit = useCallback(async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    setLastPrompt(prompt);
    setCurrentCharts([]);

    try {
      const result = await analyzeWithGroq(prompt);
      if (!result.charts.length) {
        setError("unclear");
        setIsLoading(false);
        return;
      }
      setCurrentCharts(result.charts);
      setCurrentSource(result.source);

      // Add to history (use first chart config as the "entry config" for compatibility)
      const entry: HistoryEntry = {
        id: Date.now().toString(),
        prompt,
        config: result.charts[0],
        timestamp: new Date(),
      };
      setHistory((prev) => [entry, ...prev].slice(0, 10));
    } catch (err) {
      console.error("AI Analysis error:", err);
      setError("api");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveAll = useCallback(() => {
    if (!currentCharts.length) return;
    const set: SavedChartSet = {
      id: Date.now().toString(),
      prompt: lastPrompt,
      timestamp: new Date().toISOString(),
      charts: currentCharts,
      source: currentSource,
    };
    savechartSet(set);
    setSavedSets(getSavedChartSets());
    setCurrentCharts([]); // dismiss after save
  }, [currentCharts, lastPrompt, currentSource]);

  const handleDismiss = useCallback(() => {
    setCurrentCharts([]);
  }, []);

  const handleDeleteSet = useCallback((id: string) => {
    deleteChartSet(id);
    setSavedSets(getSavedChartSets());
  }, []);

  const handleClearAll = useCallback(() => {
    clearAllChartSets();
    setSavedSets([]);
  }, []);

  const handleRestoreHistory = useCallback((entry: HistoryEntry) => {
    setLastPrompt(entry.prompt);
  }, []);

  const handleDeleteHistory = useCallback((id: string) => {
    setHistory((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BrainCircuit className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-foreground">AI Analysis</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Ask questions about your manufacturing data — get 3–4 chart types instantly.
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
              {["Detroit", "Munich", "Shanghai", "Monterrey", "Chennai"].map((p) => (
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
              {["Sedan X1", "SUV Pro", "Truck XL", "EV Nova", "Coupe GT"].map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
        {/* Left: Data Explorer */}
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm min-h-[500px]">
          <DataExplorer selected={selectedAttrs} onToggle={handleToggleAttr} />
        </div>

        {/* Right: Prompt + Charts */}
        <div className="flex flex-col gap-5">
          <PromptInput
            onSubmit={handleSubmit}
            isLoading={isLoading}
            selectedAttributes={selectedAttrs}
          />

          <AnimatePresence mode="wait">
            {/* Loading */}
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
                      <p className="text-sm font-medium text-foreground">Generating charts...</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Running AI analysis — expecting 3–4 chart types
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Error: unclear prompt */}
            {!isLoading && error === "unclear" && (
              <motion.div
                key="error-unclear"
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
                          The prompt <span className="font-medium text-foreground">&ldquo;{lastPrompt}&rdquo;</span> didn&apos;t return results. Try being more specific.
                        </p>
                        <div className="mt-3">
                          <p className="text-xs font-medium text-muted-foreground mb-2">Try one of these:</p>
                          <div className="flex flex-wrap gap-2">
                            {SUGGESTIONS_FOR_UNCLEAR.map((s) => (
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

            {/* Error: API error */}
            {!isLoading && error === "api" && (
              <motion.div
                key="error-api"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <Card className="border-destructive/40">
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-foreground">API connection error</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Could not reach the backend at <code className="font-mono">localhost:3000</code>. Make sure the API server is running.
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-3 h-7 text-xs"
                          onClick={() => handleSubmit(lastPrompt)}
                        >
                          Retry
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Current charts multi-grid */}
            {!isLoading && currentCharts.length > 0 && !error && (
              <motion.div
                key="charts"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="flex items-center gap-2 px-1 mb-3">
                  <Sparkles className="h-3.5 w-3.5 text-primary shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    Interpreted as: <span className="font-medium text-foreground">{currentCharts[0]?.description}</span>
                  </p>
                </div>
                <MultiChartGrid
                  charts={currentCharts}
                  source={currentSource}
                  prompt={lastPrompt}
                  onSaveAll={handleSaveAll}
                  onDismiss={handleDismiss}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Saved Chart Sets ─────────────────────── */}
          {savedSets.length > 0 && (
            <div className="border border-border rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 bg-muted/40 hover:bg-muted/60 transition-colors"
                onClick={() => setShowSaved((v) => !v)}
                data-testid="button-toggle-saved"
              >
                <div className="flex items-center gap-2">
                  <BookmarkCheck className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">
                    Saved Analysis ({savedSets.length} sets)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-muted-foreground hover:text-destructive"
                    onClick={(e) => { e.stopPropagation(); handleClearAll(); }}
                    data-testid="button-clear-all-saved"
                  >
                    Clear all
                  </Button>
                  {showSaved ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              <AnimatePresence>
                {showSaved && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 flex flex-col gap-6">
                      {savedSets.map((set) => (
                        <div key={set.id} className="flex flex-col gap-3">
                          {/* Set header */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {new Date(set.timestamp).toLocaleString()}
                              </span>
                              <span className={cn(
                                "text-xs px-1.5 py-0.5 rounded-full font-medium",
                                set.source === "groq"
                                  ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                                  : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                              )}>
                                {set.source === "groq" ? "Groq AI" : "Local"}
                              </span>
                              <span className="text-xs font-medium text-foreground truncate max-w-[250px]">
                                "{set.prompt}"
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeleteSet(set.id)}
                              data-testid={`button-delete-set-${set.id}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                          {/* Charts grid */}
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                            {set.charts.map((chart, i) => (
                              <GeneratedChart key={`${set.id}-${i}`} config={chart} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <QueryHistory history={history} onRestore={handleRestoreHistory} onDelete={handleDeleteHistory} />
        </div>
      </div>
    </div>
  );
}
