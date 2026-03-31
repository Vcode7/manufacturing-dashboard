import { Clock, ChevronRight, Trash2 } from "lucide-react";
import { ChartConfig } from "@/lib/promptParser";
import { cn } from "@/lib/utils";

export interface HistoryEntry {
  id: string;
  prompt: string;
  config: ChartConfig;
  timestamp: Date;
}

interface QueryHistoryProps {
  history: HistoryEntry[];
  onRestore: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
}

const TYPE_COLORS: Record<string, string> = {
  line: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  bar: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  area: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  pie: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
};

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function QueryHistory({ history, onRestore, onDelete }: QueryHistoryProps) {
  if (!history.length) return null;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Queries</span>
      </div>
      <div className="space-y-1.5">
        {history.map(entry => (
          <div
            key={entry.id}
            className={cn(
              "group flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2",
              "hover:border-primary/30 hover:bg-muted/50 transition-all duration-150"
            )}
          >
            <span className={cn(
              "text-xs font-semibold px-1.5 py-0.5 rounded shrink-0",
              TYPE_COLORS[entry.config.type]
            )}>
              {entry.config.type}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground truncate">{entry.prompt}</p>
              <p className="text-xs text-muted-foreground">{timeAgo(entry.timestamp)}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onDelete(entry.id)}
                className="p-1 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                data-testid={`button-delete-history-${entry.id}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
              <button
                onClick={() => onRestore(entry)}
                className="p-1 rounded hover:bg-primary/10 hover:text-primary text-muted-foreground transition-colors"
                data-testid={`button-restore-history-${entry.id}`}
              >
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
