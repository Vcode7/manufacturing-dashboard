import { useState, useRef } from "react";
import { Sparkles, RotateCcw, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EXAMPLE_PROMPTS = [
  "Show production vs defects over time",
  "Compare inventory levels by plant",
  "Plot machine temperature trends",
  "Revenue vs cost over the last 90 days",
  "Defect rate and utilization trend",
  "Delay risk by supplier over time",
  "Compare units sold vs forecast by region",
  "Health score and vibration trends",
  "Profit margin breakdown over time"
];

interface PromptInputProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
  selectedAttributes: string[];
}

export function PromptInput({ onSubmit, isLoading, selectedAttributes }: PromptInputProps) {
  const [prompt, setPrompt] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    const final = prompt.trim();
    if (!final) return;
    onSubmit(final);
  };

  const handleExample = (example: string) => {
    setPrompt(example);
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const buildFromSelected = () => {
    if (!selectedAttributes.length) return;
    const attrStr = selectedAttributes.slice(0, 3).join(", ").replace(/_/g, " ");
    setPrompt(`Show ${attrStr} over time`);
    textareaRef.current?.focus();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <div
          className={cn(
            "rounded-xl border bg-card shadow-sm transition-shadow duration-200",
            "focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/60"
          )}
        >
          <div className="flex items-start gap-3 px-4 pt-4 pb-2">
            <Sparkles className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your manufacturing data... (e.g. 'Show production vs defects over time')"
              rows={3}
              data-testid="input-ai-prompt"
              className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none leading-relaxed"
            />
          </div>
          <div className="flex items-center justify-between px-4 pb-3 border-t border-border/50 pt-2 mt-1">
            <div className="flex items-center gap-2">
              {selectedAttributes.length > 0 && (
                <button
                  onClick={buildFromSelected}
                  className="text-xs text-primary hover:underline flex items-center gap-1"
                  data-testid="button-build-from-selected"
                >
                  <ChevronRight className="h-3 w-3" />
                  Use selected ({selectedAttributes.length})
                </button>
              )}
              {prompt && (
                <button
                  onClick={() => setPrompt("")}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                  data-testid="button-clear-prompt"
                >
                  <RotateCcw className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground hidden sm:block">Ctrl+Enter to generate</span>
              <Button
                onClick={handleSubmit}
                disabled={!prompt.trim() || isLoading}
                size="sm"
                className="gap-1.5"
                data-testid="button-generate-chart"
              >
                <Sparkles className="h-3.5 w-3.5" />
                {isLoading ? "Analyzing..." : "Generate Chart"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground mb-2">Try these prompts</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_PROMPTS.map(ex => (
            <button
              key={ex}
              onClick={() => handleExample(ex)}
              data-testid={`example-${ex.slice(0, 20).replace(/\s+/g, "-")}`}
              className={cn(
                "text-xs px-3 py-1.5 rounded-full border border-border bg-muted/40",
                "hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
                "transition-all duration-150 text-muted-foreground"
              )}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
