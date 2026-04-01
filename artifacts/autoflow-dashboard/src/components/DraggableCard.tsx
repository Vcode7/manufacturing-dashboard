import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DraggableCardProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  handleClassName?: string;
}

export function DraggableCard({ id, children, className, handleClassName }: DraggableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "opacity-80 ring-2 ring-primary/40 rounded-xl shadow-2xl scale-[1.02]",
        className
      )}
    >
      {/* Drag handle — appears on hover */}
      <button
        {...attributes}
        {...listeners}
        className={cn(
          "absolute top-2 right-2 z-20 p-1 rounded cursor-grab active:cursor-grabbing",
          "opacity-0 group-hover:opacity-100 transition-opacity duration-150",
          "bg-background/80 border border-border shadow-sm text-muted-foreground hover:text-foreground",
          handleClassName
        )}
        aria-label="Drag to reorder"
        data-testid={`drag-handle-${id}`}
      >
        <GripVertical className="h-3.5 w-3.5" />
      </button>
      {children}
    </div>
  );
}

/** Overlay rendered during drag for visual feedback */
export function DraggableOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="opacity-90 rotate-1 scale-105 shadow-2xl pointer-events-none">
      {children}
    </div>
  );
}
