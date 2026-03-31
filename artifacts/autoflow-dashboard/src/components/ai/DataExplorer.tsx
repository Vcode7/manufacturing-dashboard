import { ATTRIBUTE_GROUPS } from "@/lib/aiDataset";
import { cn } from "@/lib/utils";

interface DataExplorerProps {
  selected: string[];
  onToggle: (key: string) => void;
}

export function DataExplorer({ selected, onToggle }: DataExplorerProps) {
  return (
    <div className="flex flex-col gap-5 h-full">
      <div>
        <h2 className="text-base font-semibold text-foreground">Data Explorer</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Select attributes or use them in your prompt</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 pr-1">
        {Object.entries(ATTRIBUTE_GROUPS).map(([group, attrs]) => (
          <div key={group}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group}</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {attrs.map((attr) => {
                const isSelected = selected.includes(attr.key);
                return (
                  <button
                    key={attr.key}
                    onClick={() => onToggle(attr.key)}
                    data-testid={`chip-${attr.key}`}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-150 border",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-muted/60 text-muted-foreground border-border hover:border-primary/50 hover:text-foreground hover:bg-muted"
                    )}
                  >
                    {attr.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="border-t border-border pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-foreground">Selected ({selected.length})</span>
            <button
              onClick={() => selected.forEach(s => onToggle(s))}
              className="text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-1">
            {selected.map(k => {
              const found = Object.values(ATTRIBUTE_GROUPS)
                .flat()
                .find(a => a.key === k);
              return (
                <span
                  key={k}
                  className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium"
                >
                  {found?.label ?? k}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
